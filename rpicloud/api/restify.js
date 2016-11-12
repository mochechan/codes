

const fs = require('fs');
const path = require('path'); 
const cp = require('child_process');
const restify = require('restify');
const WebSocket = require('ws').Server;


var server = restify.createServer({ version: '1.0.0' });
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
var ws = new WebSocket({server: server});


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

    console.log(`ws received: ${message}`);
    s.send(JSON.stringify({
      answer: 42
    }));
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
 
ws.on('message', function message(data, flags) {
	console.log('ws on message');
  console.log('Roundtrip time: ' + (Date.now() - parseInt(data)) + 'ms', flags);
 
  //setTimeout(function timeout() {
  //  ws.send(Date.now().toString(), {mask: true});
  //}, 500);
});


