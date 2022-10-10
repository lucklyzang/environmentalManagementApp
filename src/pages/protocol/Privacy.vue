<template>
	<div class="content-box" id="top-content">
		<NavBar path="/login" title="隐私协议"/>
        <van-loading type="spinner" v-show="loadingShow"/>
		<div class="content" v-html="protocolContent">
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
     import {
        queryProtocolConfig
    } from '@/api/products.js'
	import NavBar from '@/components/NavBar'
	export default {
		name: 'Privacy',
		components: {
            NavBar
		},
		data() {
			return {
			  loadingShow: false,
              protocolContent: ''
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
			])
		},
		mounted() {
            this.toTop();
			// 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                pushHistory();
                    this.$router.push({
                        path: '/login'
                    })
                })
            };
            this.queryProtocolConfigEvent('PRIVACY_AGREEMENT')
		},
		methods: {
			...mapMutations([
			]),
            //让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
			},
            //查询协议配置
            queryProtocolConfigEvent(value) {
                this.loadingShow = true;
                queryProtocolConfig(value).then((res) => {
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                        this.protocolContent = res.data.data
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

<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.content-box {
		.content-wrapper();
        background: @color-background;
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
        .content {
            background: #fff;
            flex: 1;
            padding: 10px;
            box-sizing: border-box;
            /deep/ h2 {
                line-height: 20px;
                strong {
                    font-weight: bolder;
                }
            };
            /deep/ p {
                line-height: 20px;
                strong u {
                    font-weight: bolder;
                }
            }
        }
	}
</style>




