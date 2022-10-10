<template>
	<div class="content-box" id="top-content">
        <NavBar path="/myObject" :title="queryHallMessage.type == -1 ? '创建新展览' : '编辑展览'"/>
		<div class="content-top">
           <div class="hall-type-list" v-for="(item,index) in hallTypeList" :key="item.text" @click="hallTypeClickEvent(index)">
               <img :src="item.imgPath" alt="">
               <div class="title">
                <van-checkbox checked-color="#f0c796" @click="checkboxClickEvent" v-model="item.isChecked">
                    {{item.text}}
                </van-checkbox>
               </div>
           </div>
		</div>
        <div class="btn-area">
            <span :class="{'spanStyle':!isCanClick}" @click="sureEvent">确定</span>
        </div>
	</div>
</template>

<script>
	import NavBar from '@/components/NavBar'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	export default {
        name: 'CreateHall',
		components: {
			NavBar
		},
		data() {
			return {
                isCanClick: '',
                hallTypeList: [
                    {
                        text: '2D展览',
                        isChecked: true,
                        imgPath: require("@/common/images/hall/abbr-background.png")
                    }
                ]
				
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
                        path: '/myObject'
                    })
                })
            };
            let isHaveChecked = this.hallTypeList.some((item) => {return item.isChecked == true});
            this.isCanClick = isHaveChecked

		},
		methods: {
			...mapMutations([
                'changeHallMessage'
			]),
            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },
            //展览类型点击事件
            hallTypeClickEvent (index) {
                this.hallTypeList[index]['isChecked'] = !this.hallTypeList[index]['isChecked'];
                let isHaveChecked = this.hallTypeList.some((item) => {return item.isChecked == true});
                this.isCanClick = isHaveChecked
            },
            //复选框点击事件
            checkboxClickEvent () {
            },
            // 确定事件
            sureEvent () {
                if (!this.isCanClick) {
                    return
                };
                let type = this.hallTypeList.filter((item) => {return item.isChecked == true})[0];
                let temporaryHallMessage = this.hallMessage;
                temporaryHallMessage['hallType'] = type.text == '2D展览' ? 0 : 1;
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
            .van-icon {
                color: #fff !important;
                font-size: 18px !important
            };
             .van-nav-bar__title {
                color: #fff !important;
                font-size: 16px !important
            }
        };
		.content-top {
            width: 80%;
            margin: 0 auto;
			margin-top: 30px;
            flex: 1;
            position: relative;
            .hall-type-list {
                border-radius: 10px;
                width: 100%;
                position: relative;
                border-radius: 10px;
                img {
                    width: 100%;
                    height: 180px;
                    border-radius: 10px;
                };
                .title {
                    position: absolute;
                    bottom: 20px;
                    left: 10px;
                    span {
                        font-size: 16px;
                        color: #fff
                    };
                    /deep/ .van-checkbox {
                        .van-checkbox__label {
                            font-size: 16px;
                            color: #fff
                        }
                    }
                }
            }
		};
        .btn-area {
            display: flex;
			flex-direction: column;
			justify-content: flex-start;
            align-items: center;
            height: 180px;
            width: 80%;
            margin: 0 auto;
            margin-top: 20px;
            padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
            padding-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
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





