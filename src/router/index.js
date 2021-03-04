import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login') // vue 路由懒加载写法, @会默认到根路径的 src 文件夹中找
  },
  {
    path: '/',
    // name: 'layout', // 默认子路由已有 name,这里的 name 没有意义
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 默认子路由, 只能有一个
        name: 'home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/index.vue')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/index.vue')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/index.vue')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    // '/article/:articleId?' 可匹配 /article
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 将路由动态参数映射到组件的 props 中，更推荐这种做法 解耦
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
