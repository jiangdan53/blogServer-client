import request from '@/utils/request'
export function getBlogClassAll (){
    return request('/api/blogclass')
}
/**
 * 
 * @param {Object} data {blogName:string,order:number}
 */

export function setBlogClassOne(data){
    return request({
        url: '/api/blogclass/addblogClass',
        method: 'post',
        data
    })
}
export function updataBlogClass(data,id){
    return request({
        url:'/api/blogclass/updataClass',
        method:'put',
        data,
        params:{
            id
        }
    })
}
export function deleteBlogClass(id){
    console.log('sss')
return request({
    url:'/api/blogclass/deleteClass',
    method:'delete',
    params:{
        id
    }
})
}