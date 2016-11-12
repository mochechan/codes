/* to send a message via UDP packets 
udpsend {"ip":"127.0.0.1","port":9996,"event":"exec","message":{"command":"ls"}}
*/

var _rc, log;

module.exports = function () {
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		log = arguments[0]._rc.log;
		_rc = arguments[0]._rc;
	} else log = console.log;
	log("in quit");
	//log(arguments);
	var args = arguments[0].args || {};
	//console.log(args);

	

	console.log("in udpsend XXXXXXXXXXXXXXXXXX");
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

	var PORT = arguments[0].port;
	var HOST = arguments[0].ip;

	var dgram = R.node.dgram;

	var client = dgram.createSocket('udp4');
	client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
		if (err) {
		//throw err;
			console.log("UDP sender fails");
		} else {
			console.log('UDP message sent to ' + HOST +':'+ PORT);
			client.close();
		}
	});
};


