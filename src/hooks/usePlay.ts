import store from "@/store"
import { ElMessage } from 'element-plus'
import { ComputedRef, Ref, computed } from 'vue'
import { playMusicAPI } from "../utils/api"
import { getMusicUrl } from "../api/getMusicUrl"

export default function usePlay(location: string, isPaused: Ref<Boolean> | ComputedRef<Boolean>) {
  // 播放音乐
  function play(row: any, playType: string) {
    console.log(row)
    console.log(playType)
    store.commit('changePlayType', playType)
    let params = {
      id: row.id,
      realIP: '116.25.146.177'
    }
    let musicInfo: Music = row
    getMusicUrl(params).then(res => {
      var musicUrl = res.musicUrl
      store.commit("changeMusicUrl", musicUrl)
      store.commit("changeMusicInfo", musicInfo)
      if(playType === 'doubleclick' || playType === 'playbutton') {
        store.commit("changeMusicPausedStatus", false)
      } else {
        store.commit("changeMusicPausedStatus", isPaused.value)
      }
      store.commit("musicChanged")
      if (location == 'queue') {
        let ids = []
        for (const item of musicQueue.value) {
          ids.push(item.id)
        }
        store.commit("changeNowIndex",ids.indexOf(musicInfo.id))
      }
    })
    addToQueue(row, 'doubleclick')
  }

  function doubleClickPlay(row: any) {
    play(row, 'doubleclick')
  }
  // 添加到播放列表
  const musicQueue = computed(() => store.state.musicQueue)
  function addToQueue(row: any, addType: string) {
    let music: Music = row
    let ids = []
    for (const item of musicQueue.value) {
      ids.push(item.id)
    }
    if(ids.indexOf(music.id) == -1) {
      // this.beginAnimation(e.x,e.y)
      setTimeout(() => {
        store.commit('changeQueueStyle', 'add')
        store.commit('addMusicToQueue', music)
      }, 500)
      setTimeout(() => {
        store.commit('changeQueueStyle', 'normal')
      }, 1000)
    } else {
      if (addType != 'doubleclick') {
        ElMessage({
          type: 'warning',
          message: "已经在播放列表中了",
          showClose: true
        })
      }
    }
  }

  return {
    play,
    doubleClickPlay,
    addToQueue,
  }
}