import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import App from './App.vue'
import router from './router'
import './access.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd)
app.provide('appLocale', zhCN)

app.mount('#app')
