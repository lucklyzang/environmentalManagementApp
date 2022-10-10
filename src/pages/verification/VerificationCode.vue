<template>
	<div class="content-box" id="top-content">
        <NavBar path="/login" />
		<van-loading type="spinner" vertical v-show="loadingShow" color="#fff">
            登录中
        </van-loading>
        <van-overlay :show="isShowOverlay"/>
		<div class="content-top">
			<span>请输入验证码</span>
			<span>已发送到手机号 {{phoneNumber}}</span>
			<span v-show="showCountDownTime">
				<van-count-down :time="countdownTime - new Date().getTime()" format="ss" @finish="countDownEnd" />
				<span>s后重新发送</span>
			</span>
		</div>
		<div class="content-center">
			<div>
                <van-field class="uni-input" ref="inputOne" placeholder="六位短信验证码" v-model="codeValue" @input="inputChange" maxlength="6" type="number"/>
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
	import {
		phoneAuthCodeLogin,
		getAppId
	} from '@/api/login.js'
	 import {
        inquareUserInfo
    } from '@/api/products.js'
	export default {
		name: 'VerificationCode',
		components: {
			NavBar
		},
		data() {
			return {
				hideInput: '',
				getCode: '',
				codeValue: '',
				phoneNumber: '',
				invitationCodeValue: '',
				loadingShow: false,
				isShowOverlay: false,
				showCountDownTime: true
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
				'countdownTime',
				'inviteMessage'
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
						path: '/login'
					})
				});
			};
			// 提供给原生app调用的方法
			let me = this;
			window['sendMessageAuthenticationCode'] = (val) => {
				me.sendMessageAuthenticationCode(val);
			};
			this.phoneNumber = this.$route.params.phoneNumber;
			this.invitationCodeValue = this.$route.params.invitationCodeValue;
			this.$refs.inputOne.focus()
		},
		methods: {
			...mapMutations([
				'changeToken',
				'changeIsLogin',
				'changeIsTokenExpired',
				'storeUserInfo',
				'changeAppId'
			]),

			// 获取原生传递的值
			sendMessageAuthenticationCode (val) {
			},

			//让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},

			// 输入框变化事件
			inputChange (event) {
				if (this.codeValue.length == 6) {
					this.phoneCodeLogin(this.codeValue)
				}
			},

			// 手机验证码登录
			phoneCodeLogin (val) {
				this.loadingShow = true;
				this.isShowOverlay =  true;
				phoneAuthCodeLogin({
					mobile: this.phoneNumber,
  					password: val,
					code: this.invitationCodeValue,
					inviteType: this.inviteMessage ? this.inviteMessage['inviteType'] : '',
  					inviteId: this.inviteMessage ? this.inviteMessage['inviteId'] : ''
				}).then((res) => {
					this.loadingShow = false;
					this.isShowOverlay =  false;
					if (res && res.data.code == 0) {
						this.changeToken(res.data.token);
						this.queryuserInfo();
						this.changeIsLogin(true);
						this.changeIsTokenExpired(false);
					} else {
						this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
					}
				})
				.catch((err) => {
					this.loadingShow = false;
					this.isShowOverlay =  false;
					this.$toast({
						message: `${err.message}`,
						position: 'bottom'
					})
				})
			},
			
			// 查询用户信息
            queryuserInfo() {
                inquareUserInfo().then((res) => {
					if (res && res.data.code == 0) {
						this.storeUserInfo(res.data.data);
						this.getAppIdEvent()
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

			//获取appId
			getAppIdEvent() {
                getAppId().then((res) => {
					if (res && res.data.code == 0) {
						this.changeAppId(res.data.data);
						this.$router.push({name:'home'})
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


			//倒计时结束事件
			countDownEnd () {
				this.showCountDownTime = false
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
            }
        };
		.content-top {
			height: 200px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			> span {
				&:nth-child(1) {
					font-size: 30px;
					color: #FFFFFF
				};
				&:nth-child(2) {
					margin: 20px 0 10px 0;
					font-size: 12px;
					color: #686868
				};
				&:nth-child(3) {
					display: flex;
					flex-flow: row nowrap;
					justify-content: center;
					align-items: center;
					>span {
						font-size: 12px;
						color: #a53d3d;
					};
					/deep/ .van-count-down {
						font-size: 12px;
						color: #a53d3d
					}
				}
			}
		};
		.content-center {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			margin-top: 30px;
			> div {
				width: 80%;
				margin: 0 auto;
                .bottom-border-1px(#6e6e6e,3px);
				/deep/ .uni-input {
					color: #fff;
					height: 50px;
					text-align: center;
					font-size: 18px;
                    background: transparent;
                    .van-field__control {
                        color: #fff !important
                    };
					input::placeholder{
						color: #fff;
						font-size: 14px
					};     
					// 去除自动填充的输入框黄色背景
					input:-webkit-autofill,
					input:-webkit-autofill:hover,
					input:-webkit-autofill:focus,
					input:-webkit-autofill:active {
						-webkit-transition-delay: 9999s;
						-webkit-transition: color 9999s ease-out, background-color 9999s ease-out;
					}
				}
			}
		};
		.hide-input {
			width: 1px;
			height: 1px;
			/deep/ .van-cell {
				background: transparent;
				.van-field__control {
					color: transparent !important
				}
			}
		}
	}
</style>





