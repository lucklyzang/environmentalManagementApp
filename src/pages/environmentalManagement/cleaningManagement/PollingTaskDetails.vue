<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
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
            <van-icon v-show="cleanTaskDetails.state == 3 && cleanTaskDetails['ratioMap']['finish'] != cleanTaskDetails['ratioMap']['all']" name="scan" size="23" color="#101010" @click="scanQRCode" />
            <van-icon v-show="cleanTaskDetails.state != 3" name="records" size="23" color="#101010" @click="editReasonEvent"/>
        </template>
    </van-nav-bar>
    </div>
    <div class="content">
      <van-empty v-show="emptyShow" description="暂无数据" />
      <div class="time-tab">
        <span v-for="(item,index) in timeTabList" :key="index" :class="{'tabStyle': currentTabIndex == index}" @click="tabEvent(item,index)">{{ item }}</span>
      </div>
      <div class="departments-name-list" v-for="(item,index) in currentDepartmentsNameList" :key="index">
          <div class="departments-name-left">
              {{ item['depName'] }}
          </div>
          <div class="departments-name-right" @click="departmentClickEvent(item)">
              <span>{{ item['flag'] == 0 ? '未扫码' : '已扫码' }}</span>
              <van-icon name="arrow" color="red" size="24" />
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSinglePollingTaskMessage } from "@/api/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "PollingTaskDetails",
  components: {
  },
  data() {
    return {
      currentTabIndex: 0,
      emptyShow: false,
      loadingShow: false,
      overlayShow: false,
      timeTabList: [],
      departmentsNameList: [],
      currentDepartmentsNameList: []
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
    this.getPollingTaskDetails();
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
    ...mapGetters(["userInfo","pollingTaskDepartmentMessage","cleanTaskDetails"]),
  },

  methods: {
    ...mapMutations(['storePollingTaskDepartmentMessage']),
    onClickLeft() {
      this.$router.push({ path: "/cleaningTask"})
    },

    // 时间tab点击事件
    tabEvent (item,index) {
      this.currentTabIndex = index;
      this.currentDepartmentsNameList = this.departmentsNameList.filter((innerItem) => { return innerItem['startTime'] == item })[0]['spaces']
    },

    // 编辑原因事件
    editReasonEvent () {
      this.$router.push({
        path: "/pollingTaskNoCompleteReason"
      })
    },

    // 扫描二维码方法
    scanQRCode (item) {
      window.android.scanQRcode()
    },

    // 摄像头取消扫码后的回调
    scanQRcodeCallbackCanceled () {
      this.$router.push({
        path: "/cleaningTask"
      })
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        let codeData = code.split('|');
        try {
          if (codeData.length > 0) {
            let temporaryPollingTaskDepartmentMessage = this.pollingTaskDepartmentMessage;
            temporaryPollingTaskDepartmentMessage['intoWay'] = 1;
            temporaryPollingTaskDepartmentMessage['depId'] = codeData[0];
            temporaryPollingTaskDepartmentMessage['depName'] = this.currentDepartmentsNameList.filter((innerItem) => { return innerItem['depId'] == depId })[0]['depName'];
            this.storePollingTaskDepartmentMessage(temporaryPollingTaskDepartmentMessage);
            this.$router.push({
              path: "/pollingTaskDepartmentDetails"
            })
          }
        } catch (err) {
          this.$toast({
            message: `${err}`,
            type: 'fail'
          })
        }  
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.scanQRCode()
        });
      }
    },

    // 科室点击事件
    departmentClickEvent (item) {
      // 0-未扫码，1-已扫码
      if (item.flag == 1) {
        let temporaryPollingTaskDepartmentMessage = item;
        temporaryPollingTaskDepartmentMessage['intoWay'] = 2;
        this.storePollingTaskDepartmentMessage(item)
        this.$router.push({
          path: "/pollingTaskDepartmentDetails"
        })
      }
    },

    // 获取任务详情
    getPollingTaskDetails () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.emptyShow = false;
      getSinglePollingTaskMessage()
      .then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        if (res && res.data.code == 200) {
            if (res.data.data.length == 0) {
              this.emptyShow = true
            } else {
              this.departmentsNameList = res.data.data;
              for (let item of res.data.data) {
                this.timeTabList.push(item['startTime'])
              }
            }
          } else {
            this.$toast({
              message: `${res.data.msg}`,
              type: 'fail'
            })
          }
        })
        .catch((err) => {
          this.$toast({
              message: `${err}`,
              type: 'fail'
          });
          this.loadingShow = false;
          this.overlayShow = false
        })
    }
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
  /deep/ .van-loading {
    z-index: 1000000
  };
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
    padding: 0 6px 6px 6px;
    box-sizing: border-box;
    position: relative;
    /deep/ .van-empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%)
    };
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
    };
    .time-tab {
      width: 100%;
      padding: 6px 0;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      overflow-x: scroll;
      white-space: nowrap;
      &::-webkit-scrollbar {
        height: 0;
        display: none
      };
      >span {
        flex: none;
        display: inline-block;
        width: 70px;
        font-size: 14px;
        color: #101010
      };
      .tabStyle {
        color: #289E8E !important
      }
    }
  }
}
</style>