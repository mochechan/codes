/* websocket server
https://github.com/websockets/ws
*/

var log, _rc;
var ws_port = 8888;

var WebSocketServer = require('ws').Server;

var wss;


module.exports = function () {

	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		log = arguments[0]._rc.log;
		_rc = arguments[0]._rc;
	} else log = console.log;
	log("in ws_server.js");
	var args = arguments[0].args || {};
	log(args);

	wss = new WebSocketServer({ port: ws_port });

	wss.on('open', function open() {
  	log('ws_server.on open');
		log(arguments);
	});

	wss.on('close', function close() {
  	log('ws_server.on close');
		log(arguments);
	});

	wss.on('connection', function connection(ws) {
		log("ws_server.on connection: " );
	  ws.on('message', function incoming(message) {
  	  log('ws_server.on message: ' + message);
			_rc.call_api({api_name: 'command', api_args: {command: message.toString(), 
				ws: {protocol: ws.protocol,
					headers: ws.headers,
					url: ws.url,
					method: ws.method,
				}, callback: function () {
				// Immediate errors can also be handled with try/catch-blocks, but **note** that since sends are inherently asynchronous, socket write failures will *not* be captured when this technique is used.
				try {
					var msg_reply = JSON.stringify(arguments[0]);
					log("wss sending: " + msg_reply);
				  ws.send(msg_reply, function (err) {
						if (!err) return;
						log("ws_server send error distinguisher");
					});
				} catch (error) {
					log("ws_server.ws.send fails");
					log(error);
					log(error.stack);
				}
			}}});
	  });
	});


	wss.broadcast = function broadcast(data) {
  	wss.clients.forEach(function each(client) {
    	client.send(data);
	  });
	};

};


