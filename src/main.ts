/**
 * @file main.ts
 * @description 应用入口文件，创建 Vue 应用并挂载 Pinia、Router。
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import 'md-editor-v3/lib/style.css'

const app = createApp(App)

// 全局错误处理器 —— 最后的安全网
app.config.errorHandler = (err, _instance, info) => {
  console.error('[Vue Global Error]', err)
  console.error('[Error Info]', info)
}

app.use(createPinia())
app.use(router)

app.mount('#app')
