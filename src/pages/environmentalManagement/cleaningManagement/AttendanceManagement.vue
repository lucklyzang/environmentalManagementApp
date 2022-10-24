<template>
  <div class="page-box">
    <van-dialog v-model="attendanceDialogShow" width="98%" show-cancel-button 
            confirm-button-color="#2390fe"
            @confirm="attendanceDialogSure"
            @cancel="attendanceDialogCancel"
        >
        <div class="dialog-top">
            <div class="select-title">选择上午考勤</div>
            <van-radio-group @change="forenoonAttendanceRadioChange" v-model="forenoonAttendanceRadioValue" direction="horizontal">
                <van-radio :name="item.value" checked-color="#1864FF" v-for="(item) in forenoonAttendanceTypeList" :key="item.name">{{ item.name }}</van-radio>
            </van-radio-group>
            <div class="change-shift-box" v-show="isShowForenoonChangeShiftBox">
                <div class="change-shift-box-top">
                    <div class="change-shift-box-top-left">
                        <span>*</span>
                        <span>替班人</span>
                    </div>
                    <div class="change-shift-box-top-right">
                        <van-dropdown-menu z-index="40000" active-color="#1864FF">
                            <van-dropdown-item get-container="body" v-model="substitutePersonValue" :options="substitutePersonValueOption" />
                        </van-dropdown-menu>
                    </div>
                </div>
                <div class="change-shift-box-bottom">
                    <div class="change-shift-box-bottom-left">
                        调班日期
                    </div>
                    <div class="change-shift-box-bottom-right">
                        <span>{{ dateValue }}</span>
                        <img :src="calendarPng" alt="" @click="calendarShow = true" />
                    </div>
                </div>
            </div>
        </div>
        <div class="dialog-bottom">
            <div class="select-title">选择下午考勤</div>
            <van-radio-group  @change="afternoonAttendanceRadioChange" v-model="afternoonAttendanceRadioValue" direction="horizontal">
                <van-radio :name="item.value" checked-color="#1864FF" v-for="(item) in afteroonAttendanceTypeList" :key="item.name">{{ item.name }}</van-radio>
            </van-radio-group>
             <div class="change-shift-box" v-show="isShowAfternoonChangeShiftBox">
                <div class="change-shift-box-top">
                    <div class="change-shift-box-top-left">
                        <span>*</span>
                        <span>替班人</span>
                    </div>
                    <div class="change-shift-box-top-right">
                        <van-dropdown-menu z-index="40000" active-color="#1864FF">
                            <van-dropdown-item get-container="body" v-model="substitutePersonValue" :options="substitutePersonValueOption" />
                        </van-dropdown-menu>
                    </div>
                </div>
                <div class="change-shift-box-bottom">
                    <div class="change-shift-box-bottom-left">
                        调班日期
                    </div>
                    <div class="change-shift-box-bottom-right">
                        <span>{{ dateValue }}</span>
                        <img :src="calendarPng" alt="" @click="calendarShow = true" />
                    </div>
                </div>
            </div>
        </div>
    </van-dialog>
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
        <div class="content-center" v-show="isShowCheckbox">
            <van-checkbox shape="square" v-model="allChecked" icon-size="25px" @click="allCheckedChange">全选</van-checkbox>
        </div>
        <div class="content-bottom">
           <div class="person-attendance-status-list" v-for="(item,index) in personAttendanceStatusList" :key="index" @click="personAttendanceClickEvent(item,index)">
                <div class="check-box" v-show="isShowCheckbox">
                    <van-checkbox shape="square" v-model="item.checked" icon-size="30px" @click.stop.native="emptyHandle"></van-checkbox>
                </div>
               <div class="list-content">
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
                            <van-icon name="arrow" size="25" color="#1864FF" />
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
    </div>
    <div class="btn-box" v-show="!isShowCheckbox">
        <div class="btn-area" @click="batchProcessingEvent">
            批量处理
        </div>
    </div>
    <div class="btn-box-two" v-show="isShowCheckbox">
        <div class="cancel-choose" @click="cancelChooseEvent">取消选择</div>
        <div class="sure-choose" @click="sureChooseEvent">确定选择</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/environmentalManagement.js";
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
      allChecked: false,
      isShowForenoonChangeShiftBox: false,
      isShowAfternoonChangeShiftBox: false,
      attendanceDialogShow: false,
      forenoonAttendanceRadioValue: '1',
      afternoonAttendanceRadioValue: '1',
      dateValue: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      calendarShow: false,
      calendarPng: require("@/common/images/home/calendar.png"),
      isShowCheckbox: false,
      substitutePersonValue: 0,
      substitutePersonValueOption: [
        { text: '请选择', value: 0 },
        { text: '新款商品', value: 1 }
      ],
      forenoonAttendanceTypeList: [
        {
        name: '出勤',
        value: '1'
        },
        {
        name: '外派',
        value: '2'
        },
        {
        name: '工伤',
        value: '3'
        },
        {
        name: '病假',
        value: '4'
        },
        {
        name: '迟到早退',
        value: '5'
        },
        {
        name: '休假',
        value: '6'
        },
        {
        name: '事假',
        value: '7'
        },
        {
        name: '加班',
        value: '8'
        },
        {
        name: '调班',
        value: '9'
        },
        {
        name: '旷工',
        value: '10'
        }
      ],
      afteroonAttendanceTypeList: [
        {
        name: '出勤',
        value: '1'
        },
        {
        name: '外派',
        value: '2'
        },
        {
        name: '工伤',
        value: '3'
        },
        {
        name: '病假',
        value: '4'
        },
        {
        name: '迟到早退',
        value: '5'
        },
        {
        name: '休假',
        value: '6'
        },
        {
        name: '事假',
        value: '7'
        },
        {
        name: '加班',
        value: '8'
        },
        {
        name: '调班',
        value: '9'
        },
        {
        name: '旷工',
        value: '10'
        }
      ],
      personAttendanceStatusList: [
        {   
            checked: false,
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {   
            checked: false,
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {
            checked: false,
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {   
            checked: false,
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {
            checked: false,
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        },
        {
            checked: false,
            personName: '王五',
            forenoonStatus: '事假',
            afternoonStatus: '出勤',
            forenoonClockTime: '9:20',
            afternoonClockTime: '9:20'
        }
      ]
    }
  },


  watch: {
    personAttendanceStatusList: {
        handler: function(newVal, oldVal) {
            let flag = newVal.every((item) => { return item.checked == true});
            if (flag) {
                this.allChecked = true
            } else {
                this.allChecked = false
            }
        },
        deep: true
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
    },

    emptyHandle () {},

    // 上午考勤单选框值变化事件
    forenoonAttendanceRadioChange (value) {
        if (value == 9) {
            this.isShowForenoonChangeShiftBox = true
        } else {
            this.isShowForenoonChangeShiftBox = false
        }
    },

    // 下午考勤单选框值变化事件
    afternoonAttendanceRadioChange (value) {
        if (value == 9) {
            this.isShowAfternoonChangeShiftBox = true
        } else {
            this.isShowAfternoonChangeShiftBox = false
        }
    },

    // 批量处理事件
    batchProcessingEvent () {
        this.isShowCheckbox = true;
        this.personAttendanceStatusList.forEach(item => { item.checked = false })
    },

    // 取消选择事件
    cancelChooseEvent () {
        this.isShowCheckbox = false
    },

    // 确定选择事件
    sureChooseEvent () {
        this.isShowCheckbox = false;
        if (!this.personAttendanceStatusList.every((item) => { return item.checked == false})) {
            this.attendanceDialogShow = true
        }
    },

    // 考勤类型弹框确定事件
    attendanceDialogSure () {

    },

    // 考勤类型弹框取消事件
    attendanceDialogCancel () {
        this.forenoonAttendanceRadioValue = '1';
        this.afternoonAttendanceRadioValue = '1'
    },

    // 全选单选框选中值变化事件
    allCheckedChange () {
        if (this.allChecked) {
            this.personAttendanceStatusList.forEach(item => { item.checked = true })
        } else {
            this.personAttendanceStatusList.forEach(item => { item.checked = false })
        }
    },

    //人员列表点击事件
    personAttendanceClickEvent(item,index) {
        if (this.isShowCheckbox) { return };
        this.attendanceDialogShow = true
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
  /deep/ .van-dialog {
      .van-dialog__content {
        padding: 20px !important;
        .dialog-top {
            .select-title {
                font-size: 16px;
                color: #1864FF;
                margin-bottom: 20px
            };
            /deep/ .van-radio-group {
                .van-radio {
                    margin-bottom: 6px;
                    .van-radio__label {
                        word-break: break-all;
                        font-size: 14px !important;
                        width: 35px
                    }
                }
            };
            .change-shift-box {
                display: flex;
                flex-direction: column;
                font-size: 14px !important;
                color: #101010 !important;
                .change-shift-box-top {
                    display: flex;
                    flex-flow: row nowrap;
                    .change-shift-box-top-left {
                        height: 40px;
                        display: flex;
                        margin-right: 10px;
                        align-items: center;
                        >span {
                            &:first-child {
                                color: red
                            }
                        }
                    };
                    .change-shift-box-top-right {
                        display: flex;
                        margin-right: 10px;
                        align-items: center;
                        height: 40px;
                        width: 50%;
                        /deep/ .van-dropdown-menu {
                            .van-dropdown-menu__bar {
                                box-shadow: none !important;
                                height: 40px !important;
                                .van-dropdown-menu__item {
                                    justify-content: flex-end !important;
                                    .van-dropdown-menu__title {
                                        color: #1864FF !important
                                    };
                                    .van-dropdown-menu__title::after {
                                        border-color: transparent transparent #174E97 #174E97 !important;
                                    }
                                }
                            }
                        }
                    }

                };
                .change-shift-box-bottom {
                    display: flex;
                    flex-flow: row nowrap;
                    .change-shift-box-bottom-left {
                        height: 40px;
                        display: flex;
                        margin-right: 10px;
                        align-items: center;
                    };
                    .change-shift-box-bottom-right {
                        width: 50%;
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
            }
        };
        .dialog-bottom {
            margin-top: 60px;
            .select-title {
                font-size: 16px;
                color: #1864FF;
                margin-bottom: 10px
            };
            /deep/ .van-radio-group {
                .van-radio {
                    margin-bottom: 6px;
                    .van-radio__label {
                        word-break: break-all;
                        font-size: 14px !important;
                        width: 35px
                    }
                }
            };
            .change-shift-box {
                display: flex;
                flex-direction: column;
                font-size: 14px !important;
                color: #101010 !important;
                .change-shift-box-top {
                    display: flex;
                    flex-flow: row nowrap;
                    .change-shift-box-top-left {
                        height: 40px;
                        display: flex;
                        margin-right: 10px;
                        align-items: center;
                        >span {
                            &:first-child {
                                color: red
                            }
                        }
                    };
                    .change-shift-box-top-right {
                        display: flex;
                        margin-right: 10px;
                        align-items: center;
                        height: 40px;
                        width: 50%;
                        /deep/ .van-dropdown-menu {
                            .van-dropdown-menu__bar {
                                box-shadow: none !important;
                                height: 40px !important;
                                .van-dropdown-menu__item {
                                    justify-content: flex-end !important;
                                    .van-dropdown-menu__title {
                                        color: #1864FF !important
                                    };
                                    .van-dropdown-menu__title::after {
                                        border-color: transparent transparent #174E97 #174E97 !important;
                                    }
                                }
                            }
                        }
                    }

                };
                .change-shift-box-bottom {
                    display: flex;
                    flex-flow: row nowrap;
                    .change-shift-box-bottom-left {
                        height: 40px;
                        display: flex;
                        margin-right: 10px;
                        align-items: center;
                    };
                    .change-shift-box-bottom-right {
                        width: 50%;
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
            }
        }
      }
  };
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
                            color: #1864FF !important
                        }
                    }
                }
            }    
        }
    };
    .content-center {
        width: 100%;
        margin: 0 auto;
        padding: 10px 4px;
        box-sizing: border-box;
        /deep/ .van-checkbox {
            justify-content: flex-end !important
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
            position: relative;
            .check-box {
                position: absolute;
                top: 0;
                right: 0
            };
            .list-content {
                flex: 1;
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
                                    color: #1864FF
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
 };
 .btn-box-two {
    height: 80px;
    display: flex;
    width: 90%;
    margin: 0 auto;
    align-items: center;
    justify-content: space-between;
    >div {
      width: 48%;
      height: 48px;
      font-size: 18px;
      line-height: 48px;
      background: #fff;
      text-align: center;
      border-radius: 30px;
      font-weight: bold;
      &:first-child {
        color: blue;
        box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
      };
       &:last-child {
        color: #fff;
        background: linear-gradient(to right, #6cd2f8, #2390fe);
        box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
      }
    }
 }
}
</style>