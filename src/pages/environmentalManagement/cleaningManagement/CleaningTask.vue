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
                    <van-dropdown-menu active-color="#1989fa">
                        <van-dropdown-item v-model="selectValue"  :options="selectOption" @change="selecOptionChangeEvent" />
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
                <div @click="taskItemNameEvent(1)" v-show="currentCleanTaskName.forthwithTaskShow" :class="{'forthwithItemStyle':itemNameIndex == 1}">{{`即时${forthwithTaskList.length}`}}</div>
                <div @click="taskItemNameEvent(2)" v-show="currentCleanTaskName.specialTaskShow" :class="{'specialItemStyle':itemNameIndex == 2}">{{`专项${specialTaskList.length}`}}</div>
                <div @click="taskItemNameEvent(3)" v-show="currentCleanTaskName.pollingTaskShow" :class="{'pollingItemStyle':itemNameIndex == 3}">{{`巡检${pollingTaskList.length}`}}</div>
            </div>
        </div>
        <div class="content-bottom">
            <div class="task-list-box" v-if="currentCleanTaskName.num == 1">
                <van-empty v-show="forthwithEmptyShow" description="暂无数据" />
                <div class="task-list" v-show="!forthwithEmptyShow" v-for="(item,index) in forthwithTaskList" @click="forthwithTaskDetailsEvent(item,generateTaskNumber('即时',index))" :key="index">
                    <div class="task-list-title">
                        <div class="task-list-title-left">
                            即时任务编号{{ generateTaskNumber('即时',index) }}
                        </div>
                        <div class="task-list-title-right" :class="{
                            'underwayStyle' : item.state == 2, 
                            'completeStyle' : item.state == 4,
                            'reviewStyle' : item.state == 3,
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
                        <div class="one-line" v-show="item.state != 1">
                            <span>开始时间: </span>
                            <span>{{ item.startTime }}</span>
                        </div>
                        <div class="one-line" v-show="item.state == 4 || item.state == 5">
                            <span>完成时间: </span>
                            <span>{{ item.finishTime }}</span>
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
                <van-empty v-show="specialEmptyShow" description="暂无数据" />   
                <div class="task-list special-list" v-show="!specialEmptyShow" v-for="(item,index) in specialTaskList" @click="specialTaskDetailsEvent(item,generateTaskNumber('专项',index))" :key="item.taskNumber">
                    <div class="task-list-title">
                        <div class="task-list-title-left">
                            编号{{ generateTaskNumber('专项',index) }}
                        </div>
                        <div class="task-list-title-right" :class="{
                                'underwayStyle' : item.state == 2, 
                                'completeStyle' : item.state == 4,
                                'reviewStyle' : item.state == 3,
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
                        <div class="one-line" v-show="item.state != 1">
                            <span>开始时间: </span>
                            <span>{{ item.startTime }}</span>
                        </div>
                        <div class="one-line" v-show="item.state == 4 || item.state == 5">
                            <span>完成时间: </span>
                            <span>{{ item.finishTime }}</span>
                        </div>
                        <div class="one-line">
                            <span>计划执行人: </span>
                            <span>{{ `${item.workerName}、${item.managerName}` }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-list-box" v-if="currentCleanTaskName.num == 3">
                <van-empty v-show="pollingEmptyShow" description="暂无数据" />  
                <div class="task-list polling-list" v-show="!pollingEmptyShow" v-for="(item,index) in pollingTaskList" @click="pollingTaskDetailsEvent(item)" :key="item.pollingTaskName">
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
      forthwithEmptyShow: false,
      specialEmptyShow: false,
      pollingEmptyShow: false,
      overlayShow: false,
      currentSelectValue: -1,
      selectValue: -1,
      itemNameIndex: 1,
      searchValue: '',
      currenDate: new Date(),
      selectOption: [
        { text: '全部', value: -1 },
        { text: '未开始', value: 1 },
        { text: '进行中', value: 2 },
        { text: '复核中', value: 3 },
        { text: '已完成', value: 4 },
        { text: '已复核', value: 5 }
      ],
      forthwithTaskList: [],
      specialTaskList: [],
      allForthwithTaskList: [],
      allSpecialTaskList: [],
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

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path != '/cleanTaskList') {
        //非此页面进入时,回显筛选状态
        if (JSON.stringify(vm.cleanTaskDetails) != "{}" && vm.cleanTaskDetails.selectValue) {
            vm.currentSelectValue = vm.cleanTaskDetails.selectValue;
            vm.selectValue = vm.cleanTaskDetails.selectValue
        }
      }
	});
    next() 
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
    if (this.currentCleanTaskName.forthwithTaskShow && this.currentCleanTaskName.specialTaskShow) {
        this.getForthwithTaskList(0);
        this.getSpecialTaskList(1)
    } else if (this.currentCleanTaskName.forthwithTaskShow) {
        this.getForthwithTaskList(0);
    } else if (this.currentCleanTaskName.specialTaskShow) {
        this.getSpecialTaskList(1)
    }
  },

  watch: {
        selectValue: {
            handler(newName, oldName) {  
                this.currentSelectValue = newName;
                if (this.searchValue) {
                    this.searchValue = ''
                };
                if (this.currentCleanTaskName.forthwithTaskShow && this.currentCleanTaskName.specialTaskShow) {
                    if (newName == -1) {
                        this.forthwithTaskList = this.allForthwithTaskList;
                        if (this.forthwithTaskList.length == 0) {
                            this.forthwithEmptyShow = true
                        } else {
                            this.forthwithEmptyShow = false
                        };
                        this.specialTaskList = this.allSpecialTaskList;
                        if (this.specialTaskList.length == 0) {
                            this.specialEmptyShow = true
                        } else {
                            this.specialEmptyShow = false
                        };
                        return
                    };
                    this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == newName});
                    if (this.forthwithTaskList.length == 0) {
                        this.forthwithEmptyShow = true
                    } else {
                        this.forthwithEmptyShow = false
                    };
                    this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == newName});
                    if (this.specialTaskList.length == 0) {
                        this.specialEmptyShow = true
                    } else {
                        this.specialEmptyShow = false
                    }
                } else if (this.currentCleanTaskName.forthwithTaskShow) {
                    if (newName == -1) {
                        this.forthwithTaskList = this.allForthwithTaskList;
                        if (this.forthwithTaskList.length == 0) {
                            this.forthwithEmptyShow = true
                        } else {
                            this.forthwithEmptyShow = false
                        };
                        return
                    };
                    this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == newName});
                    if (this.forthwithTaskList.length == 0) {
                        this.forthwithEmptyShow = true
                    } else {
                        this.forthwithEmptyShow = false
                    }
                } else if (this.currentCleanTaskName.specialTaskShow) {
                    if (newName == -1) {
                        this.specialTaskList = this.allSpecialTaskList;
                        if (this.specialTaskList.length == 0) {
                            this.specialEmptyShow = true
                        } else {
                            this.specialEmptyShow = false
                        };
                        return
                    };
                    this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == newName});
                    if (this.specialTaskList.length == 0) {
                        this.specialEmptyShow = true
                    } else {
                        this.specialEmptyShow = false
                    }
                }
            },
            deep: true
        }
  },

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
        // if (this.selectValue != -1) {
        //     this.selectValue = -1;
        //     this.currentSelectValue = -1
        // };
        if (this.currentCleanTaskName.forthwithTaskShow && this.currentCleanTaskName.specialTaskShow) {
            this.getForthwithTaskList(0);
            this.getSpecialTaskList(1)
        } else if (this.currentCleanTaskName.forthwithTaskShow) {
            this.getForthwithTaskList(0);
        } else if (this.currentCleanTaskName.specialTaskShow) {
            this.getSpecialTaskList(1)
        }
    },
    
    // 任务状态转换
    stausTransfer (num) {
        switch(num) {
            case 1:
                return '未开始'
                break;
            case 2:
                return '进行中'
                break;
            case 3:
                return '复核中'
                break;
            case 4:
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
        let month = this.currentCleanTaskName.originalDate.getMonth() + 1;
        let Date = this.currentCleanTaskName.originalDate.getDate();
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

    // 查询即时保洁任务列表
    getForthwithTaskList (taskType) {
        let data = {
            proId : this.userInfo.proIds[0], // 所属项目id
            queryDate: this.currentCleanTaskName.date, // 查询时间
            managerId: this.userInfo.id, // 保洁主管id    
            taskType: taskType // 0-即时，1-专项
        };
        this.loadingShow = true;
        this.overlayShow = true;
        this.forthwithTaskList = [];
        queryCleaningManageTaskList(data).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
	      if (res && res.data.code == 200) {
                this.forthwithTaskList = res.data.data.filter((item) => { return item.state != 6 && item.state != 0});
                this.allForthwithTaskList = this.forthwithTaskList;
                if (this.currentSelectValue == -1) {
                    this.forthwithTaskList = this.allForthwithTaskList;
                    if (this.forthwithTaskList.length == 0) {
                        this.forthwithEmptyShow = true
                    } else {
                        this.forthwithEmptyShow = false
                    };
                    return
                };
                this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == this.currentSelectValue});
                if (this.forthwithTaskList.length == 0) {
                    this.forthwithEmptyShow = true
                } else {
                    this.forthwithEmptyShow = false
                }
                if (this.forthwithTaskList.length == 0) {
                    this.forthwithEmptyShow = true
                } else {
                    this.forthwithEmptyShow = false
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

    // 查询专项保洁任务列表
    getSpecialTaskList (taskType) {
        let data = {
            proId : this.userInfo.proIds[0], // 所属项目id
            queryDate: this.currentCleanTaskName.date, // 查询时间
            managerId: this.userInfo.id, // 保洁主管id    
            taskType: taskType // 0-即时，1-专项
        };
        this.loadingShow = true;
        this.overlayShow = true;
        this.specialTaskList = [];
        queryCleaningManageTaskList(data).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
	      if (res && res.data.code == 200) {
                this.specialTaskList = res.data.data.filter((item) => { return item.state != 6 && item.state != 0});
                this.allSpecialTaskList = this.specialTaskList;
                if (this.currentSelectValue == -1) {
                    this.specialTaskList = this.allSpecialTaskList;
                    if (this.specialTaskList.length == 0) {
                        this.specialEmptyShow = true
                    } else {
                        this.specialEmptyShow = false
                    };
                    return
                };
                this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == this.currentSelectValue});
                if (this.specialTaskList.length == 0) {
                    this.specialEmptyShow = true
                } else {
                    this.specialEmptyShow = false
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
    },

    // 任务名称点击事件
    taskItemNameEvent (num) {
        let temporaryMessage = this.currentCleanTaskName;
        temporaryMessage['num'] = num;
        this.storeCurrentCleanTaskName(temporaryMessage);
        if (this.searchValue) { this.searchValue = ''}
        this.itemNameIndex = num;
        if (this.currentSelectValue == -1) {
            this.forthwithTaskList = this.allForthwithTaskList;
            if (this.forthwithTaskList.length == 0) {
                this.forthwithEmptyShow = true
            } else {
                this.forthwithEmptyShow = false
            };
            this.specialTaskList = this.allSpecialTaskList;
            if (this.specialTaskList.length == 0) {
                this.specialEmptyShow = true
            } else {
                this.specialEmptyShow = false
            };
            return 
        };
        this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == this.currentSelectValue});
        if (this.forthwithTaskList.length == 0) {
            this.forthwithEmptyShow = true
        } else {
            this.forthwithEmptyShow = false
        };
        this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == this.currentSelectValue});
        if (this.specialTaskList.length == 0) {
            this.specialEmptyShow = true
        } else {
            this.specialEmptyShow = false
        }
    },

    // 搜索事件
    searchEvent () {
        if (this.itemNameIndex == 1) {
            if (!this.searchValue) {
                this.forthwithTaskList = this.allForthwithTaskList;
                this.currentSelectValue = -1;
                this.selectValue = -1
            } else {
                this.forthwithTaskList = this.forthwithTaskList.filter((item) => { return item.structureName.indexOf(this.searchValue) != -1 || item.depName.indexOf(this.searchValue) != -1 ||
                item.areaImmediateName.indexOf(this.searchValue) != -1  ||  (this.extractSpaceMessage(item.spaces)).indexOf(this.searchValue) != -1 ||
                item.workerName.indexOf(this.searchValue) != -1 || item.managerName.indexOf(this.searchValue) != -1}
                )
            };
            if (this.forthwithTaskList.length == 0) {
                this.forthwithEmptyShow = true
            } else {
                this.forthwithEmptyShow = false
            }
        } else if (this.itemNameIndex == 2) {
            if (!this.searchValue) {
                this.specialTaskList = this.allSpecialTaskList;
                this.currentSelectValue = -1;
                this.selectValue = -1
            } else {
                this.specialTaskList = this.specialTaskList.filter((item) => { return item.structureName.indexOf(this.searchValue) != -1 || item.depName.indexOf(this.searchValue) != -1 ||
                item.areaSpecialName.indexOf(this.searchValue) != -1 || item.workerName.indexOf(this.searchValue) != -1 || item.managerName.indexOf(this.searchValue) != -1}
                )
            };
            if (this.specialTaskList.length == 0) {
                this.specialEmptyShow = true
            } else {
                this.specialEmptyShow = false
            }
        }
    },

    // 即时保洁任务点击进入任务详情事件
    forthwithTaskDetailsEvent(item,number) {
        this.storeCleanTaskDetails(item);
        let temporaryMessage = this.cleanTaskDetails;
        temporaryMessage['num'] = number;
        temporaryMessage['selectValue'] = this.selectValue;
        this.storeCleanTaskDetails(temporaryMessage);
        this.$router.push({path: '/forthwithCleaningTaskDetails'})
    },

    // 专项保洁任务点击进入任务详情事件
    specialTaskDetailsEvent(item,number) {
        this.storeCleanTaskDetails(item);
        let temporaryMessage = this.cleanTaskDetails;
        temporaryMessage['num'] = number;
        temporaryMessage['selectValue'] = this.selectValue;
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
        .task-list-box {
            height: 100%;
            overflow: auto;
            position: relative;
            /deep/ .van-empty {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%)
            };
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