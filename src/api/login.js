import request from '@/utils/request'

// 发送手机验证码(登录)
export function sendPhoneAuthCode(mobile) {
    return request({
        url: `app/verify/${mobile}`,
        method: 'post'
    })
};

// 手机验证码登录
export function phoneAuthCodeLogin(data) {
    return request({
        url: 'app/login',
        method: 'post',
        data
    })
};

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

// 查询appId
export function getAppId() {
    return request({
        url: 'app/appId',
        method: 'get'
    })
};

// 查询用户状态
export function getPurchaserStatus() {
    return request({
        url: '/app/purchaser/status',
        method: 'get'
    })
};

// 获取openId
export function getOpenId(code) {
    return request({
        url: `app/openId/${code}`,
        method: 'get'
    })
};

// 获取邀请码
export function getInviteCode() {
    return request({
        url: '/app/invite',
        method: 'post'
    })
};

// 查询邀请码生成记录
export function getInviteCodeRecords() {
    return request({
        url: '/app/invites',
        method: 'get'
    })
};