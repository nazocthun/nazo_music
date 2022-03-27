import { id } from "element-plus/lib/locale"
import { MutationTree } from "node_modules/vuex/types"
import { RootState } from "./types"

const mutations: MutationTree<RootState> = {
  changeMusicUrl(state: RootState, url: string){
    state.globalMusicUrl = url
  },
  changeMusicInfo(state: RootState, info: any){
    state.globalMusicInfo = info
  },
  changeCurrentTime(state: RootState, time: any){
    state.globalCurrentTime = time
  },
  changeMusicPausedStatus(state: RootState, status: boolean){
    state.isMusicPaused = status
  },
  addMusicToQueue(state: RootState, music: Music){
    let ids = []
    for (const item of state.musicQueue) {
      ids.push(item.id)
    }
    if(!ids.includes(music.id))
      state.musicQueue.push(music)
  },
  addMusicToHistory(state: RootState, music: Music){
    let ids = []
    ids.push(music)
    for (const item of state.musicHistoryQueue) {
      ids.push(item.id)
    }
  },
  deleteMusic(state: RootState, id: number){
    let queue = state.musicQueue
    for(let i = 0 ; i<queue.length ; i++){
      if(queue[i].id === id){
        queue.splice(i,1)
      }
    }
  },
  clearMusicQueue(state: RootState){
    state.musicQueue = []
  },
  changeNowIndex(state: RootState, index: number){
    state.nowIndex = index
  },
  deleteToNext(state: RootState){
    state.deleteToNext = !state.deleteToNext
  },
  changeQueuePos(state: RootState, pos: any){
    state.queuePos = pos
  },
  changeQueueStyle(state: RootState, status: any){
    state.queueStyle = status
  },
  musicChanged(state: RootState) {
    state.musicChangedFlag = !state.musicChangedFlag
  },
  changePlayType(state: RootState, type: string) {
    console.log(type)
    state.playType = type
  }
}

export default mutations