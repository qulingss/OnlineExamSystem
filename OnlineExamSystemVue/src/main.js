// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import echarts from 'echarts'
import axios from 'axios'
import './assets/font/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueCookies from 'vue-cookies'
import '@/../config/initialize'
import store from '@/vuex/store'

Vue.use(ElementUI)
Vue.use(VueCookies)
const service = axios.create({
  baseURL: '/api', // 若后端接口有前缀，需配置
  timeout: 60000,
  withCredentials: true // 允许携带Cookie，用于Session认证
})

// 请求拦截器：自动携带登录后的Token/Session信息
service.interceptors.request.use(
  config => {
    // 若后端是Token认证：从本地存储中获取Token，放在请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 若后端是Session认证：浏览器会自动携带Cookie，无需额外配置（确保登录后会话未失效）
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
Vue.config.productionTip = false
Vue.prototype.bus = new Vue()
Vue.prototype.$echarts = echarts
Vue.prototype.$axios = service  // 使用配置好的service实例，而不是原始的axios

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
