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
								<button @click="updateCount($event, food.specfoods[0], -1)">-</button>
								<input :value="food.specfoods[0].order_count" @input="inputCount(food.specfoods[0], $event.target.value)">
								<button @click="updateCount($event, food.specfoods[0], 1)">+</button>
							</div>
							<span v-else @click="addToCart($event, food.specfoods[0], food.category_id)">加入购物车</span>
					</div>
					<span v-else @click="selectSpec($event,food)">选规格</span>
			</div>
			<DropBalls ref='balls' key='-99'></DropBalls>
			<div class="specs-background" key='specs' v-show="showModal"></div>
			<div class="specs-container" id="specsContainer" key="specsContainer" v-show="showModal">
				<div class="specs">
					<dl>
						<dt>规格</dt>
						<dd
							v-for="item of spec.specfoods"
							@click="selectedSpec = item"
							:class="{active: selectedSpec._id === item._id}"">
								{{ item.specs_name }}
						</dd>
					</dl>
				</div>
				<div class="spec-info">
					<p>已选：{{ selectedSpec.specs_name }}</p>
					<p>￥{{ selectedSpec.price }}</p>
				</div>
				<div class="specs-action">
					<span @click="addToCart($event,selectedSpec, spec.category_id)">选好了，加入购物车</span>
					<span @click="closeModal">不要了</span>
				</div>
			</div>
	</transition-group>
</template>
<script type="text/javascript">
	import DropBalls from './dropBalls.vue';

	export default{
		props: {
			foodList: Array,
			listWay: {
				type: String,
				default: 'grid'
			},
			cateIndex: Number, //默认排序时菜品分类index
			rest: Object,
		},
		data(){
			return{
				spec: '', //包含多种规格的食品
				selectedSpec: '',//选中的规格
				showModal: false,
			}
		},
		components: {
			DropBalls,
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
			addToCart(event, food, cate_id){
				this.foodOrderCount[food.item_id] = 1;
				food.category_id = cate_id;
				this.$store.commit('addToCart', {
					food,
					rest: this.rest
				});
				if (this.selectedSpec) {
					this.showModal = false;
					this.selectedSpec = '';
				}else{
					this.$refs.balls.drop(event.target);
				}
			},
			updateCount(event, food, value){
				if (food.order_count < 2 && value === -1) {
					this.$store.commit('removeFromCart', {
						food_id: food.food_id,
						rest: this.rest
					});
				}
				this.$store.commit('updateCount', {
					food_id: food.food_id,
					value: food.order_count + value,
					rest: this.rest
				});
				if (value === 1) this.$refs.balls.drop(event.target);
			},
			inputCount(food, value){
				if(value === '') {
					this.$store.commit('removeFromCart', {
						rest: this.rest,
						food_id: food.food_id
					});
					return;
				}else if(value < 1){
					value = 1;
				}
				this.$store.commit('updateCount', {
					food_id: food.food_id,
					value: parseInt(value, 10)
				});
			},
			selectSpec(event, food){
				this.spec = food;
				this.showModal = true;
				let rect = event.target.getBoundingClientRect();
				//specs-container类名的元素有多个？？
				//console.log('el in classname ', document.getElementsByClassName('specs-container'));
				//console.log('el in classname2 ', document.getElementsByClassName('specs-container v-move v-enter-to'));
				let el;
				if (this.cateIndex) {
					el = document.getElementsByClassName('specs-container')[this.cateIndex];
				}else{
					el = document.getElementsByClassName('specs-container')[0];
				}
				el.style.left = `${rect.left + 60}px`;
				el.style.top = `${rect.top + document.documentElement.scrollTop - 28}px`;
				this.selectedSpec = food.specfoods[0];
			},
			closeModal(){
				this.showModal = false;
				this.selectedSpec = '';
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
		.specs-background{
			position: fixed;
			z-index: 1004;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			opacity: 0.5;
			background: rgb(0, 0, 0);
		}
		.specs-container{
			position: absolute;
			background: #fff;
			width: 300px;
			border: 1px;
			box-shadow: 0 1px 15px #ccc;
			z-index: 1005;
			.specs{
				margin: 10px;
				padding: 12px 10px 0;
				border: 1px solid #eee;
				background-color: #fcfcfc;
				>dl{
					padding-bottom: 14px;
					dt{
						font-size: 14px;
						padding-bottom: 10px;
						color: #666;
					}
					dd{
						display: inline-block;
						padding: 0 14px;
						min-width: 28px;
						max-width: 120px;
						height: 26px;
						line-height: 26px;
						font-size: 14px;
						border: 1px solid #bbb;
						border-radius: 13px;
						margin: 0 18px 6px 0;
						cursor: pointer;
						@include ellipsis;
					}
					dd.active{
						border-color: #0089dc;
						color: #0089dc;
					}
				}
			}
			.spec-info{
				padding: 0 10px;
				>p:first-child{
					font-size: 14px;
					color: #666;
				}
				>p:last-child{
					@include fontscw(16px, #ff6000, 700);
				}
			}
			.specs-action{
				padding: 14px 10px;
				>span:first-child{
					padding: 8px 17px;
					border-radius: 2px;
					cursor: pointer;
					background-color: #0089dc;
					@include fontscw(14px, #fff);
				}
				>span:last-child{
					margin-left: 12px;
					@include fontscw(14px, #999);
					cursor: pointer;
				}
			}
		}
		.specs-container::before{
			content: '';
			border: 10px solid transparent;
			position: absolute;
			top: 30px;
			left: -18px;
			border-right-color: #fff;
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
		.specs-background{
			position: fixed;
			z-index: 1004;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			opacity: 0.5;
			background: rgb(0, 0, 0);
		}
		.specs-container{
			position: absolute;
			background: #fff;
			width: 300px;
			border: 1px;
			box-shadow: 0 1px 15px #ccc;
			z-index: 1005;
			.specs{
				margin: 10px;
				padding: 12px 10px 0;
				border: 1px solid #eee;
				background-color: #fcfcfc;
				>dl{
					padding-bottom: 14px;
					dt{
						font-size: 14px;
						padding-bottom: 10px;
						color: #666;
					}
					dd{
						display: inline-block;
						padding: 0 14px;
						min-width: 28px;
						height: 26px;
						font-size: 14px;
						border: 1px solid #bbb;
						border-radius: 13px;
						margin: 0 18px 6px 0;
						cursor: pointer;
					}
					dd.active{
						border-color: #0089dc;
						color: #0089dc;
					}
				}
			}
			.spec-info{
				padding: 0 10px;
				>p:first-child{
					font-size: 14px;
					color: #666;
				}
				>p:last-child{
					@include fontscw(16px, #ff6000, 700);
				}
			}
			.specs-action{
				padding: 14px 10px;
				>span:first-child{
					padding: 8px 17px;
					border-radius: 2px;
					cursor: pointer;
					background-color: #0089dc;
					@include fontscw(14px, #fff);
				}
				>span:last-child{
					margin-left: 12px;
					@include fontscw(14px, #999);
					cursor: pointer;
				}
			}
		}
		.specs-container::before{
			content: '';
			border: 10px solid transparent;
			position: absolute;
			top: 30px;
			left: -18px;
			border-right-color: #fff;
		}
	}
</style>