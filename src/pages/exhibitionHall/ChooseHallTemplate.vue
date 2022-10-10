<template>
	<div class="content-box" id="top-content">
        <van-nav-bar :border="false"
            :placeholder="true"
            title="选择展厅模板"
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
        <van-loading type="spinner" v-show="loadingShow"/>
		<div class="content-top">
           <img :src="checkedTemplateImg" alt="">
           <span>{{checkedTemplateText}}</span>
		</div>
        <div class="content-bottom">
            <div class="template-text">
                2D
            </div>
            <div class="template-list-wrapper">
                <div class="template-list" v-lazy-container="{ selector: 'img' }"  :class="{'listStyle': index == currentIndex}" v-for="(item,index) in templateList" :key="index" @click="templateClickEvent(item,index)">
                    <img :data-src="item.path" alt="">
                </div>
            </div>
        </div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
    import {
       queryHallTemplates
    } from '@/api/products.js'
	export default {
        name: 'ChooseHallTemplate',
		components: {
		},
		data() {
			return {
                currentIndex: 0,
                loadingShow: false,
                checkedTemplateImg: '',
                checkedTemplateId: '',
                checkedTemplateText: '',
				templateList: []
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
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
            this.queryHallTemplatesEvent()
		},
		methods: {
			...mapMutations([
                'changeHallMessage'
			]),

            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },

            //模板点击事件
            templateClickEvent (item,index) {
                this.currentIndex = index;
                this.checkedTemplateId = item.id,
                this.checkedTemplateImg = item.path;
                this.checkedTemplateText = item.name
            },

            //查询展管
            queryHallTemplatesEvent () {
                this.loadingShow = true;
                queryHallTemplates(0).then((res) => {
                    this.loadingShow = false;
                    this.templateList = [];
                    if (res && res.data.code == 0) {
                        this.templateList = res.data.list;
                        //存储模板信息
                        let temporaryHallMessage = this.hallMessage;
                        temporaryHallMessage['hallTemplateList'] = this.templateList;
                        this.changeHallMessage(temporaryHallMessage);
                        //回显模板信息
                        this.echoTemplateMessage(this.templateList);
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

            //回显模板信息
            echoTemplateMessage (dataList) {
                if (this.queryHallMessage.type != -1) {
                    if (this.hallMessage['hallTemplate']) {
                        let echoIndex =  dataList.findIndex((item) => {return item.id == this.hallMessage['hallTemplate']});
                        this.currentIndex = echoIndex;
                        this.checkedTemplateId = dataList[echoIndex]['id'];
                        this.checkedTemplateImg = dataList[echoIndex]['path'];
                        this.checkedTemplateText = dataList[echoIndex]['name']
                    } else if (this.queryHallMessage['template']){
                        let echoIndex =  dataList.findIndex((item) => {return item.id == this.queryHallMessage['template']});
                        this.currentIndex = echoIndex;
                        this.checkedTemplateId = dataList[echoIndex]['id'];
                        this.checkedTemplateImg = dataList[echoIndex]['path'];
                        this.checkedTemplateText = dataList[echoIndex]['name']
                    } else {
                        this.checkedTemplateId = dataList[0]['id'];
                        this.checkedTemplateImg = dataList[0]['path'];
                        this.checkedTemplateText = dataList[0]['name'] 
                    }
                } else {
                    if (this.hallMessage['hallTemplate']) {
                        let echoIndex =  dataList.findIndex((item) => {return item.id == this.hallMessage['hallTemplate']});
                        this.currentIndex = echoIndex;
                        this.checkedTemplateId = dataList[echoIndex]['id'];
                        this.checkedTemplateImg = dataList[echoIndex]['path'];
                        this.checkedTemplateText = dataList[echoIndex]['name']
                    } else if (this.queryHallMessage['template']){
                        let echoIndex =  dataList.findIndex((item) => {return item.id == this.queryHallMessage['template']});
                        this.currentIndex = echoIndex;
                        this.checkedTemplateId = dataList[echoIndex]['id'];
                        this.checkedTemplateImg = dataList[echoIndex]['path'];
                        this.checkedTemplateText = dataList[echoIndex]['name']
                    } else {
                        this.checkedTemplateId = dataList[0]['id'];
                        this.checkedTemplateImg = dataList[0]['path'];
                        this.checkedTemplateText = dataList[0]['name'] 
                    }
                }   
            },

            onClickLeft () {
                this.$router.push({path: '/editNewHall'})
            },
            //保存模板类型
            onClickRight () {
               let temporaryHallMessage = this.hallMessage;
               temporaryHallMessage['hallTemplate'] = this.checkedTemplateId;
               temporaryHallMessage['hallTemplatePath'] = this.checkedTemplateImg;
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
		.content-top {
            width: 90%;
            margin: 0 auto;
			margin-top: 20px;
            position: relative;
            img {
                width: 100%
            };
            >span {
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 18px;
                color: #fff;
                height: 40px;
                line-height: 40px;
            }
		};
        .content-bottom {
            width: 90%;
            margin: 0 auto;
            margin-top: 10px;
            flex: 1;
            display: flex;
            padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
            padding-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
            flex-direction: column;
            .template-text {
                height: 30px;
                line-height: 30px;
                color: #fff;
                font-size: 16px

            };
            .template-list-wrapper {
                display: flex;
                width: 100%;
                overflow-x: scroll;
                overflow-y: hidden;
                &::-webkit-scrollbar {
                    height: 0;
                    display: none
                };
                .template-list {
                    width: 100px;
                    box-sizing: border-box;
                    border-radius: 8px;
                    margin-right: 2%;
                    flex: none;
                    &:last-child{
                        margin-right: 0
                    };
                    img {
                        width: 100%;
                        border-radius: 8px
                    }
                };
                .listStyle {
                   border: 3px solid #edc292
                }
            }    
        }
	}
</style>





