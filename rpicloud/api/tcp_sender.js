/* to send a message via tcp packet
tcpsend {"ip":"127.0.0.1","port":9997,"event":"exec","message":{"command":"ls"}}
*/


module.exports = function tcpsend () {
	console.log("in tcpsend XXXXXXXXXXXXXXXXXX");
	console.log(arguments);

	if (!arguments[0]) {
		console.log("no arguments")
		return;
	}

	if (!arguments[0].ip || typeof(arguments[0].ip) !== 'string') {
		console.log("incorrect ip");
		return;
	}

	if (!arguments[0].port || typeof(arguments[0].port) !== 'number') {
		console.log("incorrect port");
		return;
	}

	var message;
	if (arguments[0].message && typeof(arguments[0].message) === 'object') {
		var msg = JSON.stringify(arguments[0].message);
		if (arguments[0].event && typeof(arguments[0].event) === 'string')
			msg = arguments[0].event + ' ' + msg;
		message = new Buffer(msg);
	} else if (arguments[0].message && typeof(arguments[0].message) === 'string') {
		message = new Buffer(arguments[0].message);
	} else if (arguments[0].message && typeof(arguments[0].message) === 'buffer') {
		message = arguments[0].message;
	} else {
		console.log("incorrect message");
		return;
	}
	var ip = arguments[0].ip;
	var port = arguments[0].port;

	try {
		var client = new R.node.net.Socket();
		client.connect(port, ip, function() {
			console.log('Connected');
			client.write(message);
		});

		client.on('data', function(data) {
			console.log('Received: ' + data);
			client.destroy(); // kill client after server's response
		});

		client.on('close', function() {
			console.log('Connection closed');
		});
	} catch (e) {
		console.log(e);
	}
};


