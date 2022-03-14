import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '@/views/Index.vue'
import SongLists from '@/views/SongLists.vue'
import NewMusic from '@/views/NewMusic.vue'
import MusicVideo from '@/views/MusicVideo.vue'
import AlbumView from '@/components/AlbumView.vue'
import ArtistView from '@/components/ArtistView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/songlists',
    name: 'songlists',
    component: SongLists
  },
  {
    path: '/newmusic',
    name: 'newmusic',
    component: NewMusic
  },
  {
    path: '/musicvideo',
    name: 'musicvideo',
    component: MusicVideo
  },
  {
    path:'/album',
    component: AlbumView
  },
  {
    path:'/artist',
    component: ArtistView
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
