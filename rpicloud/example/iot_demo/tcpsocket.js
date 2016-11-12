var net = require('net');

var client = new net.Socket();
client.connect(38073, 'src.imoncloud.com', function() {
	console.log('Connected');
	client.write('{"E": "iot_test1", "P": {"xx":"xx"}}\n');
});

client.on('error', function (e) {
	console.error(e);	
});

client.on('data', function(data) {
	console.log('Received: ' + data);
	//client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});

