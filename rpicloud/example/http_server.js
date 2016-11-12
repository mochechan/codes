//Lets require/import the HTTP module
var http = require('http');
var url = require('url');


var server = http.createServer(function handleRequest(request, response){
	var ack_message = {
		client_public_ip: request.connection.remoteAddress
	};
    response.end(JSON.stringify(ack_message));
	//console.log(request.url);
	var payload = url.parse(request.url); 
	console.log("received: " + request.connection.remoteAddress);
	console.log(payload);
});


//Lets start our server
server.listen(9090, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening");
});
