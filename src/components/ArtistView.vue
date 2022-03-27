<template>
  <div class="artist" v-loading="loading">
    <div class="artist-top-info">
      <div class="artist-img-wrap">
        <img :src="artistInfo.picUrl" alt="">
      </div>
      <div class="artist-top-info-detail">
        <div class="artist-name">{{artistInfo.name}}</div>
        <div class="artist-works">
          <div class="artist-works-count">单曲数：{{artistInfo.musicSize}}</div>
          <div class="artist-works-count">专辑数：{{artistInfo.albumSize}}</div>
          <div class="artist-works-count">MV数：{{mvData.length}}</div>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="热门歌曲" name="hotMusic">
        <el-table :data="musicData" stripe @row-dblclick="doubleClickPlay" style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="name" label="歌曲名"></el-table-column>
          <el-table-column prop="artists" label="歌手">
            <template #default="scope">
              <div class="inline-block" v-for="(artist, i) in scope.row.artists" :key="i">
                <span class="cursor-pointer text-sky-600" @click="toArtist(artist.id)">{{artist.name}}</span>
                <span class="text-gray-600" v-show="scope.row.artists.length != 1 && i!=scope.row.artists.length-1">
                  &amp;&nbsp;
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="album" label="专辑">
            <template #default="scope" class="flex ">
              <div class="flex justify-start items-center">
                <span class="flex-initial cursor-pointer text-sky-600 mr-auto" @click="toAlbum(scope.row.album.id)">{{scope.row.album.name}}</span>
                <span class="flex float-right mr-4 cursor-pointer w-6 h-6" @click="addToQueue(scope.row, 'plus')">
                  <svg-icon iconName="add-queue"></svg-icon>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="time" label="时长" width="100"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="专辑" name="album">
        <ul class="albums">
          <li class="album-item" v-for="(album, index1) in albumData" :key="index1">
            <div class="album-img-wrap" @click="toAlbum(album.id)">
              <img :src="album.picUrl" alt="">
              <div class="album-play-button" @click.stop="playAlbum(album.id)">
                <svg-icon iconName="play-button-circle"></svg-icon>
              </div>
            </div>
            <div class="album-name" :title="album.name">{{ album.name }}</div>
            <div class="album-time">{{ album.publishTime }}</div>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="artist-mv">
          <div class="mv-item" v-for="(mv, index) in mvData" :key="index">
            <div class="mv-img-wrap" @click="toMV(mv.id)">
              <img :src="mv.picUrl" alt="">
              <div class="mv-play-button">
                <svg-icon iconName="play-button-circle"></svg-icon>
              </div>
              <div class="mv-play-count">
                <svg-icon iconName="play-button-small"></svg-icon>
                {{ mv.playCount }}
              </div>
            </div>
            <div class="mv-name" :title="mv.name">{{ mv.name }}</div>  
            <div class="mv-time">{{ mv.publishTime }}</div>
          </div>
          <span v-if="mvData.length == 0">暂无MV</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="歌手详情" name="detail">

        <span class="detail-title">个人简介</span>
        <p class="detail-text">{{artistIntroduction.briefDesc}}</p>

        <div v-for="(item, index) in artistIntroduction.introduction" :key="index">
            <span class="detail-title">{{item.title}}</span>
            <p class="detail-text" v-for="(x,i) in item.txt" :key="i">{{x}}</p>                    
        </div>

      </el-tab-pane>
      <el-tab-pane label="相似歌手" name="similar">
        <ul class="similar">
          <li class="similar-item" v-for="(artist, index) in similarArtists" :key="index">
            <div class="similar-img-wrap" @click="toArtist(artist.id)">
              <img :src="artist.picUrl" alt="">
            </div>
            <div class="similar-name">{{artist.name}}</div>
          </li>
          <span v-if="similarArtists.length==0">暂无相似歌手</span>
        </ul>                
      </el-tab-pane>
    </el-tabs>        
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onMounted } from 'vue'
import { getArtist, getArtistIntroduction, getArtistMV, getSimilarArtistInfo } from '@/api/getArtistInfo'
import usePlay from '@/hooks/usePlay';

const route = useRoute()
const router = useRouter()
const loading = ref(true)

const { play, doubleClickPlay, addToQueue } = usePlay('newMusic', ref(false))

const artistId = ref()
onMounted(() => {
  artistId.value = route.query.artistId
  params.id = artistId.value
  // getAlbumData(params)
  // getMVData(params)
  initArtistInfo()
  initArtistIntroduction()
  initMVData()
})

// 面板激活切换
const activeName = ref('hotMusic')
function handleClick(tab: any) {
  loading.value = true
  console.log(tab.props.label)
  if(tab.props.label == '专辑' || tab.props.label == '热门歌曲') {
    initArtistInfo().then(() => {loading.value = false})
  } else if (tab.props.label == 'MV') {
    initMVData().then(() => {loading.value = false})
  } else if (tab.props.label == '相似歌手') {
    initSimilarArtists().then(() => {loading.value = false})
  } else if (tab.props.label == '歌手详情') {
    initArtistIntroduction().then(() => {loading.value = false})
  }
}

//API参数
let params = {
  id: 0,
  limit: 50,
  offset: 0
}

// 通过API获得数据
const musicData = ref<Array<Music>>()
const albumData = ref<Array<Album>>()
const artistInfo = ref<Partial<ArtistInfo>>({})
async function initArtistInfo() {
  await getArtist(params).then( res => {
    console.log(res)
    artistInfo.value = res
    albumData.value = res.hotAlbum
    musicData.value = res.hotMusic
  }).then(() => {
    loading.value = false
  })
}

// 获取艺人简介
const artistIntroduction = ref<Partial<ArtistIntroduction>>({})
async function initArtistIntroduction() {
  await getArtistIntroduction(params).then(res => {
    artistIntroduction.value.briefDesc = res.briefDesc
    artistIntroduction.value.introduction = res.introduction
  }).then(() => {
    loading.value = false
  })
}

// 获取相似艺人
const similarArtists = ref<Array<Artist>>([])
async function initSimilarArtists(){
  await getSimilarArtistInfo({ id: artistId.value }).then( res => {
    similarArtists.value = res
  }).then(() => {
    loading.value = false
  })
}

// 获取MV数据
const mvData = ref<Array<MV>>([])
async function initMVData() {
  await getArtistMV(params).then(res => {
    mvData.value = res
  }).then(() => {
    loading.value = false
  })
}

function playAlbum(id: number) {
  console.log("playAlbum", id)
}

// 路由跳转
function toAlbum(id: number) {
  router.push(`/album?id=${id}`)
}

function toArtist(id: number) {
  router.push(`/artist?artistId=${id}`)
}

function toMV(id: number) {
  // router.push(`/mv?id=${id}`)
  console.log("to mv: ", id)
}

// 路由监视，变更艺人时重制页面信息及选中标签
watch(route, (newVal: any, _oldVal: any) => {
  if (newVal.query.artistId) {
    artistId.value = newVal.query.artistId
    params.id = artistId.value
    initArtistInfo()
    // initMVData()
    setTimeout(() => {
      activeName.value = 'hotMusic'
      loading.value = false
    }, 0)
  }
})

</script>

<style scoped>
.artist {
  @apply max-w-[1300px] my-0 mx-auto p-5
}

.artist :deep(.el-tabs__item){
  @apply text-sm
}

.artist :deep(.el-loading-spinner) {
  @apply top-[15%]
}

.artist-top-info {
  @apply flex text-sm mb-5
}

.artist-img-wrap {
  @apply w-[200px] mr-[50px] 
}

.artist-img-wrap img {
  @apply w-full h-full rounded-xl
}

.artist-name {
  @apply text-2xl font-bold
}

.artist-works {
  @apply mt-5 flex
}

.artist-works-count:nth-of-type(2) {
  @apply my-0 mx-5
}

.albums {
  @apply grid grid-cols-5 gap-5 items-center
}

.album-item, .mv-item {
  @apply text-sm w-full
}

.album-img-wrap, .mv-img-wrap {
  @apply w-full relative
}

.album-img-wrap img, .mv-img-wrap img {
  @apply w-full rounded-xl
}

.album-play-button, .mv-play-button {
  @apply absolute justify-center opacity-0 items-center cursor-pointer w-12 h-12 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 bg-white/80 text-orange-700 rounded-full duration-500
}

.album-img-wrap:hover .album-play-button, .mv-img-wrap:hover .mv-play-button {
  @apply opacity-100
}

.album-name, .mv-name{
  @apply my-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-sm
}

.album-time, .mv-time {
  @apply text-xs
}

.artist-mv {
  @apply grid grid-cols-4 gap-5
}
.mv-play-count svg {
  @apply h-3 w-3
}
.mv-play-count {
  @apply flex items-center absolute top-1 right-1 text-white text-xs cursor-default drop-shadow-[0_0_2px_rgba(0,0,0,1)];
}

.detail-title {
  @apply font-bold text-xl inline-block my-2.5 mx-0
}

.detail-text {
  @apply indent-8 my-4 mx-0 text-base
}

  /* 相似歌手 */
.similar {
  @apply grid grid-cols-5 gap-5
}

.similar-item {
  @apply w-full
}

.similar-img-wrap {
  @apply w-full cursor-pointer relative
}

.similar-img-wrap img {
  @apply w-full rounded-xl
}

.similar-name {
  @apply text-sm text-center my-2.5 mx-0 text-stone-800
}
</style>