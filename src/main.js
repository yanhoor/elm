// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueBus from './config/vue-bus.js'
import store from './store/'
import iView from 'iView'
import 'iview/dist/styles/iview.css'
import '../style.css'

Vue.config.productionTip = false;

/* eslint-disable no-new */
Vue.use(iView);
Vue.use(VueBus);

router.beforeEach( (to, from, next ) => {
	window.document.title = to.meta.title;
	next();
});

const getFromStorage = name => {
  if (!name) return;
  return JSON.parse(localStorage[name]);
};

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
    store.state.city = getFromStorage('city');
  },
});
