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
							<p>营业时间：{{ opening_hour }}</p>
						</li>
						<li>
							由 <p class="delivery-mode">{{ delivery_mode }}</p> 提供配送服务
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
				<a :class="{'pane-control-item': true, 'active': panel === 'food'}" @click="handleSwitchPanel('food')">所有商品</a>
 				<a :class="{'pane-control-item': true, 'active': panel === 'rating'}" @click="handleSwitchPanel('rating')">评价</a>
 				<a :class="{'pane-control-item': true, 'active': panel === 'quality'}" @click="handleSwitchPanel('quality')">商家资质</a>
				<span class="food-filter">
					<a @click="handleClickSort('default')" :class="{'food-filter-type': true, 'active': sortType === 'default'}">默认排序</a>
					<a @click="handleClickSort('score')" :class="{'food-filter-type': true, 'active': sortType === 'score'}">评分 ⬇</a>
					<a @click="handleClickSort('sale')" :class="{'food-filter-type': true, 'active': sortType === 'sale'}">销量 ⬇</a>
					<a @click="handleClickSortByPrice" :class="{'food-filter-type': true, 'active': sortType === 'priceDesc' || sortType === 'priceAsc'}">
							价格
							<template v-if="sortType === 'priceDesc'">⬇</template>
							<template v-if="sortType === 'priceAsc'">⬆</template>
					</a>
					<span class="pane-switch">
						<Icon @click.native="handleSwitchListWay('grid')" :class="{ active: listWay === 'grid'}" type="grid" size="24"></Icon>
						<Icon @click.native="handleSwitchListWay('line')" :class="{ active: listWay === 'line'}" type="ios-list-outline" size="24"></Icon>
					</span>
				</span>
			</div>
			<div class="search-pane">
				<Input
					@on-enter="handleSearch"
					v-model="keyWord"
					class="search-input"
					placeholder="搜索商家,美食..."
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
						<template v-if="sortType === 'default'">
							<div
								:id="'foodItem' + key"
								v-for="( item, key ) in menu"
								:key="key"
								class="food-item">
								<h2 class="food-item-title">
									{{ item.name }}
									<span>{{ item.description }}</span>
								</h2>
								<Food :foodList="item.foods" :listWay="listWay" :cateIndex="key" :rest="restaurant"></Food>
							</div>
						</template>
						<template v-else-if="sortType === 'search'">
							<span class="sort-msg">{{ sortMsg }}</span>
							<Food :foodList="foodSearchResult" :listWay="listWay" :rest="restaurant"></Food>
						</template>
						<template v-else>
							<span class="sort-msg">{{ sortMsg }}</span>
							<Food :foodList="sortedFoodList" :listWay="listWay" :rest="restaurant"></Food>
						</template>
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
										<Rate :value="item.rating_star" disabled allow-half></Rate>
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
				<template v-if="panel === 'quality'">
					<div class="quality-container">
						<span>营业资质</span>
						<div class="quality-detail-container">
							<span>食品安全监督公示</span>
							<div class="quality-result-container">
								<img >
								<span>检查结果:</span>
								<span
									v-if="restaurant.status === 1"
									:class="{ 'good-quality': restaurant.status === 1}">
										良好
								</span>
								<span v-else :class="{ 'bad-quality': restaurant.status !== 1}">差</span>
							</div>
							<ul class="quality-info-container">
								<li>
									<span>单位名称：</span>
									<span>{{ restaurant.identification.company_name }}</span>
								</li>
								<li>
									<span>经营地址：</span>
									<span>{{ restaurant.identification.registered_address }}</span>
								</li>
								<li>
									<span>法定代表人：</span>
									<span>{{ restaurant.identification.legal_person }}</span>
								</li>
								<li>
									<span>许可证号：</span>
									<span>{{ restaurant.identification.licenses_number }}</span>
								</li>
								<li>
									<span>经营范围：</span>
									<span>{{ restaurant.identification.operation_period }}</span>
								</li>
								<li>
									<span>有效期：</span>
									<span>{{ restaurant.identification.licenses_date }}</span>
								</li>
							</ul>
						</div>
						<div class="quality-img">
							<span>商家从业资质</span>
							<img :src="'/img/' + restaurant.license.business_license_image">
							<img :src="'/img/' + restaurant.catering_service_license_image">
						</div>
					</div>
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
		<div class="shop-cart-container">
			<div class="cart-header">
				<div class="cart-headline">
					<span>购物车</span>
					<span @click="clearCartList">[清空]</span>
				</div>
				<ul class="cart-list">
					<li v-for="item of cartList">
						<span>{{ item.name }}</span>
						<div>
							<button @click="updateCount(restaurant, item.food_id, orderNum[item.food_id]-1)">-</button>
							<input :value="item.order_count" @input="inputCount(item, $event.target.value)">
							<button @click="updateCount(restaurant, item.food_id, orderNum[item.food_id]+1)">+</button>
						</div>
						<span>￥{{ item.order_count * item.price }}</span>
					</li>
				</ul>
			</div>
			<div class="cart-footer">
				<div class="cart-footer-desc">
					<Badge :count="cartFoodAmount"><Icon type="android-cart" size= 24></Icon></Badge>
					￥<span class="cart-footer-desc-amount">{{ amount }}</span>
					<span class="cart-footer-desc-deliver-fee">配送费￥{{ restaurant.float_delivery_fee }}</span>
				</div>
				<span @click="handleOrder(restaurant.id)">去结算 ></span>
			</div>
		</div>
		<footer-comp></footer-comp>
	</div>
</template>
<script type="text/javascript">
	import TopBar from '../components/common/topbar.vue';
	import FooterComp from '../components/common/footer.vue';
	import { getImgPath, updateCount } from '../components/common/mixin.js';
	import Food from '../components/common/food.vue';
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
			Food,
		},
		data(){
			return {
				restaurant: {}, //餐馆对象
				//menu: [], //食品列表(含分类描述等)
				foodCate: [], //食品分类
				ratings: [], //客户评价信息
				ratingScore: {}, //餐馆评分
				ratingTags: [], //客户评价标签
				itemList: [], //食品详细分类元素对象列表
				selectedCate: '热销榜', //选中的食品类别
				selectedRatingCate: '全部', //选中的评价分类
				sortType: 'default', //排序方式
				sortMsg: '', //排序时顶部显示的信息
				listWay: 'grid', //食品展示方式
				showOnLeft: false, //控制菜品分类位置
				scrollTop: 0, //滚动条滚动距离
				panel: 'food', //控制显示食品或评价或商家资质
				keyWord: '', //搜索关键字
				foodSearchResult: [], //食品搜索结果
			};
		},
		mixins: [getImgPath, updateCount],
		computed: {
		  delivery_mode(){
		    let s;
		    if (this.restaurant.delivery_mode) {
		      s = this.restaurant.delivery_mode.text;
        }
        return s;
      },
		  opening_hour(){
		    let s;
		    if (this.restaurant.opening_hours){
          s = this.restaurant.opening_hours[0].replace('/', ' - ');
        }
		    return s;
      },
			menu(){
				let menuInList = false;
				for(let item of this.$store.state.cartList){
				  //console.log('cartList');
					if (item.restaurant_id === this.restaurant.id) {
            menuInList = item;
            //console.log('restaurant.vue, found menu in cartList');
          }
				}
				if (menuInList) {
          //console.log('old menu', menuInList.menu);
					return menuInList.menu;
				}else{
				  //console.log('new menu', this.$store.state.menu);
					return this.$store.state.menu;
				}
			},
			//menu内所有食品
			foodList(){
				let list = [];
				for(let item of this.menu){
					for(let i of item.foods){
						list.push(i);
					}
				}
				return list;
			},
			//已排序的食品列表
			sortedFoodList(){
				let list = [...this.foodList];
				switch(this.sortType){
					case 'default':
						break;
					case 'score':
						this.sortMsg = '评分从高到低排序';
						list.sort( (a, b) => b.rating - a.rating );
						break;
					case 'sale':
						this.sortMsg = '销量从高到低排序';
						list.sort( (a, b) => b.month_sales - a.month_sales );
						break;
					case 'priceDesc':
						this.sortMsg = '价格从高到低排序';
						list.sort( (a, b) => b.specfoods[0].price - a.specfoods[0].price );
						break;
					case 'priceAsc':
						this.sortMsg = '价格从低到高排序';
						list.sort( (a, b) => a.specfoods[0].price - b.specfoods[0].price );
						break;
				}
				return list;
			},
			//购物车食品
			cartList(){
				let list = this.$store.state.cartList;
				let restInList = false;
				for(let item of list){
					if (item.restaurant.id === this.restaurant.id) restInList = item;
				}
				if (restInList) return restInList.orderList;
				return [];
			},
      orderNum(){
        let o = {};
        for (let food of this.cartList) {
          o[food.food_id] = food.order_count;
        }
        return o;
      },
			//购物车食品总数
			cartFoodAmount(){
				let amount = 0;
				for(let item of this.cartList){
					amount += item.order_count;
				}
				return amount;
			},
			//购物车食品总价
			amount(){
				let sum = 0;
				for(let item of this.cartList){
					sum += item.order_count * item.price;
				}
				return sum;
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
			updateData(){
				if (this.sortType !== 'default') return; //不是默认排序时不用更新
				let list = [];
				for( let item of this.menu){
					let index = this.menu.indexOf(item);
					let ele = document.getElementById('foodItem' + index);
					if(ele){
						let offsetTop = ele.getBoundingClientRect().top + document.documentElement.scrollTop - 210; //210是食品分类在顶部时的高度， 点击选择有一个偏移量
						list.push({
							key: index,
							foodCate: item.name,
							ele: ele,
							offsetTop,
						});
					}
				}
				this.itemList = list;
			},
			handleClickFoodCate(key){
				//debugger
				if (this.sortType !== 'default') {
					this.sortType = 'default';
					this.$nextTick( () => {
						this.updateData();
					});
					this.bindEvent();
				}
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
				if (type !== 'food') this.unbindEvent();
				this.bindEvent();
			},
			handleClickSort(type){
				this.bindEvent();
				if (type !== 'default') {
					this.showOnLeft = false;
					this.unbindEvent(); //选择其他类别时不监听滚动事件
				}
				this.sortType = type;
			},
			handleClickSortByPrice(){
				if (this.sortType === 'priceDesc') {
					this.sortType = 'priceAsc';
				}else{
					this.sortType = 'priceDesc';
				}
			},
			handleSwitchListWay(type){
				this.listWay = type;
			},
			handleSearch(){
				this.sortType = 'search';
				let list = [];
				if (this.keyWord) {
					list = this.foodList.filter( item => item.name.indexOf( this.keyWord ) !== -1 );
				}
				this.sortMsg = `搜索【${this.keyWord}】的结果`;
				this.foodSearchResult = list;
			},
			scroll(e){
				if (this.$refs.content.getBoundingClientRect().top < 0) {
					this.showOnLeft = true;
				}else{
					this.showOnLeft = false;
				}
				if (this.sortType !== 'default') this.showOnLeft = false;
				this.scrollTop = document.documentElement.scrollTop + document.body.scrollTop;
			},
			getFormatNum(num, type){
				if (type === 'score') {
					return parseInt(num).toFixed(1);
				}else{
					return (Number(num)*100).toFixed(1) + '%';
				}
			},
			inputCount(food, value){
				if(value === '') {
					this.$store.commit('removeFromCart', food.food_id);
					return;
				}else if(value < 1){
					value = 1;
				}
				this.$store.commit('updateCount', {
					food_id: food.food_id,
					value: parseInt(value, 10)
				});
			},
			clearCartList(){
				this.$store.commit('clearCartList', this.restaurant);
			},
      handleOrder(id){
			  let geohash = this.$store.state.address.geohash;
			  this.$router.push({
          path: '/checkout',
          query: {
            geohash,
            restaurant_id: this.restaurant.id
          }
        });
      },
			bindEvent(){
				document.addEventListener('scroll', this.scroll, false);
			},
			unbindEvent(){
				document.removeEventListener('scroll', this.scroll, false);
			}
		},
		created(){
		  //console.log('restaurant.vue created()');
			let id = this.$route.params.id;
			//let lastRest = this.$store.state.currentRestaurant;
			//进入新餐馆先清空上个餐馆的购物车
			//if (lastRest.id !== id) this.$store.commit('clearCartList');
			getRestaurantInfo(id).then( res => {
				this.restaurant = res;
				this.$store.commit('saveCurrentRestaurant', res);
			});
			getMenu(id).then( res => {
			  //不直接使用返回的menu，先检查购物车是否有对应menu
				//this.menu = res;
				this.$store.commit('saveMenu', res);
				this.$nextTick( () => {
					if (this.sortType === 'default') this.updateData();
				});
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
		updated(){
			this.updateData();
		},
		beforeDestroy(){
			this.unbindEvent();
		}
	}
</script>
<style lang="scss" type="text/scss" scoped>
	@import '../style/mixin';
	.restaurant{
		width: 100%;
		&-container{
			@include wh(1180px, 142px);
			position: relative;
			display: table;
			margin: 0 auto;
		}
	}
	.shop-info-container{
		position: relative;
		display: table-cell;
		vertical-align: middle;
		z-index: 1;
		>img{
			vertical-align: middle;
			@include wh(95px);
			border-radius: 50%;
			margin-right: 10px;
		}
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
		>ul{
			list-style: none;
			padding: 0 20px;
			>li{
				padding: 15px 0;
				border-bottom: 1px dashed #eee;
				color: #333;
        font-size: 14px;
        .delivery-mode{
          display: inline-block;
          color: #0089dc;
        }
			}
		}
	}
	.rating-detail{
		display: table;
		width: 100%;
		padding: 15px 0;
		>div{
			position: relative;
			display: table-cell;
			vertical-align: middle;
			text-align: center;
		}
	}
	.rating-amount-info{
		border-right: 1px solid #eee;
		>h2{
			@include fontscw(28px, #f74342);
		}
		>p{
			text-align: center;
			@include fontscw(12px, #333);
		}
	}
	.compare-rating-desc{
		@include fontscw(12px, #999);
	}
	.compare-rating{
		color: #f74342;
	}
	.service-container{
		display: table-cell;
		vertical-align: middle;
		text-align: right;
		&:first-child{
			margin-left: 0;
		}
		>span{
			vertical-align: top;
			text-align: center;
			display: inline-block;
			margin-left: 80px;
		}
		em{
			display: block;
			font-style: normal;
			font-weight: 400;
		}
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
		p:first-child{
				margin-bottom: 5px;
		}
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
		&-item{
			display: inline-block;
			width: 112px;
			text-align: center;
			@include fontscw(16px, #333);
			transition: all .3s ease-in-out;
			&.active{
				color: #0089dc;
				border-bottom: 3px solid #0089dc;
			}
		}
	}
	.food-filter{
		float: right;
		display: inline-block;
		line-height: 60px;
		&-type{
			color: #333;
			display: inline-block;
			padding: 0 15px;
			font-size: 14px;
			line-height: 1;
		}
		&-type.active{
			color: #0089dc;
		}
	}
	.pane-switch{
		display: inline-block;
		line-height: 60px;
		>i{
			cursor: pointer;
			vertical-align: middle;
			margin: 0 10px;
		}
		>i.active{
			color: #0089dc;
		}
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
		>a{
			display: inline-block;
			margin: 5px;
			padding: 3px 10px;
			width: 18%;
			border-radius: 2px;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			@include fontscw(14px, #333);
		}
		>a.active{
			background-color: #0089dc;
			color: #fff;
		}
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
		&::-webkit-scrollbar{
			background: #b7b7b7;
			@include wh(4px);
		}
		>a{
			transition: color .3s;
			position: relative;
			display: block;
			padding: 15px 15px 15px 0;
			width: auto;
			text-align: right;
			overflow: visible;
			@include fontscw(12px, #333);
		}
		>a.active{
			@include fontscw(14px, #0089dc);
		}
		>a:after{
			content: '';
			position: absolute;
			top: 50%;
			right: -4px;
			margin-top: -6px;
			@include wh(12px);
			background-color: #ddd;
			border: 2px solid #f7f7f7;
			border-radius: 50%;
		}
		>a.active:after{
			background-color: #0089dc;
		}
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
		@include fontscw(20px, #333, 400);
		span{
			@include fontscw(12px, #999);
		}
	}
	.rating-item-container{
		width: 100%;
		>li{
			display: flex;
			background: #fff;
			color: #000;
			margin-top: 20px;
			border-radius: 10px;
			padding: 20px;
		}
	}
	.rating-item-user-avatar{
		@include wh(80px);
		border-radius: 50%;
	}
	.rating-item-detail-container{
		display: inline-block;
		flex-grow: 1;
		padding-left: 20px;
	}
	.rating-item-user{
		span:first-child{
			font-size: 18px;
		}
		span:last-child{
			float: right;
			@include fontscw(16px, #c5c5c5);
		}
	}
	.rating-item-score{
		vertical-align: middle;
		font-size: 14px;
		>:first-child{
			display: inline-block;
		}
	}
	.rating-item-food{
		display: inline-block;
		width: 50%;
		text-align: center;
		font-size: 16px;
		>img{
			width: 100%;
			padding: 10px;
			display: block;
		}
		>span{
			display: block;
		}
	}
	.quality-container{
		>span{
			display: block;
			padding: 10px 15px;
			background: #0089dc;
			@include fontscw(36px, #fff, 700);
			text-align: center;
		}
	}
	.quality-detail-container{
		padding: 0 15px;
		background: #fff;
		color: #000;
		>span{
			display: block;
			padding: 10px 0;
			@include fontscw($size: 30px, $weight: 700);
			text-align: left;
		}
	}
	.quality-result-container{
		padding: 36px 0 36px 24px;
		>img{
			display: inline-block;
			float: left;
			@include wh(100px, 100px);
			margin-right: 50px;
			border-radius: 50%;
			background: green;
		}
		>span{
			display: inline-block;
			height: 100px;
			font-size: 24px;
			line-height: 100px;
		}
	}
	.good-quality{
		margin-left: 15px;
		color: #7ed321;
	}
	.bad-quality{
		margin-left: 15px;
		color: #red;
	}
	.quality-info-container{
		li{
			padding: 15px 0;
			border-top: 1px solid #eeeeee;
		}
		span{
			line-height: 60px;
			font-size: 24px;
		}
	}
	.quality-img{
		padding: 0 15px;
		margin-top: 15px;
		background: #fff;
		>span{
			display: block;
			padding: 15px 0;
			@include fontscw(30px, #000, 700);
			border-bottom: 1px solid #eeeeee;
		}
		>img{
			display: inline-block;
			width: 40%;
			margin: 35px;
			border: 1px solid #eee;
		}
	}
	.sort-msg{
		display: block;
		padding: 20px 0 10px 0;
		font-size: 20px;
	}
	.announcement-container{
		display: inline-block;
		width: 25%;
		padding-left: 15px;
	}
	.announcement-detail{
		span:first-child{
			display: block;
			padding: 0 15px;
			line-height: 50px;
			background: #0089dc;
			@include fontscw(14px, #fff, 400);
		}
		span:last-child{
			display: block;
			padding: 10px 15px;
			font-size: 14px;
			background: #fff;
		}
	}
	.delivery-desc{
		padding: 10px 15px;
		background: #f5f5f5;
		span{
			display: block;
			font-size: 14px;
		}
		span:first-child{
			font-weight: 700;
		}
	}
	.shop-cart-container{
		width: 320px;
		z-index: 100;
		position: fixed;
		right: 0;
		bottom: 0;
		font-size: 14px;
	}
	.cart-header{
		box-shadow: 0 1px 15px #ccc;
	}
	.cart-headline{
		background-color: #fafafa;
		border-top: 2px solid #0089dc;
		padding: 12px 10px;
		>span:last-child{
			color: #0089dc;
			cursor: pointer;
		}
	}
	.cart-list{
		max-height: 350px;
		list-style: none;
		padding: 0 10px;
		overflow: auto;
		background-color: #fff;
		>li{
			display: flex;
			border-top: 1px solid #eee;
			align-items: center;
			padding: 10px 0;
			>span:first-child{
				width: 40%;
				@include ellipsis;
			}
			>div{
				display: inline-block;
				flex-grow: 1;
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
					width: 50px;
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
			>span:last-child{
				float: right;
				color: #f17530;
			}
		}
	}
	.cart-footer{
		display: flex;
		&-desc{
			flex-grow: 1;
			float: left;
			padding: 0 10px;
			display: inline-block;
			background-color: #2c2c2c;
			height: 46px;
			line-height: 46px;
			color: #fff;
			&-amount{
				font-size: 24px;
			}
			&-deliver-fee{
				color: #999;
				font-size: 12px;
			}
		}
		>span{
			line-height: 46px;
			display: inline-block;
			cursor: pointer;
			@include wh(120px, 46px);
			@include fontscw(14px, #fff, 700);
			text-align: center;
			background-color: #51d862;
		}
	}
	.support-item-container{
		padding: 0 15px;
		background: #fff;
	}
	.support-item{
		padding: 10px 0;
		span:first-child{
			display: inline-block;
			float: left;
			@include wh(22px);
			text-align: center;
			border-radius: 50%;
			background: #999999;
			@include fontscw(12px, #fff);
			line-height: 22px;
		}
		span:last-child{
			display: inline-block;
			max-width: 200px;
			font-size: 14px;
			margin-left: 5px;
		}
	}
</style>
