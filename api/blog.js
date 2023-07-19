import request from '@/utils/request'

// 分页获取文章
// page 代表页码数，limit 代表每一页显示的数量
export function findBlog(pageIndex=1,limit=10){
    return request({
        url : '/api/article/getblogall',
        method : 'get',
        params : {
            pageIndex,
            limit
        }
    })
}


// 删除文章
export function delOneBlog(id){
    return request({
        url : `/api/article/deletearticle/${id}`,
        method : 'delete'
    })
}
// 添加文章
export function addBlog(data){
    return request({
        url : '/api/article/addArticle',
        method : 'post',
        data
    })
}

// 编辑文章
// 倒时候调用这个接口时，需要传递一个对象
// {
//     id : 要修改的文章的 id,
//     data : 修改的文章的所有内容
// }
export function editBlog(blogInfo){
    return request({
        url : `/api/article/updataarticle/${blogInfo.id}`,
        method : 'put',
        data : blogInfo.data
    })
}


// 根据 id 查找某一篇文章
export function findOneBlog(id){
    return request({
        url : `/api/article/getblog/${id}`,
        method : 'get'
    })
}