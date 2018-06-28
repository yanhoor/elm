import Vue from 'vue';

const saveToStorage = (name, content) => {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  localStorage.setItem(name, content);
  //console.log('save to storage ', localStorage[name]);
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

export let mutations = {
  saveUserInfo(state, user){
    state.user = user;
    saveToStorage('user', user);
  },
  saveCity(state, city){
    state.city = city;
    saveToStorage('city', city);
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
        break;
      }
    }
    saveToStorage('cartlist', state.cartList);
  },
  updateCount(state, payload){
    for(let item of state.cartList){
      if (item.restaurant_id === payload.rest_id) {
        for( let i of item.orderList){
          if (i.food_id === payload.food_id) {
            //console.log('updateCount cartList', state.cartList);
            i.order_count = payload.value;
            saveToStorage('cartlist', state.cartList);
            return;
          }
        }
      }
    }
  },
  removeFromCart(state, payload){
    for(let item of state.cartList){
      if (item.restaurant_id === payload.rest_id) {
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
};
