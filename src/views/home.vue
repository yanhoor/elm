<template>
  <div class="home">
    <div class="top">
      <div class="header-container">
        <header>
          <div class="header-left-pannel">
            <a>美好生活，触手可得</a>
          </div>
          <router-link to="/login" class="header-right-pannel">
            <div>
              <a>注册</a>
              <span>|</span>
              <a>登录</a>
            </div>
          </router-link>
        </header>
      </div>
      <div class="address-container">
        <div class="city-container">
          <a class="city-current" @click="showDialog = !showDialog">{{citySelected.name}}</a>
          <transition name="city-dialog">
            <div
              class="city-dialog"
              v-if="showDialog">
                <div class="dialog-container">
                  <div class="dialog-header">
                    <span>请选择你所在的城市</span>
                    <div class="dialog-header-right">
                      <span>选城市</span>
                      >定位置>叫外卖
                    </div>
                  </div>
                  <div class="dialog-guess-city-container">
                    <div class="dialog-guess-city">
                      <span>猜你在</span>
                      <button @click="handleSelectCity(cityGuess)">{{cityGuess.name}}</button>
                    </div>
                    <div class="dialog-guess-city-search">
                      <input v-model="citySearch" placeholder="请输入城市">
                      <ul class="dialog-search-city-list" v-if="cityFiltedList.length">
                        <li
                          v-for="item in cityFiltedList"
                          :key="item.id"
                          @click=handleSelectCity(item)
                          class="dialog-search-city-list-item">
                            <span class="name-span">{{item.name}}</span>
                            <span class="pinyin-span">{{item.pinyin}}</span>
                          </li>
                      </ul>
                    </div>
                  </div>
                  <div
                    class="citylist-container"
                    v-for="(value, key) in citySource">
                      <span>{{key}}</span>
                      <div class="citylist-item-container">
                          <span
                            @click="handleSelectCity(item)"
                            v-for="item in value">
                              {{item.name}}
                          </span>
                      </div>
                  </div>
                </div>
            </div>
          </transition>
        </div>
        <div class="form-container">
          <form class="search-form">
            <input
              class="search-input"
              v-model="addressDetail"
              placeholder="请输入你的收货地址（写字楼、小区、街道、学校）"></input>
            <button
              @click.prevent="handleSearchPlace"
              class="search-button">
                搜索
            </button>
          </form>
          <div class="address-detail-container" v-if="addressDetail.length">
            <ul class="address-detail-list" v-if="detailAddressList.length">
              <li
                v-for="item in detailAddressList"
                :key="item.id"
                @click="handleSelectAddress(item)">
                  <p class="address-detail-list-name">{{item.name}}</p>
                  <p class="address-detail-list-address">{{item.address}}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom"></div>
  </div>
</template>

<script type="text/javascript">
  import { guessCity, groupCities, searchAddress } from '../service/getData.js';
  export default {
    data(){
      return {
        cityGuess: '', //定位的城市
        citySelected: '', //对话框内选中的城市
        citySource: {}, //字母排序的城市列表对象
        cityObjectList: [], //citySource内所有城市对象
        citySearch: '', //搜索城市输入的关键词
        addressDetail: '', //搜索框输入的详细地址
        detailAddressList: [], //搜索地址返回的列表
        showDialog: false, //是否显示选择城市对话框
      }
    },
    computed: {
      cityFiltedList(){
        let list = [];
        let sourceList = [...this.cityObjectList];
        if (this.citySearch) {
          list = sourceList.filter( item => item.pinyin.indexOf(this.citySearch) === 0);
          if (list.length === 0) {
            list = sourceList.filter( item => item.name.indexOf(this.citySearch) === 0);
          }
        }
        return list;
      }
    },
    watch: {
      addressDetail(newVal){
        this.handleSearchPlace();
      }
    },
    methods: {
      handleSelectCity(city){
        this.citySelected = city;
        this.showDialog = false;
        if (this.addressDetail) this.handleSearchPlace();
      },
      handleSearchPlace(){
        this.detailAddressList = [];
        searchAddress(this.citySelected.id, this.addressDetail).then( res => {
          this.detailAddressList = [...res];
        });
      },
      handleSelectAddress(address){
        console.log('select address');
        this.$store.commit('changeAddress', address);
        this.$router.push('/list');
      }
    },
    created(){
      guessCity().then( res => {
        console.log('guessCity ', res);
        this.citySelected = res;
        this.cityGuess = res;
      });
      groupCities().then( res => {
        let object = {};
        let keys = Object.keys(res).sort();
        for( let key of keys){
          object[key] = res[key];
          for( let c of res[key]){
            this.cityObjectList.push(c);
          }
        }
        this.citySource = object;
      });
    }
  }
</script>

<style lang="scss" type="text/css" scoped>
  @import '../style/mixin';
  .home{
    @include wh(100%);
  }
  .top{
    background: #008de1;
    @include wh(100%, 70%);
    color: #fff;
  }
  .header-container{
    @include wh(1180px 90px);
    margin: 0 auto;
    padding-top: 25px;
  }
  .header-left-pannel{
    display: inline-block;
    float: left;
    a{
      display: inline-block;
      line-height: 60px;
      @include fontscw(16px, #fff);
      padding: 0 15px;
    }
  }
  .header-right-pannel{
    display: inline-block;
    float: right;
  }
  .address-container{
    width: 1180px;
    position: relative;
    top: 20%;
    line-height: 60px;
    margin: 0 auto;
    padding: 0 200px;
  }
  .city-container{
    float: left;
    @include wh(20%, 60px);
  }
  .city-current{
    display: inline-block;
    position: relative;
    padding: 0 3px;
    text-align: center;
    width: 100%;
    font-size: 20px;
    background: #fff;
    @include ellipsis;
    &::after{
      display: inline-block;
      top: 45%;
      right: 13px;
      margin-left: 5px;
      vertical-align: middle;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #999;
      content: '';
      position: absolute;
    }
  }
  .city-dialog{
    position: absolute;
    z-index: 1000;
    top: 76px;
    @include wh(730px, 400px);
    overflow: auto;
    background-color: #fff;
    box-shadow: 0 20px 20px 0 rgba(0,0,0,.085);
  }
  .city-dialog-enter-active, .city-dialog-leave-active{
    transition: opacity .8s;
  }
  .city-dialog-enter, .city-dialog-leave-to{
    opacity: 0;
  }
  .city-dialog---::before{
    position: absolute;
    content: '';
    top: 0;
    left: 50px;
    margin-top: -30px;
    border: 60px solid transparent;
    border-bottom-color: #fff;
  }
  .dialog-container{
    padding: 0 30px;
    @include wh(100%);
  }
  .dialog-header{
    @include wh(100%, 45px);
    border-bottom: 1px solid #eee;
    >span{
      position: relative;
      @include fontscw(13px, #000);
      left: 150px;
    }
  }
  .dialog-header-right{
    display: inline-block;
    height: 100%;
    float: right;
    @include fontscw(14px, #000);
    padding: 0 50px 10px 0;
    >span{
      color: #008de1;
    }
  }
  .dialog-guess-city-container{
    width: 100%;
    border-bottom: 1px solid #eee;
  }
  .dialog-guess-city{
    display: inline-block;
    position: relative;
    left: 150px;
    >span{
      @include fontscw(16px, #008de1);
    }
    >button{
      display: inline-block;
      line-height: 30px;
      margin: 0 0 0 14px;
      padding: 2px 16px;
      @include fontscw(16px, #fff);
      cursor: pointer;
      border-radius: 3px;
      border: none;
      background-color: #ff6000;
    }
  }
  .dialog-guess-city-search{
    display: inline-block;
    position: relative;
    left: 170px;
    >input{
      line-height: 30px;
      background-color: #f5f5f5;
      border: 1px solid #ededed;
      width: 200px;
      padding: 0 12px 0 15px;
      border-radius: 3px;
      font-size: 12px;
    }
  }
  .dialog-search-city-list{
    position: absolute;
    width: 200px;
    max-height: 300px;
    overflow: auto;
    background-color: #fff;
    z-index: 1100;
    line-height: 30px;
    font-size: 12px;
    border: 1px solid #eee;
    list-style: none;
    border-top: 0;
    &-item{
      display: block;
      height: 30px;
    }
    &-item:hover{
      background-color: #eee;
    }
    &-item>span{
      display: inline-block;
      color: #000;
      @include ellipsis;
    }
  }
  .name-span{
    width: 60%;
    float: left;
    padding-left: 5px;
    text-align: left;
  }
  .pinyin-span{
    width: 40%;
    float: right;
    padding-right: 5px;
    text-align: right;
  }
  .citylist-container{
    width: 100%;
    border-bottom: 1px solid #eee;
    >span{
      @include fontscw(14px, #008de1);
      float: left;
    }
  }
  .citylist-item-container{
    display: inline-block;
    width: 630px;
    padding-left: 50px;
    >span{
      display: inline-block;
      width: 100px;
      cursor: pointer;
      @include fontscw(14px);
      margin-right: 10px;
      line-height: 30px;
      text-align: center;
      @include ellipsis;
    }
    >span:hover{
      color: #008de1;
    }
  }
  .search-form{
    height: 60px;
    text-align: left;
    vertical-align: top;
  }
  .form-container{
    position: relative;
    display: inline-block;
    width: 80%;
    &::before{
      display: inline-block;
      @include wh(2px, 60px);
      border-left: 1px solid #999;
    }
  }
  .search-input{
    position: relative;
    bottom: 1.5px;
    @include wh(70%, 60px);
    border: none;
    padding-left: 18px;
    font-size: 16px;
  }
  .search-button{
    position: relative;
    left: 15px;
    display: inline-block;
    width: 20%;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    @include fontscw(20px, #fff);
    letter-spacing: 10px;
    background-color: #f74342;
  }
  .address-detail-container{
    position: absolute;
    z-index: 999;
    width: 70%;
    background: #fff;
  }
  .address-detail-list{
    list-style: none;
    height: 400px;
    overflow: auto;
    >li{
      height: 60px;
      cursor: pointer;
      padding: 10px 0;
    }
    >li:hover{
      background: #f2f5f7;
    }
    p{
      padding-top: 2px;
      height: 50%;
      line-height: normal;
      text-align: center;
      @include ellipsis;
    }
  }
  .address-detail-list-name{
    @include fontscw(14px);
  }
  .address-detail-list-address{
    @include fontscw(12px, #999);
  }
  .bottom{
    @include wh(100%, 30%);
  }
</style>