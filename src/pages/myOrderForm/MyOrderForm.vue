<template>
	<div class="content-box" id="top-content">
		<van-empty :description="descriptionContent" v-show="emptyShow" />
		<NavBar path="/myInfo" title="我的订单" ref="navBar"/>
		<div class="content-order">
			<van-loading type="spinner" v-show="loadingShow"/>
			<van-tabs v-model="activeName" background="#1e1e1b"
				line-width="14px"
				sticky
				:offset-top="navBarHeight"
				swipeable
				color="#f5cc9b"
				title-inactive-color="#686868"
				title-active-color="#fff" 
				@click="tabClickEvent"
				@change="tabChangeEvent"
			>
				<van-tab title="全部" name="0">
					<div class="all-order">
						<div class="order-list" @click="orderDetailsEvent(item)" v-for="(item,index) in orderList" :key="index">
							<div class="left">
								<div class="img-show" v-lazy-container="{ selector: 'img' }">
									<img :data-src="item.collectionUrl">
								</div>
								<div class="span-show">
									<span>{{item.collectionName}}</span>
									<p>
									{{item.pubName}}
									</p>
									<span>¥ {{item.collectionPrice}}</span>
								</div>
							</div>
							<div class="right">
								<div>
									<van-icon name="underway" size="14" color="#e3921a" v-show="item.collectionStatus == '0'" />
									<span :class="[item.collectionStatus == '1' ? 'spanPaiedStyle' : item.collectionStatus =='-1' || item.collectionStatus == '2' ? 'spanCancelStyle' : '']">{{payStatusTransfer(item.collectionStatus)}}</span>
								</div>
								<div v-show="item.collectionStatus == '0'" @click.stop="toPayEvent(item)">
									<span>
										去付款
									</span>
								</div>
								<div v-show="item.collectionStatus != 0 ">
									<span>
										{{item.type == 3 ? '尾款订单' : item.type == 2 ? '预购订单' : ''}}
									</span>
								</div>
							</div>
						</div>
					</div>
				</van-tab>
				<van-tab title="待付款" name="1">
					<div class="all-order to-pay">
						<div class="order-list" @click="orderDetailsEvent(item)" v-for="(item,index) in orderList" :key="index">
							<div class="left">
								<div class="img-show" v-lazy-container="{ selector: 'img' }">
									<img :data-src="item.collectionUrl">
								</div>
								<div class="span-show">
									<span>{{item.collectionName}}</span>
									<p>
									{{item.pubName}}
									</p>
									<span>¥ {{item.collectionPrice}}</span>
								</div>
							</div>
							<div class="right">
								<div>
									<van-icon name="underway" size="14" color="#e3921a" v-show="item.collectionStatus == '0'" />
									<span :class="[item.collectionStatus == '1' ? 'spanPaiedStyle' : item.collectionStatus == '-1' || item.collectionStatus == '2' ? 'spanCancelStyle' : '']">{{payStatusTransfer(item.collectionStatus)}}</span>
								</div>
								<div v-show="item.collectionStatus == '0'"  @click.stop="toPayEvent(item)">
									<span>
										去付款
									</span>
								</div>
								<div v-show="item.collectionStatus != 0 ">
									<span>
										{{item.type == 3 ? '尾款订单' : item.type == 2 ? '预购订单' : ''}}
									</span>
								</div>
							</div>
						</div>
					</div>
				</van-tab>
				<van-tab title="已付款" name="2">
					<div class="all-order to-pay">
						<div class="order-list" @click="orderDetailsEvent(item)" v-for="(item,index) in orderList" :key="index">
							<div class="left">
								<div class="img-show" v-lazy-container="{ selector: 'img' }">
									<img :data-src="item.collectionUrl">
								</div>
								<div class="span-show">
									<span>{{item.collectionName}}</span>
									<p>
									{{item.pubName}}
									</p>
									<span>¥ {{item.collectionPrice}}</span>
								</div>
							</div>
							<div class="right">
								<div>
									<van-icon name="underway" size="14" color="#e3921a" v-show="item.collectionStatus == '0'" />
								<span :class="[item.collectionStatus == '1' ? 'spanPaiedStyle' : item.collectionStatus == '-1' || item.collectionStatus == '2' ? 'spanCancelStyle' : '']">{{payStatusTransfer(item.collectionStatus)}}</span>
								</div>
								<div v-show="item.collectionStatus == '0'">
									<span>
										去付款
									</span>
								</div>
								<div v-show="item.collectionStatus != 0 ">
									<span>
										{{item.type == 3 ? '尾款订单' : item.type == 2 ? '预购订单' : ''}}
									</span>
								</div>
							</div>
						</div>
					</div>
				</van-tab>
				<van-tab title="已取消" name="3">
					<div class="all-order to-pay">
						<div class="order-list" @click="orderDetailsEvent(item)" v-for="(item,index) in orderList" :key="index">
							<div class="left">
								<div class="img-show" v-lazy-container="{ selector: 'img' }">
									<img :data-src="item.collectionUrl">
								</div>
								<div class="span-show">
									<span>{{item.collectionName}}</span>
									<p>
									{{item.pubName}}
									</p>
									<span>¥ {{item.collectionPrice}}</span>
								</div>
							</div>
							<div class="right">
								<div>
									<van-icon name="underway" size="14" color="#e3921a" v-show="item.collectionStatus == '0'" />
									<span :class="[item.collectionStatus == '1' ? 'spanPaiedStyle' : item.collectionStatus == '-1' || item.collectionStatus == '2' ? 'spanCancelStyle' : '']">{{payStatusTransfer(item.collectionStatus)}}</span>
								</div>
								<div v-show="item.collectionStatus == '0'">
									<span>
										去付款
									</span>
								</div>
								<div v-show="item.collectionStatus != 0 ">
									<span>
										{{item.type == 3 ? '尾款订单' : item.type == 2 ? '预购订单' : ''}}
									</span>
								</div>
							</div>
						</div>
					</div>			
				</van-tab>
			</van-tabs>
			<div class="no-more-data" v-show="!emptyShow && !isShowLoadFail && !loadingShow">
				<span>没有更多数据</span>
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
	import {queryOrderList} from '@/api/products.js'
	export default {
		name: 'MyOrderForm',
		components: {
            NavBar
		},
		data() {
			return {
				activeName: '0',
				navBarHeight: '',
				isShowLoadFail: false,
				emptyShow: false,
                loadingShow: false,
				descriptionContent: '暂无订单',
                orderList: [],
				animationData: [],
                defaultPersonPng :require("@/common/images/home/default-person.png"),
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
			])
		},
		mounted() {
			this.toTop();
			// 获取导航栏高度
			this.$nextTick(() => {
				this.navBarHeight = (this.$refs.navBar.$el.clientHeight - 1) + 'px'
			});
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
			this.queryProductsList(0)
		},
		methods: {
			...mapMutations([
				'changeOrderId',
				'changeIsPaying',
				'changeProductsId'
			]),
			

			//让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},
			
			// 支付状态转换
			payStatusTransfer (index) {
				switch(index) {
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

			// tab切换点击事件
			tabClickEvent (name,title) {
				// this.queryProductsList(Number(name))
			},

			// tab激活的标签改变时触发
			tabChangeEvent (name,title) {
				this.queryProductsList(Number(name))
			},

			// 查询订单列表
            queryProductsList (index) {
				this.isShowLoadFail = false;
                this.loadingShow = true;
                this.emptyShow = false;
                this.orderList = [];
                queryOrderList().then((res) => {
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                        if (res.data.list.length == 0) {
                            this.emptyShow = true;
                        } else {
							this.emptyShow = false;
                            for (let item of res.data.list) {
                                this.orderList.push({
                                    collectionName: item.name,
									collectionUrl: item.imgPath,
									pubName: item.pubName,
									collectionPrice: item.price,
									orderId: item.orderId,
      								orderNo: item.orderNo,
									collectionStatus: item.status,
									extend: item.extend,
									item: item.createTime,
									comId: item.comId,
									type: item.type
                                })
                            };
							if (index != 0) {
								if (index == 1) {
									this.orderList = this.orderList.filter((item) => {return item.collectionStatus == 0});
									if (this.orderList.length == 0) {
										this.emptyShow = true
									} else {
										this.emptyShow = false
									}
								} else if (index == 2) {
									this.orderList = this.orderList.filter((item) => {return item.collectionStatus == 1});
									if (this.orderList.length == 0) {
										this.emptyShow = true
									} else {
										this.emptyShow = false
									}
								} else if (index == 3) {
									this.orderList = this.orderList.filter((item) => {return item.collectionStatus == -1});
									if (this.orderList.length == 0) {
										this.emptyShow = true
									} else {
										this.emptyShow = false
									}
								}
							}
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
					this.isShowLoadFail = true;
                    this.loadingShow = false;
                    this.emptyShow = false;
					this.$toast({
						message: `${err.message}`,
						position: 'bottom'
					})
                })
            },

			// 去往支付页面
			toPayEvent (item) {
				this.changeOrderId(item.orderId);
				if (item.collectionStatus === 0 ) {
					this.$router.push({name: 'orderFormToPaid',params: {id:item.orderId}})
				}
			},

			// 跳转订单详情页面
			orderDetailsEvent (item) {
				this.changeOrderId(item.orderId);
				let temporaryMessage = {};
                temporaryMessage['id'] = item.comId;
                this.changeProductsId(temporaryMessage);
				this.$router.push({name: 'orderFormDetails',params: {id:item.orderId}})
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
		/deep/ .van-empty {
			width: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%)
		};
		.tabBar-box {
			margin-top: -1px
		};
		.content-order {
			width: 95%;
			margin: 0 auto;
			padding-bottom:40px;
			box-sizing: border-box;
			position: relative;
			/deep/ .van-tabs {
				.van-sticky--fixed {
					width: 95%;
					left: 2.5%;
					z-index: 2000
				};
				.van-tab {
					font-size: 15px;
				};
				.van-tabs__content {
					min-height: 80vh
				};
				.all-order {
					margin-top: 14px;
					.order-list {
						display: flex;
						flex-flow: row nowrap;
						justify-content: space-between;
						align-items: center;
						border-radius: 10px;
						background: @color-block;
						margin-bottom: 10px;
						.left {
							display: flex;
							flex-flow: row nowrap;
							align-items: center;
							flex: 1;
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
								height: 70px;
								flex-direction: column;
								justify-content: space-between;
								margin-left: 14px;
								flex: 1;
								width: 0;
								>span {
									&:nth-child(1) {
										.no-wrap();
										font-size: 18px;
										color: #FFFFFF
									};
									&:nth-child(3) {
										font-size: 16px;
										color: #FFFFFF
									};
								};
								p {
									.no-wrap();
									font-size: 14px;
									color: #8c8c8c;
								}
							}
						};
						.right {
							display: flex;
							height: 77px;
							width: 70px;
							flex-direction: column;
							justify-content: space-between;
							align-items: center;
							>div {
								&:nth-child(1) {
									display: flex;
									flex-flow: row nowrap;
									align-items: center;
									span {
										display: inline-block;
										margin-left: 2px;
										font-size: 15px;
										color: #fff;
										width: 50px;
										height: 20px;
										text-align: center;
										line-height: 20px;
										color: #edc695;
									};
									.spanPaiedStyle {
										color: #fff
									};
									.spanCancelStyle {
										color: #656565
									}
								};
								&:nth-child(2) {
									width: 70px;
									height: 30px;
									color: black;
									text-align: center;
									line-height: 30px;
									font-size: 14px;
									border-radius: 18px;
									background-image: linear-gradient(to right, #fcbe43 ,#f7c241);
								};
								&:nth-child(3) {
									font-size: 15px;
									color: #656565
								}
							}
						}
					}
				}
			};
			.no-more-data {
				position: absolute;
				bottom: 0;
				left: 0;
				height: 40px;
				width: 100%;
				text-align: center;
				line-height: 40px;
				font-size: 14px;
				color: #c0c0c0
			}		
		}
	}
</style>


