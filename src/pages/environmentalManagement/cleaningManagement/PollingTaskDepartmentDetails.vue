<template>
  <div class="page-box" ref="wrapper">
    <div class="nav">
      <NavBar path="/pollingTaskDetails" title="巡检任务详情" />
    </div>
    <div class="content">
        <div class="content-top">
            <div class="department-name">
                <van-icon name="location" color="#101010" size="22" />
                <span>科室一</span>
            </div>
            <div class="tabs-area">
                <span v-for="(item,index) in tabsList" :class="{ 'spanStyle': currentTabIndex == index }" :key="index" @click="tabsClickEvent(item,index)">
                    {{ item }}
                </span>
            </div>
        </div>
        <div class="content-bottom">
            <div class="corner-list" v-for="(item,index) in departmentCornerList" :key="index" @click="cornerClickEvent(item,index)">
                <div class="corner-name">{{ item.name}}</div>
                <div class="corner-right">
                    <span>{{ item.isQualified }}</span>
                    <van-icon name="arrow" color="#101010"  size="25" />
                </div>
            </div>
        </div>
        <div class="btn-box" @click="allExamineQualifiedEvent">全部检查合格</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "PollingTaskDepartmentDetails",
  components: {
    NavBar
  },
  data() {
    return {
        currentTabIndex: 0,
        tabsList: ['功能区','检查合格','检查不合格'],
        departmentCornerList: [
            {
                name: '门诊部新馆一病区二号电梯',
                isQualified: '合格'
            },
            {
                name: '门诊部新馆一病区二号电梯',
                isQualified: '合格'
            },
            {
                name: '门诊部新馆一病区二号电梯',
                isQualified: '合格'
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
          path: "/pollingTaskDetails",
        })
      })
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo"]),
  },

  methods: {
    ...mapMutations(["changeIsLogin"]),

    //tab切换点击事件
    tabsClickEvent (item,index) {
        this.currentTabIndex = index
    },

    // 角落列表点击事件
    cornerClickEvent (item,index) {
        this.$router.push({path: '/pollingTaskDepartmentCornerDetails'})
    },

    // 全部检查合格事件
    allExamineQualifiedEvent () {}
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
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #F8F8F8;
    height: 0;
    .content-top {
        width: 98%;
        background: #fff;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
        padding: 10px 10px 0 10px;
        box-sizing: border-box;
        .department-name {
            color: #101010;
            font-size: 16px;
            font-weight: bold;
            >span {
                vertical-align: middle
            };
            /deep/ .van-icon {
                vertical-align: middle
            }
        };
        .tabs-area {
            width: 100%;
            margin-top: 22px;
            display: flex;
            align-items: center;
            >span {
                display: inline-block;
                height: 20px;
                margin-right: 30px;
                font-size: 12px;
                color: #101010
            };
            .spanStyle {
                color: #1965FF !important;
                border-bottom: 3px solid #1965FF
            }
        }
    };
    .content-bottom {
        flex: 1;
        overflow: auto;
        .corner-list {
            height: 40px;
            background: #fff;
            display: flex;
            border-radius: 6px;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            box-sizing: border-box;
            width: 98%;
            margin: 0 auto;
            margin-bottom: 10px;
            font-size: 14px;
            .corner-name {
                color: #101010;
                flex: 1;
                word-break: break-all
            };
            .corner-right {
                >span {
                    vertical-align: middle
                };
                /deep/ .van-icon {
                    vertical-align: middle
                }
            }
        };
        .cornerListStyle {
            background: #F7CABE !important
        }
    };
    .btn-box {
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
        text-align: center;
    }
  }
}
</style>