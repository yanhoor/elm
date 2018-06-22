<template>
	<div class="profile-container">
		<TopBar></TopBar>
		<div class="profile-content-container">
			<ul class="profile-sidebar">
				<li class="profile-sidebar-section">
					<h2 :class="{ 'profile-sidebar-section-title':true, 'active': type === 'center'}">
						<a @click="handleClickSidebar('center')">个人中心</a>
					</h2>
				</li>
				<li class="profile-sidebar-section">
					<h2 class="profile-sidebar-section-title">我的订单</h2>
					<ul>
						<li @click="handleClickSidebar('order')" :class="{ 'active': type === 'order'}">近三个月订单</li>
					</ul>
				</li>
				<li class="profile-sidebar-section">
					<h2 class="profile-sidebar-section-title">我的资产</h2>
					<ul>
						<li>我的红包</li>
						<li>账户余额</li>
						<li>我的金币</li>
					</ul>
				</li>
				<li class="profile-sidebar-section">
					<h2 class="profile-sidebar-section-title">我的资料</h2>
					<ul>
						<li @click="handleClickSidebar('profile')" :class="{ 'active': type === 'profile'}">个人资料</li>
						<li @click="handleClickSidebar('address')" :class="{ 'active': type === 'address'}">地址管理</li>
					</ul>
				</li>
				<li class="profile-sidebar-section">
					<h2 :class="{ 'profile-sidebar-section-title':true, 'active': type === 'favorite'}">
						<a>我的收藏</a>
					</h2>
				</li>
			</ul>
			<div class="profile-pannel">
				<template v-if="type === 'center'">
					<div class="profile-pannel-center-container">
						<div class="profile-info">
							<div class="profile-info-item">
								<div class="profile-avatar-wrap">
									<img :src="'/img/' + user.avatar">
								</div>
								<div class="profile-personal-data">
									<h3>{{ user.username }}</h3>
								</div>
							</div>
							<div class="profile-info-item">
								<p>我的红包</p>
								<p class="profile-info-item-number-wrap">
									<span class="profile-info-item-number">{{ availableHongbaos.length }}</span>
									个
								</p>
							</div>
							<div class="profile-info-item">
								<p>我的金币</p>
								<p class="profile-info-item-number-wrap">
									<span class="profile-info-item-number">0</span>
									个
								</p>
							</div>
							<div class="profile-info-item">
								<p>账户余额</p>
								<p class="profile-info-item-number-wrap">
									<span class="profile-info-item-number">0.00</span>
									元
								</p>
							</div>
						</div>
					</div>
					<div class="profile-order-container">
						<div class="order-tab">
							<a>最近订单</a>
							<a>查看全部订单></a>
						</div>
						<div class="order-content">
							<div class="order-content-tip" v-if="!orderList.length">
								<p>你最近没有下过单哦，现在就去<a href="/list">订餐</a>吧~</p>
							</div>
						</div>
					</div>
				</template>
				<template v-if="type === 'order'">
					<div class="order-pannel-container">
						<h3>近三个月订单</h3>
						<div class="order-pannel-content">
							<div class="no-order" v-if="!orderList.length">
								<p>暂无记录，现在就去<a href="/list">订餐</a>吧~</p>
							</div>
              <table class="order-table" v-else>
                <thead>
                  <tr>
                    <th>下单时间</th>
                    <th></th>
                    <th></th>
                    <th>订单内容</th>
                    <th>支付金额(元)</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>

                <tbody>
                  <tr></tr>
                  <tr class="table-item" v-for="order in orderList">
                    <td class="table-item-time" v-time="Date.parse(order.formatted_created_at)"></td>
                    <td class="table-item-clock"><Icon class="item-clock-icon" type="android-time" size="15" color="#94c852"></Icon></td>
                    <td class="table-item-avatar" @click.prevent="handleClickOrderDetail(order.id)">
                      <a :href="'/restaurant/' + order.restaurant_id">
                        <img :src="'/img/' + order.restaurant_image_url">
                      </a>
                    </td>
                    <td class="table-item-info" @click.prevent="handleClickOrderDetail(order.id)">
                      <h3></h3>
                      <p class="item-info-food">
                        <a href="">
                          <span class="item-info-food-list">{{ getOrderFoodList(order) }}</span>
                           等 <span class="item-info-food-num">{{ order.basket.group[0].length }}</span>
                          个菜品
                        </a>
                      </p>
                      <p>
                        订单号
                        <a href="">{{ order.unique_id }}</a>
                      </p>
                    </td>
                    <td class="table-item-amount">
                      <h3>{{ order.total_amount }}</h3>
                    </td>
                    <td class="table-item-status">
                      <h3>{{ order.status_bar.title }}</h3>
                    </td>
                    <td class="table-item-action">
                      <a @click.prevent="handleClickOrderDetail(order.id)">订单详情</a>
                    </td>
                  </tr>
                </tbody>
              </table>
						</div>
					</div>
				</template>
				<template v-if="type === 'profile'">
					<div class="profile-pannel-container">
						<h3>个人资料</h3>
						<div class="profile-pannel-content">
							<div class="profile-detail-info">
								<p>
									<span>头像</span>
									<span>
										<img :src="'/img/' + user.avatar">
									</span>
								</p>
								<p>
									<span>用户名</span>
									<span>{{ user.username}}</span>
								</p>
							</div>
						</div>
					</div>
				</template>
				<template v-if="type === 'address'">
					<div class="address-pannel-container">
						<h3>地址管理</h3>
						<div class="address-pannel-content">
							<div class="address-detail-info">
								<div class="address-detail-item" v-for="(item, index) of addressList" :key="index">
									<div class="address-detail-item-top">
										<span>{{ item.name }}</span>
										<div>
											<span @click="handleModifyAddress(item)">修改</span>
											<span @click="addressToDelete = item">删除</span>
										</div>
									</div>
									<div class="address-detail-item-bottom">
										<p>{{ item.address + item.address_detail}}</p>
										<p>{{ item.phone }}</p>
									</div>
									<div :class="{'address-detail-item-delete-confirm': true, 'active': addressToDelete.id === item.id}" >
										<p>确定删除收货地址？</p>
										<button class="confirm-delete" @click="handleConfirmDeleteAddress(addressToDelete)">确定</button>
										<button class="cancel-delete" @click="addressToDelete = {}">取消</button>
									</div>
								</div>
								<button @click="showModal = true">
									<Icon type="plus"></Icon> 添加新地址
								</button>
							</div>
						</div>
					</div>
				</template>
        <template v-if=" type === 'order-detail' ">
          <div class="order-detail-pannel-container">
            <h3>订单详情</h3>
            <div class="order-detail-pannel-content" v-if="orderDetail">
              <div class="order-detail-title">
                <img :src="'/img/' + orderDetail._doc.restaurant_image_url">
                <div class="order-detail-rest">
                  <h3>{{ orderDetail._doc.restaurant_name }}</h3>
                  <div>
                    <span>订单号：{{ orderDetail._doc.id }}</span>
                    <span>商家电话：无</span>
                  </div>
                </div>
              </div>
              <div class="order-detail-content">
                <div class="order-detail-content-left">
                  <table>
                    <thead>
                      <tr>
                        <th>菜品</th>
                        <th>数量</th>
                        <th>小计（元）</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="order of orderDetail._doc.basket.group[0]">
                        <td>{{ order.name }}</td>
                        <td>{{ order.quantity }}</td>
                        <td>{{ order.price * order.quantity }}</td>
                      </tr>
                      <tr class="order-detail-cost-item">
                        <td>{{ orderDetail._doc.basket.packing_fee.name }}</td>
                        <td></td>
                        <td>{{ orderDetail._doc.basket.packing_fee.price }}</td>
                      </tr>
                      <tr class="order-detail-cost-item">
                        <td>{{ orderDetail._doc.basket.deliver_fee.name }}</td>
                        <td></td>
                        <td>{{ orderDetail._doc.basket.deliver_fee.price }}</td>
                      </tr>
                      <tr class="order-detail-cost-item">
                        <td></td>
                        <td></td>
                        <td>实际支付：<span>{{ orderDetail._doc.total_amount }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="order-detail-content-right">
                  <h3>配送信息</h3>
                  <div class="deliver-info">
                    <div class="deliver-info-item">
                      <span>配送方式：</span>蜂鸟专送
                    </div>
                    <div class="deliver-info-item">
                      <span>送达时间：</span>{{ orderDetail.deliver_time }}
                    </div>

                    <div class="deliver-address" v-if="addressDetail">
                      <div class="deliver-address-item">
                        <span>联系人：</span>{{ addressDetail.name }}（{{ ['', '先生', '女士'][addressDetail.sex]}}）
                      </div>
                      <div class="deliver-address-item">
                        <span>联系电话： </span>{{ addressDetail.phone }}
                      </div>
                      <div class="deliver-address-item">
                        <span>收货地址：</span>{{ addressDetail.address + addressDetail.address_detail}}
                      </div>
                      <div class="deliver-address-item">
                        <span>发票信息：</span>无发票
                      </div>
                      <div class="deliver-address-item">
                        <span>备注：</span>无备注
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
			</div>
			<Modal class="modal-container" v-model="showModal" title="添加新地址" ok-text="保存" @on-ok="handleClickSaveAddress" @on-cancel="handleClickCloseModal">
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
							<li v-for="item in searchAddressList" @click="handleclickAddressList(item)">
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
		</div>
		<FooterComp></FooterComp>
	</div>
</template>
<script type="text/javascript">
	import TopBar from '../components/common/topbar.vue';
	import FooterComp from '../components/common/footer.vue';
  import time from '../components/directives/time';
	import {
	  getAvailableHongbaos,
    getOrderList,
    getOrderDetail,
    getReceivedAddresses,
    addAddress,
    deleteAddress,
    getAddressDetail,
    searchAddress,
    getExpiredHongbaos } from '../service/getData.js';

	export default {
		components: {
			TopBar,
			FooterComp,
		},
    directives: { time },
		data(){
			return {
				type: '',
				user: {},
				availableHongbaos: [],
				expiredHongbaos: [],
				orderList: [], //最近订单列表
        orderDetail: null, //查看详情的订单
        addressDetail: null, //通过id获取的地址详情
        remarks: null, //订单详情的备注
				addressList: [], //已有收货地址列表
				showModal: false,
				city: {}, //所在城市
				addressKeyword: '', //对应对话框位置
				searchAddressList: [], //对话框输入位置时显示的列表
				showAddressList: false, //是否显示对话框的地址搜索结果
				addressToDelete: {}, //点击删除的地址
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
			}
		},
		watch: {
			addressKeyword(newVal){
				this.handleSearchAddress();
			},
		},
		methods: {
			handleClickSidebar(type){
				this.type = type;
			},
			handleclickAddressList(address){
				this.addressInfo.geohash = address.geohash;
				this.addressInfo.address = address.name;
				this.showAddressList = false;
				this.addressKeyword = address.name;
			},
      async handleClickOrderDetail(id){
        await getOrderDetail(this.user.id, id).then( res => {
          this.orderDetail = res;
          console.log('orderDetail', res);
        });
        getAddressDetail(this.orderDetail._doc.address_id).then( res => {
          console.log('addressdetail ', res);
          this.addressDetail = res;
        });
			  this.type = 'order-detail';
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
					this.resetAddressInfo(); //重置addressInfo;
				});
			},
			handleSearchAddress(){
				searchAddress(this.city.id, this.addressKeyword, 'nearby').then( res => {
					this.searchAddressList = res;
					if (this.addressKeyword !== this.addressInfo.address) this.showAddressList = true;
				});
			},
			handleClickCloseModal(){
				this.resetAddressInfo();
			},
			resetAddressInfo(){
				//防止修改地址时点击取消，addressInfo仍保留其信息
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
				this.updateAddressList();
			},
			updateAddressList(){
				getReceivedAddresses(this.user.user_id).then( res => {
					this.addressList = res;
					console.log('completed updating');
				});
			},
			handleModifyAddress(address){
				this.addressInfo = address;
				this.showModal = true;
				this.addressKeyword = address.address;
			},
			handleConfirmDeleteAddress(address){
				deleteAddress(address.user_id, address.id).then( res => {
					console.log('delete result ', res);
				});
				this.updateAddressList();
			},
      getOrderFoodList(order){
			  if (!order) return;
			  let foodList = order.basket.group[0];
			  let s = [];
			  for (let food of foodList){
			    s.push(food.name);
        }
        return s.join(' / ');
      },
		},
		created(){
			this.city = this.$store.state.city;
			this.user = this.$store.state.user;
			getAvailableHongbaos(this.user.user_id).then( res => {
				this.availableHongbaos = res;
			});
			getOrderList(this.user.user_id).then( res => {
			  console.log('orderList ', res);
				this.orderList = res;
			});
			getExpiredHongbaos(this.user.user_id).then( res => {
				this.expiredHongbaos = res;
			});
			this.updateAddressList();
      let path = this.$route.path;
      let arr = path.split('/');
      if (arr.length === 3) this.type = 'center';
		},
	}
</script>
<style type="text/scss" lang="scss" scoped>
	@import '../style/mixin';

	.profile-container{
		@include wh(100%);
	}
	.profile-content-container{
		width: 1180px;
		overflow: auto;
		margin: 0 auto;
	}
	.profile-sidebar{
		float: left;
		margin-top: 20px;
		width: 170px;
		list-style: none;
		&-section{
			margin-bottom: 32px;
			&-title{
				margin-bottom: 8px;
				@include fontscw(18px, #333, 700);
				>a{
					color: #333;
				}
			}
			&-title.active{
				>a{
					color: #0089dc;
				}
			}
			>ul{
				list-style: none;
				>li{
					padding: 4px 0;
					margin: 0;
					font-size: 14px;
					cursor: pointer;
				}
				>li.active{
					color: #0089dc;
				}
			}
		}
	}
	.profile-pannel{
		margin-left: 170px;
		width: 1010px;
		&-center-container{
			margin: 20px 0;
			border: 1px solid #eee;
			background-color: #fff;
			padding: 30px 0;
			width: 100%;
		}
	}
	.profile-info{
		display: flex;
		justify-content: center;
		width: 100%;
		&-item{
			flex-grow: 1;
			border-right: 1px solid #eee;
			align-self: center;
			.profile-avatar-wrap{
				display: inline-block;
				margin-right: 20px;
				cursor: pointer;
				border-radius: 50%;
				overflow: hidden;
				@include wh(112px);
				>img{
					@include wh(112px);
				}
			}
			.profile-personal-data{
				display: inline-block;
				align-self: center;
			}
			>p:first-child{
				font-size: 14px;
				text-align: center;
			}
			>p:last-child{
				@include fontscw(12px, #fc463f, 600);
				height: 60px;
				line-height: 60px;
				text-align: center;
				>span{
					font-size: 30px;
				}
			}
		}
		&-item:first-child{
			display: flex;
			justify-content: flex-start;
			padding-left: 30px;
			text-align: left;
		}
	}
	.profile-order-container{
		padding: 20px 20px 0;
		margin-bottom: 20px;
		border: 1px solid #eee;
		background-color: #fff;
		.order-tab{
			border-bottom: 2px solid #f4f4f4;
			>a:first-child{
				@include fontscw(16px, #666, 700);
				border-bottom: 3px solid #0089dc;
				padding: 0 10px 5px 10px;
			}
			>a:last-child{
				@include fontscw(12px, #666);
				float: right;
			}
			>a:last-child:hover{
				color: #0089dc;
			}
		}
		.order-content{
			height: 324px;
			&-tip{
				padding-top: 90px;
				text-align: center;
				>p{
					@include fontscw(14px, #999);
					>a{
						padding: 0 5px;
					}
				}
			}
		}
	}
	.order-pannel-container{
		margin: 20px 0;
		border: 1px solid #eee;
		background-color: #fff;
		padding: 20px 18px;
		width: 100%;
		min-height: 680px;
		>h3{
			border-bottom: 2px solid #f4f4f4;
			padding: 0 20px 11px;
			@include fontscw(18px, #000, 700);
		}
		.order-pannel-content{
			display: inline-block;
			width: 100%;
			.no-order{
				padding-top: 50px;
				text-align: center;
				font-size: 14px;
			}
      .order-table{
        width: 100%;
        word-break: break-all;
        word-wrap: break-word;
        border-collapse: collapse;
        border-spacing: 0;
        display: table;
        border-color: grey;
        >thead{
          display: table-header-group;
          vertical-align: middle;
          >tr{
            height: 10px;
            line-height: 30px;
            background-color: #eee;
            >th{
              text-align: center;
              line-height: 30px;
              @include fontscw(12px, #333, 400);
            }
            .table-title-info{
              padding-left: 26px;
              text-align: left;
            }
          }
        }
        >tbody{
          >tr:first-child{
            height: 10px;
          }
          .table-item{
            >td{
              padding-top: 30px;
              padding-bottom: 30px;
              text-align: center;
              font-size: 12px;
            }
            .table-item-time{
              text-align: right;
              padding-right: 18px;
              width: 8%;
              color: #999;
              border-right: 1px solid #eee;
            }
            .table-item-clock{
              .item-clock-icon{
                position: relative;
                left: -7.5px;
              }
            }
            .table-item-avatar{
              padding-left: 37px;
              padding-right: 16px;
              width: 70px;
              img{
                @include wh(70px);
                border-radius: 50%;
              }
            }
            .table-item-info{
              text-align: left;
              border-bottom: 1px #eee dashed;
              color: #999;
              >p{
                >a{
                  color: #999;
                }
              }
              .item-info-food{
                >a{
                  .item-info-food-list{
                    vertical-align: middle;
                    max-width: 300px;
                    display: inline-block;
                    @include ellipsis;
                  }
                  .item-info-food-num{
                    @include fontscw(normal, #666, 700);
                  }
                }
              }
            }
            .table-item-amount{
              width: 13%;
              border-bottom: 1px #eee dashed;
              color: #999;
              >h3{
                @include fontscw(16px, #333, 700);
                margin-bottom: 5px;
              }
            }
            .table-item-status{
              width: 13%;
              border-bottom: 1px #eee dashed;
              color: #999;
              >h3{
                @include fontscw(16px, #f74342, 400);
                margin-bottom: 5px;
              }
            }
            .table-item-action{
              width: 13%;
              border-bottom: 1px #eee dashed;
              color: #999;
              >a{
                display: inline-block;
                width: 78px;
                line-height: 24px;
                margin: 5px 0;
                color: #333;
              }
            }
          }
        }
      }
		}
	}
	.profile-pannel-container{
		margin: 20px 0;
		border: 1px solid #eee;
		background-color: #fff;
		padding: 20px 18px;
		width: 100%;
		min-height: 680px;
		>h3{
			border-bottom: 2px solid #f4f4f4;
			padding: 0 20px 11px;
			@include fontscw(18px, #000, 700);
		}
		.profile-pannel-content{
			display: inline-block;
			width: 100%;
			.profile-detail-info{
				margin-top: 39px;
				margin-left: 42px;
				font-size: 14px;
				>p:first-child{
					margin-bottom: 20px;
					>span:first-child{
						display: inline-block;
						vertical-align: middle;
						margin-right: 15px;
						width: 60px;
						text-align: right;
					}
					>span:last-child{
						vertical-align: top;
						display: inline-block;
						margin-bottom: 12px;
						@include wh(100px);
						>img{
							width: 100%;
						}
					}
				}
				>p:last-child{
					margin-bottom: 20px;
					>span:first-child{
						display: inline-block;
						vertical-align: middle;
						margin-right: 15px;
						width: 60px;
						text-align: right;
					}
				}
			}
		}
	}
	.address-pannel-container{
		margin: 20px 0;
		border: 1px solid #eee;
		background-color: #fff;
		padding: 20px 18px;
		width: 100%;
		min-height: 680px;
		>h3{
			border-bottom: 2px solid #f4f4f4;
			padding: 0 20px 11px;
			@include fontscw(18px, #000, 700);
		}
		.address-pannel-content{
			width: 100%;
			.address-detail-info{
				margin-right: -33px;
				padding-top: 15px;
				.address-detail-item{
					position: relative;
					@include wh(300px, 110px);
					margin-right: 33px;
					display: inline-block;
					padding: 16px 12px 16px 20px;
					margin-bottom: 15px;
					border: 1px solid #ddd;
					font-size: 14px;
					.address-detail-item-top{
						margin-bottom: 10px;
						>div{
							display: inline-block;
							float: right;
							color: #bbb;
							font-size: 12px;
							>span{
								display: inline-block;
								width: 30px;
								cursor: pointer;
							}
							>span:hover{
								color: #0089dc;
							}
						}
					}
					.address-detail-item-bottom{
						>p{
							@include ellipsis;
						}
					}
					.address-detail-item-delete-confirm{
						display: none;
					}
					.address-detail-item-delete-confirm.active{
						display: block;
						position: absolute;
						left: 0;
						top: 0;
						@include wh(100%);
						text-align: center;
						font-size: 14px;
						padding-top: 23px;
						background: #808080;
						opacity: 0.9;
						>p{
							vertical-align: top;
							@include fontscw(14px, #fff);
							line-height: 26px;
							text-align: center;
						}
						>button{
							cursor: pointer;
							border: 0;
							border-radius: 2px;
							margin-top: 5px;
							@include wh(60px, 24px);
							padding: 0 10px;
							line-height: 24px;
						}
						.confirm-delete{
							background: #0089dc;
							color: #fff;
						}
						.cancel-delete{
							margin-left: 10px;
							background: #fff;
						}
					}
				}
				.address-detail-item:hover{
					border-color: #0089dc;
				}
				>button{
					display: inline-block;
					vertical-align: top;
					padding: 0;
					text-align: center;
					background: #fcfcfc;
					cursor: pointer;
					@include wh(300px, 110px);
					margin-right: 33px;
					margin-bottom: 15px;
					border: 1px solid #ddd;
					@include fontscw(14px, #999);
				}
				>button:hover{
					border-color: #0089dc;
					color: #0089dc;
				}
			}
		}
	}
  .order-detail-pannel-container{
    margin: 20px 0;
    border: 1px solid #eee;
    background-color: #fff;
    padding: 20px 18px;
    width: 100%;
    >h3{
      border-bottom: 2px solid #f4f4f4;
      padding: 0 20px 11px;
      @include fontscw(18px, #000, 700);
    }
    .order-detail-pannel-content{
      background-color: #f8f8f8;
      .order-detail-title{
        padding: 18px 30px 16px;
        border-bottom: 1px solid #eee;
        >img{
          @include wh(44px);
          margin-right: 12px;
        }
        .order-detail-rest{
          display: inline-block;
          height: 44px;
          vertical-align: top;
          >h3{
            @include fontscw(16px, #333, 400);
          }
          >div{
            font-size: 14px;
            color: #999;
            >span:first-child{
              padding-right: 50px;
              max-width: 250px;
              @include ellipsis;
            }
          }
        }
      }
      .order-detail-content{
        width: 100%;
        overflow: hidden;
        .order-detail-content-left{
          border-right: 1px solid #999000;
          float: left;
          padding: 12px 30px 10px;
          width: 52%;
          >table{
            border-collapse: collapse;
            width: 100%;
            >thead{
              th{
                padding-bottom: 10px;
                border-bottom: 1px solid #eee;
                @include fontscw(14px, #666, 700);
              }
              th:first-child{
                text-align: left;
              }
              th:last-child{
                text-align: right;
              }
            }
            >tbody{
              td{
                padding-top: 24px;
                @include fontscw(14px, #666);
                text-align: center;
                >span{
                  @include fontscw(26px, #f74342, 700);
                }
              }
              td:first-child{
                text-align: left;
              }
              td:last-child{
                text-align: right;
              }
            }
          }
        }
        .order-detail-content-right{
          display: inline-block;
          width: 48%;
          height: 100%;
          padding: 12px 30px 10px;
          >h3{
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .deliver-info-item{
            padding: 10px 0;
            font-size: 14px;
          }
          .deliver-address{
            border-top: 1px solid #eee;
            .deliver-address-item{
              padding: 10px 0;
              font-size: 14px;
              >span{
                display: inline-block;
                min-width: 70px;
              }
            }
          }
        }
      }
    }
  }
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
