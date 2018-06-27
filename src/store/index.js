import Vue from 'vue';
import Vuex from 'vuex';
import { mutations } from './mutations.js';

Vue.use(Vuex);

let state = {
  address: {},
  menu: [],
  cartList: [],
  user: {},
  city: {},//主页选中的城市
};

export default new Vuex.Store({
  state,
  mutations,
});
