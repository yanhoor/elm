<template>
    <div class="index-container">
        <div class="top-part">
            <v-topbar></v-topbar>
            <div class="top-divider"></div>
            <div class="login-container">
              <div class="login">
                <div class="wechat">
                  <span>微信扫码</span>
                  <img src="" alt="">
                </div>
                <div>
                  <span>用户登录</span>
                </div>
                <div>
                  <input type="text" placeholder="请输入手机号">
                </div>
                <div>
                  <input type="password" placeholder="请输入密码">
                </div>
                <button>登录</button>
                <div class="login-action">
                  <span>忘记密码</span> | <span>立即注册</span>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
    import topbar from '../components/_topbar.vue';

    export default{
        components: {
            "v-topbar": topbar,
        },
    };
</script>
<style lang="scss" type="text/scss" scoped>
    .index-container{
        width: 100%;
    }
    .top-part{
        width: 100%;
        .top-divider{
          width: 100%;
          height: 1px;
          border-top: 1px solid #ffffff;
        }
        .login-container{
          width: 1170px;
          margin: 0 auto;
          overflow: hidden;
          .login{
            float: right;
          }
        }
    }
</style>

