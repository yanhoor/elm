<template>
	<div class="food-container">
		<div
			v-for="food in foodList"
			class="food">
				<img :src="'/img/' + food.image_path">
				<div class="food-detail-container">
					<h3>{{ food.name }}</h3>
					<Rate :value="food.rating" disabled allow-half></Rate>
					<span>({{ food.rating_count }})</span>
					<span>月售{{ food.month_sales }}份</span>
				</div>
				<div class="food-min-price-container">
					<span class="food-min-price">￥{{ food.specfoods[0].price}}</span>
					<span>起</span>
				</div>
				<span class="food-add-to-cart">加入购物车</span>
		</div>
	</div>
</template>
<script type="text/javascript">

	export default{
		props: {
			foodList: Array,
		},
	}
</script>
<style type="text/css" scoped>
	.food-container{
		overflow: hidden;
	}
	.food{
		display: flex;
		align-items: center;
		text-align: center;
		padding: 15px 10px;
		margin-bottom: 12px;
		border: 1px solid #eee;
		background: #fff;
		width: 98%;
	}
	.food>img{
		width: 13%;
	}
	.food-detail-container{
		padding-left: 20px;
		text-align: left;
		flex-grow: 1;
	}
	.food-detail-container>h3{
		font-size: 20px;
		font-weight: 700;
		margin: 10px 0;
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
		text-align: left;
		width: 15%;
	}
	.food-min-price-container>span{
		font-size: 18px;
	}
	.food-min-price{
		font-weight: 700;
		color: #f74342;
	}
	.food-add-to-cart{
		width: 17%;
		cursor: pointer;
		display: inline-block;
		background: #0089dc;
		color: #fff;
		border-radius: 20px;
		font-size: 18px;
	}
</style>