<template>
  <div class="new-music max-w-7xl mx-auto p-5" v-loading="loading">
    <div class="w-full">
      <el-table :data="tableData" stripe style="width: 100%" @row-dblclick="doubleClickPlay">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column width="100">
          <template #default="scope">
            <div class="w-16 h-16 relative">
              <img class="absolute w-full h-full rounded-xl" :src="scope.row.picUrl" alt="">
              <div class="absolute justify-center items-center cursor-pointer w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 bg-white/80 text-orange-700 rounded-full"
                @click="play(scope.row, 'playbutton')">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="32" fill="currentColor" data-darkreader-inline-fill="" style="--darkreader-inline-fill:currentColor;"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm4.126-8.254c.213-.153.397-.348.54-.575.606-.965.365-2.27-.54-2.917L10.07 5.356A1.887 1.887 0 0 0 8.972 5C7.883 5 7 5.941 7 7.102v5.796c0 .417.116.824.334 1.17.607.965 1.832 1.222 2.737.576l4.055-2.898zm-5.2-4.616l4.055 2.898-4.056 2.897V7.13z"></path></svg>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="音乐标题" width="">
          <template #default="scope">
            <div class="inline-block text-gray-600">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="歌手" width="">
          <template #default="scope">
            <div class="inline-block" v-for="(artist, i) in scope.row.artists" :key="i">
              <span class="cursor-pointer text-sky-600" @click="toArtist(artist.id)">{{artist.name}}</span>
              <span class="text-gray-600" v-show="scope.row.artists.length != 1 && i!=scope.row.artists.length-1">
                &amp;&nbsp;
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="album" label="专辑" width="">
          <template #default="scope" class="flex ">
          <div class="flex justify-start items-center">
            <span class="flex-initial cursor-pointer text-sky-600 mr-auto" @click="toAlbum(scope.row.album.id)">{{scope.row.album.name}}</span>
            <span class="flex float-right mr-4 cursor-pointer" @click="addToQueue(scope.row, 'plus')">
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.5em" height="1.5em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M2 16h8v-2H2m16 0v-4h-2v4h-4v2h4v4h2v-4h4v-2m-8-8H2v2h12m0 2H2v2h12v-2Z"/></svg>
            </span>
          </div>
            
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时长" width="100"/>
      </el-table>
    </div>
  </div>
  
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getNewSongsAPI } from '@/utils/api'
import { ElMessage } from 'element-plus'
import { durationTimeFormat, getCompressedImgUrl } from '@/utils/utils'
import usePlay from '@/hooks/usePlay'
import { useStore } from 'vuex'
import { getNewMusic } from '@/api/getNewMusic'
let loading = ref(true)
const tableData = ref<Array<Music>>()

// API参数
let params = {
  type: 0,
  realIP: '116.25.146.177'
}

onMounted(() => { init() })

// 通过API获得最新歌曲信息
async function init() {
  loading.value = true
  tableData.value = await getNewMusic(params)
  loading.value = false
}

// 播放音乐Hook
const { play, doubleClickPlay, addToQueue } = usePlay('newMusic', ref(false))

const musicQueue = computed(() => store.state.musicQueue)
const store = useStore()

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
  .new-music :deep(.el-loading-spinner) {
    top: 50%;
  }
</style>