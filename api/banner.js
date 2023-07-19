import request from '@/utils/request'

// 获取首页标语
export function getBanner() {
  return request({
    url: '/api/banner',
    method: 'get',
  })
}

// 设置首页标语
export function setBanner(data){
  console.log(0)
  return request({
    url: '/api/banner/uploadInfo',
    method: 'post',
    data
  })
}