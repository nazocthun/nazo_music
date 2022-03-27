// 公用函数
export function durationTimeFormat(duration: number): string {
  let min = Math.floor(duration / 60000)
  let second = Math.floor((duration % 60000) / 1000)
  return min.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0')
}

export function playControlTimeFormat(duration: number | undefined): string {
  if (typeof(duration) === 'undefined') {
    return '00:00'
  } else {
    let min = Math.floor(duration / 60)
    let second = Math.floor(duration % 60)
    return min.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0')
  }
}

export  function formatDate(date: Date): string { 
  var year = date.getFullYear()
  var month = (date.getMonth() + 1).toString().padStart(2, '0')
  var day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getCompressedImgUrl(url: string, size: number, type = 'square'): string {
  if (type === 'landscape') {
    return `${url}?param=${size}y${Math.floor(size/16*9)}`
  } else {
    return `${url}?param=${size}y${size}`
  }
}

export function playCountMinimize(playCount: number): string {
  if (playCount < 10000) {
    return playCount.toString()
  } else if (playCount < 100000000) {
    return (playCount / 10000).toFixed(1) + '万'
  } else {
    return (playCount / 100000000).toFixed(1) + '亿'
  }
}