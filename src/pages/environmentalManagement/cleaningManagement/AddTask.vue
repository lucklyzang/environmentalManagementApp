<template>
  <div class="page-box" ref="wrapper">
    <van-overlay :show="overlayShow" />
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
      <NavBar path="/cleanTaskList" title="新增任务" />
    </div>
    <div class="content">
      <div class="result-picture">
        <div>
          图片
        </div>
        <div class="image-list">
          <div v-for="(item, index) in resultImgList" :key="index">
            <img :src="item" />
            <div class="icon-box"  @click="issueDelete(index)">
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
      <div class="category-box">
        <div class="category-title">
            <span>*</span>
            <span>类别</span>
        </div>
        <div class="select-box">
            <van-dropdown-menu active-color="#174E97">
                <van-dropdown-item v-model="categoryValue" :options="categoryOption" />
            </van-dropdown-menu>
        </div>
      </div>
      <div class="category-box">
        <div class="category-title">
            <span>*</span>
            <span>来源</span>
        </div>
        <div class="select-box">
            <van-dropdown-menu active-color="#174E97">
                <van-dropdown-item v-model="sourceValue" :options="sourceOption" />
            </van-dropdown-menu>
        </div>
      </div>
      <div class="category-box">
        <div class="category-title">
            <span>*</span>
            <span>位置</span>
        </div>
        <div class="select-box">
            <van-dropdown-menu active-color="#174E97">
                <van-dropdown-item v-model="locationValue" :options="locationOption" />
            </van-dropdown-menu>
        </div>
      </div>
      <div class="category-box completeDate-box">
        <div class="category-title">
            <span>*</span>
            <span>预计完成时间</span>
        </div>
        <div class="select-box" @click="datetimePickerClickEvent">
            <span>
                {{ getNowFormatDate(currentDate) }}
            </span>
            <van-icon name="arrow" color="#174E97" size="20" />
        </div>
      </div>
      <div class="category-box person-number-box">
        <div class="category-title">
            <span>*</span>
            <span>预计人数</span>
        </div>
        <div class="person-input-box">
            <van-field v-model="personNumberValue" type="number"/>
            <span>人</span>
        </div>
      </div>
      <div class="category-box person-number-box duration-box">
        <div class="category-title">
            <span>*</span>
            <span>预计时长</span>
        </div>
        <div class="person-input-box">
            <van-field v-model="durationValue" type="number"/>
            <span>小时</span>
        </div>
      </div>
      <div class="category-box">
        <div class="category-title">
            <span>*</span>
            <span>违反标准</span>
        </div>
        <div class="select-box">
            <van-dropdown-menu active-color="#174E97">
                <van-dropdown-item v-model="violateStandardValue" :options="violateStandardOption" />
            </van-dropdown-menu>
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
    <div class="task-start" @click="submitEvent">提交</div>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="photoBox">
        <div class="choose-photo">
          <van-icon name="photo" />
          <input
            name="uploadImg1"
            id="demo1"
            @change="previewFileOne"
            type="file"
            accept="image/album"
          />从图库中选择
        </div>
        <div class="photo-graph">
          <van-icon name="photograph" />
          <input
            name="uploadImg2"
            id="demo2"
            @change="previewFileTwo"
            type="file"
            accept="image/camera"
          />拍照
        </div>
        <div class="photo-cancel" @click="photoCancel">取消</div>
      </div>
    </transition>
    <van-popup v-model="showDateBox" position="bottom">
        <van-datetime-picker
            v-model="currentDate"
            @confirm="showDateBox = false"
            @cancel="showDateBox = false"
            type="datetime"
            title="选择完成时间"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <van-dialog v-model="deleteInfoDialogShow" title="确定删除此图片?" 
      confirm-button-color="#218FFF" show-cancel-button
      @confirm="sureDeleteEvent"
      >
    </van-dialog>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC, compress } from "@/common/js/utils";
import {getAliyunSign} from '@/api/login.js'
import axios from 'axios'
export default {
  name: "AddTask",
  components: {
    NavBar,
  },
  data() {
    return {
      photoBox: false,
      imgIndex: '',
      deleteInfoDialogShow: false,
      showDateBox: false,
      overlayShow: false,
      loadingShow: false,
      loadText: '提交中',
      imgOnlinePathArr: [],
      temporaryFileArray: [],
      enterRemark: "",
      personNumberValue: '',
      durationValue: '',
      categoryValue: 0,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      currentDate: new Date(),
      categoryOption: [
        {
            text: '请选择类别',
            value: 0
            
        },
        {
            text: '即时保洁任务',
            value: 1
            
        }
      ],
     sourceValue: 0,
     sourceOption: [
        {
            text: '请选择来源',
            value: 0
            
        },
        {
            text: '主管反馈',
            value: 1
            
        },
        {
            text: '保洁员反馈',
            value: 2
            
        },
        {
            text: '医护反馈',
            value: 3
            
        },
        {
            text: '病患反馈',
            value: 4
            
        }
      ],
      calendarPng: require("@/common/images/home/calendar-attendance.png"),
      locationValue: 0,
      locationOption: [
        {
            text: '请选择位置',
            value: 0
            
        },
        {
            text: '测试医院',
            value: 1
            
        },
        {
            text: '儿童医院',
            value: 2
            
        }
      ],
       violateStandardValue: 0,
       violateStandardOption: [
        {
            text: '请选择违反标准',
            value: 0
            
        },
        {
            text: '测试医院',
            value: 1
            
        },
        {
            text: '儿童医院',
            value: 2
            
        }
      ],
      calendarPng: require("@/common/images/home/calendar-attendance.png"),
      resultImgList: [],
    };
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/cleanTaskList",
        });
      });
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","timeMessage","ossMessage","chooseProject"]),
  },

  methods: {
    ...mapMutations(["changeIsLogin","changeTimeMessage","changeOssMessage"]),

    // 时间栏点击事件
    datetimePickerClickEvent () {
        this.showDateBox = true
    },

    // 格式化时间
    getNowFormatDate(currentDate) {    
        let seperator1 = "-";
        let seperator2 = ":";
        let month = currentDate.getMonth() + 1;
        let strDate = currentDate.getDate();
        let strMinutes = currentDate.getMinutes();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strMinutes >= 0 && strMinutes <= 9) {
            strMinutes = "0" + strMinutes;
        }
        let currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + currentDate.getHours() + seperator2 + strMinutes
        return currentdate;
    },

    // 任务提交事件
    async submitEvent() {
      if (this.categoryOption.filter((item) => { return item.value == this.categoryValue })[0]['text'] == '请选择类别') {
        this.$toast('请选择类别');
        return
      };
      if (this.sourceOption.filter((item) => { return item.value == this.sourceValue })[0]['text'] == '请选择来源') {
        this.$toast('请选择来源');
        return
      };
      if (this.locationOption.filter((item) => { return item.value == this.locationValue })[0]['text'] == '请选择位置') {
        this.$toast('请选择位置');
        return
      };
      if (!this.personNumberValue) {
        this.$toast('预计人数不能为空');
        return
      };
      if (!this.durationValue) {
        this.$toast('预计时长不能为空');
        return
      };
      if (this.violateStandardOption.filter((item) => { return item.value == this.violateStandardValue })[0]['text'] == '请选择违反标准') {
        this.$toast('请选择违反标准');
        return
      };
      // 上传图片到阿里云服务器
      if (this.resultImgList.length > 0) {
        this.loadText ='提交中';
        this.overlayShow = true;
        this.loadingShow = true;
        for (let imgI of this.temporaryFileArray) {
          if (Object.keys(this.timeMessage).length > 0) {
            // 判断签名信息是否过期
            if (new Date().getTime()/1000 - this.timeMessage['expire']  >= -30) {
              await this.getSign();
              await this.uploadImageToOss(imgI)
            } else {
              await this.uploadImageToOss(imgI)
            }
          } else {
            await this.getSign();
            await this.uploadImageToOss(imgI)
          }
        }
      }  
    },

    // 图片上传预览
    previewFileOne() {
      let file = document.getElementById("demo1").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size / 1024 / 1024 < 16;
      if (!isLt2M) {
        this.$dialog
          .alert({
            message: "上传图片大小不能超过16MB!",
            closeOnPopstate: true,
          })
          .then(() => {});
        return;
      }
      reader.addEventListener(
        "load",
        function () {
          // 压缩图片
          let result = reader.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let src = compress(img);
            _this.resultImgList.push(src);
            _this.temporaryFileArray.push(file);
            _this.photoBox = false;
            _this.overlayShow = false
          };
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    },

    //拍照预览
    previewFileTwo() {
      let file = document.getElementById("demo2").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size / 1024 / 1024 < 16;
      if (!isLt2M) {
        _this.$dialog
          .alert({
            message: "上传图片大小不能超过16MB!",
            closeOnPopstate: true,
          })
          .then(() => {});
        return;
      }
      reader.addEventListener(
        "load",
        function () {
          // 压缩图片
          let result = reader.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let src = compress(img);
            _this.resultImgList.push(src);
            _this.temporaryFileArray.push(file);
            _this.photoBox = false;
            _this.overlayShow = false
          };
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    },

    // 获取阿里云签名接口
			getSign (filePath = '') {
				return new Promise((resolve, reject) => {
					getAliyunSign().then((res) => {
						if (res && res.data.code == 200) {
							// 存储签名信息
							this.changeOssMessage(res.data.data);
							let temporaryTimeInfo = {};
							temporaryTimeInfo['expire'] = Number(res.data.data.expire);
							// 存储过期时间信息
							this.changeTimeMessage(temporaryTimeInfo);
							if (this.isExpire) {
								this.uploadImageToOss(filePath)
							};
							this.isExpire = false;
							resolve()
						} else {
							this.$toast({
								message: `${res.data.data.msg}`,
								type: 'fail'
							});
							reject()
						}
					})
					.catch((err) => {
            this.$toast({
              message: `${res.data.data.msg}`,
              type: 'fail'
            });
						reject()
					})
				})	
			},
			
			// 上传图片到阿里云服务器
			uploadImageToOss (filePath) {
				return new Promise((resolve, reject) => {
          // OSS地址
          const aliyunServerURL = this.ossMessage.host;
          // 存储路径(后台固定位置+随即数+文件格式)
          const aliyunFileKey = this.ossMessage.dir + new Date().getTime() + Math.floor(Math.random() * 100) + filePath.name;
          // 临时AccessKeyID0
          const OSSAccessKeyId = this.ossMessage.accessId;
          // 加密策略
          const policy = this.ossMessage.policy;
          // 签名
          const signature = this.ossMessage.signature;
          let formData = new FormData();
          formData.append('key',aliyunFileKey);
          formData.append('policy',policy);
          formData.append('OSSAccessKeyId',OSSAccessKeyId);
          formData.append('success_action_status','200');
          formData.append('Signature',signature);
          formData.append('file',filePath);
          axios({
            url: aliyunServerURL,
            method: 'post',
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'}
          }).then((res) => {
            this.imgOnlinePathArr.push(`${aliyunServerURL}/${aliyunFileKey}`);
            resolve();
            console.log('阿里云图片',this.imgOnlinePathArr);
          })
          .catch((err) => {
            reject()
          })
          })
			},


    // 拍照点击
    issueClickEvent() {
      this.photoBox = true;
      this.overlayShow = true;
    },

    // 结果照片删除
    issueDelete(index) {
      this.deleteInfoDialogShow = true;
      this.imgIndex = index
    },


    // 确定删除提示框确定事件
    sureDeleteEvent () {
      this.resultImgList.splice(this.imgIndex, 1);
    },

    // 拍照取消
    photoCancel() {
      this.photoBox = false;
      this.overlayShow = false;
    },
  },
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
      background: #f6f6f6;
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
        line-height: 30px;
      }
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        height: 100%;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer;
      }
    }
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
        line-height: 50px;
      }
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        height: 100%;
        top: 0;
        opacity: 0;
      }
    }
    .photo-cancel {
      position: relative;
      display: inline-block;
      padding: 8px 12px;
      overflow: hidden;
      color: @color-theme;
      text-decoration: none;
      text-indent: 0;
      line-height: 30px;
      font-weight: bold;
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
  }
  .content {
    flex: 1;
    display: flex;
    background: #fff;
    flex-direction: column;
    padding: 6px 0;
    overflow: auto;
    .category-box {
      padding: 0 8px;
      margin-bottom: 6px;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
      .category-title {
        font-size: 14px;
        color: #101010;
        >span {
            &:first-child {
                color: red
            }
        }

      };
      .select-box {
        flex: 1;
        width: 0;
        /deep/ .van-dropdown-menu {
            .van-dropdown-menu__bar {
                box-shadow: none !important;
                .van-dropdown-menu__item {
                    justify-content: flex-end !important;
                    .van-dropdown-menu__title {
                        color: #174E97 !important
                    };
                    .van-dropdown-menu__title::after {
                        border-color: transparent transparent #174E97 #174E97 !important;
                    }
                }
            }
        }
      }
    };
    .completeDate-box {
        .select-box {
          text-align: right;
            >span {
                vertical-align: middle
            };
            /deep/ .van-icon {
                vertical-align: middle
            }
        }
    };
    .person-number-box {
        .person-input-box {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            /deep/ .van-cell {
                padding: 16px 8px;
                box-sizing: border-box;
                width: 30%;
                .van-cell__value {
                    border: 1px solid #cacaca
                }
            };
            >span {
                color:#101010 !important
            }
        }
    };
    .duration-box {
        /deep/ .van-cell {
            width: 26% !important
        }
    };
    .result-picture {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      > div {
        font-size: 14px;
        color: #a1a0a0;
        &:first-child {
        }
        &:nth-child(2) {
          margin-left: 8px;
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          > div {
            width: 31%;
            height: 100px;
            vertical-align: top;
            margin-right: 2%;
            margin-top: 2%;
            position: relative;
            &:nth-child(1) {
              margin-top: 0;
            }
            &:nth-child(2) {
              margin-top: 0;
            }
            &:nth-child(3) {
              margin-top: 0;
            }
            &:nth-child(3n + 3) {
              margin-right: 0;
            }
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
              height: 100%;
            }
            &:last-child {
             display: flex;
             justify-content: center;
             align-items: center;
              background: #f2f2f2;
              /deep/ .van-icon {
                position: relative;
                top: 0;
                right: 0;
              }
            }
          }
        }
      }
    }
    .enter-remark {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      > div {
        font-size: 14px;
        color: #a1a0a0;
        &:first-child {
        }
        &:nth-child(2) {
          margin-left: 8px;
          flex: 1;
          /deep/ .van-cell {
            padding: 4px !important;
            border: 1px solid #cacaca;
          }
        }
      }
    }
  }
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
  }
}
</style>