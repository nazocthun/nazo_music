import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import * as Icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import router from './router'
import store from './store'

const app = createApp(App)


Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons])
})

app.use(store).use(router).use(ElementPlus).mount('#app')