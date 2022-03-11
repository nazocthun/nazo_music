<template>
  <div class="play">
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
    <div >
      <div class="control">
        <span class="prev" @click="prev">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -3 24 24" width="32" fill="currentColor" data-darkreader-inline-fill="" style="--darkreader-inline-fill:currentColor;"><path d="M6.18 8.477a.976.976 0 0 0 .324 1.363l9.922 6.032c.16.097.346.149.535.149.56 0 1.013-.443 1.013-.99V2.97a.973.973 0 0 0-.153-.523 1.027 1.027 0 0 0-1.395-.317L6.504 8.16c-.131.08-.243.189-.325.317zM6 6.136L15.355.449c1.425-.867 3.3-.44 4.186.951.3.471.459 1.014.459 1.569V15.03C20 16.671 18.64 18 16.96 18a3.093 3.093 0 0 1-1.605-.448L6 11.865V16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4.136zM2 2v14h2V2H2z"></path></svg>
          </span>
        <span class="play" @click="changeGlobalMusicStatus('play')" v-if="isPaused">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -3 24 24" width="32" fill="currentColor" data-darkreader-inline-fill="" style="--darkreader-inline-fill:currentColor;"><path d="M13.82 9.523a.976.976 0 0 0-.324-1.363L3.574 2.128a1.031 1.031 0 0 0-.535-.149c-.56 0-1.013.443-1.013.99V15.03c0 .185.053.366.153.523.296.464.92.606 1.395.317l9.922-6.031c.131-.08.243-.189.325-.317zm.746 1.997l-9.921 6.031c-1.425.867-3.3.44-4.186-.951A2.918 2.918 0 0 1 0 15.03V2.97C0 1.329 1.36 0 3.04 0c.567 0 1.123.155 1.605.448l9.921 6.032c1.425.866 1.862 2.696.975 4.088-.246.386-.58.712-.975.952z"></path></svg>
        </span>
        <span class="pause" @click="changeGlobalMusicStatus('pause')" v-if="!isPaused">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -3 24 24" width="32" fill="currentColor" data-darkreader-inline-fill="" style="--darkreader-inline-fill:currentColor;"><path d="M2 0h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v14h2V2H2zm10-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 2v14h2V2h-2z"></path></svg>
        </span>
        <span class="next" @click="next">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -3 24 24" width="32" fill="currentColor" data-darkreader-inline-fill="" style="--darkreader-inline-fill:currentColor;"><path d="M13.82 9.523a.976.976 0 0 0-.324-1.363L3.574 2.128a1.031 1.031 0 0 0-.535-.149c-.56 0-1.013.443-1.013.99V15.03c0 .185.053.366.153.523.296.464.92.606 1.395.317l9.922-6.031c.131-.08.243-.189.325-.317zm.18 2.341l-9.355 5.687c-1.425.867-3.3.44-4.186-.951A2.918 2.918 0 0 1 0 15.03V2.97C0 1.329 1.36 0 3.04 0c.567 0 1.123.155 1.605.448L14 6.135V2a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-4.136zM16 2v14h2V2h-2z"></path></svg>
        </span>
      </div>
      <div class="progress">

      </div>
    </div>
    <div>

    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'PlayControl',
  props: ['globalMusicUrl'],
  setup(props, context) {
    const isPaused = ref(true)
    const isDragable = ref(false)
    const audio = ref()
    const duration = ref()
    const currentTime = ref()

    watch(() => props.globalMusicUrl, (newValue, _oldValue) => {
      if(newValue) {
        isPaused.value = false
      } else {
        isPaused.value = true
        duration.value = 0
        audio.value.currentTime = 0
        currentTime.value = 0
      }
    })

    function changeGlobalMusicStatus(option: String) {
      if (option === 'play') {
        if (props.globalMusicUrl) {
          isPaused.value = !(isPaused.value)
          audio.value.play()
          console.log("play")
          context.emit('play')
        } else {
          ElMessage({
            type:'error',
            message:'还没有播放音乐1111',
            showClose:true
          })
        }
      } else {
        isPaused.value = !(isPaused.value)
        audio.value.pause()
        context.emit('pause')
      }
    }

    function updateTime(e: any){
      if(!(isDragable.value)){
        currentTime.value = e.target.currentTime
        context.emit('timeupdate', e)
      }
    }

    function getDuration(e: any) {
      duration.value = e.target.duration
    }
    return {
      isPaused,
      audio,
      updateTime,
      getDuration,
      changeGlobalMusicStatus,
    }
  }
})


</script>

<style>

</style>