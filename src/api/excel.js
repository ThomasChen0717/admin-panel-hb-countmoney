import request from '@/utils/request'

export function upload(formData, config) {
  return request({
    url: '/excel/updateFile',
    method: 'post',
    data: formData,
    headers: config
  })
}