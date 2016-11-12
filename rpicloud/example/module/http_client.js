/*
http://stackoverflow.com/questions/6968448/where-is-body-in-a-nodejs-http-get-response
*/
var http = R.node.http;

var options = {
  host: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST'
};

R.event.on("http_post", function(){

	console.log("http_post XXXXXXXXXXXXXXXXXX");
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

});

