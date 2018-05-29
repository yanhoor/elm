<template>
	<div class="main">
		<top-bar></top-bar>
		<div class="info-bar">
			<div class="location">
				<span class="location-desc">当前位置：</span>
				<span class="location-current" :title="address.name">{{this.address.name}}</span>
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
			<div class="rest-container">
					<div
						@mouseenter.self="handleMouseEvent(item, index, $event)"
						@mouseleave.self="handleMouseEvent('leave', index, $event)"
						v-for="( item, index ) in restaurantSortedList"
						class="rest-item">
							<Rest
								:restaurant="item"
								:key="item.id">
							</Rest>
					</div>
					<div
						v-if="showRestInfo"
						class="rest-info-container"
						:class="{'rest-info-container-left': onLeft, 'rest-info-container-right': !onLeft}"
						:style="floatXY">
						<div class="rest-info-top">
							<span class="rest-info-title">{{ info.name }}</span>
							<span class="rest-info-cate">{{ info.category }}</span>
						</div>
						<div class="rest-info-bottom">
							<div
								v-for="icon in info.supports"
								class="rest-info-support-container">
									<span class="rest-info-support-icon">{{ icon.icon_name  }}</span>
									<span class="rest-info-support-desc">{{ icon.description  }}</span>
							</div>
							<div class="rest-info-cost-container">
								<span class="rest-info-cost">{{ info.piecewise_agent_fee.tips }}</span>
								<span>平均{{ info.order_lead_time }}送达</span>
							</div>
							<div class="rest-info-desc-container">
								<span>{{ info.description }}</span>
							</div>
						</div>
					</div>
			</div>
		</div>
    	<div class="sidebar"></div>
    	<footer-comp></footer-comp>
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
	import FooterComp from '../components/common/footer.vue';

	export default{
		components: {
			Rest,
			TopBar,
			FooterComp,
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
				info: '', //鼠标停留处的餐馆对象
				floatXY: {}, //包含浮动元素坐标的样式对象
				onLeft: true, //控制浮动元素类名
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
			handleMouseEvent(item, index, event){
				let floatOnLeft = (index + 1) % 4 === 0;
				//X，Y是绝对坐标
				let x,y = 0;
				x = event.target.getBoundingClientRect().left + document.documentElement.scrollLeft;
				y = event.target.getBoundingClientRect().top + document.documentElement.scrollTop;

				let floatX, floatY = 0;
				if (floatOnLeft) {
					this.onLeft = false;
					floatX = x - 260 + 'px';
				}else{
					this.onLeft = true;
					floatX = x + 300 + 'px';
				}
				floatY = y + 8 + 'px';

				if (typeof item === 'object') {
					this.showRestInfo = true;
					this.info = item;
					this.floatXY = {
						left: floatX,
						top: floatY
					};
				}else{
					this.showRestInfo = false;
				}
				//console.log('mouse event', x + ' , ' + y + item.name);
			},
		},
		computed: {
			address(){
				return this.$store.state.address;
			},
		},
		created(){
			getRestaurants(this.address.latitude, this.address.longitude, 0, 30).then( res => {
				this.restaurantList = [...res];
				this.restaurantSortedList = [...res];
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
<style lang="scss" type="text/css" scoped>
	@import '../style/mixin';
	.info-bar{
		@include wh(1180px, 60px);
		margin: 0 auto;
	}
	.location{
		width: 20%;
		float: left;
		>span{
			line-height: 60px;
			font-size: 12px;
			display: inline-block;
			vertical-align: top;
		}
		&-desc{
			color: #999999;
		}
		&-current{
			max-width: 40%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			word-break: keep-all;
		}
		&-change{
			color: #2d8cf0;
			cursor: pointer;
		}
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
		@include fontscw(16px, #999);
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
		&-container{
			display: inline-block;
			max-width: 1000px;
		}
		&-container a{
			display: inline-block;
			margin: 5px 6px;
			border-radius: 4px;
			@include fontscw(14px, #666);
		}
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
		width: 100%;
		overflow: hidden;
	}
	.rest-item{
		width: 25%;
		float: left;
		background: #f7f7f7;
	}
	.rest-info-container{
		position: absolute;
		top: 0;
		z-index: 1000;
		padding: 10px 10px;
		border-radius: 6px;
		border: 1px solid #dddee1;
		box-shadow: 0 0 10px #000;
		background: #f7fcf6;
		&-left::before{
			position: absolute;
			content: "";
			left: -32px;
			border: 20px solid transparent;
			border-right-color: #f7fcf6;
		}
		&-right::before{
			position: absolute;
			content: "";
			right: -32px;
			border: 20px solid transparent;
			border-left-color: #f7fcf6;
		}
		>div{
			color: #000;
		}
	}
	.rest-info-top{
		border-bottom: 1px solid #dddee1;
	}
	.rest-info-title{
		display: block;
		@include fontscw(16px, #000, bold);
	}
	.rest-info-support-container{
		margin: 10px 0;
		line-height: normal;
	}
	.rest-info-support-icon{
		float: left;
		display: inline-block;
		@include wh(20px);
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
