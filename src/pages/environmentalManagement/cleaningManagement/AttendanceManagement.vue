<template>
  <div class="page-box">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadingText }}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
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
                            <van-dropdown-item get-container="body" v-model="substitutePersonMorningValue" :options="substitutePersonMorningValueOption" />
                        </van-dropdown-menu>
                    </div>
                </div>
                <div class="change-shift-box-bottom">
                    <div class="change-shift-box-bottom-left">
                        调班日期
                    </div>
                    <div class="change-shift-box-bottom-right">
                        <span>{{ getNowFormatDate(currentMorningDate,'day') }}</span>
                        <img :src="calendarPng" alt="" />
                    </div>
                </div>
            </div>
            <div class="change-shift-box duration-box" v-show="isShowForenoonDurationBox">
                <div class="change-shift-box-bottom">
                    <div class="change-shift-box-bottom-left">
                        时长(小时)
                    </div>
                    <div class="change-shift-box-bottom-right">
                        <van-field v-model="currentMorningDuration" type="number"/>
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
                            <van-dropdown-item get-container="body" v-model="substitutePersonAfternoonValue" :options="substitutePersonAfternoonValueOption" />
                        </van-dropdown-menu>
                    </div>
                </div>
                <div class="change-shift-box-bottom">
                    <div class="change-shift-box-bottom-left">
                        调班日期
                    </div>
                    <div class="change-shift-box-bottom-right">
                        <span>{{ getNowFormatDate(currentAfternoonDate,'day') }}</span>
                        <img :src="calendarPng" alt="" />
                    </div>
                </div>
            </div>
             <div class="change-shift-box duration-box" v-show="isShowAfternoonDurationBox">
                <div class="change-shift-box-bottom">
                    <div class="change-shift-box-bottom-left">
                        时长(小时)
                    </div>
                    <div class="change-shift-box-bottom-right">
                        <van-field v-model="currentAfternoonDuration" type="number"/>
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
    <van-popup v-model="calendarShow" position="bottom">
        <van-datetime-picker
            v-model="currentDayDate"
            @confirm="onConfirm"
            @cancel="calendarShow = false"
            type="date"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <van-popup v-model="calendarMorningShow" position="bottom">
        <van-datetime-picker
            v-model="currentMorningDate"
            @confirm="onConMorningFirm"
            @cancel="calendarMorningShow = false"
            type="date"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <van-popup v-model="calendarAfternoonShow" position="bottom">
        <van-datetime-picker
            v-model="currentAfternoonDate"
            @confirm="onConAfternoonFirm"
            @cancel="calendarAfternoonShow = false"
            type="date"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <div class="content">
        <div class="content-top">
            <div class="filtrate-box">
                <div class="date-box">
                    <div class="date-content">
                        <span>{{ getNowFormatDate(currentDayDate,'day') }}</span>
                        <img :src="calendarPng" alt="" @click="calendarShow = true" />
                    </div>
                </div>
                <div class="search-box" @click="searchEvent">
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
           <van-empty description="暂无数据" v-show="emptyShow" />
           <div class="person-attendance-status-list" v-show="!emptyShow" v-for="(item,index) in personAttendanceStatusList" :key="index" @click="personAttendanceClickEvent(item,index)">
                <div class="check-box" v-show="isShowCheckbox">
                    <van-checkbox shape="square" v-model="item.checked" icon-size="30px" @click.stop.native="emptyHandle"></van-checkbox>
                </div>
               <div class="list-content">
                    <div class="person-name">{{ `${index + 1}、${item.workerName}`}}</div>
                    <div class="attendance-status">
                        <div class="attendance-status-left">
                            <div class="forenoon-status">
                                <span>上午</span>
                                <span>{{ attendanceTypeTransition(item.morning) }}</span>
                            </div>
                            <div class="afternoon-status">
                                <span>下午</span>
                                <span>{{ attendanceTypeTransition(item.afternoon) }}</span>
                            </div>    
                        </div>
                        <div class="attendance-status-right">
                            <van-icon name="arrow" size="25" color="#1864FF" />
                        </div>
                    </div>
                    <!-- <div class="clock-time">
                        <div class="forenoon-clock-time">
                            <span>上午打卡时间: </span>
                            <span>{{ item.inTime }}</span>
                        </div>
                        <div class="afternoon-clock-time">
                            <span>下午打卡时间: </span>
                            <span>{{ item.outTime }}</span>
                        </div>
                    </div> -->
                </div>    
           </div>
        </div>
    </div>
    <div class="btn-box" v-show="!isShowCheckbox && !emptyShow">
        <div class="btn-area" @click="batchProcessingEvent">
            批量处理
        </div>
    </div>
    <div class="btn-box-two" v-show="isShowCheckbox && !emptyShow">
        <div class="cancel-choose" @click="cancelChooseEvent">取消选择</div>
        <div class="sure-choose" @click="sureChooseEvent">确定选择</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {cleanAttendanceList,cleanAttendanceUpdate,cleanAttendanceUpdateBatch,cleanbxWorkerList} from "@/api/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "AttendanceManagement",
  components: {
    NavBar,
  },
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      emptyShow: false,
      editMessage: {},
      searchValue: '',
      isClickSureSelectBtn: false,
      loadingText: '加载中···',
      allChecked: false,
      isShowForenoonChangeShiftBox: false,
      isShowAfternoonChangeShiftBox: false,
      isShowForenoonDurationBox: false,
      isShowAfternoonDurationBox: false,
      currentMorningDuration: '',
      currentAfternoonDuration: '',
      attendanceDialogShow: false,
      forenoonAttendanceRadioValue: '1',
      afternoonAttendanceRadioValue: '1',
      currentDayDate: new Date(),
      currentMorningDate: new Date(),
      currentAfternoonDate: new Date(),
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      calendarShow: false,
      calendarMorningShow: false,
      calendarAfternoonShow: false,
      calendarPng: require("@/common/images/home/calendar.png"),
      isShowCheckbox: false,
      substitutePersonMorningValue: 0,
      substitutePersonAfternoonValue: 0,
      substitutePersonMorningValueOption: [
        { text: '请选择', value: 0 }
      ],
       substitutePersonAfternoonValueOption: [
        { text: '请选择', value: 0 }
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
        value: '8'
        },
        {
        name: '休假',
        value: '6'
        },
        {
        name: '事假',
        value: '10'
        },
        {
        name: '加班',
        value: '7'
        },
        {
        name: '调班',
        value: '5'
        },
        {
        name: '旷工',
        value: '9'
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
        value: '8'
        },
        {
        name: '休假',
        value: '6'
        },
        {
        name: '事假',
        value: '10'
        },
        {
        name: '加班',
        value: '7'
        },
        {
        name: '调班',
        value: '5'
        },
        {
        name: '旷工',
        value: '9'
        }
      ],
      personAttendanceStatusList: []
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
    };
    this.getCleanAttendanceList();
    this.getWorkerList()
  },

  computed: {
    ...mapGetters(["userInfo"]),
  },

  methods: {
    ...mapMutations([]),

    onClickLeft() {
      this.$router.push({ path: "/home"})
    },

    // 查询保洁员列表
    getWorkerList () {
        this.substitutePersonMorningValueOption = [{ text: '请选择', value: 0 }];
        this.substitutePersonAfternoonValueOption = [{ text: '请选择', value: 0 }];
        cleanbxWorkerList(this.userInfo.proIds[0]).then((res) => {
            if (res && res.data.code == 200) {
                if (res.data.data.length > 0) {
                    for (let item of res.data.data) {
                        this.substitutePersonMorningValueOption.push({
                            text: item.name,
                            value: item.id,
                            state: item.state
                        });
                        this.substitutePersonAfternoonValueOption.push({
                            text: item.name,
                            value: item.id,
                            state: item.state
                        })
                    }
                }
            } else {
                this.$toast({
                    message: `${res.data.msg}`,
                    type: 'fail'
                })
            }
        }).
        catch((err) => {
            this.$toast({
                message: `${err}`,
                type: 'fail'
            })
        })
    },

    // 考勤类型转换
    attendanceTypeTransition (num) {
        switch(num) {
            case 0 :
                return '未出勤'
                break;
            case 1 :
                return '出勤'
                break;
            case 2 :
                return '外派'
                break;
            case 3 :
                return '工伤'
                break;
            case 4 :
                return '病假'
                break;
            case 5 :
                return '调班'
                break;
            case 6 :
                return '休假'
                break;
            case 7 :
                return '加班'
                break;
            case 8 :
                return '迟到早退'
                break;
            case 9 :
                return '旷工'
                break;
            case 10 :
                return '事假'
                break;
        }
    },

    // 格式化时间
    getNowFormatDate(currentDate,type) {
        let currentdate;
        let strDate;
        let seperator1 = "-";
        let month = currentDate.getMonth() + 1;
        if (type == 'day') {
            strDate = currentDate.getDate();
        };
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        };
        if (type == 'day') {
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
        };
        if (type == 'day') {
            currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
        } else {
            currentdate = currentDate.getFullYear() + seperator1 + month
        }
        return currentdate
    },

    // 搜索事件
    searchEvent () {
        this.getCleanAttendanceList(this.searchValue)
    },

    // 获取考勤列表
    getCleanAttendanceList (searchText = '') {
      this.loadingShow = true;
      this.overlayShow = true;
      this.emptyShow = false;
      this.loadingText = '加载中···';
      cleanAttendanceList({proId: this.userInfo.proIds[0],date: this.getNowFormatDate(this.currentDayDate,'day'),name: searchText}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
		if (res && res.data.code == 200) {
            if (res.data.data.length == 0) {
                this.emptyShow = true;
            } else {
                this.personAttendanceStatusList = res.data.data;
                for (let item of this.personAttendanceStatusList) {
                    this.$set(item,'checked',false)
                }
            }
        } else {
            this.$toast({
                message: `${res.data.msg}`,
                type: 'fail'
            })
        }
        }).
        catch((err) => {
            this.$toast({
                message: `${err}`,
                type: 'fail'
            });
            this.loadingShow = false;
            this.overlayShow = false
        })
    },

    // 录入考勤
    updateCleanAttendance (data) {
      this.loadingShow = true;
      this.overlayShow = true;
      this.emptyShow = false;
      this.loadingText = '提交中···';
      cleanAttendanceUpdate(data).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
		if (res && res.data.code == 200) {
            this.$toast({
                message: '编辑成功',
                type: 'success'
            });
            this.getCleanAttendanceList()
        } else {
            this.$toast({
                message: `${res.data.msg}`,
                type: 'fail'
            })
        }
        }).
        catch((err) => {
            this.$toast({
                message: `${err}`,
                type: 'fail'
            });
            this.loadingShow = false;
            this.overlayShow = false
        })
    },
   
   // 日期选择确定事件
    onConfirm(date) {
      this.calendarShow = false;
      this.getCleanAttendanceList()
    },

    // 上午调班日期选择框确定
    onConMorningFirm () {
        this.calendarMorningShow = false
    },

    // 下午调班日期选择框确定
    onConAfternoonFirm () {
        this.calendarAfternoonShow = false
    },

    emptyHandle () {},

    // 上午考勤单选框值变化事件
    forenoonAttendanceRadioChange (value) {
        if (value == 5) {
            this.isShowForenoonChangeShiftBox = true
        } else {
            this.isShowForenoonChangeShiftBox = false
        };
        if (value == 4 || value == 6 || value == 10 || value == 7 || value == 9) {
            this.isShowForenoonDurationBox = true
        } else {
            this.isShowForenoonDurationBox = false
        }
    },

    // 下午考勤单选框值变化事件
    afternoonAttendanceRadioChange (value) {
        if (value == 5) {
            this.isShowAfternoonChangeShiftBox = true
        } else {
            this.isShowAfternoonChangeShiftBox = false
        };
        if (value == 4 || value == 6 || value == 10 || value == 7 || value == 9) {
            this.isShowAfternoonDurationBox = true
        } else {
            this.isShowAfternoonDurationBox = false
        }
    },

    // 批量处理事件
    batchProcessingEvent () {
        this.isShowCheckbox = true;
        this.personAttendanceStatusList.forEach(item => { item.checked = false })
    },

    // 取消选择事件
    cancelChooseEvent () {
        this.isShowCheckbox = false;
        this.isClickSureSelectBtn = false
    },

    // 确定选择事件
    sureChooseEvent () {
        this.isClickSureSelectBtn = false;
        if (!this.personAttendanceStatusList.every((item) => { return item.checked == false})) {
            this.attendanceDialogShow = true;
            this.currentMorningDuration = '';
            this.currentAfternoonDuration = '';
            this.isShowCheckbox = false;
            this.isClickSureSelectBtn = true
        } else {
            this.$toast('请勾选')
        }
    },

    //考勤人员列表点击事件
    personAttendanceClickEvent(item,index) {
        if (this.isShowCheckbox) { return };
        this.editMessage = item;
        this.attendanceDialogShow = true;
        // 回显上午考勤类型
        if (item.morning != 0) {
            this.forenoonAttendanceRadioValue = item.morning.toString();
            if (this.forenoonAttendanceRadioValue == 5) {
                this.isShowForenoonChangeShiftBox = true
            };
            if (this.forenoonAttendanceRadioValue == 4 || this.forenoonAttendanceRadioValue == 6 || this.forenoonAttendanceRadioValue == 10 || this.forenoonAttendanceRadioValue == 7 || this.forenoonAttendanceRadioValue == 9) {
                this.isShowForenoonDurationBox = true
            };
        };
        // 回显下午午考勤类型
        if (item.afternoon != 0) {
            this.afternoonAttendanceRadioValue = item.afternoon.toString();
            if (this.afternoonAttendanceRadioValue == 5) {
                this.isShowAfternoonChangeShiftBox = true
            }
            if (this.afternoonAttendanceRadioValue == 4 || this.afternoonAttendanceRadioValue == 6 || this.afternoonAttendanceRadioValue == 10 || this.afternoonAttendanceRadioValue == 7 || this.afternoonAttendanceRadioValue == 9) {
                this.isShowAfternoonDurationBox = true
            }
        };
        // 回显上午时长
        if (item.duration) {
            this.currentMorningDuration = item.duration
        } else {
            this.currentMorningDuration = ''
        }
        // 回显下午时长
        if (item.afDuration) {
            this.currentAfternoonDuration = item.afDuration
        } else {
            this.currentAfternoonDuration = ''
        }
        // 回显上午替班人
        if (item.substitute) {
            this.substitutePersonMorningValue = item.substitute
        } else {
            this.substitutePersonMorningValue = 0
        }
        // 回显下午替班人
        if (item.afSubstitute) {
            this.substitutePersonAfternoonValue = item.afSubstitute
        } else {
            this.substitutePersonAfternoonValue = 0
        }
    },

    // 考勤类型弹框确定事件
    attendanceDialogSure () {
        // 区分是否为批量提交
        if (!this.isClickSureSelectBtn) {
            if (this.forenoonAttendanceRadioValue == 5) {
                // 替班人必输
                if (this.substitutePersonMorningValue == 0 ) {
                    this.$toast('请选择上午替班人');
                    return
                }
            };
            if (this.afternoonAttendanceRadioValue == 5) {
                // 替班人必输
                if (this.substitutePersonAfternoonValue == 0) {
                    this.$toast('请选择下午替班人');
                    return
                }
            };
            let temporaryEditMessage = {
                id: this.editMessage.id, //主键ID
                name: this.editMessage.workerName, //保洁员姓名
                morning: this.forenoonAttendanceRadioValue, //上午考勤类型
                duration: this.currentMorningDuration, //上午时长 非必输
                afDuration: this.currentAfternoonDuration, //下午时长 非必输
                date: this.getNowFormatDate(this.currentMorningDate,'day'), //日期 yyyy-MM-dd
                afternoon: this.afternoonAttendanceRadioValue, //下午考勤类型
                content: '', //备注 非必输
                proId: this.userInfo.proIds[0], //医院ID
                modifyName: this.userInfo.name, //提交者
                substitute: this.substitutePersonMorningValue == 0 ? '' : this.substitutePersonMorningValue, //上午调班者ID  非必输
                afSubstitute: this.substitutePersonAfternoonValue == 0 ? '' : this.substitutePersonAfternoonValue //下午调班者ID 非必输
            };
            console.log('提交的编辑信息',temporaryEditMessage);
            this.updateCleanAttendance(temporaryEditMessage)
        }
    },

    // 考勤类型弹框取消事件
    attendanceDialogCancel () {
        this.forenoonAttendanceRadioValue = '1';
        this.afternoonAttendanceRadioValue = '1'
    },

    // 全选单选框选中值变化事件
    allCheckedChange () {
        if (this.allChecked) {
            this.personAttendanceStatusList.forEach(item => { item.checked = true });
        } else {
            this.personAttendanceStatusList.forEach(item => { item.checked = false })
        }
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
   /deep/ .van-popup {
    z-index: 30000 !important
  };
  /deep/ .van-loading {
    z-index: 1000000
  };      
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
            };
            .duration-box {
                margin-top: 4px;
                .change-shift-box-bottom-left {
                    height: 30px !important
                };
                .change-shift-box-bottom-right {
                    background: #fff !important;
                    /deep/ .van-cell {
                        padding: 0 4px !important;
                        border: 1px solid #bebebe
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
            };
            .duration-box {
                margin-top: 4px;
                .change-shift-box-bottom-left {
                    height: 30px !important
                };
                .change-shift-box-bottom-right {
                    background: #fff !important;
                    /deep/ .van-cell {
                        padding: 0 4px !important;
                        border: 1px solid #bebebe
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
        position: relative;
        /deep/ .van-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%)
        };
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
                    margin-top: 20px;
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