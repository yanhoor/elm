// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueBus from './config/vue-bus.js'
import Vuex from 'vuex'
import iView from 'iView'
import 'iview/dist/styles/iview.css'
import '../style.css'

Vue.config.productionTip = false;

/* eslint-disable no-new */
Vue.use(iView);
Vue.use(Vuex);
Vue.use(VueBus);

const store = new Vuex.Store({
	state: {
		address: {},
		menu: [],
		cartList: [],
		user: {},
		city: {},//主页选中的城市
		currentRestaurant: {},
	},
	mutations: {
		saveUserInfo(state, user){
			state.user = user;
			localStorage.user = JSON.stringify(user);
		},
		saveCity(state, city){
			state.city = city;
		},
		changeAddress(state, address){
			state.address = address;
			localStorage.address = JSON.stringify(address);
		},
		addToCart(state, payload){
			//console.log('addToCart');
			let food = payload.food;
			let currentItem = {}; //购物车内含有对应餐馆的那一项
			let restInList = false;
			for(let item of state.cartList){
				if (item.restaurant_id === payload.rest.id) {
					restInList = true;
					currentItem = item;
					//对于多规格食品
					for(let i of item.orderList){
						if (i.food_id === food.food_id) {
							i.order_count ++;
							//console.log('addToCart multispecs');
							return;
						}
					}
				}
			}
			if (!restInList) {
				currentItem = {
					restaurant_id: payload.rest.id,
					restaurant: payload.rest,
					orderList: [],
					menu: state.menu
				};
				state.cartList.push(currentItem);
			}
			for(let item of currentItem.menu){
				if (item.id === food.category_id) {
					for(let f of item.foods){
						if (f.item_id === food.item_id) {
							for(let spec of f.specfoods){
								if (spec.food_id === food.food_id) {
									Vue.set(spec, 'order_count', 1);
									//console.log('addToCart add new item');
									currentItem.orderList.push(spec);
								}
							}
						}
					}
				}
			}
		},
		updateCount(state, payload){
			for(let item of state.cartList){
				if (item.restaurant_id === payload.rest.id) {
					for( let i of item.orderList){
						if (i.food_id === payload.food_id) {
							console.log('updateCount');
							i.order_count = payload.value;
						}
					}
				}
			}
		},
		removeFromCart(state, payload){
			for(let item of state.cartList){
				if (item.restaurant_id === payload.rest.id) {
					for(let i of item.orderList){
						if (i.food_id === payload.food_id) {
							i.order_count = 0;
							let index = item.orderList.indexOf(i);
							item.orderList.splice(index, 1);
						}
					}
				}
				if (!item.orderList.length) {
					let index = state.cartList.indexOf(item);
					state.cartList.splice(index, 1);
				}
			}
		},
		saveMenu(state, menu){
			state.menu = menu;
		},
		clearCartList(state, rest){
			for( let item of state.cartList){
				if (item.restaurant_id === rest.id) {
					for( let i of item.orderList){
						i.order_count = 0;
					}
					let index = state.cartList.indexOf(item);
					state.cartList.splice(index, 1);
				}
			}
		},
		signout(state){
			state.user = {};
		},
		saveCurrentRestaurant(state, restaurant){
			state.currentRestaurant = restaurant;
		},
	}
});
router.beforeEach( (to, from, next ) => {
	window.document.title = to.meta.title;
	next();
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  mounted(){
  	store.state.address = JSON.parse(localStorage.address);
  	store.state.user = JSON.parse(localStorage.user);
  }
})
