import axios from 'axios';

export let axios1 = async(url = '', data = {}, type = 'get') => {
	let ajax = axios.create();
	ajax.interceptors.response.use(res => {
		return res.data;
	});

	let config = {};
  config = {
    baseURL: '',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    withCredentials:true,
    url,
    params: data,
    method: type,
  };
	if (type === 'post') {
		config = {
			//baseURL: '',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			withCredentials:true,
			url,
			method: type,
			data,
		};
		//console.log('axios config object is ', config);
	}

	try{
		const response = await ajax(config);
		return response;
	}catch(error){
		throw new Error(error);
	}
}

export let fetch = async(url = '', data = {}, type = 'GET', method = 'fetch') => {
	let baseUrl = 'http://cangdu.org:8001';
	type = type.toUpperCase();
	url = baseUrl + url;

	if (type == 'GET') {
		let dataStr = ''; //数据拼接字符串
		Object.keys(data).forEach(key => {
			dataStr += key + '=' + data[key] + '&';
		})

		if (dataStr !== '') {
			dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
			url = url + '?' + dataStr;
		}
	}

//如果有fetch框架，优先使用，否则用XMLHttpRequest
	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			credentials: 'include',
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: "cors",
			cache: "force-cache"
		}

		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			});
			console.log('fetch config object is ', requestConfig);
		}

		try {
			const response = await fetch(url, requestConfig);
			console.log('response ', response);
			const responseJson = await response.json();
			console.log('responseJson is ', responseJson);
			return responseJson
		} catch (error) {
			console.log('error ', error);
		}
	} else {
		return new Promise((resolve, reject) => {
			let requestObj;
			if (window.XMLHttpRequest) {
				requestObj = new XMLHttpRequest();
			} else {
				requestObj = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			requestObj.open(type, url, true);
			requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			requestObj.send(sendData);

			requestObj.onreadystatechange = () => {
				if (requestObj.readyState == 4) {
					if (requestObj.status == 200) {
						let obj = requestObj.response
						if (typeof obj !== 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(requestObj)
					}
				}
			}
		})
	}
}
