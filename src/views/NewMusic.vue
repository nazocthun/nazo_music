<template>
  <div class="new-music" v-loading="loading">
    <div class="new-music-table">
      <el-table :data="tableData" stripe style="width: 100%" @row-dblclick="doubleClickPlay">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column width="100">
          <template #default="scope">
            <div class="table-cover">
              <img class="table-cover-img" :src="scope.row.picUrl" alt="">
              <div class="table-cover-play-button" @click="play(scope.row, 'playbutton')">
                <svg-icon iconName="play-button-circle"></svg-icon>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="音乐标题" width="">
          <template #default="scope">
            <div class="table-music-title">
              {{ scope.row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="歌手" width="">
          <template #default="scope">
            <div class="table-artist" v-for="(artist, i) in scope.row.artists" :key="i">
              <span class="table-artist-href" @click="toArtist(artist.id)">{{artist.name}}</span>
              <span class="table-artist-hyphen" v-show="scope.row.artists.length != 1 && i!=scope.row.artists.length-1">
                &amp;&nbsp;
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="album" label="专辑" width="">
          <template class="table-album-wrapper" #default="scope">
            <div class="table-album">
              <span class="table-album-href" @click="toAlbum(scope.row.album.id)">{{scope.row.album.name}}</span>
              <span class="table-add-queue" @click="addToQueue(scope.row, 'plus')">
                <svg-icon iconName="add-queue"></svg-icon>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import usePlay from '@/hooks/usePlay'
import { getNewMusic } from '@/api/getNewMusic'
let loading = ref(true)


// API参数
let params = {
  type: 0,
  realIP: '116.25.146.177'
}

onMounted(() => { init() })

// 通过API获得最新歌曲信息
const tableData = ref<Array<Music>>()
async function init() {
  loading.value = true
  await getNewMusic(params).then(res => {
    tableData.value = res
  }).then(() => {
    loading.value = false
  })
}

// 播放音乐Hook
const { play, doubleClickPlay, addToQueue } = usePlay('newMusic', ref(false))


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
  @apply max-w-[1300px] mx-auto p-5
}

.new-music-table {
  @apply w-full
}

.table-cover {
  @apply w-16 h-16 relative
}

.table-cover-img {
  @apply absolute w-full h-full rounded-xl
}

.table-cover-play-button {
  @apply absolute justify-center items-center cursor-pointer w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 bg-white/80 text-orange-700 rounded-full
}

.table-music-title {
  @apply inline-block text-gray-600 cursor-default
}

.table-artist {
  @apply inline-block
}
.table-artist-href {
  @apply cursor-pointer text-sky-600
}

.table-artist-hyphen {
  @apply text-gray-600 cursor-default
}

.table-album-wrapper {
  @apply flex
}
.table-album {
  @apply flex justify-start items-center
}

.table-album-href {
  @apply flex-initial cursor-pointer text-sky-600 mr-auto
}

.table-add-queue {
  @apply flex float-right mr-4 cursor-pointer w-6 h-6
}
  .new-music :deep(.el-loading-spinner) {
    top: 50%;
  }
</style>