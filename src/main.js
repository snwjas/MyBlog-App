import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '@/styles/index.scss' // global css

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

Vue.use(ElementUI)

// NProgress Configuration
NProgress.configure({ showSpinner: false })
const blogName = store.getters.attributes.name || 'MyBlog'
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // 修改页面title
  document.title = to.meta.title ? `${to.meta.title} | ${blogName}` : blogName
  next()
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

// 监听滚动条，$scroll 滚动条属性
Vue.prototype.$scroll = { scrollNow: 0, scrollOld: 0 }
window.addEventListener('scroll', () => {
  Vue.prototype.$scroll.scrollOld = Vue.prototype.$scroll.scrollNow
  Vue.prototype.$scroll.scrollNow = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
})

const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
Vue.use(vm)
