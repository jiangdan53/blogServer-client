import request from '@/utils/request'

// 登录方法
export function loginApi(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}

// 恢复登录
export function getInfo() {
  return request({
    url: '/api/login/whoami',
    method: 'get',
  })
}


// 修改用户
export function setUser(data){
  return request({
    url : '/api/login/updataAdmin',
    method : 'PUT',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
