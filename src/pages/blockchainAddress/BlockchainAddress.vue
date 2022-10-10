<template>
	<div class="content-box" id="top-content">
		<NavBar path="/myInfo" title="区块链地址"/>
		<div class="content-top">
            <img :src="blockchainPng" alt="">
			<span>区块链地址</span>
            <p>区块链地址是你在区块链上持有藏品的唯一地址</p>
		</div>
        <div class="content-center">
            {{userInfo.account}}
        </div>
        <div class="content-bottom" :class="{'contentBtnStyle': !userInfo.account}"
            v-clipboard:copy="userInfo.account"
            v-clipboard:success="onCopySuccess"
            v-clipboard:error="onCopyError"
        >
            复制地址
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
        name: 'BlockchainAddress',
		components: {
            NavBar
		},
		data() {
			return {
				blockchainPng: require("@/common/images/home/blockchain.png")
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
                'userInfo'
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
            }
		},
		methods: {
			...mapMutations([
			]),
            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },
            onCopySuccess(){
                this.$toast("复制成功");
            },
            onCopyError(){
                if (!this.userInfo.account) {
                    return;
                };
                this.$toast("复制失败");
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
			flex-direction: column;
			justify-content: center;
			align-items: center;
			img {
				width: 70px
			};
			span {
				&:nth-child(2) {
					font-size: 22px;
					color: #FFFFFF;
					margin: 20px 0 14px 0;
				}
			};
            p {
                font-size: 13px;
                color: #686868
            }
		};
        .content-center {
            width: 90%;
            margin: 0 auto;
            height: 100px;
            padding: 10px;
            box-sizing: border-box;
            word-wrap : break-word;
            word-break : break-all;
            font-size: 16px;
            color: #FFFFFF;
            background: @color-block;
            border-radius: 20px;
            text-align: center;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            align-items: center;
        };
        .content-bottom {
            width: 70%;
            margin: 0 auto;
            margin-top: 40px;
            border-radius: 20px;
            height: 45px;
            line-height: 45px;
            text-align: center;
            color: black;
            font-size: 14px;
            background-image: linear-gradient(to right, #f2c460 ,#e29119)
        };
        .contentBtnStyle {
            background-image: linear-gradient(to right, #f1f0ee ,#555453);
            color: #666
        };
	}
</style>




