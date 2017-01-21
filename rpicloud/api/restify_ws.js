/*
supports: restify with static html, websocket at the same port 

todo: restify client 
*/

const fs = require('fs');
const path = require('path'); 
const cp = require('child_process');
const restify = require('restify');
const WebSocket = require('ws').Server;


var log, _rc;

exports.restify_server_start = function () {
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		_rc = arguments[0]._rc;
		log = arguments[0]._rc.log;
	} else log = console.log;

	//console.log("in restify_server_start arguments");
	//console.log(arguments);

	var parameters = {
		port: arguments[0].args.port,
		html: arguments[0].args.html,
	};

	//console.log(parameters);

	var server = restify.createServer({ version: '1.0.0' });
	server.use(restify.gzipResponse());
	server.use(restify.bodyParser());
	var ws = new WebSocket({server: server});
	var ws_clients = {}; //all clients for ws

	/*server.get("/favicon.ico", (req, res, next)=>{
	  if(err){
      res.send(500);
      return next();
    }
		log("returning favicon.ico");
    res.send({
      code: 200,
      noEnd: true
    });
    //res.write(file);
    res.end();
    return next();
	});*/

	server.get(/\/html\/?.*/, restify.serveStatic({directory: parameters.html || path.resolve(__dirname, '..')}));


	server.get('/test/:name', (request, respond, next) => {
		console.log("restify get");
		console.log(request.params);
		console.log(request.headers['x-forwarded-for'] || request.connection.remoteAddress);
		respond.send(request.params);
	});


	server.post({path: '/restifypost', versions: ['1.0.0']}, function(request, result, next){
		console.log("restify post");
		console.log(request.headers['x-forwarded-for'] || request.connection.remoteAddress);
  	console.log("request.body");
		console.log(request.body);
		result.send({asdf:"abcd"});
  	return next();
	});


	server.listen( parameters.port || 9999, function() {
  	log('%s listening at %s', server.name, server.url);
	});



	ws.on('connection', function connection(s) {
		log("ws connection...");
		ws_clients[s.id] = s;

  	s.on('message', function incoming(message) {
			log("ws received: " );
			log(message);

  	  //console.log(`ws received: ${message}`);

			//FIXME: try catch
			var parsed = JSON.parse(message);

			var payload = parsed.payload;

			payload.callback = function(){
				log("ws callback: ");
				log(arguments);
				var payload_result = {
					result: arguments,
					transaction_id: parsed.transaction_id,
				};
	    	log("ws sending:" + JSON.stringify(payload_result));
	    	s.send(JSON.stringify(payload_result));
			};

			//console.log(typeof(payload));

			_rc.call_api(payload);
  	});
	});


	ws.on('open', () => {
		log("ws on open");
		log(arguments);
	});

	ws.on('error', () => {
		log("ws on error");
		log(arguments);
	});

	ws.on('headers', () => {
		log("ws on headers");
		//console.log(arguments);
	});

 
	ws.on('close', function close() {
  	log('ws on close');
	});

}


exports.restify_server_stop = function (){

}
