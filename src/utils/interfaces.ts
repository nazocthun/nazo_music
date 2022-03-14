// 解析音乐 接口和方法

export interface albumInfo {
  picUrl: string,
  info: {
    commentCount: number,
  }
  publishTime: number | string,
  description: String,
}

interface song {
  dt: Number // 时长
}