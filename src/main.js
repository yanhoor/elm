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
  created(){
    store.state.address = getFromStorage('address');
    store.state.user = getFromStorage('user');
    store.state.cartList = getFromStorage('cartlist');
    store.state.city = getFromStorage('city');
    //默认城市和地址
    if(!store.state.city){
      let city = {
        "pinyin":"zhuhai",
        "is_map":true,
        "longitude":113.576683,
        "latitude":22.270729,
        "sort":2000,
        "area_code":"0756",
        "abbr":"ZH",
        "name":"珠海",
        "id":26
      };
      let address = {
        "name":"六乡镇",
        "address":"广东省珠海市斗门区月坑村北区19号楼(月前路北)",
        "latitude":22.30497,
        "longitude":113.28123,
        "geohash":"22.30497,113.28123"
      };
      this.$store.commit('changeAddress', address);
      this.$store.commit('saveCity', city);
    }
  },
});
