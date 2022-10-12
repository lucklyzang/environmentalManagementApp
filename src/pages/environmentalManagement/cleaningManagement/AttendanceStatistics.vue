<template>
  <div class="page-box" ref="wrapper">
    <div class="nav">
       <van-nav-bar
        title="考勤统计"
        left-text="返回"
        right-text="考勤录入"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
        @click-right="onClickRight"
    />
    </div>
    <van-calendar v-model="calendarShow" @confirm="onConfirm" color="#1864FF" />
    <div class="content">
        <div class="content-top">
            <div class="statistical-type-list-box">
                <div class="statistical-type-list" :class="{'statisticalTypeListStyle': statisticalTypeIndex == index}" v-for="(item,index) in statisticalTypeList" :key="index" @click="statisticalTypeEvent(item,index)">
                    {{ item }}
                </div>
            </div>    
           <div class="date-box">
               <div class="date-content">
                    <span>{{ dateValue }}</span>
                    <img :src="calendarPng" alt="" @click="calendarShow = true" />
               </div>
           </div>
        </div>
        <div class="content-center">
            <van-circle v-model="currentRate" :rate="50" :speed="100" layer-color="#d0d0cc" :size="130" :stroke-width="50">
               <template #default>
                    <div>0/0</div>
                    <div>打卡人数/出勤人数</div>
               </template>
            </van-circle>
            <div class="circle-explain">
                出勤人数=出勤人数-迟到早退人数 (当天考勤)
            </div>
            <div class="attendance-status-list-box">
                <div class="attendance-status-list" v-for="(item,index) in attendanceStatusList" :key="index">
                    {{item}}
                </div> 
            </div>
        </div>
        <div class="cotent-bottom">
            <van-tabs v-model="activeObjectName" color="#174E97" sticky>
                <van-tab title="出勤" name="attendance">
                   <div class="attendance-situation-list" v-for="(item,index) in attendanceSituationList" :key="index">
                    <div class="attendance-situation-left">
                        {{ item.name}}
                    </div>
                    <div class="attendance-situation-right">
                        <span>出勤:</span>
                        <span>{{ item.attendanceStatistics}}</span>
                    </div>
                   </div>
                </van-tab>
                <van-tab title="外派" name="expatriate"></van-tab>
            </van-tabs>
        </div>
    </div>
    <FooterBottom></FooterBottom>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/products.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
import FooterBottom from '@/components/FooterBottom'
export default {
  name: "AttendanceStatistics",
  components: {
    NavBar,
    FooterBottom
  },
  data() {
    return {
      activeObjectName: 'attendance',
      currentRate: 50,
      statisticalTypeIndex: 0,
      dateValue: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      calendarShow: false,
      calendarPng: require("@/common/images/home/calendar-attendance.png"),
      statisticalTypeList: ['日统计','月统计','人员统计'],
      attendanceStatusList: ['出勤','公休','外派','事假','病假','加班','年假','工伤','迟到早退','节休'],
      attendanceSituationList: [
          {
            name: '张三',
            attendanceStatistics: '上午、下午'
          },
          {
            name: '李四',
            attendanceStatistics: '上午、下午'
          },
          {
            name: '王五',
            attendanceStatistics: '上午'
          }
      ]
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/home"
        })
      })
    };
    this.itemNameIndex = this.currentCleanTaskName
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo"]),
  },

  methods: {
    ...mapMutations([]),
    onClickLeft() {
      this.$router.push({ path: "/home"})
    },

    onClickRight () {
        console.log('刷新了')
    },

    // 统计类型点击事件
    statisticalTypeEvent (item,index) {
        this.statisticalTypeIndex = index
    },

    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.calendarShow = false;
      this.dateValue = this.formatDate(date);
    },
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
        }
        }
        .van-icon {
        color: black !important;
        font-size: 22px !important;
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
    .content-top {
        width: 100%;
        margin: 0 auto;
        .statistical-type-list-box {
            height: 40px;
            width: 96%;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .statistical-type-list {
                flex: 1;
                height: 30px;
                text-align: center;
                line-height: 30px;
                font-size: 12px;
                color: #9E9E9A
            };
            .statisticalTypeListStyle {
                background: #fff !important;
                border-radius: 8px !important;
                color: #174E97 !important
            }
        }    
        .date-box {
            width: 100%;
            height: 40px;
            background: #fff;
            display: flex;
            align-items: center;
            .date-content {
                width: 96%;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 30px;
                background: #F4F5F7;
                padding: 0 10px;
                box-sizing: border-box;
                border-radius: 8px;
                > span {
                    font-size: 14px;
                    color: #101010
                };
                img {
                    width: 19px;
                    height: 19px
                }
            }
        }
    };
    .content-center {
        width: 96%;
        padding: 6px 10px;
        margin: 0 auto;
        border-radius: 6px;
        margin-top: 10px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /deep/ .van-circle {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >div {
                font-size: 10px;
                color: #101010;
                margin-top: 12px
            }
        };
        .circle-explain {
            font-size: 12px;
            color: #d0d0cc;
            margin-top: 15px
        };
        .attendance-status-list-box {
            width: 96%;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            margin-top: 15px;
            .attendance-status-list {
                font-size: 14px;
                width: 32%;
                margin-right: 2%;
                margin-bottom: 10px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                border-radius: 4px;
                border: 1px solid #dfdddd;
                box-sizing: border-box;
                &:nth-child(3n) {
                    margin-right: 0
                }
            }
        }
    };
    .cotent-bottom {
        background: #fff;
        margin-top: 10px;
        width: 100%;
        /deep/ .van-tabs {
            .van-tabs__nav {
                .van-tab {
                    color: #d0d0cc !important
                };
                .van-tab--active {
                    color: #174E97 !important
                }
            };
            .van-tabs__content {
                .attendance-situation-list {
                    height: 40px;
                    color: #5f5f5f;
                    display: flex;
                    font-size: 14px;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px;
                    box-sizing: border-box;
                    .attendance-situation-left {
                        width: 50%;
                    };
                    .attendance-situation-right {
                        width: 50%;
                        text-align: right;
                        >span {
                            &:first-child {
                                color: #101010;
                            };
                            &:last-child {}
                        }
                    };
                    &:nth-child(even) {
                        background: #F8F8F8
                    }
                }
            }
        }
    }
  }
}
</style>