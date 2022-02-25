import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import { scrollToElement } from '@/utils'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import '@/styles/index.scss' // global css
Vue.use(ElementUI)

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import 'katex/dist/katex.min.css' // latex

import '@/plugin/highlightjs'// highlightjs

import 'vue-cute-timeline/dist/index.css'

// main-content
Vue.prototype.$getContentTop = function() {
  const $elem = document.getElementById('main-content')
  return $elem ? $elem.offsetTop : window.screenTop
}
Vue.prototype.$scrollToContent = function() {
  scrollToElement('#main-content')
}

// NProgress Configuration
NProgress.configure({ showSpinner: false })
const blogName = store.getters.attributes.name || 'MyBlog'
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // 修改页面title
  document.title = to.meta.title ? `${to.meta.title} | ${blogName}` : blogName
  if (store.getters.attributes && Object.keys(store.getters.attributes).length === 0) {
    await store.dispatch('info/getAttributes')
  }
  if (store.getters.profile && Object.keys(store.getters.profile).length === 0) {
    await store.dispatch('info/getProfile')
  }
  next()
})
router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

const vm = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
Vue.use(vm)
