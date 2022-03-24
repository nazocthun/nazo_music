import http from '@/utils/request';

export function getMusicUrlAPI(params: Object){
  return http({
    url:'/song/url',
    method:'get',
    params
  })
}

export function getNewSongsAPI(params: Object) { // 获取新歌
  return http({
    url: '/top/song',
    method: 'get',
    params
  })
}

export function getNewAlbumsAPI(params: Object) { // 获取新专辑
  return http({
    url: '/top/album',
    method: 'get',
    params
  })
}

export function getNewMvsAPI(params: Object) { // 获取新mv
  return http({
    url: '/top/mv',
    method: 'get',
    params
  })
}

export function playMusicAPI(params: Object){
  return http({
    url:'/song/url',
    method:'get',
    params
  })
}

export function albumAPI(params: Object){
  return http({
    url:"/album",
    method:'get',
    params
  })       
}

export function artistsAPI(params: Object, type=""){
  let url = type=="" ? '/artists' : '/artist/'+type
  if(type == 'simi')
    url = '/simi/artist'
  return http({
    url,
    method:'get',
    params
  })     
}