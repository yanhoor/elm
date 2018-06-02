<template>
	<div class="rest">
		<router-link :to="'/restaurant/' + restaurant.id"
			class="rest-main">
				<div class="left-container">
					<img :src="'img/' + restaurant.image_path">
					<span>{{restaurant.order_lead_time}}</span>
				</div>
				<div class="right-container">
					<span class="rest-title">{{restaurant.name}}</span>
					<div class="rating-star-container">
						<Rate :value="restaurant.rating" disabled allow-half></Rate>
					</div>
					<span class="deliver-cost">{{ restaurant.piecewise_agent_fee.tips }}</span>
					<div class="support-container">
						<span
							v-for="icon in restaurant.supports"
							class="support-icon"
							:style="{color: '#' + icon.icon_color}">
								{{ icon.icon_name }}
						</span>
					</div>
				</div>
		</router-link>
	</div>
</template>

<script type="text/javascript">
	import { getImgPath } from './mixin.js';
	import StarRating from 'vue-star-rating';

	export default{
		props: {
			restaurant: Object
		},
		mixins: [getImgPath],
	}
</script>

<style lang="scss" type="text/scss" scoped>
	@import '../../style/mixin';
	.rest{
		line-height: 30px;
		margin: 8px;
		padding: 8px;
		border-radius: 5px;
		background: #fff;
		border: 1px solid #dddee1;
	}
	.rest:hover{
		background: #dddee1;
	}
	.rest-main{
		color: #333;
		display: flex;
		text-align: center;
		position: relative;
	}
	.left-container{
		float: left;
		flex: 1;
		>img{
			@include wh(100px);
		}
		>span{
			display: block;
			color: #999;
			line-height: 20px;
		}
	}
	.right-container{
		flex: 2;
		padding-left: 15px;
	}
	.rest-title{
		display: block;
		max-width: 160px;
		text-align: left;
		@include fontscw(16px, #000, bold);
		@include ellipsis;
	}
	.rating-star-container{
		overflow: hidden;
		>div{
			font-size: 12px;
			float: left;
		}
	}
	.deliver-cost{
		display: block;
		text-align: left;
		line-height: 20px;
		padding: 10px 0;
		color: #999;
	}
	.support-container{
		text-align: left;
	}
	.support-icon{
		display: inline-block;
		@include wh(20px);
		border: 1px solid #333;
		line-height: normal;
		text-align: center;
		margin-right: 3px;
		font-weight: bold;
	}
</style>
