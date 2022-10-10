<template>
	<div class="page-box" id="top-content">
        <van-loading type="spinner" v-show="loadingShow"/>
        <van-overlay :show="overlayShow" />
        <van-nav-bar left-arrow :border="false"
            :placeholder="true"
            :fixed="true"
            z-index="1000"
            :safe-area-inset-top="true"
            @click-left="onClickLeft"
            @click-right="onClickRight"
        >
            <template #right>
                <img :src="sharePng" alt="">
            </template>
        </van-nav-bar>
        <div class="light-box">
            <img :src="lightPng" alt="">
        </div>
        <div class="content">
            <div class="content-top">
                <div class="collection-exhibition">
                    <div class="loading-img-wrapper">
                        <img :src="imgLoadingGif" class="loading-img" v-show="loadingImgGifShow || threeDimensionalShow">
                    </div>
                    <div class="abbr-img" v-show="productsDetails.three === '0'">
                        <img :src="productsDetails.path"  v-show="!loadingImgGifShow">
                    </div>
                    <div class="three-dimensional-img" v-show="productsDetails.three !== '0'">
                        <model-obj
                            v-if="!loadingImgGifShow && productsDetails.three === 'obj'" 
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="productsDetails.path"
                            :backgroundAlpha="1"
                            :mtl="productsDetails.mtlPath"
                            :textures="productsDetails.textures"
                            :width="500"
                            :height="300" 
                            backgroundColor="#1e1e1b">
                        </model-obj>
                        <model-fbx
                            v-if="!loadingImgGifShow && productsDetails.three === 'fbx'" 
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="productsDetails.path"
                            :textures="productsDetails.textures" 
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-fbx>
                        <model-three
                            v-if="!loadingImgGifShow && productsDetails.three === 'json'" 
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="productsDetails.path"
                            :textures="productsDetails.textures"  
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-three>
                        <model-stl
                            v-if="!loadingImgGifShow && productsDetails.three === 'stl'"  
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="productsDetails.path"
                            :textures="productsDetails.textures"  
                            :backgroundAlpha="1" 
                            :width="500"
                            :height="300" 
                            backgroundColor="#1e1e1b">
                        </model-stl>
                        <model-collada
                            v-if="!loadingImgGifShow && productsDetails.three === 'dae'"  
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="productsDetails.path"
                            :textures="productsDetails.textures"  
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-collada>
                        <model-ply
                            v-if="!loadingImgGifShow && productsDetails.three === 'ply'"  
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="productsDetails.path"
                            :textures="productsDetails.textures"   
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-ply>
                        <model-gltf
                            v-if="!loadingImgGifShow && productsDetails.three === 'gltf'"  
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="productsDetails.path"
                            :textures="productsDetails.textures"  
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-gltf>
                    </div>
                </div>
                <div class="booth">
                    <img :src="boothPng" alt="">
                </div>
                <div class="synopsis" :style="{backgroundImage: 'url(' + detailsTitleWrappper+ ')',backgroundRepeat:'no-repeat',backgroundSize:'cover'}">
                    <div class="title" v-show="!loadingImgGifShow">
                        <span>
                            {{productsDetails.name}}
                        </span>
                    </div>
                    <div class="number" v-show="!loadingImgGifShow">
                        <div class="left">
                            <span>限量</span>
                            <span>{{productsDetails.quantity}}份</span>
                        </div>
                        <!-- <div class="right">
                            <span>剩余</span>
                            <span>{{productsDetails.surplus}}份</span>
                        </div> -->
                    </div>
                </div>
                <div class="divider">
                    <van-divider :style="{ color: '#616161', borderColor: '#8c8c8c'}">
                        <van-icon name="lock" color="#616161" size="20" />
                        购买即可体验内容
                    </van-divider>
                </div>
            </div>
            <div class="content-middle">
                <div class="framer" @click="toWorkRoomEvent" v-if="!loadingImgGifShow">
                    <div>
                        <img :src="productsDetails.avatar">
                    </div>
                    <div>
                        <span>{{productsDetails.creator}}</span>
                        <span>{{productsDetails.publisher}}</span>
                    </div>
                </div>
                <!-- <div class="focus-box">
                    <span>关注</span>
                </div> -->
            </div>
            <div class="collection-story-box">
                <div class="img-box" v-lazy-container="{ selector: 'img' }">
                    <img :data-src="item" v-for="(item) in productsDetails.describe" :key="item">
                </div>
                <div class="publisher-title">
                    <span>发行方 : {{productsDetails.publisher}}</span>
                </div>
            </div>
            <div class="purchase-information">
                <div class="information-title">
                    <span>购买须知</span>
                </div>
                <div class="issure-title">
                    <p>
                        数字藏品为虚拟数字商品，而非实物，仅限实名认证为年满14周岁的中国大陆用户购买。数字藏品的版权由发行方或原创者拥有，除另行取得版权拥有者书面同意外，用户不得将数字藏品用于任何商业用途。本商品一经售出，不支持退换。本商品源文件不支持本地下载。请勿对数字藏品进行炒作、场外交易、欺诈，或以上任何其他非法方式进行使用。
                    </p>
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
        <div class="content-bottom">
            <!-- 未开启预售 -->
            <div class="sell-area" v-if="productsDetails.presale == 0">
                <div v-show="!loadingImgGifShow">
                    <span>¥ {{productsDetails.price}}</span>
                </div>
                <div :class="{'sellStyle': !isCountDownShow,'purchaseStyle': (productsDetails.status == 1 || !isCountDownShow) && productsDetails.status != 2}" v-show="!loadingImgGifShow" @click="purchaseEvent">
                    <span>{{isCountDownShow ? '即将开售' : productsDetails.status == 1  ||  productsDetails.status == 0 ? '购 买' : '已售罄'}}</span>
                    <van-count-down v-show="isCountDownShow" :time="Number(productsDetails.seckillTime) - new Date().getTime()" format="DD:HH:mm:ss" @finish="countDownEvent"/>
                </div>
            </div>
            <!-- 标记支付售卖开始 -->
            <van-count-down v-show="false" :time="Number(productsDetails.seckillTime) - new Date().getTime()" format="DD:HH:mm:ss" @finish="countDownEvent"/>
            <!-- 标记预售开始 -->
            <van-count-down v-show="false" :time="Number(productsDetails.entity && productsDetails.entity.start) - new Date().getTime()" format="DD:HH:mm:ss" @finish="presellStartCountDownEvent"/>
            <!-- 标记预售结束 -->
            <van-count-down v-show="false" :time="Number(productsDetails.entity && productsDetails.entity.end) - new Date().getTime()" format="DD:HH:mm:ss" @finish="presellEndCountDownEvent"/>
             <!-- 标记付尾款开始 -->
            <van-count-down v-show="false" :time="Number(productsDetails.seckillTime) - new Date().getTime()" format="DD:HH:mm:ss" @finish="balancePaymentEvent"/>
            <!-- 开启预售 -->
            <div class="presell-area" v-if="productsDetails.presale == 1 && productsDetails.status == 0">   
                <div v-if="!loadingImgGifShow && (productsDetails.entity.status == 1  ||  productsDetails.entity.status == 0)">
                    <span>预购金额 ¥ {{productsDetails.entity.amount}}</span>
                </div>
                <div :class="{'sellStyle': !isShowPresaleStartCountDown,'purchaseStyle': productsDetails.entity.status == 1 || !isShowPresaleStartCountDown}" v-if="!loadingImgGifShow && (productsDetails.entity.status == 1  ||  productsDetails.entity.status == 0)" @click="presellPurchaseEvent">
                    <span>{{isShowPresaleStartCountDown ? '即将预购' : productsDetails.entity.status == 1  ||  productsDetails.entity.status == 0 ? '预 购' : '预购结束'}}</span>
                    <van-count-down v-show="isShowPresaleStartCountDown" :time="Number(productsDetails.entity.start) - new Date().getTime()" format="DD:HH:mm:ss" @finish="presellStartCountDownEvent"/>
                </div>
                <div v-if="!loadingImgGifShow && productsDetails.entity.status == 2 && (productsDetails.priority == 0 || productsDetails.priority == 1) ">
                    <span>¥ {{productsDetails.price}}</span>
                </div>
                <div :class="{'sellStyle': false,'purchaseStyle': false}" v-if="!loadingImgGifShow && productsDetails.priority == 0 && productsDetails.entity.status == 2">
                    <span>即将开售</span>
                    <van-count-down :time="Number(productsDetails.seckillTime) - new Date().getTime()" format="DD:HH:mm:ss" @finish="countDownEvent"/>
                </div>
                <div :class="{'sellStyle': !isBalancePaymentShow,'purchaseStyle': !isBalancePaymentShow}" v-if="!loadingImgGifShow && productsDetails.priority == 1 && !isShowPresaleEndCountDown && productsDetails.entity.status == 2" @click="purchaseEvent">
                    <span>{{isBalancePaymentShow ? '即将支付尾款' : '支付尾款'}}</span>
                    <van-count-down v-show="isBalancePaymentShow" :time="Number(productsDetails.seckillTime) - new Date().getTime()" format="DD:HH:mm:ss" @finish="balancePaymentEvent"/>
                </div>
            </div>
            <div class="presell-area" v-if="productsDetails.presale == 1 && productsDetails.status == 1">   
                <div v-if="!loadingImgGifShow">
                    <span>¥ {{productsDetails.price}}</span>
                </div>
                <div :class="{'sellStyle': true,'purchaseStyle': true}" v-if="!loadingImgGifShow && productsDetails.priority == 0 && productsDetails.status == 1" @click="purchaseEvent">
                    <span>购 买</span>
                </div>
                <div :class="{'sellStyle': true,'purchaseStyle': true}" v-if="!loadingImgGifShow && productsDetails.priority == 1 && productsDetails.status == 1" @click="purchaseEvent">
                    <span>支付尾款</span>
                </div>
            </div>
            <div class="presell-area" v-if="productsDetails.presale == 1 && productsDetails.status == 2">   
                <div v-show="!loadingImgGifShow">
                    <span>¥ {{productsDetails.price}}</span>
                </div>
                <div :class="{'sellStyle': true,'purchaseStyle': false}">
                    <span>已售罄</span>
                </div>
            </div>  
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
    import {
        ModelObj,
        ModelThree,
        ModelFbx,
        ModelCollada,
        ModelStl,
        ModelPly,
        ModelGltf
    } from "vue-3d-model";
    import { isAndroid_ios, isWeiXin, getUrlParam } from '@/common/js/utils'
	import {inquareProductDetails,purchaseCommodity,inquareUserInfo,productionShare,presellPurchaseCommodity} from '@/api/products.js'
    let windowTimer
	export default {
        name: 'DigitalCollectionDetails',
		components: { 
            ModelObj,
            ModelThree,
            ModelFbx,
            ModelCollada,
            ModelStl,
            ModelPly,
            ModelGltf
        },
		data() {
			return {
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                isDisabled: false,
                isTimeoutContinue: true,
                isShareDisabled: false,
	            timer: null,
                collectionExhibitionHeight: '',
                isShowContent: false,
                loadingImgGifShow: false,
                threeDimensionalShow: false,
                loadingShow: false,
                overlayShow: false,
                productsDetails: {
                    entity: {}
                },
                isCountDownShow: true,
                isBalancePaymentShow: true,
                isShowPresaleStartCountDown: true,
                isShowPresaleEndCountDown: true,
                timeIndex: null,
                lights: [
                    {
                        type: 'HemisphereLight',
                        position: { x: 0, y: 1, z: 0 },
                        skyColor: 0xffffff,
                        groundColor: 0xFF0000, // 此代码为灯光后颜色
                        intensity: 0.1,
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 1, y: 1, z: 1 },
                        color: 0xffffff,
                        intensity: 0.1
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: -1, y: 1, z: 1 },
                        color: 0xffffff,
                        intensity: 0.1
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 1, y: 1, z: -1 },
                        color: 0xffffff,
                        intensity: 0.1
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: -1, y: 1, z: -1 },
                        color: 0xffffff,
                        intensity: 0.1
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 0, y: -1, z: 0 },
                        color: 0xffffff,
                        intensity: 0.1
                    }
                ],
                imgLoadingGif: require("../../../static/img/img-loading.gif"),
                digitalCollectioUrl: require("@/common/images/home/default-person.png"),
                sharePng: require("@/common/images/login/my-details-share.png"),
                boothPng: require("@/common/images/home/booth.png"),
                lightPng: require("@/common/images/home/light.png"),
                detailsTitleWrappper: require("@/common/images/home/details-title-wrapper.png"),
                blockchainServePng: require("@/common/images/home/blockchain-service.png")
			}
		},

		onReady() {},
		computed: {
			...mapGetters([
                'productsId',
                'isLogin',
                'userInfo',
                'inviteMessage'
			])
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
            // 轮询任务状态
            if (!windowTimer) {
                windowTimer = window.setInterval(() => {
                    if (this.isTimeoutContinue && this.productsDetails.status != 2) {
                        this.timingQueryProductDetails()
                    }
                }, 3000)
            };
            this.gainInviteMessage();
            this.toTop();
            this.queryProductDetails()
		},

        beforeDestroy() {
            if(this.timer) { 
                clearTimeout(this.timer)
            };
            if (this.timeIndex) {
                cancelAnimationFrame(this.timeIndex); 
            };
            if(windowTimer) {
                clearTimeout(windowTimer);
                windowTimer = null
            }
        },

		methods: {
			...mapMutations([
                'changeOrderId',
                'changeIsPaying',
                'changeProductsId',
                'storeUserInfo',
                'changeIsRefreshHomePage',
                'changeIsEnterLoginPageSource',
                'changeInviteMessage'
			]),

            rotate () {
                if (this.timeIndex) {
                    cancelAnimationFrame(this.timeIndex); 
                };
                this.rotation.y += 0.01;
                this.timeIndex = requestAnimationFrame(this.rotate)
            },

            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },

            //3d模型加载完成事件
            threeDimensionalLoaded () {
                console.log('加载完毕');
                this.threeDimensionalShow = false;
                this.rotate();
            },

            //3d模型加载过程
            threeDimensionProgress (e) {
                console.log(e)
            },

            //3d模型加载失败
            threeDimensionalError () {
                this.threeDimensionalShow = false;
                this.$toast({
                    message: '3D模型加载失败!',
                    position: 'bottom'
                })
            },

            // 通过扫码进入商品详情页时获取相关参数(作品id、邀请类型、邀请码)
            gainInviteMessage () {
                let commId;
                if (window.location.href.indexOf("commId") != -1) {
                    commId = getUrlParam('commId');
                    let temporaryMessage = {};
                    temporaryMessage['id'] = commId;
                    this.changeProductsId(temporaryMessage)
                };
                if (window.location.href.indexOf("inviteType") != -1) {
                    let inviteType = getUrlParam('inviteType');
                    let temporaryInviteMessage = {};
                    temporaryInviteMessage = !this.inviteMessage ? {} : this.inviteMessage;
                    temporaryInviteMessage['inviteType'] = inviteType;
                    temporaryInviteMessage['id'] = commId
                    this.changeInviteMessage(temporaryInviteMessage)
                };
                if (window.location.href.indexOf("inviteId") != -1) {
                    let inviteId = getUrlParam('inviteId');
                    let temporaryInviteMessage = {};
                    temporaryInviteMessage = !this.inviteMessage ? {} : this.inviteMessage;
                    temporaryInviteMessage['inviteId'] = inviteId;
                    temporaryInviteMessage['id'] = commId;
                    this.changeInviteMessage(temporaryInviteMessage)
                } 
            },

            // 定时查询作品详情状态
            timingQueryProductDetails () {
                this.isTimeoutContinue = false;
                inquareProductDetails(this.productsId.id).then((res) => {
                    this.isTimeoutContinue = true;
                    if (res && res.data.code == 0) {
                        this.productsDetails = res.data.data;
                        this.productsDetails.entity = res.data.data.entity
                    }
                })
                .catch((err) => {
                    this.isTimeoutContinue = true
                })
            },

            // 查询作品详情
            queryProductDetails () {
                return new Promise((resolve,rejrect) => {
                    this.loadingImgGifShow = true;
                    inquareProductDetails(this.productsId.id).then((res) => {
                        this.loadingImgGifShow = false;
                        if (res && res.data.code == 0) {
                            if (res.data.data.three !== '0') {
                                this.threeDimensionalShow = true
                            };
                            this.productsDetails = res.data.data;
                            this.productsDetails.entity = res.data.data.entity;
                            this.isShowContent = true;
                            resolve();
                            if (this.isLogin) {
                                if (!this.userInfo) {
                                    this.queryuserInfo()
                                }
                            };
                        } else {
                            this.$toast({
                                message: `${res.data.msg}`,
                                position: 'bottom'
                            })
                        }
                    })
                    .catch((err) => {
                        this.loadingImgGifShow = false;
                         this.$toast({
                            message: `${err.message}`,
                            position: 'bottom'
                        })
                    })
                })    
            },

            // 购买商品
            async purchaseEvent () {
                // 防止多次快速点击
                if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                //未开售
                if (this.isCountDownShow && this.productsDetails.priority == 0) {
                    return
                };
                //付尾款未开始
                if (this.isBalancePaymentShow && this.productsDetails.priority == 1) {
                    return
                };
                //已售罄
                if (this.productsDetails.status == 2) {
                    return
                };
                // 未登录
                if (!this.isLogin) {
                    this.changeIsEnterLoginPageSource('/collectionDetails');
                    this.$router.push({
                        path: '/login'
                    });
                    return
                };
                // 未认证或账户已冻结
                if (this.userInfo.realFlag != 1) {
                    this.$router.push({
                        path: '/realNameAuthentication'
                    });
                    return
                };
                await this.queryProductDetails();
                if (this.productsDetails.status == 2) {
                    return
                };
                this.buyCommodity()
            },

            // 预售购买商品
            async presellPurchaseEvent () {
                // 防止多次快速点击
                if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                //未开启预购
                if (this.isShowPresaleStartCountDown) {
                    return
                };
                //预购已售罄
                if (this.productsDetails.entity.status == 2) {
                    return
                };
                // 未登录
                if (!this.isLogin) {
                    this.changeIsEnterLoginPageSource('/collectionDetails');
                    this.$router.push({
                        path: '/login'
                    });
                    return
                };
                // 未认证或账户已冻结
                if (this.userInfo.realFlag != 1) {
                    this.$router.push({
                        path: '/realNameAuthentication'
                    });
                    return
                };
                await this.queryProductDetails();
                if (this.productsDetails.entity.status == 2) {
                    return
                };
                this.presellBuyCommodity()
            },

            // 查询用户信息
            queryuserInfo() {
                inquareUserInfo().then((res) => {
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
                         this.$toast({
                            message: `${err.message}`,
                            position: 'bottom'
                        })
                    })
            },

            // 购买商品
            buyCommodity () {
                this.loadingShow = true;
                this.overlayShow = true;
                let inviteType,inviteId;
                // 判断是不是通过邀请下单
                if (this.inviteMessage) {
                    if (this.inviteMessage.id == this.productsId.id) {
                        inviteType = this.inviteMessage['inviteType'];
                        inviteId = this.inviteMessage['inviteId']
                    }
                } else {
                    inviteType = '';
                    inviteId = ''
                };
                purchaseCommodity(this.productsId.id,inviteType,inviteId).then((res) => {
                    this.loadingShow = false;
                    this.overlayShow = false; 
                    if (res && res.data.code == 0) {
                        this.changeIsRefreshHomePage(true);
                        this.changeOrderId(res.data.data.orderId);
                        this.changeIsPaying(false);
                        this.$router.push({path: 'orderFormToPaid'})
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
                })
                .catch((err) => {
                    this.loadingShow = false;
                    this.overlayShow = false;
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    }) 
                })
            },

            // 预购买商品
            presellBuyCommodity () {
                this.loadingShow = true;
                this.overlayShow = true;
                let inviteType,inviteId;
                // 判断是不是通过邀请下单
                if (this.inviteMessage) {
                    if (this.inviteMessage.id == this.productsId.id) {
                        inviteType = this.inviteMessage['inviteType'];
                        inviteId = this.inviteMessage['inviteId']
                    }
                } else {
                    inviteType = '';
                    inviteId = ''
                };
                presellPurchaseCommodity(this.productsId.id,inviteType,inviteId).then((res) => {
                    this.loadingShow = false;
                    this.overlayShow = false; 
                    if (res && res.data.code == 0) {
                        this.changeIsRefreshHomePage(true);
                        this.changeOrderId(res.data.data.orderId);
                        this.changeIsPaying(false);
                        this.$router.push({path: 'orderFormToPaid'})
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
                })
                .catch((err) => {
                    this.loadingShow = false;
                    this.overlayShow = false;
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    }) 
                })
            },

            // 作品分享
            productionShareEvent() {
                return new Promise((resolve,rejrect) => {
                    this.loadingShow = true;
                    productionShare(this.productsId.id).then((res) => {
                        this.loadingShow = false;
                        if (res && res.data.code == 0) {
                            resolve(res.data.data)
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

            // 倒计时结束事件
            countDownEvent () {
                this.isCountDownShow = false
            },

            // 付尾款倒计时结束事件
            balancePaymentEvent () {
                this.isBalancePaymentShow = false
            },

            // 预售倒计时结束事件(预售开始)
            presellStartCountDownEvent () {
                this.isShowPresaleStartCountDown = false
            },

            // 预售倒计时结束事件(预售结束)
            presellEndCountDownEvent () {
                this.isShowPresaleEndCountDown = false
            },

			toWorkRoomEvent() {
                return;
                this.$router.push({path: 'workRoom'})
            },

            onClickLeft () {
                this.$router.push({path: 'home'})
            },

            onClickRight () {
                if (IsPC()) { return };
                if (isWeiXin()) { return };
                if(this.isShareDisabled) return;
                this.isShareDisabled = !this.isShareDisabled;
                this.timer = setTimeout(() => {this.isShareDisabled = !this.isShareDisabled;},3000);
                this.myShareEvent()
            },

            async myShareEvent () {
                let shareUrl = await this.productionShareEvent();
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

<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
    @keyframes product-animation{
        0% {
            transform: translateX(-1px) translateZ(10px) rotateY(0deg)
        }
        25% {
            transform: translateX(-1px) translateZ(10px) rotateY(15deg)
        }
        50% {
            transform: translateX(-1px) translateZ(10px) rotateY(-15deg)
        }
        75% {
            transform: translateX(-1px) translateZ(10px) rotateY(15deg)
        }
        100% {
            transform: translateX(-1px) translateZ(10px) rotateY(0deg)
        }
    };
	.page-box {
		.content-wrapper();
        background: @color-background;
        /deep/ .van-nav-bar {
            background: transparent;
            .van-icon-arrow-left {
                color: #fff !important;
                font-size: 18px !important
            };
            .van-nav-bar__right {
                img {
                    width: 20px;
                    height: 20px
                }
            }
        };
        .light-box {
            width: 80%;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            >img {
                width: 100%
            }
        };
        .content {
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            padding-bottom: 80px;
            box-sizing: border-box;
            .content-top {
                .collection-exhibition {
                    perspective-origin: 50% 50%;
                    transform-style: preserve-3d;
                    transform: perspective(400px);
                    width: 80%;
                    margin: 0 auto;
                    position: relative;
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    justify-content: center;
                    height: 50vh;
                    .abbr-img {
                        transform: translate3d(0, 0, 0);
                        width: 100%;
                        height: 35vh;
                        margin-top: 6vh;
                        animation-name: product-animation;
                        animation-duration: 14s;
                        animation-iteration-count: infinite;
                        img {
                            pointer-events: none;
                            width: 100%;
                            height: 100%;
                            object-fit: contain
                        }
                    };
                    .loading-img-wrapper {
                        position: absolute;
                        width: 100px;
                        height: 100px;
                        top: 50%;
                        transform: translateY(-50%);
                        .loading-img {
                            width: 100px;
                        }
                    };    
                    .three-dimensional-img {
                        width: 100%;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;
                        align-items: center;
                        >div {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: center;
                            align-items: center;
                        }
                    }
                };
                .booth {
                    width: 80%;
                    margin: 0 auto;
                    margin-top: 30px;
                    img {
                        width: 100%
                    }
                };
                .synopsis {
                    width: 80%;
                    height: 80px;
                    display: flex;
                    margin: 0 auto;
                    margin-top: 20px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    .title {
                        width: 80%;
                        height: 24px;
                        font-size: 24px;
                        color: #FFFFFF;
                        text-align: center;
                        font-weight: bold;
                        .no-wrap()
                    };
                    .number {
                        width: 80%;
                        font-size: 14px;
                        margin-top: 16px;
                        display: flex;
                        height: 40px;
                        flex-flow: row nowrap;
                        justify-content: center;
                        align-items: center;
                        .left {
                            font-size: 0;
                            height: 20px;
                            margin-right: 4px;
                            display: flex;
                            flex-flow: row nowrap;
                            align-items: center;
                            justify-content: center;
                            >span {
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
                                };
                                &:last-child {
                                    background: #4e4e4e;
                                    color: #edc795;
                                    border-top-right-radius: 2px;
                                    border-bottom-right-radius: 2px;
                                    flex: 1;
                                    overflow-x: scroll
                                }
                            }
                        }
                        .right {
                            font-size: 0;
                            height: 20px;
                            display: flex;
                            flex-flow: row nowrap;
                            align-items: center;
                            justify-content: center;
                            >span {
                                font-size: 12px;
                                display: inline-block;
                                height: 20px;
                                padding: 0 8px;
                                display: flex;
                                flex-flow: row nowrap;
                                align-items: center;
                                box-sizing: border-box;
                                &:first-child {
                                    background: #343434;
                                    color: #6d6d6d;
                                    border-top-left-radius: 2px;
                                    border-bottom-left-radius: 2px;
                                };
                                &:last-child {
                                    background: #4e4e4e;
                                    color: #edc695;
                                    border-top-right-radius: 2px;
                                    border-bottom-right-radius: 2px;
                                    flex: 1;
                                    overflow-x: scroll
                                }
                            }
                        }
                    }
                };
                .divider {
                    width: 80%;
                    margin: 0 auto;
                    margin-top: 20px;
                    /deep/ .van-divider {
                        .van-icon-lock {
                            margin-right: 4px
                        }
                    }
                }
		    };
            .collection-story-box {
                width: 94%;
                margin: 0 auto;
                margin-top: 10px;
                padding: 8px;
                box-sizing: border-box;
                background: @color-block;
                border-radius: 14px;
                .img-box {
                    width: 100%;
                    margin: 0 auto;
                    min-height: 10vh;
                    img {
                        pointer-events: none;
                        width: 100%;
                        margin-top: -1px;
                        display: block;
                        &:first-child {
                            margin-top: 0
                        }
                    }
                };
                .publisher-title {
                    padding-left: 10px;
                    font-size: 14px;
                    color: #fff;
                    width: 100%;
                    margin-top: 14px;
                    box-sizing: border-box;
                    span {
                        display: inline-block;
                        width: 100%;
                        .no-wrap()
                    }
                }
            };
            .content-middle {
                width: 94%;
                margin: 0 auto;
                background: @color-block;
                padding: 8px 10px;
                box-sizing: border-box;
                border-radius: 14px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                .framer {
                    display: flex;
                    flex-flow: row nowrap;
                    flex: 1;
                    > div {
                        &:first-child {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            margin-right: 10px;
                            img {
                                width: 100%;
                                height: 100%;
                                border-radius: 50%
                            }
                        };
                        &:last-child {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            flex: 1;
                            width: 0;
                            span {
                                color: #FFFFFF;
                                .no-wrap();
                                &:first-child {
                                    font-size: 17px;
                                    margin-bottom: 4px;
                                };
                                &:last-child {
                                    font-size: 14px;
                                    color: #686866;
                                }
                            }
                        }
                    }
                };
                .focus-box {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    width: 50px;
                    text-align: center;
                    margin-left: 10px;
                    span {
                        display: inline-block;
                        font-size: 12px;
                        height: 20px;
                        line-height: 20px;
                        background: #febd42;
                        border-radius: 20px
                    }
                }
            };
            .purchase-information {
                width: 94%;
                margin: 0 auto;
                margin-top: 10px;
                padding: 8px 18px;;
                box-sizing: border-box;
                background: @color-block;
                border-radius: 14px;
                .information-title {
                    span {
                        color: #fff;
                        font-size: 13px
                    }
                };
                .issure-title {
                    margin-top: 14px;
                    line-height: 20px;
                    p {
                        font-size: 13px;
                        color: #686868;
                        text-align: justify
                    }
                }	
            };
            .blockchain-server {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                margin: 20px 0;
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
        };
		.content-bottom {
            background: #00020f;
			height: 80px;
			width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
            padding-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
			margin-top: 10px;
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            box-sizing: border-box;
			> div {
                width: 100%;
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                > div {
                    &:first-child {
                        font-size: 18px;
                        height: 50px;
                        line-height: 50px;
                        color: #FFFFFF;
                        >span {
                            font-weight: bolder
                        }
                    };
                    &:last-child {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        font-size: 14px;
                        align-items: center;
                        background: #272833;
                        width: 140px;
                        padding: 8px 0;
                        box-sizing: border-box;
                        height: 50px;
                        border-radius: 26px;
                        color: #FFFFFF;
                        /deep/ .van-count-down {
                            color: #FFFFFF;
                        }
                    }
                }
                .sellStyle {
                    justify-content: center !important;
                    font-size: 18px !important
                };
                .purchaseStyle {
                    background: #ffd4a0 !important;
                    color: black !important
                }
            }
		}
	}
</style>

