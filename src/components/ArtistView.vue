<template>
  <div class="artist" v-loading="loading">
    <div class="artist-info">
      <div class="artist-img-wrap">
        <img v-lazy="picUrl" alt="">
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

    <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="专辑" name="album">
        <ul class="albums">
          <li class="al-item" v-for="(item,index1) in albumData" :key="index1" @click="toAlbum(item.id)">
              <div class="al-img-wrap">
                  <p class="iconfont icon-play bofang"></p>
                  <img v-lazy="item.picUrl" alt="">
              </div>
              <div class="al-name" :title="item.name">{{item.name}}</div>
              <div class="al-time">{{item.publishTime}}</div>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
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
      </el-tab-pane>
      <el-tab-pane label="歌手详情" name="detail">

        <span class="detail-title">个人简介</span>
        <p class="detail-words" v-for="(y,index3) in briefDescList" :key="index3">{{y}}</p>

        <div v-for="(item,index4) in introduction" :key="index4+999">
            <span class="detail-title">{{item.ti}}</span>
            <p class="detail-words" v-for="(x,i) in item.strList" :key="i">{{x}}</p>                    
        </div>

      </el-tab-pane>
      <el-tab-pane label="相似歌手" name="similar">
        <ul class="simi">
          <li class="simi-item" v-for="(item,index) in simi" :key="index" @click="toArtist(item.id)">
            <div class="simi-img-wrap">
              <img v-lazy="item.picUrl" alt="">
            </div>
            <div class="simi-name">{{item.name}}</div>
          </li>
          <span v-if="simi.length==0">暂无相似歌手</span>
        </ul>                
      </el-tab-pane>
    </el-tabs>         -->
  </div>
</template>

<script lang="ts">
import { artistsAPI } from '@/utils/api'
import { useRoute } from 'vue-router'
import { ref, defineComponent, onBeforeMount, computed } from 'vue'
export default defineComponent({
  name: 'ArtistView',
  setup() {

    const artistId = ref()
    const topInfo = ref()
    const albumData = ref()
    const mvData = ref()
    const loading = ref(true)

    
    
    let params = {
      id: artistId.value,
      limit: 50,
      offset: 0
    }
    artistsAPI(params,'album').then(res=>{
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
    const picUrl = computed(() => { topInfo.value!.picUrl})

    function getMVData(){
      let params = {
        id: artistId.value,
        limit: 50,
        offset: 0
      }
      artistsAPI(params,'mv').then(res=>{
        // console.log(res)
        mvData.value = res.data.mvs
      })
    }

    const route = useRoute()
    onBeforeMount(() => {
      artistId.value = route.query.artistId
      // getAlbumData()
      // getMVData()
    })
    return {
      picUrl,
      topInfo,
      albumData,
      mvData,
      loading,
      // getAlbumData,
      getMVData,
    }
  }
})
</script>

<style>

</style>