import Vue from 'vue'
import Vuex from 'vuex'

import { setItem, getItem } from '@/utils/storage.js'

Vue.use(Vuex)
const TOKEN_KEY = 'USER_KEY'
export default new Vuex.Store({
  state: {
    // 储存当前登录用户信息(token等数据)
    // user: null
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      // 为防止刷新丢失,需要把 token 储存到本地储存中
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
