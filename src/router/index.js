import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login') // vue 路由懒加载写法, @会默认到根路径的 src 文件夹中找
  }
]

const router = new VueRouter({
  routes
})

export default router
