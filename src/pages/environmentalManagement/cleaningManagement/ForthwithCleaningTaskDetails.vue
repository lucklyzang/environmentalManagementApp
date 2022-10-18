<template>
  <div class="page-box" ref="wrapper">
    <van-overlay :show="overlayShow" />
    <div class="nav">
      <NavBar path="/cleaningTask" title="任务详情" />
    </div>
    <div class="content">
      <div class="forthwith-task-number">
        <span>即时保洁编号000004</span>
        <span>未开始</span>
      </div>
      <div class="location">
        <span>位置</span>
        <span>住院一部为何是哪个键</span>
      </div>
      <div class="location">
        <span>创建时间</span>
        <span>05-31 17:21</span>
      </div>
      <div class="location">
        <span>计划执行人</span>
        <span>王秀芬;张三</span>
      </div>
      <div class="location">
        <span>预计时间</span>
        <span>0.5小时</span>
      </div>
      <div class="issue-picture">
        <div>问题图片</div>
        <div class="image-list">
          <img :src="calendarPng" alt="">
          <img :src="calendarPng" alt="">
          <img :src="calendarPng" alt="">
          <img :src="calendarPng" alt="">
        </div>
      </div>
      <div class="remark">
        <div>备注</div>
        <div class="remark-content">
          沙克垃圾急急急急急急急急急急急急急急急大家奥克兰撒娇了撒娇撒刘莎莎辣椒水贷记卡零三零
        </div>
      </div>
      <div class="result-picture" v-show="isTaskStart">
        <div>
          <span>*</span>
          结果图片
        </div>
        <div class="image-list">
          <div v-for="(item, index) in resultImgList" :key='index'>
						<img :src="item" />
             <div class="icon-box" @click="issueDelete(index)">
                <van-icon
                name="delete"
                color="#d70000"
                />
            </div>
					</div>
					<div @click="issueClickEvent">
						<van-icon name="plus" size="30" color="#101010" />
					</div>
        </div>
      </div>
      <div class="enter-remark" v-show="isTaskStart">
        <div>
          <span>*</span>
          备注
        </div>
        <div class="remark-box">
         <van-field
            v-model="enterRemark"
            rows="3"
            autosize
            type="textarea"
            placeholder="请输入备注"
        />
        </div>
      </div>
    </div>
    <div class="task-start" @click="taskStartEvent" v-show="!isTaskStart">
      任务开始
    </div>
    <div class="task-operation-box" v-show="isTaskStart">
      <div class="task-no-complete" @click="taskNoCompleteEvent">任务未完成</div>、
      <div class="task-complete" @click="taskCompleteEvent">任务完成</div>
    </div>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="photoBox">
        <div class="choose-photo">
          <van-icon name="photo" />
          <input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/album"/>从图库中选择
        </div>
        <div class="photo-graph">
          <van-icon name="photograph" />
          <input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" accept="image/camera"/>拍照
        </div>
        <div class="photo-cancel" @click="photoCancel">取消</div>
      </div>
    </transition>
    <van-dialog v-model="deleteInfoDialogShow" title="确定删除此图片?" 
      confirm-button-color="#218FFF" show-cancel-button
      @confirm="sureDeleteEvent"
      >
    </van-dialog> 
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/products.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC, compress } from "@/common/js/utils";
export default {
  name: "ForthwithCleaningTaskDetails",
  components: {
    NavBar
  },
  data() {
    return {
      photoBox: false,
      imgIndex: '',
      deleteInfoDialogShow: false,
      isTaskStart: false,
      overlayShow: false,
      enterRemark: '',
      calendarPng: require("@/common/images/home/calendar-attendance.png"),
      resultImgList: []
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/cleaningTask",
        })
      })
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo"]),
  },

  methods: {
    ...mapMutations(["changeIsLogin","storeCurrentCleanTaskName"]),

      // 任务开始事件
      taskStartEvent () {
        this.isTaskStart = true
      },

      // 任务未完成事件
      taskNoCompleteEvent () {

      },

      // 任务完成事件
      taskCompleteEvent () {

      },

      // 图片上传预览
      previewFileOne() {
        let file = document.getElementById("demo1").files[0];
        let _this = this;
        let reader = new FileReader();
        let isLt2M = file.size/1024/1024 < 16;
        if (!isLt2M) {
          this.$dialog.alert({
            message: '上传图片大小不能超过16MB!',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };  
        reader.addEventListener("load", function () {
          // 压缩图片
          let result = reader.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let src = compress(img);
            _this.resultImgList.push(src);
            _this.photoBox = false;
            _this.overlayShow = false
          }
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        };
      },

      //拍照预览
      previewFileTwo() {
        let file = document.getElementById("demo2").files[0];
        let _this = this;
        let reader = new FileReader();
        let isLt2M = file.size/1024/1024 < 16;
        if (!isLt2M) {
          _this.$dialog.alert({
            message: '上传图片大小不能超过16MB!',
            closeOnPopstate: true
          }).then(() => {
          });
          return
        };  
        reader.addEventListener("load", function () {
          // 压缩图片
          let result = reader.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let src = compress(img);
            _this.resultImgList.push(src);
            _this.photoBox = false;
            _this.overlayShow = false
          }
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        };
      },

      // 拍照点击
      issueClickEvent () {
        this.photoBox = true;
        this.overlayShow = true
      },

      // 结果照片删除
      issueDelete (index) {
        this.deleteInfoDialogShow = true;
        this.imgIndex = index
      },

      // 确定删除提示框确定事件
      sureDeleteEvent () {
        this.resultImgList.splice(this.imgIndex, 1);
      },

      // 拍照取消
      photoCancel () {
        this.photoBox = false;
        this.overlayShow = false
      }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  height: 0;
  .content-wrapper();
   .choose-photo-box {
    position: fixed;
    margin: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1000;
    font-size: 0;
    > div {
      width: 100%;
      text-align: center;
      font-size: 16px;
      background: #f6f6f6
    }
    .choose-photo {
      padding: 8px 10px;
      height: 30px;
      .bottom-border-1px(#cbcbcb);
      line-height: 30px;
      position: relative;
      cursor: pointer;
      color: @color-theme;
      overflow: hidden;
      display: inline-block;
      *display: inline;
      *zoom: 1;
      /deep/ .van-icon {
        vertical-align: top;
        font-size: 20px;
        display: inline-block;
        line-height: 30px
      };
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        height: 100%;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer
      }
    };
    .photo-graph {
      position: relative;
      display: inline-block;
      height: 50px;
      overflow: hidden;
      .bottom-border-1px(#cbcbcb);
      color: @color-theme;
      text-decoration: none;
      text-indent: 0;
      line-height: 50px;
      /deep/ .van-icon {
        vertical-align: top;
        font-size: 20px;
        display: inline-block;
        line-height: 50px
      };
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        height: 100%;
        top: 0;
        opacity: 0;
      }
    };
    .photo-cancel {
      position: relative;
      display: inline-block;
      padding: 8px 12px;
      overflow: hidden;
      color: @color-theme;
      text-decoration: none;
      text-indent: 0;
      line-height: 30px;
      font-weight: bold
    }
  }
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
    background: #F8F8F8;
    flex-direction: column;
    padding: 6px 0;
    overflow: auto;
    .forthwith-task-number {
      padding: 0 8px;
      margin-bottom: 6px;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
      >span {
        font-size: 14px;
        display: inline-block;
        &:first-child {
          flex: 1;
          color: #289E8E;
          padding-right: 4px;
          box-sizing: border-box;
          .no-wrap()
        };
        &:last-child {
          color: #a1a0a0;
          width: 60px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          justify-content: center;
          border-radius: 4px;
          background: #f3f3f3;
          border: 1px solid #c4c4c4
        }
      }
    };
    .location {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
       >span {
        font-size: 14px;
        display: inline-block;
        &:first-child {
          color: #a1a0a0
        };
        &:last-child {
          color: #101010;
          flex: 1;
          text-align: right;
          padding-left: 8px;
          box-sizing: border-box;
          word-break: break-all
        }
      }
    };
    .issue-picture {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      >div {
        font-size: 14px;
        color: #a1a0a0;
        &:first-child {

        };
        &:last-child {
          flex: 1;
          margin-left: 8px;
          >img {
            width: 31%;
            height: 80px;
            margin-right: 2%;
            margin-bottom: 6px;
            &:nth-child(3n+3) {
              margin-right: 0
            }
          }
        }
      }
    };
    .remark {
      padding: 12px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      >div {
        font-size: 14px;
        color: #a1a0a0;
        line-height: 20px;
        &:first-child {

        };
        &:last-child {
          flex: 1;
          margin-left: 8px;
          color: #101010
        }
      }  
    };
    .result-picture {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      >div {
        font-size: 14px;
        color: #a1a0a0;
        span {
          color: red
        };
        &:first-child {

        };
        &:nth-child(2) {
          margin-left: 8px;
          flex: 1;
          flex-wrap: wrap;
          display: flex;
          >div {
            width: 31%;
            height: 90px;
            vertical-align: top;
            margin-right: 2%;
            margin-top: 2%;
            position: relative;
            &:nth-child(1) {
              margin-top: 0;
            };
            &:nth-child(2) {
              margin-top: 0;
            };
            &:nth-child(3) {
              margin-top: 0;
            };
            &:nth-child(3n+3) {
              margin-right: 0;
            };
            .icon-box {
                position: absolute;
                bottom: 0;
                right: 0;
                display: flex;
                width: 100%;
                padding: 2px 0;
                box-sizing: border-box;
                justify-content: center;
                align-items: center;
                background: #616161;
                /deep/ .van-icon {
                }  
            };
            img {
              width: 100%;
              height: 100%
            };
            &:last-child {
              display: flex;
              justify-content: center;
              align-items: center;
              background: #f2f2f2;
              /deep/ .van-icon{
                position: relative;
                top: 0;
                right: 0;
              }
            }
          }
        }
      }  
    };
    .enter-remark {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      >div {
        font-size: 14px;
        color: #a1a0a0;
        span {
          color: red
        };
        &:first-child {

        };
        &:nth-child(2) {
          margin-left: 8px;
          flex: 1;
          /deep/ .van-cell {
            padding: 4px !important;
            border: 1px solid #cacaca
          }
        }
      }    
    }
  };
  .task-start {
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
  };
  .task-operation-box {
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