<template>
    <div class="topbar-container">
        <div class="topbar">
            <div class="logo">
                <img src="" alt="">
            </div>
            <div class="action-container">
                <div class="action-item">
                    <span>首页</span>
                </div>
                <div class="action-item">
                    <span>产品与服务</span>
                </div>
                <div class="action-item">
                    <span>智慧风控</span>
                </div>
                <div class="action-item">
                    <span>我是融资方</span>
                </div>
                <div class="action-item">
                    <span>我是资金方</span>
                </div>
                <div class="action-item">
                    <span>我是保理公司</span>
                </div>
                <div class="action-item">
                    <span>平台API</span>
                </div>
                <div class="action-item">
                    <span>关于</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default{

    };
</script>
<style lang="scss" type="text/scss" scoped>
    .topbar-container{
        width: 100%;
        .topbar{
            width: 1170px;
            margin: 0 auto;
            overflow: hidden;
            .logo{
                float: left;
            }
            .action-container{
                .action-item{
                    float: left;
                    >span{
                        text-align: center;
                        font-size: 16px;
                    }
                }
            }
        }
    }
</style>

