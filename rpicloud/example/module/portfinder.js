/*	to find an available port for localhost
*/

var portfinder = require('portfinder');

R.event.on("portfinder", function(){
	//console.trace("portfinder XXXXXXXXXXXXXXXXXX");
	console.log(arguments);
	try {
		portfinder.basePort = parseInt(arguments[0]) //baseport
	} catch (e) {
		console.log(e);
	}

  portfinder.getPort(function () {
    // `port` is guaranteed to be a free port in this scope.
		console.log('getPort');
		console.log(arguments);
  });

/* useless
  portfinder.getPorts(function () {
		console.log('getPort');
		console.log(arguments);
	});

  portfinder.getSocket(function () {
		console.log('getSocket');
		console.log(arguments);
	});

  portfinder.nextPort(function () {
		console.log('nextPort');
		console.log(arguments);
	});

  portfinder.nextSocket(function () {
		console.log('nextSocket');
		console.log(arguments);
	});
*/
});


