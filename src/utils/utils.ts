// 公用函数
export function durationToTimeStamps(duration: number): string {
  let min = Math.floor(duration / 60000)
  let second = Math.floor((duration % 60000) / 1000)
  return min.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0')
}

export  function formatDate(now: Date): string { 
  var year = now.getFullYear()
  var month = (now.getMonth() + 1).toString().padStart(2, '0')
  var date = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${date}`
}