const http = require('http');
const request = require('request');

const hostname = '127.0.0.1';
const port = 8080;

const apiServer = http.createServer( (req, res) => {
	const url = 'http://cangdu.org:8001' + req.url;
	const options = {
		url: url
	};
	function callback(error, response, body){
		if (!error && response.statusCode === 200) {
			console.log('Querying from ' + url);
			console.log('res headers ', res.hetHeaders());
			res.setHeader('Content-Type', 'text/plain;charset=UTF-8');
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.end(body);
		}
	}
	request.get(options, callback);
});
apiServer.listen(port, hostname, () => {
	console.log(`接口代理运行在http://${hostname}:${port}/`);
});