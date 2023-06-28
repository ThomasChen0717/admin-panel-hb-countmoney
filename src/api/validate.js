import request from '@/utils/request'

export function checkUsername(data) {
  return request({
    url: '/webValidate/checkUsername',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function checkDisplayName(data) {
  return request({
    url: '/webValidate/checkDisplayName',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  })
}

export function checkOldPassword(data){
  return request({
    url: '/webValidate/checkOldPassword',
    method: 'post',
    data: data
  })
}

