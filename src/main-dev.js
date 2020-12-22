import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font/iconfont.css'
import axios from 'axios'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 配置请求根路径
axios.defaults.baseURL = 'http://192.168.90.7:8080/'
// axios请求拦截器，请求头必须含有 Authorization ,在 request 拦截器中，展示进度条 Nprogress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  return config
})
// 在 response 拦截器中，隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 将axios挂载在vue实例上
Vue.prototype.$http = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
