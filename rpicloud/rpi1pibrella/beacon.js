var http = require('http');

function http_post(arg, cb){
	var req = http.request({
  	hostname: arg.hostname || 'kay.dlinkddns.com',
	  port: arg.port || 9999,
  	path: arg.path || '/restifypost',
	  method: 'POST',
  	headers: {
      'Content-Type': 'application/json',
	  }
	}, function(res) {
		//console.log(arguments);
	  //console.log('Status: ' + res.statusCode);
  	//console.log('Headers: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
  	res.on('data', function (body) {
    	console.log('Body: ' + body);
			cb(body);
	  });
	}).on('error', function(e) {
  	console.log('problem with request: ' + e.message);
	});  

	req.write(JSON.stringify(arg.data) || '{"string": "Hello, World"}');
	req.end(()=>{
		//console.log("callback arguments");
		//console.log(arguments);
	});
};

http_post({
	hostname: 'kay.dlinkddns.com',
	port: 9999,
	path: '/restifypost',
	data: {STRING:"HW"},
}, ()=>{
	console.log("http_post callback");
	console.log(arguments);
});

//setInterval(() => {


//},1000);


/*
setInterval(() => {
	http.get({
		host: 'kay.dlinkddns.com',
		port: 9999,
		path: '/test/data',
	}, function(){
		console.log(arguments);
	});
},5000);
*/
