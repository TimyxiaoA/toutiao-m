import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//! 推荐使用下载的本地字体图标防止线上链接出错
import './styles/font/iconfont.css'

// 引入 vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

import 'amfe-flexible'

import './utils/dayjs.js'

// 加载 vant
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
