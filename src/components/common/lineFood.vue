<template>
	<transition-group
		tag="div"
		name="line-food"
		class="food-container-line">
		<div
			v-for="food in foodList"
			class="food-container-line-item"
			:key="food._id">
				<img :src="'/img/' + food.image_path">
				<div class="food-container-line-item-detail-container">
					<h3>{{ food.name }}</h3>
					<Rate :value="food.rating" disabled allow-half></Rate>
					<span>({{ food.rating_count }})</span>
					<span>月售{{ food.month_sales }}份</span>
					<div class="food-container-line-item-min-price-container">
						<span class="food-min-price">￥{{ food.specfoods[0].price}}</span>
						<span v-if="food.specfoods.length > 1">起</span>
					</div>
				</div>
				<span v-if="food.specfoods.length === 1">加入购物车</span>
				<span v-else>选规格</span>
		</div>
	</transition-group>
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
	/*  .line-food-enter-active, .line-food-leave-active{
			transition: all 1s;
		}
		.line-food-enter, .line-food-leave-to{
			opacity: 0;
			transform: translateX(30px);
		} */
	.food-container-line{
		overflow: hidden;
		>div{
			transition: all 1s ease-in-out;
			display: flex;
			align-items: center;
			text-align: center;
			padding: 15px 10px;
			margin-bottom: 12px;
			border: 1px solid #eee;
			background: #fff;
			width: 98%;
			>img{
				width: 13%;
			}
			>span{
				width: 17%;
				cursor: pointer;
				display: inline-block;
				background: #0089dc;
				@include fontscw(18px, #fff);
				border-radius: 20px;
			}
			>div{
				position: relative;
				padding-left: 20px;
				text-align: left;
				flex-grow: 1;
				>h3{
					@include fontscw(20px, #000, 700);
					margin: 10px 0;
					@include ellipsis;
				}
				>div:first-child{
					max-width: 200px;
					display: inline-block;
				}
				>div:last-child{
					display: inline-block;
					position: absolute;
					right: 0;
					bottom: 26px;
					margin-right: 40px;
					>span{
						font-size: 18px;
					}
					>span:first-child{
						@include fontscw(normal, #f74342, 700);
					}
				}
			}
		}
	}
</style>