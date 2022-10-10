<template>
  <div class="page-box" id="top-content">
    <NavBar path="systemMessage" />
    <div class="content-box" v-html="content">
        <van-loading type="spinner" v-show="loadingShow"/>
    </div>
  </div>
</template>
<script>
  import NavBar from '@/components/NavBar'
  import { mapGetters, mapMutations } from 'vuex'
  import {
    queryNewsDetails
  } from '@/api/products.js'
  import {IsPC} from '@/common/js/utils'
  export default {
    name: 'SystemMessageDetails',
    components:{
	    NavBar
    },
    data() {
      return {
        content: '',
        loadingShow: false
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
                path: '/systemMessage'
            })
        })
      };
      this.queryNewsDetailsEvent()
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
        'changeTitleTxt'
      ]),

      //让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},


      juddgeIspc () {
        return IsPC()
      },

       // 查询消息详情
      queryNewsDetailsEvent() {
        this.loadingShow = true;
        queryNewsDetails(this.systemMessageId).then((res) => {
          this.loadingShow = false;
            if (res && res.data.code == 0) {
              this.content = res.data.data
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
      padding: 20px;
      box-sizing: border-box;
      position: relative;
      background: #fff;
      /deep/ p {
          line-height: 20px
      }
    }
  }
</style>
