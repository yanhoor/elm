import axios from 'axios';

export default async(url = '', data = {}, type = 'get') => {
	let ajax = axios.create();
	ajax.interceptors.response.use(res => {
		return res.data;
	});

	let config = {};
	if (type === 'get') {
		config = {
			baseURL: '',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			withCredentials:true,
			url: url,
			params: data,
			method: type,
		};
	}
	if (type === 'post') {
		config = {
			baseURL: '',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			withCredentials:true,
			url: url,
			method: type,
		};
		Object.defineProperty(config, 'body', {
			value: JSON.stringify(data)
		});
		console.log('axios config object is ', config);
	}

	try{
		const response = await ajax(config);
		return response;
	}catch(error){
		throw new Error(error);
	}
}