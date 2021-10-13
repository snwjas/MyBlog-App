import request from '@/utils/request'

const api = '/api/app/blog'

// 条件获取博客列表
export function listBlogs(data) {
  return request({
    url: `${api}/list`,
    method: 'post',
    data
  })
}

// 获取博客归档
export function listAchievement() {
  return request({
    url: `${api}/list/achievement`,
    method: 'get'
  })
}

// 获取博客内容
export function getBlog(url) {
  return request({
    url: `${api}/content/${url}`,
    method: 'get'
  })
}
