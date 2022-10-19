// 登录信息store的初始值
export function getDefaultLoginState() {
    return {
        userInfo: null, //用户信息
        permissionInfo: [], //权限列表
        roleNameList: [], //角色列表
        isLogin: false, //是否登录
        token: null, //请求token
        overDueWay: false // 过期方式
    }
};
// 环境管理信息store的初始值
export function getDefaultEnvironmentManagementState() {
    return {
       currentCleanTaskName: 1,
       currentCleanTaskDateVlue: ''
    }
};