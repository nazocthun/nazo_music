import { getRequest } from '@/utils/request'
import { AxiosResponse } from 'axios'
import { formatDate, durationTimeFormat, getCompressedImgUrl } from '@/utils/utils'

const REQUEST_URL = {
  info: '/album',
  comment: '/comment/album',
  count: '/album/detail/dynamic'
}

export const getAlbumInfo = (params = {}) => {
  return getRequest(REQUEST_URL.info, params).then(convertAlbumInfo)
}

export const convertAlbumInfo = async (res: AxiosResponse<any> ): Promise<Album> => {
  const albumInfo = res.data.album
  const musicInfo = res.data.songs
  
  return {
    id: albumInfo.id,
    name: albumInfo.name,
    size: albumInfo.size,
    artist: {
      id: albumInfo.artist.id,
      name: albumInfo.artist.name,
      picUrl: albumInfo.artist.picUrl
    },
    music: musicInfo.map( (item: { id: any; name: any; ar: { id: any; name: any; dts: any }[]; dt: any }) => {
      return {
        id: item.id,
        name: item.name,
        picUrl: getCompressedImgUrl(albumInfo.picUrl, 500),
        artists: item.ar.map( (item: { id: any; name: any; dts: any }) => {
          return {
            id: item.id,
            name: item.name,
            alias: item.dts,
          }
        }),
        album: {
          id: albumInfo.id,
          name: albumInfo.name,
        },
        duration: item.dt,
        time: durationTimeFormat(item.dt),
      }
    }),
    picUrl: getCompressedImgUrl(albumInfo.picUrl, 500),
    publishTime: formatDate(new Date(albumInfo.publishTime)),
  }
}