import request from '@/utils/request'

export async function getSetting() {
  return await request.get("/api/seeting");
}

export function setSetting(id,data) {
    return request({
        url: `/api/seeting/updataseeting/${id}`,
        method: 'put',
        data
    })
}
