<template>
  <div class="page-box">
    <NavBar title="工作室" path="collectionDetails" />
    <div class="content-box">
        <div class="top">
            <div class="left">
                <div class="work-room-photo">
                    <img :src="defaultPersonPng" alt="">
                </div>
                <div class="work-room-message">
                    <span>泰山工作室</span>
                    <span>100万粉丝 0关注</span>
                </div>
            </div>
            <div class="right">
                <span>关注</span>
            </div>
        </div>
        <div class="intro">
            <div class="top-intro">
              <span class="message-title">个人简介</span>
            </div>
            <div class="bottom-intro">
                <P>
                   数字藏品为虚拟数字商品,坚决反对一切形式的炒作,数字藏品为虚拟数字商品,坚决反对一切形式的炒作,数字藏品为虚拟数字商品,坚决反对一切形式的炒作
                </P>
            </div>
        </div>
        <div class="production-box">
           <div class="top-intro">
              <span class="production-title">作品</span>
            </div>
            <div class="production-content">
              <div class="object-list" v-for="(item,index) in digitalCollectionList" :key="index">
                <div class="sell-info-area">
                  <div class="left">
                    <van-icon name="underway" size="14" color="#ab4eff" />
                    <span>即将开售</span>
                    <span>{{item.countdownTime}}</span>
                  </div>
                </div>
                <div class="image-area">
                  <img :src="item.digitalCollectioUrl">
                </div>
                <div class="message-area">
                  <div class="left">
                    <div class="name">
                      <span>{{item.digitalCollectionName}}</span>
                       <p v-show="item.tagAttributes && !item.tagAttributes.some((tagItem) => {return tagItem == null}) && item.tagAttributes.length>0">
                        <span v-for="(innerItem, innerIndex) in item.tagAttributes" :key="innerIndex">{{innerItem}}</span>
                      </p>
                    </div>
                    <div class="number">
                      <span>限量</span>
                      <span>{{item.digitalCollectioShare}}份</span>
                    </div>
                    <div class="author">
                      <img :src="item.digitalCollectioAuthorPhoto">
                      <span>{{item.digitalCollectioAuthor}}</span>
                    </div>
                  </div>
                  <div class="right">
                    <div>
                      <span>¥</span>
                      <span>{{item.digitalCollectioPrice}}</span>
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
  import NavBar from '@/components/NavBar'
  import { mapGetters, mapMutations } from 'vuex'
  import { IsPC} from '@/common/js/utils'
  export default {
    name: 'WorkRoom',
    components:{
	    NavBar
    },
    data() {
      return {
        digitalCollectionList: [{
            countdownTime: '03:06:00',
            digitalCollectionName: '新疆喀纳斯之秋',
            digitalCollectioUrl: require("@/common/images/home/default-person.png"),
            digitalCollectioShare: 8000,
            digitalCollectioAuthor: '乔玲',
            digitalCollectioAuthorPhoto: require("@/common/images/home/default-person.png"),
            digitalCollectioPrice: '59.90',
            tagAttributes: ['风景画','限量']
        }, {
            countdownTime: '03:06:00',
            digitalCollectionName: '玄武门',
            digitalCollectioUrl: require("@/common/images/home/default-person.png"),
            digitalCollectioShare: 8000,
            digitalCollectioAuthor: '乔玲',
            digitalCollectioAuthorPhoto: require("@/common/images/home/default-person.png"),
            digitalCollectioPrice: '59.90',
            tagAttributes: ['春节特惠']
        }],
        defaultPersonPng :require("@/common/images/home/default-person.png")
      }
    },

    mounted() {
      // 控制设备物理返回按键
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
          pushHistory();
          this.$router.push({
            path: '/collectionDetails'
          })
        })
      }
    },

    watch: {
    },

    computed:{
      ...mapGetters([
        'userInfo'
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
        'changeTitleTxt'
      ]),

      juddgeIspc () {
        return IsPC()
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
    .content-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      background: @color-background;
      .top {
        width: 92%;
        margin: 0 auto;
        margin-top: 20px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 8px;
        background: #100726;
        .left {
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            flex: 1;
            .work-room-photo {
                width: 50px;
                border-radius: 50%;
                margin-right: 10px;
                img {
                    width: 100%;
                    border-radius: 50%
                }
            };
            .work-room-message {
                height: 50px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                > span {
                    &:first-child {
                        color: #fff;
                        font-size: 17px;
                        margin-bottom: 10px
                    };
                    &:last-child {
                        color: #686868;
                        font-size: 14px;
                    }
                } 
            }
        };
        .right {
            width: 40px;
            height: 18px;
            text-align: center;
            line-height: 18px;
            font-size: 11px;
            border-radius: 10px;
            background: #febd42;
            color: black
        }
      };
      .intro {
        &:first-child {
          margin-top: 40px
        };
        width: 92%;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 20px;
        box-sizing: border-box;
        background: #100726;
        border-radius: 8px;
        .top-intro {
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            >span {
                display: inline-block;
                &:first-child {
                    color: #fff;
                    font-size: 16px
                }
            }
        };
        .bottom-intro {
            margin-top: 10px;
            color: #716f78;
            font-size: 13px;
            line-height: 22px;
            text-align: justify
        }
      };
      .production-box {
        width: 92%;
        margin: 0 auto;
        margin-top: 10px;
        box-sizing: border-box;
        background: #100726;
        border-radius: 8px;
        .top-intro {
          display: flex;
          flex-flow: row nowrap;
          justify-content: center;
          height: 60px;
          align-items: center;
          >span {
            display: inline-block;
            &:first-child {
              color: #fff;
              font-size: 16px
            }
          }
        };
        .production-content {
          .object-list {
            border-radius: 10px;
            position: relative;
            margin-bottom: 20px;
            background: #100726;
            .sell-info-area {
              position: absolute;
              top: 10px;
              left: 5%;
              width: 90%;
              display: flex;
              flex-flow: row nowrap;
              justify-content: space-between;
              z-index: 100;
              color: #333;
              .left {
                background: rgba(0,0,0,0.54);
                border-radius: 16px;
                padding: 4px 10px;
                color: #bd68ff;
                height: 20px;
                line-height: 20px;
                span {
                    &:nth-child(2) {
                        margin: 0 4px
                    }
                  }
                };
              .right {
                background: rgb(59 56 56);
                border-radius: 16px;
                padding: 8px 8px;
                color: #e9ad70;
                span {
                  &:nth-child(1) {
                    margin: 0 4px
                  }
                }
              }
            };
          .image-area {
             max-width: 90%;
             margin: 0 auto;
              img {
                width: 100%;
                border-radius: 10px;
              }
          }
          ;
          .message-area {
            padding: 16px 0;
            width: 92%;
            margin: 0 auto;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            .left {
                width: 80%;
                .name {
                  font-size: 19px;
                  color: #FFFFFF;
                  display: flex;
                  flex-flow: row nowrap;
                  justify-content: space-between;
                  align-items: center;
                  >span {
                      display: inline-block;
                      max-width: 120px;
                      margin-right: 6px;
                      .no-wrap();
                  }
                  >p {
                      flex: 1;
                      overflow: auto;
                      height: 40px;
                      display: flex;
                      flex-flow: row nowrap;
                      align-items: center;
                      >span {
                          display: inline-block;
                          padding: 0 4px;
                          height: 20px;
                          border: 1px solid #bd6aff;
                          font-size: 10px;
                          border-radius: 10px;
                          margin-right: 4px;
                          text-align: center;
                          line-height: 20px;
                          color: #bd68ff;
                          &:last-child {
                              margin-right: 0
                          }
                      }
                  }
                };
                .number {
                  font-size: 0;
                  margin: 10px 0;
                  span {
                    font-size: 14px;
                    display: inline-block;
                    padding: 1px 4px;
                    height: 20px;
                    line-height: 20px;
                    &:first-child {
                      background: #febd42;
                      color: black;
                      border-top-left-radius: 2px;
                      border-bottom-left-radius: 2px;
                    };
                    &:last-child {
                      background: #3e3a51;
                      color: #ffbc41;
                      border-top-right-radius: 2px;
                      border-bottom-right-radius: 2px
                    }
                  }
                };
                .author {
                  display: flex;
                  flex-flow: row nowrap;
                  align-items: center;
                  img {
                    width: 20px
                  };
                  span {
                    margin-left: 6px;
                    font-size: 13px;
                    margin-top: 2px;
                    color: #686866
                  }
                }
              };
              .right {
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
                align-items: flex-end;
                width: 20%;
                span {
                  font-size: 17px;
                  color: #FFFFFF;
                  &:first-child {
                    margin-right: 4px
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
