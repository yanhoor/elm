<template>
	<div class="main">
		<div class="info-bar">
			<div class="location">
				<span class="location-desc">当前位置：</span>
				<span class="location-current">岭南世家华景园</span>
				<span class="location-change">[切换地址]</span>
			</div>
			<div class="search">
				<Input
					class="search-input"
					placeholder="搜索商家,美食..."
					icon="ios-search-strong"
					size="large"></Input>
			</div>
		</div>
		<div class="category">
			<span class="category-desc">商家分类：</span>
			<div class="category-item-container">
				<a class="category-item-all">全部商家</a>
				<a class="category-item">商家A</a>
			</div>
		</div>
		<button @click="handleClick">获取数据</button>
	</div>
</template>
<script type="text/javascript">
	import {getCaptchas} from '../service/getData.js';
	export default{
		methods: {
			handleClick(){
				getCaptchas().then(res => {
					console.log(res.data);
				})
			}
		}
	}
</script>
<style type="text/css" scoped>
	.info-bar{
		width: 1180px;
		margin: 0 auto;
		height: 60px;
	}
	.location{
		width: 20%;
		float: left;
	}
	.location>span{
		line-height: 60px;
		font-size: 12px;
		display: inline-block;
		vertical-align: top;
	}
	.location-desc{
		color: #999999;
	}
	.location-current{
		max-width: 40%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		word-break: keep-all;
		cursor: pointer;
	}
	.location-change{
		color: #2d8cf0;
		cursor: pointer;
	}
	.search{
		float: right;
		line-height: 60px;
	}
	.category{
		width: 1180px;
		padding: 10px;
		margin: 0 auto;
		background: #fff;
		border-radius: 6px;
		box-shadow: 2px 2px 1px rgba(0,0,0,.2);
	}
	.category-desc{
		float: left;
		font-size: 16px;
		color: #999;
		line-height: 36px;
	}
	.category-item-all{
		background: #f6f6f6;
		color: #666;
		font-size: 16px;
		padding: 0 16px;
		line-height: 36px;
	}
	.category-item{
		color: #666;
		font-size: 16px;
	}
</style>