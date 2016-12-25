/*	Creating the UDP server

*/

var PORT = 33333;
var HOST = '127.0.0.1';

var log, _rc;
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

exports.udp_server_start = function (){
	// to reuse _rc
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		log = arguments[0]._rc.log;
		_rc = arguments[0]._rc;
	} else log = console.log;

	log("in udp_server start");
	log(arguments);
	var args = arguments[0].args || {};
	console.log(args);


	server.on('listening', function () {
    var address = server.address();
    log('UDP server listening on ' + address.address + ":" + address.port);
	});

	server.on('message', function (message, remote) {
		log("UDP server receives: ");
		log(remote);
  	log(message.toString());
		_rc.call_api({api_name: 'command', api_args: message.toString()});
	});

	server.bind(PORT, HOST);
};

