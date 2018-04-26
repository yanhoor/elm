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
					<div class="food-min-price-container">
						<span class="food-min-price">￥{{ food.specfoods[0].price}}</span>
						<span v-if="food.specfoods.length > 1">起</span>
					</div>
				</div>
				<span v-if="food.specfoods.length === 1">加入购物车</span>
				<span v-else>选规格</span>
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
<style lang="scss" type="text/css" scoped>
	@import '../../style/mixin';
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
		>img{
			flex-grow: 0;
			@include wh(100px);
			margin-right: 14px;
		}
		>span{
			align-self: flex-end;
			display: inline-block;
			cursor: pointer;
			height: 30px;
			padding: 5px;
			margin-bottom: 10px;
			background: #0089dc;
			@include fontscw(14px, #fff);
			border-radius: 6px;
		}
	}
	.food-detail-container{
		position: relative;
		flex-grow: 1;
		display: inline-block;
		>h3{
			@include fontscw(16px, #000, 700);
			margin-top: 15px;
			@include ellipsis;
		}
		>div{
			max-width: 200px;
			display: inline-block;
		}
	}
	.food-min-price-container{
		position: absolute;
		bottom: 10px;
		left: 0;
	}
	.food-min-price{
		@include fontscw(14px, #f74342, 700);
	}
</style>