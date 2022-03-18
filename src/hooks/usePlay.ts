import store from "@/store"
import { ElMessage } from 'element-plus'
import { ComputedRef, Ref, computed } from 'vue'
import { playMusicAPI } from "../utils/api"
import { musicInfoTypes } from '@/utils/interfaces'

export default function usePlay(location: string, isPaused: Ref<Boolean> | ComputedRef<Boolean>) {
  
  function play(row: any) {
    let params = {
      id: row.id,
      realIP: '116.25.146.177'
    }
    console.log(row)
    playMusicAPI(params).then(res => {
      if (res.data.code === 200) {
        let url = res.data.data[0].url
        let musicInfo = {} as musicInfoTypes
        musicInfo.id = row.id
        musicInfo.imgUrl = row.imgUrl
        musicInfo.artistInfo = row.artistInfo
        musicInfo.songName = row.name
        musicInfo.duration = row.duration
        if (location == 'album') {
          musicInfo.imgUrl = row.al.picUrl
          musicInfo.artistInfo = row.ar
          musicInfo.duration = row.dt
        } else if (location == 'queue') {
          musicInfo.songName = row.songName
        }
        store.commit("changeMusicUrl", url)
        store.commit("changeMusicInfo", musicInfo)
        store.commit("changeMusicPausedStatus", isPaused.value)
        store.commit("musicChanged")
      }
    })
    addToQueue(row, 'doubleclick')
  }

  const musicQueue = computed(() => store.state.musicQueue)
  function addToQueue(row: any, addType: string) {
    console.log(row)
    let obj = {} as musicInfoTypes
    obj.id = row.id
    obj.imgUrl = row.imgUrl
    obj.duration = row.duration,
    obj.artistInfo = row.artistInfo,
    obj.songName = row.name
    if (location == 'album') {
      obj.imgUrl = row.al.picUrl
      obj.artistInfo = row.ar
      obj.duration = row.dt
      obj.songName = row.name
    }
    let ids = []
    for (const item of musicQueue.value) {
      ids.push(item.id)
    }
    if(ids.indexOf(obj.id) == -1){
      // this.beginAnimation(e.x,e.y)
      setTimeout(() => {
        store.commit('changeQueueStyle','add')
        store.commit('changeMusicQueue',obj)
      }, 500)
      setTimeout(() => {
        store.commit('changeQueueStyle','normal')
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
    addToQueue,
  }
}