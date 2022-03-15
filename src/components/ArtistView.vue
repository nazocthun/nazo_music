<template>
  <div class="artist" v-loading="loading">
    <div class="artist-info">
      <div class="artist-img-wrap">
        <img :src="topInfo.picUrl" alt="">
      </div>
      <div class="artist-others">
        <div class="artist-name">{{topInfo.name}}</div>
        <div class="artsit-works">
          <div class="artist-works-count">单曲数：{{topInfo.musicSize}}</div>
          <div class="artist-works-count">专辑数：{{topInfo.albumSize}}</div>
          <!-- <div class="artist-works-count">MV数：{{mvData.length}}</div> -->
        </div>
      </div>
    </div>


    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="专辑" name="album">
        <ul class="albums">
          <li class="al-item" v-for="(item,index1) in albumData" :key="index1" @click="toAlbum(item.id)">
              <div class="al-img-wrap">
                  <p class="iconfont icon-play bofang"></p>
                  <img :src="item.picUrl" alt="">
              </div>
              <div class="al-name" :title="item.name">{{item.name}}</div>
              <div class="al-time">{{item.publishTime}}</div>
          </li>
        </ul>
      </el-tab-pane>
      <!-- <el-tab-pane label="MV" name="mv">
        <ul class="artist-mv">
          <li class="mv-item" v-for="(item,index2) in mvData" :key="index2" @click="toMvDetail(item.id)">
          <div class="al-img-wrap mv-img-wrap">
              <p class="iconfont icon-play bofang"></p>
              <img v-lazy="item.imgurl" alt="">
              <p class="play-count iconfont icon-play">{{item.playCount}}</p>
            </div>
            <div class="al-name" :title="item.name">{{item.name}}</div>                     
          </li>
          <span v-if="mvData.length==0">暂无MV</span>                    
        </ul>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="歌手详情" name="detail">

        <span class="detail-title">个人简介</span>
        <p class="detail-words" v-for="(y,index3) in description" :key="index3">{{y}}</p>

        <div v-for="(item,index4) in introduction" :key="index4+999">
            <span class="detail-title">{{item.ti}}</span>
            <p class="detail-words" v-for="(x,i) in item.strList" :key="i">{{x}}</p>                    
        </div>

      </el-tab-pane> -->
      <el-tab-pane label="相似歌手" name="similar">
        <ul class="simi">
          <li class="simi-item" v-for="(item,index) in similarArtists" :key="index" @click="toArtist(item.id)">
            <div class="simi-img-wrap">
              <img :src="item.picUrl" alt="">
            </div>
            <div class="simi-name">{{item.name}}</div>
          </li>
          <span v-if="similarArtists.length==0">暂无相似歌手</span>
        </ul>                
      </el-tab-pane>
    </el-tabs>        
  </div>
</template>

<script setup lang="ts">
import { artistsAPI } from '@/utils/api'
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, onBeforeMount } from 'vue'
import { albumTopInfoTypes, similarArtistTypes } from '@/utils/interfaces';
const route = useRoute()
const router = useRouter()

const artistId = ref()
const topInfo = ref({} as albumTopInfoTypes)
const albumData = ref()
const mvData = ref()
const loading = ref(true)
const activeName = ref('album')

//API参数
let params = {
  id: 0,
  limit: 50,
  offset: 0
}

onBeforeMount(() => {
  artistId.value = route.query.artistId
  params.id = artistId.value
  getAlbumData(params)
  getMVData(params)
})

// 通过API获得TopInfo中专辑数量、音乐数量、艺人名称、艺人图片
// 通过API获得AlbumData中数据
function getAlbumData(params: Object) {
  artistsAPI(params,'album').then( res => {
    console.log(res)
    topInfo.value = {
      albumSize: res.data.artist.albumSize,
      musicSize: res.data.artist.musicSize,
      name: res.data.artist.name,
      picUrl: res.data.artist.picUrl
    }
    albumData.value = res.data.hotAlbums
  }).then(()=>{
    loading.value = false
  })
}

// 获取艺人简介
const description = ref([])
const introduction = ref()
function getArtistInfo(){
  artistsAPI({id:artistId.value},'desc').then( res => {
    // console.log(res)
    description.value = res.data.briefDesc.split(/[\n]/)

    introduction.value = res.data.introduction
    let strList = []
    for(let item of introduction.value){
      strList = item.txt.split(/[\n]/)
      item.strList = strList
    }
  })                            
}

// 获取相似艺人
const similarArtists = ref([{} as similarArtistTypes])
function getSimilarArtists(){
  artistsAPI({id:artistId.value},'simi').then( res => {
    // console.log(res)
    similarArtists.value = res.data.artists
  })
}

// 获取MV数据
function getMVData(params: Object) {
  artistsAPI(params,'mv').then(res=>{
    // console.log(res)
    mvData.value = res.data.mvs
  })
}

function handleClick(tab: any) {
  loading.value = true
  console.log(tab.props.label)
  if(tab.props.label == "相似歌手")
    getSimilarArtists()
  else if(tab.props.label == "歌手详情")
    getArtistInfo()
  setTimeout(() => {
    loading.value = false
  }, 1000);
}

function toAlbum(id: number) {
  router.push(`/album?id=${id}`)
}

function toArtist(id: number) {
  router.push(`/artist?artistId=${id}`)
}

watch(route, (newVal: any, _oldVal: any) => {
  if (newVal.query.artistId) {
    artistId.value = newVal.query.artistId
    params.id = artistId.value
    getAlbumData(params)
    getMVData(params)
    setTimeout(() => {
      activeName.value = "album"
      loading.value = false
    }, 0)
  }
})

</script>

<style scoped>
    .artist {
      max-width: 1300px;
      margin: 0 auto;
      padding: 20px;        
    }

    .artist >>> .el-tabs__item{
        font-size: 14px;
    }

    .artist >>> .el-loading-spinner {
      top: 15%;
    }

    .artist-info {
        display: flex;
        font-size: 14px;
        margin-bottom: 20px;
    }

    .artist-img-wrap {
        width: 200px;
        /* height: 200px; */
        margin-right: 50px;
    }

    .artist-img-wrap img {
        width: 100%;
        height: 100%;
    }

    .artist-name {
        font-weight: bold;
        font-size: 22px;
    }

    .artsit-works {
        margin-top: 20px;
        display: flex;
    }

    .artist-works-count:nth-of-type(2) {
        margin: 0 20px;
    }

    /* tabs部分 */
    /* 专辑 */
    .albums {
        display: grid;
        grid-template-columns: repeat(4,1fr);
        gap: 20px;
        align-items: center;
    }

    .al-item {
        font-size: 14px;
        width: 300px;
    }

    .al-img-wrap {
        width: 100%;
        position: relative;
    }

    .al-img-wrap img {
        width: 100%;
        border-radius: 10px;
    }

    .al-img-wrap .bofang::before {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        width: 50px;
        height: 50px;
        background-color: rgba(255, 255, 255, .8);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #c0392b;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: .5s;
    }

    .al-img-wrap:hover .bofang::before{
        opacity: 1;
    }

    .al-name {
        margin: 5px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .al-time {
        color: grey;
    }

    /* MV */
    .artist-mv {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(4,1fr);
    }

    .mv-item {
        width: 300px;        
    }

    .play-count{
        position: absolute;
        top: 5px;
        right: 5px;
        color: #fff;
        text-shadow: 0 0 2px rgb(0, 0, 0);
    }  
    
    /* 歌手详情 */
    .detail-title {
        font-weight: bold;
        font-size: 20px;
        display: inline-block;
        margin: 10px 0;
    }

    .detail-words {
        line-height: 2.5rem;
        text-indent: 2rem;
        margin: 1rem 0;
        /* white-space: pre-line;  */
    }

    /* 相似歌手 */
    .simi {
        display: grid;
        grid-template-columns: repeat(5,1fr);
        gap: 20px;
    }

    .simi-item {
        width: 80%;
    }

    .simi-img-wrap {
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        position: relative;
        cursor: pointer;
    }

    .simi-img-wrap img {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }

    .simi-name {
        font-size: 14px;
        color: grey;
        text-align: center;
        margin: 10px 0;        
    }
</style>