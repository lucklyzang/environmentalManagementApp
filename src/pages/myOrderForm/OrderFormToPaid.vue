<template>
	<div class="content-box" id="top-content">
        <van-loading type="spinner" v-show="loadingShow"/>
        <van-overlay :show="overlayShow" />
		<NavBar :path="path" title="支付"/>
        <!-- 支付是否完成确认框 -->
        <van-dialog v-model="isShowPaySuccess" :show-confirm-button="false" :close-on-popstate="false" title="请确认微信支付是否已完成" :show-cancel-button="false">
            <div @click="completePaymentEvent">已完成支付</div>
            <div @click="paymentIssueEvent">支付遇到问题,重新支付</div>
        </van-dialog>
        <!-- 是否取消订单询问框 -->
        <van-dialog v-model="isShowOrderCancel" title="确定取消订单?" 
            confirm-button-color="#ffbd40"
            cancel-button-color="#b7b7b7"
            confirm-button-text="再想想"
            :close-on-popstate="false"
            cancel-button-text="取消订单"
            @confirm="cancelCancelOrderEvent"
            @cancel="cancelOrderSureEvent"
            show-cancel-button>
        </van-dialog>
		<div class="content-center">
            <div class="top">
                <span>
                    {{paymentSuccess ? '已完成': '未完成'}}
                </span>
                <van-count-down v-show="!paymentSuccess" :time="`${(new Date(orderFormDetails.createTime).getTime() + orderFormDetails.expire*60*1000) - new Date().getTime()}`" format="剩余 mm 分 ss 秒" @finish="cocuntDownEvent"/>
            </div>
			<div class="center">
				<div class="img-show">
					<img :src="orderFormDetails.imgPath">
				</div>
				<div class="span-show">
					<span>{{orderFormDetails.name}}</span>
					<span>¥ {{orderFormDetails.price}}</span>
				</div>
			</div>
            <div class="bottom" v-if="isShowWeixinPay">
                <div class="pay-methods">
                    <span>
                        支付方式
                    </span>
                </div>
                <div class="pay-methods-choose-list">
                    <van-radio-group v-model="radio" checked-color="#edc695">
                        <van-cell-group>
                            <van-cell clickable @click="radio = '1'">
                                <template #default>
                                    <img :src="weixinPayPng" alt="">
                                    <span>微信支付</span>
                                </template>
                                <template #right-icon>
                                    <van-radio name="1" />
                                </template>
                            </van-cell>
                            <!-- <van-cell clickable @click="radio = '2'">
                                 <template #default>
                                    <img :src="alipayPayPng" alt="">
                                    <span>支付宝支付</span>
                                </template>
                                <template #right-icon>
                                    <van-radio name="2" />
                                </template>
                            </van-cell>
                            <van-cell clickable @click="radio = '3'">
                                 <template #default>
                                    <img :src="otherPayPng" alt="">
                                    <span>其它支付</span>
                                </template>
                                <template #right-icon>
                                    <van-radio name="3" />
                                </template>
                            </van-cell> -->
                        </van-cell-group>
                    </van-radio-group>
                </div>
            </div>
            <div class="tooltip">
                <p>
                    本产品为虚拟内容, 购买后不支持退换、转让, 请斟酌确认
                </p>
            </div> 
		</div>
        <div class="content-bottom">
            <div class="btn-left">
                <span>
                    应付 ¥ {{orderFormDetails.price}}
                </span>
            </div>
            <div class="btn-right">
                <span class="cancel-order" @click="isShowOrderCancel = true" v-show="!paymentSuccess && !isPaying">取消订单</span>
                <span class="sure-pay" @click="surePay" v-show="!paymentSuccess && !isPaying">确认支付</span>
                <span class="sure-pay" v-show="paymentSuccess || isPaying">
                    {{paymentSuccess ? '支付成功' : isPaying ? '支付中' : '支付成功'}}
                </span>
            </div>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import NavBar from '@/components/NavBar'
    import { isAndroid_ios, isWeiXin, getUrlParam } from '@/common/js/utils'
	import {queryOrderDetails,cancelOrder,createPaymentOrder,queryPaymentResult} from '@/api/products.js'
    import {getOpenId} from '@/api/login.js'
	export default {
        name: 'OrderFormToPaid',
		components: {
            NavBar
		},
		data() {
			return {
                isShowPaySuccess: false,
                isShowOrderCancel: false,
                loadingShow: false,
                isShowWeixinPay: true,
                overlayShow: false,
                time: '',
                isDisabled: false,
                timer: null,
                path: '',
                paymentSuccess: false,
                orderFormDetails: {},
                weixinPayPng: require("@/common/images/home/weixin-pay.png"),
                alipayPayPng: require("@/common/images/home/alipay-pay.png"),
                otherPayPng: require("@/common/images/home/other-pay.png"),
                radio: "1"
			}
		},

		computed: {
			...mapGetters([
                'orderId',
                'isPaying',
                'appId',
                'isGetCode',
                'openId',
                'isIosPaySuccess',
                'productsId',
                'inviteMessage'
			])
		},

         beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.path = from.path
            })
        },

        beforeRouteLeave(to, from, next) {
            if (this.isShowPaySuccess || this.isPaying) {
                next(false)
            } else {
                next()
            }
        },

		mounted() {
            this.toTop();
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                    if (this.isShowPaySuccess || this.isPaying) {return};
                    pushHistory();
                    this.$router.push({
                        path: this.path
                    })
                })
            };
            if (this.isPaying) {
                this.isShowPaySuccess = true
            };
            if (this.isIosPaySuccess) {

            };
            // 提供给原生app调用的方法
			let me = this;
			window['getPayStatus'] = (val) => {
				me.getPayStatus(val);
			};

            //微信内支付
            if (isWeiXin()) {
                if (!this.openId) {
                    if (window.location.href.indexOf("code") != -1) {
                        let code = getUrlParam('code');
                        this.getOpenIdEvent(code);
                    }
                }
            };
            this.judgeisWithinApp();
            this.inquareOrderDetails(this.orderId)
		},

        beforeDestroy() {
            if(this.timer) { 
                clearTimeout(this.timer)
            }
        },

		methods: {
			...mapMutations([
                'changeIsPaying',
                'changeOrderId',
                'changeIsRefreshHomePage',
                'changeOpenId',
                'changeInviteMessage',
                'changeIsIosPaySuccess'
			]),

            // 获取苹果支付订单状态的值
			getPayStatus (val) {
                if (val == '成功') {
                    this.changeIsIosPaySuccess(true);
                    this.$toast({
                        message: '支付成功',
                        position: 'bottom'
                    })
                } else {
                    this.$toast({
                        message: '支付失败',
                        position: 'bottom'
                    })
                }
			},

            //让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},
            // 判断是否在app内
            judgeisWithinApp () {
                if (!isAndroid_ios()) {
                    try {
                        window.webkit.messageHandlers.setShareUrl.postMessage({functionName: 'iOSApp',parameter: ''});
                        this.isShowWeixinPay = false
                    } catch (err) {
                        this.isShowWeixinPay = true
                    }
                } else {
                    this.isShowWeixinPay = true
                }
            },

            // 查询订单详情
            inquareOrderDetails(id) {
                this.loadingShow = true;
                queryOrderDetails(id).then((res) => {
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                       this.orderFormDetails = res.data.data;
                       this.orderFormDetails.createTime = this.orderFormDetails.createTime.replace(/-/g,"/");
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
            },

            // 取消订单
            cancellationOfOrder() {
                if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                this.loadingShow = true;
                cancelOrder(this.orderId).then((res) => {
                    this.changeIsRefreshHomePage(true);
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                       this.$toast({
                            message: '订单取消成功',
                            position: 'bottom'
                        });
                        this.changeOrderId(this.orderId);
                        this.$router.push({name: 'orderFormDetails'})
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
            },

            // 查询支付结果
            queryPayResult(orderId) {
                if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                this.loadingShow = true;
                queryPaymentResult(orderId).then((res) => {
                    this.changeIsRefreshHomePage(true);
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                        //  -1-已取消 0-未支付 1-已支付，2-支付失败 
                        if (res.data.data.status == 1) {
                            this.$toast({
                                message: '订单支付成功',
                                position: 'bottom'
                            });
                            // 判断是不是通过邀请下单
                            if (this.inviteMessage) {
                                if (this.inviteMessage.id == this.productsId.id) {
                                //同一产品只算一次引流 
                                    this.changeInviteMessage('')
                                }
                            };
                            this.paymentSuccess = true;
                            this.changeIsPaying(false);
                            this.changeOrderId(orderId);
                            this.$router.push({name: 'orderFormDetails'})    
                        } else if (res.data.data.status == -1) {
                            this.$toast({
                                message: '订单已取消',
                                position: 'bottom'
                            });
                            this.paymentSuccess = false;
                            this.changeIsPaying(false);
                            this.changeOrderId(orderId);
                            this.$router.push({name: 'orderFormDetails'})
                        } else if (res.data.data.status == 0) {
                             this.$toast({
                                message: '订单未支付',
                                position: 'bottom'
                            });
                            this.changeOrderId(orderId);
                            this.paymentSuccess = false;
                            this.changeIsPaying(false)
                        } else if (res.data.data.status == 2) {
                            this.$toast({
                                message: '订单支付失败',
                                position: 'bottom'
                            });
                            this.changeOrderId(orderId);
                            this.paymentSuccess = false;
                            this.changeIsPaying(false)
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
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    })
                })
            },

            // 确认支付事件
            surePay () {
                if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                if ((new Date(this.orderFormDetails.createTime).getTime() + this.orderFormDetails.expire*60*1000) - new Date().getTime() <=0 ) {
                    this.$toast({
                        message: '订单已过期,请重新下单',
                        position: 'bottom'
                    });
                    this.cancellationOfOrder()
                } else {
                    if (this.isShowWeixinPay) {
                        if (this.radio == 1) {
                            // 微信支付
                            //微信外支付
                            if (!isWeiXin()) {
                                let payParams = {
                                    orderId: this.orderId,
                                    payMode: "WECHAT_H5",
                                    iso: "",
                                    openId: "IP"
                                };
                                if (isAndroid_ios() === true) {
                                    payParams['iso'] = "Android"
                                } else if (isAndroid_ios() === false) {
                                    payParams['iso'] = " iOS"
                                } else {
                                    payParams['iso'] = "Wap"
                                };
                                this.createPaymentOrderEvent(payParams)
                            //微信内支付
                            } else {
                                //获取code,通过code在获取openId,存在openId后就不在重新获取openId了
                                if (this.openId) {
                                    let payParams = {
                                        orderId: this.orderId,
                                        payMode: "WECHAT_JSAPI",
                                        iso: "",
                                        openId: this.openId
                                    };
                                    if (isAndroid_ios() === true) {
                                        payParams['iso'] = "Android"
                                    } else if (isAndroid_ios() === false) {
                                        payParams['iso'] = " iOS"
                                    } else {
                                        payParams['iso'] = "Wap"
                                    };
                                    this.createPaymentOrderEvent(payParams)
                                } else {
                                    this.getCode()
                                }
                            }   
                        } else if (this.radio == 2) {
                            // 支付宝支付
                        }
                    } else {
                        //在苹果app内部时调取苹果支付
                        window.webkit.messageHandlers.setShareUrl.postMessage({functionName: 'ApplePay',parameter: 'YGSC001'})
                    }   
                }
            },

            //获取code(微信内支付)
            getCode () {
                let local = window.location.href;
                window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+this.appId+'&redirect_uri='+encodeURIComponent(local)+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
            },

            //获取openId(微信内支付)
            getOpenIdEvent (data) {
                getOpenId(data).then((res) => {
                    if (res && res.data.code == 0) {
                        this.changeOpenId(res.data.data);
                        let payParams = {
                            orderId: this.orderId,
                            payMode: "WECHAT_JSAPI",
                            iso: "",
                            openId: res.data.data
                        };
                        if (isAndroid_ios() === true) {
                            payParams['iso'] = "Android"
                        } else if (isAndroid_ios() === false) {
                            payParams['iso'] = " iOS"
                        } else {
                            payParams['iso'] = "Wap"
                        };
                        this.createPaymentOrderEvent(payParams)
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

            // 创建支付订单
            createPaymentOrderEvent (data) {
                this.loadingShow = true;
                this.overlayShow = true;
                createPaymentOrder(data).then((res) => {
                    this.loadingShow = false;
                    this.overlayShow = false;
                    // 微信外支付
                    if (!isWeiXin()) {
                        if (res && res.data.code == 0) {
                            this.changeIsPaying(true);
                            // 跳转到支付页面
                            window.location.href = res.data.data.prepayId + '&redirect_url=' + encodeURIComponent(window.location.href)
                        } else {
                            this.$toast({
                                message: `${res.data.msg}`,
                                position: 'bottom'
                            })
                        }
                    // 微信内支付    
                    }  else {
                        if (res && res.data.code == 0) {
                            this.changeIsPaying(true);
                            const pay_params = res.data.data.extend;
                            if (typeof WeixinJSBridge == "undefined") {
                                if ( document.addEventListener ) {
                                    document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(pay_params), false);
                                } else if (document.attachEvent) {
                                    document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(pay_params)); 
                                    document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(pay_params));
                                }
                            } else {
                                this.onBridgeReady(pay_params);
                            }
                        }   else {
                            this.$toast({
                                message: `${res.data.msg}`,
                                position: 'bottom'
                            })
                        }  
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

            //微信内支付
            onBridgeReady(params) {
                let that = this;
                const pay_params = params;
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": pay_params.appId,  //公众号名称，由商户传入     
                        "timeStamp": pay_params.timeStamp,  //时间戳，自1970年以来的秒数     
                        "nonceStr": pay_params.nonceStr,  //随机串     
                        "package": pay_params.package,     
                        "signType": pay_params.signType,  //微信签名方式：     
                        "paySign": pay_params.paySign  //微信签名 
                    },
                    function (res) {
                        if (res.err_msg == "get_brand_wcpay_request:ok" ) {
                            that.isShowPaySuccess = true;
                        } else {
                           that.$toast({
                                message: '支付失败',
                                position: 'bottom'
                            });
                            that.isShowPaySuccess = true; 
                        }
                    }
                ) 
            },
            
            // 完成支付弹框事件
            completePaymentEvent () {
                this.isShowPaySuccess = false;
                this.queryPayResult(this.orderId)
            },

            // 支付问题弹框事件
            paymentIssueEvent () {
                this.isShowPaySuccess = false;
                this.queryPayResult(this.orderId);
                // this.paymentSuccess = false;
                // this.changeIsPaying(false)
            },

            //取消订单取消事件
            cancelCancelOrderEvent () {
                this.isShowOrderCancel = false
            },

            //取消订单确定事件
            cancelOrderSureEvent () {
                this.isShowOrderCancel = false;
                this.cancellationOfOrder() 
            },

            // 倒计时结束事件
            cocuntDownEvent () {
            }
		}
	}
</script>

<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.content-box {
		.content-wrapper();
         background: @color-background;
        /deep/ .van-nav-bar {
            .van-icon {
                color: #fff !important;
                font-size: 18px !important
            };
            .van-nav-bar__title {
                color: #fff !important;
                font-size: 16px !important
            }
        };
        /deep/ .van-dialog {
            .van-dialog__header {
                padding-top: 0;
                line-height: 80px;
                .bottom-border-1px(#c2c2c2)
            };
            .van-dialog__content {
                >div {
                    line-height: 50px;
                    text-align: center;
                    &:first-child {
                        .bottom-border-1px(#c2c2c2);
                        color: #ffbd40;
                    };
                    &:last-child {
                        color: #8e8e8e
                    }
                }
            }
        };
        /deep/ .van-dialog {
            background: @color-block;
            .van-dialog__header {
                color: #fff
            };
            .van-dialog__footer {
                .van-button--default {
                background: @color-block;
                };
                .van-dialog__cancel {
                color: #cbcbcb
                };
                .van-dialog__confirm {
                color: #ffbc41;
                font-weight: bold
                }
            }
        };
		.content-center {
            flex: 1;
            overflow: auto;
            display: flex;
            flex-direction: column;
            .top {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                align-items: center;
                width: 94%;
				margin: 0 auto;
                margin-top: 10px;
				box-sizing: border-box;
				height: 26px;
                padding: 0 10px;
                color: black;
                font-size: 13px;
                background-image: linear-gradient(to right, #fbd2a5, #f1c593);
                border-radius: 6px
            };
			.center{
				width: 94%;
				margin: 0 auto;
                margin-top: 10px;
				box-sizing: border-box;
				display: flex;
				flex-flow: row nowrap;
				justify-content: flex-start;
                align-items: center;
				padding: 0;
				border-radius: 10px;
				background: @color-block;
				.img-show {
					width: 100px;
                    height: 112.5px;
                    img {
                        pointer-events: none;
                        width: 100px;
                        height: 112.5px;
                        display: block;
						border-top-left-radius: 10px;
						border-bottom-left-radius: 10px;
                    }
				};
				.span-show {
					display: flex;
					flex-direction: column;
                    height: 70px;
					justify-content: space-between;
					margin-left: 20px;
					flex: 1;
                    width: 0;
					> span {
						&:nth-child(1) {
                            .no-wrap();
							font-size: 16px;
							color: #FFFFFF
						};
                        &:nth-child(2) {
							font-size: 19px;
							color: #FFFFFF;
                            font-weight: bold;
                            text-align: right
						}
					}
				}
			};
            .bottom {
                width: 94%;
				margin: 0 auto;
                margin-top: 10px;
				display: flex;
				border-radius: 10px;
				background: @color-block;
                flex-flow: column;
                .pay-methods {
                    height: 60px;
                    width: 100%;
                    line-height: 60px;
                    color: #686868;
                    font-size: 16px;
                    .bottom-border-1px(#403a51);
                    span {
                        margin-left: 10px
                    }
                };
                .pay-methods-choose-list {
                    /deep/ .van-radio-group {
                        .van-cell-group {
                            background: transparent !important;
                            .van-cell {
                                background: transparent !important;
                                height: 55px;
                                .van-cell__value {
                                    color: #fff;
                                    display: flex;
                                    flex-flow: row nowrap;
                                    align-items: center;
                                    img {
                                        width: 22px;
                                        margin-right: 6px
                                    }
                                }
                            };
                            .van-cell:after {
                                content: none
                            }
                        };
                        .van-hairline--top-bottom:after {
                            content: none
                        }
                    }
                }
            };
            .tooltip {
                width: 100%;
                text-align: center;;
                margin-top: 20px;
                font-size: 10px;
                color: #686868
            }
		};
        .content-bottom{
            width: 100%;
            box-sizing: border-box;
            position: fixed;
            left: 0;
            bottom: 0;
            padding: 6px 10px 0 10px;
            background: #100726;
            display: flex;
            height: 65px;
            padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
            padding-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #FFFFFF;
            background: @color-block;
            .btn-left {
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                height: 35px;
                justify-content: flex-end;
                >span {
                    display: inline-block;
                    &:first-child {
                        color: #fff;
                        font-size: 20px
                    }
                }    
            };
            .btn-right {
                flex: 1;
                display: flex;
                height: 35px;
                flex-flow: row nowrap;
                align-items: center;
                padding-left: 30px;
                box-sizing: border-box;
                justify-content: flex-end;
                >span {
                    display: inline-block;
                };
                .cancel-order {
                    color: #686868;
                    padding: 0 20px;
                    box-sizing: border-box;
                    height: 35px;
                    text-align: center;
                    line-height: 35px;
                    border-radius: 20px;
                    background: #00020f
                };
                .sure-pay {
                    color: black;
                    padding: 0 20px;
                    box-sizing: border-box;
                    height: 35px;
                    text-align: center;
                    line-height: 35px;
                    border-radius: 20px;
                    background: #f0c796;
                    margin-left: 4px
                }
            } 
        }
	}
</style>




