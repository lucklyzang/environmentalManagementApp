<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
       <van-nav-bar
        title="任务列表"
        left-text="返回"
        right-text="刷新"
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
    <div class="content">
        <div class="content-top">
            <div class="filtrate-box">
                <div class="select-box">
                    <van-dropdown-menu>
                        <van-dropdown-item v-model="selectValue" :options="selectOption" @change="selecOptionChangeEvent" />
                    </van-dropdown-menu>
                </div>
                <div class="search-box">
                    <van-field
                        v-model="searchValue"
                        placeholder="搜索关键词"
                    >
                        <template #button>
                           <van-icon @click="searchEvent" name="search" color="#101010" size="25" />
                        </template>
                    </van-field>
                </div>
            </div>
            <div class="task-item-name">
                <div @click="taskItemNameEvent(1)" v-show="this.currentCleanTaskName.forthwithTaskShow" :class="{'forthwithItemStyle':itemNameIndex == 1}">{{`即时${taskList.length}`}}</div>
                <div @click="taskItemNameEvent(2)" v-show="this.currentCleanTaskName.specialTaskShow" :class="{'specialItemStyle':itemNameIndex == 2}">{{`专项${taskList.length}`}}</div>
                <div @click="taskItemNameEvent(3)" v-show="this.currentCleanTaskName.pollingTaskShow" :class="{'pollingItemStyle':itemNameIndex == 3}">{{`巡检${taskList.length}`}}</div>
            </div>
        </div>
        <van-empty v-show="emptyShow" description="暂无数据" />
        <div class="content-bottom" v-show="!emptyShow">
            <div class="task-list-box" v-if="currentCleanTaskName.num == 1">
                <div class="task-list" v-for="(item,index) in taskList" @click="forthwithTaskDetailsEvent(item,generateTaskNumber('即时',index))" :key="index">
                    <div class="task-list-title">
                        <div class="task-list-title-left">
                            即时任务编号{{ generateTaskNumber('即时',index) }}
                        </div>
                        <div class="task-list-title-right" :class="{
                            'underwayStyle' : item.state == 3, 
                            'completeStyle' : item.state == 6,
                            'reviewStyle' : item.state == 4,
                            'haveReviewStyle' : item.state == 5
                            }"
                            >
                            {{ stausTransfer(item.state) }}
                        </div>
                    </div>
                    <div class="task-list-content">
                        <div class="one-line">
                            <span>地点: </span>
                            <span>{{ `${item.structureName}${item.depName}${item.areaImmediateName}${extractSpaceMessage(item.spaces)}` }}</span>
                        </div>
                        <div class="one-line">
                            <span>创建时间: </span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="one-line">
                            <span>计划执行人: </span>
                            <span>{{ `${item.workerName}、${item.managerName}` }}</span>
                        </div>
                        <div class="one-line">
                            <span>问题描述: </span>
                            <span>{{ item.taskRemark }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-list-box" v-if="currentCleanTaskName.num == 2">   
                <div class="task-list special-list" v-for="(item,index) in taskList" @click="specialTaskDetailsEvent(item,generateTaskNumber('专项',index))" :key="item.taskNumber">
                    <div class="task-list-title">
                        <div class="task-list-title-left">
                            编号{{ generateTaskNumber('专项',index) }}
                        </div>
                        <div class="task-list-title-right" :class="{
                                'underwayStyle' : item.state == 3, 
                                'completeStyle' : item.state == 6,
                                'reviewStyle' : item.state == 4,
                                'haveReviewStyle' : item.state == 5
                            }">
                            {{ stausTransfer(item.state) }}
                        </div>
                    </div>
                    <div class="task-list-content">
                        <div class="one-line">
                            <span>地点: </span>
                            <span>{{ `${item.structureName}${item.depName}${item.areaSpecialName}` }}</span>
                        </div>
                        <div class="one-line">
                            <span>保洁事项: </span>
                            <span>{{ item.cleanItemName }}</span>
                        </div>
                        <div class="one-line">
                            <span>创建时间: </span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="one-line">
                            <span>计划执行人: </span>
                            <span>{{ `${item.workerName}、${item.managerName}` }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-list-box" v-if="currentCleanTaskName.num == 3">  
                <div class="task-list polling-list" v-for="(item,index) in pollingTaskList" @click="pollingTaskDetailsEvent(item)" :key="item.pollingTaskName">
                    <div class="task-list-title">
                        <div class="task-list-title-left">
                            {{ generateTaskNumber('巡检',index) }}
                        </div>
                        <div class="task-list-title-right" :class="{'underwayStyle' : item.status == 1, 'completeStyle' : item.status == 2}">
                            {{ stausTransfer(item.status) }}
                        </div>
                    </div>
                    <div class="task-list-content">
                        <div class="list-content-left">
                            <div>
                                <span>开始时间:</span>
                                <span>{{ item.startTime }}</span>
                            </div>
                            <div>
                                <span>巡检人:</span>
                                <span>{{ item.checkingPeople }}</span>
                            </div>
                        </div>
                        <div class="list-content-right">
                            <van-circle v-model="item.complete" :rate="50" :speed="100" layer-color="#d0d0cc" :size="30" :stroke-width="100" />
                            <div class="complete-text">
                                <span>完成率:</span>
                                <span>{{ `${item.complete}%` }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { queryCleaningManageTaskList } from "@/api/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "CleaningTask",
  components: {
    NavBar,
  },
  data() {
    return {
      loadingShow: false,
      emptyShow: false,
      overlayShow: false,
      selectValue: -1,
      itemNameIndex: 1,
      searchValue: '',
      currenDate: new Date(),
      selectOption: [
        { text: '全部', value: -1 },
        { text: '未开始', value: 1 },
        { text: '进行中', value: 3 },
        { text: '复核中', value: 4 },
        { text: '已完成', value: 6 },
        { text: '已复核', value: 5 }
      ],
      taskList: [],
      allTaskList: [],
      pollingTaskList: [
        {
            pollingTaskName: '巡检任务配置一',
            status: 0,
            startTime: '05-31 17:21',
            checkingPeople: '住院部',
            complete: 87
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
          path: "/cleanTaskList",
        })
      })
    };
    this.itemNameIndex = this.currentCleanTaskName.num;
    this.getCleaningManageTaskList(this.currentCleanTaskName.num -1)
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","currentCleanTaskName","currentCleanTaskDateVlue","cleanTaskDetails"]),
  },

  methods: {
    ...mapMutations(['storeCurrentCleanTaskName','storeCleanTaskDetails']),
    onClickLeft() {
      this.$router.push({ path: "/cleanTaskList"})
    },
    onClickRight () {
        this.searchValue = '';
        this.getCleaningManageTaskList(this.itemNameIndex - 1);
        if (this.selectValue != -1) {
            this.selectValue = -1
        }
    },
    
    // 任务状态转换
    stausTransfer (num) {
        switch(num) {
            case 1:
                return '未开始'
                break;
            case 3:
                return '进行中'
                break;
            case 4:
                return '复核中'
                break;
            case 6:
                return '已完成'
                break;
            case 5:
                return '已复核'
                break
        } 
    },

    // 提取即时保洁功能区信息
    extractSpaceMessage (spaces) {
        if (spaces.length == 0) {
            return ''
        };
        let temporaryArray = [];
        for (let item of spaces) {
            temporaryArray.push(item.name);
        };
        return temporaryArray.join("、")
    },

    // 生成任务编号
    generateTaskNumber (type,index) {
        let startField = '';
        let endIndex = index+1 >= 10 ? `0${index+1}` : `00${index+1}`;
        let month = this.currenDate.getMonth() + 1;
        let Date = this.currenDate.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        };
        if (Date >= 0 && Date <= 9) {
            Date = "0" + Date;
        };
        if (type == '即时') {
            startField = 'JS'
        } else if (type == '专项') {
            startField = 'ZX'
        } else if (type == '巡检') {
            startField = 'XJ'
        };
        return  `${startField}${month}${Date}${endIndex}`
    },

    // 查询任务列表
    getCleaningManageTaskList (taskType) {
        let data = {
            proId : this.userInfo.proIds[0], // 所属项目id
            queryDate: this.currentCleanTaskName.date, // 查询时间
            managerId: this.userInfo.id, // 保洁主管id    
            taskType: taskType // 0-即时，1-专项
        };
        this.loadingShow = true;
        this.overlayShow = true;
        this.taskList = [];
        queryCleaningManageTaskList(data).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
	      if (res && res.data.code == 200) {
                this.taskList = res.data.data.filter((item) => { return item.state != 5 && item.state != 2});
                this.allTaskList = this.taskList;
                if (this.taskList.length == 0) {
                    this.emptyShow = true
                } else {
                    this.emptyShow = false
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

    // 下拉框值改变事件
    selecOptionChangeEvent (value) {
        if (value == -1) {
            this.taskList = this.allTaskList;
            if (this.taskList.length == 0) {
                this.emptyShow = true
            } else {
                this.emptyShow = false
            };
            return
        };
        this.taskList = this.allTaskList.filter((item) => { return item.state == value});
        if (this.taskList.length == 0) {
            this.emptyShow = true
        } else {
            this.emptyShow = false
        }
    },

    // 任务名称点击事件
    taskItemNameEvent (num) {
        this.getCleaningManageTaskList(num - 1);
        this.itemNameIndex = num;
        let temporaryMessage = this.currentCleanTaskName;
        temporaryMessage['num'] = num;
        this.storeCurrentCleanTaskName(temporaryMessage);
        if (this.selectValue != -1) {
            this.selectValue = -1
        };
        if (this.searchValue) { this.searchValue = ''}
    },

    // 搜索事件
    searchEvent () {
        if (this.itemNameIndex == 1) {
            if (!this.searchValue) {
                this.taskList = this.allTaskList;
            } else {
                this.taskList = this.taskList.filter((item) => { return item.structureName.indexOf(this.searchValue) != -1 || item.depName.indexOf(this.searchValue) != -1 ||
                item.areaImmediateName.indexOf(this.searchValue) != -1  ||  (this.extractSpaceMessage(item.spaces)).indexOf(this.searchValue) != -1 ||
                item.workerName.indexOf(this.searchValue) != -1 || item.managerName.indexOf(this.searchValue) != -1}
                )
            }
        } else if (this.itemNameIndex == 2) {
            if (!this.searchValue) {
                this.taskList = this.allTaskList;
            } else {
                this.taskList = this.taskList.filter((item) => { return item.structureName.indexOf(this.searchValue) != -1 || item.depName.indexOf(this.searchValue) != -1 ||
                item.areaSpecialName.indexOf(this.searchValue) != -1 || item.workerName.indexOf(this.searchValue) != -1 || item.managerName.indexOf(this.searchValue) != -1}
                )
            }
        };
        if (this.taskList.length == 0) {
            this.emptyShow = true
        } else {
            this.emptyShow = false
        }
    },

    // 即时保洁任务点击进入任务详情事件
    forthwithTaskDetailsEvent(item,number) {
        this.storeCleanTaskDetails(item);
        let temporaryMessage = this.cleanTaskDetails;
        temporaryMessage['num'] = number;
        this.storeCleanTaskDetails(temporaryMessage);
        this.$router.push({path: '/forthwithCleaningTaskDetails'})
    },

    // 专项保洁任务点击进入任务详情事件
    specialTaskDetailsEvent(item,number) {
        this.storeCleanTaskDetails(item);
        let temporaryMessage = this.cleanTaskDetails;
        temporaryMessage['num'] = number;
        this.storeCleanTaskDetails(temporaryMessage);
        this.$router.push({path: '/specialCleaningTaskDetails'})
    },

    // 巡检任务点击进入任务详情事件
    pollingTaskDetailsEvent() {
        this.$router.push({path: '/pollingTaskDetails'})
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
  /deep/ .van-loading {
    z-index: 1000000
  };  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 0;
    /deep/ .van-empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%)
    };
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
            .select-box {
                height: 32px;
                width: 30%;
                /deep/ .van-dropdown-menu {
                    .van-dropdown-menu__bar {
                        height: 34px !important;
                        box-shadow: none !important;
                        border: 1px solid #BBBBBB;
                        border-radius: 4px;
                    }
                }
            };
            .search-box {
                height: 32px;
                width: 68%;
                /deep/ .van-cell {
                    line-height: 36px !important;
                    border: 1px solid #BBBBBB;
                    border-radius: 4px;
                    height: 36px;
                    padding: 0 10px !important;
                    .van-cell__value {
                        .van-field__body {
                            .van-field__button {
                                display: flex;
                                align-items: center
                            }
                        }
                    }
                }
            }    
        };
        .task-item-name{
            margin-top: 14px;
            display: flex;
            height: 32px;
            .forthwithItemStyle {
                background: #289E8E !important;
                border: none !important;
                color: #fff !important
            };
            .specialItemStyle {
                background: #174E97 !important;
                border: none !important;
                color: #fff !important
            };
            .pollingItemStyle {
                background: #E86F50 !important;
                border: none !important;
                color: #fff !important
            };
            >div {
                width: 32%;
                height: 32px;
                font-size: 14px;
                border-radius: 4px;
                display: flex;
                justify-content: center;
                align-items: center;
                &:nth-child(1) {
                    border: 1px solid #289E8E;
                    color: #289E8E
                };
                &:nth-child(2) {
                    border: 1px solid #174E97;
                    color: #174E97;
                    margin: 0 2%;
                };
                &:nth-child(3) {
                    border: 1px solid #E86F50;
                    color: #E86F50
                }
            }
        }

    };
    .content-bottom {
        width: 100%;
        background: #F8F8F8;
        flex: 1;
        padding: 6px;
        box-sizing: border-box;
        overflow: auto;
        .task-list {
            margin-bottom: 12px;
            border-radius: 4px;
            padding: 0 6px 6px  6px;
            background: #fff;
            box-sizing: border-box;
            box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
            .task-list-title {
                width: 100%;
                .bottom-border-1px(rgba(0, 0, 0, 0.23));
                padding: 10px 6px;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .task-list-title-left {
                    font-size: 16px;
                    color: #289E8E
                };
                .task-list-title-right {
                    width: 61px;
                    height: 27px;
                    text-align: center;
                    line-height: 27px;
                    background: #BBBBBB;
                    color: #fff;
                    border-radius: 4px
                };
                .underwayStyle {
                    background: #289E8E !important
                };
                .completeStyle {
                    background: #242424 !important
                };
                .reviewStyle {
                    background: #F2A15F !important
                };
                .haveReviewStyle {
                    background: #9B7D31 !important
                }
            };
            .task-list-content {
                width: 100%;
                padding: 10px 6px;
                box-sizing: border-box;
                .one-line {
                    line-height: 28px;
                    word-break: break-all;
                    span {
                       font-size: 14px;
                       &:first-child  {
                            color: #9E9E9A
                       };
                       &:last-child  {
                            color: #101010
                       }
                    }
                }
            }
        };
        .special-list {
            .task-list-title {
                .task-list-title-left {
                    color: #174E97
                }
             }    
        };
        .polling-list {
            .task-list-title {
                .task-list-title-left {
                    color: #E86F50
                }
            };
            .task-list-content {
                width: 100%;
                display: flex;
                padding: 20px 6px;
                box-sizing: border-box;
                justify-content: space-between;
                align-items: center;
                .list-content-left {
                    width: 65%;
                    >div {
                        word-break: break-all;
                        >span {
                        font-size: 14px;
                            &:first-child  {
                                color: #9E9E9A
                            };
                            &:last-child  {
                                color: #101010
                            }
                        };
                        &:first-child {
                            margin-bottom: 14px
                        }
                    }
                };
                .list-content-right {
                    width: 35%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    .complete-text {
                        margin-left: 8px;
                        >span {
                        font-size: 12px;
                            &:first-child  {
                                color: #9E9E9A
                            };
                            &:last-child  {
                                color: #1864FF
                            }
                        }
                    }
                }
            }
        }
    }
  }
}
</style>