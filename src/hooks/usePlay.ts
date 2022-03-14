import store from "@/store"
import { playMusicAPI } from "../utils/api"

export default function usePlay() {
  function play(row: any) {
    let params = {
      id: row.id,
      realIP: '116.25.146.177'
    }
    playMusicAPI(params).then(res => {
      if (res.data.code === 200) {
        let url = res.data.data[0].url
        let musicInfo = {
          imgUrl: row.imgUrl ? row.imgUrl : row.al.picUrl,
          artistInfo: row.artistInfo ? row.artistInfo : row.ar,
          // singer:row.singer,
          songName: row.name,
          artistId: row.artistId,
          id: row.id,
          duration: row.duration ? row.duration : row.dt
        }
        store.commit("changeMusicUrl", url)
        store.commit("changeMusicInfo", musicInfo)
        store.commit("changeMusicStatus", false)
      }
    })
  }
  return {
    play,
  }
}