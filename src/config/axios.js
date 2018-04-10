import axios from 'axios';
import { baseUrl } from './env.js';

export default async(url = '', data = {}, type = 'get') => {
	let ajax = axios.create({
		baseURL: 'http://127.0.0.1:8080/',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});
	ajax.interceptors.response.use(res => {
		return res.data;
	});
	try{
		const response = await ajax({
			url: url,
			params: data,
			method: type,
		});
		return response;
	}catch(error){
		throw new Error(error);
	}
}