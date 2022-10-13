<template>
  <div class="page-box" ref="wrapper">
    <div class="nav">
       <van-nav-bar
        title="巡检任务详情"
        left-text="返回"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
        <template #right>
            <van-icon name="scan" size="26" color="#101010" @click="scanQRCode" />
        </template>
    </van-nav-bar>
    </div>
    <div class="content">
        <div class="departments-name-list" v-for="(item,index) in departmentsNameList" :key="index">
            <div class="departments-name-left">
                {{ item }}
            </div>
            <div class="departments-name-right" @click="scanQRCode">
                <span>未扫码</span>
                <van-icon name="arrow" color="red" size="24" />
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import {} from "@/api/products.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "PollingTaskDetails",
  components: {
  },
  data() {
    return {
        departmentsNameList: ['科室一','科室二','科室三','科室四','科室五','科室六']
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/cleaningTask"
        })
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    window['scanQRcodeCallbackCanceled'] = () => {
      me.scanQRcodeCallbackCanceled();
    };
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo"]),
  },

  methods: {
    ...mapMutations([]),
    onClickLeft() {
      this.$router.push({ path: "/cleaningTask"})
    },

    // 扫描二维码方法
    scanQRCode () {
      window.android.scanQRcode()
    },

    // 摄像头取消扫码后的回调
    scanQRcodeCallbackCanceled () {
        this.$router.push({
            path: "/cleaningTask"
        })
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {}
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  background: #F8F8F8;
  .content-wrapper();
  .nav {
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
            .van-nav-bar__text {
                color: black !important;
                margin-left: 8px !important;
            };
            .van-icon {
                color: black !important;
                font-size: 22px !important;
            }
        }
        .van-nav-bar__title {
            color: black !important;
            font-size: 16px !important;
        }
    }
  };
  /deep/ .van-popup {
    z-index: 30000 !important
  };  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 6px;
    box-sizing: border-box;
    .departments-name-list {
        width: 100%;
        padding: 6px 8px;
        height: 50px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .departments-name-left {
            flex: 1;
            font-size: 16px;
            color: #101010;
            padding-right: 8px;
            box-sizing: border-box;
            word-break: break-all
        };
        .departments-name-right {
            font-size: 14px;
            color: red;
            /deep/ .van-icon {
                vertical-align: middle
            };
            >span {
                vertical-align: middle
            }
        };
        .departmentsNameRightStyle {
            color: green !important
        }
    }
  }
}
</style>