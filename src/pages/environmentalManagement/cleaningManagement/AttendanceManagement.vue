<template>
  <div class="page-box" ref="wrapper">
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
        @click-right="onClickRight"
    />
    </div>
    <div class="content">
        <div class="content-top">
            <div class="filtrate-box">
                <div class="select-box">
                    <van-dropdown-menu>
                        <van-dropdown-item v-model="selectValue" :options="selectOption" />
                    </van-dropdown-menu>
                </div>
                <div class="search-box">
                    <van-field
                        v-model="searchValue"
                        right-icon="search"
                        placeholder="搜索关键词"
                    />
                </div>
            </div>
            <div class="task-item-name">
                <div @click="taskItemNameEvent(1)" :class="{'forthwithItemStyle':itemNameIndex == 1}">即时20</div>
                <div @click="taskItemNameEvent(2)" :class="{'specialItemStyle':itemNameIndex == 2}">专项12</div>
                <div @click="taskItemNameEvent(3)" :class="{'pollingItemStyle':itemNameIndex == 3}">巡检6</div>
            </div>
        </div>
        <div class="content-bottom">
            <div class="task-list" v-for="(item,index) in forthwithTaskList" :key="index" v-show="currentCleanTaskName == 1">
                <div class="task-list-title">
                    <div class="task-list-title-left">
                        即时任务编号{{ item.taskNumber }}
                    </div>
                    <div class="task-list-title-right" :class="{'underwayStyle' : item.status == 1, 'completeStyle' : item.status == 2}">
                        {{ stausTransfer(item.status) }}
                    </div>
                </div>
                <div class="task-list-content">
                    <div class="one-line">
                        <span>地点: </span>
                        <span>{{ item.site }}</span>
                    </div>
                    <div class="one-line">
                        <span>创建时间: </span>
                        <span>{{ item.createTime }}</span>
                    </div>
                    <div class="one-line">
                        <span>计划执行人: </span>
                        <span>{{ item.planExecutor }}</span>
                    </div>
                    <div class="one-line">
                        <span>问题描述: </span>
                        <span>{{ item.problemDescription }}</span>
                    </div>
                </div>
            </div>
            <div class="task-list special-list" v-for="(item) in specialTaskList" :key="item.taskNumber" v-show="currentCleanTaskName == 2">
                <div class="task-list-title">
                    <div class="task-list-title-left">
                        编号{{ item.taskNumber }}
                    </div>
                    <div class="task-list-title-right" :class="{'underwayStyle' : item.status == 1, 'completeStyle' : item.status == 2}">
                        {{ stausTransfer(item.status) }}
                    </div>
                </div>
                <div class="task-list-content">
                    <div class="one-line">
                        <span>地点: </span>
                        <span>{{ item.site }}</span>
                    </div>
                    <div class="one-line">
                        <span>保洁事项: </span>
                        <span>{{ item.cleaningItems }}</span>
                    </div>
                    <div class="one-line">
                        <span>创建时间: </span>
                        <span>{{ item.createTime }}</span>
                    </div>
                    <div class="one-line">
                        <span>计划执行人: </span>
                        <span>{{ item.planExecutor }}</span>
                    </div>
                </div>
            </div>
            <div class="task-list polling-list" v-for="(item) in pollingTaskList" :key="item.pollingTaskName" v-show="currentCleanTaskName == 3">
                <div class="task-list-title">
                    <div class="task-list-title-left">
                        {{ item.pollingTaskName }}
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
      selectValue: 0,
      itemNameIndex: 1,
      searchValue: '',
      selectOption: [
        { text: '全部', value: 0 },
        { text: '未开始', value: 1 },
        { text: '进行中', value: 2 },
        { text: '已完成', value: 3 }
      ],
      forthwithTaskList: [
        {
         taskNumber: '00009',
         status: 0,
         createTime: '05-31 17:21',
         site: '住院部-为行间',
         planExecutor: '沙卡就是',
         problemDescription: '等哈大大大大大大大大大大大大大大大大大'
        },
        {
         taskNumber: '00008',
         status: 1,
         createTime: '05-31 17:21',
         site: '住院部-为行间',
         planExecutor: '沙卡就是',
         problemDescription: '等哈大大大大大大大大大大大大大大大大大'
        },
        {
         taskNumber: '00007',
         status: 2,
         createTime: '05-31 17:21',
         site: '住院部-为行间',
         planExecutor: '沙卡就是',
         problemDescription: '等哈大大大大大大大大大大大大大大大大大'
        }
      ],
      specialTaskList: [
        {
         taskNumber: '00006',
         status: 0,
         createTime: '05-31 17:21',
         site: '住院部-为行间',
         planExecutor: '沙卡就是',
         cleaningItems: '等哈大大大大大大大大大大大大大大大大大'
        },
        {
         taskNumber: '00005',
         status: 1,
         createTime: '05-31 17:21',
         site: '住院部-为行间',
         planExecutor: '沙卡就是',
         cleaningItems: '等哈大大大大大大大大大大大大大大大大大'
        },
        {
         taskNumber: '00004',
         status: 2,
         createTime: '05-31 17:21',
         site: '住院部-为行间',
         planExecutor: '沙卡就是',
         cleaningItems: '等哈大大大大大大大大大大大大大大大大大'
        }
      ],
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
          path: "/home"
        })
      })
    };
    this.itemNameIndex = this.currentCleanTaskName
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","currentCleanTaskName"]),
  },

  methods: {
    ...mapMutations(['storeCurrentCleanTaskName']),
    onClickLeft() {
      this.$router.push({ path: "/home"})
    },
    onClickRight () {
        console.log('刷新了')
    },
    
    // 任务状态转换
    stausTransfer (num) {
        switch(num) {
            case 0:
                return '未开始'
                break;
            case 1:
                return '进行中'
                break;
            case 2:
                return '已完成'
                break;
        } 
    },

    // 任务名称点击事件
    taskItemNameEvent (num) {
        this.itemNameIndex = num;
        this.storeCurrentCleanTaskName(num)
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
                    .van-field__right-icon {
                        .van-icon {
                            font-size: 25px !important;
                            color: #101010 !important
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
                flex: 1;
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
                    margin: 0 12px;
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