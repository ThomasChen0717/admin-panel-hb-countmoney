import request from '@/utils/request'

export function getUserCount(data) {
  return request({
    url: '/database/getUserCount',
    method: 'post',
    data: data
  })
}

export function getUserCountGraph(data) {
  return request({
    url: '/database/getUserCountGraph',
    method: 'post',
    data: data
  })
}

export function getClientVersion(){
  return request({
    url: '/database/getClientVersion',
    method: 'get'
  })
}

export function addNewClientVersion(data){
  return request({
    url: '/database/addNewClientVersion',
    method: 'post',
    data: data
  })
}

export function updateClientVersion(data){
  return request({
    url: '/database/updateClientVersion',
    method: 'post',
    data: data
  })
}

export function deleteClientVersion(data){
  return request({
    url: '/database/deleteClientVersion',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    },
  })
}