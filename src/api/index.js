import request from '@/utils/request'

const api = '/api/app'

// 获取博客的基本属性
export function getAttributes() {
  return request({
    url: `${api}/attributes`,
    method: 'get'
  })
}

// 关于我
export function getAboutMe() {
  return request({
    url: `${api}/about-me`,
    method: 'get'
  })
}

