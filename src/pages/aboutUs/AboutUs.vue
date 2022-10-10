<template>
	<div class="content-box" id="top-content">
		<NavBar path="/myInfo" title="关于我们"/>
		<div class="content-top">
            <img :src="logoScriptPng">
		</div>
		<div class="content-center">
			中国传统文化数字艺术联盟旨在自愿、平等、互利、合作的基础上，召集文化、文博、文旅、数字艺术相关企事业单位、社团组织、高等院校、科研院所等自愿结成的跨行业、开放性、非营利性、非法人的协调性议事机制。联盟以中国博物馆创新发展指数研究和发布及全国博物馆发展大数据中心建设、传统文化及文物的数字化开发和市场推广为起点，推动联盟组织成员在中华文化传播与教育、文化旅游、公共文化事业发展等领域进行发展，树立起文物数字化工作的行业标杆。
		</div>
		<div class="content-bottom">
			<span>
                V0.1.0
            </span>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import NavBar from '@/components/NavBar'
	export default {
		name: 'AboutUs',
		components: {
            NavBar
		},
		data() {
			return {
			  logoScriptPng: require("@/common/images/home/logo-script.png")
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
                        path: '/myInfo'
                    })
                })
            };
		},
		methods: {
			...mapMutations([
			]),
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
		.content-top {
			height: 200px;
			display: flex;
			margin-top: 30px;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			img {
				width: 120px
			}
		};
		.content-center {
			width: 90%;
			margin: 0 auto;
			flex: 1;
			overflow: auto;
			color: #686868;
			font-size: 15px;
			line-height: 20px;
			text-indent: 2em;
			text-align: justify
		};
		.content-bottom {
			height: 60px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			> span {
				&:nth-child(1) {
                    font-size: 14px;
                    color: #a9a9a9
                }
			}
		}
	}
</style>




