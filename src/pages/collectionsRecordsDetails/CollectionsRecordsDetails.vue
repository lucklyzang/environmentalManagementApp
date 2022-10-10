<template>
	<div class="page-box" id="top-content">
        <NavBar :path="path" title="藏品详情"/>
        <!-- <van-loading type="spinner" v-show="loadingShow"/> -->
        <div class="light-box">
            <img :src="lightPng" alt="">
        </div>
        <div class="show-picture-box">
            <van-dialog v-model="isShowPicture" :show-confirm-button="false"  :close-on-popstate="false" title="" >
                <div class="unfold-top">
                    <div class="top-left">
                        <p>
                            {{collectionRecordDetails.name}}
                        </p>
                        <p>
                            {{collectionRecordDetails.publisher}}
                        </p>
                    </div>
                    <div class="top-right" @click="closePictureUnfoldEvent">
                        <van-icon name="clear" size="26" color="#b1b1b1" />
                    </div>
                </div>
                <div class="unfold-center">
                    <div class="collection-exhibition">
                        <div class="abbr-img">
                            <img :src="collectionRecordDetails.url" ref="objectPicture">
                        </div>
                    </div>
                    <div class="booth">
                        <img :src="boothPng" alt="">
                    </div>
                    <div class="operation-box">
                        <van-icon name="plus" color="#fff" size="25" @click="pictureScaleEvent" />
                        <van-icon name="minus" color="#fff" size="25"  @click="pictureReduceEvent" />
                    </div>
                </div>
            </van-dialog>
        </div>
        <div class="three-dimensional-box">
            <van-dialog v-model="isShowThreeDimensional" :show-confirm-button="false"  :close-on-popstate="false" title="" >
                <div class="unfold-top">
                    <div class="top-left">
                        <p>
                            {{collectionRecordDetails.name}}
                        </p>
                        <p>
                            {{collectionRecordDetails.publisher}}
                        </p>
                    </div>
                    <div class="top-right" @click="closePictureUnfoldEvent">
                        <van-icon name="clear" size="26" color="#b1b1b1" />
                    </div>
                </div>
                <div class="unfold-center">
                    <div class="collection-exhibition">
                    <div class="three-dimensional-img">
                        <model-obj
                                v-if="!loadingImgGifShow && collectionRecordDetails.three === 'obj'" 
                                @on-error="threeDimensionalError" 
                                @on-load="threeDimensionalLoaded"
                                @on-progress="threeDimensionProgress" 
                                :src="collectionRecordDetails.url"
                                :mtl="collectionRecordDetails.mtlPath"
                                :textures="collectionRecordDetails.textures"
                                :backgroundAlpha="1"
                                backgroundColor="#1e1e1b">
                            </model-obj>
                            <model-fbx
                                v-if="!loadingImgGifShow && collectionRecordDetails.three === 'fbx'" 
                                @on-error="threeDimensionalError" 
                                @on-load="threeDimensionalLoaded"
                                @on-progress="threeDimensionProgress" 
                                :src="collectionRecordDetails.url"
                                :textures="collectionRecordDetails.textures" 
                                :backgroundAlpha="1" 
                                backgroundColor="#1e1e1b">
                            </model-fbx>
                            <model-three
                                v-if="!loadingImgGifShow && collectionRecordDetails.three === 'json'" 
                                @on-error="threeDimensionalError" 
                                @on-load="threeDimensionalLoaded"
                                @on-progress="threeDimensionProgress" 
                                :src="collectionRecordDetails.url"  
                                :backgroundAlpha="1" 
                                backgroundColor="#1e1e1b">
                            </model-three>
                            <model-stl
                                v-if="!loadingImgGifShow && collectionRecordDetails.three === 'stl'"  
                                @on-error="threeDimensionalError" 
                                @on-load="threeDimensionalLoaded"
                                @on-progress="threeDimensionProgress" 
                                :src="collectionRecordDetails.url"
                                :textures="collectionRecordDetails.textures"  
                                :backgroundAlpha="1" 
                                backgroundColor="#1e1e1b">
                            </model-stl>
                            <model-collada
                                v-if="!loadingImgGifShow && collectionRecordDetails.three === 'dae'"  
                                @on-error="threeDimensionalError" 
                                @on-load="threeDimensionalLoaded"
                                @on-progress="threeDimensionProgress" 
                                :src="collectionRecordDetails.url"
                                :textures="collectionRecordDetails.textures"  
                                :backgroundAlpha="1" 
                                backgroundColor="#1e1e1b">
                            </model-collada>
                            <model-ply
                                v-if="!loadingImgGifShow && collectionRecordDetails.three === 'ply'"  
                                @on-error="threeDimensionalError" 
                                @on-load="threeDimensionalLoaded"
                                @on-progress="threeDimensionProgress" 
                                :src="collectionRecordDetails.url" 
                                :textures="collectionRecordDetails.textures" 
                                :backgroundAlpha="1" 
                                backgroundColor="#1e1e1b">
                            </model-ply>
                            <model-gltf
                                v-if="!loadingImgGifShow && collectionRecordDetails.three === 'gltf'"  
                                @on-error="threeDimensionalError" 
                                @on-load="threeDimensionalLoaded"
                                @on-progress="threeDimensionProgress" 
                                :src="collectionRecordDetails.url"
                                :textures="collectionRecordDetails.textures"  
                                :backgroundAlpha="1" 
                                backgroundColor="#1e1e1b">
                            </model-gltf>
                        </div>
                    </div>
                    <div class="booth">
                        <img :src="boothPng" alt="">
                    </div>
                    <div class="operation-box">
                        请用手指操作藏品缩放、旋转
                    </div>
                </div>
            </van-dialog>
        </div>
        <div class="content">
            <div class="content-top">
                <div class="collection-exhibition">
                    <div class="loading-img-wrapper">
                        <img :src="imgLoadingGif" v-show="loadingImgGifShow || threeDimensionalShow" class="loading-img">
                    </div>
                    <div class="abbr-img" v-show="collectionRecordDetails.three === '0'">
                        <img :src="collectionRecordDetails.url" v-show="!loadingImgGifShow">
                    </div>
                    <div class="three-dimensional-img" v-show="collectionRecordDetails.three !== '0'">
                       <model-obj
                            v-if="!loadingImgGifShow && collectionRecordDetails.three === 'obj'" 
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="collectionRecordDetails.url"
                            :mtl="collectionRecordDetails.mtlPath"
                            :textures="collectionRecordDetails.textures"
                            :backgroundAlpha="1"
                            style="width:100%" 
                            :width="500"
                            :height="300"
                            backgroundColor="#1e1e1b">
                        </model-obj>
                        <model-fbx
                            v-if="!loadingImgGifShow && collectionRecordDetails.three === 'fbx'" 
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress"
                            :src="collectionRecordDetails.url"
                            :textures="collectionRecordDetails.textures" 
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"
                            backgroundColor="#1e1e1b">
                        </model-fbx>
                        <model-three
                            v-if="!loadingImgGifShow && collectionRecordDetails.three === 'json'" 
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="collectionRecordDetails.url"
                            :textures="collectionRecordDetails.textures"  
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300" 
                            backgroundColor="#1e1e1b">
                        </model-three>
                        <model-stl
                            v-if="!loadingImgGifShow && collectionRecordDetails.three === 'stl'"  
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="collectionRecordDetails.url"
                            :textures="collectionRecordDetails.textures"  
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-stl>
                        <model-collada
                            v-if="!loadingImgGifShow && collectionRecordDetails.three === 'dae'"  
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="collectionRecordDetails.url"
                            :textures="collectionRecordDetails.textures"  
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-collada>
                        <model-ply
                            v-if="!loadingImgGifShow && collectionRecordDetails.three === 'ply'"  
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="collectionRecordDetails.url"
                            :textures="collectionRecordDetails.textures"  
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-ply>
                        <model-gltf
                            v-if="!loadingImgGifShow && collectionRecordDetails.three === 'gltf'"  
                            :controlsOptions="{enableRotate:false,enableZoom:false,enabled:false}" 
                            :rotation="rotation"
                            @on-error="threeDimensionalError" 
                            @on-load="threeDimensionalLoaded"
                            @on-progress="threeDimensionProgress" 
                            :src="collectionRecordDetails.url"
                            :textures="collectionRecordDetails.textures"    
                            :backgroundAlpha="1"
                            :width="500"
                            :height="300"  
                            backgroundColor="#1e1e1b">
                        </model-gltf>
                    </div>
                </div>
                <div class="booth">
                    <div class="unfold" @click="unfoldPictureEvent" v-show="!loadingImgGifShow">
                        <img :src="unfoldPng" alt="">
                    </div>
                    <img :src="boothPng" alt="">
                </div>
                <div class="synopsis" :style="{backgroundImage: 'url(' + detailsTitleWrappper+ ')',backgroundRepeat:'no-repeat',backgroundSize:'cover'}">
                    <div class="title" v-show="!loadingImgGifShow">
                        <span>
                            {{collectionRecordDetails.name}}
                        </span>
                    </div>
                    <div class="number" v-show="!loadingImgGifShow">
                        <div class="number-content">
                            <span class="blockchain-img">
                                <img :src="blockchainPng" alt="">
                            </span>
                            <span class="blockchain-chain">{{collectionRecordDetails.chain}}</span>
                        </div>    
                    </div>
                </div>
            </div>
            <div class="content-middle" v-show="!loadingImgGifShow">
                <div class="collector">
                    <span>收藏者</span>
                    <span>{{collectionRecordDetails.collector}}</span>
                </div>
                <div class="hash-value">
                    <span>商品哈希值</span>
                    <span>{{collectionRecordDetails.hash}}</span>
                </div>
                <div class="framer">
                    <span>创作者</span>
                    <span>{{collectionRecordDetails.creator}}</span>
                </div>
                <div class="generated-time">
                    <span>生成时间</span>
                    <span>{{collectionRecordDetails.createTime}}</span>
                </div>
            </div>
        </div>
        <div class="content-bottom" :class="{'donationStyle' : collectionRecordDetails.status == 0 || collectionRecordDetails.status == 2}">
            <!-- <div>
                <van-icon name="award" />
                <span>炫耀</span>
            </div> -->
            <div  @click="donationFriendEvent">
                <van-icon name="printer" v-show="!loadingImgGifShow" :color="collectionRecordDetails.status == 0 || collectionRecordDetails.status == 2 ? '#666' : '' " />
                <span v-show="!loadingImgGifShow">转赠</span>
            </div>
            <!-- <div @click="useObjectImgEvent">
                <van-icon name="good-job" />
                <span>使用</span>
            </div>
            <div>
                <van-icon name="label" />
                <span>证书</span>
            </div> -->
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
    import NavBar from '@/components/NavBar'
	import {queryObjectRecordDetails,useObjectImg} from '@/api/products.js'
    import {
        ModelObj,
        ModelThree,
        ModelFbx,
        ModelCollada,
        ModelStl,
        ModelPly,
        ModelGltf
    } from "vue-3d-model";
	export default {
        name: 'CollectionsRecordsDetails',
		components: {
            NavBar,
            ModelObj,
            ModelThree,
            ModelFbx,
            ModelCollada,
            ModelStl,
            ModelPly,
            ModelGltf
		},

		data() {
			return {
                path: '',
                objectPictureWidth: '',
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                timeIndex: null,
                isShowPicture: false,
                isShowThreeDimensional: false,
                loadingShow: false,
                loadingImgGifShow: false,
                threeDimensionalShow: false,
                collectionRecordDetails: {},
                isCountDownShow: true,
                imgLoadingGif: require("../../../static/img/img-loading.gif"),
                blockchainPng: require("@/common/images/home/blockchain.png"),
                sharePng: require("@/common/images/login/my-share.png"),
                boothPng: require("@/common/images/home/booth.png"),
                unfoldPng: require("@/common/images/home/unfold.png"),
                lightPng: require("@/common/images/home/light.png"),
                detailsTitleWrappper: require("@/common/images/home/details-title-wrapper.png"),
                  lights: [
                    {
                        type: 'HemisphereLight',
                        position: { x: 0, y: 1, z: 0 },
                        skyColor: 0xffffff,
                        groundColor: 0xFF0000, // 此代码为灯光后颜色
                        intensity: 1,
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 1, y: 1, z: 1 },
                        color: 0xffffff,
                        intensity: 0.8
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: -1, y: 1, z: 1 },
                        color: 0xffffff,
                        intensity: 0.8
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 1, y: 1, z: -1 },
                        color: 0xffffff,
                        intensity: 0.8
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: -1, y: 1, z: -1 },
                        color: 0xffffff,
                        intensity: 0.8
                    },
                    {
                        type: 'DirectionalLight',
                        position: { x: 0, y: -1, z: 0 },
                        color: 0xffffff,
                        intensity: 0.8
                    }
                ]
			}
		},

		onReady() {},
		computed: {
			...mapGetters([
                'collectionId',
                'isLogin',
                'userInfo',
                'isEnterCollectionsRecordsDetailsPageSource',
                'isEnterDonationFriendPage'
			])
		},

         beforeRouteEnter(to, from, next) {
            next(vm => {
                if (vm.isEnterDonationFriendPage) {
                    vm.path = vm.isEnterCollectionsRecordsDetailsPageSource
                } else {
                    vm.path = from.path
                }
            })
        },

        beforeRouteLeave(to, from, next) {
            if (to.path !== '/donationFriend') {
                this.changeIsEnterDonationFriendPage(false);
            };
            if (this.isEnterDonationFriendPage) {
                this.path = this.isEnterCollectionsRecordsDetailsPageSource
            } else {
                this.path = from.path
            };
            next()
        },

		mounted() {
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                pushHistory();
                    this.$router.push({
                        path: this.path
                    })
                })
            };
            this.toTop();
            this.queryCollectionDetails()
		},

        beforeDestroy() {
            if (this.timeIndex) {
                cancelAnimationFrame(this.timeIndex); 
            }
        },

		methods: {
			...mapMutations([
                'changeDonationProductDetails',
                'changeIsEnterDonationFriendPage',
                'changeIsEnterCollectionsRecordsDetailsPageSource'
			]),

            // 三维图片旋转函数
            rotate () {
                this.rotation.y += 0.01;
                this.timeIndex = requestAnimationFrame(this.rotate)
            },

            //藏品展开事件
            unfoldPictureEvent () {
                if (this.collectionRecordDetails.three === '0') {
                    this.isShowPicture = true;
                    this.$refs.objectPicture.style.width = '100%';
                } else if (this.collectionRecordDetails.three !== '0') {
                    this.isShowThreeDimensional = true
                }
            },

            //藏品放大事件
            pictureScaleEvent () {
                this.objectPictureWidth = this.$refs.objectPicture.offsetWidth;
                this.objectPictureWidth += 10;
                this.$refs.objectPicture.style.width = `${this.objectPictureWidth}px`
            },

            //藏品缩小事件
            pictureReduceEvent () {
                this.objectPictureWidth = this.$refs.objectPicture.offsetWidth;
                if (this.objectPictureWidth > 20) {
                    this.objectPictureWidth -= 10;
                    this.$refs.objectPicture.style.width = `${this.objectPictureWidth}px`
                }
            },

            //关闭图片展示事件
            closePictureUnfoldEvent () {
                if (this.collectionRecordDetails.three === '0') {
                    this.isShowPicture = false;
                    this.toTop();
                } else if (this.collectionRecordDetails.three !== '0') {
                    this.isShowThreeDimensional = false
                }
            },

            //让页面滚动到顶部
            toTop() {
                document.querySelector('#top-content').scrollIntoView(true)
            },

            //3d模型加载完成事件
            threeDimensionalLoaded () {
                this.threeDimensionalShow = false;
                this.rotate()
            },

            //3d模型加载过程
            threeDimensionProgress () {
            },

            //3d模型加载失败
            threeDimensionalError () {
                this.threeDimensionalShow = false;
                this.$toast({
                    message: '3D模型加载失败!',
                    position: 'bottom'
                })
            },

            // 查询藏品详情
            queryCollectionDetails () {
                this.loadingImgGifShow = true;
                queryObjectRecordDetails(this.collectionId.id).then((res) => {
                    this.loadingImgGifShow = false;
                     if (res.data.data.three !== '0') {
                        this.threeDimensionalShow = true
                    };
                    if (res && res.data.code == 0) {
                        this.collectionRecordDetails = res.data.data;
                        this.changeDonationProductDetails(res.data.data);
                    } else {
                        this.$toast({
                            message: `${res.data.msg}`,
                            position: 'bottom'
                        })
                    }
                })
                .catch((err) => {
                    this.loadingImgGifShow = false;
                    this.$toast({
                        message: `${err.message}`,
                        position: 'bottom'
                    })
                })
            },

            //查询下载图片地址
            queryObjectImgInfo () {
                return new Promise((resolve,rejrect) => {
                    this.loadingShow = true;
                    useObjectImg(this.collectionId.id).then((res) => {
                        console.log('图片地址',res);
                        this.loadingShow = false;
                        if (res && res.data.code == 0) {
                            resolve(res.data.url)
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
                })
            },

            // 使用图片
            async useObjectImgEvent () {
                // let imgUrl = await this.queryObjectImgInfo();
                let dataUrl = 'http://fidesum-1256093638.cos.ap-beijing.myqcloud.com/nft/20220426/da69239006614fbba310ed2423cecd80.jpg';
                this.getUrlBase64(dataUrl).then((base64) => {
                    let a = document.createElement("a");
                    a.style.display = "none";
                    a.download = 'img';
                    a.href = base64;
                    document.body.appendChild(a);
                    a.click();
                })
            },

            getUrlBase64(url) {
                return new Promise((resolve) => {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    let img = new Image();
                    img.setAttribute("crossOrigin", "anonymous"); //允许跨域
                    img.src = url;
                    img.onload = function () {
                        canvas.height = 300;
                        canvas.width = 300;
                        ctx.drawImage(img, 0, 0, 300, 300);
                        let dataURL = canvas.toDataURL("image/png");
                        canvas = null;
                        resolve(dataURL);
                    }
                });
            },    

            // 转增好友藏品
            donationFriendEvent () {
                if (this.collectionRecordDetails.status == 0 || this.collectionRecordDetails.status == 2) { return };
                this.changeIsEnterDonationFriendPage(true);
                this.$router.push({
                    path: '/donationFriend'
                })
            }
		}
	}
</script>

<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
    @keyframes product-animation{
        0% {
            transform: translateX(-1px) translateZ(10px) rotateY(0deg)
        }
        25% {
            transform: translateX(-1px) translateZ(10px) rotateY(15deg)
        }
        50% {
            transform: translateX(-1px) translateZ(10px) rotateY(-15deg)
        }
        75% {
            transform: translateX(-1px) translateZ(10px) rotateY(15deg)
        }
        100% {
            transform: translateX(-1px) translateZ(10px) rotateY(0deg)
        }
    };
	.page-box {
		.content-wrapper();
        background: @color-background;
        /deep/ .van-nav-bar {
            background: transparent;
            .van-icon {
                color: #fff !important;
                font-size: 18px !important
            };
            .van-nav-bar__title {
                color: #fff !important;
                font-size: 16px !important
            }
        };
        .light-box {
            width: 80%;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
            >img {
                width: 100%
            }
        };
        .show-picture-box {
            /deep/ .van-dialog {
                border-radius: 0;
                width: 100%;
                height: 100vh;
                top: 0;
                left: 0;
                background: @color-background;
                transform: translate3d(0,0,0);
                .van-dialog__content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    position: relative;
                    .unfold-top {
                        height: 80px;
                        display: flex;
                        padding: 0 10px;
                        box-sizing: border-box;
                        flex-flow: row nowrap;
                        align-items: center;
                        justify-content: space-between;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        z-index: 1000;
                        .top-left {
                            flex: 1;
                            width: 0;
                            >p {
                                padding-left: 10px;
                                box-sizing: border-box;
                                .no-wrap();
                                &:first-child {
                                    font-size: 18px;
                                    color: #fff;
                                    margin-bottom: 8px;
                                };
                                &:last-child {
                                    font-size: 14px;
                                    color: #b1b1b1
                                }
                            }
                        };
                        .top-right {
                        }
                    };
                    .unfold-center {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        overflow: auto;
                        position: relative;
                        .collection-exhibition {
                            flex: 1;
                            width: 100%;
                            margin: 0 auto;
                            position: relative;
                            display: flex;
                            flex-flow: row nowrap;
                            align-items: center;
                            justify-content: center;
                            img {
                                pointer-events: none;
                                width: 100%
                            };
                            .abbr-img {
                                overflow-x: scroll;
                                margin-top: 60px;
                                padding: 0 6px;
                                box-sizing: border-box;
                                scrollbar-width: none;
                                -ms-overflow-style:none;
                            };
                            .abbr-img::-webkit-scrollbar {
                                display: none;
                            };
                        };
                        .booth {
                            width: 100%;
                            margin: 0 auto;
                            margin-top: 30px;
                            >img {
                                width: 100%
                            }
                        }
                    };
                    .operation-box {
                        position: fixed;
                        bottom: 30px;
                        width: 120px;
                        height: 50px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: black;
                        border-radius: 20px;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        align-items: center;
                        padding: 0 20px;
                        box-sizing: border-box
                    }
                }    
            }
        };
        .three-dimensional-box {
            /deep/ .van-dialog {
                border-radius: 0;
                width: 100%;
                height: 100vh;
                top: 0;
                left: 0;
                background: @color-background;
                transform: translate3d(0,0,0);
                .van-dialog__content {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    position: relative;
                    .unfold-top {
                        height: 80px;
                        display: flex;
                        padding: 0 10px;
                        box-sizing: border-box;
                        flex-flow: row nowrap;
                        align-items: center;
                        justify-content: space-between;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        z-index: 1000;
                        .top-left {
                            flex: 1;
                            width: 0;
                            >p {
                                padding-left: 10px;
                                box-sizing: border-box;
                                .no-wrap();
                                &:first-child {
                                    font-size: 18px;
                                    color: #fff;
                                    margin-bottom: 8px;
                                };
                                &:last-child {
                                    font-size: 14px;
                                    color: #b1b1b1
                                }
                            }
                        };
                        .top-right {
                        }
                    };
                    .unfold-center {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        overflow: auto;
                        position: relative;
                        .collection-exhibition {
                            flex: 1;
                            width: 100%;
                            margin: 0 auto;
                            position: relative;
                            .three-dimensional-img {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                flex-flow: row nowrap;
                                align-items: center;
                                justify-content: center
                            };
                        };
                        .booth {
                            width: 100%;
                            margin: 0 auto;
                            margin-top: 30px;
                            >img {
                                width: 100%
                            }
                        }
                    };
                    .operation-box {
                        position: fixed;
                        bottom: 30px;
                        height: 30px;
                        font-size: 12px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: black;
                        color: #fff;
                        border-radius: 10px;
                        display: flex;
                        flex-flow: row nowrap;
                        align-items: center;
                        padding: 0 10px;
                        box-sizing: border-box
                    }
                }    
            }
        };
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding-bottom: 80px;
            box-sizing: border-box;
            .content-top {
                .collection-exhibition {
                    width: 80%;
                    perspective: 400px;
                    perspective-origin: 50% 50%;
                    transform-style: preserve-3d;
                    margin: 0 auto;
                    position: relative;
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    justify-content: center;
                    height: 50vh;
                    img {
                        pointer-events: none;
                        width: 100%
                    };
                    .abbr-img {
                        width: 250px;
                        height: 35vh;
                        margin-top: 6vh;
                        animation-name: product-animation;
                        animation-duration: 14s;
                        animation-iteration-count: infinite;
                        >img {
                            width: 100%;
                            height: 100%;
                            object-fit: contain
                        }
                    };
                    .three-dimensional-img {
                        width: 100%;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;
                        align-items: center;
                        >div {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: center;
                            align-items: center;
                        }
                    };
                    .loading-img-wrapper {
                        position: absolute;
                        width: 100px;
                        height: 100px;
                        top: 50%;
                        transform: translateY(-50%);
                        .loading-img {
                            width: 100px;
                        }
                    };    
                    .loading-img {
                        width: 100px;
                    };
                };
                .booth {
                    width: 80%;
                    margin: 0 auto;
                    margin-top: 30px;
                    position: relative;
                    >img {
                        width: 100%
                    };
                    .unfold {
                        position: absolute;
                        top: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 100px;
                        img {
                            width: 100px
                        }
                    }
                };
                .synopsis {
                    width: 80%;
                    display: flex;
                    margin: 0 auto;
                    margin-top: 20px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    .title {
                        width: 80%;
                        font-size: 24px;
                        color: #FFFFFF;
                        text-align: center;
                        font-weight: bold;
                        .no-wrap()
                    };
                    .number {
                        width: 80%;
                        font-size: 14px;
                        margin-top: 16px;
                        display: flex;
                        box-sizing: border-box;
                        height: 25px;
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: center;
                        align-items: center;
                        display: flex;
                        flex-flow: row nowrap;
                        .number-content {
                            position: relative;
                            display: flex;
                            align-items: center;
                            height: 38px;
                            .blockchain-img {
                                width: 35px;
                                position: absolute;
                                left: 0;
                                top: 0;
                                img {
                                    width: 35px;
                                }
                            };
                            .blockchain-chain {
                                display: inline-block;
                                max-width: 200px;
                                padding: 0 16px;
                                border-radius: 10px;
                                margin-left: 20px;
                                font-size: 10px;
                                box-sizing: border-box;
                                height: 22px;
                                line-height: 22px;
                                background-image: linear-gradient(to right, #fbd2a5, #f1c593);
                                color: black;
                                .no-wrap()
                            }
                        }    
                    }
                }
		    };
            .content-middle {
                width: 94%;
                margin: 0 auto;
                background: @color-block;
                padding: 20px 10px;
                margin-top: 20px;
                box-sizing: border-box;
                border-radius: 14px;
                display: flex;
                flex-flow: column;
                align-items: center;
                > div {
                    display: flex;
                    flex-flow: column;
                    align-items: center;
                    margin-bottom: 30px;
                    &:last-child {
                        margin-bottom: 0
                    };
                    span {
                        display: inline-block;
                        &:first-child {
                            font-size: 10px;
                            color: #8e8e8e;
                            margin-bottom: 10px;
                        };
                        &:last-child {
                            font-size: 16px;
                            color: #FFFFFF
                        }
                    }
                };
                .hash-value {
                    width: 100%;
                    span {
                         &:last-child {
                            width: 60%;
                            .no-wrap();
                            height: 30px;
                            line-height: 30px;
                            font-size: 10px;
                            text-align: center;
                            padding: 0 10px;
                            box-align: border-box;
                            border-radius: 6px;
                            color: black;
                            background-image: linear-gradient(to right, #f2c460 ,#e29119);
                        }
                    }
                }
            }
        };
		.content-bottom {
            background: #00020f;
			width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
			display: flex;
			flex-flow: row nowrap;
            padding-bottom: constant(safe-area-inset-bottom); /* 兼容 iOS<11.2 */
            padding-bottom: env(safe-area-inset-bottom); /* 兼容iOS>= 11.2 */
			justify-content: space-between;
            align-items: flex-start;
            padding: 10px;
            box-sizing: border-box;
            color: #fff;
            >div {
                flex: 1;
                height: 50px;
                display: flex;
			    flex-flow: row nowrap;
                justify-content: center;
                font-size: 13px;
                align-items: center;
                >span {
                    margin-left: 4px
                }
            }
		};
        .donationStyle {
            background-image: linear-gradient(to right, #f1f0ee ,#555453);
            color: #666     
        }
	}
</style>

