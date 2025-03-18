import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 直接导入bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// 导入bootstrap JS (如果需要其交互功能)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
// 导入bootstrap图标
import 'bootstrap-icons/font/bootstrap-icons.css'

// 设置axios默认配置
axios.defaults.baseURL = 'http://localhost:3000/api'

// 创建pinia store
const pinia = createPinia()
const app = createApp(App)

// 先使用pinia，再使用router
app.use(pinia)
app.use(router)

app.mount('#app')
