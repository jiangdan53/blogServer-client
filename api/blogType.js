import request from '@/utils/request'

// 查看文章分类接口
export function getBlogType(id) {
    return request.get('/api/blog');
}

// 添加文章分类接口
export function addBlogType(data) {
    return request({
        url: '/api/blog/addblogType',
        method: 'post',
        data
    })
}

// 删除文章分类接口
export function delBlogType(id) {
    return request.delete(`/api/blog/deleteblogtype/${id}`);
}

// 查找某一个文章分类
export function findOneBlogType(id) {
    console.log('ss')
    return request({
        url: `/api/blog/getBlogTypeOne/${id}`,
        method: 'get',
    })
}

// 更新某一个文章分类
export function updateOneBlogType(editInfo) {
    return request({
        url: `/api/blog/updatablogtype`,
        method: 'put',
        data: editInfo
    })
}
