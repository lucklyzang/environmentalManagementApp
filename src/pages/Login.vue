<template>
  <div class="content-box" id="top-content"
	:style="{backgroundImage: 'url(' + pageTopLeftBackgroundPng+ ')',backgroundRepeat:'no-repeat',backgroundPosition:'left top',backgroundSize:'55%'}"
  >
		 <!-- 注册0.1元购弹框 -->
		<div class="register-buy-info-box">
		<van-dialog v-model="registerBuyInfoBoxShow" :show-confirm-button="false" :close-on-click-overlay="true">
			<div class="title">
				<van-icon name="clear" color="#808080" size="25" @click="clearAreaCodeDialogEvent" />
			</div>
			<div class="content">
				<img :src="registerBuyInfoJpg" />
			</div>
		</van-dialog>
		</div>  
	  	<NavBar :path="path" />
		<div class="content-top">
			<span>登录有光</span>
			<span>发现有趣</span>
		</div>
		<div class="content-middle">
			<div class="invitation-code" @click="invitationCodeClicked">
				<van-field class="uni-input" ref="invitationCode" v-model="invitationCodeValue" @input="invitationCodeEvent" type="text" placeholder="请输入邀请码(非必填)" />
			</div>
			<div class="invitation-code-info">
				邀请码通过已注册用户分享进行获取(非必填)
			</div>
			<div class="phone-number" @click="inputClicked">
				<van-field class="uni-input" ref="phoneInput" v-model="phoneNumber" @input="inputEvent" type="tel" placeholder="请输入手机号码" />
			</div>
			<div class="send-auth-box" @click="loginToIndex" :class="{'sendAuthBoxStyle': !checked || !phoneNumberUsable || !isCanSendPhoneCode || isSending}">
				<span>{{!isSending ? '发送短信验证码' : '发送中···'}}</span>
			</div>
			<div class="countDown-box" v-show="!isCanSendPhoneCode">
				<van-count-down :time="countdownTime - new Date().getTime()" format=" ss秒后重新发送" @finish="countDownEnd" />
			</div>
			<div class="tip-info">
				<van-checkbox v-model="checked">
					<template #icon="props">
						<img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
					</template>
					<template #default>
						<span>已阅读并同意</span>
					</template>
				</van-checkbox>
				<div class="protocol">
					<span @click="jumpProtocolEvent">《用户协议》</span>
					<span>和</span>
					<span @click="jumpPrivacyEvent">《隐私协议》</span>
				</div>
			</div>
		</div>
		<!-- <div class="content-bottom">
			<div>
				<span>
					微信登录
				</span>
			</div>
			<div @click="weixinAuthEvent">
				<img :src="weixinPng">
			</div>
		</div> -->
	</div>
</template>

<script>
import {sendPhoneAuthCode} from '@/api/login.js'
import { mapGetters, mapMutations } from 'vuex'
import NavBar from '@/components/NavBar'
import {IsPC} from '@/common/js/utils'
export default {
  name: 'Login',
  components: {
	NavBar
  },
  data () {
    return {
      phoneNumber: '',
	  invitationCodeValue: '',
	  path: '',
	  isSending: false,
	  registerBuyInfoBoxShow: true,
	  isDisabled: false,
	  timer: null,
	  checked: false,
	  phoneNumberUsable: false,
      weixinPng: require("@/common/images/login/weixin-login.png"),
	  registerBuyInfoJpg: require("@/common/images/login/register-buy-info.jpg"),
	  activeIcon: require("@/common/images/login/agree-checked.png"),
      inactiveIcon: require("@/common/images/login/agree-default.png"),
	  pageTopLeftBackgroundPng :require("@/common/images/home/page-top-left-background.png")
    }
  },

  watch: {
	  checked (newVal,oldVal) {
		if (!this.checked) {
			this.$toast({
				message: '请阅读并同意协议',
				position: 'bottom'
			})
		}	  
	  }
  },

  computed: {
    ...mapGetters([
		'isCanSendPhoneCode',
		'countdownTime',
		'isTokenExpired',
		'isEnterVerificationCodePage',
		'isEnterLoginPageSource'
    ])
  },

   beforeRouteEnter(to, from, next) {
		next(vm => {
			if (vm.isEnterVerificationCodePage) {
				vm.path = vm.isEnterLoginPageSource
			} else {
				vm.path = from.path
			}
		})
    },

	beforeRouteLeave(to, from, next) {
		if (to.path !== '/verificationCode' && to.path !== '/protocol' && to.path !== '/privacy') {
			this.changeIsEnterVerificationCodePage(false);
		};
		if (this.isEnterVerificationCodePage) {
			this.path = this.isEnterLoginPageSource
		} else {
			this.path = from.path
		};
		next()
	},

  mounted () {
	this.toTop();
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory()
      that.gotoURL(() => {
        pushHistory();
		this.$router.push({path: this.path})
      });
    };
    // 监控键盘弹起
    let originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
    window.onresize = ()=> {
    };
  },

  methods: {
    ...mapMutations([
		'storeUserInfo',
		'changeIsCanSendPhoneCode',
		'changeCountdownTime',
		'changeIsEnterVerificationCodePage'
    ]),

	//让页面滚动到顶部
	toTop() {
		document.querySelector('#top-content').scrollIntoView(true)
	},

	inputClicked() {
       if (this.$refs.phoneInput) {
           this.$refs.phoneInput.focus()
       }
   	},

	invitationCodeClicked () {
		if (this.$refs.invitationCode) {
           this.$refs.invitationCode.focus()
       }
	},

	// 关闭二维码弹框事件
	clearAreaCodeDialogEvent () {
		this.registerBuyInfoBoxShow = false
	},

	// 跳转用户协议页面事件
	jumpProtocolEvent () {
		this.changeIsEnterVerificationCodePage(true);
		this.$router.push({path: '/protocol'})
	},

	// 跳转隐私权政策
	jumpPrivacyEvent () {
		this.changeIsEnterVerificationCodePage(true);
		this.$router.push({path: '/privacy'})
	},

	// 邀请码输入框值改变事件
	invitationCodeEvent (value) {

	},

    // 输入框值改变事件
    inputEvent (value) {
		let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
		if (!myreg.test(value)) {
			this.phoneNumberUsable = false;
			if (value.length >= 11) {
				this.$toast({
					message: '手机号格式有误,请重新输入!',
					position: 'bottom'
				})
			}	
		} else {
			this.phoneNumberUsable = true;
			if (!this.checked) {
				this.$toast({
					message: '请阅读并同意协议',
					position: 'bottom'
				})
			}	  
		}
    },

	// 倒计时结束事件
	countDownEnd () {
		this.changeIsCanSendPhoneCode(true);
		this.changeCountdownTime(0)
		
	},

	//微信登录
	weixinAuthEvent () {
		this.$router.push({path:'/weixinLogin'})
	},
    // 验证码
    loginToIndex () {
		if (!this.checked || !this.phoneNumberUsable || !this.isCanSendPhoneCode) {
			return
		};
		this.sendCode()
    },

	// 发送验证码
	sendCode () {
		if(this.isDisabled) return;
		this.isDisabled = !this.isDisabled;
		this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
		if (this.isSending) { return };
		this.isSending = true;
		sendPhoneAuthCode(this.phoneNumber).then((res) => {
			this.isSending = false;
			if (res && res.data.code == 0) {
				this.changeIsCanSendPhoneCode(false);
				this.changeIsEnterVerificationCodePage(true);
				this.changeCountdownTime(new Date().getTime()+60000);
				this.$router.push({name:'verificationCode',params: {phoneNumber: this.phoneNumber, invitationCodeValue: this.invitationCodeValue}})
            } else {
				this.$toast({
					message: `${res.data.msg}`,
					position: 'bottom'
				})
            }
		})
		.catch((err) => {
			this.isSending = false;
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
@import "../common/stylus/variable.less";
@import "../common/stylus/mixin.less";
@import "../common/stylus/modifyUi.less";
   .content-box {
    .content-wrapper();
    background: @color-background;
        /deep/ .van-nav-bar {
			background: transparent;
            .van-icon {
                color: #fff !important;
                font-size: 18px !important
            }
        };
		.register-buy-info-box {
			/deep/ .van-dialog {
				top: 50% !important;
				width: 90% !important;
				background: none !important;
				.van-dialog__content {
				.title {
					background: #10100e;
					width: 100%;
					padding: 0 4px;
					box-sizing: border-box;
					display: flex;
					flex-flow: row nowrap;
					justify-content: flex-end;
					align-items: center;
					height: 30px;
				};
				.content {
					width: 100%;
					min-height: 200px;
					>img {
						width: 100%;
						display: block
					}
				}
				}
			}
		};  
		.content-top {
			height: 35vh;
			line-height: 35vh;
			width: 80%;
			margin: 0 auto;
			span {
				font-size: 26px;
				font-weight: bold;
				&:first-child {
					color: #ebebeb;
					margin-right: 20px;
				};
				&:last-child {
					color: #686868
				}
			}
		};
		.content-middle {
			width: 80%;
			margin: 0 auto;
			.phone-number {
				margin-top: 20px;
				.bottom-border-1px(#6e6e6e,3px);
				/deep/ .uni-input {
					color: #fff;
					height: 50px;
					font-size: 18px;
					background: transparent;
					.van-field__value {
						font-size: 18px
					};
					input::placeholder{
						color: #fff;
						font-size: 16px
					};
					.van-field__body {
						.van-field__control {
						color: #fff
						}
					}
				}
			};
			.invitation-code {
				.bottom-border-1px(#6e6e6e,3px);
				/deep/ .uni-input {
					color: #fff;
					height: 50px;
					font-size: 18px;
					background: transparent;
					.van-field__value {
						font-size: 18px
					};
					input::placeholder{
						color:#fff;
						font-size: 16px
					};
					.van-field__body {
						.van-field__control {
						color: #fff
						}
					}
				}
			};
			.invitation-code-info {
				color:rgb(66, 66, 66);
				font-size: 12px;
				margin-top: 6px
			};
			.send-auth-box {
				height: 50px;
				border-radius: 30px;
				font-size: 18px;
				background-image: linear-gradient(to right, #e5bd89, #f8cf9f);
				margin: 30px 0 10px 0;
				text-align: center;
				line-height: 50px;
				color: #1e1d1c;
			};
			.sendAuthBoxStyle {
				background: #7e7e7e
			};
			.countDown-box {
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
				margin-bottom: 10px;
				/deep/ .van-count-down {
					color: #404040;
					font-size: 12px
				}
			};
			.tip-info {
				font-size: 12px;
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
				/deep/ .van-checkbox {
					justify-content: center;
					.van-checkbox__icon {
						img {
							width: 17px;
						}
					};
					.van-checkbox__label {
						>span {
							&:nth-child(1) {
								color: #686868
							}
						}
					}
				};
				.protocol {
					>span {
						&:nth-child(1) {
							color: #FFFFFF
						};
						&:nth-child(2) {
							color: #686868
						};
						&:nth-child(3) {
							color: #FFFFFF
						};
					}
				}
			}
		};		
		.content-bottom {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			>div {
				&:first-child {
					font-size: 12px;
					color: #b2b2b0;
					margin-bottom: 20px
				};
				&:last-child {
					width: 44px;
					border-radius: 50%;
					img {
						width: 100%;
						border-radius: 50%;
					}
				}
			}
		}
  }
</style>
