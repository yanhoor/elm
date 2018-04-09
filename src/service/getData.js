import axios from '../config/axios.js';

//1. 获取城市列表
export const guessCity = () => axios('/v1/cities', {type: 'guess'});
export const hotCities = () => axios('/v1/cities', {type: 'hot'});
export const groupCities = () => axios('/v1/cities', {type: 'group'});
//2. 获取所选城市信息
export const getCityInfo = (id) => axios('/v1/cities/'+ id);
//3. 搜索地址
export const searchAddress = (city_id, keyword) => axios('/v1/pois',{
	keyword,
	city_id,
	type: 'search'
});
//4. 根据经纬度详细定位
export const getLocation = (geohash) => axios('/v2/pois/'+ geohash);
//5. 食品分类列表
export const getFoodCategory = () => axios('/v2/index_entry');
//6. 获取商铺列表
export const getRestaurants = (
		latitude,
		longitude,
		offset=0,
		limit=20,
		restaurant_category_id='',
		restaurant_category_ids='',
		order_by='',
		delivery_mode='',
		support_ids='') =>
	axios('/shopping/restaurants', {
		latitude,
		longitude,
		offset,
		limit,
		restaurant_category_id,
		restaurant_category_ids,
		order_by,
		delivery_mode,
		support_ids
	});
//7. 搜索餐馆(返回空值)
export const searchRestaurants = (geohash, keyword) => axios('/v4/restaurants', {
	geohash,
	keyword
});
//8. 获取所有商铺分类列表
export const getRestaurantCategory = (latitude = '', longitude = '') =>
	axios('/shopping/v2/restaurant/category',{
		latitude,
		longitude
	});
//9. 获取配送方式
export const getDeliveryMode = (latitude = '', longitude = '') =>
	axios('/shopping/v1/restaurants/delivery_modes', {
		latitude,
		longitude
	});
//10. 商家属性活动列表
export const getRestaurantActivityAttributes = (latitude = '', longitude = '') =>
	axios('/shopping/v1/restaurants/activity_attributes', {
		latitude,
		longitude
	});
//11. 餐馆详情
export const getRestaurantInfo = (restaurant_id) => axios('/shopping/restaurant/' + restaurant_id);
//16. 获取食物列表
export const getMenu = (restaurant_id) => axios('/shopping/v2/menu', {
	restaurant_id,
});
//17. 获取评价信息
export const getRestaurantRatings = ( restaurant_id, tag_name = '', offset = 0, limit = 0) =>
	axios('/ugc/v2/restaurants/'+ restaurant_id + '/ratings', {
		restaurant_id, tag_name, offset, limit
	});
//18. 获取评价分数
export const getRestaurantRatingScores = (restaurant_id) =>
	axios('/ugc/v2/restaurants/'+ restaurant_id + '/ratings/scores');
//19. 获取评价分类
export const getRestaurantRatingTags = (restaurant_id) =>
	axios('/ugc/v2/restaurants/'+ restaurant_id + '/ratings/tags');
//20. 加入购物车
export const addToCart = (restaurant_id, geohash, entities) => axios('/v1/carts/checkout', {
	restaurant_id, geohash, entities
}, 'post');
//21. 获取备注信息
export const getRemarks = (cart_id) => axios('/v1/carts/:cart_id/remarks', {
	cart_id
});
//22. 获取收货地址列表
export const getReceivedAddresses = (user_id) => axios('/v1/users/:user_id/addresses', {
	user_id
});
//23. 获取验证码
export const getCaptchas = () => axios('/v1/captchas', {}, 'post');
//24. 获取用户信息
export const getUserInfo = () => axios('/v1/user');
//25. 登录
export const login = (username, password, captcha_code) => axios('/v2/login', {
	username, password, captcha_code
}, 'post');
//26. 退出
export const signout = () => axios('/v2/signout');
//27. 修改密码
export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) =>
	axios('/v2/changepassword', {
		username, oldpassWord, newpassword, confirmpassword, captcha_code
	}, 'post');
//28. 增加收货地址
export const addAddress = (
		user_id,
		address,
		address_detail,
		geohash,
		name,
		phone,
		tag,
		sex,
		phone_bk,
		tag_type,
		poi_type) =>
	axios('/v1/users/' + user_id + '/addresses', {
		user_id,
		address,
		address_detail,
		geohash,
		name,
		phone,
		tag,
		sex,
		phone_bk,
		tag_type,
		poi_type
	}, 'post');
//29. 删除收货地址
export const deleteAddress = ( user_id, address_id) =>
	axios('/v1/users/' + user_id + '/addresses/'+ address_id, {
		user_id, address_id
	}, 'DELETE');
//30. 下单
export const postOrder = ( user_id, cart_id, address_id, restaurant_id, entities, geohash, desctiption) =>
	axios('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
		user_id, cart_id, restaurant_id, entities, geohash, desctiption
	}, 'post');
//31. 订单列表
export const getOrderList = (user_id) => axios('/bos/v2/users/' + user_id + '/orders',
	{ user_id });
//32. 订单详情
export const getOrderDetail = ( user_id, order_id ) =>
	axios('/bos/v1/users/' + user_id + '/orders/' + order_id + '/snapshot', {
		user_id, order_id
	});
//33. 服务中心
export const getServiceExplain = () => axios('/v3/profile/explain');
//34. 可用红包
export const getAvailableHongbaos = (user_id) => axios('/promotion/v2/users/' + user_id + '/hongbaos',{
	user_id
});
//35. 过期红包
export const getExpiredHongbaos = ( user_id ) => axios('/promotion/v2/users/' + user_id + '/expired_hongbaos', {
	user_id
});
//36. 兑换红包
export const exchangeHongbao = (user_id, exchange_code, captcha_code) =>
	axios('/v1/users/' + user_id + '/hongbao/exchange', {
		user_id, exchange_code, captcha_code
	}, 'post');
//48. 获取店铺食品种类
export const getRestaurantFoodCategory = (restaurant_id) =>
	axios('/shopping/getcategory/' + restaurant_id, {
		restaurant_id
	});
//52. 获取食品列表
export const getFoodList = (limit, offset, restaurant_id) =>
	axios('/shopping/v2/foods', {
		limit, offset, restaurant_id
	});
//54. 获取食品种类详情
export const getFoodCategoryDetail = (category_id) => axios('/shopping/v2/menu/' + category_id, {
	category_id
});
//59. 获取地址信息
export const getAddressDetail = (address_id) => axios('/v1/addresse/' + address_id, {
	address_id
});