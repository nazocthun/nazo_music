import request from '@/utils/request';

export function getMusicUrlAPI(params: Object){
  return request({
      url:'/song/url',
      method:'get',
      params
  })
}

export function getNewSongsAPI(params: Object) { // 获取新歌
  return request({
    url: '/top/song',
    method: 'get',
    params
  })
}

export function getNewAlbumsAPI(params: Object) { // 获取新专辑
  return request({
    url: '/top/album',
    method: 'get',
    params
  })
}

export function getNewMvsAPI(params: Object) { // 获取新mv
  return request({
    url: '/top/mv',
    method: 'get',
    params
  })
}

export function playMusicAPI(params: Object){
  return request({
      url:'/song/url',
      method:'get',
      params
  })
}