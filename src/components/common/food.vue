<template>
	<transition-group
		tag="div"
		:class="{ 'food-container-grid': listWay === 'grid', 'food-container-line': listWay === 'line'}">
			<div
				v-for="(food, index) in foodList1"
				:key="food._id"
				class="food-container-grid-item food-container-line-item">
					<img :src="'/img/' + food.image_path">
					<div class="food-container-grid-item-detail-container food-container-line-item-detail-container">
						<h3>{{ food.name }}</h3>
						<Rate :value="food.rating" disabled allow-half></Rate>
						<span>({{ food.rating_count }})</span>
						<span>月售{{ food.month_sales }}份</span>
						<div class="food-min-price-container">
							<span class="food-min-price">￥{{ food.specfoods[0].price}}</span>
							<span v-if="food.specfoods.length > 1">起</span>
						</div>
					</div>
					<div
						v-if="food.specfoods.length === 1"
						class="food-container-grid-item-btn food-container-line-item-btn">
							<div v-if="food.specfoods[0].order_count">
								<button>-</button>
								<input type="number" v-model="food.specfoods[0].order_count">
								<button>+</button>
							</div>
							<span v-else @click="addToCart(food.specfoods[0], food.category_id)">加入购物车</span>
					</div>
					<span v-else>选规格</span>
			</div>
	</transition-group>
</template>
<script type="text/javascript">

	export default{
		props: {
			foodList: Array,
			listWay: {
				type: String,
				default: 'grid'
			},
		},
		computed: {
			foodOrderList(){
				return this.$store.state.foodOrderList;
			},
			foodList1(){
				return this.foodList;
			},
		},
		methods: {
			addToCart(food, cate_id){
				food.category_id = cate_id;
				this.$store.commit('addToCart', food);
			},
		},
	}
</script>
<style lang="scss" type="text/css" scoped>
	@import '../../style/mixin';
	.food-container-grid{
		overflow: hidden;
		&-item{
			transition: all 1s ease-in-out;
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
			&-detail-container{
				position: relative;
				flex-grow: 1;
				display: inline-block;
				>h3{
					@include fontscw(16px, #000, 700);
					margin-top: 15px;
					@include ellipsis;
				}
				>div:first-child{
					max-width: 200px;
					display: inline-block;
				}
				>div:last-child{
					position: absolute;
					bottom: 10px;
					left: 0;
					>span:first-child{
						@include fontscw(14px, #f74342, 700);
					}
				}
			}
			&-btn{
				display: flex;
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
		}
	}
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