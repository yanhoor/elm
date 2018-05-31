<template>
	<div class="login">
		<div class="login-container">
			<form method="post">
				<section class="account-section">
					<input type="text" placeholder="手机/邮箱/用户名" v-model="username">
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
			</form>
		</div>
	</div>
</template>
<script type="text/javascript">
	import { getCaptchas, login } from '../service/getData.js';

	export default{
		data(){
			return{
				username: '',
				password: '',
				verifyCode: '',
				imgUrl: ''
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
				});
			}
		},
		mounted(){
			this.getVerifyCode();
		}
	}
</script>
<style type="text/css" scoped>
	.login{
		height: 100%;
		width: 100%;
	}
	.login-container{
		position: relative;
		top: 200px;
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
</style>