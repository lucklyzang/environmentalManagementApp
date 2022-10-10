import request from '@/utils/request'

// 查询用户信息
export function inquareUserInfo() {
    return request({
        url: 'app/purchaser/info',
        method: 'get'
    })
};

// 修改昵称
export function changeNickname(data) {
    return request({
        url: 'app/purchaser/nickName',
        method: 'put',
        params: data
    })
};

// 修改签名
export function changeSignature(data) {
    return request({
        url: 'app/purchaser/signTxt',
        method: 'put',
        params: data
    })
};

// 修改头像
export function changeAvatar(data) {
    return request({
        url: 'app/purchaser/avatar',
        method: 'post',
        data
    })
};

// 实名认证
export function realNameArenhzneuthentication(data) {
    return request({
        url: 'app/purchaser/authentication',
        method: 'post',
        data
    })
};

// 查询首页作品列表
export function inquareProductList(data) {
    return request({
        url: 'app/index',
        method: 'get',
        params: data
    })
};

// 作品访问记录
export function productVisitRecord(id) {
    return request({
        url: `app/visit/${id}`,
        method: 'get'
    })
};

// 查询作品详情
export function inquareProductDetails(id) {
    return request({
        url: `app/one/${id}`,
        method: 'get'
    })
};

// 查询发售日厉
export function inquareSellCalendar() {
    return request({
        url: 'app/sale',
        method: 'get'
    })
};

// 作品访问记录
export function productsAccessRecord(id) {
    return request({
        url: `app/visit/${id}`,
        method: 'get'
    })
};

// 购买商品
export function purchaseCommodity(commId,inviteType,inviteId) {
    return request({
        url: !inviteId ? `app/order/${commId}` : `app/order/${commId}?inviteType=${inviteType}&inviteId=${inviteId}`,
        method: 'post'
    })
};

// 预付购买商品
export function presellPurchaseCommodity(commId,inviteType,inviteId) {
    return request({
        url: !inviteId ? `app/presale/${commId}` : `app/presale/${commId}?inviteType=${inviteType}&inviteId=${inviteId}`,
        method: 'post'
    })
};

// 创建支付订单
export function createPaymentOrder(data) {
    return request({
        url: 'app/pay',
        method: 'post',
        data
    })
};

// 取消订单
export function cancelOrder(orderId) {
    return request({
        url: `app/cancel/${orderId}`,
        method: 'post'
    })
};

// 查询支付结果
export function queryPaymentResult(orderId) {
    return request({
        url: `/app/pay/${orderId}`,
        method: 'get'
    })
};

// 查询订单列表
export function queryOrderList() {
    return request({
        url: 'app/orders',
        method: 'get'
    })
};

// 查询订单详情
export function queryOrderDetails(id) {
    return request({
        url: `app/order/${id}`,
        method: 'get'
    })
};

// 查询藏品记录
export function queryObjectRecord() {
    return request({
        url: 'app/record',
        method: 'get'
    })
};

// 查询首页banner列表
export function getBanner() {
    return request({
        url: '/app/banners',
        method: 'get'
    })
};

// 查询藏品记录详情
export function queryObjectRecordDetails(id) {
    return request({
        url: `app/record/${id}`,
        method: 'get'
    })
};

//藏品转增
export function transferObject(data) {
    return request({
        url: 'app/transfer',
        method: 'post',
        data
    })
};

//产品分享
export function productionShare(id) {
    return request({
        url: `/app/share/${id}`,
        method: 'get'
    })
};


//我的app分享
export function appShare() {
    return request({
        url: '/app/shareApp',
        method: 'get'
    })
};

// 使用图片
export function useObjectImg(id) {
    return request({
        url: `/app/use/${id}`,
        method: 'get'
    })
};

// 发送手机验证码(藏品转赠)
export function collectSendPhoneAuthCode() {
    return request({
        url: 'app/verify',
        method: 'post'
    })
};

// 查询展馆模板
export function queryHallTemplates(type) {
    return request({
        url: `app/templates?type=${type}`,
        method: 'get'
    })
};

// 查询展馆信息
export function queryHallMessage(type) {
    return request({
        url: 'app/gallery',
        method: 'get'
    })
};

// 发布展馆
export function publishHall(data) {
    return request({
        url: 'app/publish',
        method: 'put',
        data
    })
};

// 编辑展馆
export function edithHall(data) {
    return request({
        url: 'app/modify',
        method: 'put',
        data
    })
};

//查询相关协议
export function queryProtocolConfig(value) {
    return request({
        url: `app/config?key=${value}`,
        method: 'get',
    })
};

//查询转赠记录
export function transfersRecord() {
    return request({
        url: 'app/transfers',
        method: 'get'
    })
};

// 查询是否存在未读消息
export function queryUnRead() {
    return request({
        url: '/app/unRead',
        method: 'get'
    })
};

// 查询消息列表
export function queryNewsList() {
    return request({
        url: 'app/newsList',
        method: 'get'
    })
};

// 查询消息详情 /app/read/{id}
export function queryNewsDetails(id) {
    return request({
        url: `app/news/${id}`,
        method: 'get'
    })
};

// 消息设置为已读
export function setMessageRead(id) {
    return request({
        url: `app/read/${id}`,
        method: 'post'
    })
};