<template>
	<transition-group
		tag="div"
		:class="{ 'food-container-grid': listWay === 'grid', 'food-container-line': listWay === 'line'}">
			<div
				v-for="(food, index) in foodList"
				:key="food._id"
				:class="{'food-container-grid-item': listWay === 'grid', 'food-container-line-item': listWay === 'line'}">
					<img :src="'/img/' + food.image_path">
					<div :class="{'food-container-grid-item-detail-container': listWay === 'grid', 'food-container-line-item-detail-container': listWay === 'line'}">
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
						:class="{'food-container-grid-item-btn': listWay === 'grid', 'food-container-line-item-btn': listWay === 'line'}">
							<div v-if="food.specfoods[0].order_count">
								<button @click="updateCount(food.specfoods[0], -1)">-</button>
								<input :value="food.specfoods[0].order_count" @input="inputCount(food.specfoods[0], $event.target.value)">
								<button @click="updateCount(food.specfoods[0], 1)">+</button>
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
			foodOrderCount(){
				let o = {};
				for(let item of this.foodList){
					o[item.item_id] = 0;
				}
				return o;
			},
		},
		methods: {
			addToCart(food, cate_id){
				this.foodOrderCount[food.item_id] = 1;
				food.category_id = cate_id;
				this.$store.commit('addToCart', food);
			},
			updateCount(food, value){
				if (food.order_count === 1 && value === -1) {
					this.$store.commit('removeFromCart', food.food_id);
				}
				this.$store.commit('updateCount', {
					food_id: food.food_id,
					value: food.order_count + value
				});
			},
			inputCount(food, value){
				this.$store.commit('updateCount', {
					food_id: food.food_id,
					value: parseInt(value, 10)
				});
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
				max-width:80px;
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
				>div{
					display: flex;
					align-items: flex-end;
					margin-bottom: 10px;
					>button:first-child{
						border-right: 1px solid #ddd;
						border-radius: 20px 0 0 20px;
						cursor: pointer;
						width: 24px;
						border: 0;
						background-color: #eee;
						outline: 0;
						float: left;
						line-height: 30px;
					}
					>input{
						width: 30px;
						text-align: center;
						border: 1px solid #ddd;
						outline: 0;
						float: left;
						line-height: 28px;
					}
					>button:last-child{
						border-left: 1px solid #ddd;
						border-radius: 0 20px 20px 0;
						cursor: pointer;
						width: 24px;
						border: 0;
						background-color: #eee;
						outline: 0;
						line-height: 30px;
					}
				}
			}
		}
	}
	.food-container-line{
		overflow: hidden;
		&-item{
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
			&-detail-container{
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
			&-btn{
				display: flex;
				width: 17%;
				>span{
					align-self: flex-end;
					display: inline-block;
					cursor: pointer;
					@include wh(100%, 30px);
					padding: 5px;
					margin-bottom: 10px;
					background: #0089dc;
					@include fontscw(14px, #fff);
					border-radius: 20px;
				}
				>div{
					display: flex;
					align-items: flex-end;
					>button:first-child{
						border-right: 1px solid #ddd;
						border-radius: 20px 0 0 20px;
						cursor: pointer;
						width: 35px;
						border: 0;
						background-color: #eee;
						outline: 0;
						float: left;
						line-height: 30px;
					}
					>input{
						width: 80px;
						text-align: center;
						border: 1px solid #ddd;
						outline: 0;
						float: left;
						line-height: 28px;
					}
					>button:last-child{
						border-left: 1px solid #ddd;
						border-radius: 0 20px 20px 0;
						cursor: pointer;
						width: 35px;
						border: 0;
						background-color: #eee;
						outline: 0;
						line-height: 30px;
					}
				}
			}
		}
	}
</style>