<template>
	<div class="content-box" id="top-content">
		<NavBar path="/accountSecurity" title="注销账号"/>
        <!-- 是否注销确认框 -->
        <van-dialog v-model="isShowLogout" :show-cancel-button="true"  :close-on-popstate="false" title="确认注销账号?"
        confirm-button-text="确认注销"
        cancel-button-text="再想想"
        @confirm="logoutSureEvent" 
        @cancel="logoutCancelEvent"
        />
		<div class="content-top">
            <span>当前账号</span>
            <span>{{userInfo.mobile}}</span>
		</div>
        <div class="content-center">
            <span>温馨提示</span>
            <p>请确认你的账号中是否存在操作中的数字藏品 (如待付款、发送中、转赠中等) , 操作完成后可注销账户</p>
        </div>
        <div class="content-bottom" @click="isShowLogout = true">
            注销账号
        </div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import NavBar from '@/components/NavBar'
    import {cancellatio,logout} from '@/api/login.js'
	export default {
        name: 'CancelAccount',
		components: {
            NavBar
		},
		data() {
			return {
                loadingShow: false,
                isDisabled: false,
                timer: null,
                isShowLogout: false
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
                'userInfo'
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
                        path: '/accountSecurity'
                    })
                })
            }
		},
        beforeDestroy() {
            if(this.timer) { 
                clearTimeout(this.timer)
            }
        },
		methods: {
			...mapMutations([
                'storeUserInfo',
                'changeIsLogin'
			]),

            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },

            // 弹框确定注销
            logoutSureEvent () {
                this.isShowLogout = false;
                this.cancellationEvent()
            },

            //  弹框取消注销
            logoutCancelEvent () {
                this.isShowLogout = false
            },

            //账号注销事件
            cancellationEvent () {
                if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                cancellatio().then((res) => {
                    if (res && res.data.code == 0) {
                        this.$toast({
                        message: '账号注销成功',
                        position: 'bottom'
                        });
                        this.logoutEvent();
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

            //退出登录事件
            logoutEvent () {
                this.loadingShow = true;
                logout().then((res) => {
                this.loadingShow = false;
                if (res && res.data.code == 0) {
                    this.changeIsLogin(false);
                    // 清空store和localStorage
                    this.$store.dispatch('resetFabricState');
                    this.$store.dispatch('resetLoginState');
                    window.localStorage.clear();
                    this.$router.push({path: '/myInfo'})
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
        /deep/ .van-dialog {
            background: @color-block;
            .van-dialog__header {
                color: #fff
            };
            .van-dialog__footer {
                .van-button--default {
                background: @color-block;
                };
                .van-dialog__cancel {
                color: #cbcbcb
                };
                .van-dialog__confirm {
                color: #bd68ff;
                font-weight: bold
                }
            }
        };
		.content-top {
            width: 80%;
            margin: 0 auto;
			height: 120px;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			align-items: center;
            >span {
                display: inline-block;
                color: #fff;
                &:first-child {
                    font-size: 14px;
                    margin-bottom: 20px;
                    color: #686868
                };
                &:last-child {
                    font-size: 22px;
                }
            }
			
		};
        .content-center {
            width: 80%;
            margin: 0 auto;
            height: 200px;
            font-size: 14px;
            color: #FFFFFF;
            display: flex;
            margin-top: 10px;
			flex-direction: column;
			justify-content: center;
			align-items: center;
            >span {
                font-size: 18px;
                margin-bottom: 20px
            };
            p {
                color: #686868;
                line-height: 20px;
                text-align: justify
            }
        };
        .content-bottom {
            width: 80%;
            margin: 0 auto;
            margin-top: 40px;
            border-radius: 20px;
            height: 45px;
            line-height: 45px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            background: @color-block;
            color: #bd68ff;
        }
	}
</style>




