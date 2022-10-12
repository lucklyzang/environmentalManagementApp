// 登录信息store的初始值
export function getDefaultLoginState() {
    return {
        userInfo: null, //用户信息
        appId: '', //appId
        isGetCode: false, //是否获取过code
        isLogin: false, //是否登录
        openId: '', //微信支付相关的参数
        token: null, //请求token
        isShowLoginHint: true, //是否展示登录提示框状态
        isShowNameAuthHint: true, //是否展示实名认证提示框状态
        isTokenExpired: '' // token是否过期
    }
};
// 产品信息store的初始值
export function getDefaultCleanManagementState() {
    return {
       currentCleanTaskName: 1
    }
};