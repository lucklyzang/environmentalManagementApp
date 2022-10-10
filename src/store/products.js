import { setStore, getStore } from '@/common/js/utils'
import { getDefaultProductsState } from '@/common/js/resetStore'
export default {
    state: getDefaultProductsState(),

    getters: {
        productsId: (state) => {
            state.productsId = getStore('productsId') ? JSON.parse(getStore('productsId')) : null;
            return state.productsId
        },

        swipeItemDetails: (state) => {
            state.swipeItemDetails = getStore('swipeItemDetails') ? JSON.parse(getStore('swipeItemDetails')) : null;
            return state.swipeItemDetails
        },

        inviteMessage: (state) => {
            state.inviteMessage = getStore('inviteMessage') ? JSON.parse(getStore('inviteMessage')) : null;
            return state.inviteMessage
        },
        
        orderId: (state) => {
            state.orderId = getStore('orderId') ? getStore('orderId') : '';
            return state.orderId
        },

        systemMessageId: (state) => {
            state.systemMessageId = getStore('systemMessageId') ? getStore('systemMessageId') : '';
            return state.systemMessageId
        },

        isPaying: (state)  => { 
            state.isPaying = getStore('isPaying') ? getStore('isPaying') === 'false' ? false : true : false
            return state.isPaying
        },

        isIosPaySuccess: (state)  => { 
            state.isIosPaySuccess = getStore('isIosPaySuccess') ? getStore('isIosPaySuccess') === 'false' ? false : true : false
            return state.isIosPaySuccess
        },

        isRefreshHomePage: (state) => {
            state.isRefreshHomePage = getStore('isRefreshHomePage') ? getStore('isRefreshHomePage') === 'false' ? false : true : false
            return state.isRefreshHomePage
        },

        isCanSendPhoneCode: (state)  => {
            state.isCanSendPhoneCode = getStore('isCanSendPhoneCode') ? getStore('isCanSendPhoneCode') === 'false' ? false : true : true
            return state.isCanSendPhoneCode
        },

        collectionId: (state)  => {
            state.collectionId = getStore('collectionId') ? JSON.parse(getStore('collectionId')) : null
            return state.collectionId
        },

        myObjects: (state)  => {
            state.myObjects = getStore('myObjects') ? JSON.parse(getStore('myObjects')) : []
            return state.myObjects
        },

        countdownTime: (state)  => {
            state.countdownTime = getStore('countdownTime') ? getStore('countdownTime') : 0
            return state.countdownTime
        },

        donationProductDetails: (state)  => {
            state.donationProductDetails = getStore('donationProductDetails') ? JSON.parse(getStore('donationProductDetails')) : null
            return state.donationProductDetails
        },

        isEnterVerificationCodePage: (state)  => {
            state.isPaying = getStore('isEnterVerificationCodePage') ? getStore('isEnterVerificationCodePage') === 'false' ? false : true : false
            return state.isEnterVerificationCodePage
        },

        isEnterDonationFriendPage: (state)  => {
            state.isPaying = getStore('isEnterDonationFriendPage') ? getStore('isEnterDonationFriendPage') === 'false' ? false : true : false
            return state.isEnterDonationFriendPage
        },

        isEnterCollectionsRecordsDetailsPage: (state)  => {
            state.isPaying = getStore('isEnterCollectionsRecordsDetailsPage') ? getStore('isEnterCollectionsRecordsDetailsPage') === 'false' ? false : true : false
            return state.isEnterCollectionsRecordsDetailsPage
        },

        isEnterLoginPageSource: (state)  => {
            state.isEnterLoginPageSource = getStore('isEnterLoginPageSource') ? getStore('isEnterLoginPageSource') : ''
            return state.isEnterLoginPageSource
        },

        isEnterMyObjectDetailsPageSource: (state)  => {
            state.isEnterMyObjectDetailsSource = getStore('isEnterMyObjectDetailsPageSource') ? getStore('isEnterMyObjectDetailsPageSource') : ''
            return state.isEnterMyObjectDetailsPageSource
        },

        isEnterCollectionsRecordsDetailsPageSource: (state)  => {
            state.isEnterCollectionsRecordsDetailsPageSource = getStore('isEnterCollectionsRecordsDetailsPageSource') ? getStore('isEnterCollectionsRecordsDetailsPageSource') : ''
            return state.isEnterCollectionsRecordsDetailsPageSource
        },

        collectTransferCodeMessage: (state)  => {
            state.collectTransferCodeMessage = getStore('collectTransferCodeMessage') ? JSON.parse(getStore('collectTransferCodeMessage')) : []
            return state.collectTransferCodeMessage
        },
        hallMessage: (state)  => {
            state.hallMessage = getStore('hallMessage') ? JSON.parse(getStore('hallMessage')) : {
                hallType: '',
                hallTemplate: '',
                hallExhibitsList: [],
                hallTheme: '',
                hallThemePath: '',
                hallIntroduce: ''
            };
            return state.hallMessage
        },
        queryHallMessage: (state) => {
            state.queryHallMessage = getStore('queryHallMessage') ? JSON.parse(getStore('queryHallMessage')) : null
            return state.queryHallMessage
        }
    },

    mutations: {
        // 保存作品id
        changeProductsId(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('productsId', playLoad);
                state.productsId = playLoad
            }
        },

        // 保存订单id
        changeOrderId(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('orderId', playLoad);
                state.orderId = playLoad
            }
        },

        // 保存是否刷新首页的状态
        changeIsRefreshHomePage (state, playLoad) {
            setStore('isRefreshHomePage', playLoad);
            state.isRefreshHomePage = playLoad
        },

        // 保存作品邀请信息状态
        changeInviteMessage (state,playLoad) {
            setStore('inviteMessage', playLoad);
            state.inviteMessage = playLoad
        },

        // 保存支付状态
        changeIsPaying(state, playLoad) {
            setStore('isPaying', playLoad);
            state.isPaying = playLoad
        },

        // 保存苹果内购支付订单状态
        changeIsIosPaySuccess(state, playLoad) {
            setStore('isIosPaySuccess', playLoad);
            state.isIosPaySuccess = playLoad
        },

        // 保存系统消息id
        changeSystemMessageId(state, playLoad) {
            setStore('systemMessageId', playLoad);
            state.systemMessageId = playLoad
        },

        // 保存藏品id状态
        changeCollectionId(state, playLoad) {
            setStore('collectionId', playLoad);
            state.collectionId = playLoad
        },

        // 保存我的藏品状态
        changeMyObjects(state, playLoad) {
            setStore('myObjects', playLoad);
            state.myObjects = playLoad
        },

        // 保存赠送产品的信息
        changeDonationProductDetails(state, playLoad) {
            setStore('donationProductDetails', playLoad);
            state.donationProductDetails = playLoad
        },

        // 保存是否可以发送手机验证码的状态
        changeIsCanSendPhoneCode(state, playLoad) {
            setStore('isCanSendPhoneCode', playLoad);
            state.isCanSendPhoneCode = playLoad
        },

        // 存储倒计时过期时间
        changeCountdownTime(state, playLoad) {
            setStore('countdownTime', playLoad);
            state.countdownTime = playLoad
        },

        // 保存是否进入手机验证码页的状态
        changeIsEnterVerificationCodePage(state, playLoad) {
            setStore('isEnterVerificationCodePage', playLoad);
            state.isEnterVerificationCodePage = playLoad
        },

         // 保存进入登录页的来源页路径
         changeIsEnterLoginPageSource(state, playLoad) {
            setStore('isEnterLoginPageSource', playLoad);
            state.isEnterLoginPageSource = playLoad
        },
        
        //保存是否进入过赠送藏品页的状态
        changeIsEnterDonationFriendPage(state, playLoad) {
            setStore('isEnterDonationFriendPage', playLoad);
            state.isEnterDonationFriendPage = playLoad
        },

        //保存是否进入过藏品详情页的状态
        changeIsEnterCollectionsRecordsDetailsPage (state, playLoad) {
            setStore('isEnterCollectionsRecordsDetailsPage', playLoad);
            state.isEnterCollectionsRecordsDetailsPage = playLoad
        },
        
        // 保存进入藏品记录详情页的来源路径
        changeIsEnterCollectionsRecordsDetailsPageSource(state, playLoad) {
            setStore('isEnterCollectionsRecordsDetailsPageSource', playLoad);
            state.isEnterCollectionsRecordsDetailsPageSource = playLoad
        },

        // 保存进入我的展馆页面来源路径
        changeIsEnterMyObjectDetailsPageSource (state, playLoad) {
            setStore('isEnterMyObjectDetailsPageSource', playLoad);
            state.isEnterMyObjectDetailsPageSource = playLoad
        },

        // 保存藏品赠送发送的验证码是否超过60s的状态
        changeCollectTransferCodeMessage(state, playLoad) {
            setStore('collectTransferCodeMessage', playLoad);
            state.collectTransferCodeMessage = playLoad
        }, 

        // 保存展馆的信息
        changeHallMessage(state, playLoad) {
            setStore('hallMessage', playLoad);
            state.hallMessage = playLoad
        },

        //保存查询的展馆信息
        changeQueryHallMessage(state, playLoad) {
            setStore('queryHallMessage', playLoad);
            state.queryHallMessage = playLoad
        },

        // 保存轮播图信息
        changeSwipeItemDetails(state, playLoad) {
            setStore('swipeItemDetails', playLoad);
            state.swipeItemDetails = playLoad
        },

        //重置产品的状态
        resetProductsState(state) {
            Object.assign(state, getDefaultProductsState())
        }
    },

    actions: {
        resetFabricState({ commit }) {
            commit('resetProductsState')
        }
    }
}