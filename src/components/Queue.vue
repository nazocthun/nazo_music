<template>
  <div class="queue">
    <div class="queue-tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="播放列表" name="playList">
            <div class="queue-header">
              <span>共{{musicQueue.length}}首</span>
              <span class="queue-header-clear-button" @click="clearMusicQueue">清空列表</span>
            </div>
            <ul class="queue-list">
              <el-scrollbar style="height:100%">
                <li class="queue-item"
                  v-for="music in musicQueue"
                  :key="music.id" @dblclick="doubleClickPlay(music)" 
                  :class="{'active-item':music.id==globalMusicInfo.id}">
                  <div class="playIconSet" v-show="music.id==globalMusicInfo.id && !isMusicPaused">
                    <div class="playIcon animate-playicon"></div>
                    <div class="playIcon animate-playicon animation-delay-200"></div>
                    <div class="playIcon animate-playicon animation-delay-500"></div>
                  </div>
                  <span :class="{'':isMusicPaused && music.id==globalMusicInfo.id}"></span>
                  <span class="queue-item-name">{{music.name}}</span>

                  <div class="queue-item-artist">
                    <span v-for="(artist ,i) in music.artists" :key="i" @click.stop="toArtist(artist.id)">{{artist.name}}&nbsp;</span>
                  </div>

                  <span class="queue-item-time">{{music.time}}</span>
                  <span class="queue-song-delete" @click="deleteQueue(music.id)">×</span>
                </li>
              </el-scrollbar>
            </ul>
        </el-tab-pane>
        <el-tab-pane label="播放历史" name="history">播放历史</el-tab-pane>
      </el-tabs>
      <span class="queue-empty-tip" v-if="!musicQueue.length">队列是空的</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import usePlay from '@/hooks/usePlay';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus'

const store = useStore()
const musicQueue = computed(() => store.state.musicQueue)
const globalMusicInfo = computed(() => store.state.globalMusicInfo)
const isMusicPaused = computed(() => store.state.isMusicPaused)
const nowIndex = computed(() => store.state.nowIndex)
const deleteToNext = computed(() => store.state.deleteToNext)
const activeName = ref('playList')
const { play, doubleClickPlay } = usePlay('queue', isMusicPaused)

function handleClick(tab: any) {
  console.log(tab)
}

function clearMusicQueue() {
  if(musicQueue.value.length == 0)
    ElMessage({
      message: '已经是空的了~',
      type: 'warning',
      showClose: true
    })
  else{
    ElMessageBox.confirm('确定清空列表吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      store.commit("changeMusicUrl", "")
      store.commit("changeMusicInfo", {})
      store.commit("changeMusicPausedStatus", true)
      store.commit("changeCurrentTime", 0)
      setTimeout(() => {
        store.commit('clearMusicQueue')
      }, 100)
      ElMessage({
        type: 'success',
        message: '已清空!'
      })
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消清空'
      })
    })
  }
}

function deleteQueue(id: number) { // 
  //   console.log(id)
  ElMessageBox.confirm('确定删除该歌曲吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let ids = []
    for (const item of musicQueue.value) {
      ids.push(item.id)
    }
    let indexOfId = ids.indexOf(id)

    setTimeout(() => {
      store.commit('changeQueueStyle','delete')
      store.commit('deleteMusic', id)
      if (indexOfId < nowIndex.value) { // 删除的是当前播放之前的歌曲
        store.commit('changeNowIndex', nowIndex.value - 1)          
      } else if (indexOfId == nowIndex.value){ // 删除的是当前播放的歌曲
        store.commit('deleteToNext')
      }
    }, 300)
    setTimeout(() => {
      store.commit('changeQueueStyle','normal')                   
    }, 300)
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    })
  })
}

// 监视删除状态
watch(deleteToNext, () => {
  // 队列中还有音乐播放下一首
  if (nowIndex.value < musicQueue.value.length) {
    play(musicQueue.value[nowIndex.value], 'queue')
  }
  // 队列中没有音乐重置
  if (musicQueue.value.length == 0) {
    store.commit("changeNowIndex",0)
    store.commit("changeMusicUrl","")
    store.commit("changeMusicInfo",{})
    store.commit("changeMusicPausedStatus",true)
    store.commit("changeCurrentTime",0)
    // 如果打开歌词页面 则关闭
    // this.$parent.show = true
    setTimeout(() => {
      store.commit('clearMusicQueue')
    }, 100)
  }
  //当前播放是队列最后一首，跳回第一首
  if(nowIndex.value == musicQueue.value.length)
    console.log(nowIndex.value, musicQueue.value.length)
    store.commit("changeNowIndex", 0)
})

watch(nowIndex, () => {
  play(musicQueue.value[nowIndex.value], 'queue')
})

const router = useRouter()
function toArtist(id: any){
  router.push(`/artist?artistId=${id}`)
}
</script>

<style>
.queue {
  @apply w-1/4 min-w-300 h-2/3 fixed right-2 bottom-14 border border-solid border-gray-500 rounded-t-md bg-white box-border text-sm shadow
}

.queue-tab {
  @apply h-full
}

.queue-header {
  @apply text-stone-400 pb-2 mx-2 my-3 border-b-2
}

.queue-header-clear-button {
  @apply text-orange-700 float-right cursor-pointer
}

.queue-list {
  @apply h-full relative
}

.el-tabs__header {
  @apply m-3
}

.playIconSet {
  @apply w-3.5 h-3.5 overflow-hidden flex absolute left-[5px]
}
.playIcon {
  @apply bg-orange-700 w-1 mx-px h-full
}

.queue-item {
  @apply flex items-center py-2 bg-white text-black cursor-pointer
}

.queue-item:nth-of-type(even) {
  background-color: #f9f9f9;
}

.queue-item:not(.active-item):hover {
  background-color: #f5f6fa;
  @apply text-sky-600
}

.queue-item:hover .queue-song-delete {
  display: block;
}

.active-item {
  @apply text-orange-700;
  position: relative;
}

.queue-item-name {
  @apply w-1/2 mx-6 overflow-hidden text-ellipsis whitespace-nowrap
}

.queue-item-artist {
  @apply w-1/3 overflow-hidden text-ellipsis whitespace-nowrap text-sky-600
}

.queue-item-time {
  @apply w-1/6
}

.queue-song-delete {
  @apply cursor-pointer mr-3 text-stone-400 hidden
}

.queue-empty-tip {
  @apply absolute top-1/2 left-1/2 text-stone-400 -translate-x-1/2 -translate-y-1/2
}
</style>