<template>
	<div class="content-box" id="top-content">
        <NavBar path="/systemSet" title="修改昵称" />
        <van-loading type="spinner" v-show="loadingShow"/>
		<div class="content-center">
            <van-field class="uni-input" v-model="nicknameContent"  rows="4"
                autosize
                type="textarea"
                maxlength="50"
                show-word-limit
            />
		</div>
        <div class="btn-area">
            <span @click="cancelChangeEvent">取 消</span>
            <span @click="saveChangeEvent">保 存</span>
        </div>
	</div>
</template>

<script>
	import NavBar from '@/components/NavBar'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {changeNickname,inquareUserInfo} from '@/api/products.js'
	export default {
        name: 'ChangeNickname',
		components: {
			NavBar
		},
		data() {
			return {
				nicknameContent: '',
                timer: null,
                isDisabled: false,
                loadingShow: false
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
                'userInfo',
                'isLogin'
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
                        path: '/systemSet'
                    })
                })
            };
            if (this.isLogin) {
                this.nicknameContent = this.userInfo.nickName
            }
		},
        beforeDestroy() {
            if(this.timer) { 
                clearTimeout(this.timer)
            }
        },
		methods: {
			...mapMutations([
                'storeUserInfo'
			]),
            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },
            //保存昵称修改事件
            saveChangeEvent () {
                if (!this.nicknameContent) {
                    this.$toast({
                        message: '昵称不能为空',
                        position: 'bottom'
                    });
                    return
                };
                if (this.nicknameContent == this.userInfo.nickName) {
                    this.$toast({
                        message: '昵称不能和当前的昵称相同',
                        position: 'bottom'
                    });
                    return
                };
                if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},3000);
                changeNickname({nickName: this.nicknameContent}).then((res) => {
                    this.loadingShow = false;
                    if (res && res.data.code == 0) {
                        this.$toast({
                            message: '昵称修改成功',
                            position: 'bottom'
                        });
                        this.queryuserInfo()
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

            // 查询用户信息
            queryuserInfo () {
                inquareUserInfo().then((res) => {
                    if (res && res.data.code == 0) {
                        this.storeUserInfo(res.data.data);
                         this.$router.push({
                            path: 'systemSet'
                        })
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
            
            // 昵称修改取消事件
            cancelChangeEvent () {
                this.nicknameContent = '';
                this.$router.push({
                    path: 'systemSet'
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
		.content-center {
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
            width: 94%;
            margin: 0 auto;
			margin-top: 30px;
            border-radius: 4px;
            /deep/ .uni-input {
                margin-bottom: 8px;
                border: 1px solid #5e5446;
                border-radius: 10px;
                color: #fff;
                background: @color-home-block;
                font-size: 18px;
                .van-field__control {
                    color: #fff !important
                };
                .van-field__word-limit {
                    color: #b1b1b1
                }
            }
		};
        .btn-area {
            display: flex;
			flex-flow: row nowrap;
			justify-content: center;
            align-items: center;
            width: 94%;
            margin: 0 auto;
            margin-top: 20px;
            > span {
                display: inline-block;
                width: 90px;
                height: 40px;
                font-size: 16px;
                text-align: center;
                line-height: 40px;
                background: @color-block;
                border-radius: 20px;
                &:first-child {
                    margin-right: 20px;
                    color: #686868
                };
                &:last-child {
                    color: #edc695
                }
            }
        }
	}
</style>





