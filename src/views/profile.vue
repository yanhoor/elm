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
									<span class="profile-info-item-number">{{ hongbaoCount }}</span>
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
	import { getAvailableHongbaos, getOrderList, getReceivedAddresses, addAddress, deleteAddress, searchAddress } from '../service/getData.js';

	export default {
		components: {
			TopBar,
			FooterComp,
		},
		data(){
			return {
				type: '',
				user: {},
				hongbaos: [],
				orderList: [], //最近订单列表
				addressList: [], //已有地址列表
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
		computed: {
			hongbaoCount(){
				let count = 0;
				for(let item of this.hongbaos){
					let endDate = new Date(Date.parse(item.end_date)).getTime();
					let nowDate = new Date().getTime();
					if (nowDate <= endDate) count ++;
				}
				return count;
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
			handleClickSaveAddress(){
				if (this.addressInfo.id) {
					this.addressInfo.geohash = this.addressInfo.st_geohash;
					deleteAddress(this.addressInfo.user_id, this.addressInfo.id).then( res => {
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
		},
		created(){
			this.city = this.$store.state.city;
			this.user = this.$store.state.user;
			getAvailableHongbaos(this.user.user_id).then( res => {
				this.hongbaos = res;
			});
			getOrderList(this.user.user_id).then( res => {
				this.orderList = res;
			});
			this.updateAddressList();
		},
		mounted(){
			let path = this.$route.path;
			let arr = path.split('/');
			if (arr.length === 3) this.type = 'center';
		},
	}
</script>
<style type="text/css" lang="scss" scoped>
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