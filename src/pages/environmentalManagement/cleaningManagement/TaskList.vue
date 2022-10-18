<template>
  <div class="page-box" ref="wrapper">
    <div class="nav">
      <NavBar path="/home" title="任务列表" />
    </div>
    <van-calendar v-model="calendarShow" @confirm="onConfirm" color="#1864FF" />
    <div class="content">
      <div class="content-top-area">
			  <img :src="statusBackgroundPng" />
        <div class="content-top-content">
          <div class="content-top-content-title">
            <div class="content-top-content-title-left">
              <img :src="clockPng" alt="">
              <span>未完成任务</span>
            </div>
            <div class="content-top-content-title-right">
              <img :src="arrowRightPng" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="content-bottom-area">
        <div class="date-box" @click="calendarShow = true">
          <span>{{ dataValue }}</span>
          <img :src="calendarPng" alt="">
        </div>
        <div class="task-infobox">
          <div class="forthwith-cleaning-task">
            <div class="forthwith-cleaning-task-title">
              <div class="forthwith-cleaning-task-title-left">
                即时保洁任务
              </div>
              <div class="forthwith-cleaning-task-title-right" @click="taskDetailsEvent(1)">
                <span>详情</span>
                <van-icon name="arrow" color="#1864FF" size="24" />
              </div>
            </div>
            <div class="forthwith-cleaning-task-content">
              <div class="forthwith-cleaning-task-content-left">
                <div class="total">
                  <span>总数: </span>
                  <span>20</span>
                </div>
                <div class="execution">
                  <span>执行中: </span>
                  <span>20</span>
                </div>
                <div class="no-comolete">
                  <span>未完成: </span>
                  <span>20</span>
                </div>
              </div>
              <div class="forthwith-cleaning-task-content-right">
                <van-circle v-model="currentRate" :rate="60" :speed="100" :text="`${currentRate}%`" layer-color="#d0d0cc" :size="55" :stroke-width="160" />
                <div class="complete-info">
                  <span>已完成:</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </div>
          <div class="forthwith-cleaning-task special-cleaning-task">
            <div class="forthwith-cleaning-task-title">
              <div class="forthwith-cleaning-task-title-left">
                专项保洁任务
              </div>
              <div class="forthwith-cleaning-task-title-right" @click="taskDetailsEvent(2)">
                <span>详情</span>
                <van-icon name="arrow" color="#1864FF" size="24" />
              </div>
            </div>
            <div class="forthwith-cleaning-task-content">
              <div class="forthwith-cleaning-task-content-left">
                <div class="total">
                  <span>总数: </span>
                  <span>20</span>
                </div>
                <div class="execution">
                  <span>执行中: </span>
                  <span>20</span>
                </div>
                <div class="no-comolete">
                  <span>未完成: </span>
                  <span>20</span>
                </div>
              </div>
              <div class="forthwith-cleaning-task-content-right">
                <van-circle v-model="currentRate" :rate="50" :speed="100" :text="`${currentRate}%`" layer-color="#d0d0cc" :size="50" :stroke-width="160" />
                <div class="complete-info">
                  <span>已完成:</span>
                  <span>8</span>
                </div>
              </div>
            </div>
          </div>
          <div class="forthwith-cleaning-task polling-task">
            <div class="forthwith-cleaning-task-title">
              <div class="forthwith-cleaning-task-title-left">
                巡检任务
              </div>
              <div class="forthwith-cleaning-task-title-right" @click="taskDetailsEvent(3)">
                <span>详情</span>
                <van-icon name="arrow" color="#1864FF" size="24" />
              </div>
            </div>
            <div class="forthwith-cleaning-task-content">
              <div class="forthwith-cleaning-task-content-left">
                <div class="total">
                  <span>总数: </span>
                  <span>20</span>
                </div>
                <div class="execution">
                  <span>执行中: </span>
                  <span>20</span>
                </div>
                <div class="no-comolete">
                  <span>未完成: </span>
                  <span>20</span>
                </div>
              </div>
              <div class="forthwith-cleaning-task-content-right">
                <van-circle v-model="currentRate" :rate="50" :text="`${currentRate}%`" :speed="100" layer-color="#d0d0cc" :size="50" :stroke-width="160" />
                <div class="complete-info">
                  <span>已完成:</span>
                  <span>8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
		  </div>
    </div>
    <div class="add-task-png-box" @click="addTaskEvent">
      <img :src="addTaskPng" alt="">
    </div>
    <FooterBottom></FooterBottom>  
  </div>
</template>
<script>
import FooterBottom from "@/components/FooterBottom";
import NavBar from "@/components/NavBar";
import {} from "@/api/products.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "CleaningTaskList",
  components: {
    FooterBottom,
    NavBar,
  },
  data() {
    return {
      dataValue: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      currentRate: 0,
      calendarShow: false,
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      clockPng: require("@/common/images/home/clock.png"),
      addTaskPng: require("@/common/images/home/add-task.png"),
      calendarPng: require("@/common/images/home/calendar.png"),
      arrowRightPng: require("@/common/images/home/arrow-right.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/home",
        })
      })
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo"]),
  },

  methods: {
    ...mapMutations(["changeIsLogin","storeCurrentCleanTaskName"]),
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },

    onConfirm(date) {
      this.calendarShow = false;
      this.dataValue = this.formatDate(date);
    },

    // 任务详情事件
    taskDetailsEvent (num) {
      this.storeCurrentCleanTaskName(num);
      this.$router.push({path: '/cleaningTask'})
    },

    // 新增任务事件
    addTaskEvent () {
      this.$router.push({path: '/addTask'})
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
        .van-nav-bar__text {
            color: #fff !important;
            margin-left: 8px !important;
        }
        }
        .van-icon {
        color: #fff !important;
        font-size: 22px !important;
        }
        .van-nav-bar__title {
        color: #fff !important;
        font-size: 16px !important;
        }
    }
  };
  /deep/ .van-popup {
    z-index: 30000 !important
  };
  .add-task-png-box {
    position: fixed;
    width: 63px;
    height: 63px;
    bottom: 60px;
    right: 10px;
    z-index: 1000;
    >img {
        width:100%;
        height: 100%
    }
  }  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .content-top-area {
      position: relative;
      width: 100%;
      margin: 0 auto;
      height: 240px;
      > img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .content-top-content {
        margin: 0 auto;
        width: 94%;
        height: 52px;
        margin-top: 60px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .content-top-content-title {
          padding: 0 20px;
          box-sizing: border-box;
          background: #fff;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .content-top-content-title-left {
            >img {
              width: 24px;
              height: 24px;
              vertical-align: middle
            };
            >span {
              font-size: 18px;
              color: #417AEC;
              margin-left: 10px;
              vertical-align: middle
            }
          };
          .content-top-content-title-right {
            >img {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
    .content-bottom-area {
      flex: 1;
      overflow: auto;
      margin: 0 auto;
      background: #F8F8F8;
      margin-top: -100px;
      box-sizing: border-box;
      z-index: 1000;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      width: 100%;
      .date-box {
        width: 90%;
        margin: 0 auto;
        height: 40px;
        display: flex;
        align-items: center;
        >span {
          font-size: 14px;
          color: #1864FF;
          vertical-align: middle
        };
        >img {
          margin-left: 10px;
          width: 18px;
          height: 18px;
          vertical-align: middle
        }
      };
      .task-infobox {
        width: 96%;
        margin: 0 auto;
        flex: 1;
        overflow: auto;
        .forthwith-cleaning-task {
          width: 100%;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
          padding: 0 0 8px 0;
          box-sizing: border-box;
          .forthwith-cleaning-task-title {
            .bottom-border-1px(rgba(0, 0, 0, 0.23));
            width: 96%;
            box-sizing: border-box;
            margin: 0 auto;
            height: 44px;
            align-items: center;
            display: flex;
            padding: 0 6px;
            justify-content: space-between;
            .forthwith-cleaning-task-title-left {
              font-size: 18px;
              color: #289E8E
            };
            .forthwith-cleaning-task-title-right {
              margin-right: -10px;
              >span {
                vertical-align: middle;
                font-size: 18px;
                color: #1864FF
              };
              /deep/ .van-icon {
                vertical-align: middle
              }
            }
          };
          .forthwith-cleaning-task-content {
            width: 100%;
            padding-left: 14px;
            box-sizing: border-box;
            margin: 0 auto;
            height: 113px;
            align-items: center;
            display: flex;
            justify-content: space-between;
            .forthwith-cleaning-task-content-left {
              width: 50%;
              height: 90px;
              border-right: 1px solid #dadada;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 10px 0;
              box-sizing: border-box;
              >div {
                span {
                  font-size: 16px;
                  &:first-child {
                    color: #9E9E9A
                  };
                  &:last-child {
                    color: #333
                  }
                }
              }
            };
            .forthwith-cleaning-task-content-right {
              width: 50%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 10px 0;
              box-sizing: border-box;
              .complete-info {
                margin-top: 20px;
                span {
                  font-size: 14px;
                  &:first-child {
                    color: #9E9E9A
                  };
                  &:last-child {
                    color: #1864FF
                  }
                }
              };
              /deep/ .van-circle {
                .van-circle__text {
                  color: #1864FF
                }
              }
            }
          };
        };
        .special-cleaning-task {
          margin: 14px 0;
          .forthwith-cleaning-task-title-left {
            color: #174E97 !important
          }
        };
        .polling-task {
          .forthwith-cleaning-task-title-left {
            color: #E86F50 !important
          }
        }
      }
    }
  }
}
</style>