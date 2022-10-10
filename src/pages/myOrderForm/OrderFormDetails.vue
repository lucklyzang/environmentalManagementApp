<template>
	<div class="content-box" id="top-content">
		<NavBar path="/myOrderForm" title="订单详情"/>
		<van-loading type="spinner" v-show="loadingShow"/>
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
		<div class="content-top" v-if="loadingComplete">
			<van-icon name="underway" size="80" color="#e3921a" v-show="orderFormDetails.status == 0" />
            <img :src="orderFormDetails.status == 1 ? accountPaidPng : canceledPng " alt="" v-show="orderFormDetails.status != 0">
			<span>{{ payStatusTransfer(orderFormDetails.status) }}</span>
			<p>
				<van-count-down v-show="orderFormDetails.status == 0" :time="`${(new Date(orderFormDetails.createTime).getTime() + orderFormDetails.expire*60*1000) - new Date().getTime()}`" format="支付剩余时间 mm : ss "/>
			</p>
		</div>
		<div class="content-center" v-if="loadingComplete">
			<div class="top">
				<div class="img-show" >
					<img :src="orderFormDetails.imgPath">
				</div>
				<div class="span-show">
					<span>{{orderFormDetails.name}}</span>
					<p>
                        {{orderFormDetails.pubName}}
                    </p>
				</div>
			</div>
			<div class="bottom">
				<div>
					<span>订单金额</span>
					<span>{{orderFormDetails.price}}元</span>
				</div>
				<div>
					<span>交易数量</span>
					<span>1</span>
				</div>
				<div>
					<span>创建时间</span>
					<span>{{orderFormDetails.createTime}}</span>
				</div>
				<div>
					<span>订单编号</span>
					<span>{{orderFormDetails.orderNo}}</span>
				</div>
			</div>
		</div>
		<div class="content-bottom" v-show="orderFormDetails.status == 0">
			<span @click="cancelOrderEvent">取消订单</span>
			<span @click="toPaymentEvent">去付款</span>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import NavBar from '@/components/NavBar'
	import {queryOrderDetails,cancelOrder} from '@/api/products.js'
	export default {
		name: 'OrderFormDetails',
		components: {
            NavBar
		},
		data() {
			return {
				loadingShow: false,
				loadingComplete: false,
				isDisabled: false,
				timer: null,
				isShowOrderCancel: false,
				orderFormDetails: {},
				accountPaidPng: require("@/common/images/home/account-paid.png"),
				canceledPng: require("@/common/images/home/canceled.png")
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
				'orderId'
			])
		},
		mounted() {
			this.toTop();
			// 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                pushHistory();
                    this.$router.push({
                        path: '/myOrderForm'
                    })
                })
            };
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
				'changeIsRefreshHomePage'
			]),

			//让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},

			// 支付状态转换
			payStatusTransfer (index) {
				switch(index) {
					case -2 :
						return '已取消'
						break;
					case -1 :
						return '已取消'
						break;
					case 0 :
						return '待支付'
						break;
					case 1 :
						return '已支付'
						break;
					case 2 :
						return '已退款'
						break;
				}
			},

			// 查询订单详情
            inquareOrderDetails(id) {
                this.loadingShow = true;
                queryOrderDetails(id).then((res) => {
                    this.loadingShow = false;
					this.loadingComplete = true;
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
					this.loadingComplete = true;
					this.$toast({
						message: `${err.message}`,
						position: 'bottom'
					})
                })
            },

			// 取消订单事件
			cancelOrderEvent () {
				this.isShowOrderCancel = true
			},

			// 去付款事件
			toPaymentEvent () {
				this.changeOrderId(this.orderFormDetails.orderId);
				this.changeIsPaying(false);
				this.$router.push({path: '/orderFormToPaid'})
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

			// 取消订单
            cancellationOfOrder() {
				if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                this.loadingShow = true;
                cancelOrder(this.orderFormDetails.orderId).then((res) => {
					this.changeIsRefreshHomePage(true);
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                       this.$toast({
                            message: '订单取消成功',
                            position: 'bottom'
                        });
                        this.$router.push({
                            path: '/myOrderForm'
                        })
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
		.content-top {
			height: 200px;
			display: flex;
			margin-top: 30px;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			img {
				width: 100px
			};
			>span {
				&:nth-child(3) {
					font-size: 22px;
					color: #FFFFFF;
					margin: 20px 0;
				};
			};
			p {
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				/deep/ .count-down {
					color: #858585 !important
				}
			}
		};
		.content-center {
			.top {
				width: 94%;
				margin: 0 auto;
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
						.no-wrap();
						font-size: 18px;
						color: #FFFFFF
					};
                    p {
                        .no-wrap();
						font-size: 14px;
						color: #686868;
                    }
				}
			};
			.bottom {
				width: 94%;
				margin: 0 auto;
				margin-top: 30px;
                padding: 0 10px;
				border-radius: 10px;
                box-sizing: border-box;
				>div {
					display: flex;
					flex-flow: row nowrap;
					justify-content: space-between;
					font-size: 13px;
					color: #FFFFFF;
					line-height: 30px;
                    >span {
                        &:first-child {
                        }
                    }
				}
			}
		};
		.content-bottom {
			width: 94%;
			margin: 0 auto;
			margin-top: 40px;
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			>span {
				display: inline-block;
				width: 140px;
				height: 50px;
				line-height: 50px;
				text-align: center;
				font-size: 18px;
				border-radius: 30px;
				&:first-child {
					margin-right: 14px;
					background: #333;
					color: #fff;
				};
				&:last-child {
					margin-right: 10px;
					background: #333;
					color: #fff;
					background: #e3921a;
				}
			}
		}
	}
</style>




