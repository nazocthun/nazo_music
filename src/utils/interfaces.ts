// 解析音乐 接口和方法

export interface albumInfoTypes {
  name: string,
  size: number,
  picUrl: string,
  info: {
    commentCount: number,
  }
  publishTime: number | string,
  description: String,
}

export interface albumTopInfoTypes {
  picUrl: string,
  name: string,
  musicSize: number,
  albumSize: number,
}

export interface similarArtistTypes {
  id: number,
  name: string,
  picUrl: string,
}

interface song {
  dt: Number // 时长
}