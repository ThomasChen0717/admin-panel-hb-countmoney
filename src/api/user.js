import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/webLogin/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token) {
  return request({
    url: '/webLogin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/webLogin/logout',
    method: 'post'
  })
}

export function register(data){
  return request({
    url: '/webLogin/register',
    method: 'post',
    data: data
  })
}
