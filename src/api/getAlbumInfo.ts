import { getRequest } from '@/utils/request'
import { AxiosResponse } from 'axios'

const REQUEST_URL = {
  info: '/album',
  comment: '/comment/album',
  count: '/album/detail/dynamic'
}

export const getAlbumInfo = (id: number) => {
  return getRequest(REQUEST_URL.info, { id }).then(convertAlbumInfo)
}

export const convertAlbumInfo = async (res: AxiosResponse<any> ): Promise<albumInfoTypes> => {
  const albumInfo = res.data
  
  return {
    name: albumInfo.name,
    size: albumInfo.size,
    picUrl: albumInfo.picUrl,
    publishTime: albumInfo.publishTime,
  }
}