<template>
  <div class="page-box" id="top-content">
    <van-loading type="spinner" v-show="loadingShow"/>
    <van-overlay :show="isShowOverlay"/>
    <van-nav-bar :border="false"
        :placeholder="true"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >   
        <template #left>
            <p>
                <img :src="blockchainPng" alt="">
                <span>区块链地址</span>
            </p>
        </template>
        <template #right>
            <p class="inviation-code-box" @click="invitationCodeEvent">
                邀请码
            </p>
            <p  class="set-box" @click="onClickRight">
                <img :src="setPng" alt="">
            </p>
        </template>
    </van-nav-bar>
    <div class="show-picture-box">
        <van-dialog v-model="inviationCodeBox" :show-confirm-button="false"  :close-on-popstate="false" title="" >
            <div class="unfold-top">
                <div class="top-left">
                    <p>
                     我的邀请码
                    </p>
                    <!-- <p>
                        一个邀请码只能邀请一次
                    </p> -->
                </div>
                <div class="top-right" @click="closePictureUnfoldEvent">
                    <van-icon name="clear" size="26" color="#b1b1b1" />
                </div>
            </div>
            <div class="unfold-center">
                <div class="unfold-center-top">
                    {{ !invitationCodeValue ? '待生成' : invitationCodeValue  }}
                </div>
                <div class="unfold-center-bottom" :class="{'unfoldCenterBottomStyle' : loadingShow == true || !invitationCodeValue || invitationCodeValue == '待生成'}"
                    v-clipboard:copy="invitationCodeValue"
                    v-clipboard:success="onCopySuccess"
                    v-clipboard:error="onCopyError" 
                >
                    点击复制
                </div>
            </div>
            <div class="create-code-box">
                <div class="create-code-btn" @click="createInviationCodeEvent" :class="{'createCodeBtn' : loadingShow == true}">
                    <van-icon name="replay" color="#fff" size="15" />
                    生成新的邀请码
                </div>
                <!-- <div class="create-code-info">
                    还能生成新的邀请码次数
                    <span>{{ 200 - inviationCodeList.length}}</span>
                </div> -->
            </div>
            <div class="create-record">
                <van-divider dashed :style="{ borderColor: '#6e6e6e',fontSize: '13px' }">生成记录</van-divider>
                <div class="create-record-list">
                    <span v-for="(item,index) in inviationCodeList" :key="index">
                        {{ item }}
                    </span>
                </div>
            </div>
        </van-dialog>
    </div>
    <van-pull-refresh
        v-model="isRefresh"
        pulling-text="下拉刷新"
        :disabled="isDisabledRefresh"
        loosing-text="释放立即刷新"
        success-text="刷新成功"
        @refresh="onRefresh"
    >  
        <div class="content-box">
            <div class="content-top">
                <div class="person-message-box">
                <div class="message-left" @click="toEditPersonPage">
                    <div class="person-picture">
                    <img :src="notLoginPng" v-show="!isLogin" alt="">
                    <img :src="defaultPerson" v-show="isLogin && userInfo && !userInfo.hasOwnProperty('avatarUrl') || isLogin && userInfo && userInfo.hasOwnProperty('avatarUrl') && !userInfo.avatarUrl" alt="">
                    <img :src="userInfo && userInfo.avatarUrl" v-show="isLogin && userInfo && userInfo.hasOwnProperty('avatarUrl') && userInfo.avatarUrl" alt="">
                    </div>
                    <div class="person-name">
                        <div class="top">
                            <div v-if="isLogin">{{userInfo && userInfo.nickName}}</div>
                            <div v-else>未登录</div>
                        </div>
                        <div class="bottom">
                            <span v-show="!isLogin">登录后可以查看更多数字藏品</span>
                            <span v-show="userInfo && !userInfo.signTxt && isLogin">TA很神秘,什么都没有留下</span>
                            <span v-show="userInfo && userInfo.signTxt && isLogin">{{userInfo && userInfo.signTxt}}</span>
                        </div>
                    </div>
                </div>
                </div>
                <div class="function-zone">
                    <div class="function-zone-icon-list" v-for="(item,index) in zoneIconList" :key="index" @click="featureSetTopEvent(item)">
                        <img :src="item.icon" alt="">
                        <span>{{item.span}}</span>
                        <p class="message-info" v-show="index == 3 && isExistUnread"></p>
                    </div>
                </div>
            </div>
            <div class="content-bottom">
                    <div class="nick-name" v-for="(item,index) in featureSetList" :key="index" @click="featureSetEvent(item)">
                        <div class="left">
                            <img :src="item.iconLeft" alt="">
                            <span>{{item.span}}</span>
                        </div>
                        <div class="right">
                            <div>
                                <img :src="item.iconRight" alt="">
                            </div>
                        </div>
                    </div>
            </div>
            <div class="blockchain-server">
                <p>
                    <span>中国传统文化数字艺术联盟监制</span>
                </p>
                <p>
                    <img :src="blockchainServePng" alt="">
                    <span>提供技术支持</span>
                </p>
            </div>
        </div>
    </van-pull-refresh>
    <FooterBottom></FooterBottom>  
  </div>
</template>
<script>
    import FooterBottom from '../components/FooterBottom'
    import NavBar from '@/components/NavBar'
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    import {
		getInviteCode,
		getInviteCodeRecords
	} from '@/api/login.js'
    import {
        inquareUserInfo,
        appShare,
        queryUnRead
    } from '@/api/products.js'
    import {
        IsPC,
        isAndroid_ios, 
        isWeiXin
    } from '@/common/js/utils'
    export default {
        name: 'MyInfo',
        components: {
            FooterBottom,
            NavBar
        },
        data() {
            return {
                scrollTop: 0, // 储存滚动位置
                isDisabledRefresh: false,
                isShowOverlay: false,
                isDisabled: false,
	            timer: null,
                inviationCodeBox: false,
                invitationCodeValue: '',
                inviationCodeList: [],
                isRefresh: false,
                timer: null,
                isExistUnread: null,
                loadingShow: false,
                zoneIconList: [{
                    icon: require("@/common/images/login/my-order.png"),
                    span: '我的订单'
                }, {
                    icon: require("@/common/images/login/collection-record.png"),
                    span: '藏品记录'
                }, 
                {
                    icon: require("@/common/images/login/donation.png"),
                    span: '转赠记录'
                },
                {
                    icon: require("@/common/images/login/message.png"),
                    span: '消息'
                }],
                featureSetList: [{
                    iconLeft: require("@/common/images/login/account-security.png"),
                    iconRight: require("@/common/images/login/arrow-right.png"),
                    span: '账号与安全'
                }, {
                    iconLeft: require("@/common/images/login/my-service.png"),
                    iconRight: require("@/common/images/login/arrow-right.png"),
                    span: '客服'
                }, {
                    iconLeft: require("@/common/images/login/about.png"),
                    iconRight: require("@/common/images/login/arrow-right.png"),
                    span: '关于'
                }, {
                    iconLeft: require("@/common/images/login/my-share.png"),
                    iconRight: require("@/common/images/login/arrow-right.png"),
                    span: '分享'
                }],
                defaultPerson: require("@/common/images/home/default-person.png"),
                setPng: require("@/common/images/login/set.png"),
                notLoginPng: require("@/common/images/login/not-login.png"),
                blockchainPng: require("@/common/images/home/blockchain.png"),
                blockchainServePng: require("@/common/images/home/blockchain-service.png")
            }
        },

        mounted() {
            this.toTop();
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                    pushHistory();
					this.$router.push({
						path: '/myInfo'
					})
                })
            };
            if (this.isLogin) {
                if (!this.userInfo) {
                    this.queryuserInfo()
                };
                this.queryUnReadEvent()
            };
            window.addEventListener('scroll', this.handleScroll);
            if (this.scrollTop > 0) {
                this.isDisabledRefresh = true;
            } else {
                this.isDisabledRefresh = false
            }
        },

        beforeDestroy() {
            window.removeEventListener('scroll', this.handleScroll);
            if(this.timer) { 
                clearTimeout(this.timer)
            }
        },

        watch: {},

        computed: {
            ...mapGetters([
                'userInfo',
                'isLogin'
            ])
        },

        beforeRouteEnter(to, from, next) {
            next()
        },

        beforeRouteLeave(to, from, next) {
            next()
        },

        methods: {
            ...mapMutations([
                'storeUserInfo',
                'changeIsEnterLoginPageSource'
            ]),

            eventListenerHandle(e){
                if(e._isScroller) return;
                e.preventDefault()
            },

            //邀请码点击事件
            invitationCodeEvent () {
                if (!this.isLogin) {
                    this.changeIsEnterLoginPageSource('/myInfo');
                    this.$router.push({
                        path: '/login'
                    });
                    return
                };
                this.inviationCodeBox = true;
                this.invitationCodeValue = '';
                this.getInviteCodeRecords()
            },

            // 生成新邀请码事件
            createInviationCodeEvent () {
                this.invitationCodeValue = '';
                if (this.loadingShow) { return };
                this.getInviteCode()
            },

            // 获取邀请码
            getInviteCode () {
                this.loadingShow = true;
                this.isShowOverlay = true;
                getInviteCode().then((res) => {
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                        this.invitationCodeValue = res.data.data;
                        this.getInviteCodeRecords()
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
                })
                .catch((err) => {
                    this.loadingShow = false;
                    this.isShowOverlay = false;
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    })
                })
            },

            // 获取邀请码生成记录
            getInviteCodeRecords () {
                this.loadingShow = true;
                this.isShowOverlay = true;
                getInviteCodeRecords().then((res) => {
                    this.loadingShow = false;
                    this.isShowOverlay = false;
                    if (res && res.data.code == 0) {
                        if (res.data.list.length > 0) {
                            this.inviationCodeList = [];
                            this.inviationCodeList = res.data.list
                        }
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
                })
                .catch((err) => {
                    this.loadingShow = false;
                    this.isShowOverlay = false;
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    })
                })
            },

            onCopySuccess(){
                this.$toast("复制成功");
            },
            onCopyError(){
                if (this.loadingShow || this.invitationCodeValue == '待生成' || !this.invitationCodeValue) {
                    return
                };
                this.$toast("复制失败");
            },

            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },

            //页面滚动事件
            handleScroll () {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollTop > 0) {
                    this.isDisabledRefresh = true;
                } else {
                    this.isDisabledRefresh = false
                }
            },

            //查询是否存在未读消息
            queryUnReadEvent () {
                queryUnRead().then((res) => {
                    this.isRefresh = false;
                    if (res && res.data.code == 0) {
                        this.isExistUnread = res.data.data
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
                })
                .catch((err) => {
                    this.isRefresh = false;
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    })
                })
            },

            juddgeIspc() {
                return IsPC()
            },

            toEditPersonPage() {
                if (!this.isLogin) {
                    this.changeIsEnterLoginPageSource('/myInfo');
                    this.$router.push({
                        path: '/login'
                    })
                }
            },

            toSetPage() {},

            //我的页面下拉刷新事件
            onRefresh () {
                if (!this.isLogin) { this.isRefresh = false; return };
                this.queryuserInfo();
                this.queryUnReadEvent()
            },

            //关闭邀请码弹框展示事件
            closePictureUnfoldEvent () {
                this.inviationCodeBox = false
            },

            // 上部区域功能事件
            featureSetTopEvent(item) {
                if (!this.isLogin) {
                    this.changeIsEnterLoginPageSource('/myInfo');
                    this.$router.push({
                        path: '/login'
                    });
                    return
                };
                if (item.span === '我的订单') {
                    this.$router.push({
                        path: 'myOrderForm'
                    })
                } else if (item.span === '藏品记录') {
                    this.$router.push({
                        path: 'collectionRecords'
                    })
                } else if (item.span === '转赠记录') {
                    this.$router.push({
                        path: 'donationRecord'
                    })
                } else if (item.span === '消息') {
                    this.$router.push({
                        path: 'systemMessage'
                    })
                }
            },

            //区块链点击事件
            onClickLeft () {
                if (!this.isLogin) {
                    this.changeIsEnterLoginPageSource('/myInfo');
                    this.$router.push({
                        path: '/login'
                    });
                    return
                };
                this.$router.push({path: '/blockchainAddress'})
            },

            //设置点击事件
            onClickRight () {
                if (!this.isLogin) {
                    this.changeIsEnterLoginPageSource('/myInfo');
                    this.$router.push({
                        path: '/login'
                    });
                    return
                };
                this.$router.push({
                    path: 'systemSet'
                })
            },

            // 下部区域功能事件
            featureSetEvent(item) {
                if (!this.isLogin) {
                    this.changeIsEnterLoginPageSource('/myInfo');
                    this.$router.push({
                        path: '/login'
                    });
                    return
                };
                if (item.span === '账号与安全') {
                    this.$router.push({
                        path: 'accountSecurity'
                    })
                } else if (item.span == '客服') {
                    this.$router.push({
                        path: 'myService'
                    })
                } else if (item.span === '关于') {
                     this.$router.push({
                        path: 'aboutUs'
                    })
                } else if (item.span == '分享') {
                    if (IsPC()) { return };
                    if (isWeiXin()) { return };
                    if(this.isDisabled) return;
                    this.isDisabled = !this.isDisabled;
                    this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                    this.myShareEvent()
                }
            },

            // 查询用户信息
            queryuserInfo() {
                inquareUserInfo().then((res) => {
                        this.isRefresh = false;
                        if (res && res.data.code == 0) {
                            this.storeUserInfo(res.data.data);
                        } else {
                            this.$toast({
                                message: `${res.data.msg}`,
                                position: 'bottom'
                            })
                        }
                    })
                    .catch((err) => {
                        this.isRefresh = false;
                        this.$toast({
                            message: `${err.message}`,
                            position: 'bottom'
                        })
                    })
            },

            // App分享
            appShareEvent() {
                return new Promise((resolve,rejrect) => {
                    this.loadingShow = true;
                    appShare().then((res) => {
                        this.loadingShow = false;
                        if (res && res.data.code == 0) {
                            resolve(res.data.url)
                        } else {
                            this.$toast({
                                message: `${res.data.msg}`,
                                position: 'bottom'
                            })
                        }
                    })
                    .catch((err) => {
                        this.loadingShow = false;
                        this.$toast({
                            message: `${err.message}`,
                            position: 'bottom'
                        })
                    })
                })
            },

            async myShareEvent () {
                let shareUrl = await this.appShareEvent();
                // 区分android和ios环境
                if (isAndroid_ios()) {
                    // 区分是在app内还是app外
                    try {
                        window.android.setShareUrl(`${shareUrl}`)
                    } catch (err) {
                        this.$toast({
                            message: 'h5暂无分享功能',
                            position: 'bottom'
                        })
                    }
                } else if (!isAndroid_ios()) {
                    // 区分是在app内还是app外
                    try {
                        window.webkit.messageHandlers.setShareUrl.postMessage({functionName: 'shareUrl',parameter: `${shareUrl}`})
                    } catch (err) {
                        this.$toast({
                            message: 'h5暂无分享功能',
                            position: 'bottom'
                        })
                    }
                }
            }
        }
    }
</script>
<style lang='less' scoped>
    @import "../common/stylus/variable.less";
    @import "../common/stylus/mixin.less";
    @import "../common/stylus/modifyUi.less";
    .page-box {
        .content-wrapper();
        background: @color-background;
        /deep/ .van-loading {
            z-index: 3000 !important
        };
        /deep/ .van-nav-bar {
            background: @color-background;
            .van-icon-arrow-left {
                color: #fff !important;
                font-size: 24px !important
            };
            .van-nav-bar__left {
                p {
                    padding: 0 8px;
                    background: rgba(81, 81, 81, 0.54);
                    border-radius: 20px;
                    height: 23px;
                    display: flex;
                    flex-flow: row nowrap;
                    box-sizing: border-box;
                    justify-content: center;
                    align-items: center;
                    img {
                        width: 18px;
                        margin-right: 4px
                    };
                    span {
                        color: #f0c596;
                        font-size: 10px
                    }
                }
            };
            .van-nav-bar__right {
                .set-box {
                      img {
                        width: 22px;
                        vertical-align: top
                    }
                };
                .inviation-code-box {
                    padding: 0 8px;
                    margin-right: 4px;
                    height: 23px;
                    box-sizing: border-box;
                    color: #f0c596;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: row nowrap;
                    box-sizing: border-box;
                    justify-content: center;
                    align-items: center;
                    font-size: 10px;
                    background: rgba(81, 81, 81, 0.54);
                }
            }
        };
        .show-picture-box {
            /deep/ .van-dialog {
                border-radius: 0;
                width: 85%;
                max-height: 70vh;
                top: 50%;
                left: 50%;
                overflow: auto;
                background: @color-background;
                transform: translate(-50%,-50%);
                .van-dialog__content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    position: relative;
                    .unfold-top {
                        height: 80px;
                        display: flex;
                        width: 90%;
                        margin: 0 auto;
                        margin-bottom: 4px;
                        flex-flow: row nowrap;
                        align-items: center;
                        position: relative;
                        justify-content: space-between;
                        .top-left {
                            flex: 1;
                            text-align: center;
                            margin-top: 20px;
                            >p {
                                .no-wrap();
                                &:first-child {
                                    font-size: 16px;
                                    color: #fff;
                                    margin-bottom: 12px;
                                };
                                // &:last-child {
                                //     font-size: 12px;
                                //     color: #7c7c7c
                                // }
                            }
                        };
                        .top-right {
                            position: absolute;
                            top: 10px;
                            right: 0
                        }
                    };
                    .unfold-center {
                       width: 90%;
                       margin: 0 auto;
                       height: 130px;
                       background: #252525;
                       .unfold-center-top {
                            height: 85px;
                            color: #fff;
                            font-size: 24px;
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: center;
                            align-items: center;
                            .bottom-border-1px(#6e6e6e,1px);
                       };
                       .unfold-center-bottom {
                            text-align: center;
                            height: 45px;
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: center;
                            align-items: center;
                            color: #f0c596;
                            font-size: 14px
                       };
                       .unfoldCenterBottomStyle {
                        color: #7c7c7c !important
                       }
                    };
                    .create-code-box {
                        width: 90%;
                        margin: 0 auto;
                        margin-top: 20px;
                        .create-code-btn {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: center;
                            align-items: center;
                            height: 35px;
                            border-radius: 10px;
                            width: 100%;
                            color: #fff;
                            font-size: 12px;
                            background: #f0c596;
                            .van-icon {
                                margin-right: 2px
                            }
                        };
                        .createCodeBtn {
                            background:#7c7c7c !important;
                        };
                        .create-code-info {
                            width: 100%;
                            margin-top: 12px;
                            text-align: center;
                            font-size: 12px;
                            color: #7c7c7c;
                            span {
                                color: #f0c596
                            }
                        }
                    };
                    .create-record {
                        width: 90%;
                        margin: 0 auto;
                        margin-top: 10px;
                        flex: 1;
                        padding: 4px 0;
                        box-sizing: border-box;
                        .create-record-list {
                            width: 100%;
                            display: flex;
                            flex-flow: row wrap;
                            justify-self: flex-start;
                            span {
                                width: 32%;
                                height: 30px;
                                margin-right: 2%;
                                margin-bottom: 4px;
                                text-align: center;
                                line-height: 30px;
                                display: inline-block;
                                background: #252525;
                                color: #fff;
                                font-size: 12px;
                                &:nth-child(3n) {
                                    margin-right: 0
                                }
                            }
                        }
                    }
                }    
            }
        };
        /deep/ .van-pull-refresh {
            flex: 1;
            display: flex;
            .van-pull-refresh__track {
                flex: 1;
                height: auto;
            }
        };
        .content-box {
            height: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            .content-top {
                height: auto;
                font-size: 14px;
                background: @color-background;
                .person-message-box {
                    width: 92%;
                    margin: 0 auto;
                    height: 120px;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    .message-left {
                        flex: 1;
                        display: flex;
                        flex-flow: row nowrap;
                        align-items: center;
                        .person-picture {
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%
                            }
                        }
                        ;
                        .person-name {
                            color: #fff;
                            height: 80px;
                            margin-left: 10px;
                            font-size: 20px;
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            width: 0;
                            .top {
                                >div {
                                    .no-wrap()
                                }
                            }
                            ;
                            .bottom {
                                font-size: 12px;
                                display: flex;
                                flex-flow: row nowrap;
                                margin-top: 4px;
                                color: #989898;
                                span {
                                    margin-top: 4px;
                                    display: inline-block;
                                    text-align: center;
                                    width: 100%;
                                    text-align: left;
                                    .no-wrap()
                                }
                            }
                        }
                    }
                }
                ;
                .function-zone {
                    width: 92%;
                    margin: 0 auto;
                    height: 75px;
                    background: @color-block;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: row wrap;
                    .function-zone-icon-list {
                        flex: 1;
                        position: relative;
                        height: 75px;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        img {
                            width: 25px;
                        };
                        span {
                            font-size: 12px;
                            color: #989898;
                            margin-top: 12px;
                        };
                        .message-info {
                            position: absolute;
                            top: 9%;
                            right: 24%;
                            width: 9px;
                            height: 9px;
                            background:#f73d76;
                            border-radius: 50%
                        }
                    }
                }
            };
            .content-bottom {
                font-size: 13px;
                position: relative;
                display: flex;
                flex-direction: column;
                width: 92%;
                margin: 0 auto;
                margin-top: 10px;
                .nick-name {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;
                    height: 48px;
                    padding: 0 10px;
                    background: @color-block;
                    margin-bottom: 10px;
                    border-radius: 10px;
                    .left {
                        font-size: 16px;
                        color: #FFFFFF;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        align-items: center;
                        >span {
                            margin-left: 16px;
                        }
                        ;
                        img {
                            width: 18px;
                            height: 18px
                        }
                    };
                    .right {
                        >div {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            img {
                                width: 6px
                            }
                        }
                    }
                }
            };
            .blockchain-server {
                position: absolute;
                bottom: 10px;
                left: 0;
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                >p {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &:nth-child(1) {
                        margin-bottom: 8px;
                        span {
                            margin-left: 8px;
                            margin-top: 1px;
                            font-size: 10px;
                            color: #c2c2c2
                        }
                    };
                    &:nth-child(2) {
                       img {
                            width: 100px
                        };
                        span {
                            margin-left: 8px;
                            margin-top: 1px;
                            font-size: 10px;
                            color: #c2c2c2
                        }
                    }
                }
            }
        }
    }
</style>