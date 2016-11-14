

const fs = require('fs');
const path = require('path'); 
const cp = require('child_process');
const restify = require('restify');
const WebSocket = require('ws').Server;


var log, _rc;

exports.http_server_start = function () {
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		_rc = arguments[0]._rc;
		log = arguments[0]._rc.log;
	} else log = console.log;

var server = restify.createServer({ version: '1.0.0' });
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
var ws = new WebSocket({server: server});
var ws_clients = {}; //all clients for ws


server.get(/\/html\/?.*/, restify.serveStatic({directory: path.resolve(__dirname, '..')}));


server.get('/test/:name', (request, respond, next) => {
	console.log(request.params);
	respond.send(request.params);
});


server.post({path: '/restifypost', versions: ['1.0.0']}, function(request, result, next){

  console.log("request.body");
	console.log(request.body);
  return next();
});


server.listen(9999, function() {
  console.log('%s listening at %s', server.name, server.url);
});



ws.on('connection', function connection(s) {
	console.log("ws connection...");

  s.on('message', function incoming(message) {
		log("ws received: " );
		console.log(message);

    console.log(`ws received: ${message}`);

		//FIXME: try catch
		var parsed = JSON.parse(message);

		var payload = parsed.payload;

		payload.callback = function(api_result){
				log("ws callback: ");
				log(api_result);
				//console.log("conn.send:");
				//console.log(api_result);
				var payload_result = {
					result: api_result,
					transaction_id: parsed.transaction_id,
				};
	    	conn.send(JSON.stringify(api_result));
			};
		console.log(typeof payload);

		_rc.call_api(payload);
    //s.send(JSON.stringify({ answer: 42 }));
  });
});


ws.on('open', () => {
	console.log("ws on open");
	console.log(arguments);
});

ws.on('error', () => {
	console.log("ws on error");
	console.log(arguments);
});

ws.on('headers', () => {
	console.log("ws on headers");
	//console.log(arguments);
});

 
ws.on('close', function close() {
  console.log('ws on close');
});
 

}
