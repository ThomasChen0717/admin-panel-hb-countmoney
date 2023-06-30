import request from '@/utils/request'

export function getRoles(data) {
  return request({
    url: '/router/getRoles',
    method: 'post',
    data: data
  })
}

export function getRoleInfo() {
  return request({
    url: '/router/getRoles',
    method: 'post'
  })
}

export function addRole(data) {
  return request({
    url: '/router/addRole',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function updateRole(data) {
  return request({
    url: '/router/updateRole',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function deleteRole(data) {
  return request({
    url: '/router/deleteRole',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}
