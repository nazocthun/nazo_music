<template>
  <div class="footer">
    <div class="music-box">
      <div class="img-wrap el-icon-arrow-up" @click="toSongDetail()" title="打开音乐详情页" onselectstart="return false">
        <img :src="globalMusicInfo.imgUrl ? globalMusicInfo.imgUrl : defaultImg" alt="">
      </div>
      <div class="music-info" v-show="globalMusicInfo.songName">
        <span class="music-name" :title="globalMusicInfo.songName">{{globalMusicInfo.songName}}</span>
        <div class="music-singer">
            <span v-for="(singer,i) in globalMusicInfo.artistInfo" :key="i+99">{{singer.name}} </span>
        </div>
        <span class="music-name" v-show="!globalMusicInfo.songName" style="line-height:50px">还没有播放音乐哦</span>
      </div>
    </div>
    <PlayControl :globalMusicUrl="globalMusicUrl" @timeupdate="updateTime" @play="globalPlayStatus" @pause="globalPauseStatus" @next="next" @prev="prev" @end="next"></PlayControl>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import PlayControl from '@/components/index/PlayControl.vue'
export default defineComponent({
  name: 'PageFooter',
  components: {
    PlayControl,
  },
  setup(_props, context) {
    const store = useStore()
    const defaultImg = require("@/assets/defaultImg.png")
    const globalMusicUrl = computed(() => store.state.globalMusicUrl)
    const globalMusicInfo = computed(() => store.state.globalMusicInfo)
    const musicQueue = computed(() => store.state.musicQueue)
    const nowIndex = computed(() => store.state.nowIndex)
    const queueStyle = computed(() => store.state.queueStyle)

    const currentTime = ref()
    function updateTime(e: any) { // TODO: 
      currentTime.value = e.target.currentTime
      // console.log("目前歌单index为："+nowIndex)
    }
    function globalPlayStatus() {
      store.commit('changeMusicStatus', false)
    }
    function globalPauseStatus() {
      store.commit('changeMusicStatus', true)
    }
    function next() { // TODO: 
      
    }
    function prev() { // TODO: 

    }
    return {
      defaultImg,
      globalMusicUrl,
      globalMusicInfo,
      musicQueue,
      nowIndex,
      queueStyle,
      updateTime,
      globalPlayStatus,
      globalPauseStatus,
      next,
      prev
    }
  }
})
</script>

<style lang="scss">
  .footer {
    display: flex;
    align-items: center;
    background-color: #f1f3f4;
    box-shadow: 0px -2px 2px rgba(0, 0, 0,.3);

    position: relative; /* 防止被覆盖 */
    /* #f1f3f4 */
  }

  .footer audio {
    width: 100%;
    outline: none;
  }

  .music-box{
    display: flex;
    padding: 5px;
    box-sizing: border-box;
  }

  .music-box .img-wrap {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    cursor: pointer;
    position: relative;
  }

  .music-box .img-wrap::before{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0,.3);
    color: #fff;
    border-radius: 5px;
    display: none;
  }

  .music-box .img-wrap:hover::before{
    display: flex;
  }

  .music-box .img-wrap img {
    height: 100%;
    border-radius: 5px;
  }
</style>
