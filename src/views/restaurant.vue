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
								<h2>{{ ratingScore.overall_score }}</h2>
								<p>
									综合评价<br>
									<span class="compare-rating-desc">高于周边商家</span>
									<span class="compare-rating">{{ ratingScore.compare_rating}}</span>
								</p>
							</div>
							<div class="rating-service-container">
								<p>
									服务态度
									<Rate :value="ratingScore.service_score" disabled></Rate>
									<span class="rating-service-score">{{ ratingScore.service_score }}</span>
								</p>
								<p>
									菜品评价
									<Rate :value="ratingScore.food_score" disabled></Rate>
									<span class="rating-service-score">{{ ratingScore.food_score }}</span>
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
				<a class="pane-control-item">所有商品</a>
				<a class="pane-control-item">评价</a>
				<a class="pane-control-item">商家资质</a>
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
		<footer-comp></footer-comp>
	</div>
</template>
<script type="text/javascript">
	import TopBar from '../components/common/topbar.vue';
	import FooterComp from '../components/common/footer.vue';
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
			FooterComp
		},
		data(){
			return {
				restaurant: {}, //餐馆对象
				menu: [], //食品列表
				ratings: [], //客户评价信息
				ratingScore: {}, //餐馆评分
				ratingTags: [], //客户评价标签
			};
		},
		created(){
			let id = this.$route.params.id;
			getRestaurantInfo(id).then( res => this.restaurant = res);
			getMenu(id).then( res => this.menu = res);
			getRestaurantRatings(id).then(res => this.ratings = res);
			getRestaurantRatingScores(id).then( res => this.ratingScore = res);
			getRestaurantRatingTags(id).then( res => this.ratingTags = res);
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
		padding-left: 10px;
	}
</style>