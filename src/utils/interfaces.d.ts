declare interface albumInfoTypes {
  name: string,
  size: number,
  picUrl: string,
  info?: {
    commentCount: number,
  }
  publishTime: number | string,
  description?: String,
}

declare interface albumTopInfoTypes {
  picUrl: string,
  name: string,
  musicSize: number,
  albumSize: number,
}

declare interface similarArtistTypes {
  id: number,
  name: string,
  picUrl: string,
}

declare interface musicUrl {
  musicUrl: string
}

declare interface musicInfoTypes {
  musicUrl: string,
  imgUrl: string,
  artistInfo: Object,
  songName: string,
  id: number,
  duration: number
}

declare interface Music {
  id: number; // 歌曲id
  name: string; // 歌曲名
  picUrl?: string; // 专辑封面url
  alias?: string; // 歌曲别名
  artists: Artist[]; // 艺人信息
  album?: Album;  // 专辑信息
  duration?: number; // 歌曲时长
  time?: string; // 歌曲时长格式化
  mvId?: number; // mv id
}

declare type Artist = {
  id: number; // 艺人id
  name: string; //艺人名
  picUrl?: string; //艺人图片
}