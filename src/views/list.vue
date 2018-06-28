<template>
	<div class="main">
		<top-bar></top-bar>
		<div class="info-bar">
			<div class="location">
				<span class="location-desc">当前位置：</span>
				<span class="location-current" :title="address.name">{{this.address.name}}</span>
				<span
					class="location-change"
					@click="handleChangeAddress">[切换地址]</span>
			</div>
			<div class="search">
				<Input
					class="search-input"
          v-model="searchKeyword"
          @on-enter="handleSearch"
          @on-click="handleSearch"
					placeholder="搜索商家"
					icon="ios-search-strong"
					size="large"></Input>
			</div>
		</div>
		<div class="category">
			<span class="category-desc">商家分类：</span>
			<div class="category-item-container">
				<a
					@click="handleClickMainAll"
					class="category-item-all"
					:class="{ on: mainCate === 1 }">全部商家</a>
				<a
					@click="handleClickMainCate(restaurant)"
					v-for="restaurant in restaurantCategoryList"
					class="category-item"
					:class="{ on: restaurant.name === mainCate.name }">
						{{ restaurant.name }}
				</a>
				<div class="sub-category">
					<a
						v-for="item in subCategories"
						@click="handleClickSubCate(item)"
						class="category-item"
						:class="{ on: item.name === subCate.name }">
							{{ item.name }}
					</a>
				</div>
			</div>
		</div>
		<div class="rest-display">
			<div class="rest-container">
					<div
						@mouseenter.self="handleMouseEvent(item, index, $event)"
						@mouseleave.self="handleMouseEvent('leave', index, $event)"
						v-for="( item, index ) in restaurantSortedList"
						class="rest-item">
							<Rest
								:restaurant="item"
								:key="item.id">
							</Rest>
					</div>
					<div
						v-if="showRestInfo"
						class="rest-info-container"
						:class="{'rest-info-container-left': onLeft, 'rest-info-container-right': !onLeft}"
						:style="floatXY">
						<div class="rest-info-top">
							<span class="rest-info-title">{{ info.name }}</span>
							<span class="rest-info-cate">{{ info.category }}</span>
						</div>
						<div class="rest-info-bottom">
							<div
								v-for="icon in info.supports"
								class="rest-info-support-container">
									<span class="rest-info-support-icon">{{ icon.icon_name  }}</span>
									<span class="rest-info-support-desc">{{ icon.description  }}</span>
							</div>
							<div class="rest-info-cost-container">
								<span class="rest-info-cost">{{ info.piecewise_agent_fee.tips }}</span>
								<span>平均{{ info.order_lead_time }}送达</span>
							</div>
							<div class="rest-info-desc-container">
								<span>{{ info.description }}</span>
							</div>
						</div>
					</div>
			</div>
		</div>
    	<div :class="{'sidebar': true, 'active': showSidebarCart}">
        <div class="sidebar-tap">
          <div class="sidebar-tap-top">
            <div class="sidebar-order-icon">
              <Tooltip content="我的订单" placement="left">
                <Icon type="document-text" size=24 @click.native="handleClickRecentOrder"></Icon>
              </Tooltip>
            </div>
            <div class="sidebar-cart-container">
              <Badge :count="cartFoodAmount" class="sidebar-cart-icon"></Badge>
              <span class="sidebar-cart-title" @click="showSidebarCart = !showSidebarCart">
              <Icon type="android-cart" size= 24></Icon>
              购物车
            </span>
            </div>
          </div>
        </div>
        <div class="sidebar-content-container">
          <div class="sidebar-cart-container" v-if="cartList">
            <div class="sidebar-cart-caption">
              <a>购物车</a>
              <span @click="showSidebarCart = !showSidebarCart"> >> </span>
            </div>
            <div class="sidebar-cart">
              <dl>
                <dt>
                  <span>一号购物车</span>
                  <a @click="clearCartList()">[清空]</a>
                </dt>
                <dd v-for="item of cartList.orderList">
                  <span class="sidebar-food-name">{{ item.name }}</span>
                  <div class="sidebar-food-count">
                    <button @click="updateCount(cartList.restaurant_id, item.food_id, item.order_count - 1)">-</button>
                    <input :value="item.order_count" @input="inputCount(item.food_id, $event.target.value)">
                    <button @click="updateCount(cartList.restaurant_id, item.food_id, item.order_count + 1)">+</button>
                  </div>
                  <span class="sidebar-food-cost">{{ item.order_count * item.price }}</span>
                </dd>
              </dl>
            </div>
            <div class="sidebar-cart-amount">
              共 <span>{{ cartFoodAmount }}</span> 份，总计 <span>{{ cartCostAmount }}</span>
              <button @click="handleOrder">去结算</button>
            </div>
          </div>
          <div class="sidebar-cart-empty" v-else>
            <Icon type="refresh" size= 48></Icon>
            <span>购物车空空如也</span>
          </div>
        </div>
      </div>
    	<footer-comp></footer-comp>
	</div>
</template>
<script type="text/javascript">
	import {
		getRestaurants,
		getFoodCategory,
		getRestaurantCategory
	} from '../service/getData.js';
	import Rest from '../components/common/restaurant.vue';
	import TopBar from '../components/common/topbar.vue';
	import FooterComp from '../components/common/footer.vue';
  import { updateCount } from '../components/common/mixin.js';

	export default{
		components: {
			Rest,
			TopBar,
			FooterComp,
		},
		data(){
			return {
				restaurantList: [], //餐馆列表
				restaurantSortedList: [], //已筛选的餐馆列表
				restaurantCategoryList: [], //餐馆分类列表，删除‘全部商家’项
				subCategories: [], //餐馆分类子类别
				mainCate: {}, //选中的餐馆主类
				subCate: {}, //选中的餐馆子类
				cateSelected: '', //主类与子类name组成的字符串
				showRestInfo: false, //是否显示餐馆信息
				info: '', //鼠标停留处的餐馆对象
				floatXY: {}, //包含浮动元素坐标的样式对象
				onLeft: true, //控制浮动元素类名
        searchKeyword: '', //搜索餐馆的关键词
        showSidebarCart: false,
			}
		},
    mixins: [ updateCount],
    computed: {
		  //侧栏购物车
		  cartList(){
		    let list = [...this.$store.state.cartList];
		    if (list.length === 0) return null;
		    let list1 = list.map( item => {
          return {
            orderList: item.orderList,
            restaurant_id: item.restaurant_id
          };
        });
		    return list1.pop();
      },
      //侧栏购物车食品总数
      cartFoodAmount(){
        let amount = 0;
        if (!this.cartList) return 0;
        for(let item of this.cartList.orderList){
          amount += item.order_count;
        }
        return amount;
      },
      //侧栏购物车总价
      cartCostAmount(){
        let amount = 0;
        if (!this.cartList) return 0;
        for(let item of this.cartList.orderList){
          amount += item.order_count * item.price;
        }
        return amount;
      },
      address(){
        return this.$store.state.address;
      },
    },
		methods: {
			handleChangeAddress(){
				this.$router.push('home');
			},
			handleClickMainCate(item){
				this.subCategories = item.sub_categories;
				this.mainCate = item;
				this.subCate = {};
				this.handleSortRestaurant('only_main');
			},
			handleClickSubCate(item){
				this.subCate = item;
				if ( !item.name.includes('全部') ) {
					this.cateSelected = this.mainCate.name + '/' + item.name;
					this.handleSortRestaurant('sub_cate');
				}else{
					this.handleSortRestaurant('only_main');
				}
			},
			handleClickMainAll(){
				this.subCategories = [];
				this.cateSelected = '';
				this.mainCate = 1;
				this.subCate = {};
				this.handleSortRestaurant('main_all');
			},
			handleSortRestaurant(type){
				let list = [...this.restaurantList];
				switch(type) {
					//全部商家
					case 'main_all':
						break;
					//主类
					case 'only_main':
						list = list.filter( item => item.category.includes(this.mainCate.name));
						break;
					//子类
					case 'sub_cate':
						list = list.filter( item => item.category.includes(this.cateSelected));
						break;
					default:
				}
				this.restaurantSortedList = list;
			},
      handleSearch(){
        let list = [];
        for(let rest of this.restaurantList){
          if( rest.name.includes(this.searchKeyword) ){
            list.push(rest);
          }
        }
        this.restaurantSortedList = list;
      },
      handleClickRecentOrder(){
        if (!this.$store.state.user) {
          this.$router.push('/login');
          return;
        }
			  this.$router.push('profile/order');
      },
      clearCartList(){
        this.$store.commit('clearCartList', this.cartList.restaurant_id);
      },
      handleOrder(){
        if (!this.$store.state.user) {
          this.$router.push('/login');
          return;
        }
        let geohash = this.$store.state.address.geohash;
        this.$router.push({
          path: '/checkout',
          query: {
            geohash,
            restaurant_id: this.cartList.restaurant_id
          }
        });
      },
      inputCount(food_id, value){
        if(value === '') {
          this.$store.commit('removeFromCart', {
            rest_id: this.cartList.restaurant_id,
            food_id: food_id
          });
          return;
        }else if(value < 1){
          value = 1;
        }
        this.$store.commit('updateCount', {
          rest_id: this.cartList.restaurant_id,
          food_id: food_id,
          value: parseInt(value, 10)
        });
      },
			handleMouseEvent(item, index, event){
				let floatOnLeft = (index + 1) % 4 === 0;
				//X，Y是绝对坐标
				let x,y = 0;
				x = event.target.getBoundingClientRect().left + document.documentElement.scrollLeft;
				y = event.target.getBoundingClientRect().top + document.documentElement.scrollTop;

				let floatX, floatY = 0;
				if (floatOnLeft) {
					this.onLeft = false;
					floatX = x - 260 + 'px';
				}else{
					this.onLeft = true;
					floatX = x + 300 + 'px';
				}
				floatY = y + 8 + 'px';

				if (typeof item === 'object') {
					this.showRestInfo = true;
					this.info = item;
					this.floatXY = {
						left: floatX,
						top: floatY
					};
				}else{
					this.showRestInfo = false;
				}
				//console.log('mouse event', x + ' , ' + y + item.name);
			},
		},
		created(){
			getRestaurants(this.address.latitude, this.address.longitude, 0, 30).then( res => {
				this.restaurantList = [...res];
				this.restaurantSortedList = [...res];
			});
			getRestaurantCategory().then( res => {
				let index = -1;
				for( let item of res){
					if (item.name.includes('全部商家')) index = res.indexOf(item);
				}
				res.splice(index, 1);
				this.restaurantCategoryList = res;
			});
		}
	}
</script>
<style lang="scss" type="text/scss" scoped>
	@import '../style/mixin';
	.info-bar{
		@include wh(1180px, 60px);
		margin: 0 auto;
	}
	.location{
		width: 20%;
		float: left;
		>span{
			line-height: 60px;
			font-size: 12px;
			display: inline-block;
			vertical-align: top;
		}
		&-desc{
			color: #999999;
		}
		&-current{
			max-width: 40%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			word-break: keep-all;
		}
		&-change{
			color: #2d8cf0;
			cursor: pointer;
		}
	}
	.search{
		float: right;
		line-height: 60px;
	}
	.category{
		width: 1180px;
		padding: 10px;
		margin: 30px auto 0;
		background: #fff;
		border-radius: 5px;
		border: 1px solid #dddee1;
	}
	.category-desc{
		float: left;
		@include fontscw(16px, #999);
		line-height: 36px;
		margin: 5px 0;
	}
	.category-item-all{
		color: #666;
		font-size: 16px;
		padding: 0 16px;
		line-height: 36px;
	}
	.category-item{
		color: #666;
		font-size: 16px;
		line-height: 36px;
		padding: 0 16px;
		height: 38px;
		&-container{
			display: inline-block;
			max-width: 1000px;
		}
		&-container a{
			display: inline-block;
			margin: 5px 6px;
			border-radius: 4px;
			@include fontscw(14px, #666);
		}
	}
	.sub-category{
		background: #f6f6f6;
		border-radius: 4px;
	}
	a.on{
		color: #fff;
		background: #0089dc;
	}
	.rest-display{
		width: 1196px;
		margin: 0 auto;
		line-height: 30px;
		margin-top: 30px;
		overflow: auto;
	}
	.rest-container{
		width: 100%;
		overflow: hidden;
	}
	.rest-item{
		width: 25%;
		float: left;
		background: #f7f7f7;
	}
	.rest-info-container{
		position: absolute;
		top: 0;
		z-index: 1000;
		padding: 10px 10px;
		border-radius: 6px;
		border: 1px solid #dddee1;
		box-shadow: 0 0 10px #000;
		background: #f7fcf6;
		&-left::before{
			position: absolute;
			content: "";
			left: -32px;
			border: 20px solid transparent;
			border-right-color: #f7fcf6;
		}
		&-right::before{
			position: absolute;
			content: "";
			right: -32px;
			border: 20px solid transparent;
			border-left-color: #f7fcf6;
		}
		>div{
			color: #000;
		}
	}
	.rest-info-top{
		border-bottom: 1px solid #dddee1;
	}
	.rest-info-title{
		display: block;
		@include fontscw(16px, #000, bold);
	}
	.rest-info-support-container{
		margin: 10px 0;
		line-height: normal;
	}
	.rest-info-support-icon{
		float: left;
		display: inline-block;
		@include wh(20px);
		border: 1px solid #333;
		line-height: normal;
		text-align: center;
		font-weight: bold;
	}
	.rest-info-support-desc{
		position: relative;
		display: inline-block;
		margin-left: 10px;
		height: 20px;
		top: 0;
		max-width: 205px;
	}
	.rest-info-cost-container{
		border-radius: 3px;
		text-align: center;
		background: #f6f6f6;
	}
	.rest-info-cost{
		display: inline-block;
		padding-right: 15px;
	}
	.rest-info-desc-container{
		margin-top: 15px;
	}
  .sidebar.active{
    transform: translate3d(-295px,0,0);
  }
	.sidebar{
	    position: fixed;
	    top: 0;
	    bottom: 0;
	    right: -295px;
	    width: 330px;
	    background: #504d53;
	    color: #cccccc;
	    z-index: 7;
      .sidebar-tap{
        float: left;
        width: 35px;
        height: 100%;
        .sidebar-tap-top{
          position: absolute;
          width: 35px;
          top: 50%;
          margin-top: -180px;
          .sidebar-order-icon{
            color: #ccc;
            text-align: center;
            cursor: pointer;
            padding-bottom: 20px;
          }
          .sidebar-cart-container{
            text-align: center;
            .sidebar-cart-icon{
              margin-bottom: 5px;
            }
            .sidebar-cart-title{
              display: block;
              text-align: center;
              @include fontscw(14px, #fff, 700);
              background: #26a2ff;
              line-height: 16px;
              padding: 7px 8px 10px;
              margin-bottom: 8px;
              cursor: pointer;
            }
          }
        }
      }
      .sidebar-content-container{
        margin-left: 35px;
        @include wh(295px, 100%);
        background-color: #e6e6e6;
        .sidebar-cart-container{
          .sidebar-cart-caption{
            background: #fff;
            @include fontscw(16px, #999);
            padding: 5px 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            >a{
              line-height: 16px;
              max-width: 240px;
              color: #333;
            }
            >a:hover{
              color: #0089dc;
            }
            >span{
              float: right;
              cursor: pointer;
            }
            >span:hover{
              color: #0089dc;
            }
          }
          .sidebar-cart{
            >dl{
              padding: 10px;
              background: #fff;
              border: 1px solid #ddd;
              margin-bottom: 10px;
              >dt{
                @include fontscw(12px, #666);
                border-bottom: 1px solid #ddd;
                padding: 2px 3px;
                >a{
                  float: right;
                }
              }
              >dd{
                overflow: hidden;
                margin: 5px 0;
                padding: 5px 10px;
                @include fontscw(12px, #666);
                line-height: 20px;
                .sidebar-food-name{
                  display: inline-block;
                  float: left;
                  width: 45%;
                  @include ellipsis;
                }
                .sidebar-food-count{
                  float: left;
                  width: 26%;
                  >button{
                    float: left;
                    @include wh(20px);
                    line-height: 18px;
                    outline: none;
                    background: #f5f5f5;
                    border: 1px solid #ddd;
                    cursor: pointer;
                  }
                  >input{
                    @include fontscw(12px, #666);
                    float: left;
                    @include wh(20px);
                    text-align: center;
                    border: 1px solid #ddd;
                    line-height: normal;
                  }
                }
                .sidebar-food-cost{
                  display: inline-block;
                  float: right;
                }
              }
            }
          }
          .sidebar-cart-amount{
            position: absolute;
            padding: 20px 10px;
            text-align: right;
            border: 1px solid #ddd;
            width: 295px;
            left: 35px;
            bottom: 0;
            background: #fff;
            opacity: .95;
            @include fontscw(14px, #333);
            >span{
              color: #f74342;
            }
            >button{
              display: block;
              width: 100%;
              border: 0;
              background: #fa5858;
              text-align: center;
              line-height: 32px;
              margin-top: 10px;
              color: #fff;
              cursor: pointer;
            }
          }
        }
        .sidebar-cart-empty{
          @include wh(100%);
          text-align: center;
          padding-top: 100px;
          color: #9c9c9c;
          >span{
            margin-top: 20px;
            display: block;
            @include fontscw(18px, #333, 400);
          }
        }
      }
  	}
</style>
