<template>
  <div class="page-box" id="top-content">
    <NavBar title="账号与安全" path="myInfo" />
    <div class="content-box">
      <div class="content-top">
      	<div class="nick-name">
			<div class="left">
				<span>手机号</span>
			</div>
			<div class="right">
        <span>{{userInfo.mobile}}</span>
        <img :src="arrowRightPng" alt="">
			</div>
		</div>
    <div class="nick-name" @click="realNameAuthenticationEvent">
			<div class="left">
				<span>实名认证</span>
			</div>
			<div class="right">
        <van-icon name="passed" size="18" color="#39ef39" v-show="userInfo.realFlag == 1"/>
        <span>{{userInfo.realFlag == 1 ? '已认证' : '去认证'}}</span>
        <img :src="arrowRightPng" alt="">
			</div>
		</div>
      </div>
      <div class="content-bottom" @click="toCancelAccountPageEvent">
        <span>账号注销</span>
      </div>
    </div>
  </div>
</template>
<script>
  import NavBar from '@/components/NavBar'
  import {inquareUserInfo} from '@/api/products.js'
  import { mapGetters, mapMutations } from 'vuex'
  import {IsPC} from '@/common/js/utils'
  export default {
    name: 'AccountSecurity',
    components:{
	    NavBar
    },
    data() {
      return {
        defaultPersonPng: require("@/common/images/home/default-person.png"),
        arrowRightPng: require("@/common/images/login/arrow-right.png")
      }
    },

    mounted() {
      this.toTop();
      // 控制设备物理返回按键
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          pushHistory();
          this.$router.push({
            path: '/myInfo'
          })
        })
      };
      this.queryuserInfo()
    },

    watch: {
    },

    computed:{
      ...mapGetters([
        'userInfo'
      ])
    },

    beforeRouteEnter (to, from, next) {
      next()
    },

    beforeRouteLeave (to, from, next) {
      next()
    },

    methods:{
      ...mapMutations([
        'storeUserInfo'
      ]),

      //让页面滚动到顶部
      toTop() {
          document.querySelector('#top-content').scrollIntoView(true)
      },

      //实名认证事件
      realNameAuthenticationEvent () {
        // 未认证
        if (this.userInfo.realFlag != 1) {
          this.$router.push({path: '/realNameAuthentication'})
        } else {
          //已认证
          this.$router.push({path: '/realNameAythenticationCertified'})
        }
      },

      // 查询用户信息
      queryuserInfo() {
        inquareUserInfo().then((res) => {
          if (res && res.data.code == 0) {
            this.storeUserInfo(res.data.data);
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

      //去往注销账号登录页事件
      toCancelAccountPageEvent () {
        this.$router.push({path: '/cancelAccount'})
      }
    }
  }
</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .page-box {
    .content-wrapper();
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
    .content-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background: @color-background;
		.content-top {
			height: 300px;
			font-size: 13px;
			position: relative;
			display: flex;
			flex-direction: column;
            width: 92%;
			margin: 0 auto;
			margin-top: 20px;
			padding: 6px;
            box-sizing: border-box;
            .nick-name {
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-between;
                align-items: center;
				height: 46px;
				padding: 6px 8px;
                background: @color-block;
                border-radius: 10px;
                margin-bottom: 10px;
				.left {
					font-size: 16px;
					color: #FFFFFF;
					display: flex;
                    flex-flow: row nowrap;
					justify-content: space-between;
                    >span {
                    }
				};
				.right {
                    display: flex;
                    flex-flow: row nowrap;
                    justify-content: space-between;
                    align-items: center;
                    span {
                       font-size: 14px;
                       color: #b1b1b1;
                       margin: 0 10px;
                    };
                    img {
                      width: 8px
                    }
				}
			}
		};
        .content-bottom {
            width: 92%;
			margin: 0 auto;
			border-radius: 10px;
            box-sizing: border-box;
            padding: 6px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            height: 55px;
            background: @color-block;
            color: #bd68ff;
            font-size: 18px;
        }
    }
  }
</style>
