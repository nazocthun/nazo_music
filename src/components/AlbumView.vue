<template>
  <div class="playlist" v-loading="loading">
    <div class="playlist-top-card">
      <div class="playlist-img-wrap">
        <img :src="getCompressedImgUrl(albumInfo.picUrl, 500)" alt="">
      </div>
      <div class="playlist-info">
        <div class="playlist-name">
          <div class="tag1">专辑</div>{{albumInfo.name}}
        </div>
        <div class="playlist-user-info">
          <div class="playlist-user-name">歌手：{{artistName}}</div>
          <div class="playlist-user-name">时间：{{albumInfo.publishTime}}</div>
          <div class="playlist-user-name">共{{albumInfo.size}}首</div>
        </div>
        <div class="playAllBtn iconfont icon-play" @click="playAll"> 播放全部</div>
      </div>
    </div>
    <div class="songs-table">
      <el-table :data="tableData" stripe @row-dblclick="play">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="音乐标题" width=""></el-table-column>
        <el-table-column prop="artistInfo" label="歌手" width="">
          <template #default="scope">
            <div v-for="(singer,i) in scope.row.ar" :key="i" style="color:#2980b9;display:inline-block">
              <span style="cursor:pointer;" @click="toArtist(singer.id)">{{singer.name}}</span>
              <span style="color:#606266;" v-show="scope.row.ar.length != 1 && i!=scope.row.ar.length-1">
                &amp;&nbsp;
              </span>
            </div>
          </template>                                                                 
        </el-table-column>                          

        <el-table-column prop="al.name" label="专辑" >
          <template #default="scope">
            <span style="cursor:pointer;color:#2980b9;" @click="toAlbum(scope.row.al.id)">{{scope.row.al.name}}</span>
            <span class="plus" title="添加至待播列表" @click="addToQueue(scope.row, 'plus')">+</span>
          </template>
        </el-table-column>

        <el-table-column prop="dt" label="时长" width="100"></el-table-column>                            
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { albumAPI } from '@/utils/api'
import { albumInfoTypes } from '@/utils/interfaces'
import { durationToTimeStamps, formatDate, getCompressedImgUrl } from '@/utils/utils'
import usePlay from '@/hooks/usePlay'

const store = useStore()
const loading = ref(true)
const musicQueue = computed(() => store.state.musicQueue)



const albumId = ref()
onMounted(() => {
  albumId.value = route.query.id
  params.id = albumId.value
  getAlbumInfo(params)
  // this.getComments(true)
})

//API参数
let params = {
  id: 0,
  realIP: '116.25.146.177'
}

// 通过API获得Album数据
const albumInfo = ref({} as albumInfoTypes)
const commentCount = ref()
const artistName = ref()
const albumDescList = ref()
const tableData = ref([])
function getAlbumInfo(params: Object) {
  albumAPI(params).then( res => {
    albumInfo.value = res.data.album
    console.log(albumInfo.value)
    commentCount.value = albumInfo.value.info.commentCount
    artistName.value = res.data.album.artist.name
    albumInfo.value.publishTime = formatDate(new Date(albumInfo.value.publishTime))
    for(let item of res.data.songs){
      let duration = item.dt
      item.dt = durationToTimeStamps(duration)
    }
    tableData.value = res.data.songs
    let albumDesc = albumInfo.value.description
    albumDescList.value = albumDesc.split(/[\n]/)
  }).then(() => {
    setTimeout(() => {
      loading.value = false
    }, 500);
  })
}

// 播放音乐, 加入队列Hook
const { play, addToQueue } = usePlay('album', ref(false))

function playAll() { // TODO:

}

// 路由跳转
const route = useRoute()
const router = useRouter()
function toArtist(id: any) {
  console.log(id)
  router.push(`/artist?artistId=${id}`)
}
function toAlbum(id: any){
  console.log(id)
  router.push(`/album?id=${id}`)
}

const activeName = ref('first')


// 监视路由变化
watch(() => route, (newValue, _oldValue) => {
  albumId.value = newValue.params.id
  params.id = albumId.value
  getAlbumInfo(params)
  // this.getComments(true)

  setTimeout(() => {
    activeName.value = "first"
    loading.value = false
  }, 0)
})

</script>

<style>
  .playlist {
    max-width: 1300px;
    margin: 0 auto;
    padding: 20px;        
  }

  .playlist-top-card {
    display: flex;
    /* height: 300px; */
  }

  .playlist-img-wrap {
    width: 200px;
    height: 200px;
  }

  .playlist-img-wrap img {
    width: 100%;
    height: 100%;
  }
</style>