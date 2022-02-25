import request from '@/utils/request'
import { jsonObj2FormData } from '@/utils'

const api = '/api/app'

// 条件获取博客列表
export function listBlogs(data) {
  return request({
    url: `${api}/blog/list`,
    method: 'post',
    data
  })
}

// 获取博客归档
export function listAchievement() {
  return request({
    url: `${api}/blog/list/achievement`,
    method: 'get'
  })
}

// 获取博客内容
export function getBlog(url) {
  return request({
    url: `${api}/blog/content/${url}`,
    method: 'get'
  })
}

// 获取评论列表
export function listComments(data) {
  return request({
    url: `${api}/comment/listr`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: jsonObj2FormData(data)
  })
}

// 发表评论
export function publishComment(data) {
  return request({
    url: `${api}/comment/publish`,
    method: 'post',
    data
  })
}
