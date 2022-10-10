<template>
	<div class="content-box" id="top-content">
		<NavBar path="/collectionRecordDetails" title="转增好友"/>
        <van-loading type="spinner" v-show="loadingShow">
          {{loadingText}}
        </van-loading>
        <van-overlay :show="isShowOverlay"/>
		<div class="content-top">
           <p>将以下藏品转增给好友</p>
           <div class="collection-details-box">
               <div class="left">
                    <div class="img-show">
                        <img :src="donationProductDetails.path">
                    </div>
                    <div class="span-show">
                        <span>{{donationProductDetails.name}}</span>
                            <p>
								<span class="blockchain-img">
									<img :src="blockchainPng" alt="">
								</span>
								<span class="blockchain-chain">{{donationProductDetails.chain}}</span>
                            </p>
						<span>{{donationProductDetails.publisher}}</span>
                    </div>
                </div>
           </div>
		</div>
        <div class="content-center">
            <p>请输入好友的区块链地址/手机号:</p>
            <van-field
                v-model="adreeMessage"
                rows="4"
                autosize
                type="textarea"
            />
        </div>
        <div class="content-btn" @click="transferObjectEvent" :class="{'contentBtnStyle': isShowCountDown || !isCanSendPhoneCode}">
            <span v-if="!isShowCountDown">
                确认转赠
            </span>
            <van-count-down v-else :time="`${donationProductDetails.expire - new Date().getTime()}`" format="DD天HH小时mm分ss秒后可以赠送" @finish="cocuntDownEvent"/>
        </div>
        <div class="countDown-box" v-show="!isCanSendPhoneCode">
            <span>{{`请输入手机号${userInfo.mobile}接收到的验证码完成赠送`}}</span>
            <van-count-down :time="countdownTime - new Date().getTime()" format="ss秒后再次发送验证码" @finish="countDownEnd" />
        </div>
        <div class="content-code" v-show="isShowCodeInput">
			<div>
                <van-field class="uni-input" ref="inputOne" v-model="codeValue" placeholder="六位短信验证码" @input="inputChange" maxlength="6" type="number"/>>
			</div>
		</div>
        <div class="donation-explain" v-html="protocolContent">
        </div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import NavBar from '@/components/NavBar'
    import {transferObject, collectSendPhoneAuthCode, queryProtocolConfig} from '@/api/products.js'
	export default {
        name: 'DonationFriend',
		components: {
            NavBar
		},
		data() {
			return {
                adreeMessage: '',
                loadingText: '',
                protocolContent: '',
                countdownTime: 0,
                isCanSendPhoneCode: true,
                codeValue: '',
                isDisabled: false,
                timer: null,
                isShowCountDown: true,
                isShowCodeInput: false,
                loadingShow: false,
                isShowOverlay: false,
				blockchainPng: require("@/common/images/home/blockchain.png")
			}
		},
		onReady() {},
		computed: {
			...mapGetters([
                'userInfo',
                'collectTransferCodeMessage',
                'donationProductDetails'
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
                        path: '/collectionRecordDetails'
                    });
                })
            };
            this.queryProtocolConfigEvent('TRANSFER_CONFIG');
            this.extractCollectPhoneCode()
		},
        beforeDestroy() {
            if(this.timer) { 
                clearTimeout(this.timer)
            }
        },
		methods: {
			...mapMutations([
                'changeCollectTransferCodeMessage',
			]),

            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },

            //转赠倒计时结束事件
            cocuntDownEvent () {
                this.isShowCountDown = false
            },

            //发送验证码倒计时结束事件
            countDownEnd () {
                this.storeCollectCodeMessage(0,true,false,'')
            },

            //提取存储的该藏品手机验证码是否过了60s的信息
            extractCollectPhoneCode () {
                if (this.collectTransferCodeMessage.length > 0 ) {
                    let temporaryMessage = this.collectTransferCodeMessage.filter((item) => {return item.collectId == this.donationProductDetails.id});
                    if (temporaryMessage.length > 0) {
                        this.countdownTime = temporaryMessage[0]['countdownTime'];
                        this.isCanSendPhoneCode = temporaryMessage[0]['isCanSendPhoneCode'];
                        this.isShowCodeInput = temporaryMessage[0]['isShowCodeInput']
                    }
                }
            },

            //存储该藏品的手机验证码是否过了60秒信息
            storeCollectCodeMessage (time,text,inputShow,type) {
                let temporaryOfficeList = this.collectTransferCodeMessage;
                if (this.collectTransferCodeMessage.length > 0 ) {
                    let temporaryIndex = this.collectTransferCodeMessage.indexOf(this.collectTransferCodeMessage.filter((item) => {return item.collectId == this.donationProductDetails.id})[0]);
                    if (temporaryIndex != -1) {
                        if (type == '展示验证码框') {
                            temporaryOfficeList[temporaryIndex]['isShowCodeInput'] = inputShow
                        } else {
                            temporaryOfficeList[temporaryIndex]['countdownTime'] = time;
                            temporaryOfficeList[temporaryIndex]['isCanSendPhoneCode'] = text;
                            temporaryOfficeList[temporaryIndex]['isShowCodeInput'] = inputShow
                        }
                    } else {
                        temporaryOfficeList.push(
                            { 
                                collectId: this.donationProductDetails.id,
                                countdownTime: time,
                                isCanSendPhoneCode: text,
                                isShowCodeInput: inputShow
                            }
                        )
                    }
                } else {
                    temporaryOfficeList.push(
                        { 
                            collectId: this.donationProductDetails.id,
                            countdownTime: time,
                            isCanSendPhoneCode: text,
                            isShowCodeInput: inputShow
                        }
                    )
                }
                this.changeCollectTransferCodeMessage(temporaryOfficeList);
                this.extractCollectPhoneCode()
            },


            // 输入框变化事件
			inputChange (event) {
				if (this.codeValue.length == 6) {
                    this.loadingShow = true;
                    this.isShowOverlay = true;
                    this.loadingText = '转赠中';
					transferObject({
                        id: this.donationProductDetails.id,
                        receiver: this.adreeMessage,
                        code: this.codeValue
                    })
                    .then((res) => {
                        this.loadingShow = false;
                        this.isShowOverlay = false;
                        if (res && res.data.code == 0) {
                            this.storeCollectCodeMessage(0,true,false,'');
                            this.$toast({
                                message: '转赠成功',
                                position: 'bottom'
                            });
                            this.$router.push({
                                path: '/collectionRecords'
                            })
                        } else {
                            this.codeValue = '';
                            this.$toast({
                                message: `${res.data.msg}`,
                                position: 'bottom'
                            })
                        }
                    })
                    .catch((err) => {
                        this.codeValue = '';
                        this.loadingShow = false;
                        this.isShowOverlay = false;
                        this.$toast({
                            message: `${err.message}`,
                            position: 'bottom'
                        })
                    })
				}
			},

            // 转增方法
            transferObjectEvent() {
                if(this.isDisabled) return;
                this.isDisabled = !this.isDisabled;
                this.timer = setTimeout(() => {this.isDisabled = !this.isDisabled;},2000);
                if (this.isShowCountDown || !this.isCanSendPhoneCode) { return };
                if (!this.adreeMessage) {
                    this.$toast({
                        message: '请输入好友的区块链地址/手机号',
                        position: 'bottom'
                    });
                    return
                };
                this.loadingShow = true;
                this.codeValue = '';
                this.sendPhoneCode()
            },

            //发送短信验证码
            sendPhoneCode () {
                this.loadingShow = true;
                this.loadingText = '';
                collectSendPhoneAuthCode().then((res) => {
                    if (res && res.data.code == 0) {
                        this.loadingShow = false;
                        this.storeCollectCodeMessage(new Date().getTime()+60000,false,true,'')
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

            //查询协议配置
            queryProtocolConfigEvent(value) {
                queryProtocolConfig(value).then((res) => {
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
		.content-top {
			width: 90%;
            margin: 0 auto;
            margin-bottom: 30px;
            p {
                color: #fff;
                font-size: 16px;
                margin: 30px 0;
            };
            .collection-details-box {
                display: flex;
                flex-flow: row nowrap;
                justify-content: space-between;
                padding: 0 10px 0 0;
                border-radius: 10px;
                background: @color-block;
                margin-bottom: 10px;
                box-sizing: border-box;
                .left {
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    width: 100%;
                    .img-show {
                        width: 100px;
                        img {
                            width: 100%;
                        }
                    };
                   .span-show {
                        display: flex;
                        flex: 1;
                        width: 0;
                        flex-direction: column;
                        justify-content: space-between;
                        margin-left: 26px;
                        >span {
                            display: inline-block;
                            .no-wrap();
                            &:nth-child(1) {
                                font-size: 17px;
                                color: #FFFFFF;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            };
                            &:nth-child(3) {
                                font-size: 14px;
                                color: #686866
                            };
                        };
                        p {
                            margin: 6px 0;
                            width: 90%;
                            display: flex;
                            flex-flow: row nowrap;
                            align-items: center;
                            height: 35px;
                            display: flex;
                            flex-flow: row nowrap;
                            align-items: center;
                            position: relative;
                            .blockchain-img {
                                width: 30px;
                                position: absolute;
                                top: 1px;
                                left: 0;
                                img {
                                    width: 100%;
                                }
                            };
                            .blockchain-chain {
                                display: inline-block;
                                padding: 0 16px;
                                border-radius: 10px;
                                font-size: 10px;
                                box-sizing: border-box;
                                line-height: 22px;
                                margin-left: 17px;
                                background-image: linear-gradient(to right, #fbd2a5, #f1c593);
                                color: black;
                                .no-wrap()
                            }
                        }
                    }
                }
            }
		};
        .content-center {
            width: 90%;
            margin: 0 auto;
            p {
                color: #fff;
                font-size: 16px;
                margin-bottom: 30px
            };
            /deep/ .van-cell {
                background: @color-block;
                border-radius: 10px;
                .van-cell__value {
                   .van-field__control {
                       color: #fff
                   }
                }
            }
        };
        .content-btn {
            width: 90%;
            margin: 0 auto;
            margin-top: 20px;
            border-radius: 20px;
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: black;
            font-size: 18px;
            background-image: linear-gradient(to right, #f2c460 ,#e29119)
        };
        .countDown-box {
            width: 90%;
            margin: 0 auto;
            margin-top: 10px;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            /deep/ .van-count-down {
                color: #404040;
                font-size: 13px
            };
            >span {
               color: #404040;
                font-size: 13px 
            }
		};
        .content-code {
            width: 90%;
            margin: 0 auto;
			display: flex;
			flex-flow: row nowrap;
			justify-content: center;
			> div {
				width: 80%;
				margin: 0 auto;
                .bottom-border-1px(#6e6e6e,3px);
				/deep/ .uni-input {
					color: #fff;
					height: 30px;
					text-align: center;
					font-size: 18px;
                    background: transparent;
                    .van-field__control {
                        color: #fff !important
                    };
                    input::placeholder{
						color: #fff;
						font-size: 14px
					};     
					// 去除自动填充的输入框黄色背景
					input:-webkit-autofill,
					input:-webkit-autofill:hover,
					input:-webkit-autofill:focus,
					input:-webkit-autofill:active {
						-webkit-transition-delay: 9999s;
						-webkit-transition: color 9999s ease-out, background-color 9999s ease-out;
					}
				}
			}
		};
        .contentBtnStyle {
            background-image: linear-gradient(to right, #f1f0ee ,#555453);
            color: #666
        };
        .donation-explain {
            width: 90%;
            margin: 0 auto;
            margin-top: 20px;
            /deep/ p {
                color: #686868;
                font-size: 14px;
                line-height: 20px
            }
        }
	}
</style>




