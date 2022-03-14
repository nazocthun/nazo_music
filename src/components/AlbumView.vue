<template>
  <div class="playlist" v-loading="loading">
    <div class="playlist-top-card">
      <div class="playlist-img-wrap">
        <img v-lazy="albumInfo.picUrl" alt="">
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
            <span class="plus" title="添加至待播列表" @click="addToQueue(scope.row,$event)">+</span>
          </template>
        </el-table-column>

        <el-table-column prop="dt" label="时长" width="100"></el-table-column>                            
      </el-table>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, watch, computed, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { albumAPI } from '@/utils/api'
import { albumInfo } from '@/utils/interfaces'
import { durationToTimeStamps, formatDate } from '@/utils/utils'
import usePlay from '@/hooks/usePlay'

export default defineComponent({
  name: 'AlbumView',
  setup(props, context) {
    const store = useStore()
    const musicQueue = computed(() => store.state.musicQueue)

    const tableData = ref([])
    function addToQueue(row: any, e: any) {
      console.log(row)
      let obj = {
        id:row.id,
        imgUrl:row.al.picUrl,
        duration:row.dt,
        // singer:row.ar[0].name,
        // artistId:row.ar[0].id,
        artistInfo:row.ar,
        songName:row.name
      }

      let ids = []
      for (const item of musicQueue.value) {
        ids.push(item.id)
      }
      if(ids.indexOf(obj.id) == -1){
        // this.beginAnimation(e.x,e.y)
        setTimeout(() => {
          store.commit('changeQueueStyle','add')      
          store.commit('changeMusicQueue',obj)  
        }, 500);
        setTimeout(() => {
          store.commit('changeQueueStyle','normal')                   
        }, 1000);
      }else{
        ElMessage({
          type: 'warning',
          message: "已经在播放列表中了",
          showClose: true
        })
      }            
    }

    
    const albumId = ref()
    const albumInfo = ref({} as albumInfo)
    const commentCount = ref()
    const artistName = ref()
    const loading = ref(true)
    const albumDescList = ref()

    function init() {
      albumAPI({id: albumId.value, realIP: '116.25.146.177'}).then(res => {
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

    const { play } = usePlay()
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
    watch(() => route, (newValue, _oldValue) => {
      albumId.value = newValue.params.id
      init()
      // this.getComments(true)

      setTimeout(() => {
        activeName.value = "first"
        loading.value = false
      }, 0)
    })
    onMounted(() => {
      albumId.value = route.query.id
      init()
      // this.getComments(true)
    })
    return {
      play,
      addToQueue,
      toArtist,
      toAlbum,
      activeName,
      artistName,
      albumInfo,
      tableData,
      loading,
    }
  }
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