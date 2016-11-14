/* to support 
static html web services
ws
file upload
*/

var log, _rc;

var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var sesh = require('sesh').session; //don't use magicSession https://github.com/marak/session.js
//alternative: https://github.com/senchalabs/connect

var WebSocketServer = require('ws').Server;

var html_path = __dirname;
var port = {
	http: 9080,
	ws: 9090,
	express: 9999,
	cloudcmd: 9990, 
	};

var http_server;
var ws_clients = {}; //all clients for ws
var handler = require('./http_handler/http_handler.js');


// sockjs Broadcast to all clients
function ws_broadcast(message){
  for (var client in ws_clients) {
    ws_clients[client].write(JSON.stringify(message));
  }
}


exports.http_server_start = function () {
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		_rc = arguments[0]._rc;
		log = arguments[0]._rc.log;
	} else log = console.log;
	port.http = _rc.config.port.http || port.http;

	//log('in http_server_start');
	//log(arguments);


	// 3. Usual http stuff
	http_server = http.createServer(function onRequest(request_, response_) {
		sesh(request_, response_, function(request, response){
			log("http requested:" + request.url);
			//console.log("######### request.session");
			//console.log(request.session);

			// for file upload handlers
  		var pathname = url.parse(request.url).pathname;
	  	if(typeof handler[pathname] === 'function'){
	  		log("http_handler: " + pathname);
  	  	handler[pathname](request, response, _rc);
	 	 } else {
	  	  //log("invalid request: " + pathname);
  	  	//response.writeHead(404, {"Content-Type": "text/html"});
	  	  //response.write("404 Not found");
  	  	//response.end();
		  }
		});
	}).listen(port.http, '0.0.0.0', function() {
 		log("http_server port: " + port.http);
	});

	//var ws = new WebSocketServer({server: http_server});
	var ws = new WebSocketServer({port: _rc.config.port.ws || port.ws});
	ws.on('connection', function connection(conn) {
		log("ws connected: " + conn.upgradeReq.headers.origin || "invalid");
		//console.log(conn.upgradeReq.headers);
		ws_clients[conn.id] = conn;

	  conn.on('message', function(message) {
			log("ws received: ");
			log(message);
			_rc.call_api({api_name: 'parse_command', api_args: {command: message, callback: function(api_result){
				log("ws callback: ");
				log(api_result);
				//console.log("conn.send:");
				//console.log(api_result);
	    	conn.send(JSON.stringify(api_result));
			}}});
	  });

		conn.on('close', function() {
    	log('ws closed: ' + conn.upgradeReq.headers.origin || "");
	  });
	});

	// static_html "handlers" should prevent file upload handlers
	http_server.addListener('request', function(req, res) {
		//log("server.addListener request: " + req.url);
	  if(typeof handler[url.parse(req.url).pathname] === 'function'){ 
			return; 
		}
		var full = path.resolve(_rc.status.dirname, _rc.config.html_path, req.url.substring(1));
		log("serve: " + full);
		fs.readFile(full, function(err, html){
		  res.writeHeader(200, {"Content-Type": "text/html"});  
			if(err){ 
				log(err);
				return;
			}
      res.write(html);  
      res.end();  
		});
	});

	http_server.addListener('upgrade', function(req,res){
		log("server.addListener upgrade: " + req.url);
	  if(typeof handler[url.parse(req.url).pathname] === 'function'){ 
			return; 
		}
  	res.end();
	});



	//////////////////////////////////////////// cloudcmd

/*
	var express_cloudcmd = require('express')();
	var cloudcmd = require('cloudcmd');
	var socketio = require("socket.io").listen(http_server);

	express_cloudcmd.use(cloudcmd({
    socket: socketio,  
	}));

	express_cloudcmd.listen(port.cloudcmd, function () {
  	log('express_cloudcmd is listening at port ' );
	});
*/
} // end of http_server_start



