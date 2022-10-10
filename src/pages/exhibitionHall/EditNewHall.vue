<template>
	<div class="content-box" id="top-content">
        <van-nav-bar left-arrow :border="false"
            :placeholder="true"
            :title="queryHallMessage.type == -1 ? '创建新展览' : '编辑展览'"
            :fixed="true"
            z-index="1000"
            :safe-area-inset-top="true"
            @click-left="onClickLeft"
            @click-right="onClickRight"
        >
            <template #right>
                <span>发布</span>
            </template>
        </van-nav-bar>
        <van-loading type="spinner" vertical v-show="loadingShow" color="#fff">
            发布中
        </van-loading>
        <van-overlay :show="isShowOverlay"/>
        <van-dialog v-model="isShowHint" :show-cancel-button="true"  :close-on-popstate="false" title="你确定要离开该页面? 离开之后当前内容无法保存。"
            confirm-button-text="确定"
            cancel-button-text="取消"
            @confirm="sureEvent" 
            @cancel="cancelEvent"
        />
        <img :src="hallMessage.hallTemplatePath" alt="" ref="backgroundImg">
        <div class="content" ref="content">
            <div class="content-center" 
                ref="contentCenter"
            >
            <div class="content-left" ref="contentLeft" @click="exhibitionThemeEvent">
                <div class="hall-title">
                    {{exhibitionTheme}}
                </div>
                <div class="hall-introduce">
                    <span>{{exhibitionIntroduce}}</span>
                    <img :src="editIntroducePng" alt="">
                </div>
            </div>
            <div class="content-right">
                <div class="plus-exhibits" v-if="hallMessage.hallExhibitsList.length == 0">
                    <img :src="hallPlusPng" alt="" @click="editExhibitsEvent">
                    <span>
                        {{hallMessage.hallExhibitsList.length}}
                    </span>
                </div>
                <div class="exhibition-list" v-else v-for="(item,index) in hallMessage.hallExhibitsList" :key="index" :ref="'exhibitionList'+ index">
                    <div class="exhibits-top" v-lazy-container="{ selector: 'img' }" :style="{background: 'url(' + imgBorderImg+ ') no-repeat center center' }">
                        <img :data-src="item.collectionUrl" alt="">
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
                        <p class="author">{{item.collectionName}}</p>
                        <p class="publisher">{{item.publisher}}</p>
                    </div>
                </div>   
            </div>
            </div>
        </div> 
        <div class="content-bottom">
            <div @click="chooseHallTemplateEvent">
                <img :src="chooseTemplatePng" alt="">
                <span>选择模板</span>
            </div>
            <div @click="editExhibitsEvent">
                <img :src="editExhibitsPng" alt="">
                <span>编辑展品</span>
            </div>
            <div @click="exhibitionThemeEvent">
                <img :src="editExhibitionThemePng" alt="">
                <span>展览主题</span>
            </div>
        </div>   
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
    import {publishHall,edithHall} from '@/api/products.js'
	export default {
        name: 'EditNewHall',
		components: {
		},
		data() {
			return {
                moveInfo: {
                    lastMoveTime: '',
                    startX: 0,
                    x: 0,
                    imgX: 0
                },
                loadingShow: false,
                isShowOverlay: false,
                isRotate: true,
                exhibitionTheme: '',
                exhibitionIntroduce: '',
                myObjectOffsetLeft: '',
                myObjectMaxMoveDistance: '',
                backgroundImgMaxMoveDistance: '',
                backgroundImgLeft: '',
				isShowHint: false,
                isRenderComplete: true,
                hallPlusPng: require("@/common/images/hall/hall-plus.png"),
                editIntroducePng: require("@/common/images/hall/edit-introduce.png"),
                chooseTemplatePng: require("@/common/images/hall/choose-template.png"),
                editExhibitsPng: require("@/common/images/hall/edit-exhibits.png"),
                editExhibitionThemePng: require("@/common/images/hall/exhibition-theme.png"),
                hallBothPng: require("@/common/images/home/hall-both.png"),
                blockchainPng: require("@/common/images/hall/hall-chain.png"),
                imgBorderImg: require("@/common/images/home/img-border.png")
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
                'hallMessage',
                'userInfo',
                'queryHallMessage',
                'myObjects'
			])
		},

		mounted() {
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                    pushHistory();
                    this.$router.push({
                        path: '/createHall'
                    })
                })
            };
            this.myObjectOffsetLeft = this.$refs.contentCenter.offsetLeft;
            this.backgroundImgLeft = this.$refs.backgroundImg.offsetLeft;
            if (this.hallMessage.hallExhibitsList.length > 0) {
                this.calculateContentWidth(this.hallMessage.hallExhibitsList.length)
            };
            this.echoExhibitionThemeMessage();
            this.registerSlideEvent()
		},
        
        beforeDestroy() {
            window.removeEventListener('touchstart',this.touchstartHandle,false);
            window.removeEventListener('touchmove',this.touchmoveHandle,false)
        },

        updated() {
            if (this.isRenderComplete) {
                this.calculateContentWidth(this.hallMessage.hallExhibitsList.length)
            }
        },

        // beforeRouteLeave(to, from, next) {
        //     if (to.path == '/createHall') {
        //         this.isShowHint = true;
        //         return
        //     };
        //     next()
        // },
        
		methods: {
			...mapMutations([
                'changeHallMessage',
                'changeIsEnterMyObjectDetailsPageSource'
			]),
            onClickLeft () {
                this.$router.push({path: '/createHall'})
            },
            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },
            //回显展览主题信息
            echoExhibitionThemeMessage () {
                if (this.queryHallMessage['type'] == -1) {
                    this.exhibitionTheme = this.hallMessage['hallTheme'] ? this.hallMessage['hallTheme'] : `${this.userInfo['nickName']}的展馆`;
                    this.exhibitionIntroduce  = this.hallMessage['hallIntroduce'] ? this.hallMessage['hallIntroduce'] : '介绍一下你的展览';
                } else if (this.queryHallMessage['type'] == 0) {
                    this.exhibitionTheme = this.hallMessage['hallTheme'] ? this.hallMessage['hallTheme'] : `${this.userInfo['nickName']}的展馆`;
                    this.exhibitionIntroduce  = this.hallMessage['hallIntroduce'] ? this.hallMessage['hallIntroduce'] : '介绍一下你的展览'
                };
                //过滤掉已经被赠送出的藏品
                if (this.hallMessage['hallExhibitsList'].length > 0) {
                    let temporaryHallMessage = this.hallMessage;
                    let objectIdList = [];
                    let temporaryHallExhibitsList = [];
                    for (let item of this.myObjects) {
                        objectIdList.push(item.id)
                    };
                    for (let item of this.hallMessage['hallExhibitsList']) {
                        if (objectIdList.indexOf(item['ownId']) != -1) {
                            temporaryHallExhibitsList.push(item)
                        }
                    };
                    temporaryHallMessage['hallExhibitsList'] = temporaryHallExhibitsList;
                    this.changeHallMessage(temporaryHallMessage)
                }
            },

            //发布
            onClickRight () {
                if (this.hallMessage['hallExhibitsList'].length == 0) {
                    this.$toast({
                        message: '请编辑展品',
                        position: 'bottom'
                    });
                    return
                };
                if (!this.hallMessage['hallTemplate']) {
                    this.$toast({
                        message: '请选择模板',
                        position: 'bottom'
                    });
                    return
                };
                let hallMessage = {
                    type: this.hallMessage['hallType'],
                    name: this.hallMessage['hallTheme'],
                    signTxt: this.hallMessage['hallIntroduce'],
                    template: this.hallMessage['hallTemplate'],
                    exhibitDtos: []
                };
                let temporaryData = [];
                for (let item of this.hallMessage['hallExhibitsList']) {
                    temporaryData.push({
                        ownId: item.ownId
                    })
                };
                hallMessage['exhibitDtos'] = temporaryData;
                if(this.queryHallMessage.type == -1) {
                    this.publishHallEvent(hallMessage)
                } else {
                    hallMessage.id = this.queryHallMessage.id;
                    this.edithHallEvent(hallMessage)
                }
            },
            // 选择展览模板事件
            chooseHallTemplateEvent () {
                this.$router.push({path: '/chooseHallTemplate'})
            },
            //编辑展品事件
            editExhibitsEvent () {
                this.$router.push({path: '/chooseExhibits'})
            },
            //展览主题事件
            exhibitionThemeEvent () {
                this.$router.push({path: '/exhibitionTheme'})
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

            // 发布展馆
            publishHallEvent (data) {
                this.loadingShow = true;
                this.isShowOverlay = true;
                publishHall(data).then((res) => {
                    this.loadingShow = false;
                    this.isShowOverlay = false;
					if (res && res.data.code == 0) {
                        this.$toast({
                            message: '发布成功',
                            position: 'bottom'
                        });
                        this.changeIsEnterMyObjectDetailsPageSource('/editNewHall');
                        this.$router.push({path: '/myObjectDetails'});
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
				})
				.catch((err) => {
                    this.loadingShow = false;
                    this.isShowOverlay = false;
					this.$toast({
						message: `${err.message}`,
						position: 'bottom'
					})
				})
            },

            // 编辑展馆
            edithHallEvent (data) {
                this.loadingShow = true;
                this.isShowOverlay = true;
                edithHall(data).then((res) => {
                    this.loadingShow = false;
                    this.isShowOverlay = false;
					if (res && res.data.code == 0) {
                        this.$toast({
                            message: '发布成功',
                            position: 'bottom'
                        });
                        this.changeIsEnterMyObjectDetailsPageSource('/editNewHall');
                        this.$router.push({path: '/myObjectDetails'})
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
				})
				.catch((err) => {
                    this.loadingShow = false;
                    this.isShowOverlay = false;
					this.$toast({
						message: `${err.message}`,
						position: 'bottom'
					})
				})
            },

            //弹框确定事件
            sureEvent () {
                this.$router.push({
                    path: '/createHall'
                })

            },
            //弹框取消事件
            cancelEvent () {
                
            },

            // 注册滑动事件  
            registerSlideEvent () {
                this.$refs.contentCenter.addEventListener('touchstart',this.touchstartHandle,false);
                this.$refs.contentCenter.addEventListener('touchmove',this.touchmoveHandle,false)
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
                        e.preventDefault();
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
        /deep/ .van-nav-bar {
            background: transparent;
            .van-icon-arrow-left {
                color: #fff !important;
                font-size: 18px !important
            };
            .van-nav-bar__title {
                color: #fff !important
            };
            .van-nav-bar__right {
                width: 60px;
                height: 30px;
                line-height: 30px;
                border-radius: 20px;
                background: #f0c796;
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
        /deep/ .van-dialog {
            width: 70%;
            background: #fff;
            .van-dialog__header {
                color: #333;
                padding: 14px;
                font-size: 12px
            };
            .van-dialog__footer {
                .van-button--default {
                    background: #fff;
                };
                .van-dialog__cancel {
                    color: blue;
                    font-weight: bolder
                };
                .van-dialog__confirm {
                    color: blue;
                }
            }
        };
        > img {
            position: absolute;
            top: 0;
            left: 0;
            height: 100vh
        };
        .content {
            flex: 1;
            width: 100%;
            position: relative;
            .content-center {
                position: absolute;
                display: flex;
                flex-flow: row nowrap;
                top: 10vh;
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
                    .hall-title {
                        color: #fff;
                        font-size: 24px;
                        height: 100px;
                        line-height: 25px;
                        word-break: break-all;
                        overflow: auto;
                    };
                    .hall-introduce {
                        color: #e8e8e8;
                        line-height: 20px;
                        font-size: 14px;
                        word-break: break-all;
                        flex: 1;
                        margin-top: 10px;
                        overflow: auto;
                        >img {
                            width: 14px
                        }
                    }
                };
                .content-right {
                    color: #fff;
                    font-size: 22px;
                    height: 72vh;
                    display: flex;
                    flex-direction: column;
                    flex-wrap: wrap;
                    .plus-exhibits {
                        >img {
                            width: 100px;
                        };
                        >span {
                            width: 100px;
                            display: inline-block;
                            color: #adadad;
                            font-size: 13px;
                            height: 25px;
                            .bottom-border-1px(#adadad,8px) 
                        }
                    };
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
        };
        .content-bottom {
            position: fixed;
            bottom: 10px;
            right: 0;
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
            padding-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
            padding: 10px;
            box-sizing: border-box;
            color: #fff;
            >div {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                font-size: 12px;
                align-items: center;
                >img {
                    width: 50px;
                    height: 50px
                }
                >span {
                    color: #e2e2e2;
                    margin-left: 4px;
                    margin-top: 10px
                }
            }
        }    
	}
</style>





