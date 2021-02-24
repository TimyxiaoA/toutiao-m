/*
  请求模块
*/

import axios from 'axios'

// 创建 axios 实例设置不同的配置
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

export default request
