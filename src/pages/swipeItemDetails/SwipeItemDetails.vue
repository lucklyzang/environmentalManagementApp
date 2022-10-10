<template>
	<div class="content-box" id="top-content">
		<NavBar path="/home" />
		<div class="content" v-html="swipeItemDetails.remark">
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import NavBar from '@/components/NavBar'
	export default {
		name: 'SwipeItemDetails',
		components: {
            NavBar
		},
		data() {
			return {
			}
		},
		computed: {
			...mapGetters([
                'swipeItemDetails'
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
                        path: '/home'
                    })
                })
            }
		},
        methods: {
            //让页面滚动到顶部
			toTop() {
				document.querySelector('#top-content').scrollIntoView(true)
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
        /deep/
        .van-nav-bar__placeholder {
            height: 0 !important;
            .van-nav-bar {
                background: transparent;
                .van-icon {
                    color: #fff !important;
                    font-size: 18px !important
                }
            }
        };    
        .content {
            flex: 1;
            /deep/  p {
                width: 100%;
                img {
                    width: 100%;
                    display: block;
                }
            }
        }
	}
</style>




