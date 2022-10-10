<template>
	<div class="content-box" id="top-content">
		<NavBar path="/myInfo" title="转赠记录"/>
		<van-loading type="spinner" v-show="loadingShow"/>
        <van-empty :description="descriptionContent" v-show="emptyShow" />
		<van-pull-refresh
			v-model="isRefresh"
			pulling-text="下拉刷新"
			:disabled="isDisabledRefresh"
			loosing-text="释放立即刷新"
			success-text="刷新成功"
			@refresh="onRefresh"
    	>  
			<div class="content-center" v-show="!emptyShow">
				<div class="all-order">
					<div class="order-list" v-for="(item,index) in orderList" :key="index">
						<div class="top">
							<div class="left">
								<div class="img-show" v-lazy-container="{ selector: 'img' }">
									<img :data-src="item.collectionUrl">
								</div>
								<div class="span-show">
									<span>{{item.collectionName}}</span>
									<p>
										<span class="blockchain-img">
											<img :src="blockchainPng" alt="">
										</span>
										<span class="blockchain-chain">{{item.chain ? item.chain : ''}}</span>
									</p>
								</div>
							</div>
							<div class="right" v-if="item.type == 0" :class="[item.status=='0'?'rightDonationIngStyle':item.status=='-1'? 'rightDonationFailStyle':'']">
								{{item.status == 0 ? '转赠中' : item.status == 1 ? '转赠成功' : '转赠失败'}}
							</div>
							<div class="right" v-else :class="[item.status=='0'?'rightDonationIngStyle':item.status=='-1'? 'rightDonationFailStyle':'']">
								{{item.status == 0 ? '转入中' : item.status == 1 ? '转入成功' : '转入失败'}}
							</div>
						</div>
						<div class="center-line"></div>
						<div class="bottom">
							<div class="donation-person">
								<div class="donation-person-left">{{item.type == 0 ? '转赠对象' : '转入对象'}}</div>
								<div class="donation-person-right">{{item.account}}</div>
							</div>
							<div class="donation-date">
								<div class="donation-date-left">{{item.type == 0 ? '转赠时间' : '转入时间'}}</div>
								<div class="donation-date-right">{{item.createTime}}</div>
							</div>
						</div>
					</div>
					<div class="no-more-data" v-show="!emptyShow && !isShowLoadFail && !loadingShow">
						<span>没有更多数据</span>
					</div>
				</div>
			</div>
		</van-pull-refresh>	
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
    import NavBar from '@/components/NavBar'
	import {transfersRecord} from '@/api/products.js'
	export default {
		name: 'DonationRecord',
		components: {
            NavBar
		},
		data() {
			return {
				isShowLoadFail: false,
				isRefresh: false,
                isDisabledRefresh: false,
				emptyShow: false,
                loadingShow: false,
				descriptionContent: '暂无转赠记录',
                orderList: [],
				currentTabIndex: 0,
				animationData: [],
				blockchainPng: require("@/common/images/home/blockchain.png"),
                defaultPersonPng: require("@/common/images/home/default-person.png")
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
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
                        path: '/myInfo'
                    })
                })
            };
			window.addEventListener('scroll', this.handleScroll);
			// 查询藏品记录
			this.queryTransfersRecord()
		},
		methods: {
			...mapMutations([
				'changeCollectionId',
				'changeIsEnterCollectionsRecordsDetailsPageSource'
			]),

			//下拉刷新事件
            onRefresh () {
                this.queryTransfersRecord();
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

			// 查询藏品记录
			queryTransfersRecord () {
				this.isShowLoadFail = false;
				this.loadingShow = true;
                this.emptyShow = false;
                this.orderList = [];
				transfersRecord().then((res) => {
					this.loadingShow = false;
					this.isRefresh = false;
					if (res && res.data.code == 0) {
                        if (res.data.list.length == 0) {
                            this.emptyShow = true;
                        } else {
                            for (let item of res.data.list) {
                                this.orderList.push({
                                    collectionName: item.name,
									collectionUrl: item.path,
									owner: item.owner,
									type: item.type,
									status: item.status,
									account: item.account,
									chain: item.chain,
									createTime: item.createTime,
                                })
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
					this.isRefresh = false;
					this.isShowLoadFail = true;
					this.loadingShow = false;
                    this.emptyShow = false;
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
		/deep/ .van-pull-refresh {
            flex: 1;
            display: flex;
            .van-pull-refresh__track {
                flex: 1;
                height: auto;
            }
        };
		/deep/ .van-empty {
			width: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%)
		};
		.content-center {
			width: 95%;
			margin: 0 auto;
			margin-top: 16px;
			padding-bottom:40px;
			box-sizing: border-box;
			position: relative;
			.all-order {
				.order-list {
					display: flex;
					flex-direction: column;
					padding: 16px;
					border-radius: 10px;
					background: @color-block;
                    margin-bottom: 10px;
                    box-sizing: border-box;
					.top {
						width: 100%;
						display: flex;
						height: 68px;
						padding-bottom: 10px;
						box-sizing: border-box;
						flex-flow: row nowrap;
						justify-content: space-between;
						.left {
							display: flex;
							height: 68px;
							flex-flow: row nowrap;
							align-items: center;
							flex: 1;
							.img-show {
								width: 60px;
								height: 68px;
								img {
									pointer-events: none;
									width: 60px;
									height: 68px;
									object-fit: contain
								}
							};
							.span-show {
								display: flex;
								flex: 1;
								height: 68px;
								width: 0;
								flex-direction: column;
								justify-content: center;
								padding: 0 10px;
								box-sizing: border-box;
								>span {
									display: inline-block;
									margin-bottom: 12px;
									.no-wrap();
									&:nth-child(1) {
										font-size: 14px;
										color: #FFFFFF;
										overflow: hidden;
										text-overflow: ellipsis;
										white-space: nowrap;
									}
								};
								p {
									width: 90%;
									display: flex;
									flex-flow: row nowrap;
									align-items: center;
									height: 28px;
									display: flex;
									flex-flow: row nowrap;
									align-items: center;
									position: relative;
									.blockchain-img {
										width: 28px;
										position: absolute;
										top: -1px;
										left: 0;
										img {
											width: 28px;
										}
									};
									.blockchain-chain {
										display: inline-block;
										padding: 0 6px 0 16px;
										flex: 1;
										border-radius: 10px;
										font-size: 10px;
										box-sizing: border-box;
										height: 18px;
										line-height: 18px;
										margin-left: 16px;
										background-image: linear-gradient(to right, #fbd2a5, #f1c593);
										color: black;
										.no-wrap()
									}
								}
							}
						};
						.right {
							height: 60px;
							width: 60px;
							display: flex;
							flex-flow: row nowrap;
							justify-content: space-between;
							justify-content: center;
							align-items: center;
							font-size: 13px;
							color: #6cb96c
						};
						.rightDonationIngStyle {
							color: #fff
						};
						.rightDonationFailStyle {
							color: #656565
						}
					};
					.center-line {
						width: 100%;
						height: 16px;
						.bottom-border-1px(#494949);
					};
					.bottom {
						width: 100%;
						padding-top: 16px;
						box-sizing: border-box;
						>div {
							display: flex;
							flex-flow: row nowrap;
							justify-content: space-between;
							align-items: center;
							font-size: 13px;
							color: #fff;
						};
						.donation-person {
							.donation-person-left {
								margin-right: 16px;
								line-height: 20px;
								height: 40px;
							};
							.donation-person-right {
								text-align: right;
								height: 40px;
								line-height: 20px;
								flex: 1;
								word-break: break-all
							}
						};
						.donation-date {
							margin-top: 20px;
							.donation-date-left {
								margin-right: 16px;
							};
							.donation-date-right {
								text-align: right;
								flex: 1
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
					color: #c0c0c0;
				}
			}	
		}
	}
</style>



