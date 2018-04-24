<template>
	<div class="restaurant">
		<top-bar></top-bar>
		<div class="restaurant-container">
			<div class="shop-info-container">
				<img :src="'/img/' + restaurant.image_path">
				<div class="shop-title-container">
					<span class="shop-title">{{ restaurant.name }}</span>
					<div class="shop-rating-container">
						<Rate :value="restaurant.rating" disabled></Rate>
						<span class="shop-rating-count">( {{ restaurant.rating_count }} )</span>
					</div>
				</div>
				<div class="shop-extra-info">
					<ul>
						<li class="rating-detail">
							<div class="rating-amount-info">
								<h2>{{ getFormatNum(ratingScore.overall_score, 'score') }}</h2>
								<p>
									综合评价<br>
									<span class="compare-rating-desc">高于周边商家</span>
									<span class="compare-rating">{{ getFormatNum(ratingScore.compare_rating)}}</span>
								</p>
							</div>
							<div class="rating-service-container">
								<p>
									服务态度
									<Rate :value="ratingScore.service_score" disabled></Rate>
									<span class="rating-service-score">{{ getFormatNum(ratingScore.service_score, 'score') }}</span>
								</p>
								<p>
									菜品评价
									<Rate :value="ratingScore.food_score" disabled></Rate>
									<span class="rating-service-score">{{ getFormatNum(ratingScore.food_score, 'score') }}</span>
								</p>
							</div>
						</li>
						<li class="shop-contact">
							<p>商家地址：{{ restaurant.address }}</p>
							<p>营业时间：{{ restaurant.opening_hours[0] }}</p>
						</li>
						<li>
							<p class="delivery-mode">由  {{ restaurant.delivery_mode.text }}  提供配送服务</p>
						</li>
					</ul>
				</div>
			</div>
			<div class="service-container">
				<span>
					<em class="service-title">起送价</em>
					<em class="service-value">{{restaurant.float_minimum_order_amount}}元</em>
				</span>
				<span>
					<em class="service-title">配送费</em>
					<em class="service-value">{{restaurant.float_delivery_fee}}元</em>
				</span>
				<span>
					<em class="service-title">平均送达速度</em>
					<em class="service-value">{{ restaurant.order_lead_time}}</em>
				</span>
			</div>
		</div>
		<div class="food-filter-container">
			<div class="pane-control">
				<a class="pane-control-item" @click="handleSwitchPanel('food')">所有商品</a>
				<a class="pane-control-item" @click="handleSwitchPanel('rating')">评价</a>
				<a class="pane-control-item" @click="handleSwitchPanel('quality')">商家资质</a>
				<span class="food-filter">
					<a>默认排序</a>
					<a>评分</a>
					<a>销量</a>
					<a>价格</a>
					<span class="pane-switch">
						<Icon type="grid" size="24"></Icon>
						<Icon type="ios-list-outline" size="24"></Icon>
					</span>
				</span>
			</div>
			<div class="search-pane">
				<Input
					class="search-input"
					placeholder="搜索商家,美食..."
					icon="ios-search-strong"
					size="large">
				</Input>
			</div>
		</div>
		<div class="content-container">
			<div ref="content" class="content-main">
				<template v-if="panel === 'food'">
					<div
						id="foodCate"
						:class="{'food-cate-left': showOnLeft, 'food-cate': !showOnLeft}">
						<a
							v-for="( cate, key ) in foodCate"
							:class="{active: cate === selectedCate}"
							@click="handleClickFoodCate(key)">
								{{ cate }}
						</a>
					</div>
					<div id="foodItemContainer" class="food-item-container">
						<div
							:id="'foodItem' + key"
							v-for="( item, key ) in menu"
							:key="key"
							class="food-item">
							<h2 class="food-item-title">
								{{ item.name }}
								<span>{{ item.description }}</span>
							</h2>
							<div
								v-for="food in item.foods"
								class="food">
									<img :src="'/img/' + food.image_path">
									<div class="food-detail-container">
										<h3>{{ food.name }}</h3>
										<star-rating
											:rating="food.rating"
											:increment="0.1"
											:read-only="true"
											:star-size="15"
											:show-rating="false"></star-rating>
										<span>({{ food.rating_count }})</span>
										<span>月售{{ food.month_sales }}份</span>
										<div class="food-min-price-container">
											<span class="food-min-price">￥{{ food.specfoods[0].price}}</span>
											<span>起</span>
										</div>
									</div>
							</div>
						</div>
					</div>
				</template>
				<template v-if="panel === 'rating'">
					<div class="rating-cate">
						<a
							:class="{active: item.name === selectedRatingCate}"
							@click="handleClickRatingCate(index)"
							v-for="(item, index) of ratingTags">
								{{ item.name + '(' + item.count + ')' }}
						</a>
					</div>
					<ul class="rating-item-container">
						<li v-for="item of ratings">
							<img :src="getImgPath(item.avatar)" :alt="item.username" class="rating-item-user-avatar">
							<div class="rating-item-detail-container">
								<div class="rating-item-top">
									<div class="rating-item-user">
										<span>{{ item.username }}</span>
										<span>{{ item.rated_at }}</span>
									</div>
									<div class="rating-item-score">
										<star-rating
											:rating="item.rating_star"
											:increment="0.1"
											:read-only="true"
											:star-size="15"
											:show-rating="false"></star-rating>
											<span>{{ item.time_spent_desc }}</span>
									</div>
								</div>
								<div class="rating-item-bottom">
									<div
										v-for="food of item.item_ratings"
										class="rating-item-food">
											<img :src="getImgPath(food.image_hash)" :title="food.food_name">
											<span :title="food.food_name">{{ food.food_name }}</span>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</template>
			</div>
			<div class="announcement-container">
				<div class="announcement-detail">
					<span>商家公告</span>
					<span>{{ restaurant.promotion_info }}</span>
				</div>
				<div class="delivery-desc">
					<span>配送说明：</span>
					<span>配送费￥{{ restaurant.float_delivery_fee }}</span>
				</div>
				<div class="support-item-container">
					<div v-for="support of restaurant.supports" class="support-item">
						<span>{{ support.icon_name }}</span>
						<span>{{ support.description }}</span>
					</div>
				</div>
			</div>
		</div>
		<footer-comp></footer-comp>
	</div>
</template>
<script type="text/javascript">
	import TopBar from '../components/common/topbar.vue';
	import FooterComp from '../components/common/footer.vue';
	import { getImgPath } from '../components/common/mixin.js';
	import StarRating from 'vue-star-rating';
	import {
		getRestaurantInfo,
		getMenu,
		getRestaurantRatings,
		getRestaurantRatingScores,
		getRestaurantRatingTags,
		addToCart
	 } from '../service/getData.js';

	export default{
		components: {
			TopBar,
			FooterComp,
			StarRating
		},
		data(){
			return {
				restaurant: {}, //餐馆对象
				menu: [], //食品列表
				foodCate: [], //食品分类
				ratings: [], //客户评价信息
				ratingScore: {}, //餐馆评分
				ratingTags: [], //客户评价标签
				selectedCate: '热销榜', //选中的食品类别
				selectedRatingCate: '全部', //选中的评价分类
				showOnLeft: false, //控制菜品分类位置
				scrollTop: 0, //滚动条滚动距离
				panel: 'food', //控制显示食品或评价或商家资质
			};
		},
		mixins: [getImgPath],
		computed: {
			//食品详细分类元素对象列表
			itemList(){
				let list = [];
				for( let item of this.menu){
					let index = this.menu.indexOf(item);
					let ele = document.getElementById('foodItem' + index);
					if(ele){
						let offsetTop = ele.getBoundingClientRect().top + document.documentElement.scrollTop - 183; //183是食品分类在顶部时的高度， 点击选择有一个偏移量
						list.push({
							key: index,
							foodCate: item.name,
							ele: ele,
							offsetTop: offsetTop,
						});
					}
				}
				return list;
			},
		},
		watch: {
			scrollTop(){
				let current = '';
				for( let i of this.itemList){
					if (this.scrollTop >= i.offsetTop-150) {
						current = i.foodCate;
					}
				}
				this.selectedCate = current;
			},
		},
		methods: {
			handleClickFoodCate(key){
				//debugger
				this.showOnLeft = true;
				this.selectedCate = this.foodCate[key];
				let y = this.itemList[key].offsetTop;
				window.scrollTo(0, y);
			},
			handleClickRatingCate(index){
				this.selectedRatingCate = this.ratingTags[index].name;
			},
			handleSwitchPanel(type){
				this.panel = type;
			},
			scroll(e){
				if (this.$refs.content.getBoundingClientRect().top < 0) {
					this.showOnLeft = true;
				}else{
					this.showOnLeft = false;
				}
				this.scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
			},
			getFormatNum(num, type){
				if (type === 'score') {
					return parseInt(num).toFixed(1);
				}else{
					return (Number(num)*100).toFixed(1) + '%';
				}
			},
			bindEvent(){
				document.addEventListener('scroll', this.scroll, false);
			},
			unbindEvent(){
				document.removeEventListener('scroll', this.scroll, false);
			}
		},
		created(){
			let id = this.$route.params.id;
			getRestaurantInfo(id).then( res => this.restaurant = res);
			getMenu(id).then( res => {
				this.menu = res;
				for( let item of res){
					this.foodCate.push(item.name);
				}
			});
			getRestaurantRatings(id).then(res => this.ratings = res);
			getRestaurantRatingScores(id).then( res => this.ratingScore = res);
			getRestaurantRatingTags(id).then( res => this.ratingTags = res);
		},
		mounted(){
			this.bindEvent();
		},
		beforeDestroy(){
			this.unbindEvent();
		}
	}
</script>
<style type="text/css" scoped>
	.restaurant{
		width: 100%;
	}
	.restaurant-container{
		width: 1180px;
		position: relative;
		display: table;
		height: 142px;
		margin: 0 auto;
	}
	.shop-info-container{
		position: relative;
		display: table-cell;
		vertical-align: middle;
		z-index: 1;
	}
	.shop-info-container>img{
		vertical-align: middle;
		width: 95px;
		height: 95px;
		border-radius: 50%;
		margin-right: 10px;
	}
	.shop-title-container{
		display: inline-block;
		vertical-align: middle;
	}
	.shop-title{
		font-size: 20px;
		font-weight: 400;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.shop-info-container:hover .shop-extra-info{
		display: block;
	}
	.shop-extra-info{
		display: none;
		position: absolute;
		top: 142px;
		width: 100%;
		border-radius: 6px;
		box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
		max-height: 900px;
		background: #fff;
		color: #333;
		z-index: 1;
	}
	.shop-extra-info>ul{
		list-style: none;
		padding: 0 20px;
	}
	.shop-extra-info>ul>li{
		padding: 15px 0;
		border-bottom: 1px dashed #eee;
		color: #333;
	}
	.rating-detail{
		display: table;
		width: 100%;
		padding: 15px 0;
	}
	.rating-detail>div{
		position: relative;
		display: table-cell;
		vertical-align: middle;
		text-align: center;
	}
	.rating-amount-info{
		border-right: 1px solid #eee;
	}
	.rating-amount-info>h2{
		font-size: 28px;
		color: #f74342;
	}
	.rating-amount-info>p{
		text-align: center;
		font-size: 12px;
		color: #333;
	}
	.compare-rating-desc{
		font-size: 12px;
		color: #999;
	}
	.compare-rating{
		color: #f74342;
	}
	.service-container{
		display: table-cell;
		vertical-align: middle;
		text-align: right;
	}
	.service-container:first-child{
		margin-left: 0;
	}
	.service-container>span{
		vertical-align: top;
		text-align: center;
		display: inline-block;
		margin-left: 80px;
	}
	.service-container em{
		display: block;
		font-style: normal;
		font-weight: 400;
	}
	.service-title{
		font-size: 14px;
	}
	.service-value{
		margin: 12px 0 3px 0;
		font-size: 18px;
	}
	.rating-service-score{
		color: #f74342
	}
	.shop-contact{
		font-size: 14px;
	}
	.shop-contact p:first-child{
		margin-bottom: 5px;
	}
	.delivery-mode{
		font-size: 14px;
	}
	.food-filter-container{
		line-height: 60px;
		width: 1180px;
		margin: 0 auto;
		overflow: hidden;
		border-radius: 6px;
		background: #fff;
	}
	.pane-control{
		float: left;
		width: 75%;
	}
	.pane-control-item{
		display: inline-block;
		width: 112px;
		text-align: center;
		color: #333;
		font-size: 16px;
	}
	.food-filter{
		float: right;
		display: inline-block;
		line-height: 60px;
	}
	.food-filter>a{
		color: #333;
		display: inline-block;
		padding: 0 15px;
		font-size: 14px;
		line-height: 1;
	}
	.pane-switch{
		display: inline-block;
		line-height: 60px;
	}
	.pane-switch>i{
		vertical-align: middle;
		margin: 0 10px;
	}
	.search-pane{
		width: 25%;
		float: right;
		padding: 0 10px;
	}
	.content-container{
		width: 1180px;
		margin: 0 auto;
		overflow: hidden;
		padding-top: 20px;
	}
	.content-main{
		display: inline-block;
		float: left;
		width: 75%;
	}
	.food-cate,
	.rating-cate{
		width: 100%;
		padding: 10px 15px 5px;
		border: 1px solid #eee;
		background: #fff;
	}
	.food-cate>a,
	.rating-cate>a{
		display: inline-block;
		margin: 5px;
		padding: 3px 10px;
		width: 18%;
		border-radius: 2px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		color: #333;
		font-size: 14px;
	}
	.food-cate>a.active,
	.rating-cate>a.active{
		background-color: #0089dc;
		color: #fff;
	}
	.food-cate-left{
		position: fixed;
		top: 0;
		margin-left: -150px;
		width: 130px;
		max-height: 700px;
		border: none;
		border-right: 1px solid #ddd;
		background-color: transparent;
		padding-right: 10px;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.food-cate-left::-webkit-scrollbar{
		background: #b7b7b7;
		width: 4px;
		height: 4px;
	}
	.food-cate-left>a{
		transition: color .3s;
		position: relative;
		display: block;
		padding: 15px 15px 15px 0;
		width: auto;
		text-align: right;
		overflow: visible;
		font-size: 12px;
		color: #333;
	}
	.food-cate-left>a.active{
		color: #0089dc;
		font-size: 14px;
	}
	.food-cate-left>a:after{
		content: '';
		position: absolute;
		top: 50%;
		right: -4px;
		margin-top: -6px;
		width: 12px;
		height: 12px;
		background-color: #ddd;
		border: 2px solid #f7f7f7;
		border-radius: 50%;
	}
	.food-cate-left>a.active:after{
		background-color: #0089dc;
	}
	.food-item-container{
		width: 100%;
	}
	.food-item{
		width: 102%;
		overflow: hidden;
	}
	.food-item-title{
		padding: 20px 0 10px 15px;
		font-size: 20px;
		font-weight: 400;
		color: #333;
	}
	.food-item-title span{
		font-size: 12px;
		color: #999;
	}
	.food{
		display: flex;
		float: left;
		margin-right: 2%;
		margin-bottom: 15px;
		padding-right: 10px;
		border: 1px solid #eee;
		background: #fff;
		width: 48%;
	}
	.food>img{
		flex-grow: 0;
		width: 100px;
		height: 100px;
		margin-right: 14px;
	}
	.food-detail-container{
		position: relative;
		flex-grow: 1;
		display: inline-block;
	}
	.food-detail-container>h3{
		font-size: 16px;
		font-weight: 700;
		margin-top: 10px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		word-break: keep-all;
	}
	.food-detail-container>div{
		max-width: 200px;
		display: inline-block;
	}
	.food-min-price-container{
		position: absolute;
		bottom: 10px;
		left: 0;
	}
	.food-min-price{
		font-size: 14px;
		font-weight: 700;
		color: #f74342;
	}
	.rating-item-container{
		width: 100%;
	}
	.rating-item-container>li{
		display: flex;
		background: #fff;
		color: #000;
		margin-top: 20px;
		border-radius: 10px;
		padding: 20px;
	}
	.rating-item-user-avatar{
		width: 80px;
		height: 80px;
		border-radius: 50%;
	}
	.rating-item-detail-container{
		display: inline-block;
		flex-grow: 1;
		padding-left: 20px;
	}
	.rating-item-user span:first-child{
		font-size: 18px;
	}
	.rating-item-user span:last-child{
		float: right;
		font-size: 16px;
		color: #c5c5c5;
	}
	.rating-item-score{
		vertical-align: middle;
		font-size: 14px;
	}
	.rating-item-score>:first-child{
		display: inline-block;
	}
	.rating-item-food{
		display: inline-block;
		width: 50%;
		text-align: center;
		font-size: 16px;
	}
	.rating-item-food>img{
		width: 100%;
		padding: 10px;
		display: block;
	}
	.announcement-container{
		display: inline-block;
		width: 25%;
		padding: 0 15px;
	}
	.announcement-detail span:first-child{
		display: block;
		padding: 0 15px;
		font-size: 16px;
		font-weight: 400;
		line-height: 50px;
		background: #0089dc;
		color: #fff;
	}
	.announcement-detail span:last-child{
		display: block;
		padding: 10px 15px;
		font-size: 14px;
		background: #fff;
	}
	.delivery-desc{
		padding: 10px 15px;
		background: #f5f5f5;
	}
	.delivery-desc span{
		display: block;
		font-size: 14px;
	}
	.delivery-desc span:first-child{
		font-weight: 700;
	}
	.support-item-container{
		padding: 0 15px;
		background: #fff;
	}
	.support-item{
		padding: 10px 0;
	}
	.support-item span:first-child{
		display: inline-block;
		float: left;
		width: 22px;
		height: 22px;
		text-align: center;
		border-radius: 50%;
		background: #999999;
		color: #fff;
		font-size: 12px;
		line-height: 22px;
	}
	.support-item span:last-child{
		display: inline-block;
		max-width: 200px;
		font-size: 14px;
		margin-left: 5px;
	}
</style>