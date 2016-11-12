/* creating a TCP server
*/

var log, _rc;
var net = require('net');
var tcp_port = 8080;
var tcp_server;

module.exports = function () {
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		log = arguments[0]._rc.log;
		_rc = arguments[0]._rc;
	} else log = console.log;
	log("in tcp_server");
	//log(arguments);
	var args = arguments[0].args || {};
	//console.log(args);

	tcp_server = net.createServer(function (socket) {
		log("tcp_server connected");
		socket.on('data', function (data) {
			log("tcp_server received: " + data.toString());
			_rc.call_api({api_name: 'command', api_args: data.toString()});
		});
	}).listen(tcp_port, function () {
		log("tcp server listens port:" + tcp_port);
	});
};

