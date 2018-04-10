<template>
	<div class="main">
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
		<div class="info-bar">
			<div class="location">
				<span class="location-desc">当前位置：</span>
				<span class="location-current">{{this.address.name}}</span>
				<span
					class="location-change"
					@click="handleChangeAddress">[切换地址]</span>
			</div>
			<div class="search">
				<Input
					class="search-input"
					placeholder="搜索商家,美食..."
					icon="ios-search-strong"
					size="large"></Input>
			</div>
		</div>
		<div class="category">
			<span class="category-desc">商家分类：</span>
			<div class="category-item-container">
				<a class="category-item-all">全部商家</a>
				<a
					v-for="restaurant in restaurantCategoryList"
					class="category-item">
						{{ restaurant.name }}
				</a>
				<div class="sub-category">
					<a
						v-for="item in restaurant.sub_categories"
						class="category-item">
							{{ item.name }}
					</a>
				</div>
			</div>
		</div>
    	<div class="sidebar"></div>
	</div>
</template>
<script type="text/javascript">
	import {
		getRestaurants,
		getFoodCategory,
		getRestaurantCategory
	} from '../service/getData.js';

	export default{
		data(){
			return {
				restaurantList: [], //餐馆列表
				restaurantCategoryList: [], //餐馆分类列表
			}
		},
		methods: {
			handleChangeAddress(){
				this.$router.push('home');
			}
		},
		computed: {
			address(){
				return this.$store.state.address;
			}
		},
		created(){
			getRestaurants(this.address.latitude, this.address.longitude).then( res => {
				this.restaurantList = res;
				console.log('restaurantList ', res);
			});
			getRestaurantCategory().then( res => {
				this.restaurantCategoryList = res;
			});
		}
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
	.info-bar{
		width: 1180px;
		margin: 0 auto;
		height: 60px;
	}
	.location{
		width: 20%;
		float: left;
	}
	.location>span{
		line-height: 60px;
		font-size: 12px;
		display: inline-block;
		vertical-align: top;
	}
	.location-desc{
		color: #999999;
	}
	.location-current{
		max-width: 40%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		word-break: keep-all;
	}
	.location-change{
		color: #2d8cf0;
		cursor: pointer;
	}
	.search{
		float: right;
		line-height: 60px;
	}
	.category{
		width: 1180px;
		padding: 10px;
		margin: 0 auto;
		background: #fff;
		border-radius: 6px;
		box-shadow: 2px 2px 1px rgba(0,0,0,.2);
	}
	.category-desc{
		float: left;
		font-size: 16px;
		color: #999;
		line-height: 36px;
	}
	.category-item-all{
		background: #f6f6f6;
		color: #666;
		font-size: 16px;
		padding: 0 16px;
		line-height: 36px;
	}
	.category-item{
		color: #666;
		font-size: 16px;
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