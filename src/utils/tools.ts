// 解析音乐 接口和方法


interface sthWithName {
  name: string,
}

export function getArtistsName(artists: Array<sthWithName>): Array<string> {
  let artistsNames = []
  for (const artist of artists) {
    artistsNames.push(artist.name)
  }
  return artistsNames
}

export function getAlbumName(album: sthWithName): string {
  return album.name
}
