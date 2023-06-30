import request from '@/utils/request'

export function upload(formData, config) {
  return request({
    url: '/database/updateFile',
    method: 'post',
    data: formData,
    headers: config
  })
}

export function getUserCount(data) {
  return request({
    url: '/database/getUserCount',
    method: 'post',
    data: data
  })
}

