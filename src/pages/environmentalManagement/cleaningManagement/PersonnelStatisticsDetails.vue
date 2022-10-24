<template>
  <div class="page-box">
    <div class="nav">
       <van-nav-bar
        title="统计详情"
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
    <div class="content">
       <div class="data-sources-box">
           <span>数据来源</span>
           <span>
               {{ personnelStatisticsDetailsMessage.personName }}
           </span>
       </div>
       <div class="data-content">
           <div class="data-content-top">
                <div class="attendance-status-list" v-for="(item,index) in attendanceStatusList"
                    :key="index"
                    :class="{'attendanceStyle': index == 0,'clockingStyle': index == 1,
                        'expatriateStyle': index == 2,'occupationalInjuryStyle': index == 3, 'sickLeaveStyle': index == 4, 'vocationStyle': index == 5,
                        'affairsStyle': index == 6,'overtimeStyle': index == 7, 'changeShiftStyle': index == 8, 'absenteeismStyle': index == 9
                    }"
                >
                    <span>{{ `${item.attendanceType}` }}</span>
                    <span>{{`${item.duration}天`}}</span>
                </div> 
           </div>
           <div class="data-content-bottom">
               <van-calendar v-model="calendarShow" 
                    :min-date="minDate" 
                    :max-date="maxDate" 
                    :poppable="false"
                    :show-confirm="false"
                    :show-mark="false"
                    :show-title="false" 
                    @select="selectDateEvent"
                />
           </div>
       </div>
       <div class="attendance-message-box">
           <div class="date-box">
               2022-09-23
           </div>
           <div class="attendance-condition">
               <div class="attendance-condition-left">考勤情况</div>
               <div class="attendance-condition-right">
                   <div class="forenoon-attendance">
                       <span>上午</span>
                       <span>出勤</span>
                   </div>
                   <div class="afternoon-attendance">
                       <span>下午</span>
                       <span>出勤</span>
                   </div>
               </div>
           </div>
           <div class="attendance-condition">
               <div class="attendance-condition-left">打卡时间</div>
               <div class="attendance-condition-right">
                   <div class="forenoon-attendance">
                       <span>上午</span>
                       <span>9:00</span>
                   </div>
                   <div class="afternoon-attendance">
                       <span>下午</span>
                       <span>6:00</span>
                   </div>
               </div>
           </div>
       </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "PersonnelStatisticsDetails",
  components: {
    NavBar,
  },
  data() {
    return {
        calendarShow: true,
        minDate: new Date(2022, 9, 1),
        maxDate: new Date(2022, 9, 31),
        attendanceStatusList: [
            {attendanceType:'出勤', duration: 13.4},
            {attendanceType:'迟到早退', duration: 13},
            {attendanceType: '外派', duration: 1},
            {attendanceType:'工伤', duration: 3},
            {attendanceType: '病假', duration: 6},
            {attendanceType: '休假', duration: 4},
            {attendanceType: '事假', duration: 2},
            {attendanceType: '加班', duration: 8},
            {attendanceType: '调班', duration: 4},
            {attendanceType: '旷工', duration: 2}
        ]
    }
  },


  watch: {
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/attendanceStatistics"
        })
      })
    };
    console.log(this.personnelStatisticsDetailsMessage);
  },

  computed: {
    ...mapGetters(["userInfo","personnelStatisticsDetailsMessage"])
  },

  methods: {
    ...mapMutations([]),
    onClickLeft() {
      this.$router.push({ path: "/attendanceStatistics"})
    },

    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },

    // 日历选中日期事件
    selectDateEvent (date) {
        console.log(this.formatDate(date))
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
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .data-sources-box {
        height: 42px;
        line-height: 42px;
        background: #fff;
        padding-left: 10px;
        box-sizing: border-box;
        margin: 10px 0;
        >span {
            font-size: 14px;
            &:nth-child(1) {
                color: #666666;
                margin-right: 8px
            };
            &:nth-child(2) {
                color: #101010;
                font-weight: bold
            }
        }
    };
    .data-content {
        padding: 10px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;
        .data-content-top {
            width: 92%;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            .attendance-status-list {
                font-size: 14px;
                width: 33.3%;
                margin-bottom: 4px;
                height: 30px;
                text-align: left;
                line-height: 30px;
                border-radius: 4px;
                box-sizing: border-box;
                &:nth-child(3n) {
                    text-align: right
                };
                >span {
                    &:nth-child(1) {
                        margin-right: 10px
                    }
                }
            };
            .attendanceStyle {
                color: #289E8E
            };
            .clockingStyle {
                color: #E86F50
            };
            .expatriateStyle {
                color: #174E97
            };
            .occupationalInjuryStyle {
                color: #E8CB51
            };
            .sickLeaveStyle {
                color: #101010
            };
            .vocationStyle {
                color: #254550
            };
            .affairsStyle  {
                color: #3B9DF9
            };
            .overtimeStyle  {
                color: #F2A15F
            };
            .changeShiftStyle {
                color: #1864FF
            };
            .absenteeismStyle {
                color: #666666
            }
            
        };
        .data-content-bottom {
            flex: 1;
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            /deep/ .van-calendar {
                .van-calendar__header {
                    box-shadow: none !important;
                    background: #F4F5F7 !important
                };
                .van-calendar__body {
                    .van-calendar__month {
                        .van-calendar__days {
                            .van-calendar__day {
                                height: 35px !important;
                                .van-calendar__selected-day {
                                   height: 35px !important;
                                   box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.23);
                                   background: #289E8E !important 
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    .attendance-message-box {
        background: #fff;
        padding: 20px 10px;
        box-sizing: border-box;
        margin-top: 10px;
        .date-box {
            font-size: 14px;
            color: #1864FF
        };
        .attendance-condition {
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .attendance-condition-left {
                font-size: 14px;
                color: #101010
            };
            .attendance-condition-right {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                .forenoon-attendance {
                    padding-right: 16px;
                    box-sizing: border-box;
                    border-right: 1px solid #101010;
                    >span {
                        font-size: 14px;
                        &:nth-child(1) {
                            color: #101010;
                            margin-right: 6px;
                        };
                        &:nth-child(2) {
                            color: #289E8E
                        }
                    }
                };
                .afternoon-attendance {
                    padding-left: 16px;
                    box-sizing: border-box;
                    >span {
                    font-size: 14px;
                    &:nth-child(1) {
                        color: #101010;
                        margin-right: 6px;
                    };
                    &:nth-child(2) {
                        color: #289E8E
                    }
                }
                }
            };
            position: relative;
            &:before {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height:1px;
                background-color: #cccaca;
                transform: scaleY(0.5)
            }
        }
    } 
  }
}
</style>