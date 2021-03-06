/*
  请求模块
*/

import axios from 'axios'

import store from '@/store/index.js'

import jsonBig from 'json-bigint'

// 创建 axios 实例设置不同的配置
const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/',

  transformResponse: [
    function(data) {
      try {
        // 如果转换成功则返回转换的数据结果
        return jsonBig.parse(data)
      } catch (err) {
        // 如果转换失败，则包装为统一数据格式并返回
        return data
      }
    }
  ]
})

/* 请求拦截器 */
// Add a request interceptor
request.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    const { user } = store.state
    // !未登陆时没有user 就不需要配置 headers
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

export default request
