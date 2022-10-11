import request from '@/utils/request'
// 退出登录
export function logout(data) {
    return request({
        url: 'app/logout',
        method: 'post',
        data
    })
};

// 用户注销
export function cancellatio() {
    return request({
        url: '/app/cancellation',
        method: 'post'
    })
};