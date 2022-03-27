import { createApp } from 'vue'
import App from './App.vue'
import * as Icons from '@element-plus/icons-vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import './style/tailwind.css'
import './style/custom.css'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
const app = createApp(App)


let requireAll = (requireContext: __WebpackModuleApi.RequireContext) => 
	requireContext.keys().forEach(requireContext)
const req = require.context("./assets/icon", true, /\.svg$/)
requireAll(req)


Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons])
})

app.use(lazyPlugin, {
  loading: require('@/assets/loading.png'),
  error: require('@/assets/error.png')
})

app.component(
  'SvgIcon',
  SvgIcon
)

app.use(store).use(router).mount('#app')