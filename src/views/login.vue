<template>
	<div class="login">
		<div class="login-container">
      <h2>注：使用饿了么真实账号登录，或使用测试账号：13680325065，密码：123456</h2>
			<form method="post">
				<section class="account-section">
					<input type="text" placeholder="手机号" v-model="username">
				</section>
				<section class="password-section">
					<input type="password" placeholder="密码" v-model="password">
				</section>
				<section class="verify-code-section">
					<input type="text" placeholder="验证码" v-model="verifyCode">
				</section>
				<section class="verify-code-section">
					<img :src="imgUrl">
					<span @click="getVerifyCode">看不清，换一张</span>
				</section>
				<button
					@click.prevent="handleLogin"
					class="login-btn">登录</button>
				<button @click.prevent="handleChangePassword">修改密码</button>
			</form>
		</div>
		<Modal
      v-model="showModal"
      title="修改密码"
      @on-ok="handleConfirmChangePassword"
      @on-cancel="handleCancelChangePassword">
        <div class="modal-form-item">
          <label>用户名</label>
          <input placeholder="输入手机号" v-model="passwordInfo.username">
        </div>
        <div class="modal-form-item">
          <label>旧密码</label>
          <input type="password" placeholder="输入旧密码" v-model="passwordInfo.oldpassWord">
        </div>
        <div class="modal-form-item">
          <label>新密码</label>
          <input type="password" placeholder="输入新密码" v-model="passwordInfo.newpassword">
        </div>
        <div class="modal-form-item">
          <label>确认</label>
          <input type="password" placeholder="再次输入新密码" v-model="passwordInfo.confirmpassword">
        </div>
        <div class="modal-form-item">
          <label>验证码</label>
          <input placeholder="输入验证码" v-model="passwordInfo.captcha_code">
        </div>
        <div class="modal-form-verify">
          <img :src="imgUrl">
          <span @click="getVerifyCode">看不清，换一张</span>
        </div>
		</Modal>
	</div>
</template>
<script type="text/javascript">
	import { getCaptchas, login, changePassword } from '../service/getData.js';

	export default{
		data(){
			return{
				username: '',
				password: '',
				verifyCode: '',
				imgUrl: '',
				address: {},
				showModal: false,
				passwordInfo: {
					username: '',
					oldpassWord: '',
					newpassword: '',
					confirmpassword: '',
					captcha_code: ''
				},
			}
		},
		methods: {
			getVerifyCode(){
				getCaptchas().then( res => {
					this.imgUrl = res.code;
				});
			},
			handleLogin(){
				login(this.username, this.password, this.verifyCode).then( res => {
					this.$store.commit('saveUserInfo', res);
					console.log('login ', res);
					if (res.id) {
						if (this.address.geohash) {
							this.$router.push('/list');
						}else{
							this.$router.push('/home');
						}
					}
				});
			},
      handleChangePassword(){
        this.showModal = true;
        this.getVerifyCode();
      },
      handleCancelChangePassword(){
			  this.passwordInfo = {
          username: '',
          oldpassWord: '',
          newpassword: '',
          confirmpassword: '',
          captcha_code: ''
        };
			  this.getVerifyCode();
      },
			handleConfirmChangePassword(){
				let { username, oldpassWord, newpassword, confirmpassword, captcha_code } = this.passwordInfo;
				changePassword(username, oldpassWord, newpassword, confirmpassword, captcha_code).then( res => {
					//console.log('changepassword ', res);
					this.getVerifyCode();
				});
			},
		},
		created(){
			this.address = this.$store.state.address;
		},
		mounted(){
			this.getVerifyCode();
		}
	}
</script>
<style lang="scss" type="text/scss" scoped>
	@import '../style/mixin';

	.login{
		height: 100%;
		width: 100%;
	}
	.login-container{
		position: relative;
		top: 100px;
		width: 20%;
		margin: 0 auto;
	}
	.login-container section{
		height: 48px;
		margin-top: 16px;
	}
	.login-container section>input{
		width: 100%;
		height: 100%;
		padding-left: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.verify-code-section>span{
		float: right;
		height: 100%;
		line-height: 48px;
		display: inline-block;
		margin-left: 10px;
		color: #008de1;
		cursor: pointer;
	}
	.verify-code-section>img{
		display: inline-block;
		height: 100%;
	}
	.login-container button{
		display: block;
		height: 42px;
		width: 100%;
		margin-top: 30px;
		border: none;
		border-radius: 4px;
		background: #4cd96f;
		color: #fff;
		cursor: pointer;
		text-align: center;
		font-size: 16px;
		line-height: 42px;
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
	}
	.modal-form-verify{
		position: relative;
		padding-bottom: 25px;
		padding-left: 50px;
		font-size: 14px;
		overflow: hidden;
		>img{
			float: left;
			display: inline-block;
			@include wh(65px, 38px);
			margin-right: 20px;
		}
		>span{
			font-size: 12px;
		}
		>span:hover{
			color: #0089dc;
			cursor: pointer;
		}
	}
</style>
