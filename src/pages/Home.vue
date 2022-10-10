<template>
  <div class="page-box" ref="wrapper">
    <NavBar :leftArrow="false" ref="navBar" />
    <van-pull-refresh
        v-model="isRefresh"
        :disabled="isDisabledRefresh"
        pulling-text="下拉刷新"
        loosing-text="释放立即刷新"
        success-text="刷新成功"
        @refresh="onRefresh"
    >
        <div class="content" ref="content">
            <div class="rare-object" ref="rareObject" v-show="!isShowRareObjectCopy">
                <van-swipe :autoplay="3000" indicator-color="#fff" :stop-propagation="false">
                    <van-swipe-item v-for="(item, index) in bannerList" :key="index" @click="swipeItemEvent(item)">
                        <img :src="item.path" />
                    </van-swipe-item>
                </van-swipe>
            </div>
            <div class="rare-object-copy" v-show="isShowRareObjectCopy"></div>
            <van-sticky>
                <div class="tab-switch-box">
                    <div class="tab-switch" ref="tabSwitch">
                        <span v-for="(item,index) in tabTitlelList" :key="index" @click="tabSwitchEvent(index)"
                            :class="{'active-tab-style': index === currentTabIndex }"
                        >
                            {{
                            item.name
                            }}
                        </span>
                    </div>
                </div>
            </van-sticky>        
            <div class="switch-content">
                <van-loading type="spinner" v-show="loadingShow && currentTabIndex === 1"/>
                <van-empty :description="descriptionContent" v-show="emptyShow" />
                <div class="object-box" ref="objectBox" v-show="currentTabIndex === 0 && !emptyShow">
                    <!-- 产品列表骨架 -->
                    <div class="object-skeleton-list-box" v-show="loadingShow">
                        <div class="object-skeleton-list" v-for="(item) in objectSkeletonList" :key="item.id">
                            <div class="top"></div>
                            <div class="bottom">
                                <div class="one"></div>
                                <div class="two"></div>
                                <div class="three"></div>
                                <div class="four"></div>
                            </div>
                        </div>
                    </div>
                    <!-- 产品列表 -->
                    <div class="object-list-box" v-show="!loadingShow">
                        <div class="object-list" 
                            @click="objectDetailEvent(item,index)" 
                            v-for="(item,index) in digitalCollectionList" :key="item.id"
                            :style="{backgroundImage: 'url(' + homeListBackgroundPng+ ')',backgroundRepeat:'no-repeat',backgroundPosition:'right bottom',backgroundSize:'40%'}"
                            >
                            <!-- 未开启预售 -->
                            <div class="sell-info-area" v-if="item.presale == 0">
                                <div class="left-sell" v-show="item.isShowCountDown && item.status == 0">
                                    <van-icon name="underway" size="14" color="#63b66b" />
                                    <span>即将开售</span>
                                    <van-count-down :time="item.countdownTime" @finish="countDownEvent(index)" format="DD:HH:mm:ss"/>
                                </div>
                                <div class="left" v-show="!item.isShowCountDown && item.status == 1">
                                    <van-icon name="underway" size="14" color="#bd68ff" />
                                    <span>火爆抢购中</span>
                                </div>
                                <div class="center" v-show="!item.isShowCountDown && item.status == 2">
                                    <van-icon name="bookmark" size="14" color="#fff" />
                                    <span>已售罄</span>
                                </div>
                                <!-- <div class="right" v-preventReClick v-show="item.isShowCountDown && item.status == 0" @click.stop="remindMeEvent">
                                    <van-icon name="bell" size="14" color="#e9ad70"/>
                                    <span>提醒我</span>
                                </div> -->
                            </div>
                            <!-- 开启预售 -->
                            <div class="sell-info-area" v-if="item.presale == 1 && item.status == 0">
                                <div class="left-sell" v-show="item.isShowPresaleStartCountDown && item.entity.status == 0">
                                    <van-icon name="underway" size="14" color="#63b66b" />
                                    <span>预购</span>
                                    <van-count-down :time="item.presellStartCountdownTime" v-show="false" @finish="presellStartCountDownEvent(index)" format="DD:HH:mm:ss"/>
                                    <span>
                                        {{ `${cutoutTimeQuantum(item.entity.startTime)} - ${cutoutTimeQuantum(item.entity.endTime)}`}}
                                    </span>
                                </div>
                                <div class="left" v-show="!item.isShowPresaleStartCountDown && item.entity.status == 1">
                                    <van-icon name="underway" size="14" color="#bd68ff" />
                                    <span>预购中</span>
                                    <van-count-down :time="item.presellEndCountdownTime" v-show="false" @finish="presellEndCountDownEvent(index)" format="DD:HH:mm:ss"/>
                                </div>
                                <div class="left-sell" v-show="!item.isShowPresaleEndCountDown && item.entity.status == 2 && item.priority == 1">
                                    <van-icon name="underway" size="14" color="#63b66b" />
                                    <span>{{item.isBalancePaymentShow ? '即将支付尾款' : '支付尾款'}}</span>
                                    <van-count-down v-show="item.isBalancePaymentShow" :time="item.countdownTime" @finish="balancePaymentEvent(index)" format="DD:HH:mm:ss"/>
                                </div>
                                <div class="left-sell" v-show="item.entity.status == 2 && item.priority == 0">
                                    <van-icon name="underway" size="14" color="#63b66b" />
                                    <span>即将开售</span>
                                    <van-count-down :time="item.countdownTime" @finish="countDownEvent(index)" format="DD:HH:mm:ss"/>
                                </div>
                            </div>
                            <div class="sell-info-area" v-if="item.presale == 1 && item.status == 1">
                                <div class="left" v-show="item.priority == 0">
                                    <van-icon name="underway" size="14" color="#bd68ff" />
                                    <span>火爆抢购中</span>
                                </div>
                                <div class="left" v-show="item.priority == 1">
                                    <van-icon name="underway" size="14" color="#bd68ff" />
                                    <span>支付尾款</span>
                                </div>
                            </div>
                            <div class="sell-info-area" v-if="item.presale == 1 && item.status == 2">
                                <div class="center">
                                    <van-icon name="bookmark" size="14" color="#fff" />
                                    <span>已售罄</span>
                                </div>
                            </div>
                            <div class="image-area" v-lazy-container="{ selector: 'img' }">
                            <img :data-src="item.digitalCollectioUrl">
                            </div>
                            <div class="message-area">
                                <div class="message-top">
                                    <span>{{item.digitalCollectionName}}</span>
                                </div>
                                <div class="message-bottom">
                                    <div class="left">
                                        <!-- <div class="name">
                                        <p v-show="item.tagAttributes && !item.tagAttributes.some((tagItem) => {return tagItem == null}) && item.tagAttributes.length>0">
                                            <span v-for="(innerItem, innerIndex) in item.tagAttributes" :key="innerIndex">{{innerItem}}</span>
                                        </p>
                                        </div> -->
                                        <div class="number">
                                        <span>限量</span>
                                        <span>{{item.digitalCollectioShare}}份</span>
                                        </div>
                                        <div class="author">
                                        <img :src="item.digitalCollectioAuthorPhoto">
                                        <span>{{item.digitalCollectioAuthor}}</span>
                                        </div>
                                    </div>
                                    <div class="right">
                                        <div>
                                        <span>¥</span>
                                        <span>{{item.digitalCollectioPrice}}</span>
                                        </div>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    </div>

                    <!-- 内容加载失败 -->
                    <div class="object-content-load-fail" v-show="isShowLoadFail">
                        <van-icon name="warning" size="70" color="#5f5f5f"/>
                        <span>内容加载失败, 点击刷新重试</span>
                        <span @click="loadFailFreshEvent()">刷新</span>
                    </div>

                    <!-- 更多内容提示 -->
                    <span class="expect" v-show="!isShowLoadFail && !loadingShow && !emptyShow">- 更多内容敬请期待 -</span>
                </div>
                <div class="sell-date-box" v-show="currentTabIndex === 1">
                    <div class="sell-title">
                        <div class="left">
                        <span>近期发售计划</span>
                        </div>
                        <div class="right">
                        <!-- <span>已订阅</span>
                        <span>分 享</span> -->
                        </div>
                    </div>
                    <van-empty :description="descriptionContent" v-show="emptyShow" />
                    <div class="sell-content-list" v-for="(item,index) in digitalCollectionCalendarList" :key="index">
                        <div class="month-day">
                        <span>{{item.date}}</span>
                        </div>
                        <div class="same-hour-list" v-for="(innerItem, innerIndex) in item.saleTimeList" :key="innerIndex">  
                        <div class="hour">
                            <van-icon name="underway" size="20" color="#fff" />
                            <span>{{innerItem.time}}</span>
                        </div>
                        <div class="object-details-list" v-for="(lastItem, lastIndex) in innerItem.commodityList" :key="lastIndex">
                            <div class="object-details" :style="{backgroundImage: 'url(' + homeListBackgroundPng+ ')',backgroundRepeat:'no-repeat',backgroundPosition:'right bottom',backgroundSize:'25%'}">
                            <div v-lazy-container="{ selector: 'img' }">
                                <img :data-src="lastItem.imgPath">
                            </div>
                            <div>
                                <div>
                                <span>{{lastItem.name}}</span>
                                </div>
                                <div>
                                <span>限量</span>
                                <span>{{lastItem.quantity}}份</span>
                                </div>
                                <div class="">
                                <span>¥</span>
                                <span>{{lastItem.price}}</span>
                                </div>
                            </div>
                            </div>
                        </div>  
                        </div>  
                    </div>

                    <!-- 内容加载失败 -->
                    <div class="object-content-load-fail" v-show="isShowLoadFail">
                        <van-icon name="warning" size="70" color="#5f5f5f"/>
                        <span>内容加载失败, 点击刷新重试</span>
                        <span  @click="loadFailFreshEvent()">刷新</span>
                    </div>

                    <!-- 更多内容提示 -->
                    <span class="expect" v-show="!isShowLoadFail && !loadingShow && !emptyShow">- 更多内容敬请期待 -</span>
                </div>
            </div>
            <div class="name-auth" ref="nameAuth" v-show="userInfo && userInfo.realFlag === 0 && isShowNameAuthHint">
                <div class="left">
                    <span>实名认证后才可以购买数字藏品</span>
                </div>
                <div class="right">
                    <span @click="goAuthNameEvent">去认证</span>
                    <van-icon name="clear" size="25" color="#5f5f5f" @click="clearNameAuthHintEvent"/>
                </div>
            </div>
            <div class="name-auth" ref="loginInfo" v-show="!isLogin && isShowLoginHint">
                <div class="left">
                    <span>去登录,开启新的体验</span>
                </div>
                <div class="right">
                    <span @click="goLoginEvent">登录</span>
                    <van-icon name="clear" size="25" color="#5f5f5f" @click="clearLoginHintEvent"/>
                </div>
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
        inquareProductList,
        inquareSellCalendar,
        productVisitRecord,
        getBanner
    } from '@/api/products.js'
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    import {
        repeArray,
        IsPC
    } from '@/common/js/utils'
    let windowTimer
    export default {
        name: 'Home',
        components: {
            FooterBottom,
            NavBar
        },
        data() {
            return {
                isShowRareObjectCopy: true,
                scrollTop: 0, // 储存滚动位置
                tabSwitchOffsetTop: 0,
                isTimeoutContinue: true,
                tabSwitchHeight: 0,
                bannerList: [],
                navBarHeight: 0,
                rareObjectHeight: 0,
                isDisabledRefresh: false,
                isShowLoadFail: false,
                isRefresh: false,
                homeListBackgroundPng: require("@/common/images/home/home-list-background.png"),
                emptyShow: false,
                objectSkeletonList: [{id:1},{id:2}],
                loadingShow: false,
                descriptionContent: '暂无产品',
                tabTitlelList: [{
                    name: '数字藏品'
                }, {
                    name: '发售日历'
                }],
                digitalCollectionList: [],
                digitalCollectionCalendarList: [],
                isEffect: false,
                currentTabIndex: 0,
                animationData: {}
            }
        },

        mounted() {
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                    pushHistory();
					this.$router.push({
						path: '/home'
					})
                })
            };
            //查询藏品列表
            this.queryProductsList();
            this.queryBannerList()
        },

        activated() {
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                    pushHistory();
					this.$router.push({
						path: '/home'
					})
                })
            };
            if (this.isRefreshHomePage) {
                //查询藏品列表
                this.queryProductsList()
            };
            window.addEventListener('scroll', this.handleScroll);
            this.$nextTick(() => {
                // 吸顶元素到top的距离
                this.tabSwitchOffsetTop = this.$refs.tabSwitch.offsetTop;
                // 元素自身的高度
                this.tabSwitchHeight = this.$refs.tabSwitch.offsetHeight;
                this.navBarHeight = this.$refs.navBar.$el.clientHeight;
                this.rareObjectHeight = this.$refs.rareObject.offsetHeight;
                if (document.documentElement) {
                    document.documentElement.scrollTop = this.scrollTop
                } else if (document.body) {
                    document.body.scrollTop = this.scrollTop
                } else {
                    window.pageYOffset = this.scrollTop
                }
            });
            if (this.scrollTop > 0) {
                this.isDisabledRefresh = true;
            } else {
                this.isDisabledRefresh = false
            };
            // 监控屏幕高度变化
            let originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
            window.onresize = ()=>{
                let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
                if (resizeHeight < originalHeight) {
                    if (!this.isLogin && this.isShowLoginHint) {
                        return (()=>{
                            this.$refs['loginInfo'].style.cssText='bottom:60px'
                        })()
                    };
                    if (this.userInfo && this.userInfo.realFlag === 0 && this.isShowNameAuthHint) {
                        return (()=>{
                            this.$refs['nameAuth'].style.cssText='bottom:60px'
                        })() 
                    }    
                } else {
                    if (!this.isLogin && this.isShowLoginHint) {
                        this.$refs['loginInfo'].style.cssText='bottom:95px'
                    };
                    if (this.userInfo && this.userInfo.realFlag === 0 && this.isShowNameAuthHint) {
                        this.$refs['nameAuth'].style.cssText='bottom:95px'
                    }
                };
                originalHeight = resizeHeight
            };
            // 轮询任务状态
            if (!windowTimer) {
                windowTimer = window.setInterval(() => {
                    // 所有产品都售罄时就不在查询产品状态
                    let isAllSellout = this.digitalCollectionList.every((item) => { return item.status == 2 });
                    if (this.isTimeoutContinue && !isAllSellout) {
                        this.timingQueryProductsList()
                    }
                }, 3000)
            }
        },

        deactivated() {
            window.removeEventListener('scroll', this.handleScroll);
            if(windowTimer) {
                clearTimeout(windowTimer);
                windowTimer = null
            }
        },


        watch: {},

        computed: {
            ...mapGetters([
                'userInfo',
                'isLogin',
                'isRefreshHomePage',
                'isShowLoginHint',
                'isShowNameAuthHint'
            ])
        },

        beforeRouteEnter(to, from, next) {
            next((vm) => {
                if (from.name == 'verificationCode') {
                    vm.changeIsRefreshHomePage(true)
                }
            })
        },

        beforeRouteLeave(to, from, next) {
            this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            next() 
        },

        methods: {
            ...mapMutations([
                'changeProductsId',
                'changeSwipeItemDetails',
                'changeIsShowLoginHint',
                'changeIsShowNameAuthHint',
                'changeIsEnterLoginPageSource',
                'changeIsRefreshHomePage'
            ]),

            // 截取时间段
            cutoutTimeQuantum (timeString) {
                if (!timeString) { return };
                let index, newTimeString;
                index = timeString.indexOf('-');
                newTimeString = timeString.substring(index + 1);
                return newTimeString
            },

            // 查询banner列表
            queryBannerList () {
                this.isShowRareObjectCopy =true;
                getBanner().then((res) => {
                    this.bannerList = [];
                    this.isShowRareObjectCopy = false;
                    this.$nextTick(() => {
                        this.rareObjectHeight = this.$refs.rareObject.offsetHeight
                    });
                    if (res && res.data.code == 0) {
                        if (res.data.list.length == 0) {
                        } else {
                            this.bannerList = res.data.list
                        }
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
                })
                .catch((err) => {
                    this.bannerList = [];
                    this.isShowRareObjectCopy = false;
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    })
                })
            },

            // 轮播图点击事件
            swipeItemEvent (item) {
                this.changeSwipeItemDetails(item);
                this.$router.push({path: '/swipeItemDetails'})
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

            tabSwitchEvent(index) {
                this.currentTabIndex = index;
                if (index === 0) {
                    this.descriptionContent = '暂无产品';
                    this.queryProductsList();
                } else {
                    this.descriptionContent = '暂无发售计划';
                    this.querySaleCalendar()
                }
            },

            // 关闭登录提示框事件
            clearLoginHintEvent () {
                this.changeIsShowLoginHint(false)
            },

            // 关闭实名认证提示框事件
            clearNameAuthHintEvent () {
                this.changeIsShowNameAuthHint(false)
            },

            // 日历和产品列表加载失败后刷新事件
            loadFailFreshEvent () {
                this.queryBannerList();
                if (this.currentTabIndex == 0) {
                    this.queryProductsList()
                } else if (this.currentTabIndex == 1) {
                    this.querySaleCalendar()
                }
            },

            //提醒我事件
            remindMeEvent () {

            },

            //首页下拉刷新事件
            onRefresh () {
                if (this.currentTabIndex == 0) {
                    this.queryProductsList()
                } else if (this.currentTabIndex == 1) {
                    this.querySaleCalendar()
                };
                this.queryBannerList()
            },

            // 查询作品列表
            queryProductsList() {
                this.isShowLoadFail = false;
                this.loadingShow = true;
                this.emptyShow = false;
                inquareProductList().then((res) => {
                    this.digitalCollectionList = [];
                    this.changeIsRefreshHomePage(false);
                    this.isRefresh = false;
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                        if (res.data.list.length == 0) {
                            this.emptyShow = true;
                        } else {
                            for (let item of res.data.list) {
                                this.digitalCollectionList.push({
                                    countdownTime: Number(item.seckillTime) - new Date().getTime(),
                                    presellStartCountdownTime: item.entity && Number(item.entity.start) - new Date().getTime(),
                                    presellEndCountdownTime: item.entity && Number(item.entity.end) - new Date().getTime(),
                                    digitalCollectionName: item.name,
                                    digitalCollectioUrl: item.imgPath,
                                    digitalCollectioShare: item.quantity,
                                    digitalCollectioAuthor: item.publisher,
                                    creator: item.creator,
                                    digitalCollectioAuthorPhoto: item.avatar,
                                    digitalCollectioPrice: item.price,
                                    tagAttributes: item.tags,
                                    id: item.id,
                                    entity: item.entity,
                                    priority: item.priority,
                                    presale: item.presale,
                                    status: item.status,
                                    isShowCountDown: true,
                                    isBalancePaymentShow: true,
                                    isShowPresaleStartCountDown: true,
                                    isShowPresaleEndCountDown: true
                                })
                            };
                            console.log(this.digitalCollectionList)
                        }
                    } else {
                        this.isShowLoadFail = true;
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
                })
                .catch((err) => {
                    this.digitalCollectionList = [];
                    this.isRefresh = false;
                    this.loadingShow = false;
                    this.isShowLoadFail = true;
                    this.emptyShow = false;
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    })
                })
            },

            // 定时查询作品列表(实时更新任务状态)
            timingQueryProductsList() {
                this.isTimeoutContinue = false;
                inquareProductList().then((res) => {
                    this.isTimeoutContinue = true;
                    if (res && res.data.code == 0) {
                        if (res.data.list.length > 0) {
                            for (let item of res.data.list) {
                                let currentIndex = this.digitalCollectionList.indexOf(this.digitalCollectionList.filter((innerItem) => { return innerItem.id == item.id})[0]);
                                if (currentIndex != -1) {
                                    // 已售罄的状态不更改
                                    if (this.digitalCollectionList[currentIndex]['status'] != 2) {
                                        this.digitalCollectionList[currentIndex]['status'] = item.status;
                                        this.digitalCollectionList[currentIndex]['priority'] = item.priority;
                                        this.digitalCollectionList[currentIndex]['entity'] = item.entity
                                    }    
                                }
                            } 
                        }
                    }
                })
                .catch((err) => {
                    this.isTimeoutContinue = true
                })
            },

            // 查询发售日历
            querySaleCalendar() {
                this.isShowLoadFail = false;
                this.loadingShow = true;
                this.emptyShow = false;
                this.digitalCollectionCalendarList = [];
                inquareSellCalendar().then((res) => {
                        this.isRefresh = false;
                        this.loadingShow = false;
                        if (res && res.data.code == 0) {
                            if (res.data.list.length == 0) {
                                this.emptyShow = true;
                            } else {
                                this.digitalCollectionCalendarList = res.data.list
                            }
                        } else {
                            this.isShowLoadFail = true;
                            this.$toast({
                                message: `${res.data.msg}`,
                                position: 'bottom'
                            })
                        }
                    })
                    .catch((err) => {
                        this.isRefresh = false;
                        this.isShowLoadFail = true;
                        this.loadingShow = false;
                        this.emptyShow = false;
                        this.$toast({
                            message: `${err.message}`,
                            position: 'bottom'
                        })
                    })
            },

            //倒计时结束事件
            countDownEvent(index) {
                this.digitalCollectionList[index]['isShowCountDown'] = false
            },

            // 付尾款倒计时结束事件
            balancePaymentEvent () {
                this.digitalCollectionList[index]['isBalancePaymentShow'] = false
            },

            //预售倒计时结束事件(预售开始)
            presellStartCountDownEvent(index) {
                this.digitalCollectionList[index]['isShowPresaleStartCountDown'] = false
            },

            //预售倒计时结束事件(预售结束)
            presellEndCountDownEvent(index) {
                this.digitalCollectionList[index]['isShowPresaleEndCountDown'] = false
            },

            //作品访问统计
            productsVisitStatistics(item) {
                this.changeProductsId(item);
                this.$router.push({
                    name: 'collectionDetails',
                    params: {
                        id: item.id
                    }
                });
                productVisitRecord(item.id).then((res) => {
                })
                .catch((err) => {
                })
            },

            // 藏品点击详情事件
            objectDetailEvent(item, index) {
                this.productsVisitStatistics(item)
            },

            // 实名认证事件
            goAuthNameEvent() {
                this.$router.push({
                    path: '/realNameAuthentication'
                })
            },

            //去登陆事件
            goLoginEvent() {
                this.changeIsEnterLoginPageSource('/home');
                this.$router.push({
                    path: '/login'
                })
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
        /deep/ .tabBar-box {
            .van-nav-bar__placeholder {
                .van-nav-bar {
                    background: transparent !important;
                    height: 15px !important;
                    .van-nav-bar__content {
                        height: 15px !important
                    }
                }    
            }
        };
        /deep/ .van-pull-refresh {
            flex: 1;
            display: flex;
            .van-pull-refresh__track {
                flex: 1;
                display: flex;
                height: auto;
            }
        };
        .content {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            position: relative;
            .rare-object {
                width: 92%;
                height: 91px;
                margin: 0 auto;
                border-radius: 10px;
                /deep/ .van-swipe {
                    width: 100%;
                    height: 91px;
                    .van-swipe__track {
                        width: 100% !important;
                        height: 91px;
                        .van-swipe-item {
                            width: 100% !important;
                            height: 91px;
                            img {
                                height: 91px;
                                pointer-events: none;
                                width: 100%;
                                border-radius: 10px
                            }
                        }
                    }
                }
            };
            .rare-object-copy {
                width: 92%;
                height: 91px;
                margin: 0 auto;
                border-radius: 10px;
                background: #3b3b3b;
            };
            /deep/ .van-sticky--fixed {
                z-index: 2000
            };
            .tab-switch-box {
                height: 48px;
                .tab-switch {
                    z-index: 99999;
                    background: @color-background;
                    width: 92%;
                    margin: 0 auto;
                    padding: 4px 0;
                    box-sizing: border-box;
                    text-align: left;
                    span {
                        display: inline-block;
                        color: #777575;
                        font-size: 17px;
                        width: 100px;
                        height: 40px;
                        line-height: 40px;
                        text-align: left;
                    };
                    .active-tab-style {
                        color: #FFFFFF;
                        font-weight: bold;
                        position: relative;
                        border: none;
                        &:after {
                            content: '';
                            position: absolute;
                            left: 50%;
                            transform: translateX(-205%);
                            bottom: 0;
                            width: 10px;
                            height: 3px;
                            background: #f5cc9b
                        }
                    }
                }
            };
            .switch-content {
                flex: 1;
                width: 92%;
                margin: 0 auto;
                position: relative;
                /deep/ .van-empty {
                    width: 100%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%,-50%)
                };
                .object-box {
                    padding: 0 0 50px 0;
                    box-sizing: border-box;
                    .expect {
                        display: inline-block;
                        color: #484848;
                        font-size: 13px;
                        height: 30px;
                        width: 100%;
                        text-align: center;
                        line-height: 30px
                    };
                    .object-skeleton-list-box {
                        .object-skeleton-list {
                            border-radius: 10px;
                            position: relative;
                            margin-bottom: 20px;
                            background: @color-home-block;
                            padding-bottom: 10px;
                            box-sizing: border-box;
                            position: relative;
                            .top {
                                width: 100%;
                                margin: 0 auto;
                                background: #3b3b3b;
                                border-radius: 10px;
                                height: 388px
                            };
                            .bottom {
                                width: 92%;
                                margin: 0 auto;
                                .one {
                                    height: 25px;
                                    border-radius: 6px;
                                    width: 35%;
                                    background: #3b3b3b;
                                    margin-top: 10px;
                                };
                                .two {
                                    border-radius: 6px;
                                    height: 25px;
                                    width: 30%;
                                    background: #3b3b3b;
                                    margin: 10px 0;
                                };
                                .three {
                                    border-radius: 6px;
                                    height: 25px;
                                    width: 40%;
                                    background: #3b3b3b
                                };
                                .four {
                                    border-radius: 6px;
                                    height: 20px;
                                    width: 70px;
                                    background: #3b3b3b;
                                    position: absolute;
                                    bottom: 10px;
                                    right: 10px;
                                }
                            }
                        };
                    };    
                    .object-content-load-fail {
                        height: 60vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        font-size: 12px;
                        color: #fff;
                        >span {
                            &:nth-child(2) {
                                color: #686868;
                                margin: 20px 0 15px 0;
                            };
                             &:nth-child(3) {
                                font-size: 14px;
                                display: inline-block;
                                width: 110px;
                                height: 30px;
                                text-align: center;
                                line-height: 30px;
                                border: 1px solid #fff;
                                border-radius: 20px
                            }
                        }
                    };
                    .object-list-box {
                        .object-list {
                            border-radius: 8px;
                            position: relative;
                            margin-bottom: 20px;
                            background: @color-home-block;
                            .sell-info-area {
                                position: absolute;
                                top: 10px;
                                font-size: 12px;
                                left: 4%;
                                width: 92%;
                                display: flex;
                                flex-flow: row nowrap;
                                justify-content: space-between;
                                z-index: 100;
                                color: #333;
                                .left-sell {
                                    background: rgba(0, 0, 0, .9);
                                    color: #63b66b;
                                    border-radius: 16px;
                                    height: 24px;
                                    padding: 0 10px;
                                    box-sizing: border-box;
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    span {
                                        &:nth-child(2) {
                                            margin: 0 4px
                                        }
                                    };
                                    /deep/ .van-icon {
                                    };
                                    /deep/ .van-count-down {
                                        color: #63b66b;
                                        font-size: 12px;
                                    }
                                };
                                .left {
                                    background: rgba(0, 0, 0, .9);
                                    color: #bd68ff;
                                    border-radius: 16px;
                                    padding: 0 10px;
                                    height: 24px;
                                    box-sizing: border-box;
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    span {
                                        &:nth-child(2) {
                                            margin: 0 4px
                                        }
                                    };
                                    /deep/ .van-icon {
                                    };
                                    /deep/ .van-count-down {
                                        color: #bd68ff;
                                        font-size: 12px;
                                        line-height: 0 !important
                                    }
                                };
                                .center {
                                    background:rgba(0, 0, 0, .9);
                                    border-radius: 16px;
                                    padding: 0 10px;
                                    height: 24px;
                                    box-sizing: border-box;
                                    color: #fff;
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    span {
                                        &:nth-child(2) {
                                            margin: 0 4px
                                        }
                                    };
                                    /deep/ .van-icon {
                                    };
                                };
                                .right {
                                    background: rgba(0, 0, 0, .9);
                                    border-radius: 14px;
                                    padding: 0 10px;
                                    box-sizing: border-box;
                                    height: 24px;
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    color: #e9ad70;
                                    span {
                                        &:nth-child(2) {
                                            margin: 0 4px
                                        }
                                    };
                                    /deep/ .van-icon {
                                    };
                                }
                            }
                            ;
                            .image-area {
                                width: 100%;
                                margin: 0 auto;
                                min-height: 388px;
                                img {
                                    pointer-events: none;
                                    width: 100%;
                                    display: block;
                                    border-radius: 8px;
                                }
                            }
                            ;
                            .message-area {
                                padding: 12px 0;
                                width: 92%;
                                margin: 0 auto;
                                .message-top {
                                    width: 100%;
                                    font-size: 19px;
                                    color: #FFFFFF;
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    >span {
                                        display: inline-block;
                                        flex: 1;
                                        width: 0;
                                        .no-wrap();
                                    }
                                    >p {
                                        flex: 1;
                                        overflow: auto;
                                        height: 40px;
                                        display: flex;
                                        flex-flow: row nowrap;
                                        align-items: center;
                                        >span {
                                            display: inline-block;
                                            padding: 0 4px;
                                            height: 20px;
                                            border: 1px solid #bd6aff;
                                            font-size: 10px;
                                            border-radius: 10px;
                                            margin-right: 4px;
                                            text-align: center;
                                            line-height: 20px;
                                            color: #bd68ff;
                                            &:last-child {
                                                margin-right: 0
                                            }
                                        }
                                    }
                                };
                                .message-bottom {
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: space-between;
                                    .left {
                                        width: 75%;
                                        .number {
                                            font-size: 0;
                                            margin: 10px 0;
                                            height: 20px;
                                            display: flex;
                                            flex-flow: row nowrap;
                                            align-items: center;
                                            justify-content: flex-start;
                                            span {
                                                font-size: 12px;
                                                height: 20px;
                                                display: inline-block;
                                                display: flex;
                                                flex-flow: row nowrap;
                                                align-items: center;
                                                padding: 0 8px;
                                                box-sizing: border-box;
                                                &:first-child {
                                                    background: #f0c796;
                                                    color: black;
                                                    border-top-left-radius: 2px;
                                                    border-bottom-left-radius: 2px;
                                                }
                                                ;
                                                &:last-child {
                                                    background: #4e4e4e;
                                                    color: #edc695;
                                                    border-top-right-radius: 2px;
                                                    border-bottom-right-radius: 2px
                                                }
                                            }
                                        }
                                        ;
                                        .author {
                                            display: flex;
                                            flex-flow: row nowrap;
                                            align-items: center;
                                            img {
                                                width: 20px;
                                                height: 20px;
                                                border-radius: 50%;
                                                vertical-align: top;
                                            };
                                            span {
                                                flex: 1;
                                                margin-left: 6px;
                                                font-size: 13px;
                                                color: #686866;
                                                margin-top: 2px;
                                                .no-wrap()
                                            }
                                        }
                                    }
                                    ;
                                    .right {
                                        display: flex;
                                        flex-direction: column;
                                        justify-content: flex-end;
                                        align-items: flex-end;
                                        width: 25%;
                                        span {
                                            font-size: 20px;
                                            font-weight: bold;
                                            color: #FFFFFF;
                                            &:first-child {
                                                margin-right: 4px
                                            }
                                        }
                                    }
                                }    
                            }
                        }
                    }    
                };
                .sell-date-box {
                    padding: 0 0 50px 0;
                    box-sizing: border-box;
                    .expect {
                        display: inline-block;
                        color: #484848;
                        font-size: 13px;
                        height: 30px;
                        width: 100%;
                        text-align: center;
                        line-height: 30px
                    };
                     .object-content-load-fail {
                        height: 60vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        font-size: 12px;
                        color: #fff;
                        >span {
                            &:nth-child(2) {
                                color: #686868;
                                margin: 20px 0 15px 0;
                            };
                             &:nth-child(3) {
                                font-size: 14px;
                                display: inline-block;
                                width: 110px;
                                height: 30px;
                                text-align: center;
                                line-height: 30px;
                                border: 1px solid #fff;
                                border-radius: 20px
                            }
                        }
                    };
                    .sell-title {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-top: 2px;
                        box-sizing: border-box;
                        .left {
                            color: #edc695;
                            font-size: 18px;
                        }
                        ;
                        .right {
                            span {
                                display: inline-block;
                                font-size: 12px;
                                height: 20px;
                                line-height: 20px;
                                &:first-child {
                                    padding: 0 8px;
                                    background: #4e4e4e;
                                    border-radius: 20px
                                }
                                ;
                                &:last-child {
                                    padding: 0 8px;
                                    margin-left: 10px;
                                    background: #f0c796;
                                    border-radius: 20px
                                }
                            }
                        }
                    }
                    ;
                    .sell-content-list {
                        border-radius: 12px;
                        margin-bottom: 20px;
                        padding: 6px 0 0 0;
                        border-radius: 12px;
                        .month-day {
                            color: #FFFFFF;
                            font-size: 16px;
                        }
                        ;
                        .same-hour-list {
                            .hour {
                                display: flex;
                                flex-flow: row nowrap;
                                justify-content: center;
                                align-items: center;
                                color: #fff;
                                font-size: 16px;
                                height: 30px;
                                margin: 0 auto;
                                width: 90px;
                                background: #2b2b28;
                                border-radius: 20px;
                                span {
                                    margin-left: 4px
                                }
                            }
                            ;
                            .object-details-list {
                                margin: 16px 0;
                                .object-details {
                                    display: flex;
                                    flex-flow: row nowrap;
                                    justify-content: flex-start;
                                    align-items: center;
                                    border-radius: 12px;
                                    height: 130px;
                                    padding-left: 20px;
                                    box-sizing: border-box;
                                    background-color: @color-block;
                                    >div {
                                        &:first-child {
                                            width: 90px;
                                            border-radius: 12px;
                                            margin-right: 12px;
                                            img {
                                                pointer-events: none;
                                                width: 100%;
                                                display: block;
                                                border-radius: 12px;
                                            }
                                        }
                                        ;
                                        &:last-child {
                                            display: flex;
                                            flex-direction: column;
                                            justify-content: space-around;
                                            flex: 1;
                                            width: 0;
                                            padding: 4px 0;
                                            >div {
                                                &:nth-child(1) {
                                                    font-size: 18px;
                                                    color: #FFFFFF;
                                                    span {
                                                        display: inline-block;
                                                        width: 100%;
                                                        .no-wrap()
                                                    }
                                                }
                                                ;
                                                &:nth-child(2) {
                                                    font-size: 0;
                                                    height: 20px;
                                                    margin-right: 10px;
                                                    display: flex;
                                                    flex-flow: row nowrap;
                                                    align-items: center;
                                                    justify-content: flex-start;
                                                    margin: 10px 0;
                                                    span {
                                                        font-size: 12px;
                                                        height: 20px;
                                                        display: inline-block;
                                                        display: flex;
                                                        flex-flow: row nowrap;
                                                        align-items: center;
                                                        padding: 0 8px;
                                                        box-sizing: border-box;
                                                        &:first-child {
                                                            background: #f0c796;
                                                            color: black;
                                                            border-top-left-radius: 2px;
                                                            border-bottom-left-radius: 2px;
                                                        }
                                                        ;
                                                        &:last-child {
                                                            background: #4e4e4e;
                                                            color: #edc695;
                                                            border-top-right-radius: 2px;
                                                            border-bottom-right-radius: 2px
                                                        }
                                                    }
                                                }
                                                ;
                                                &:nth-child(3) {
                                                    span {
                                                        font-size: 18px;
                                                        color: #FFFFFF;
                                                        font-weight: bold;
                                                        &:first-child {
                                                            margin-right: 4px
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        ;
                    }
                }
            }
            ;
            .name-auth {
                width: 92%;
                left: 4%;
                position: fixed;
                bottom: 60px;
                height: 50px;
                z-index: 300;
                border-radius: 6px;
                background: #f0c796;
                text-align: center;
                padding: 0 10px;
                line-height: 50px;
                font-size: 10px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                box-sizing: border-box;
                .left {
                    flex: 1;
                    height: 50px;
                    width: 0;
                    text-align: left;
                    >span {
                        width: 100%;
                        display: inline-block;
                        font-weight: bold;
                        font-size: 12px;
                        .no-wrap()
                    }
                };
                .right {
                    width: 40%;
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: flex-end;
                    align-items: center;
                    >span {
                        text-align: center;
                        line-height: 36px;
                        height: 36px;
                        width: 80px;
                        box-sizing: border-box;
                        border-radius: 20px;
                        font-size: 14px;
                        background: rgb(40, 40, 40);
                        color: #edc695;
                        margin-right: 10px
                    }
                }
            }
        }
    }
</style>