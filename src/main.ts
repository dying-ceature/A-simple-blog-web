/**
 * @file main.ts
 * @description 应用入口文件，创建 Vue 应用并挂载 Pinia、Router。
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
