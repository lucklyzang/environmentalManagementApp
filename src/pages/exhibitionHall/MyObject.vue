<template>
	<div class="content-box" id="top-content">
        <van-loading type="spinner" v-show="loadingShow"/>
        <div class="is-login" v-if="isLogin">
            <div class="my-hall">
                <img :src="myHallBackgroundPng" alt="">
                <div class="my-hall-content" v-show="!loadingShow">
                    <div class="hall-tit">
                        <span>我的展馆</span>
                        <span>NO.{{objectMessage.number}}</span>
                    </div>
                    <div class="hall-wraper" v-show="!isShowLoadFail">
                        <div class="create-hall" @click="createHallEvent" v-show="objectMessage && objectMessage.type == -1">
                            <span>创建展览</span>
                            <p>
                                <van-icon name="arrow" size="10" color="#f2c898"/>
                            </p>
                        </div>
                        <div class="create-hall enter-hall" @click="enterHallEvent" v-show="objectMessage && objectMessage.type !== -1">
                            <span>进入展览</span>
                            <p>
                                <van-icon name="arrow" size="10" color="#f2c898"/>
                            </p>
                        </div>
                        <div class="create-hall edit-hall" @click="createHallEvent" v-show="objectMessage && objectMessage.type !== -1">
                            <span>编辑展览</span>
                            <p>
                                <van-icon name="arrow" size="10" color="#252525"/>
                            </p>
                        </div>
                    </div>    
                </div>
            </div>
            <div class="my-object" ref="myObject"
            >
                <van-loading type="spinner" v-show="loadingShow"/>
                <div class="object-tit">我的藏品</div>
                <van-empty :description="descriptionContent" v-show="emptyShow" />
                <div class="object-list-box">
                    <div class="object-list" v-for="(item,index) in orderList" :key="index" @click="recordsDetailsEvent(item)">
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
                    </div>
                </div>
            </div>
        </div>
        <div class="no-login" v-else>
            <img :src="myHallBackgroundPng" alt="">
            <div class="my-hall">
                <div class="my-hall-content">
                    <div class="hall-tit">
                        <span>我的展馆</span>
                        <span>登录后可查看你的私人展馆</span>
                    </div>
                </div>
            </div>
            <div class="my-object">
                <img :src="defaultPersonPng">
                <div class="line-one">登 录 有 光</div>
                <div class="line-two">发 现 有 趣</div>
                <div class="login-btn" @click="loginEvent">
                    立即登录
                </div>
            </div>
        </div>
        <FooterBottom></FooterBottom>   
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {queryObjectRecord,queryHallMessage} from '@/api/products.js'
    import FooterBottom from '@/components/FooterBottom'
    import {
        IsPC
    } from '@/common/js/utils'
	export default {
        name: 'MyObject',
		components: {
            FooterBottom
		},
		data() {
			return {
                isShowLoadFail: false,
                isSlideArea: false,
                myObjectOffsetTop: '',
				emptyShow: false,
                moveInfo: {
                    startY: 0,
                    y: 0
                },
                loadingShow: false,
				descriptionContent: '暂无藏品',
                orderList: [],
                objectMessage: {},
                myHallBackgroundPng: require("@/common/images/hall/my-hall-background.jpg"),
                defaultPersonPng: require("@/common/images/home/default-person.png"),
                hallBothPng: require("@/common/images/home/hall-both.png"),
                blockchainPng: require("@/common/images/hall/hall-chain.png"),
                imgBorderImg: require("@/common/images/home/img-border.png")
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
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                    pushHistory();
					this.$router.push({
						path: '/myObject'
					})
                })
            };
            if (this.isLogin) {
                // 查询藏品记录
                this.queryCollectionRecords();
                // 查询展馆信息
                this.queryHallMessageEvent();
                this.registerSlideEvent()
            }
		},
        beforeDestroy() {
            window.removeEventListener('touchstart',this.touchstartHandle,false);
            window.removeEventListener('touchmove',this.touchmoveHandle,false)
        },
		methods: {
			...mapMutations([
                'changeQueryHallMessage',
                'changeIsEnterLoginPageSource',
                'changeHallMessage',
                'changeMyObjects',
                'changeCollectionId',
                'changeIsEnterMyObjectDetailsPageSource',
                'changeIsEnterCollectionsRecordsDetailsPageSource'
			]),

            // 登录事件
            loginEvent () {
                this.changeIsEnterLoginPageSource('/myObject');
                this.$router.push({
                    path: '/login'
                })
            },
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
									publisher: item.publisher,
                                    status: item.status
                                })
                            };
                            this.orderList = this.orderList.filter((i) => { return i.status == 1});
                            //藏品存储在本地
                            this.changeMyObjects(this.orderList);
                            if (this.isLogin) {
                                this.myObjectOffsetTop = this.$refs.myObject.offsetTop
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

            // 查询展馆信息
            queryHallMessageEvent () {
                queryHallMessage().then((res) => {
					if (res && res.data.code == 0) {
                        this.objectMessage = res.data.data;
                        this.changeQueryHallMessage(res.data.data);
                        let temporaryHallMessage = this.hallMessage;
                        if (temporaryHallMessage['hallExhibitsList'].length == 0) {
                            let arr = [];
                            for (let item of this.queryHallMessage['exhibits']) {
                                arr.push({
                                    collectionName: item.commName,
                                    isChecked: true,
                                    isExihibition: true,
                                    collectionUrl: item.path,
                                    ownId: item.ownId,
                                    chain: item.chain,
                                    publisher: item.pubName
                                })
                            };
                            temporaryHallMessage['hallExhibitsList'] = arr
                        };
                        if (!temporaryHallMessage['hallIntroduce']) {
                            temporaryHallMessage['hallIntroduce'] = this.queryHallMessage['signTxt']
                        };
                        if (!temporaryHallMessage['hallTheme']) {
                            temporaryHallMessage['hallTheme'] = this.queryHallMessage['name']
                        };
                        if (!temporaryHallMessage['hallTemplate']) {
                            temporaryHallMessage['hallTemplate'] = this.queryHallMessage['template']
                        };
                        if (!temporaryHallMessage['hallTemplatePath']) {
                            temporaryHallMessage['hallTemplatePath'] = this.queryHallMessage['path']
                        };
                        this.changeHallMessage(temporaryHallMessage)
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

            // 创建展馆事件
            createHallEvent () {
                this.$router.push({path: '/createHall'})
            },
            // 进入我的展馆
            enterHallEvent () {
                this.$router.push({path: '/myObjectDetails'});
                this.changeIsEnterMyObjectDetailsPageSource('/myObject')
            },

            // 跳转藏品记录详情
			recordsDetailsEvent (item) {
				this.changeCollectionId(item);
				this.$router.push({
					path: '/collectionRecordDetails'
				});
                this.changeIsEnterCollectionsRecordsDetailsPageSource('/myObject')
			},

            // 注册滑动事件  
            registerSlideEvent () {
                this.$refs.myObject.addEventListener('touchstart',this.touchstartHandle,false);
                this.$refs.myObject.addEventListener('touchmove',this.touchmoveHandle,false)
            },

            // 滑动开始
            touchstartHandle() {
                if (this.orderList.length == 0) { return };
                //判断是否在区域内滑动
                let e = e || window.event;
                if (e.targetTouches.length == 1) {
                    this.isSlideArea = true;
                    this.moveInfo.startY = parseInt(e.targetTouches[0].clientY);
                    this.moveInfo.y = this.$refs.myObject.offsetTop
                }    
            },
            
            // 滑动中
            touchmoveHandle() {
                let e = e || window.event;
                if (e.targetTouches.length == 1) {
                    if (this.isSlideArea) {
                        let moveY = e.targetTouches[0].clientY - this.moveInfo.startY;
                        //上滑
                        if (moveY < 0) {
                            if (this.$refs.myObject.offsetTop <= 0) {
                                this.$refs.myObject.style.top = 0 + 'px'
                                this.moveInfo.y = this.$refs.myObject.offsetTop;
                                this.moveInfo.startY = parseInt(e.targetTouches[0].clientY);
                                return
                            }
                            if (this.$refs.myObject.offsetTop > 0) {
                                this.$refs.myObject.style.top = parseInt((this.moveInfo.y - Math.abs(moveY*1.5))) + 'px'
                            }
                        } else {
                            if (this.$refs.myObject.offsetTop >= this.myObjectOffsetTop) {
                                this.$refs.myObject.style.top = this.myObjectOffsetTop + 'px';
                                this.moveInfo.y = this.$refs.myObject.offsetTop;
                                this.moveInfo.startY = parseInt(e.targetTouches[0].clientY);
                                return
                            }
                            if (this.$refs.myObject.offsetTop < this.myObjectOffsetTop) {
                                this.$refs.myObject.style.top = parseInt((this.moveInfo.y + (moveY)*1.5)) + 'px'
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
	.content-box {
		.content-wrapper();
        background: @color-background;
        .is-login {
            flex: 1;
            display: flex;
            flex-direction: column;
            .my-hall {
                width: 100%;
                flex: 1;
                img {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%
                };
                .my-hall-content {
                    width: 100%;
                    height: 240px;
                    position: relative;
                    .hall-tit {
                        position: absolute;
                        top: 20px;
                        left: 15px;
                        display: flex;
                        flex-direction: column;
                        span {
                            z-index: 1;
                            &:first-child {
                                color: #fff;
                                font-size: 18px;
                                margin-bottom: 6px
                            };
                            &:last-child {
                                color: #bbbbbb;
                                font-size: 12px
                            }
                        }
                    };
                    .hall-wraper {
                        position: absolute;
                        width: 100%;
                        height: 90px;
                        top: 55%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        .create-hall {
                            border: 2px solid #fff;
                            width: 160px;
                            height: 40px;
                            padding: 0 10px 0 30px;
                            box-sizing: border-box;
                            border-radius: 20px;
                            background-image: linear-gradient(to right, #faddbf, #e7bc91);
                            color: #fff;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            >span {
                                font-size: 14px;
                                z-index: 1
                            };
                            >p {
                                width: 35px;
                                height: 19px;
                                border-radius: 10px;
                                display: flex;
                                background: #fff;
                                flex-flow: row nowrap;
                                justify-content: center;
                                align-items: center;
                                /deep/ .van-icon {
                            
                                }
                            }
                        };
                        .enter-hall {
                            background-image: linear-gradient(to right, #faddbf, #e7bc91);
                        }
                        .edit-hall {
                            margin-top: 15px;
                            background-image: linear-gradient(to right, #a3a3a3, #252525);
                        }
                    }    
                }
            };
            .my-object {
                width: 100%;
                position: fixed;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                padding: 10px 20px 10px 20px;
                box-sizing: border-box;
                top: 240px;
                left: 0;
                background: @color-home-block;
                display: flex;
                height: calc(100% - 50px);
                overflow: auto;
                z-index: 100;
                flex-direction: column;
                .object-tit {
                    text-align: center;
                    height: 50px;
                    line-height: 50px;
                    color: #fff;
                    font-size: 18px
                };
                .object-list-box {
                    flex: 1;
                    width: 100%;
                    margin-top: 10px;
                    overflow: auto;
                    display: flex;
                    flex-flow: row wrap;
                    align-content: flex-start;
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
                        box-sizing: border-box;
                        .img-show {
                            position: relative;
                            width: 100%;
                            padding: 6px;
                            border-radius: 10px;
                            box-sizing: border-box;
                            > img {
                                display: block;
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
                                    width: 26px;
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
                        }
                    }
                }
            }
        };
        .no-login {
            display: flex;
            flex: 1;
            flex-direction: column;
            >img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
            };
            .my-hall {
                width: 100%;
                height: 240px;
                .my-hall-content {
                    width: 100%;
                    height: 240px;
                    position: relative;
                    .hall-tit {
                        display: flex;
                        flex-direction: column;
                        position: absolute;
                        align-items: center;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%);
                        span {
                            z-index: 1;
                            &:first-child {
                                color: #fff;
                                font-size: 18px;
                                margin-bottom: 20px
                            };
                            &:last-child {
                                color: #bbbbbb;
                                font-size: 12px
                            }
                        }
                    }
                }
            };
            .my-object {
                z-index: 1000;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                flex: 1;
                background: @color-home-block;
                img {
                    width: 80px;
                };
                .line-one {
                    margin-top: 30px;
                    margin-bottom: 8px;
                    font-size: 22px;
                    color: #fff
                };
                .line-two {
                    margin-bottom: 40px;
                    font-size: 22px;
                    color: #fff
                };
                .login-btn {
                    border: 1px solid #fff;
                    width: 150px;
                    height: 40px;
                    border-radius: 20px;
                    text-align: center;
                    line-height: 40px;
                    font-size: 18px;
                    color: #2b1b08;
                    background: #e7d5c2
                }
            }
        }    
	}
</style>





