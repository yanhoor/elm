<template>
	<div class="checkout-container">
    <div class="top-container">
      <div class="top-left">
        <span>当前位置：</span>
        <span>{{ address.name }} ></span>
        <span>{{ checkoutData.cart.restaurant_info.name }} ></span>
        <span>订单信息</span>
      </div>
      <div class="top-right">
        <span>{{ user.username }}</span>
        <div class="topbar-user-info">
          <span class="down-arrow"></span>
          <div class="topbar-user-info-dropbox">
            <span @click="handleClickDropbox('center')">个人中心</span>
            <span @click="handleClickDropbox('favorite')">我的收藏</span>
            <span @click="handleClickDropbox('address')">我的地址</span>
            <span @click="handleClickDropbox('safety')">安全设置</span>
            <span @click="handleClickDropbox('logout')">退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <div class="main-content-container">
      <div class="left-content-container">
        <div class="order-title">
          <h2>订单详情</h2>
          <a :href="'/restaurant' + restaurant.id">< 返回商家修改</a>
        </div>
        <div class="cart-cate">
          <span class="item-name">商品</span>
          <span class="item-quantity">份数</span>
          <span class="item-total">小计（元）</span>
        </div>
        <dl v-if="checkoutData.cart.groups">
          <dt>1号购物车</dt>
          <dd v-for=" item in checkoutData.cart.groups[0]">
            <div class="cart-item-name">{{ item.name }}</div>
            <div class="cart-item-quantity">
              <button>-</button>
              <input v-model="item.quantity">
              <button>+</button>
            </div>
            <div class="cart-item-total">{{ item.price * item.quantity }}</div>
          </dd>
        </dl>
        <ul class="cart-extra">
          <li>
            <span class="extra-item-name">配送费</span>
            <span class="extra-item-total">￥{{ checkoutData.cart.deliver_amount || 0 }}</span>
          </li>
          <li v-if="checkoutData.cart.extra">
            <span class="extra-item-name">餐盒</span>
            <span class="extra-item-total">￥{{ checkoutData.cart.extra[0].price }}</span>
          </li>
        </ul>
        <div class="cart-total">
          ￥<span>{{ checkoutData.cart.total }}</span>
        </div>
        <div class="cart-count">
          共<span>{{ productCount }}</span>份商品
        </div>
      </div>
      <div class="right-content-container">
        <div class="address-section">
          <h2>
            收货地址 <a>添加新地址</a>
          </h2>
          <ul>
            <li v-for="address in addressList">
              <Icon type="ios-location-outline"></Icon>
              <div class="address-info">
                <p>{{ address.name + ['', '先生', '女士'][address.sex] + address.phone }}</p>
                <p>{{ address.address + address.address_detail }}</p>
              </div>
              <div class="address-edit">
                <a>修改</a>
                <a>×</a>
              </div>
            </li>
            <a @click=" showMoreAddress = true" v-show="!showMoreAddress && addressList.length > 1">显示更多地址<Icon type="chevron-down"></Icon></a>
            <a @click=" showMoreAddress = false" v-show="showMoreAddress && addressList.length > 1">收起<Icon type="chevron-up"></Icon></a>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { handleClickDropbox } from '../components/common/mixin.js';
  import { getReceivedAddresses,addToCart } from '../service/getData.js';

  export default {
    data(){
      return {
        restaurant: null,
        address: null,
        user: null,
        cartList: null,
        addressList: [], //已有收货地址列表
        addressAvailable: [], //配送范围内地址列表
        addressDisable: [],
        showMoreAddress:false,
        checkoutData: null, //下单时服务器返回的验证数据
        geohash: '',//主页选中的地址经纬度
      }
    },
    computed: {
      productCount(){
        let total = 0;
        if (this.checkoutData.cart.groups) {
          for (let item of this.checkoutData.cart.groups[0]){
            total += item.quantity;
          }
        }
        return total;
      },
    },
    watch: {
      addressList(newVal){
        let list1 = [];
        let list2 = [];
        for (let item of newVal){
          if (item.is_deliverable) {
            list1.push(item);
          }else{
            list2.push(item);
          }
        }
        this.addressAvailable = list1;
        this.addressDisable = list2;
      },
    },
    mixins: [handleClickDropbox],
    created(){
      this.geohash = this.$route.query.geohash;
      this.restaurant = this.$store.state.currentRestaurant;
      this.address = this.$store.state.address;
      this.user = this.$store.state.user;
      let list = this.$store.state.cartList;
      for ( let item of list){
        if (item.restaurant_id === this.restaurant.id){
          this.cartList = item.orderList;
        }
      }
      getReceivedAddresses(this.user.user_id).then( res => {
        this.addressList = res;
      });

      let entities = [];
      for (let item of this.cartList) {
        entities.push({
          attrs: [],
          extra: {},
          id: item.food_id,
          name: item.name,
          packing_fee: item.packing_fee,
          price: item.price,
          quantity: item.order_count,
          sku_id: item.sku_id,
          specs: item.specs,
          stock: item.stock,
        });
      }
      addToCart( this.restaurant.id, this.geohash, [entities] ).then( res => {
        this.checkoutData = res;
        console.log('checkoutData ', res);
      });
    }
  }
</script>
<style lang="scss" type="text/scss" scoped>
  @import '../style/mixin';
</style>
