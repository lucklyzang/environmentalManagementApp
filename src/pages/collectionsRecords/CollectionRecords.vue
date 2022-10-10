<template>
	<div class="content-box" id="top-content">
		<NavBar path="/myInfo" title="藏品记录"/>
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
					<div class="order-list" v-for="(item,index) in orderList" :key="index" @click="recordsDetailsEvent(item,index)">
						<div class="left">
							<div class="img-show" v-lazy-container="{ selector: 'img' }">
								<img :data-src="item.collectionUrl">
							</div>
							<div class="span-show">
								<span>{{item.collectionName}}</span>
								<p v-show="item.status == 1" class="cast-complete">
									<span class="blockchain-img">
										<img :src="blockchainPng" alt="">
									</span>
									<span class="blockchain-chain">{{item.chain ? item.chain : ''}}</span>
									<!-- <img :src="blockchainPng" alt="">
									<span>{{item.chain ? item.chain : ''}}</span> -->
								</p>
								<p v-show="item.status == 0" class="casting">铸造中···</p>
								<p v-show="item.status == 2" class="donationing">转赠中···</p>
								<span>{{item.publisher}}</span>
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
	import {queryObjectRecord} from '@/api/products.js'
	export default {
		name: 'CollectionRecords',
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
				descriptionContent: '暂无藏品',
                orderList: [],
				currentTabIndex: 0,
				animationData: [],
				blockchainPng: require("@/common/images/home/blockchain.png")
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
			this.queryCollectionRecords()
		},
		methods: {
			...mapMutations([
				'changeCollectionId',
				'changeMyObjects',
				'changeIsEnterCollectionsRecordsDetailsPageSource'
			]),

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

			//下拉刷新事件
            onRefresh () {
                this.queryCollectionRecords();
            },

			// 查询藏品记录
			queryCollectionRecords () {
				this.isShowLoadFail = false;
				this.loadingShow = true;
                this.emptyShow = false;
                this.orderList = [];
				queryObjectRecord().then((res) => {
					this.loadingShow = false;
					this.isRefresh = false;
					if (res && res.data.code == 0) {
                        if (res.data.page.list.length == 0) {
                            this.emptyShow = true;
                        } else {
                            for (let item of res.data.page.list) {
                                this.orderList.push({
                                    collectionName: item.name,
									collectionUrl: item.path,
									collectionPrice: item.price,
									collectionTagsList: item.tags,
									id: item.id,
        							comId: item.comId,
									chain: item.chain,
									status: item.status,
									publisher: item.publisher
                                })
                            };
							this.changeMyObjects(this.orderList);
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
			
			// 跳转藏品记录详情
			recordsDetailsEvent (item) {
				this.changeCollectionId(item);
				this.changeIsEnterCollectionsRecordsDetailsPageSource('/collectionRecords')
				this.$router.push({
					path: '/collectionRecordDetails'
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
		/deep/ .van-empty {
			width: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%)
		};
		/deep/ .van-pull-refresh {
            flex: 1;
            display: flex;
            .van-pull-refresh__track {
                flex: 1;
                height: auto;
            }
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
					height: 100px;
					display: flex;
					flex-flow: row nowrap;
					justify-content: space-between;
                    align-items: center;
					padding: 0 10px;
					border-radius: 10px;
					background: @color-block;
                    margin-bottom: 10px;
                    box-sizing: border-box;
					.left {
						display: flex;
						flex-flow: row nowrap;
                        align-items: center;
						width: 100%;
						.img-show {
							width: 80px;
							img {
								pointer-events: none;
								width: 80px;
								display: block
							}
						};
						.span-show {
							display: flex;
							flex: 1;
							width: 0;
							flex-direction: column;
							justify-content: space-between;
							margin-left: 26px;
							>span {
								display: inline-block;
								.no-wrap();
								&:nth-child(1) {
									font-size: 17px;
									color: #FFFFFF;
									overflow: hidden;
									text-overflow: ellipsis;
									white-space: nowrap;
								};
								&:nth-child(5) {
									font-size: 14px;
									color: #686866
								};
							};
                            .cast-complete {
								margin: 6px 0;
								width: 75%;
								flex-flow: row nowrap;
								align-items: center;
								height: 35px;
								display: flex;
								position: relative;
								.blockchain-img {
									width: 35px;
									position: absolute;
									top: -1px;
									left: 0;
									img {
										width: 35px;
									}
								};
								.blockchain-chain {
									display: inline-block;
									padding: 0 6px 0 16px;
									flex: 1;
									border-radius: 10px;
									font-size: 10px;
									box-sizing: border-box;
									height: 22px;
									line-height: 22px;
									margin-left: 20px;
									background-image: linear-gradient(to right, #fbd2a5, #f1c593);
									color: black;
									.no-wrap()
								}
                            };
							.casting {
								margin: 6px 0;
								display: flex;
								flex-flow: row nowrap;
								align-items: center;
								height: 35px;
								font-size: 15px;
								color: #fbd2a5
							};
							.donationing {
								margin: 6px 0;
								display: flex;
								flex-flow: row nowrap;
								align-items: center;
								height: 35px;
								font-size: 15px;
								color: #bfbfbf
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
	}
</style>



