import request from '@/utils/request'
export function  getIcons(name){
    return request({
        method:'get',
        url:'/api/icon',
        params:{
            name
        }
    })
}