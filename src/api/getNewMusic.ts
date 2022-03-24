import { getRequest } from '@/utils/request'
import { AxiosResponse } from 'axios'
import { durationTimeFormat, getCompressedImgUrl } from '@/utils/utils'
const REQUEST_URL = '/top/song'

export const getNewMusic = (params = {}) => {
  return getRequest(REQUEST_URL, params).then(convertNewMusic)
}

export const convertNewMusic = (res: AxiosResponse<any> ): Music[] => {
  let data = res.data.data.slice(0, 50)
  if (!data || !data.length) return []
  return data.map((item: any) => {
    const { album, artists, duration, alias } = item
    return {
      id: item.id,
      name: item.name,
      picUrl: getCompressedImgUrl(album.picUrl, 200),
      alias: alias[0] || '',
      album: { id: album.id, name: album.name },
      artists: artists.map((item: Artist) => { return { id: item.id, name: item.name } }),
      duration: duration,
      time: durationTimeFormat(duration),
      mvId: item.mvid,
    }
  })
}