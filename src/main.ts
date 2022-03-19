import { createApp } from 'vue'
import App from './App.vue'
// import ElementPlus from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
// import 'element-plus/dist/index.css'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'

const app = createApp(App)


Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons])
})

app.use(lazyPlugin, {
  loading: require('@/assets/loading.png'),
  error: require('@/assets/error.png')
})

app.use(store).use(router).mount('#app')