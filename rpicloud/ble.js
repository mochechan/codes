
var noble = require('noble');



noble.on('stateChange', function(state){
	console.log("on_statChange");
	console.log(arguments);
  if (state === 'poweredOn') {
    setTimeout(function(){
			noble.startScanning();
		}, 1111);
    setTimeout(function(){
			
			//noble.stopScanning();
		}, 9999);
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', function(state){
	console.log("on_scanStart");
	console.log(arguments);
});

noble.on('scanStop', function(state){
	console.log("no_scanStop");
	console.log(arguments);
});

noble.on('discover', function(peripheral){
	console.log("no_discover");
	console.log(peripheral);
	peripheral.connect( function(error) {
  	console.log('connected to peripheral: ' + peripheral.uuid);
		peripheral.discoverServices(peripheral.uuid, function(error, services){
			
			console.log(arguments);
		});
	});
});

noble.on('warning', function(state){
	console.log("no_warning");
	console.log(arguments);
});








