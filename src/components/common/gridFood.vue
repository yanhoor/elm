<template>
	<div class="food-container">
		<div
			v-for="food in foodList"
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
</template>
<script type="text/javascript">
	import StarRating from 'vue-star-rating';

	export default{
		props: {
			foodList: Array,
		},
		components: {
			StarRating,
		},
	}
</script>
<style type="text/css" scoped>
	.food-container{
		overflow: hidden;
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
</style>