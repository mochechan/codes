/*
http://stackoverflow.com/questions/6968448/where-is-body-in-a-nodejs-http-get-response
*/
var http = require('http');
var url = require('url');

exports.http_client_post = function(){
	var options = {
  	host: 'www.google.com',
	  port: 80,
  	path: '/upload',
	  method: 'POST'
	};

	console.log("in http_post ");
	console.log(arguments);

	if (!arguments[0]) {
		console.log("no any input");
		return;
	}

	var req = http.request(options, function(res) {
	  console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
	  });
	});

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});

	// write data to request body
	req.write('data\n');
	req.write('data\n');
	req.end();

};


//input: {options:{}, url: ""}
exports.http_client_get = function () {
	//console.log("in http_post, [0].args ");
	//console.log(arguments[0].args);
	var args = arguments[0].args;

	var options = {
  	host: 'www.google.com',
	  port: 80,
  	path: '/index.html'
	};
	if (typeof(args) === 'string') {
		console.log("a");
		options = (url.parse(args));
	} else if (typeof(args.url) === 'string') {
		console.log("b");
		options = (url.parse(args.url));
	}
	console.log("options:");
	console.log(options);

	http.get(options, function(res) {
  	console.log("Got response: " + res.statusCode);

	  res.on("data", function(chunk) {
  	  console.log("BODY: " + chunk);
	  });
	}).on('error', function(e) {
  	console.log("Got error: " + e.message);
	});
};


