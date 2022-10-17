<template>
  <div class="page-box" ref="wrapper">
    <van-overlay :show="overlayShow" />
    <div class="nav">
      <NavBar path="/pollingTaskDepartmentDetails" title="功能区详情" />
    </div>
    <div class="content">
      <div class="forthwith-task-number">
        门整部就撒开了撒娇撒是
      </div>
      <div class="inspection-standard-box">
        <div class="inspection-standard-title">
            功能区检查标准
        </div>
        <div class="inspection-standard-content">
            <div class="inspection-standard-content-list" v-for="(item,index) in inspectionStandardList" :key="index">
                <div class="describe-name">
                    {{ item.describe }}
                </div>
                <van-switch v-model="item.isPass" size="20px" active-color="#3dde3d" inactive-color="#cd0909" />
            </div>
        </div>
      </div>
      <div class="result-picture">
        <div class="result-picture-box">
            <div>
            拍照图片
            </div>
            <div class="image-list">
                <div v-for="(item, index) in resultImgList" :key='index'>
                    <img :src="item" />
                    <van-icon name="cross" @click="issueDelete(index)" color="#101010" />
                </div>
                <div @click="issueClickEvent">
                    <van-icon name="plus" size="30" color="#101010" />
                </div>
            </div>
        </div>    
      </div>
      <div class="enter-remark">
        <div>
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
    <div class="task-operation-box">
      <div class="task-no-complete" @click="backEvent">返回</div>、
      <div class="task-complete" @click="submitEvent">提交</div>
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
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/products.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC, compress } from "@/common/js/utils";
export default {
  name: "PollingTaskDepartmentDetails",
  components: {
    NavBar
  },
  data() {
    return {
      photoBox: false,
      overlayShow: false,
      enterRemark: '',
      resultImgList: [],
      inspectionStandardList: [
        {
            describe: '地面干净光亮、无污染、垃圾、碎屑',
            isPass: true
        },
        {
            describe: '壁面干净光亮',
            isPass: false
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
          path: "/pollingTaskDepartmentDetails"
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

      // 提交事件
      submitEvent () {

      },

      // 返回事件
      backEvent () {
        this.$router.push({
          path: "/pollingTaskDepartmentDetails"
        })
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
             _this.resultImgList.push(src)
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
            _this.resultImgList.push(src)
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
        this.resultImgList.splice(index,1)
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
    flex-direction: column;
    padding: 6px 0;
    overflow: auto;
    background: #F8F8F8;
    .forthwith-task-number {
      padding: 12px 8px;
      line-height: 20px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #1965FF;
      word-break: break-all
    };
    .inspection-standard-box {
        padding: 0 8px;
        margin-bottom: 6px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        background: #fff;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        .inspection-standard-title {
            width: 100%;
            color: #1965FF;
            .bottom-border-1px(#bababa);
            height: 45px;
            line-height: 45px
        };
        .inspection-standard-content {
            width: 100%;
            .inspection-standard-content-list {
                padding: 9px 0;
                box-sizing: border-box;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .describe-name {
                  color: #888888;
                  flex: 1;
                  padding-right: 4px;
                  box-sizing: border-box;
                  word-break: break-all;
                  line-height: 20px;
                }
            }
        }
    };
    .result-picture {
        padding: 14px 8px;
        box-sizing: border-box;
        background: #fff;
        .result-picture-box {
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding-bottom: 14px;
            box-sizing: border-box;
            .bottom-border-1px(#cbcbcb);
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
                display: flex;
                flex-wrap: wrap;
                flex: 1;
                >div {
                    width: 31%;
                    height: 90px;
                    display: inline-block;
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
                    /deep/ .van-icon {
                    position: absolute;
                    top: -12px;
                    right: 0
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
                        right: 0
                      }
                    }
                  }
                }
            }
        }    
    };
    .enter-remark {
      padding: 14px 8px;
      margin-bottom: 6px;
      background: #fff;
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
  .task-operation-box {
    background: #F8F8F8;
    height: 80px;
    display: flex;
    width: 100%;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    >div {
      width: 40%;
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