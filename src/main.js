// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import iView from 'iView'
import 'iview/dist/styles/iview.css'
import '../style.css'

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.use(iView);
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		address: {},
	},
	mutations: {
		changeAddress(state, address){
			state.address = address;
		}
	}
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
