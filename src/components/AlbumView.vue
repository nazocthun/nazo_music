<template>
  <div class="album" v-loading="loading">
    <div class="flex">
      <div class="album-image-wrapper">
        <img class="album-image" :src="albumInfo.picUrl" alt="">
      </div>
      <div class="album-top">
        <div class="album-top-title">
          <div class="album-top-title-label">专辑</div>
          {{albumInfo.name}}
        </div>
        <div class="album-top-info">
          <div class="album-top-info-detail">歌手：{{artistName}}</div>
          <div class="album-top-info-detail">时间：{{albumInfo.publishTime}}</div>
          <div class="album-top-info-detail">共{{albumInfo.size}}首</div>
        </div>
        <div class="playall-button" @click="playAll"> 播放全部</div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="歌曲列表" name="music">
        <div class="music-table">
          <el-table :data="tableData" stripe @row-dblclick="doubleClickPlay">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="name" label="音乐标题" width=""></el-table-column>
            <el-table-column prop="artists" label="歌手" width="">
              <template #default="scope">
                <div class="music-table-artist" v-for="(artist ,i) in scope.row.artists" :key="i">
                  <span class="music-table-artist-name" @click="toArtist(artist.id)">{{artist.name}}</span>
                  <span class="music-table-artist-hyphen" v-show="scope.row.artists.length != 1 && i!=scope.row.artists.length-1">
                    &amp;&nbsp;
                  </span>
                </div>
              </template>                                                                 
            </el-table-column>                          

            <el-table-column prop="album" label="专辑" >
              <template #default="scope">
                <span class="music-table-album-name" @click="toAlbum(scope.row.album.id)">{{scope.row.album.name}}</span>
                <span class="music-table-add-queue" title="添加至待播列表" @click="addToQueue(scope.row, 'plus')">
                  <svg-icon iconName="add-queue"></svg-icon>
                </span>
              </template>
            </el-table-column>

            <el-table-column prop="time" label="时长" width="100"></el-table-column>                            
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="专辑简介" name="descrption">
        <span class="album-description-title">专辑介绍</span>
        <p class="album-description-text" v-for="(item, index) in albumInfo.description" :key="index">{{item}}</p>
      </el-tab-pane>
      <el-tab-pane label="评论" name="comment">

      </el-tab-pane>
    </el-tabs>
    
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getAlbumInfo } from '@/api/getAlbumInfo'
import usePlay from '@/hooks/usePlay'
import SvgIcon from './SvgIcon/SvgIcon.vue'

const store = useStore()
const loading = ref(true)
const musicQueue = computed(() => store.state.musicQueue)

const albumId = ref()
onMounted(() => {
  albumId.value = route.query.id
  params.id = albumId.value
  init()
})

//API参数
let params = {
  id: 0,
  realIP: '116.25.146.177'
}

// 通过API获得Album数据
const albumInfo = ref<Partial<Album>>({})
const commentCount = ref()
const artistName = ref<string>('')
const albumDescList = ref()
const tableData = ref<Array<Music>>()

function init() {
  getAlbumInfo(params).then(res => {
    console.log(res)
    albumInfo.value = res
    tableData.value = res.music
    console.log(tableData.value)
    artistName.value = res.artist.name

  }).then(() => {
    setTimeout(() => {
      loading.value = false
    }, 500);
  })
}

const activeName = ref('music')
function handleClick(tab: any) {
  console.log(tab)
}

// 播放音乐, 加入队列Hook
const { play, doubleClickPlay, addToQueue } = usePlay('album', ref(false))

function playAll() { // TODO:
  let allMusic = tableData.value!
  console.log(allMusic)
  store.commit('clearMusicQueue')
  for (const music of allMusic) {
    store.commit('addMusicToQueue', music)
  }
  store.commit('changeNowIndex', 0)
  play(allMusic[0], 'queue')
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

<style scoped>
.album {
  @apply max-w-[1300px] my-0 mx-auto p-5
}

.album-image-wrapper {
  @apply w-25 h-25
}

.album-image {
  @apply w-full h-full
}

.album-top {
  @apply px-5 py-0 flex-1
}

.album-top-title {
  @apply text-2xl font-bold flex items-center
}

.album-top-title-label {
  @apply text-orange-700 border-solid border border-orange-700 inline-block text-xl mr-2 rounded px-2 py-0 cursor-default
}

.album-top-info {
  @apply items-center text-sm
}

.album-top-info-detail {
  @apply mx-[10px] my-5
}

.playall-button {
  @apply inline-block mr-2 rounded-2xl bg-orange-700 py-1 px-4 text-white cursor-pointer
}

.music-table {
  @apply w-full
}

.music-table-artist{
  @apply text-sky-600 inline-block
}

.music-table-artist-name {
  @apply cursor-pointer
}
.music-table-artist-hyphen {
  @apply text-stone-700
}

.music-table-album-name {
  @apply cursor-pointer text-sky-600
}
.music-table-add-queue {
  @apply flex float-right mr-4 cursor-pointer w-6 h-6
}

.album-description-title {
  @apply font-bold text-xl inline-block my-2.5 mx-0
}

.album-description-text {
  @apply indent-8 my-4 mx-0 text-base
}
</style>