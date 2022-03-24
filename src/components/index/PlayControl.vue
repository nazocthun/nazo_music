<template>
  <div class="playcontrol w-160 min-w-50 h-full mx-auto my-0 p-2 box-border flex">
    <audio :src="globalMusicUrl"
      controls 
      autoplay
      ref="audio" 
      style="display:none" 
      @canplay="getDuration" 
      @timeupdate="updateTime"
      @ended="onEnded" 
      您的浏览器不支持audio标签>
    </audio>
    <div class="functions flex-1 ">
      <div class="control flex w-1/2 h-1/2 mx-auto my-0 align-center justify-evenly">
        <span class="prev" @click="prev">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M20 5v14l-7-7M6 5v14H4V5m9 0v14l-7-7"/></svg>
        </span>
        <span class="play" @click="changePlayControlStatus('play')" v-if="isPaused">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5.14v14l11-7l-11-7Z"/></svg>
        </span>
        <span class="pause" @click="changePlayControlStatus('pause')" v-if="!isPaused">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M14 19h4V5h-4M6 19h4V5H6v14Z"/></svg>
        </span>
        <span class="next" @click="next">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="2em" height="2em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M4 5v14l7-7m7-7v14h2V5m-9 0v14l7-7"/></svg>
        </span>
      </div>
      <div class="progress flex items-center">
        <span>{{ playControlTimeFormat(currentTime) }}</span>
        <div class="flex-1 mx-2 my-0">
          <el-slider v-model="currentTime" :max="duration" :show-tooltip="false" @change="changeCurrentTime" @mousedown.native="isDraging = true" @mouseup.native="isDraging = false"></el-slider>
        </div>
        <span>{{ playControlTimeFormat(duration) }}</span>
      </div>
    </div>
    <div class="w-1/4 min-w-25 ml-12">
      <div class="h-1/2"></div>
      <div class="flex items-center">
        <span class="loud cursor-pointer" v-if="volume > 0.5" @click="volume = 0">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.5em" height="1.5em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.84-5 6.7v2.07c4-.91 7-4.49 7-8.77c0-4.28-3-7.86-7-8.77M16.5 12c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4M3 9v6h4l5 5V4L7 9H3Z"/></svg>
        </span>
        <span class="quiet cursor-pointer" v-if="volume <= 0.5 && volume !== 0" @click="volume = 0">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.5em" height="1.5em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M5 9v6h4l5 5V4L9 9m9.5 3c0-1.77-1-3.29-2.5-4.03V16c1.5-.71 2.5-2.24 2.5-4Z"/></svg>
        </span>
        <span class="mute cursor-pointer" v-if="!volume" @click="volume=(cacheVolume==0 ? 0.7 : cacheVolume)">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.5em" height="1.5em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="m5.64 3.64l15.72 15.72l-1.41 1.42L16 16.83V20l-5-5H7V9h1.17L4.22 5.05l1.42-1.41M16 4v7.17l-3.59-3.59L16 4Z"/></svg>
        </span>
        <div class="flex-1 mx-2 my-0">
          <el-slider v-model="volume" :max=1 :step=0.1 :show-tooltip="true" @input="changeVolume" @change="changeCacheVolume" :format-tooltip="volumeTooltip"></el-slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { playControlTimeFormat } from '@/utils/utils';
import store from '@/store';
import usePlay from '@/hooks/usePlay';

const props = defineProps({
  globalMusicUrl: {
    type: String,
    default: ''
  }
})

const em = defineEmits(['play', 'autoplay', 'pause', 'timeupdate', 'end', 'prev', 'next'])

const isPaused = computed(() => store.state.isMusicPaused)
const isMusicChanged = computed(() => store.state.musicChangedFlag)
const playType = computed(() => store.state.playType)
const isDraging = ref(false)
const audio = ref()
const duration = ref()
const currentTime = ref()

// 音量控制
const volume = ref(1)
const cacheVolume = ref(1)

function changeVolume(){
  audio.value.volume = volume.value
}

function changeCacheVolume() {
  cacheVolume.value = volume.value
}

function volumeTooltip(volume: number) {
  return volume * 100 + "%"
}

watch(() => volume.value, () => {
  if(!volume.value) {
    audio.value.muted = true
  } else {
    audio.value.muted = false
  }
})

// 传入音乐Url更改播放按钮与播放状态
watch(() => props.globalMusicUrl, (newValue, oldValue) => {
  if(newValue) { // 传入有效音乐Url
    if (playType.value === 'doubleclick' || playType.value === 'playbutton') {
      em('play')
    } else {
      em('autoplay')
    }
  } else { //音乐队列为空时
    em('pause')
    duration.value = 0
    audio.value.currentTime = 0
    currentTime.value = 0
  }
})

// 监测音乐改变，用于监测连续播放同一首歌重置时间
watch(() => isMusicChanged.value, () => {
  // console.log('music changed')
  audio.value.currentTime = 0
  currentTime.value = 0
  em('play')
})

// 播放音乐Hook
const { play } = usePlay('queue', isPaused)
const musicQueue = computed(() => store.state.musicQueue)
function changePlayControlStatus(option: String) { //播放按钮动作
  if (option === 'play') {
    if (props.globalMusicUrl) {
      audio.value.play()
      console.log("play")
      em('play')
    } else {
      if (musicQueue.value.length != 0) {
        console.log(musicQueue.value)
        play(musicQueue.value[0], 'playbutton')
      } else {
        ElMessage({
          type:'error',
          message:'队列中没有音乐',
          showClose:true
        })
      }
    }
  } else {
    audio.value.pause()
    em('pause')
  }
}

// 进度条控制
function updateTime(e: any){
  if(!(isDraging.value)){
    currentTime.value = e.target.currentTime
    em('timeupdate', e)
  }
}

function changeCurrentTime(){
  // 存在拖动进度条歌词不随着滚动的bug
  audio.value.currentTime = currentTime.value
  isDraging.value = false
  // this.changeStatus(this.isPaused?'play':'pause')
}

function getDuration(e: any) {
  duration.value = e.target.duration
  if (isPaused.value) {
    audio.value.pause()
  }
}

// 播放控制
function onEnded(){
  em('end')
}

function prev() {
  em('prev')
}

function next() {
  em('next')
}
</script>

<style>
.control span {
  @apply cursor-pointer rounded-full hover:bg-orange-200 w-8 h-8
}
.progress span {
  @apply text-xs text-black
}

.el-slider__bar {
  @apply bg-orange-700 !important
}

.el-slider__button {
  @apply border-orange-700 w-3.5 h-3.5 !important
}
</style>