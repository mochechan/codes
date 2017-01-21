// https://github.com/phoboslab/jsmpeg.git

var path = require('path');


	console.log(
		'Usage: \n' +
		'node stream-server.js <secret> [<stream-port> <websocket-port>]'
	);

var STREAM_SECRET = process.argv[2] || "password",
	STREAM_PORT = process.argv[3] || 8082,
	WEBSOCKET_PORT = process.argv[4] || 8084,
	STREAM_MAGIC_BYTES = 'jsmp'; // Must be 4 bytes

var width = 320, height = 240;
//var width = 640, height = 480;

// Websocket Server
var socketServer = new (require('ws').Server)({port: WEBSOCKET_PORT});
socketServer.on('connection', function(socket) {
	// Send magic bytes and video size to the newly connected socket
	// struct { char magic[4]; unsigned short width, height;}
	var streamHeader = new Buffer(8);
	streamHeader.write(STREAM_MAGIC_BYTES);
	streamHeader.writeUInt16BE(width, 4);
	streamHeader.writeUInt16BE(height, 6);
	socket.send(streamHeader, {binary:true});

	console.log( 'New WebSocket Connection ('+socketServer.clients.length+' total)' );
	
	socket.on('close', function(code, message){
		console.log( 'Disconnected WebSocket ('+socketServer.clients.length+' total)' );
	});
});

socketServer.broadcast = function(data, opts) {
	for( var i in this.clients ) {
		if (this.clients[i].readyState == 1) {
			this.clients[i].send(data, opts);
		}
		else {
			console.log( 'Error: Client ('+i+') not connected.' );
		}
	}
};


// HTTP Server to accept incomming MPEG Stream
var streamServer = require('http').createServer( function(request, response) {
	var params = request.url.substr(1).split('/');

	if( params[0] == STREAM_SECRET ) {
		response.connection.setTimeout(0);
		
		width = (params[1] || 320)|0;
		height = (params[2] || 240)|0;
		
		console.log(
			'Stream Connected: ' + request.socket.remoteAddress + 
			':' + request.socket.remotePort + ' size: ' + width + 'x' + height
		);
		request.on('data', function(data){
			socketServer.broadcast(data, {binary:true});
		});
	}
	else {
		console.log(
			'Failed Stream Connection: '+ request.socket.remoteAddress + 
			request.socket.remotePort + ' - wrong secret.'
		);
		response.end();
	}
}).listen(STREAM_PORT);

console.log('Listening for MPEG Stream on http://127.0.0.1:'+STREAM_PORT+'/<secret>/<width>/<height>');
console.log('Awaiting WebSocket connections on ws://127.0.0.1:'+WEBSOCKET_PORT+'/');

// ffmpeg -s 352x288 -f video4linux2 -i /dev/video0 -f mpeg1video -b 999k -r 25 http://localhost:8082/password/352/288/

var ffmpeg = require('child_process').spawn('ffmpeg',["-s","352x288","-f","video4linux2","-i","/dev/video0","-f","mpeg1video","-b","999k","-r","25","http://localhost:8082/password/352/288/"]);


	ffmpeg.stderr.on('data', (data) => {
		console.log(data.toString());
	});


//const restify = require('restify');

//var server = restify.createServer({ version: '1.0.0' });
//server.get(/\/html\/?.*/, restify.serveStatic({directory: path.resolve(__dirname, '.')}));


//server.listen(8088, function() {
  //console.log('%s listening at %s', server.name, server.url);
//});


