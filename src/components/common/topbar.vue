<template>
	<div class="header-container">
	  <header>
	    <div class="header">
	      <router-link :to="homePage" class="topbar-item">首页</router-link :to="">
	      <a class="topbar-item">我的订单</a>
	      <a class="topbar-item">加盟合作</a>
	      <a class="topbar-item">我的客服</a>
	      <nav class="topbar-nav">
	        <a class="topbar-nav-item">规则中心</a>
	        <a class="topbar-nav-item">手机应用</a>
	        <router-link to="/login" class="topbar-nav-item">登录/注册</router-link>
	      </nav>
	    </div>
	  </header>
	</div>
</template>
<script type="text/javascript">
	export default{
		data(){
			return{
				homePage: '',
			};
		},
		created(){
			this.$store.state.address.geohash ? this.homePage = '/list' : this.homePage = '/home';
		},
	}
</script>
<style type="text/css" scoped>
	.header-container{
	  width: 100%;
	  height: 60px;
	  font-size: 14px;
	  background: #1e89e0;
	}
	header{
	  width: 1180px;
	  margin: 0 auto;
	  line-height: 60px;
	  overflow: auto;
	}
	.header{
	  width: 1180px;
	  overflow: auto;
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
	  text-align: left;
	}
	.topbar-nav{
	  width: 30%;
	  float: right;
	  display: flex;
	}
	.topbar-nav-item{
	  flex: 1;
	  display: inline-block;
	  width: 30%;
	  text-align: right;
	}
</style>