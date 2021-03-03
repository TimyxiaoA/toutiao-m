/*
  搜索相关的接口请求模块
 */

import request from '@/utils/request.js'

/* 获取搜索建议 */

export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: { q }
  })
}

/* 获取搜索结果 */

export const getSearchResult = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
