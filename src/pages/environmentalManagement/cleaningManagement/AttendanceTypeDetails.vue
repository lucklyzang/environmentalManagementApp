<template>
  <div class="page-box">
    <div class="nav">
       <van-nav-bar
        :title="`${attendanceTypeDetailsMessage.attendanceTypeName}详情`"
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
        <div class="attendance-type-details-list" v-for="(item,index) in attendanceTypeDetailsList" :key="index">
            <div class="attendance-type-details-left">
                <img :src="attendanceTypePhotoPng" alt="">
            </div>
            <div class="attendance-type-details-right">
                <div>
                    {{ item.personName }}
                </div>
                <div>
                    <span>
                        日期
                    </span>
                    <span>
                        {{ item.date }}
                    </span>
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
  name: "AttendanceTypeDetails",
  components: {
    NavBar,
  },
  data() {
    return {
        attendanceTypePhotoPng: require("@/common/images/home/attendance-type-photo.png"),
        attendanceTypeDetailsList: [
            {
                personName: '张三',
                date: '2022-09-02(上午)'
            },
            {
                personName: '李四',
                date: '2022-09-02(上午)'
            }
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
    console.log(this.attendanceTypeDetailsMessage);
  },

  computed: {
    ...mapGetters(["userInfo","attendanceTypeDetailsMessage"]),
  },

  methods: {
    ...mapMutations([]),
    onClickLeft() {
      this.$router.push({ path: "/attendanceStatistics"})
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
    padding-top: 10px;
    box-sizing: border-box;
    .attendance-type-details-list {
        width: 98%;
        margin: 0 auto;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
        padding: 25px 0 25px 20px;
        box-sizing: border-box;
        margin-bottom: 10px;
        display: flex;
        .attendance-type-details-left {
            >img {
                width: 55px;
                height: 57px
            }
        };
        .attendance-type-details-right {
            margin-left: 20px;
            >div {
                &:nth-child(1) {
                    font-size: 16px;
                    color: #101010;
                    margin-bottom: 20px
                };
                &:nth-child(2) {
                    line-height: 20px;
                    >span {
                        font-size: 14px;
                        color: #9E9E9A;
                        &:nth-child(1) {
                            margin-right: 6px
                        }
                        &:nth-child(2) {
                            color: #101010
                        }
                    }
                }
            }
        }
    }
  }
}
</style>