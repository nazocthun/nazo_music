<template>
  <div class="new-music" v-loading="loading">
    <div class="new-music-table">
      <el-table :data="tableData" stripe style="width: 100%" @row-dblclick="play">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column width="100">
          <template #default="scope">
            <div class="img-wrap">
              <img :src="scope.row.imgUrl" alt="">
              <p class="play-button" @click="play(scope.row)">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="32" fill="currentColor" data-darkreader-inline-fill="" style="--darkreader-inline-fill:currentColor;"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm4.126-8.254c.213-.153.397-.348.54-.575.606-.965.365-2.27-.54-2.917L10.07 5.356A1.887 1.887 0 0 0 8.972 5C7.883 5 7 5.941 7 7.102v5.796c0 .417.116.824.334 1.17.607.965 1.832 1.222 2.737.576l4.055-2.898zm-5.2-4.616l4.055 2.898-4.056 2.897V7.13z"></path></svg>
              </p>
            </div>
          </template>
        </el-table-column>     
        <!-- <el-table-column prop="id" label="Date" width="180" /> -->
        <el-table-column prop="name" label="音乐标题" width=""></el-table-column>

        <el-table-column label="歌手" width="">
          <template #default="scope">
            <div v-for="(artist, i) in scope.row.artistInfo" :key="i" style="color:#2980b9;display:inline-block">
                <span @click="toArtist(artist.id)" style="cursor:pointer;">{{artist.name}}</span>
                <span style="color:#606266;" v-show="scope.row.artistInfo.length != 1 && i!=scope.row.artistInfo.length-1">
                  &amp;&nbsp;
                </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="album" label="专辑" width="">
          <template #default="scope">
            <span style="cursor:pointer;color:#2980b9;" @click="toAlbum(scope.row.albumId)">{{scope.row.album}}</span>
            <span class="plus" title="添加至待播列表" @click="addToQueue(scope.row, 'plus')">+</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="100"/>
      </el-table>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNewSongsAPI } from '@/utils/api'
import { ElMessage } from 'element-plus'
import { durationToTimeStamps, getCompressedImgUrl } from '@/utils/utils'
import usePlay from '@/hooks/usePlay'
import { useStore } from 'vuex'

let loading = ref(true)
const tableData = ref([{}])

// API参数
let params = {
  type: 0,
  realIP: '116.25.146.177'
}

onMounted(() => { init() })

// 通过API获得最新歌曲信息
function init() {
  getNewSongsAPI(params).then(res => {
    let resultList = res.data.data.slice(0,50)
    console.log(resultList)
    let songsList = []
    for (const item of resultList) {
      let song = {
        id: item.id,
        name: item.name,
        artistInfo: item.artists,
        album: item.album.name,
        albumId: item.album.id,
        duration: durationToTimeStamps(item.duration),
        imgUrl: getCompressedImgUrl(item.album.picUrl, 100),
        url: item.mp3Url,
        cover: item.album.picUrl,
      }
      songsList.push(song)
    }
    tableData.value = songsList
    loading.value = false
  })
}

// 播放音乐Hook
const { play, addToQueue } = usePlay('newMusic', ref(false))

const musicQueue = computed(() => store.state.musicQueue)
const store = useStore()
// function addToQueue(row: any) {
//   console.log(row)
//   let obj = {
//     id:row.id,
//     imgUrl:row.imgUrl,
//     duration:row.duration,
//     // singer:row.ar[0].name,
//     // artistId:row.ar[0].id,
//     artistInfo:row.artistInfo,
//     songName:row.name
//   }
//   let ids = []
//   for (const item of musicQueue.value) {
//     ids.push(item.id)
//   }
//   if(ids.indexOf(obj.id) == -1){
//     // this.beginAnimation(e.x,e.y)
//     setTimeout(() => {
//       store.commit('changeQueueStyle','add')
//       store.commit('changeMusicQueue',obj)
//     }, 500)
//     setTimeout(() => {
//       store.commit('changeQueueStyle','normal')
//     }, 1000)
//   }else{
//     ElMessage({
//       type: 'warning',
//       message: "已经在播放列表中了",
//       showClose: true
//     })
//   }
// }

// 路由跳转
const router = useRouter()
function toArtist(id: any) {
  console.log(id)
  router.push(`/artist?artistId=${id}`)
}
function toAlbum(id: any){
  console.log(id)
  router.push(`/album?id=${id}`)
}
</script>

<style scoped>
  .new-music {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;
  }

  .new-music :deep(.el-loading-spinner) {
    top: 50%;
  }

  .new-music-table {
    width: 100%;
  }

  .img-wrap {
    width: 60px;
    height: 60px;
    position: relative;
  }

  .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .img-wrap p {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0;
    transform: translate(-50%,-50%);
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, .9);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #f08a5d;
    font-size: 14px;
    cursor: pointer;
  }
</style>