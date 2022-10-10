<template>
	<div class="content-box" id="top-content">
         <van-nav-bar :border="false"
            :placeholder="true"
            title="展览主题"
            :fixed="true"
            z-index="1000"
            :safe-area-inset-top="true"
            @click-left="onClickLeft"
            @click-right="onClickRight"
        >
             <template #left>
                <span>取消</span>
            </template>
            <template #right>
                <span>保存</span>
            </template>
        </van-nav-bar>
		<div class="content-center">
            <div class="top">
                <span>
                    展览主题
                </span>
                <van-field class="uni-input" v-model="exhibitionTheme"  rows="2"
                    autosize
                    type="textarea"
                />
            </div>
            <div class="bottom">
                <span>
                    展览介绍
                </span>
                <van-field class="uni-input" v-model="exhibitionIntroduce"  rows="5"
                    autosize
                    type="textarea"
                    placeholder="介绍一下展览,让更多人了解你的收藏"
                    maxlength="150"
                    show-word-limit
                />
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
	import {} from '@/api/products.js'
	export default {
        name: 'ExhibitionTheme',
		components: {
			NavBar
		},
		data() {
			return {
				exhibitionTheme: '',
                exhibitionIntroduce: '',
                lastExhibitionTheme: '',
                lastExhibitionIntroduce: ''
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
                        path: '/editNewHall'
                    })
                })
            };
            this.echoExhibitionThemeMessage()
		},
		methods: {
			...mapMutations([
                'changeHallMessage'
			]),
            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },
            //回显展览主题信息
            echoExhibitionThemeMessage () {
                if (this.queryHallMessage['type'] == -1) {
                    this.exhibitionTheme = this.hallMessage['hallTheme'] ? this.hallMessage['hallTheme'] : `${this.userInfo['nickName']}的展馆`;
                    this.exhibitionIntroduce  =  this.hallMessage['hallIntroduce'] ? this.hallMessage['hallIntroduce'] : '介绍一下你的展览';
                } else if (this.queryHallMessage['type'] == 0) {
                    this.exhibitionTheme = this.hallMessage['hallTheme'] ? this.hallMessage['hallTheme'] : `${this.userInfo['nickName']}的展馆`;
                    this.exhibitionIntroduce  = this.hallMessage['hallIntroduce'] ? this.hallMessage['hallIntroduce'] : '介绍一下你的展览'
                }
            },

            // 保存修改前的展馆主题信息
            saveExhibitiSMessage () {
                this.lastExhibitionTheme = this.hallMessage['hallTheme'] ? this.hallMessage['hallTheme'] : '',
                this.lastExhibitionIntroduce = this.hallMessage['hallIntroduce'] ? this.hallMessage['hallIntroduce'] : ''
            },

            onClickLeft () {
               this.$router.push({path: '/editNewHall'})
            },
            onClickRight () {
               let temporaryHallMessage = this.hallMessage;
               temporaryHallMessage['hallTheme'] = this.exhibitionTheme;
               temporaryHallMessage['hallIntroduce'] = this.exhibitionIntroduce;
               this.changeHallMessage(temporaryHallMessage);
               this.$router.push({path: '/editNewHall'})
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
		.content-center {
			display: flex;
			flex-direction: column;
            width: 94%;
            margin: 0 auto;
			margin-top: 30px;
            border-radius: 4px;
            > div{
                span {
                    color: #fff;
                    font-size: 14px;
                    display: inline-block;
                    line-height: 30px
                };
                /deep/ .uni-input {
                    margin-bottom: 8px;
                    border: 1px solid #2c2c2c;
                    border-radius: 10px;
                    color: #fff;
                    background: @color-block;
                    font-size: 18px;
                    .van-field__control {
                        color: #fff !important;
                        font-size: 14px !important
                    };
                    .van-field__word-limit {
                        color: #b1b1b1
                    }
                }
            };
            .top {
                margin-bottom: 20px
            }
		}
	}
</style>





