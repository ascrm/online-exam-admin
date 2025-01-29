/** @format */

import { createApp } from 'vue'
import App from './App.vue'

import '@/styles/index.scss'
// svg icons
import 'virtual:svg-icons-register'
// element plus
import ElementPlus from 'element-plus'
// element icons
import * as Icons from '@element-plus/icons-vue'
// custom directives
import directives from '@/directives/index'
// vue Router
import router from '@/routers'
// vue i18n
import I18n from '@/languages/index'
// pinia store
import pinia from '@/stores'
// errorHandler
import errorHandler from '@/utils/errorHandler'

const app = createApp(App)

app.config.errorHandler = errorHandler

// register the element Icons component
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons])
})

app.use(ElementPlus).use(directives).use(router).use(I18n).use(pinia).mount('#app')
