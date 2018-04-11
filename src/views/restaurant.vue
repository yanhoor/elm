<template>
	<div class="main">
		<top-bar></top-bar>
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
		<div class="rest-display">
			<div
				@mouseover.prevent="showRestInfo = !showRestInfo"
				@mouseout.prevent="showRestInfo = !showRestInfo"
				v-for="item in restaurantSortedList"
				class="rest-container">
					<div class="rest-item">
						<Rest
							:restaurant="item"
							:key="item.id">
						</Rest>
						<div
							v-if="showRestInfo"
							class="rest-info-container">
							<div class="rest-info-top">
								<span class="rest-info-title">{{ item.name }}</span>
								<span class="rest-info-cate">{{ item.category }}</span>
							</div>
							<div class="rest-info-bottom">
								<div
									v-for="sup in item.supports"
									class="rest-info-support-container">
										<span class="rest-info-support-icon">{{ sup.icon_name }}</span>
										<span class="rest-info-support-desc">{{ sup.description }}</span>
								</div>
								<div class="rest-info-cost-container">
									<span class="rest-info-cost">{{ item.piecewise_agent_fee.tips }}</span>
									<span>平均{{ item.order_lead_time }}送达</span>
								</div>
								<div class="rest-info-desc-container">
									<span>{{ item.promotion_info }}</span>
								</div>
							</div>
						</div>
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
	import Rest from '../components/common/restaurant.vue';
	import TopBar from '../components/common/topbar.vue';

	export default{
		components: {
			Rest,
			TopBar,
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
				showRestInfo: false, //是否显示餐馆信息
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
					//全部商家
					case 'main_all':
						break;
					//主类
					case 'only_main':
						list = list.filter( item => item.category.includes(this.mainCate.name));
						break;
					//子类
					case 'sub_cate':
						list = list.filter( item => item.category.includes(this.cateSelected));
						break;
					default:
				}
				this.restaurantSortedList = list;
			},
		},
		computed: {
			address(){
				return this.$store.state.address;
			},
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
		margin: 30px auto 0;
		background: #fff;
		border-radius: 5px;
		border: 1px solid #dddee1;
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
	.rest-display{
		width: 1196px;
		margin: 0 auto;
		line-height: 30px;
		margin-top: 30px;
		overflow: auto;
	}
	.rest-container{
		position: relative;
		float: left;
		width: 25%;
	}
	.rest-item{
		margin: 8px;
		background: #fff;
		padding: 8px;
		border-radius: 5px;
		border: 1px solid #dddee1;
	}
	.rest-item:hover{
		background: #f5f5f5;
	}
	.rest-info-container{
		position: absolute;
		width: 100%;
		left: 100%;
		top: 0;
		z-index: 1000;
		padding: 10px 10px;
		border-radius: 6px;
		border: 1px solid #dddee1;
		background: #fff;
	}
	.rest-info-container>div{
		color: #000;
	}
	.rest-info-top{
		border-bottom: 1px solid #dddee1;
	}
	.rest-info-title{
		display: block;
		color: #000;
		font-size: 16px;
		font-weight: bold;
	}
	.rest-info-support-container{
		margin: 10px 0;
		line-height: normal;
	}
	.rest-info-support-icon{
		float: left;
		display: inline-block;
		width: 20px;
		height: 20px;
		border: 1px solid #333;
		line-height: normal;
		text-align: center;
		font-weight: bold;
	}
	.rest-info-support-desc{
		position: relative;
		display: inline-block;
		margin-left: 10px;
		height: 20px;
		top: 0;
		max-width: 205px;
	}
	.rest-info-cost-container{
		border-radius: 3px;
		text-align: center;
		background: #f6f6f6;
	}
	.rest-info-cost{
		display: inline-block;
		padding-right: 15px;
	}
	.rest-info-desc-container{
		margin-top: 15px;
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
