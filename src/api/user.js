import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/web/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/web/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/web/logout',
    method: 'post'
  })
}

export function checkUsername(data) {
  return request({
    url: '/web/checkUsername',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function checkDisplayName(data) {
  return request({
    url: '/web/checkDisplayName',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function register(data) {
  console.log(data)
  return request({
    url: '/web/register',
    method: 'post',
    data: data
  })
}

