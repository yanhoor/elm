<template>
	<div class="checkout-container" v-if="checkoutData">
    <div class="top-container">
      <div class="top">
        <div class="top-left">
          <span>当前位置：</span>
          <span>{{ address.name }} ></span>
          <span v-if="checkoutData.cart">{{ checkoutData.cart.restaurant_info.name }} ></span>
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
    </div>
    <div class="main-content-container">
      <div class="left-content-container">
        <div class="order-title">
          <h2>订单详情</h2>
          <a :href="'/restaurant/' + restaurant.id">< 返回商家修改</a>
        </div>
        <div class="cart-cate">
          <span class="item-name">商品</span>
          <span class="item-quantity">份数</span>
          <span class="item-total">小计(元)</span>
        </div>
        <dl v-if="checkoutData.cart">
          <dt>1号购物车</dt>
          <dd v-for=" item in checkoutData.cart.groups[0]">
            <div class="cart-item-name">{{ item.name }}</div>
            <div class="cart-item-quantity">
              <button @click="editCount(restaurant.id, item, -1)">-</button>
              <input v-model="item.quantity">
              <button @click="editCount(restaurant.id, item, 1)">+</button>
            </div>
            <div class="cart-item-total">￥{{ item.price * item.quantity }}</div>
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
        <div class="checkout-section">
          <h2>
            收货地址 <a @click="handleAddAddress">添加新地址</a>
          </h2>
          <ul>
            <li
              v-for="address in addressToShow"
              :class="{'checkout-section-address': true, 'active': address.id === selectedAddress.id}"
              @click="handleClickAddress(address)">
              <Icon type="ios-location-outline" size="40" class="address-icon"></Icon>
              <div class="address-info">
                <p>{{ address.name + ['', '先生', '女士'][address.sex] + address.phone }}</p>
                <p>{{ address.address + address.address_detail }}</p>
              </div>
              <div class="address-edit">
                <a @click="handleModifyAddress(address)">修改</a>
                <a @click="handleDeleteAddress(address)">   ×</a>
              </div>
            </li>
            <a @click="handleShowMoreAddress(true)" v-show="!showMoreAddress && addressList.length > 1">显示更多地址<Icon type="chevron-down"></Icon></a>
            <a @click="handleShowMoreAddress(false)" v-show="showMoreAddress && addressList.length > 1">收起<Icon type="chevron-up"></Icon></a>
          </ul>
        </div>
        <div class="checkout-section">
          <h2 class="payment-title">付款方式</h2>
          <ul>
            <li v-for="item in checkoutData.payments" :key="item.id" class="checkout-section-payment">
              <p>{{ item.name }}</p>
              <p>{{ item.description }}</p>
            </li>
          </ul>
        </div>
        <div class="checkout-section">
          <h2>选择优惠</h2>
          <p class="checkout-section-promotion">
            <span>使用红包</span>
            <span>无可用红包</span>
          </p>
          <p class="checkout-section-promotion">
            <span>使用优惠券</span>
            <span>网站不支持（仅手机客户端可用）</span>
          </p>
        </div>
        <div class="checkout-section">
          <h2>其他信息</h2>
          <div class="checkout-info" v-if="checkoutData.cart.is_deliver_by_fengniao">
            <span class="checkout-info-label">配送方式</span>
            <span class="checkout-info-desc">本订单由 <span class="fengniao">蜂鸟专送</span> 提供配送</span>
          </div>
          <div class="checkout-info">
            <span class="checkout-info-label">送达时间</span>
            <span class="checkout-info-desc">尽快送达 | 预计 {{ checkoutData.delivery_reach_time }}</span>
          </div>
          <div class="checkout-info">
            <span class="checkout-info-label">发票信息</span>
            <span class="checkout-info-desc">{{ checkoutData.invoice.status_text }}</span>
          </div>
          <div class="checkout-info">
            <span class="checkout-info-label">订单备注</span>
            <span class="checkout-info-desc"><input v-model="orderDescription"></span>
          </div>
        </div>
        <button ref="commitButton" @click="handleClickOrder">确认下单</button>
      </div>
    </div>
    <div :class="{'float-commit': true, active: showFloatCommit}">
      <div class="float-commit-content">
        <span>
          应付金额
          <span class="yuan">￥</span>
          <span class="float-commit-total">{{ checkoutData.cart.total }}</span>
        </span>
        <button @click="handleClickOrder">确认下单</button>
      </div>
    </div>
    <AddressEdit :address="addressToEdit" :show="showModal" :edit-type="editType"></AddressEdit>
  </div>
</template>
<script>
  import AddressEdit from '../components/common/addressEdit';
  import { handleClickDropbox, updateCount } from '../components/common/mixin.js';
  import {
    getReceivedAddresses,
    deleteAddress,
    addToCart,
    postOrder,
    getRestaurantInfo } from '../service/getData.js';

  export default {
    components: {
      AddressEdit,
    },
    data(){
      return {
        restaurant: null, //根据id重新获取的餐馆信息
        restaurantId: '', //从路由参数获取的id
        address: null, //首页选中的地址
        user: null,
        cartList: null,
        addressList: [], //已有收货地址列表
        addressToShow: [], //用于展示的地址列表
        addressAvailable: [], //配送范围内地址列表
        addressDisable: [], //超出配送范围的地址
        showMoreAddress:false, //是否显示更多收货地址
        checkoutData: null, //下单时服务器返回的验证数据
        geohash: '',//主页选中的地址经纬度
        showFloatCommit: true, //显示浮动下单按钮
        orderDescription: '', //下单备注
        selectedAddress: null, //选中的收货地址
        addressToEdit: null, //点击修改的地址
        showModal: false, //显示地址编辑框
        editType: '', //修改或添加地址
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
        if (this.addressAvailable.length) this.selectedAddress = this.addressAvailable[0];
      },
    },
    mixins: [handleClickDropbox, updateCount],
    methods: {
      editCount(restaurant_id, food, value){
        this.updateCount(restaurant_id, food.id, food.quantity + value);
        this.updateData();
      },
      updateData(){
        let list = this.$store.state.cartList;
        for ( let item of list){
          if (item.restaurant_id === this.restaurantId){
            this.cartList = item.orderList;
          }
        }
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
        let _this = this;
        addToCart( this.restaurantId, this.geohash, [entities] ).then( res => {
          if (res.status === 0) {
            this.$Message.error({
              content: res.message,
              duration: 3,
              onClose(){
                _this.$router.push('/list');
              },
            });
            return;
          }
          this.checkoutData = res;
        });
      },
      handleClickOrder(){
        postOrder(this.user.id, this.checkoutData.cart.id, this.selectedAddress.id, this.restaurant.id, this.geohash, this.orderDescription, this.checkoutData.cart.groups).then( res => {
          console.log(res);
          this.$Message.success({
            content: '下单成功！',
            duration: 2,
          });
          this.$store.commit('clearCartList', this.restaurant.id);
          this.$router.push('/profile/order');
        });
      },
      handleShowMoreAddress(showMore){
        this.showMoreAddress = showMore;
        if (this.addressList.length === 0) return;
        if (showMore) {
          this.addressToShow = [...this.addressList];
          return;
        }
        this.addressToShow = [];
        if (this.selectedAddress) {
          this.addressToShow.push(this.selectedAddress);
          return;
        }
        this.addressToShow.push(this.addressList[0]);
      },
      handleClickAddress(address){
        this.selectedAddress = address;
      },
      handleModifyAddress(address){
        this.addressToEdit = address;
        this.showModal = true;
        this.editType = 'modify';
      },
      handleDeleteAddress(address){
        this.$modal.confirm({
          content: '确认删除该地址吗？',
          onOk(){
            deleteAddress(address.user_id, address.id).then( res => {
              this.$Message.warning({
                content: '删除地址成功！',
                duration: 2,
              });
              this.updateAddressList();
              //console.log('delete result ', res);
            });
            this.updateAddressList();
          },
        });
      },
      handleAddAddress(){
        this.showModal = true;
        this.editType = 'add';
      },
      async updateAddressList(){
        await getReceivedAddresses(this.user.user_id).then( res => {
          this.addressList = res;
          this.addressToShow = res;
          return res;
        });
      },
      scroll(){
        if (!this.$refs.commitButton) return;
        if (this.$refs.commitButton.getBoundingClientRect().top >= window.innerHeight) {
          this.showFloatCommit = true;
        }else{
          this.showFloatCommit = false;
        }
      },
      bindEvent(){
        document.addEventListener('scroll', this.scroll, false);
      },
      unbindEvent(){
        document.removeEventListener('scroll', this.scroll, false);
      }
    },
    created(){
      this.geohash = this.$route.query.geohash;
      this.restaurantId = parseInt(this.$route.query.restaurant_id, 10);
      this.address = this.$store.state.address;
      this.user = this.$store.state.user;
      getRestaurantInfo(this.restaurantId).then( res => this.restaurant = res);
      this.updateAddressList().then( res => {
        console.log(res);
        if(this.addressToShow.length) this.addressToShow = this.addressToShow.slice(0, 1);
      });
      this.updateData();
      this.$bus.on('changeShowModal', value => {
        this.showModal = value;
      });
      this.$bus.on('updateAddress', () => {
        this.updateAddressList();
      });
    },
    mounted(){
      this.bindEvent();
    },
    beforeDestroy(){
      this.unbindEvent();
    },
  }
</script>
<style lang="scss" type="text/scss" scoped>
  @import '../style/mixin';

  .checkout-container{
    width: 100%;
    .top-container{
      background: #0089dc;
    }
  }
  .top{
    width: 1180px;
    margin: 0 auto;
    @include fontscw(12px, #fff);
    line-height: 30px;
    .top-left{
      display: inline-block;
    }
    .top-right{
      float: right;
      display: flex;
      justify-content: center;
    }
    .topbar-user-info{
      display: inline-block;
      width: 20px;
      margin-left: 8px;
      margin-right: 3px;
      position: relative;
      .down-arrow{
        text-align: center;
        background: #449be5;
        font-size: 20px;
      }
      .down-arrow::before{
        content: '\e904';
        cursor: pointer;
      }
    }
    .topbar-user-info-dropbox{
      display: none;
    }
    .top-right:hover .topbar-user-info-dropbox{
      display: block;
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 10;
      width: 80px;
      padding: 4px 6px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, .5);
      background: rgba(255, 255, 255, .98);
      >span{
        cursor: pointer;
        text-align: center;
        line-height: 32px;
        display: block;
        @include fontscw(12px, #999);
      }
      >span:hover{
        background: #eee;
      }
    }
  }
  .main-content-container{
    width: 1180px;
    margin: 0 auto;
    .left-content-container{
      float: left;
      width: 34%;
      margin-top: 30px;
      background: #fff;
      border: 1px solid #e0e0e0;
      border-bottom: 0;
      .order-title{
        position: relative;
        padding: 20px;
        height: 60px;
        border-bottom: 1px solid #eee;
        >h2{
          display: inline-block;
          @include fontscw(16px,#333,700);
        }
        >a{
          float: right;
          color: #666;
        }
      }
      .cart-cate{
        display: flex;
        @include fontscw(12px,#999,700);
        @include wh(100%, 48px);
        line-height: 48px;
        padding: 0 18px 0 20px;
        >span{
          display: inline-block;
        }
        .item-name{
          width: 45%;
          padding-left: 10px;
          text-align: left;
        }
        .item-quantity{
          width: 30%;
          text-align: center;
        }
        .item-total{
          padding-right: 10px;
          width: 25%;
          text-align: right;
        }
      }
      >dl{
        >dt{
          border-bottom: 1px solid #eee;
          padding-left: 30px;
          height: 48px;
          line-height: 48px;
          @include fontscw(14px,#333,700);
        }
        >dd{
          display: flex;
          background: #fcfaf8;
          line-height: 48px;
          padding: 0 18px 0 20px;
          @include fontscw(14px, #666);
          @include wh(100%, 48px);
          .cart-item-name{
            padding-left: 10px;
            width: 45%;
            font-size: 12px;
            border-bottom: 1px solid #eee;
          }
          .cart-item-quantity{
            width: 30%;
            border-bottom: 1px solid #eee;
            text-align: center;
            >button{
              display: inline-block;
              background: #fff;
              @include wh(24px);
              border: 1px solid #eee;
              outline: 0;
              cursor: pointer;
              line-height: normal;
            }
            >input{
              display: inline-block;
              @include wh(24px);
              border: 0;
              border-top: 1px solid #eee;
              text-align: center;
              outline: 0;
              line-height: normal;
            }
          }
          .cart-item-total{
            padding-right: 10px;
            width: 25%;
            border-bottom: 1px solid #eee;
            text-align: right;
          }
        }
      }
      >ul{
        list-style: none;
        >li{
          @include wh(100%, 40px);
          padding: 18px 18px 0 20px;
          @include fontscw(14px, #666);
          .extra-item-name{
            display: inline-block;
            padding-left: 10px;
            width: 45%;
            font-size: 12px;
          }
          .extra-item-total{
            display: inline-block;
            padding-right: 10px;
            text-align: right;
            float: right;
            width: 25%;
          }
        }
      }
      .cart-total{
        padding: 52px 28px 10px;
        @include fontscw(24px, #f74342);
        text-align: right;
        >span{
          font-size: 46px;
        }
      }
      .cart-count{
        padding: 0 30px 22px;
        @include fontscw(12px, #666);
        text-align: right;
      }
    }
    .right-content-container{
      margin-top: 29px;
      padding: 25px 20px 150px 30px;
      width: 65%;
      float: right;
      background: #fff;
      font-size: 14px;
      border: 1px solid #e0e0e0;
      .checkout-section{
        margin-bottom: 40px;
        >h2{
          margin-bottom: 15px;
          @include fontscw(16px, #000, 700);
          >a{
            float: right;
            text-decoration: underline;
            @include fontscw(14px, #0089dc, 400);
          }
        }
        >ul{
         list-style: none;
          overflow: hidden;
          .checkout-section-address{
            display: block;
            position: relative;
            padding: 15px 20px 15px 0;
            width: 100%;
            border: 1px solid #eee;
            cursor: pointer;
            .address-icon{
              border-right: 1px solid #eee;
              width: 64px;
              text-align: center;
            }
            .address-info{
              display: inline-block;
              padding-left: 16px;
            }
            .address-edit{
              position: absolute;
              display: none;
              top: 10px;
              right: 10px;
              >a{
                margin-left: 10px;
              }
            }
          }
          .checkout-section-address:hover{
            background: #f9f9f9;
          }
          .checkout-section-address:hover .address-edit{
            display: block;
          }
          .checkout-section-address.active{
            border-color: #0089dc;
            border-width: 2px;
          }
          >a{
            display: inline-block;
            margin-top: 8px;
            color: #999;
          }
          .checkout-section-payment{
            float: left;
            padding: 11px 20px;
            @include wh(49.2%, auto);
            border: 1px solid #eee;
            cursor: pointer;
          }
        }
        .checkout-section-promotion{
          margin-bottom: 20px;
          >span:first-child{
            display: inline-block;
            margin-right: 20px;
            text-align: right;
            width: 70px;
          }
          >span:last-child{
            color: #999;
          }
        }
        .checkout-info{
          margin-bottom: 20px;
          .checkout-info-label{
            display: inline-block;
            margin-right: 20px;
            text-align: right;
            width: 70px;
          }
          .checkout-info-desc{
            .fengniao{
              color: #0089dc;
            }
            >input{
              padding: 5px 10px;
              width: 235px;
              border: 1px solid #e0e0e0;
              outline: 0;
              color: #666;
            }
          }
        }
      }
      >button{
        background-color: #f74342;
        @include fontscw(16px, #fff);
        padding: 12px 30px;
        display: inline-block;
        border: none;
        border-radius: 2px;
        outline: 0;
        cursor: pointer;
        text-align: center;
      }
    }
  }
  .float-commit{
    display: none;
    position: fixed;
    left: 0;
    bottom: 0;
    @include wh(100%, 50px);
    background: #fff;
    opacity: .85;
    border-top: 1px solid #ddd;
    text-align: right;
    padding: 4px 0;
    .float-commit-content{
      @include wh(1180px, 100%);
      font-size: 14px;
      margin: 0 auto;
      >span{
        display: inline-block;
        padding-top: 2px;
        margin-right: 2em;
        vertical-align: bottom;
        .yuan{
          @include fontscw(16px, #f74342);
          padding-left: 6px;
          margin-right: -3px;
        }
        .float-commit-total{
          @include fontscw(24px, #f74342, 700);
        }
      }
      >button{
        margin-right: 1em;
        vertical-align: bottom;
        background: #f74342;
        line-height: 1;
        @include fontscw(16px, #fff);
        padding: 12px 30px;
        border: none;
        border-radius: 2px;
        cursor: pointer;
        text-align: center;
        outline: 0;
      }
    }
  }
  .float-commit.active{
    display: block;
  }
</style>
