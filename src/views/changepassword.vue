<template>
	<div class="change-password">
		<div class="change-password-container">
			<form>
				<section class="account-section">
					<input type="text" placeholder="手机/邮箱/用户名">
				</section>
				<section class="password-section">
					<input type="password" placeholder="旧密码">
				</section>
				<section class="password-section">
					<input type="password" placeholder="新密码">
				</section>
				<section class="password-section">
					<input type="password" placeholder="确认密码">
				</section>
				<button class="change-password-btn">修改</button>
			</form>
		</div>
	</div>
</template>
<script type="text/javascript">
	export default{}
</script>
<style type="text/css" scoped>
	.change-password{
		height: 100%;
		width: 100%;
	}
	.change-password-container{
		position: relative;
		top: 200px;
		width: 20%;
		margin: 0 auto;
	}
	.change-password-container section{
		height: 48px;
		margin-top: 16px;
	}
	.change-password-container section>input{
		width: 100%;
		height: 100%;
		padding-left: 10px;
		border: 1px solid #ddd;
		border-radius: 4px;
	}
	.change-password-container button{
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