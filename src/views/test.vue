<template>
	<div class="test">
		<div class="svg">
			<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="190" class="polygon-1">
			   <polygon points="10,60 190,60 40,180 100,10 160,180"
			   		style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;"/>
			   <polygon points="0,0 100,30 50,80"/>
			</svg>
			<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" version="1.1" class="polygon-2">
				<polygon points="0,0 100,30 50,80"/>
				<svg class="arrow_right">
	                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
	            </svg>
			</svg>
		</div>
		<div class="api-test">
			<img src="#">
		</div>
		<div class="rating_container">
			<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="grey_fill">
			   <polygon points="10,60 190,60 40,180 100,10 160,180"
			   		style="fill:lime;stroke:purple;stroke-width:5;fill-rule:evenodd;"/>
			   <polygon points="0,0 100,30 50,80"/>
			</svg>
	    </div>
	</div>
</template>
<script type="text/javascript">
	export default {}
</script>
<style type="text/css" scoped>
	.test{
		width: 100%;
		height: 100%;
	}
	.polygon-1{
		background: green;
	}
	.polygon-2{
		background: purple;
	}
	.arrow_right{
		width: 200px;
		height: 200px;
	}
	.rating_container{
		height: 200px;
		width: 500px;
		border: 1px solid #333;
	}
	.star_container{
		position: relative;
		top: 20px;
		left: 20px;
		width: 52px;
		height: 11px;
		border: 1px solid #333;
	}
</style>