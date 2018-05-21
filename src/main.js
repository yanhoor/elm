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
		foodOrderList: [],
		menu: [],
		cartList: [],
	},
	mutations: {
		changeAddress(state, address){
			state.address = address;
			localStorage.address = JSON.stringify(address);
		},
		addToCart(state, food){
			state.foodOrderList.push(food);
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
		removeFromCart(food_id){
			for(let i of state.cartList){
				if (i.food_id === food_id) {
					let index = state.cartList.findIndexOf(i);
					state.cartList.splice(index, 1);
				}
			}
		},
		saveMenu(state, menu){
			state.menu = menu;
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
  }
})
