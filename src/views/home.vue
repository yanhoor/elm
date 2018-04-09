<template>
  <div id="app">
    <div class="header-container">
      <header>
        <div class="header">
          <a class="topbar-item">首页</a>
          <a class="topbar-item">我的订单</a>
          <a class="topbar-item">加盟合作</a>
          <a class="topbar-item">我的客服</a>
          <nav class="topbar-nav">
            <a class="topbar-nav-item">规则中心</a>
            <a class="topbar-nav-item">手机应用</a>
            <a class="topbar-nav-item">登录/注册</a>
          </nav>
        </div>
      </header>
    </div>
    <div class="sidebar"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
  .header-container{
    width: 100%;
    height: 60px;
    font-size: 14px;
    background: #1e89e0;
  }
  header{
    line-height: 60px;
  }
  .header{
    width: 1180px;
    margin: 0 auto;
    line-height: 60px;
    font-size: 14px;
  }
  .header a{
    color: #fff;
  }
  .topbar-item{
    width: 10%;
    float: left;
    font-size: 16px;
    text-align: center;
  }
  .topbar-nav{
    width: 30%;
    float: right;
  }
  .topbar-nav-item{
    display: inline-block;
    width: 30%;
    text-align: center;
  }
  .sidebar{
    position: fixed;
    top: 0;
    bottom: 0;
    right: -295px;
    width: 330px;
    background: #504d53;
    color: #cccccc;
    z-index: 7;
  }
</style>
