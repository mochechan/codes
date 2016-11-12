/* to support 
static html web services
sockjs
file upload
*/

var log = R.log;
var http = R.node.http;
var url = R.node.url;
var querystring = R.node.querystring;
var fs = R.node.fs;
var session = require('sesh').session; //don't use magicSession https://github.com/marak/session.js
//alternative: https://github.com/senchalabs/connect
var formidable = require('formidable'); // for files upload
var sockjs = require('sockjs');
var node_static = require('node-static');
var http_port = R.config.http_port || 9899;
var express_port = R.config.express_port || 9999;
var html_path = R.node.path.resolve(R.status.rpi_root, R.config.html_path) || __dirname;


var handle = require('./http_handler.js');

var clients = {}; // all clients for sockjs

// sockjs Broadcast to all clients
function broadcast(message){
  for (var client in clients) {
    clients[client].write(JSON.stringify(message));
  }
}

// 1. Echo sockjs server
var sockjs_options = {
	sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.3/sockjs.min.js",
	log: function () {
		log("sockjs_log");
		log(arguments);
	},
};

var sockjs_echo = sockjs.createServer(sockjs_options);
sockjs_echo.on('connection', function(conn) {
	log("sockjs connected");
	log(conn);
	clients[conn.id] = conn;
  conn.on('data', function(message) {
		log("received message from browser:");
		log(message);
		R.event.emit('command', message, function(){
			//console.log("sockjs callback...");
			//console.log(arguments);
    	conn.write(arguments);
		});
  });
	conn.on('close', function() {
    log('sockjs close ' + conn);
  });
});

// 2. Static files server
var static_directory = new node_static.Server(html_path);

// 3. Usual http stuff
var server = http.createServer(function onRequest(request_, response_) {
	session(request_, response_, function(request, response){
		log("http requested:" + request.url);
		//console.log("################# request.session");
		//console.log(request.session);

		// for file upload handlers
  	var pathname = url.parse(request.url).pathname;
	  if (typeof handle[pathname] === 'function') {
  		log("About to route a request for handler: " + pathname);
    	handle[pathname](request, response);
	  } else {
  	  //console.log("No request handler found for " + pathname);
    	//response.writeHead(404, {"Content-Type": "text/html"});
	    //response.write("404 Not found");
  	  //response.end();
	  }
	});
}).listen(http_port, '0.0.0.0', function() {
 	log("http server has started at port: " + http_port);
});


// static_html "handlers" should prevent file upload handlers
server.addListener('request', function(req, res) {
	log("server.addListener request");
  if (typeof handle[url.parse(req.url).pathname] === 'function') return; 
  static_directory.serve(req, res);
});
server.addListener('upgrade', function(req,res){
	log("server.addListener upgrade");
  if (typeof handle[url.parse(req.url).pathname] === 'function') return; 
  res.end();
});

sockjs_echo.installHandlers(server, {prefix:'/sockjs'});


//////////////////////////////////////////// cloudcmd

var express_cloudcmd = require('express')();
var cloudcmd = require('cloudcmd');
var socketio = require("socket.io").listen(server);

express_cloudcmd.use(cloudcmd({
    socket: socketio,  
    config: R.config.cloudcmd 
}));

express_cloudcmd.listen(R.config.cloudcmd.port, function () {
  log('express_cloudcmd is listening at port ' + R.config.cloudcmd.port);
});

