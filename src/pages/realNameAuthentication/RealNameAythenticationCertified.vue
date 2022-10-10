<template>
  <div class="page-box" id="top-content">
    <NavBar title="实名认证" path="accountSecurity" />
    <div class="content-box">
      <div class="content-top">
        <img :src="realNameAuthenticationPng" alt="">
        <span>您 已 经 通 过 实 名 认 证</span>
      </div>
      <div class="content-bottom">
        <van-field
          readonly
          v-model="realNameValue"
          label="姓名"
          :border="false"
        />
        <van-field
          readonly
          v-model="phoneNumber"
          type="tel"
          label="手机号"
          :border="false"
        />
        <van-field
        readonly
        v-model="cardValue"
        label="证件号"
        :border="false"
        />
      </div>
    </div>
  </div>
</template>
<script>
  import NavBar from '@/components/NavBar'
  import NoData from '@/components/NoData'
  import Loading from '@/components/Loading'
  import { mapGetters, mapMutations } from 'vuex'
  import { IsPC } from '@/common/js/utils'
  export default {
    name: 'RealNameAythenticationCertified',
    components:{
      NoData,
      Loading,
	  NavBar
    },
    data() {
      return {
        realNameValue: '',
        phoneNumber: '',
        cardValue: '',
        defaultPersonPng :require("@/common/images/home/default-person.png"),
        realNameAuthenticationPng :require("@/common/images/login/real-name-authentication.png")
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
						path: '/accountSecurity'
					})
        })
      };
      this.phoneNumber = this.userInfo.mobile;
      this.cardValue = this.userInfo.idCard;
      this.realNameValue = this.userInfo.name
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
        'changeTitleTxt'
      ]),

      //让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},

      //账号注销事件
      cancellationEvent () {
        this.$router.push({path: '/'})
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
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 12px;
        img {
          width: 60px
        };
        >span {
          margin-top: 20px
        }
      };
      .content-bottom {
        flex: 1;
        position: relative;
        display: flex;
        flex-direction: column;
        width: 92%;
        margin: 0 auto;
        margin-top: 20px;
        padding: 6px;
        box-sizing: border-box;
        /deep/ .van-cell {
          margin-bottom: 8px;
          background: @color-block;
          height: 55px;
          border: 1px solid #2c2c2c;
          border-radius: 10px;
          .van-cell__value {
            display: flex;
            flex-flow: column;
            justify-content: center;
          };
          .van-field__label {
            color: #fff
          }; 
          .van-cell__title {
            display: flex;
            flex-flow: column;
            justify-content: center;
          };
          .van-field__control {
            color: #b1b1b1!important;
            text-align: right
          }
        }
      }
    }
  }
</style>
