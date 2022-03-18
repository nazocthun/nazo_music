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
    <el-tooltip content="播放队列" placement="top" effect="light">
      <div @click="toggleQueue()" ref="queue">
        <span class="iconfont icon-yinleliebiao"></span>
        <span>{{musicQueue.length}}</span>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import PlayControl from '@/components/index/PlayControl.vue'
import { ElMessage } from 'element-plus';
import usePlay from '@/hooks/usePlay';

const store = useStore()

const defaultImg = require("@/assets/defaultImg.png")
const globalMusicUrl = computed(() => store.state.globalMusicUrl)
const globalMusicInfo = computed(() => store.state.globalMusicInfo)
const musicQueue = computed(() => store.state.musicQueue)
const nowIndex = computed(() => store.state.nowIndex)
const queueStyle = computed(() => store.state.queueStyle)
const isMusicPaused = computed(() => store.state.isMusicPaused)
const currentTime = ref()
function updateTime(e: any) { // TODO: 
  currentTime.value = e.target.currentTime
  // console.log("目前歌单index为："+nowIndex)
}
function globalPlayStatus() {
  store.commit('changeMusicPausedStatus', false)
}
function globalPauseStatus() {
  store.commit('changeMusicPausedStatus', true)
}

const { play } = usePlay('queue', isMusicPaused)

function next() {
  if (musicQueue.value.length == 0) {
    ElMessage({
      type: 'warning',
      message: '队列中没有歌曲',
      showClose: true
    })
  } else if (musicQueue.value.length == 1) { // 若播放列表只有一首歌 则停止播放
    store.commit("changeNowIndex", 0)
    store.commit("changeMusicUrl", "")
    store.commit("changeMusicInfo", {})
    store.commit("changeMusicPausedStatus", true)
    store.commit("changeCurrentTime", 0)
    ElMessage({
      type: 'warning',
      message: '队列播放完了',
      showClose: true
    })
  } else {
    let nextIndex = (nowIndex.value + 1) % musicQueue.value.length
    // let nextId = this.musicQueue[nextIndex].id
    play(musicQueue.value[nextIndex])
    store.commit('changeNowIndex', nextIndex)
    store.commit('changeMusicPausedStatus', false)
  }
}
function prev() { // TODO: 
  if (musicQueue.value.length == 0) {
    ElMessage({
      type: 'warning',
      message: '队列中没有歌曲',
      showClose: true
    })
  } else if (musicQueue.value.length == 1) { // 若播放列表只有一首歌 则重头开始播放
    play(musicQueue.value[0])
    // store.commit("changeNowIndex", 0)
    // store.commit("changeMusicUrl", "")
    // store.commit("changeMusicInfo", {})
    // store.commit("changeMusicPausedStatus", true)
    // store.commit("changeCurrentTime", 0)
    // ElMessage({
    //   type: 'warning',
    //   message: '队列播放完了',
    //   showClose: true
    // })
  } else {
    let prevIndex
    if (nowIndex.value == 0) {
      prevIndex = musicQueue.value.length - 1
    } else {
      prevIndex = (nowIndex.value - 1) % musicQueue.value.length
    }
    // let nextId = this.musicQueue[nextIndex].id

    play(musicQueue.value[prevIndex])
    store.commit('changeNowIndex', prevIndex)
    store.commit('changeMusicPausedStatus', false)

  }
}

function toSongDetail() { // TODO: 

}
const em = defineEmits(['toggle'])

function toggleQueue(){
  em('toggle')
  console.log("footer.vue tooggle")
  // console.log(`logo x:${e.x}, y:${e.y}`)
}
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
