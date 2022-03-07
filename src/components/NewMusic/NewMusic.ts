import { ref } from 'vue'
import { getNewSongsAPI } from '@/utils/api'
import { durationToTimeStamps } from '@/utils/utils'
import { getArtistsName, getAlbumName } from '@/utils/tools'

export function useNewMusic() {
  let params = {
    type: 0
  }
  let loading = ref(true)
  const tableData = ref([{}])

  function init() {
    getNewSongsAPI(params).then(res => {
      let resultList = res.data.data.slice(0,50)
      let songsList = []
      for (const item of resultList) {
        let song = {
          id: item.id,
          name: item.name,
          artists: getArtistsName(item.artists).join('，'),
          album: getAlbumName(item.album),
          duration: durationToTimeStamps(item.duration),
          url: item.mp3Url,
          cover: item.album.picUrl,
        }
        songsList.push(song)
      }
      tableData.value = songsList
      loading.value = false

      console.log(songsList)
    })
  }
  return {
    init,
    loading,
    tableData,
  }
}