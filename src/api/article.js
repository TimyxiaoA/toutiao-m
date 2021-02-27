/*
  文章相关的接口请求模块
 */

import request from '@/utils/request.js'

/* 获取频道新闻内容 */

export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
