<template>
	<transition-group tag="div" @before-enter='beforeEnter' @enter='enter' @after-enter='afterEnter'>
	    <div class="ball" v-for="(item, index) in balls" :key="index" v-show="item.show">
	      <div class="inner inner-hook"></div>
	    </div>
	  </transition-group>
</template>
<script type="text/javascript">
	export default {
		data(){
			return{
				balls: [
					{show: false},
					{show: false},
					{show: false},
					{show: false},
					{show: false},
					{show: false},
					{show: false},
					{show: false},
				],
				dropBalls: [],
			}
		},
		methods: {
			drop(target){
				//return取出一个小球
				this.balls.some(ball => {
					if(!ball.show){
						ball.show = true;
						ball.el = target;
						ball.rect = target.getBoundingClientRect();
						this.dropBalls.push(ball);
						return true;
					}
				});
			},
			beforeEnter(el){
				let count = this.balls.length;
				while(count--){
					let ball = this.balls[count];
					if (ball.show) {
						let x = ball.rect.left - 40;
						let y = -(window.innerHeight - ball.rect.top - 40);
						el.style.display = '';
						el.style.transform = `translate3d(0, ${y}px, 0)`;
						// 处理内层动画
			            let inner = el.getElementsByClassName('inner-hook')[0]; // 使用inner-hook类来单纯被js操作
			            //inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
			            inner.style.transform = `translate3d(${x}px, 0, 0)`;
					}
				}
			},
			enter (el, done) {
		        let rf = el.offsetHeight; // 手动触发重绘html
		        this.$nextTick(() => {
		          // 让动画效果异步执行,提高性能
		          //el.style.webkitTransform = 'translate3d(0, 0, 0)';
		          el.style.transform = 'translate3d(0, 0, 0)';
		          // 处理内层动画
		          let inner = el.getElementsByClassName('inner-hook')[0];
		          //inner.style.webkitTransform = 'translate3d(0, 0, 0)';
		          let endX = window.innerWidth - 380;
		          inner.style.transform = `translate3d(${endX}px, 0, 0)`;//小球终点坐标
		          el.addEventListener('transitionend', done); // Vue为了知道过渡的完成，必须设置相应的事件监听器。
		        });
			},
		    afterEnter (el) {
		        let ball = this.dropBalls.shift(); // 完成一次动画就删除一个dropBalls的小球
		        if (ball) {
		          ball.show = false;
		          el.style.display = 'none'; // 隐藏小球
		        }
		    },
		},
	}
</script>
<style lang="scss" type="text/scss" scoped>
	@import '../../style/mixin';
	.ball{
		position: fixed;
		left: 48px;
		bottom: 20px;
		z-index: 1000;
		&.v-enter-active{
			transition: all 1s cubic-bezier(.57, -0.86, .93, .84);
		}
		.inner{
			z-index: 1000;
			@include wh(16px);
			border-radius: 50%;
			background: #0089dc;
			transition: all 1s linear;
		}
	}
</style>
