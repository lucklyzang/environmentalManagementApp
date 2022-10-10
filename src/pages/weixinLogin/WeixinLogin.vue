<template>
  <div class="content-box">
		<NavBar path="/login" />
		<div class="content-top">
			<span>登录某某</span>
			<span>发现有趣</span>
		</div>
		<div class="content-middle">
			<div class="tip-info">
        		<van-checkbox v-model="checked">
					<template #icon="props">
						<img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
					</template>
					<template #default>
						<span>已阅读并同意</span>
						<span>《用户协议》</span>
						<span>和</span>
						<span>《隐私协议》</span>
					</template>
				</van-checkbox>
			</div>
			<div class="send-auth-box" @click="weixinLogin">
				<img :src="weixinPng">
				<span>微信快速登录</span>
			</div>
		</div>
		<div class="content-bottom">
			<div>
				<span>
					其它登录方式
				</span>
			</div>
			<div @click="otherAuthEvent">
				<img :src="phonePng">
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import NavBar from '@/components/NavBar'
import { IsPC } from '@/common/js/utils'
export default {
  name: 'WeixinLogin',
  components: {
	NavBar
  },
  data () {
    return {
      weixinPng :require("@/common/images/login/weixin-fast-login.png"),
	  phonePng :require("@/common/images/login/phone-login.png"),
	  checked: false,
      weixinPng: require("@/common/images/login/weixin-fast-login.png"),
	  activeIcon: require("@/common/images/login/agree-checked.png"),
      inactiveIcon: require("@/common/images/login/agree-default.png")
    }
  },

  watch: {
  },

  computed: {
    ...mapGetters([
    ])
  },

  mounted () {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory()
      that.gotoURL(() => {
        pushHistory();
         this.$router.push({
            path: '/login'
          })
      });
    };
    // 监控键盘弹起
    let originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
    window.onresize = ()=> {
      let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
      if (resizeHeight < originalHeight) {
        return (()=>{
          this.$refs['bgIconWrapper'].style.cssspan='flex:none;height:220px'
        })()
      } else {
        this.$refs['bgIconWrapper'].style.cssspan='flex:1;height:0'
      }
    };
  },

  methods: {
    ...mapMutations([
      'storeUserInfo',
      'changeTitleTxt',
      'changeOverDueWay'
    ]),
	//其它方式登录
	otherAuthEvent () {
		this.$router.push({path:'/home'})
	},
    // 验证码
    weixinLogin () {
      this.$router.push({path:'/verificationCode'})
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
	/deep/ .van-nav-bar {
		.van-icon {
			color: #fff !important;
			font-size: 18px !important
		}
	};
    background: @color-background;
		.content-top {
			height: 40vh;
			line-height: 40vh;
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
			.send-auth-box {
				height: 50px;
				border-radius: 30px;
				font-size: 18px;
				background: #ffbd40;
				margin: 30px 0;
				text-align: center;
				line-height: 50px;
				display: flex;
				flex-flow: row nowrap;
				color: #1e1d1c;
				justify-content: center;
				align-items: center;
				img {
					margin-right: 8px;
					width: 30px;
					height: 25px
				}
			};
			.tip-info {
				font-size: 12px;
				text-align: center;
				/deep/ .van-checkbox {
					justify-content: center;
					.van-checkbox__icon {
						img {
							width: 17px;
							height: 17px
						}
					};
					.van-checkbox__label {
						>span {
							&:nth-child(1) {
								color: #686868
							};
							&:nth-child(2) {
								color: #FFFFFF
							};
							&:nth-child(3) {
								color: #686868
							};
							&:nth-child(4) {
								color: #FFFFFF
							};
						}
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
					height: 44px;
					border-radius: 50%;
					img {
						width: 100%;
						height: 100%;
						border-radius: 50%;
					}
				}
			}
		}
  }
</style>
