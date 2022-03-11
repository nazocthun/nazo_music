import { ref } from 'vue'
import { getNewSongsAPI, playMusicAPI } from '@/utils/api'
import { durationToTimeStamps } from '@/utils/utils'
import { getArtistsName, getAlbumName } from '@/utils/tools'
import store from '@/store'

export function useNewMusic() {
  let params = {
    type: 0,
    realIP: '116.25.146.177'
  }
  let loading = ref(true)
  const tableData = ref([{}])

  interface tableData {
    id: Number,
    name: String,
    artists: String,
    album: String,
    duration: String,
    url: String,
    cover: String,
  }

  function init() {
    getNewSongsAPI(params).then(res => {
      let resultList = res.data.data.slice(0,50)
      console.log(resultList)
      let songsList = []
      for (const item of resultList) {
        let song = {
          id: item.id,
          name: item.name,
          artists: getArtistsName(item.artists).join('，'),
          artistInfo:item.artists,
          album: getAlbumName(item.album),
          duration: durationToTimeStamps(item.duration),
          imgUrl:item.album.picUrl,
          url: item.mp3Url,
          cover: item.album.picUrl,
        }
        songsList.push(song)
      }
      tableData.value = songsList
      loading.value = false

      // console.log(songsList)
    })
  }

  function play(row: any) {
    console.log(row)
    let params = {
      id: row.id,
      realIP: '116.25.146.177'
    }

    playMusicAPI(params).then(res => {
      if (res.data.code === 200) {
        let url = res.data.data[0].url

        let musicInfo = {
          imgUrl:row.imgUrl,
          artistInfo:row.artistInfo,
          // singer:row.singer,
          songName:row.name,
          artistId:row.artistId,
          id:row.id,
          duration:row.duration
        }
        console.log(url)
        store.commit("changeMusicUrl", url)
        store.commit("changeMusicInfo", musicInfo)
        store.commit("changeMusicStatus", false)
      }
    })

  }

  return {
    init,
    play,
    loading,
    tableData,
  }
}