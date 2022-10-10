<template>
	<div class="content-box" id="top-content">
         <van-nav-bar left-arrow :border="false"
            :placeholder="true"
            :fixed="true"
            z-index="1000"
            :safe-area-inset-top="true"
            @click-left="onClickLeft"
        >
            <template #title>
                <img :src="userInfo.avatarUrl ? userInfo.avatarUrl : defaultPerson" alt="">
                <span>{{userInfo.nickName}}</span>
            </template>
        </van-nav-bar>
        <van-loading type="spinner" vertical v-show="loadingShow" color="#fff">
            展馆加载中，请稍等
        </van-loading>
        <img :src="myHallDetails.path" alt="" ref="backgroundImg">
		<div class="content" ref="content">
            <div class="content-center"
                ref="contentCenter"
            >
                <div class="content-left" ref="contentLeft">
                    <div class="title">
                        {{myHallDetails.name}}
                    </div>
                    <div class="introduce">
                        {{myHallDetails.signTxt}}
                    </div>
                </div>
                <div class="content-right">
                   <div class="exhibition-list" v-for="(item,index) in myHallDetails.exhibits" :key="index" :ref="'exhibitionList'+ index" @click.stop="recordsDetailsEvent(item)">
                       <div class="exhibits-top" v-lazy-container="{ selector: 'img' }" :style="{background: 'url(' + imgBorderImg+ ') no-repeat center center' }">
                           <img :data-src="item.path" alt="">
                       </div>
                       <div class="exhibits-line">
                           <img :src="hallBothPng" alt="">
                       </div>
                       <div class="exhibits-bottom">
                            <p class="chain">
                                <span class="blockchain-img">
                                    <img :src="blockchainPng" alt="">
                                </span>
                                <span class="blockchain-chain">{{item.chain ? item.chain : ''}}</span>
                            </p>
                           <p class="author">{{item.commName}}</p>
                            <p class="publisher">{{item.pubName}}</p>
                       </div>
                   </div>
                </div>
            </div>
		</div>
	</div>
</template>

<script>
	import NavBar from '@/components/NavBar'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {queryHallMessage} from '@/api/products.js'
	export default {
        name: 'MyObjectDetails',
		components: {
			NavBar
		},
		data() {
			return {
                path: '',
                orderList: [],
                moveInfo: {
                    lastMoveTime: '',
                    startX: 0,
                    x: 0,
                    imgX: 0
                },
                myHallDetails: '',
                isRotate: true,
                myObjectMaxMoveDistance: '',
                backgroundImgMaxMoveDistance: '',
                myObjectOffsetLeft: '',
                isRenderComplete: false,
                isSlideArea: false,
                backgroundImgLeft: '',
                loadingShow: false,
                defaultPerson: require("@/common/images/home/default-person.png"),
                hallBothPng: require("@/common/images/home/hall-both.png"),
                blockchainPng: require("@/common/images/hall/hall-chain.png"),
                imgBorderImg: require("@/common/images/home/img-border.png")
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
                'isLogin',
                'userInfo',
                'hallMessage',
                'isEnterMyObjectDetailsPageSource',
                'isEnterCollectionsRecordsDetailsPage'
			])
		},
		mounted() {
            this.toTop();
            this.myObjectOffsetLeft = this.$refs.contentCenter.offsetLeft;
            this.backgroundImgLeft = this.$refs.backgroundImg.offsetLeft;
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                pushHistory();
                    this.$router.push({
                        path: this.path
                    })
                })
            };
            // 查询展馆信息
			this.queryHallMessageEvent();
            this.registerSlideEvent()
		},

       beforeRouteEnter(to, from, next) {
            next(vm => {
                if (vm.isEnterCollectionsRecordsDetailsPage) {
                    vm.path = vm.isEnterMyObjectDetailsPageSource
                } else {
                    vm.path = from.path
                }
            })
        },

        beforeRouteLeave(to, from, next) {
            if (to.path !== '/collectionsRecordsDetails') {
                this.changeIsEnterCollectionsRecordsDetailsPage(false);
            };
            if (this.isEnterCollectionsRecordsDetailsPage) {
                this.path = this.isEnterMyObjectDetailsPageSource
            } else {
                this.path = from.path
            };
            next()
        },

        beforeDestroy() {
            window.removeEventListener('touchstart',this.touchstartHandle,false);
            window.removeEventListener('touchmove',this.touchmoveHandle,false)
        },


        updated() {
            if (this.isRenderComplete) {
                this.calculateContentWidth(this.myHallDetails.exhibits.length)
            }
        },
		methods: {
			...mapMutations([
                'changeQueryHallMessage',
                'changeCollectionId',
                'changeIsEnterCollectionsRecordsDetailsPage',
                'changeIsEnterCollectionsRecordsDetailsPageSource'
			]),

            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },

            // 跳转藏品记录详情
			recordsDetailsEvent (item) {
                console.log('点击开始');
                let temporary = {};
                temporary['chain'] = item['chain'];
                temporary['collectionName'] = item['commName'];
                temporary['collectionUrl'] = item['path'];
                temporary['comId'] = item['commId'];
                temporary['id'] = item['ownId'];
                temporary['publisher'] = item['pubName'];
				this.changeCollectionId(temporary);
				this.$router.push({
					path: '/collectionRecordDetails'
				});
                this.changeIsEnterCollectionsRecordsDetailsPage(true);
                this.changeIsEnterCollectionsRecordsDetailsPageSource('/myObjectDetails')
			},

            // 查询展馆信息
            queryHallMessageEvent () {
                this.loadingShow = true;
                queryHallMessage().then((res) => {
                    this.loadingShow = false;
					if (res && res.data.code == 0) {
                        this.changeQueryHallMessage(res.data.data);
                        this.myHallDetails = res.data.data;
                        this.isRenderComplete = true
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

            onClickLeft () {
                this.$router.push({path: this.path})
            },

            // 注册滑动事件  
            registerSlideEvent () {
                this.$refs.contentCenter.addEventListener('touchstart',this.touchstartHandle,false);
                this.$refs.contentCenter.addEventListener('touchmove',this.touchmoveHandle,false)
            },

            // 计算展品总长度
            calculateContentWidth (length) {
                if (length == 0) {return};
                let rightWidth = 0;
                if (length == 1 || length == 2) {
                    rightWidth = this.$refs['exhibitionList0'][0].offsetWidth + 40
                } else {
                    let num = 0;
                    num = Math.ceil(length/2);
                    rightWidth = (this.$refs['exhibitionList0'][0].offsetWidth + 40)*num
                };
                this.$refs.contentCenter.style.width =  this.$refs.contentLeft.offsetWidth + rightWidth + (this.$refs['exhibitionList0'][0].offsetWidth/2) + 'px';
                this.myObjectMaxMoveDistance =  Math.abs(this.$refs.contentCenter.offsetWidth - this.$refs.content.offsetWidth);
                this.backgroundImgMaxMoveDistance = Math.abs(this.$refs.backgroundImg.offsetWidth - this.$refs.content.offsetWidth);
            },

            // 滑动开始
            touchstartHandle() {
                //判断是否在滑动区域内滑动
                let e = e || window.event;
                if (e.targetTouches.length == 1) {
                    this.isSlideArea = true;
                    this.moveInfo.startX = parseInt(e.targetTouches[0].clientX);
                    this.moveInfo.lastMoveTime = new Date().getTime();
                    this.moveInfo.x = this.$refs.contentCenter.offsetLeft;
                    this.moveInfo.imgX = this.$refs.backgroundImg.offsetLeft
                }    
            },
            
            // 滑动中
            touchmoveHandle() {
                let e = e || window.event;
                if (e.targetTouches.length == 1) {
                    if (this.isSlideArea) {
                        // 滑动距离
                        let moveX = parseInt((e.targetTouches[0].clientX - this.moveInfo.startX)*1.5);
                        //左滑
                        if (moveX < 0) {
                            // 展品转动
                            if (this.$refs.contentCenter.offsetLeft <= -this.myObjectMaxMoveDistance) {
                                this.isRotate = false;
                                this.$refs.contentCenter.style.left = -this.myObjectMaxMoveDistance + 'px';
                                this.moveInfo.x = this.$refs.contentCenter.offsetLeft;
                                this.moveInfo.startX = parseInt(e.targetTouches[0].clientX)
                            } else {
                                this.isRotate = true;
                                this.$refs.contentCenter.style.left = this.moveInfo.x - Math.abs(moveX) + 'px'
                            };
                            //背景图转动
                            if (this.$refs.backgroundImg.offsetLeft <= -this.backgroundImgMaxMoveDistance) {
                                this.$refs.backgroundImg.style.left = -this.backgroundImgMaxMoveDistance + 'px'
                                this.moveInfo.x = this.$refs.contentCenter.offsetLeft
                            };
                            if (this.isRotate) {
                                if (this.$refs.backgroundImg.offsetLeft <= -this.backgroundImgMaxMoveDistance) {
                                    this.$refs.backgroundImg.style.left = -this.backgroundImgMaxMoveDistance + 'px'
                                    this.moveInfo.x = this.$refs.contentCenter.offsetLeft
                                } else {
                                    this.$refs.backgroundImg.style.left = parseInt((this.moveInfo.x - Math.abs(moveX))/2) + 'px'
                                }
                            } else {
                                this.moveInfo.x = this.$refs.contentCenter.offsetLeft;
                                this.moveInfo.startX = parseInt(e.targetTouches[0].clientX);
                            }
                        } else {
                            //展品转动
                            if (this.$refs.contentCenter.offsetLeft >= 0) {
                                this.isRotate = false;
                                this.$refs.contentCenter.style.left = 0;
                                this.moveInfo.x = this.$refs.contentCenter.offsetLeft;
                                this.moveInfo.startX = parseInt(e.targetTouches[0].clientX)
                            } else {
                                this.isRotate = true;
                                this.$refs.contentCenter.style.left = this.moveInfo.x + moveX + 'px'
                            };
                            //背景图转动
                            if (this.$refs.backgroundImg.offsetLeft >= 0) {
                                this.$refs.backgroundImg.style.left = 0;
                                this.moveInfo.x = this.$refs.contentCenter.offsetLeft;
                            };
                            if (this.isRotate) {
                                if (this.$refs.backgroundImg.offsetLeft >=0) {
                                    this.$refs.backgroundImg.style.left = 0;
                                    this.moveInfo.x = this.$refs.contentCenter.offsetLeft;
                                } else {
                                    this.$refs.backgroundImg.style.left = parseInt((this.moveInfo.x + moveX)/2) + 'px'
                                }
                            } else {
                                this.moveInfo.x = this.$refs.contentCenter.offsetLeft;
                                this.moveInfo.startX = parseInt(e.targetTouches[0].clientX);
                            }
                        };
                        e.preventDefault()
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
    .content-box::-webkit-scrollbar {
        display: none; /* Chrome Safari */
    };
	.content-box {
		.content-wrapper();
        background: @color-background;
        /deep/ .van-nav-bar {
            background: transparent;
            .van-nav-bar__title {
                color: #fff !important;
                >span {
                    vertical-align: top;
                };
                >img {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%
                }
            };
            .van-icon-arrow-left {
                color: #fff !important;
                font-size: 18px;
                span {
                    width: 100%;
                    height: 100%
                }
            };
            .van-nav-bar__right {
            }
        };
        > img {
            position: absolute;
            top: 0;
            left: 0;
            height: 100vh
        };
		.content{
            flex: 1;
            width: 100%;
            position: relative;
            .content-center {
                position: absolute;
                display: flex;
                flex-flow: row nowrap;
                top: 12vh;
                left: 0;
                height: 72vh;
                .content-left {
                    width: 220px;
                    display: flex;
                    height: 72vh;
                    padding-left: 40px;
                    box-sizing: border-box;
                    flex-direction: column;
                    margin-right: 20px;
                    .title {
                        color: #fff;
                        font-size: 24px;
                        height: 100px;
                        line-height: 25px;
                        word-break: break-all;
                        overflow: auto;
                    };
                    .introduce {
                        color: #e8e8e8;
                        line-height: 20px;
                        font-size: 14px;
                        word-break: break-all;
                        flex: 1;
                        margin-top: 10px;
                        overflow: auto
                    }
                };
                .content-right {
                    color: #fff;
                    font-size: 22px;
                    height: 72vh;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;
                    .exhibition-list {
                        width: 120px;
                        box-sizing: border-box;
                        height: 31vh;
                        margin-right: 40px;
                        .exhibits-top {
                            position: relative;
                            width: 90px;
                            padding: 5px;
                            height: 100px;
                            margin: 0 auto;
                            box-sizing: border-box;
                            border-radius: 10px;
                            > img {
                                border-radius: 6px;
                                width: 100%;
                                height: 100%
                            }
                        };
                        .exhibits-line {
                            width: 120px;
                            height: 25px;
                            margin-top: 8px;
                            img {
                                width: 120px
                            }
                        };
                        .exhibits-bottom {
                            margin-top: -4px;
                            >p {
                                width: 100%;
                            }
                            .author {
                                font-size: 12px;
                                color: #fff;
                                margin: 2px 0 4px 0;
                                .no-wrap()
                            };
                            .chain {
                                display: flex;
                                flex-flow: row nowrap;
                                align-items: center;
                                height: 24px;
                                display: flex;
                                flex-flow: row nowrap;
                                align-items: center;
                                position: relative;
                                .blockchain-img {
                                    width: 22px;
                                    position: absolute;
                                    top: 1px;
                                    left: 0;
                                    img {
                                        width: 22px
                                    }
                                };
                                .blockchain-chain {
                                    display: inline-block;
                                    padding: 0 6px 0 12px;
                                    flex: 1;
                                    border-radius: 10px;
                                    font-size: 10px;
                                    box-sizing: border-box;
                                    height: 12px;
                                    line-height: 12px;
                                    margin-left: 14px;
                                    background-image: linear-gradient(to right, #fbd2a5, #f1c593);
                                    color: #9f7c0f;
                                    .no-wrap()
                                }
                            }
                            .publisher {
                                height: 20px;
                                line-height: 20px;
                                font-size: 10px;
                                color: #ececec;
                                .no-wrap()
                            }
                        }
                    }
                }
            }
		}
	}
</style>





