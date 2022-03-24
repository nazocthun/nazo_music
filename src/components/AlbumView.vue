<template>
  <div class="max-w-[1300px] my-0 mx-auto p-5" v-loading="loading">
    <div class="flex">
      <div class="w-25 h-25">
        <img class="h-full w-full" :src="getCompressedImgUrl(albumInfo.picUrl, 500)" alt="">
      </div>
      <div class="px-5 py-0 flex-1">
        <div class="text-2xl font-bold flex items-center">
          <div class="text-orange-700 border-solid border border-orange-700 inline-block text-xl mr-2 rounded px-2 py-0 cursor-default">专辑</div>
          {{albumInfo.name}}
        </div>
        <div class="items-center text-sm">
          <div class="playlist-user-name">歌手：{{artistName}}</div>
          <div class="playlist-user-name">时间：{{albumInfo.publishTime}}</div>
          <div class="playlist-user-name">共{{albumInfo.size}}首</div>
        </div>
        <div class="inline-block mr-2 rounded-2xl bg-orange-700 py-1 px-4 text-white cursor-pointer" @click="playAll"> 播放全部</div>
      </div>
    </div>
    <div class="songs-table">
      <el-table :data="tableData" stripe @row-dblclick="doubleClickPlay">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="name" label="音乐标题" width=""></el-table-column>
        <el-table-column prop="artistInfo" label="歌手" width="">
          <template #default="scope">
            <div v-for="(singer,i) in scope.row.ar" :key="i" style="color:#2980b9;display:inline-block">
              <span style="cursor:pointer;" @click="toArtist(singer.id)">{{singer.name}}</span>
              <span style="color:#606266;" v-show="scope.row.ar.length != 1 && i!=scope.row.ar.length-1">
                &amp;&nbsp;
              </span>
            </div>
          </template>                                                                 
        </el-table-column>                          

        <el-table-column prop="al.name" label="专辑" >
          <template #default="scope">
            <span style="cursor:pointer;color:#2980b9;" @click="toAlbum(scope.row.al.id)">{{scope.row.al.name}}</span>
            <span class="plus" title="添加至待播列表" @click="addToQueue(scope.row, 'plus')">+</span>
          </template>
        </el-table-column>

        <el-table-column prop="dt" label="时长" width="100"></el-table-column>                            
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { albumAPI } from '@/utils/api'
import { durationTimeFormat, formatDate, getCompressedImgUrl } from '@/utils/utils'
import usePlay from '@/hooks/usePlay'

const store = useStore()
const loading = ref(true)
const musicQueue = computed(() => store.state.musicQueue)



const albumId = ref()
onMounted(() => {
  albumId.value = route.query.id
  params.id = albumId.value
  getAlbumInfo(params)
  // this.getComments(true)
})

//API参数
let params = {
  id: 0,
  realIP: '116.25.146.177'
}

// 通过API获得Album数据
const albumInfo = ref<albumInfoTypes>()
const commentCount = ref()
const artistName = ref()
const albumDescList = ref()
const tableData = ref([])
function getAlbumInfo(params: Object) {
  albumAPI(params).then( res => {
    albumInfo.value = res.data.album
    console.log(albumInfo.value)
    commentCount.value = albumInfo.value.info.commentCount
    artistName.value = res.data.album.artist.name
    albumInfo.value.publishTime = formatDate(new Date(albumInfo.value.publishTime))
    for(let item of res.data.songs){
      let duration = item.dt
      item.dt = durationTimeFormat(duration)
    }
    tableData.value = res.data.songs
    let albumDesc = albumInfo.value.description
    albumDescList.value = albumDesc.split(/[\n]/)
  }).then(() => {
    setTimeout(() => {
      loading.value = false
    }, 500);
  })
}

// 播放音乐, 加入队列Hook
const { play, doubleClickPlay, addToQueue } = usePlay('album', ref(false))

function playAll() { // TODO:
  // let allSongs = tableData.value
  // store.commit('clearMusicQueue')
  // for (const item of allSongs) {
  //   let obj = {
  //     duration:item.dt,
  //     id:item.id,
  //     imgUrl:item.al.picUrl,
  //     singer:item.ar[0].name,
  //     songName:item.name
  //   }
  //   store.commit('changeMusicQueue',obj)
  // }
  // // 若第一首歌无版权无法播放，会出现bug，自动播放也是
  // store.commit('changeNowIndex',0)
  // play(allSongs[0])
}

// 路由跳转
const route = useRoute()
const router = useRouter()
function toArtist(id: any) {
  console.log(id)
  router.push(`/artist?artistId=${id}`)
}
function toAlbum(id: any){
  console.log(id)
  router.push(`/album?id=${id}`)
}

const activeName = ref('first')


// 监视路由变化
watch(() => route, (newValue, _oldValue) => {
  albumId.value = newValue.params.id
  params.id = albumId.value
  getAlbumInfo(params)
  // this.getComments(true)

  setTimeout(() => {
    activeName.value = "first"
    loading.value = false
  }, 0)
})

</script>

<style scoped>
.add-ball {
        position: fixed;
        color: rgb(236, 65, 65);
        transition: top .5s ease-in,left .5s linear;
    }

    ul {
        list-style: none;
    }

    .playlist-user-info img {
        margin: 10px 0;
    }

    .playlist-user-avatar img {
        height: 30px;
        width: 30px;
        border-radius: 50%;
    }

    .playlist-user-name {
      @apply mx-[10px] my-5
    }

    .playlist-tags {
        margin: 10px 0;
    }

    .playlist-desc {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .playlist-desc span:nth-of-type(2){
        font-size: 14px;
    }

    .playlist-tags .tags {
        font-size: 14px;
    }

    .playlist-tags .tags:not(:last-of-type)::after {
        content: '/';
        margin: 0 4px;
    }

    .playlist-tabs-wrap {
        margin-top: 20px;
    }

  .el-table td, .el-table th.is-leaf {
    border-bottom: none;
  }

  .el-table::before {
    opacity: 0;
  }

  .songs-table {
    width: 100%;
  }

  .img-wrap {
    width: 60px;
    height: 60px;
    position: relative;
  }

  .img-wrap img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .img-wrap p::before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 30px;
    height: 30px;
    background-color: rgba(255, 255, 255, .8);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #c0392b;
    font-size: 14px;
    cursor: pointer;
  }
  
  .comment-title {
    margin-bottom: 20px;
  }

  .comment-wrap ul li {
    display: flex;
    margin: 10px 0 30px 0;
  }

  .comment-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .comment-info {
    flex: 1;
    font-size: 14px;
    margin-left: 10px;
  }

  .comment {
    margin-bottom: 10px;
  }

  .comment-user {
    color: #517eaf;
    margin-right: 10px;
    cursor: pointer;
  }

  .comment-content {
    display: inline;
  }

  .comment-time {
    color: grey;
    margin-right: 20px;
    margin-top: 5px;
  }

  .comment-bottom {
    display: flex;
    align-items: center;
    font-size: 14px!important;
  }

  .re-comment {
    background-color: #f3f1f3;
    padding: 5px 10px;
    color: rgba(0,0,0,.6);
    margin-bottom: 5px;
  }

  .dd {
    line-height: 2.5rem;
    text-indent: 2rem;
    margin: 1rem 0;      
  }

  .tt {
    font-weight: bold;
    font-size: 20px;
    display: inline-block;
    margin: 10px 0;      
  }
</style>