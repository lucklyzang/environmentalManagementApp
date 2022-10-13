<template>
  <div class="page-box">
    <div class="nav">
       <van-nav-bar
        title="考勤录入"
        left-text="返回"
        right-text=""
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    />
    </div>
    <van-calendar v-model="calendarShow" @confirm="onConfirm" color="#1864FF" />
    <div class="content">
        <div class="content-top">
            <div class="filtrate-box">
                <div class="date-box">
                    <div class="date-content">
                        <span>{{ dateValue }}</span>
                        <img :src="calendarPng" alt="" @click="calendarShow = true" />
                    </div>
                </div>
                <div class="search-box">
                    <van-field
                        v-model="searchValue"
                        right-icon="search"
                        placeholder="搜索关键词"
                    />
                </div>
            </div>
        </div>
        <div class="content-bottom">
           <div class="person-attendance-status-list" v-for="(item,index) in personAttendanceStatusList" :key="index">
               <div class="person-name">{{ `${index + 1}、${item.personName}`}}</div>
               <div class="attendance-status">
                   <div class="attendance-status-left">
                       <div class="forenoon-status">
                           <span>上午</span>
                           <span>{{ item.forenoonStatus}}</span>
                       </div>
                       <div class="afternoon-status">
                           <span>下午</span>
                           <span>{{ item.afternoonStatus}}</span>
                       </div>    
                   </div>
                   <div class="attendance-status-right">
                       <van-icon name="arrow" size="25" />
                   </div>
               </div>
               <div class="clock-time">
                   <div class="forenoon-clock-time">
                       <span>上午打卡时间: </span>
                       <span>{{ item.forenoonClockTime }}</span>
                   </div>
                   <div class="afternoon-clock-time">
                       <span>下午打卡时间: </span>
                       <span>{{ item.afternoonClockTime }}</span>
                   </div>
               </div>
           </div>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn-area">
            批量处理
        </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/products.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "AttendanceManagement",
  components: {
    NavBar,
  },
  data() {
    return {
      searchValue: '',
      dateValue: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      calendarShow: false,
      calendarPng: require("@/common/images/home/calendar-attendance.png"),
      personAttendanceStatusList: [
        {
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
         {
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
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
    }
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
     formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.calendarShow = false;
      this.dateValue = this.formatDate(date);
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
    height: 0;
    .content-top {
        width: 92%;
        margin: 0 auto;
        padding: 10px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .filtrate-box {
            height: 32px;
            display: flex;
            justify-content: space-between;
            .date-box {
                height: 30px;
                background: #fff;
                display: flex;
                align-items: center;
                margin-right: 10px;
                .date-content {
                    width: 100%;
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
                        color: #101010;
                        margin-right: 10px
                    };
                    img {
                        width: 19px;
                        height: 19px
                    }
                }
            }
            .search-box {
                height: 32px;
                flex: 1;
                /deep/ .van-cell {
                    line-height: 30px !important;
                    background: #F4F5F7;
                    border-radius: 8px;
                    height: 30px;
                    padding: 0 10px !important;
                    .van-field__right-icon {
                        .van-icon {
                            font-size: 25px !important;
                            color: #0c6c8c !important
                        }
                    }
                }
            }    
        }
    };
    .content-bottom {
        width: 100%;
        background: #F8F8F8;
        flex: 1;
        padding: 10px 4px 0 4px;
        overflow: auto;
        box-sizing: border-box;
        .person-attendance-status-list {
            margin-bottom: 10px;
            border-radius: 4px;
            padding: 14px;
            background: #fff;
            box-sizing: border-box;
            box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
            .person-name {
                font-size: 16px;
                color: #101010;
                font-weight: bolder;
            };
            .attendance-status {
                width: 100%;
                display: flex;
                margin: 20px 0;
                justify-content: space-between;
                .attendance-status-left {
                    display: flex;
                    >div {
                        >span {
                            &:nth-child(1) {
                                font-size: 14px;
                                color: #9E9E9A
                            };
                            &:nth-child(2) {
                                font-size: 16px;
                                color: #174E97
                            }
                        };
                        &:first-child {
                            margin-right: 20px
                        }
                    }
                };
                .attendance-status-right {}
            };
            .clock-time {
                display: flex;
                >div {
                    >span {
                        font-size: 14px;
                        color: #9E9E9A
                    };
                    &:first-child {
                        margin-right: 20px
                    }
                }
            }
        }
    }
  };
  .btn-box {
        background: #F8F8F8;
        .btn-area {
            height: 48px;
            width: 266px;
            font-size: 18px;
            margin: 0 auto;
            line-height: 48px;
            background: linear-gradient(to right, #6cd2f8, #2390fe);
            box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
            color: #fff;
            border-radius: 30px;
            font-weight: bold;
            margin-top: 20px;
            margin-bottom: 20px;
            text-align: center
        }
 }
}
</style>