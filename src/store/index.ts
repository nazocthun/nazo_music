import { ref } from 'vue'
import Vuex, { StoreOptions } from 'vuex'
import { RootState } from './types'
import mutations from './mutations'

const store: StoreOptions<RootState> = {
  state: {
    globalMusicUrl:"",
    globalMusicInfo:{},
    globalCurrentTime:0,
    isMusicPaused:true,
    musicQueue:[],
    musicHistoryQueue: [],
    nowIndex:0,
    deleteToNext:false,
    queuePos:{},
    queueStyle:'normal',
    musicChangedFlag: true,
    playType: ''
  },
  mutations
}

export default new Vuex.Store<RootState>(store)