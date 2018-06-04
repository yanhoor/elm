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
console.log('main.js running');
const saveToStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  localStorage.setItem(name, content);
  //console.log('save to storage ', localStorage[name]);
};

const getFromStorage = name => {
  if (!name) return;
  return JSON.parse(localStorage[name]);
};

const getMenuSpecs = menu => {
  let list = [];
  for (let item of menu) {
    for (let food of item.foods) {
      for (let spec of food.specfoods) {
        list.push(spec);
      }
    }
  }
  return list;
};

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
			saveToStorage('user', user);
		},
		saveCity(state, city){
			state.city = city;
		},
		changeAddress(state, address){
			state.address = address;
			saveToStorage('address', address);
		},
		addToCart(state, payload){
			//console.log('addToCart');
			let food = payload.food;
			let currentItem = null; //购物车内含有对应餐馆的那一项
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
			  //console.log('update cartList menu in store');
				currentItem = {
					restaurant_id: payload.rest.id,
					restaurant: payload.rest,
					orderList: [],
					menu: state.menu
				};
				state.cartList.push(currentItem);
			}
			let allSpecs = getMenuSpecs(currentItem.menu);
			for(let spec of allSpecs){
        if (spec.food_id === food.food_id) {
          Vue.set(spec, 'order_count', 1);
          //console.log('addToCart add new item');
          currentItem.orderList.push(spec);
        }
      }
			saveToStorage('cartlist', state.cartList);
		},
		updateCount(state, payload){
			for(let item of state.cartList){
				if (item.restaurant_id === payload.rest.id) {
					for( let i of item.orderList){
						if (i.food_id === payload.food_id) {
							//console.log('updateCount cartList', state.cartList);
							i.order_count = payload.value;
						}
					}
				}
			}
      saveToStorage('cartlist', state.cartList);
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
      saveToStorage('cartlist', state.cartList);
		},
		saveMenu(state, menu){
		  //console.log('save new state.menu');
			state.menu = menu;
		},
		clearCartList(state, restId){
			for( let item of state.cartList){
				if (item.restaurant_id === restId) {
					for( let i of item.orderList){
						i.order_count = 0;
					}
					let index = state.cartList.indexOf(item);
					state.cartList.splice(index, 1);
				}
			}
      saveToStorage('cartlist', state.cartList);
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
    //console.log('mounted in #app');
  	store.state.address = getFromStorage('address');
  	store.state.user = getFromStorage('user');
  	store.state.cartList = getFromStorage('cartlist');
  },
  updated(){
    //console.log('updated in #app');
  },
  beforeDestroyed(){
    //console.log('beforeDestroyed in #app');
    //localStorage.clear();
  },
});
