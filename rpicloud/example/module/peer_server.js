



var PeerServer = require('peer').PeerServer;
var server = PeerServer({port: 9000, path: '/myapp'});


server.on('connection', function(id) { 
	console.log('peer_server on connection: ' + id);
});
server.on('disconnection', function(id) {
	console.log('peer_server on disconnection: ' + id);
});
