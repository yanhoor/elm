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

Vue.config.productionTip = false

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
		addToCart(state, food){
			for(let item of state.cartList){
				if (item.food_id === food.food_id) {
					item.order_count ++;
					return;
				}
			}
			for(let item of state.menu){
				if (item.id === food.category_id) {
					for(let f of item.foods){
						if (f.item_id === food.item_id) {
							for(let spec of f.specfoods){
								if (spec.food_id === food.food_id) {
									Vue.set(spec, 'order_count', 1);
									state.cartList.push(spec);
									//spec.order_count = 1;
								}
							}
						}
					}
				}
			}
		},
		updateCount(state, payload){
			for(let item of state.cartList){
				if (item.food_id === payload.food_id) {
					item.order_count = payload.value;
				}
			}
		},
		removeFromCart(state, food_id){
			for(let i of state.cartList){
				if (i.food_id === food_id) {
					i.order_count = 0;
					let index = state.cartList.indexOf(i);
					state.cartList.splice(index, 1);
				}
			}
		},
		saveMenu(state, menu){
			state.menu = menu;
		},
		clearCartList(state){
			for( let item of state.cartList){
				item.order_count = 0;
			}
			state.cartList = [];
		},
		signout(state){
			state.user = {};
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
