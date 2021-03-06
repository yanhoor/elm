import { signout } from '../../service/getData.js';

export const getImgPath = {
	methods: {
		//传递过来的图片地址需要处理后才能正常使用
		getImgPath(path) {
			let suffix;
			if (!path) {
				return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
			}
			if (path.indexOf('jpeg') !== -1) {
				suffix = '.jpeg'
			} else {
				suffix = '.png'
			}
			let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix;
			//console.log('imgPath is ', 'https://fuss10.elemecdn.com' + url);
			return 'https://fuss10.elemecdn.com' + url
		},
	}

};
//顶栏用户名操作
export const handleClickDropbox = {
  methods: {
    handleClickDropbox(type){
      switch(type){
        case 'center':
          this.$router.push('/profile/center');
          break;
        case 'favorite':
          break;
        case 'address':
          this.$router.push('/profile/address');
          break;
        case 'logout':
          signout().then( res => {
            this.$store.commit('signout');
            this.$router.push('/login');
          });
          break;
      }
    }
  },
};
//购物车菜品数量加减
export const updateCount = {
  methods: {
    updateCount(restaurantId, food_id, value){
      if (value < 1) {
        this.$store.commit('removeFromCart', {
          food_id,
          rest_id: restaurantId
        });
      }
      this.$store.commit('updateCount', {
        food_id,
        value,
        rest_id: restaurantId
      });
    },
  },
};
