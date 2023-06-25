import request from '@/utils/request'

export function upload(formData, config) {
  return request({
    url: '/tool/updateFile',
    method: 'post',
    data: formData,
    headers: config
  })
}
