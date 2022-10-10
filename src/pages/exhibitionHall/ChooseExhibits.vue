<template>
	<div class="content-box" id="top-content">
        <van-nav-bar :border="false"
            :placeholder="true"
            title="选择展品"
            :fixed="true"
            z-index="1000"
            :safe-area-inset-top="true"
            @click-left="onClickLeft"
        >
             <template #left>
                <span>取消</span>
            </template>
        </van-nav-bar>
        <van-loading type="spinner" v-show="loadingShow"/>
        <div class="my-object">
            <van-loading type="spinner" v-show="loadingShow"/>
            <van-empty :description="descriptionContent" v-show="emptyShow" />
            <div class="object-list-box">
                <div class="object-list" v-for="(item,index) in orderList" :key="index" @click="objectListClickEvent(index)">
                    <div class="img-show" v-lazy-container="{ selector: 'img' }" :style="{background: 'url(' + imgBorderImg+ ') no-repeat center center' }">
                        <img :data-src="item.collectionUrl">
                    </div>
                    <p class="chain">
                        <span class="blockchain-img">
                            <img :src="blockchainPng" alt="">
                        </span>
                        <span class="blockchain-chain">{{item.chain ? item.chain : ''}}</span>
                    </p>
                    <p class="author">{{item.collectionName}}</p>
                    <p class="publisher">{{item.publisher}}</p>
                    <div class="bottom-area">
                        <van-checkbox checked-color="#f0c796" @click="checkboxClickEvent" v-model="item.isChecked">
                        </van-checkbox>
                        <span v-show="item.isExihibition">展览中</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-area">
            <span :class="{'spanStyle':!isCanClick}" @click="sureEvent">确定</span>
        </div>    
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {queryObjectRecord} from '@/api/products.js'
    import FooterBottom from '@/components/FooterBottom'
	export default {
        name: 'chooseExhibits',
		components: {
            FooterBottom
		},
		data() {
			return {
                isCanClick: false,
                isShowLoadFail: false,
				emptyShow: false,
                loadingShow: false,
				descriptionContent: '暂无藏品',
                orderList: [],
                blockchainPng: require("@/common/images/home/hall-chain.png"),
                imgBorderImg: require("@/common/images/home/img-border.png"),
                notLoginPng: require("@/common/images/login/not-login.png")
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
                'userInfo',
                'isLogin',
                'hallMessage',
                'queryHallMessage'
			])
		},
		mounted() {
            this.toTop();
            // 查询藏品记录
			this.queryCollectionRecords()
		},
		methods: {
			...mapMutations([
                'changeHallMessage'
			]),
            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },
            // 查询藏品记录
			queryCollectionRecords () {
				this.isShowLoadFail = false;
				this.loadingShow = true;
                this.emptyShow = false;
                this.orderList = [];
				queryObjectRecord().then((res) => {
					this.loadingShow = false;
                    // 线上展览的产品
                    let hallExhibits = this.queryHallMessage.exhibits;
                    //本地存储的产品
                    let localExhibits = this.hallMessage.hallExhibitsList;
					if (res && res.data.code == 0) {
                        if (res.data.page.list.length == 0) {
                            this.emptyShow = true;
                        } else {
                            for (let item of res.data.page.list) {
                                let isExihibition = hallExhibits.some((innerItem) => { return innerItem.ownId ==  item.id});
                                let isLocalExhibits = localExhibits.some((innerItem) => { return innerItem.ownId ==  item.id});
                                if (localExhibits.length != 0) {
                                    if (isExihibition || isLocalExhibits) {
                                        if (isExihibition && isLocalExhibits) {
                                            this.orderList.push({
                                                collectionName: item.name,
                                                isChecked: true,
                                                isExihibition: true,
                                                collectionUrl: item.path,
                                                collectionPrice: item.price,
                                                collectionTagsList: item.tags,
                                                id: item.id,
                                                comId: item.comId,
                                                chain: item.chain,
                                                publisher: item.publisher,
                                                status: item.status
                                            });
                                            this.orderList = this.orderList.filter((i) => { return i.status == 1})
                                        } else {
                                            if (isExihibition) {                                                          
                                                this.orderList.push({
                                                    collectionName: item.name,
                                                    isChecked: false,
                                                    isExihibition: true,
                                                    collectionUrl: item.path,
                                                    collectionPrice: item.price,
                                                    collectionTagsList: item.tags,
                                                    id: item.id,
                                                    comId: item.comId,
                                                    chain: item.chain,
                                                    publisher: item.publisher,
                                                    status: item.status
                                                });
                                                this.orderList = this.orderList.filter((i) => { return i.status == 1})
                                            } else {
                                                this.orderList.push({
                                                    collectionName: item.name,
                                                    isChecked: true,
                                                    isExihibition: false,
                                                    collectionUrl: item.path,
                                                    collectionPrice: item.price,
                                                    collectionTagsList: item.tags,
                                                    id: item.id,
                                                    comId: item.comId,
                                                    chain: item.chain,
                                                    publisher: item.publisher,
                                                    status: item.status
                                                });
                                                this.orderList = this.orderList.filter((i) => { return i.status == 1})
                                            }
                                        }
                                    } else {
                                        this.orderList.push({
                                            collectionName: item.name,
                                            isChecked: false,
                                            isExihibition: false,
                                            collectionUrl: item.path,
                                            collectionPrice: item.price,
                                            collectionTagsList: item.tags,
                                            id: item.id,
                                            comId: item.comId,
                                            chain: item.chain,
                                            publisher: item.publisher,
                                            status: item.status
                                        });
                                        this.orderList = this.orderList.filter((i) => { return i.status == 1})
                                    }
                                } else {
                                    if (isExihibition) {
                                        this.orderList.push({
                                            collectionName: item.name,
                                            isChecked: true,
                                            isExihibition: true,
                                            collectionUrl: item.path,
                                            collectionPrice: item.price,
                                            collectionTagsList: item.tags,
                                            id: item.id,
                                            comId: item.comId,
                                            chain: item.chain,
                                            publisher: item.publisher,
                                            status: item.status
                                        });
                                        this.orderList = this.orderList.filter((i) => { return i.status == 1})
                                    } else {
                                        this.orderList.push({
                                            collectionName: item.name,
                                            isChecked: false,
                                            isExihibition: false,
                                            collectionUrl: item.path,
                                            collectionPrice: item.price,
                                            collectionTagsList: item.tags,
                                            id: item.id,
                                            comId: item.comId,
                                            chain: item.chain,
                                            publisher: item.publisher,
                                            status: item.status
                                        });
                                        this.orderList = this.orderList.filter((i) => { return i.status == 1})
                                    }
                                }   
                            };
                            this.isCanClick = this.orderList.some((currentItem) => {return currentItem.isChecked == true});
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

            //复选框点击事件
            checkboxClickEvent () {
            },

            //展览列表点击事件
            objectListClickEvent (index) {
                this.orderList[index]['isChecked'] = !this.orderList[index]['isChecked'];
                this.isCanClick= this.orderList.some((item) => {return item.isChecked == true});
            },

            // 确定事件
            sureEvent () {
                if (!this.isCanClick) {
                    return
                };
                //储存选中的展品
                let checkedExhibitionList = [];
                let temporaryDataList = [];
                checkedExhibitionList = this.orderList.filter((item) => {return item.isChecked == true});
                for (let item of checkedExhibitionList) {
                    temporaryDataList.push({
                        collectionName: item.collectionName,
                        isChecked: item.isChecked,
                        isExihibition: item.isExihibition,
                        collectionUrl: item.collectionUrl,
                        ownId: item.id,
                        chain: item.chain,
                        publisher: item.publisher
                    })
                };
                let temporaryData = this.hallMessage;
                temporaryData['hallExhibitsList'] = temporaryDataList;
                this.changeHallMessage(temporaryData);
                this.$router.push({path: '/editNewHall'})
            },

            onClickLeft () {
                this.$router.push({path: '/editNewHall'})
            },
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
        /deep/ .van-empty {
			width: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%)
		};
        /deep/ .van-nav-bar {
            background: @color-background;
            .van-nav-bar__title {
                color: #fff !important
            };
            .van-nav-bar__left {
                width: 60px;
                height: 30px;
                line-height: 30px;
                border-radius: 20px;
                color: #888888 !important;
                padding: 0 6px 0 0;
                text-align: left;
                font-size: 16px;
                top: 10px;
                left: 8px;
                box-sizing: border-box;
                span {
                    width: 100%;
                    height: 100%
                }
            };
            .van-nav-bar__right {
                width: 60px;
                height: 30px;
                line-height: 30px;
                border-radius: 20px;
                background: #f5f5c4;
                color: black !important;
                padding: 0 6px;
                top: 10px;
                right: 8px;
                box-sizing: border-box;
                span {
                    width: 100%;
                    height: 100%
                }
            }
        };
        .my-object {
            width: 100%;
            padding: 0 20px 60px 20px;
            box-sizing: border-box;
            display: flex;
            z-index: 100;
            flex-direction: column;
            .object-list-box {
                width: 100%;
                display: flex;
                flex-flow: row wrap;
                >div {
                    margin-right: 10%;
                    margin-bottom: 5%;
                    &:nth-child(even) {
                        margin-right: 0
                    }
                }
                .object-list {
                    width: 45%;
                    border-radius: 10px;
                    padding-bottom: 10px;
                    position: relative;
                    box-sizing: border-box;
                    .img-show {
                        position: relative;
                        width: 100%;
                        padding: 6px;
                        border-radius: 10px;
                        box-sizing: border-box;
                        > img {
                            border-radius: 6px;
                            width: 100%;
                        }
                    };
                    >p {
                        width: 100%;
                        padding: 0 6px;
                        box-sizing: border-box;
                    }
                    .author {
                        font-size: 12px;
                        color: #fff;
                        margin: 8px 0;
                        .no-wrap()
                    };
                    .chain {
                        display: flex;
                        flex-flow: row nowrap;
                        align-items: center;
                        height: 28px;
                        margin-top: 12px;
                        display: flex;
                        flex-flow: row nowrap;
                        align-items: center;
                        position: relative;
                        .blockchain-img {
                            width: 26px;
                            position: absolute;
                            top: 1px;
                            left: 0;
                            img {
                                width: 26px
                            }
                        };
                        .blockchain-chain {
                            display: inline-block;
                            padding: 0 6px 0 12px;
                            flex: 1;
                            border-radius: 10px;
                            font-size: 10px;
                            box-sizing: border-box;
                            height: 16px;
                            line-height: 16px;
                            margin-left: 8px;
                            background-image: linear-gradient(to right, #fbd2a5, #f1c593);
                            color: #9f7c0f;
                            .no-wrap()
                        }
                    }
                    .publisher {
                        font-size: 11px;
                        color: #cecbcb;
                        .no-wrap()
                    };
                    .bottom-area {
                        width: 100%;
                        height: 40px;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 12px;
                        color: #090801;
                        margin-top: 2px;
                        >span {
                            display: inline-block;
                            width: 50px;
                            height: 20px;
                            text-align: center;
                            line-height: 20px;
                            border-radius: 10px;
                            background: #f0c796

                        }
                    }
                }
            }
        };
        .btn-area {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            bottom: 0;
            padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
            padding-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
            z-index: 1000;
            height: 60px;
            width: 80%;
            margin: 0 auto;
            > span {
                display: inline-block;
                width: 100%;
                color: #383737;
                height: 50px;
                font-size: 18px;
                text-align: center;
                font-weight: bold;
                line-height: 50px;
                background: #f0c796;
                border-radius: 30px
            };
            .spanStyle {
                background: #696968;
            }
        }    
	}
</style>





