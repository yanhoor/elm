export const getImgPath = {
	methods: {
		//传递过来的图片地址需要处理后才能正常使用
		getImgPath(path) {
			return '/img' + '/' + path;
		},
	}

}