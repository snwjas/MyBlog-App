import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/404',
      component: () => import('@/views/404'),
      meta: { title: '404' },
      hidden: true
    },
    // 首页
    {
      path: '/',
      name: 'Index',
      meta: { title: '首页' },
      component: () => import('@/views/Index')
    },
    // 博客文章
    {
      path: '/blog/:url',
      name: 'Blog',
      meta: { title: '博客' },
      component: () => import('@/views/Blog')
    },
    // 归档
    {
      path: '/archive',
      name: 'Archive',
      meta: { title: '博客' },
      component: () => import('@/views/Archive')
    },
    // 搜索
    {
      path: '/search/:keyword',
      name: 'Search',
      meta: { title: '搜索' },
      component: () => import('@/views/Index')
    },
    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
  ]
})
