import { getRequest } from '@/utils/request'
import { AxiosResponse } from 'axios'

const REQUEST_URL = {
  songUrl: '/song/url',
}

export const getMusicUrl = (params = {}) => {
  return getRequest(REQUEST_URL.songUrl, params).then(convertMusicUrl)
}

export const convertMusicUrl = async (res: AxiosResponse<any> ): Promise<musicUrl> => {
  return {
    musicUrl: res.data.data[0].url,
  }
}