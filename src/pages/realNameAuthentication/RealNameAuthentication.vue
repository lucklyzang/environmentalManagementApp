<template>
  <div class="page-box" id="top-content">
    <NavBar title="实名认证" :path="path" />
    <div class="content-box">
      <van-loading type="spinner" v-show="loadingShow">认证中...</van-loading>
      <van-overlay :show="isShowOverlay"/>
      <div class="content-top">
        <van-field
            v-model="realNameValue"
            @blur="realNameChangeEvent"
            placeholder="真实姓名"
            :border="false"
        />
            <van-field
            v-model="cardValue"
            @blur="cardChangeEvent"
            placeholder="证件号码"
            :border="false"
        />
      </div>
      <div class="freeze-info" v-show="userInfo.realFlag == -1">
        认证的身份证号开立账户已达2用户上线,请重新认证
      </div>
      <div class="content-bottom" @click="cancellationEvent">
        <span>开始认证</span>
      </div>
    </div>
  </div>
</template>
<script>
  import NavBar from '@/components/NavBar'
  import {realNameArenhzneuthentication,inquareUserInfo} from '@/api/products.js'
  import { mapGetters, mapMutations } from 'vuex'
  import {IsPC} from '@/common/js/utils'
  export default {
    name: 'RealNameAuthentication',
    components:{
	    NavBar
    },
    data() {
      return {
        loadingShow: false,
        isShowOverlay: false,
        phoneRealNameUsable: false,
        phoneCardUsable: false,
        isDisabled: false,
        timer: null,
        realNameValue: '',
        cardValue: '',
        path: ''
      }
    },

     beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.path = from.path
      })
    },

    mounted() {
      this.toTop();
      // 控制设备物理返回按键
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          pushHistory();
					this.$router.push({
						path: this.path
					})
        })
      }
    },

    beforeDestroy() {
      if(this.timer) { 
        clearTimeout(this.timer)
      }
    },

    watch: {
    },

    computed:{
      ...mapGetters([
        'userInfo'
      ])
    },

    methods:{
      ...mapMutations([
        'storeUserInfo'
      ]),

      //让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},

      juddgeIspc () {
        return IsPC()
      },

      //姓名输入框值变化事件
      realNameChangeEvent (event) {
        let regName = /^[\u4e00-\u9fa5][\u4e00-\u9fa5]{1,5}$/;
        if (!regName.test(this.realNameValue)) {
          this.phoneRealNameUsable = false;
          if (this.realNameValue) {
            this.$toast({
              message: '姓名格式格式有误,请重新输入!',
              position: 'bottom'
            })
          }  
        } else {
          this.phoneRealNameUsable = true
        }
      },
      
      //身份证号输入框值变化事件
      cardChangeEvent (event) {
        let regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!regIdCard.test(this.cardValue)) {
          this.phoneCardUsable = false;
          if (this.cardValue) {
            this.$toast({
              message: '身份证格式格式有误,请重新输入!',
              position: 'bottom'
            })
          }  
        } else {
          this.phoneCardUsable = true
        }
      },

      //实名认证事件
      cancellationEvent () {
         if (!this.realNameValue || !this.cardValue) {
           this.$toast({
            message: '身份证或姓名不能为空!',
            position: 'bottom'
          });
          return
        };
        if (!this.phoneCardUsable || !this.phoneRealNameUsable) {
           this.$toast({
            message: '身份证或姓名格式有误,请重新输入!',
            position: 'bottom'
          });
          return
        };
        if(this.isDisabled) return;
        this.isDisabled = !this.isDisabled;
        this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
        this.loadingShow = true;
        this.isShowOverlay = true;
        realNameArenhzneuthentication({name: this.realNameValue, idCard: this.cardValue}).then((res) => {
            this.loadingShow = false;
            this.isShowOverlay = false;
            if (res && res.data.code == 0) {
              this.queryuserInfo();
              this.$toast({
                message: '实名认证成功',
                position: 'bottom'
              })
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

      // 查询用户信息
      queryuserInfo() {
          inquareUserInfo().then((res) => {
            if (res && res.data.code == 0) {
              this.storeUserInfo(res.data.data);
              this.$router.push({
                path: `${this.path}`
              })
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
          position: relative;
          display: flex;
          flex-direction: column;
                width: 92%;
          margin: 0 auto;
          padding: 6px;
          box-sizing: border-box;
          /deep/ .van-cell {
            margin-top: 20px;
            background: @color-block;
            height: 55px;
            border: 1px solid #382057;
            border-radius: 10px;
            .van-field__value {
              display: flex;
              flex-flow: column;
              justify-content: center;
            };
            .van-cell__value--alone {
              color: #251e35
            };
            .van-cell__title {
              display: flex;
              flex-flow: column;
              justify-content: center;
            };
            .van-field__control {
              color: #b1b1b1 !important
            } 
          }
        };
        .freeze-info {
          width: 92%;
          margin: 0 auto;
          height: 20px;
          line-height: 20px;
          text-align: center;
          color: #444444;
          font-size: 12px
        };
        .content-bottom {
            width: 92%;
			margin: 0 auto;
			border-radius: 10px;
      margin-top: 100px;
            box-sizing: border-box;
            padding: 6px;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            height: 55px;
            background: @color-block;
            color: #ffbc41;
            font-size: 15px;
        }
    }
  }
</style>
