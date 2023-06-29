import request from '@/utils/request'

export function changePassword(data) {
  return request({
    url: '/webInfo/changePassword',
    method: 'post',
    data: data
  })
}

export function changeName(data) {
  return request({
    url: '/webInfo/changeName',
    method: 'post',
    data: data
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/webInfo/changeAvatar',
    method: 'post',
    data: data
  })
}
