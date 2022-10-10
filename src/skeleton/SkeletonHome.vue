<template>
   <!-- 启动页 -->
        <div class="main">
            <div class="top">
                <img src="../../static/img/default-person.png" alt="">
            </div>
            <div class="blockchain-server">
                <p style="margin-bottom:8px">
                    <span style="font-size:12px">中国传统文化数字艺术联盟监制</span>
                </p>
                <p>
                    <img src="../../static/img/blockchain-service.png" style="width:100px" alt="">
                    <span style="font-size:12px;margin-left:8px">提供技术支持</span>
                </p>
            </div>
        </div>
</template>

<script>
export default {

}
</script>

<style lang='less' scoped>
    @import "../common/stylus/variable.less";
    @import "../common/stylus/mixin.less";
    @import "../common/stylus/modifyUi.less";
    .main {
        .content-wrapper();
        min-height: 100vh;
        background: @color-background;
        .top {
            flex:1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >img {
                width: 50%
            }
        };
        .blockchain-server {
            height: 30vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >p {
                &:nth-child(1) {
                    span {
                        color: #c2c2c2;
                    }
                };
                &:nth-child(2) {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    span {
                        color: #c2c2c2
                    }
                }
            }
        }
    }
</style>