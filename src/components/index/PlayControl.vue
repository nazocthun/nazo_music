<template>
  <div class="play-control">
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
    <div class="music-control">
      <div class="music-control-buttons">
        <span class="prev" @click="prev">
          <svg-icon class="music-control-button" icon-name="prev-button"></svg-icon>
        </span>
        <span class="play" @click="changePlayControlStatus('play')" v-if="isPaused">
          <svg-icon class="music-control-button" icon-name="play-button"></svg-icon>
        </span>
        <span class="pause" @click="changePlayControlStatus('pause')" v-if="!isPaused">
          <svg-icon class="music-control-button" icon-name="pause-button"></svg-icon>
        </span>
        <span class="next" @click="next">
          <svg-icon class="music-control-button" icon-name="next-button"></svg-icon>
        </span>
      </div>
      <div class="progress">
        <span>{{ playControlTimeFormat(currentTime) }}</span>
        <div class="progress-bar">
          <el-slider v-model="currentTime" :max="duration" :show-tooltip="false" @change="changeCurrentTime" @mousedown.native="isDraging = true" @mouseup.native="isDraging = false"></el-slider>
        </div>
        <span>{{ playControlTimeFormat(duration) }}</span>
      </div>
    </div>
    <div class="volume-cotrol">
      <div class="volume-cotrol-top-empty"></div>
      <div class="volume-button-bottom">
        <div class="volume-buttons">
          <span v-if="volume > 0.5" @click="volume = 0">
            <svg-icon class="volume-button" iconName="volume-loud"></svg-icon>
          </span>
          <span v-if="volume <= 0.5 && volume !== 0" @click="volume = 0">
            <svg-icon class="volume-button" iconName="volume-quiet"></svg-icon>
          </span>
          <span v-if="!volume" @click="volume=(cacheVolume==0 ? 0.7 : cacheVolume)">
            <svg-icon class="volume-button" iconName="volume-mute"></svg-icon>
          </span>
        </div>
        <div class="volume-slider">
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
import SvgIcon from '../SvgIcon/SvgIcon.vue';

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
.play-control {
  @apply w-160 min-w-50 h-full mx-auto my-0 p-2 box-border flex
}

.music-control {
  @apply flex-1
}

.music-control-buttons {
  @apply flex w-1/2 h-1/2 mx-auto my-0 items-center justify-evenly
}

/* .music-control-button, .volume-button {
  @apply w-full h-full
} */

.music-control-buttons span {
  @apply cursor-pointer rounded-full hover:bg-orange-200 w-8 h-8
}
.progress {
  @apply flex items-center
}
.progress span {
  @apply text-xs text-black cursor-default
}
.progress-bar {
  @apply flex-1 mx-2 my-0
}

.volume-cotrol {
  @apply w-1/4 min-w-[150px] ml-12
}
.volume-cotrol-top-empty {
  @apply h-1/2
}
.volume-button-bottom {
  @apply flex items-center
}
.volume-buttons {
  @apply cursor-pointer w-6 h-6 mr-[5px]
}

.volume-slider {
  @apply flex-1 mx-2 my-0
}
.el-slider__bar {
  @apply bg-orange-700 !important
}

.el-slider__button {
  @apply border-orange-700 w-3.5 h-3.5 !important
}
</style>