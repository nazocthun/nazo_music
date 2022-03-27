<template>
  <div class="flex items-center shadow">
    <div class="music-box flex box-border p-1 ">
      <div class="img-wrap w-12 h-12 mr-3 cursor-pointer relative"
        @click="toSongDetail()" title="打开音乐详情页" onselectstart="return false">
        <img class="h-full rounded-xl" v-if="globalMusicInfo.picUrl" :src="globalMusicInfo.picUrl" alt="">
        <div class="flex items-center justify-center w-12 h-12 text-white bg-orange-700 rounded-xl" v-if="!globalMusicInfo.picUrl">
          <div class=" w-10 h-10">
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="40px" height="40px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M16 9h-3v5.5a2.5 2.5 0 0 1-2.5 2.5A2.5 2.5 0 0 1 8 14.5a2.5 2.5 0 0 1 2.5-2.5c.57 0 1.08.19 1.5.5V7h4v2m-4-7a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8Z"/></svg>
          </div>
        </div>
      </div>
      <div class="music-info" v-show="globalMusicInfo">
        <span class="text-sm w-36 block overflow-x-hidden text-ellipsis whitespace-nowrap" :title="globalMusicInfo.name" v-show="globalMusicUrl">{{globalMusicInfo.name}}</span>
        <div class="mt-2 text-xs w-36 inline-block overflow-x-hidden text-ellipsis whitespace-nowrap" v-show="globalMusicUrl">
          <div class="inline-block" v-for="(artist, i) in globalMusicInfo.artists" :key="i+99">
            <span>{{artist.name}}</span>
            <span v-show="globalMusicInfo.artists.length != 1 && i!=globalMusicInfo.artists.length-1">
              &amp;&nbsp;
            </span>
          </div>
        </div>
        <span class="text-sm w-36 block overflow-x-hidden text-ellipsis whitespace-nowrap" v-show="!globalMusicUrl" style="line-height:48px">还没有播放音乐哦</span>
      </div>
    </div>
    <PlayControl :globalMusicUrl="globalMusicUrl" @timeupdate="updateTime" @play="globalPlayStatus" @autoplay="autoPlay" @pause="globalPauseStatus" @next="next" @prev="prev" @end="next"></PlayControl>
    <el-tooltip content="播放队列" placement="top" effect="light">
      <div class="flex justify-start items-center cursor-pointer" @click="toggleQueue()" ref="queue"
        :class="{
          'queue-icon queue-delete-before animate-[deleteAnimation_0.3s_reverse]':queueStyle=='delete',
          'queue-icon queue-add-before animate-[addAnimation_0.3s_reverse]':queueStyle=='add',
          'queue-icon':queueStyle=='normal'
        }">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M15 6H3v2h12V6m0 4H3v2h12v-2M3 16h8v-2H3v2M17 6v8.18c-.31-.11-.65-.18-1-.18a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3V8h3V6h-5Z"/></svg>
        </span>
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
function autoPlay() {
  store.commit('changeMusicPausedStatus', isMusicPaused.value)
}
function globalPauseStatus() {
  store.commit('changeMusicPausedStatus', true)
}

const { play } = usePlay('queue', isMusicPaused)

function next() {
  store.commit('addMusicToHistory', globalMusicInfo.value)
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
    play(musicQueue.value[nextIndex], 'queue')
    store.commit('changeNowIndex', nextIndex)
    store.commit('changeMusicPausedStatus', false)
  }
}
function prev() { // TODO:
  store.commit('addMusicToHistory', globalMusicInfo.value)
  if (musicQueue.value.length == 0) {
    ElMessage({
      type: 'warning',
      message: '队列中没有歌曲',
      showClose: true
    })
  } else if (musicQueue.value.length == 1) { // 若播放列表只有一首歌 则重头开始播放
    play(musicQueue.value[0], 'queue')
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

    play(musicQueue.value[prevIndex], 'queue')
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

<style scoped>
  .footer audio {
    width: 100%;
    outline: none;
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
.queue-icon {
  @apply mr-24 cursor-pointer
}

@keyframes addAnimation {
  to {
    color: rgb(194, 65, 12);
    transform: scale(1.2);
  }
}

@keyframes deleteAnimation {
  to {
    color: rgb(34, 211, 238);
    transform: scale(1.2);
  }
}

.queue-icon-before {
  @apply before:absolute before:-top-2 before:-left-5 before:font-bold before:scale-75
}

.queue-add-before {
  @apply before:content-['+1'] queue-icon-before
}
.queue-delete-before {
  @apply before:content-['-1'] queue-icon-before
}

</style>
