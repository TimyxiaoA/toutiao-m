/*
  用户相关的接口请求模块
 */

import request from '@/utils/request.js'
// import store from '@/store/index.js'

/* 用户登录 */
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}

/* 发送验证码 */
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

/* 获取用户自己的信息 */
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    /*  headers: {
      Authorization: `Bearer ${store.state.user.token}`
    } */
  })
}
