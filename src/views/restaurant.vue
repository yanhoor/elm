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
				<a
					@click="handleClickMainAll"
					class="category-item-all"
					:class="{ on: mainCate === 1 }">全部商家</a>
				<a
					@click="handleClickMainCate(restaurant)"
					v-for="restaurant in restaurantCategoryList"
					class="category-item"
					:class="{ on: restaurant.name === mainCate.name }">
						{{ restaurant.name }}
				</a>
				<div class="sub-category">
					<a
						v-for="item in subCategories"
						@click="handleClickSubCate(item)"
						class="category-item"
						:class="{ on: item.name === subCate.name }">
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
	import Rest from '../components/restaurant.vue';

	export default{
		components: {
			Rest,
		},
		data(){
			return {
				restaurantList: [], //餐馆列表
				restaurantSortedList: [], //已筛选的餐馆列表
				restaurantCategoryList: [], //餐馆分类列表，删除‘全部商家’项
				subCategories: [], //餐馆分类子类别
				mainCate: {}, //选中的餐馆主类
				subCate: {}, //选中的餐馆子类
				cateSelected: '', //主类与子类name组成的字符串
			}
		},
		methods: {
			handleChangeAddress(){
				this.$router.push('home');
			},
			handleClickMainCate(item){
				this.subCategories = item.sub_categories;
				this.mainCate = item;
				this.subCate = {};
				this.handleSortRestaurant('only_main');
			},
			handleClickSubCate(item){
				this.subCate = item;
				if ( !item.name.includes('全部') ) {
					this.cateSelected = this.mainCate.name + '/' + item.name;
					this.handleSortRestaurant('sub_cate');
				}else{
					this.handleSortRestaurant('only_main');
				}
			},
			handleClickMainAll(){
				this.subCategories = [];
				this.cateSelected = '';
				this.mainCate = 1;
				this.subCate = {};
				this.handleSortRestaurant('main_all');
			},
			handleSortRestaurant(type){
				let list = [...this.restaurantList];
				switch(type) {
					case 'main_all':
						break;
					case 'only_main':
						list = list.filter( item => item.category.includes(this.mainCate.name));
						break;
					case 'sub_cate':
						list = list.filter( item => item.category.includes(this.cateSelected));
						break;
					default:
				}
				this.restaurantSortedList = list;
			}
		},
		computed: {
			address(){
				return this.$store.state.address;
			}
		},
		created(){
			getRestaurants(this.address.latitude, this.address.longitude).then( res => {
				this.restaurantList = [...res];
				this.restaurantSortedList = [...res];
				console.log('restaurantList ', res);
			});
			getRestaurantCategory().then( res => {
				let index = -1;
				for( let item of res){
					if (item.name.includes('全部商家')) index = res.indexOf(item);
				}
				res.splice(index, 1);
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
		margin: 5px 0;
	}
	.category-item-all{
		color: #666;
		font-size: 16px;
		padding: 0 16px;
		line-height: 36px;
	}
	.category-item{
		color: #666;
		font-size: 16px;
		line-height: 36px;
		padding: 0 16px;
		height: 38px;
	}
	.category-item-container{
		display: inline-block;
		max-width: 1080px;
	}
	.category-item-container a{
		display: inline-block;
		margin: 5px 6px;
		border-radius: 4px;
		font-size: 14px;
		color: #666;
	}
	.sub-category{
		background: #f6f6f6;
		border-radius: 4px;
	}
	a.on{
		color: #fff;
		background: #0089dc;
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