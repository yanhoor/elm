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
	        <router-link to="/login" class="topbar-nav-item" v-if="!user.user_id">登录/注册</router-link>
	        <div class="topbar-user-info-container" v-else>
	        	<span>{{ user.username }}</span>
	        	<div class="topbar-user-info">
	        		<span class="down-arrow"></span>
	        		<div class="topbar-user-info-dropbox">
	        			<span @click="handleClickDropbox('center')">个人中心</span>
	        			<span @click="handleClickDropbox('favorite')">我的收藏</span>
	        			<span @click="handleClickDropbox('address')">我的地址</span>
	        			<span @click="handleClickDropbox('safety')">安全设置</span>
	        			<span @click="handleClickDropbox('logout')">退出登录</span>
	        		</div>
	        	</div>
	       </div>
	      </nav>
	    </div>
	  </header>
	</div>
</template>
<script type="text/javascript">
	import { signout } from '../../service/getData.js';

	export default{
		data(){
			return{
				homePage: '',
				user: {},
			};
		},
		methods: {
			handleClickDropbox(type){
				switch(type){
					case 'center':
						this.$router.push('/profile/');
						break;
					case 'favorite':
						break;
					case 'logout':
						signout().then( res => {
							this.$store.commit('signout');
							this.$router.push('/login');
						});
						break;
				}
			},
		},
		created(){
			this.$store.state.address.geohash ? this.homePage = '/list' : this.homePage = '/home';
			this.user = this.$store.state.user;
		},
	}
</script>
<style type="text/css" lang="scss" scoped>
	@import '../../style/mixin';
	.header-container{
	  @include wh(100%, 60px);
	  font-size: 14px;
	  background: #1e89e0;
	}
	header{
	  width: 1180px;
	  margin: 0 auto;
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
	  @include wh(10%, 60px);
	  float: left;
	  font-size: 16px;
	  text-align: left;
	}
	.topbar-nav{
	  @include wh(30%, 60px);
	  float: right;
	  display: flex;
	}
	.topbar-nav-item{
	  align-self: center;
	  display: inline-block;
	  @include wh(30%, 60px);
	  text-align: right;
	  color: #fff;
	}
	.topbar-user-info-container{
		width: 40%;
		float: right;
		height: 60px;
		color: #fff;
		display: flex;
		jutify-content: center;
		padding-left: 30px;
	}
	.topbar-user-info{
		display: inline-block;
		margin-left: 8px;
		margin-right: 3px;
	    position: relative;
		.down-arrow{
			text-align: center;
			background: #449be5;
			font-size: 20px;
		}
		.down-arrow::before{
			content: '\e904';
			cursor: pointer;
		}
	}
	.topbar-user-info-dropbox{
		display: none;
	}
	.topbar-user-info-container:hover .topbar-user-info-dropbox{
		display: block;
		position: absolute;
		top: 100%;
		right: 0;
		z-index: 10;
		width: 122px;
		padding: 4px 6px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, .5);
		background: rgba(255, 255, 255, .98);
		>span{
			cursor: pointer;
			text-align: center;
			line-height: 32px;
			display: block;
			@include fontscw(16px, #999);
		}
		>span:hover{
			background: #eee;
		}
	}
</style>