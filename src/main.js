import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入路由配置
import ElementPlus from 'element-plus' // 导入ElementPlus
import 'element-plus/dist/index.css' // 导入ElementPlus样式

const app = createApp(App)
app.use(router) // 注入路由
app.use(ElementPlus) // 注册ElementPlus
app.mount('#app')