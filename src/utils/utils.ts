// 公用函数
export function durationToTimeStamps(duration: number): string {
  let min = Math.floor(duration / 60000)
  let second = Math.floor((duration % 60000) / 1000)
  return min.toString().padStart(2, '0') + ':' + second.toString().padStart(2, '0')
}