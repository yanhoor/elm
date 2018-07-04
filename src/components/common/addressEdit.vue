<template>
  <Modal
    class="modal-container"
    v-model="showModal"
    title="添加新地址"
    ok-text="保存"
    @on-ok="handleClickSaveAddress">
      <div class="modal-form-item">
        <label>姓名</label>
        <input placeholder="请输入您的姓名" v-model="addressInfo.name">
      </div>
      <div class="modal-form-item">
        <label>性别</label>
        <div class="radio-container">
          <input id="sex-male" type="radio" name="sex" value="1" v-model="addressInfo.sex">
          <label for="sex-male">先生</label>
          <input id="sex-female" type="radio" name="sex" value="2" v-model="addressInfo.sex">
          <label for="sex-female">女士</label>
        </div>
      </div>
      <div class="modal-form-item">
        <label>位置</label>
        <input placeholder="请输入小区、大厦或学校" v-model="addressKeyword">
        <div class="address-list-container" v-show="showAddressList">
          <ul>
            <li v-for="item in searchAddressList" @click="handleClickAddressList(item)">
              <p>{{ item.name }}</p>
              <p>{{ item.address }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="modal-form-item">
        <label>详细地址</label>
        <input placeholder="单元、门牌号" v-model="addressInfo.address_detail">
      </div>
      <div class="modal-form-item">
        <label>手机号</label>
        <input placeholder="请输入您的手机号" v-model="addressInfo.phone">
      </div>
      <div class="modal-form-item">
        <label>备注电话</label>
        <input placeholder="请输入您的手机号" v-model="addressInfo.phone_bk">
      </div>
      <div class="modal-form-item">
        <label>地址标签</label>
        <div class="radio-container">
          <input id="home" type="radio" name="label" value="2" v-model="addressInfo.tag_type">
          <label for="home">家</label>
          <input id="school" type="radio" name="label" value="3" v-model="addressInfo.tag_type">
          <label for="school">学校</label>
          <input id="company" type="radio" name="label" value="4" v-model="addressInfo.tag_type">
          <label for="company">公司</label>
        </div>
      </div>
  </Modal>
</template>
<script>
  import {
    addAddress,
    deleteAddress,
    searchAddress,
  } from '../../service/getData.js';

  export default {
    props: {
      address: Object,
      show: false,
      editType: String,
    },
    data(){
      return {
        addressKeyword: '', //对应对话框位置
        showAddressList: false, //是否显示对话框的地址搜索结果
        searchAddressList: [], //对话框输入位置时显示的列表
        showModal: false,
        addressInfo: {
          user_id: '',
          address: '',
          address_detail: '',
          geohash: '',
          name: '',
          phone: '',
          tag: '',
          tag_type: '',
          sex: '',
          poi_type: 0,
          phone_bk: '',
        },
      };
    },
    computed: {
      user(){
        return this.$store.state.user;
      },
      city(){
        return this.$store.state.city;
      },
    },
    watch: {
      addressKeyword(newVal){
        if (newVal==='') {
          this.searchAddressList = [];
          this.showAddressList = false;
          return;
        }
        this.handleSearchAddress();
      },
      show(newVal){
        this.showModal = newVal;
      },
      showModal(newVal){
        this.$bus.emit('changeShowModal', newVal);
        if (this.editType === 'modify'){
          this.addressInfo = this.address;
          this.addressKeyword = this.address.address;
          return;
        }
        this.addressKeyword = '';
        this.addressInfo = {
          user_id: '',
          address: '',
          address_detail: '',
          geohash: '',
          name: '',
          phone: '',
          tag: '',
          tag_type: '',
          sex: '',
          poi_type: 0,
          phone_bk: '',
        };
      },
      address(newVal){
        this.addressInfo = newVal;
        this.addressKeyword = newVal.address;
      },
    },
    methods: {
      handleClickAddressList(address){
        this.addressInfo.geohash = address.geohash;
        this.addressInfo.address = address.name;
        this.addressKeyword = address.name;
        this.showAddressList = false;
      },
      async handleClickSaveAddress(){
        if (this.addressInfo.id) {
          this.addressInfo.geohash = this.addressInfo.st_geohash;
          await deleteAddress(this.addressInfo.user_id, this.addressInfo.id).then( res => {
            console.log('delete result ', res);
          });
        }
        this.addressInfo.user_id = this.user.user_id;
        switch(this.addressInfo.tag_type){
          case '2':
            this.addressInfo.tag = '家';
            break;
          case '3':
            this.addressInfo.tag = '学校';
            break;
          case '4':
            this.addressInfo.tag = '公司';
            break;
        }
        let {user_id,address,address_detail,geohash,name,phone,tag,sex,phone_bk,tag_type,poi_type} = this.addressInfo;
        addAddress(user_id,address,address_detail,geohash,name,phone,tag,sex,phone_bk,tag_type,poi_type).then( res => {
          console.log('add result ', res);
          this.$Message.success({
            content: '添加地址成功！',
            duration: 2,
          });
          this.$bus.emit('updateAddress');
        });
      },
      handleSearchAddress(){
        searchAddress(this.city.id, this.addressKeyword, 'nearby').then( res => {
          this.searchAddressList = res;
          this.showAddressList = true;
          if (!this.addressKeyword) {
            this.searchAddressList = [];
            this.showAddressList = false;
          }
          //if (this.addressKeyword !== this.addressInfo.address) this.showAddressList = true;
        });
      },
    },
  };
</script>
<style type="text/scss" lang="scss" scoped>
  @import '../../style/mixin';
  .modal-form-item{
    position: relative;
    padding-bottom: 25px;
    font-size: 14px;
    >label{
      float: left;
      display: inline-block;
      @include wh(65px, 38px);
      margin-right: 20px;
      line-height: 38px;
      text-align: right;
      color: #666;
    }
    >input{
      border: 1px solid #dedede;
      box-sizing: border-box;
      @include wh(300px, 42px);
      line-height: 38px;
      padding-left: 10px;
      border-radius: 2px;
    }
    .radio-container{
      line-height: 38px;
      >label{
        display: inline-block;
        margin-left: 5px;
        width: 60px;
        cursor: pointer;
      }
    }
    .address-list-container{
      position: absolute;
      background: #fff;
      left: 85px;
      @include wh(300px, 150px);
      top: 44px;
      border: 1px solid #ddd;
      overflow: auto;
      z-index: 100;
      >ul{
        list-style: none;
        >li{
          list-style: none;
          line-height: 16px;
          cursor: pointer;
          margin: 10px 0;
          >p:first-child{
            @include ellipsis;
            @include fontscw(14px, #666);
            padding: 6px 12px;
          }
          >p:last-child{
            @include ellipsis;
            @include fontscw(12px, #999);
            padding: 0 12px;
          }
        }
        >li:hover{
          background: #eee;
        }
      }
    }
  }
</style>
