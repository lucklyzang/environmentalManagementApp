<template>
  <div class="page-box" id="top-content">
    <NavBar title="消息" path="myInfo" />
    <van-empty :description="descriptionContent" v-show="emptyShow" />
    <div class="content-box">
        <van-loading type="spinner" v-show="loadingShow"/>
        <div class="message-list" v-for="(item,index) in messageList" :key="index" @click="jumpSystemMessageDetailsPage(item)">
            <div class="top">
              <div class="message-title">
                <span v-show="item.status == 0"></span>
                <van-icon name="comment-o" size="18"/>
                <span class="message-title">{{item.title}}</span>
              </div>
              <div class="message-date">
                {{item.createTime}}
              </div>
            </div>
            <div class="bottom">
              <P v-html="item.introduction"></P>
            </div>
            <div class="view-details" v-show="item.type != 0">
              <span>查看详情</span>
              <van-icon name="arrow" color="#9c9c9c" />
            </div>
        </div>
        <span class="expect" v-show="!loadingShow && !emptyShow">- 没有更多消息了 -</span>
    </div>
  </div>
</template>
<script>
  import NavBar from '@/components/NavBar'
  import { mapGetters, mapMutations } from 'vuex'
  import {
    queryNewsList,
    setMessageRead,
    queryNewsDetails
  } from '@/api/products.js'
  import {IsPC} from '@/common/js/utils'
  export default {
    name: 'SystemMessage',
    components:{
	    NavBar
    },
    data() {
      return {
        loadingShow: false,
        descriptionContent: '暂无消息',
        emptyShow: false,
        messageList: []
      }
    },

    mounted() {
      this.toTop();
      // 控制设备物理返回按键
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          pushHistory();
					this.$router.push({
						path: '/myInfo'
					})
        })
      };
      this.queryNewsListEvent()
    },

    watch: {
    },

    computed:{
      ...mapGetters([
        'userInfo',
        'systemMessageId'
      ])
    },

    beforeRouteEnter (to, from, next) {
      next()
    },

    beforeRouteLeave (to, from, next) {
      next()
    },

    methods:{
      ...mapMutations([
        'changeSystemMessageId'
      ]),

      //让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},

      juddgeIspc () {
        return IsPC()
      },

      // 查询消息列表
      queryNewsListEvent() {
        this.loadingShow = true;
        this.emptyShow = false;
        this.messageList = [];
        queryNewsList().then((res) => {
          this.loadingShow = false;
            if (res && res.data.code == 0) {
              if (res.data.list.length == 0) {
                this.emptyShow = true;
              } else {
                this.messageList = res.data.list
              }
            } else {
            this.$toast({
              message: `${res.data.msg}`,
              position: 'bottom'
            })
          }
        })
        .catch((err) => {
          this.loadingShow = false;
          this.emptyShow = false;
          this.$toast({
            message: `${err.message}`,
            position: 'bottom'
          })
        })
      },

      //设置消息为已读
      setMessageReadEvent (id,type) {
        setMessageRead(id).then((res) => {
            if (res && res.data.code == 0) {
              this.changeSystemMessageId(id);
              if (type == 1) {
                // 富文本详情
                this.$router.push({path: '/systemMessageDetails'})
                // h5页面路径
              } else if (type == 2) {
                this.queryNewsDetailsEvent()
              }
            } else {
            this.$toast({
              message: `${res.data.msg}`,
              position: 'bottom'
            })
          }
        })
        .catch((err) => {
          this.$toast({
            message: `${err.message}`,
            position: 'bottom'
          })
        })
      },

       // 查询消息详情
      queryNewsDetailsEvent() {
        this.loadingShow = true;
        queryNewsDetails(this.systemMessageId).then((res) => {
          this.loadingShow = false;
            if (res && res.data.code == 0) {
              window.location.href = res.data.data
            } else {
            this.$toast({
              message: `${res.data.msg}`,
              position: 'bottom'
            })
          }
        })
        .catch((err) => {
          this.loadingShow = false;
          this.$toast({
            message: `${err.message}`,
            position: 'bottom'
          })
        })
      },

      //跳转到消息详情页
      jumpSystemMessageDetailsPage (item) {
        //设置消息已读
        this.setMessageReadEvent(item.id,item.type)
      }
    }
  }
</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .page-box {
    .content-wrapper();
     /deep/ .van-nav-bar {
        .van-icon {
            color: #fff !important;
            font-size: 18px !important
        };
        .van-nav-bar__title {
            color: #fff !important;
            font-size: 16px !important
        }
    };
    /deep/ .van-empty {
      width: 100%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      z-index: 100
    };
    .content-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background: @color-background;
      .message-list {
          &:first-child {
            margin-top: 40px
          };
          width: 94%;
          margin: 0 auto;
          margin-bottom: 10px;
          padding: 15px;
          box-sizing: border-box;
          background: @color-block;
          border-radius: 8px;
          .top {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            .message-title {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              flex: 1;
              padding-right: 4px;
              box-sizing: border-box;
              width: 0;
              >span {
                &:nth-child(3) {
                  flex: 1;
                  display: inline-block;
                  color: #fff;
                  font-size: 12px;
                  word-break: break-all;
                  .no-wrap();
                };
                &:nth-child(1) {
                  margin-right: 4px;
                  width: 9px;
                  height: 9px;
                  background:#f73d76;
                  border-radius: 50%
                }
              };
              /deep/ .van-icon-comment-o {
                color: #fff;
                margin-top: 1px;
                margin-right: 4px
              }
            };
            .message-date {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              color: #fff;
              font-size: 12px;
              color: #fff
            }
          };
          .bottom {
            margin-top: 16px;
            color: #b1b1b1;
            font-size: 14px;
            line-height: 22px;
            text-align: justify
          };
          .view-details {
            display: flex;
            padding: 15px 0 0 0;
            box-sizing: border-box;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            margin-top: 10px;
            border-top: 1px solid #474747;
            >span {
              font-size: 12px;
              color: #fff
            }
          }
      };
      .expect {
          display: inline-block;
          color: #484848;
          font-size: 13px;
          height: 30px;
          width: 100%;
          text-align: center;
          line-height: 30px
      };
    }
  }
</style>
