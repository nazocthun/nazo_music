interface musicQueueInfo {
  id: Number;
}

export interface RootState {
  globalMusicUrl: string,
  globalMusicInfo: Object,
  globalCurrentTime: Number,
  isMusicPaused: boolean,
  musicQueue: Array<musicQueueInfo>,
  musicHistoryQueue: Array<musicQueueInfo>,
  nowIndex: Number,
  deleteToNext: boolean,
  queuePos: Object,
  queueStyle: string,
  musicChangedFlag: boolean,
  playType: string
}