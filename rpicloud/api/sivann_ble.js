/*
	This file uses offical sivann node_modules.


exports.noble = function() only

*/

var _rc, log;
var BShepherd = require('ble-shepherd'), 
	central = new BShepherd('noble');   // use 'noble' when a BLE USB adaptor is used

var weatherPlugin = require('bshep-plugin-sivann-weatherstation');
var relayPlugin = require('bshep-plugin-sivann-relay');
var remoteCtrlPlugin = require('bshep-plugin-sivann-remotecontrol'); 
var gasSensorPlugin = require('bshep-plugin-sivann-gassensor');

var _ = require('busyman');
var status = {};


function init_hardware(){
	console.log("loading central.support module");

	central.support('weatherStation', weatherPlugin);
	central.support('relayPIR', relayPlugin);
	central.support('remoteCtrl', remoteCtrlPlugin); // give a device name to the module you are going to use. This name will be used in further applications.
	central.support('gasSensor', gasSensorPlugin); // give a device name to the module you are going to use. This name will be used in further applications.
	central.start();

	central.on('ready', function () {
		console.log('[         ready ] ');
		bleApp(central);
	});

	central.on('permitJoining', function (timeLeft) {
		console.log('[ permitJoining ] ' + timeLeft + ' sec');
	});

	central.on('error', function (err) {
		console.log('[         error ] ' + err.message);
	});
}


var weatherStation, weatherStation1, weatherStation2;
function bleApp (central) {
	var blocker = central.blocker;

	/*** add your devices to blacklist ***/
	//blocker.enable('black');         // enable blacklist service. Use blacklist to ban a known devices.
	//blocker.block('0x5c313e2bfb34'); // ban a specified device by its MAC address

	/*** add your devices to whitelist ***/
	//blocker.enable('white');         // enable whitelist service. Use whitelist to block other unknown/unwanted BLE devices, and only specified devices can join your network.
	//blocker.unblock('0x20c38ff1a0ea');  // specify a device to join the network by using its MAC address
	//blocker.unblock('0x20c38ff1b8b1');

	central.permitJoin(60); // 60s the default value to allow devices joining the network.

	central.on('ind', function(msg) {
		var dev = msg.periph;

		switch (msg.type) {
		/*** devIncoming      ***/
		case 'devIncoming':
			if(dev.name){
				console.log(('[   devIncoming ] ') + '@' + dev.addr + ', ' + dev.name + ', firmware ' + dev.findChar('0x180a', '0x2a26').value.firmwareRev); // display the device MAC and name. Use this MAC address for blacklist or whitelist.
			} else {
				console.log(('[   devIncoming ] ') + '@' + dev.addr + ', failed to recognize this incoming device.');
			}

			if (dev.name === 'weatherStation') {
				weatherStation = dev;
				/***  write your application here   ***/
				

				// you can call the private function to enable all the indication/notification of each Characteristic automatically.
				configNotifyAll(weatherStation); 

				// you can also manually enable or disable the indication/notification of each Characteristic.
				// weatherStation.configNotify('0xbb80', '0xcc07', true);  // temperature
				// weatherStation.configNotify('0xbb80', '0xcc08', true);  // humidity
				// weatherStation.configNotify('0xbb80', 65, true);        // UV Index
				// weatherStation.configNotify('0xbb80', 69, true);        // illuminance
				// weatherStation.configNotify('0xbb80', '0xcc11', true);  // barometer
				// weatherStation.configNotify('0xbb80', '0xcc1a', true);  // Loudness
				// weatherStation.configNotify('0xbb80', '0xcc1b', true);  // PM (Particle Matter)
				weatherStation.configNotify('0xbb00', '0xcc00', false); // DIn  Set to false to disable the notification
				weatherStation.configNotify('0xbb10', '0xcc02', false); // AIn  Set to false to disable the notification

				// Register your handler to handle notification or indication of each Characteristic.
				weatherStation.onNotified('0xbb80', '0xcc07', tempHdlr);		// temperature
				weatherStation.onNotified('0xbb80', '0xcc08', humidHdlr);		// humidity
				weatherStation.onNotified('0xbb80', 65, uvIndexHdlr);			// UV Index
				weatherStation.onNotified('0xbb80', 69, ambientLightHdlr);		// illuminance
				weatherStation.onNotified('0xbb80', '0xcc11', barometerHdlr);	// barometer
				weatherStation.onNotified('0xbb80', '0xcc1a', loudnessHdlr);	// Loudness
				weatherStation.onNotified('0xbb80', '0xcc1b', pmHdlr);			// PM (Particulate Matter)
				weatherStation.onNotified('0xbb00', '0xcc00', callbackDIn);		// DIn
				weatherStation.onNotified('0xbb10', '0xcc02', callbackAIn);		// AIn

				weatherStation.write('0xbb80', '0xbb82', {period: 250}, function (err) {
					if (err){ 
						console.log(('[         error ]') + ' failed to change period. ' + err);
					} else {
						weatherStation.read('0xbb80', '0xbb82', function (err, value) {
							if (err){
								console.log(('[         error ]') + ' failed to read period. ' + err);
							} else {
								console.log('[ debug message ] changed the reporting period to ' + value.period / 100 + 's.'); // (recommend range: 100-255). Minimum period is 1s.
							}
						});
					}
				});

				// weatherStation.write('0xbb80', '0xbb81', {config : false});    // uncomment to turn off weatherStation functions measurements.

				/* you will have to switch case between device addresses only if you have multiple weather station modules. */
			} else if (dev.name === 'relay') {
				relay = dev;
				/***  write your application here   ***/

				// you can call the private function to enable all the indication/notification of each Characteristic automatically.
				configNotifyAll(relay);
				// you can also manually enable or disable the indication/notification of each Characteristic.
				// relay.configNotify('0xbb40', '0xcc0e', true); // Relay
				// relay.configNotify('0xbb30', '0xcc1e', true); // Power
				// relay.configNotify('0xbb30', '0xcc13', true); // Current
				// relay.configNotify('0xbb90', '0xcc06', true); // PIR
				relay.configNotify('0xbb00', '0xcc00', false); // DIn  Set to false to disable the notification
				relay.configNotify('0xbb10', '0xcc02', false); // AIn  Set to false to disable the notification

				// Register your handler to handle notification or indication of each Characteristic.
				relay.onNotified('0xbb40', '0xcc0e', function (data) {
					callbackRelay(data, relay);  // Relay
				});
				
				relay.onNotified('0xbb30', '0xcc1e', function (data) {
					callbackPower(data, relay);  // Power
				});  
				
				relay.onNotified('0xbb30', '0xcc13', function (data) {
					callbackCurrent(data, relay);  // Current
				});

				relay.onNotified('0xbb90', '0xcc06', function (data) {
					callbackPir(data, relay);  // PIR
				});
				
				relay.onNotified('0xbb00', '0xcc00', callbackDIn);      // DIn
				relay.onNotified('0xbb10', '0xcc02', callbackAIn);      // AIn
				relay.write('0xbb30', '0xbb32', {period: 250}, function (err) {
					if (err){ 
						console.log(chalk.red('[         error ]') + ' failed to change the period. ' + err);
					} else {
						relay.read('0xbb30', '0xbb32', function (err, value) {
							if (err){
								console.log(chalk.red('[         error ]') + ' failed to read period. ' + err);
							} else {
								console.log('[ debug message ] changed the reporting period to ' + value.period / 100 + 's.'); // (recommend range: 100-255)
							}
						});
					}
				});
				//relay.write('0xbb30', '0xbb31', {config : false});    // uncomment to turn off power & current measurements.

			} else if(dev.name === 'gasSensor') {
				gasSensor = dev;
				/***  write your application here   ***/

				// you can call the private function to enable all the indication/notification of each Characteristic automatically.                    
				configNotifyAll(gasSensor); 
				// you can also manually enable or disable the indication/notification of each Characteristic.
				// gasSensor.configNotify('0xbb60', '0xcc28', true);	// buzzer
				// gasSensor.configNotify('0xbb50', '0xcc04', true);	// gas
				gasSensor.configNotify('0xbb00', '0xcc00', false);	// DIn  Set to false to disable the notification
				gasSensor.configNotify('0xbb10', '0xcc02', false);	// AIn  Set to false to disable the notification

				// Register your handler to handle notification or indication of each Characteristic.
				gasSensor.onNotified('0xbb60', '0xcc28', buzzerHdlr);	// buzzer
				gasSensor.onNotified('0xbb50', '0xcc04', gasHdlr);		// gas
				gasSensor.onNotified('0xbb00', '0xcc00', callbackDIn);	// DIn
				gasSensor.onNotified('0xbb10', '0xcc02', callbackAIn);	// AIn
				gasSensor.write('0xbb50', '0xbb52', {period: 250}, function (err) {
					if (err){
						console.log(chalk.red('[         error ]') + ' failed to change the period. ' + err);
					} else {
						gasSensor.read('0xbb50', '0xbb52', function (err, value) {
							if (err){
								console.log(chalk.red('[         error ]') + ' failed to read period. ' + err);
							} else{
								console.log('[ debug message ] changed the reporting period to ' + value.period / 100 + 's.'); // (recommend range: 100-255)
							}
						});
					}
				});
				
				gasSensor.write('0xbb50', '0xbb53', {option: 1}, function (err) { // option 0:Propane, 1:Smoke(default), 2:Methane, 3:Ethanol
					if (err){
						console.log(chalk.red('[         error ]') + ' failed to change the option. ' + err);
					} else {
						console.log('[ debug message ] changed the measuring gas option to Smoke.');
					}
				});
				
				gasSensor.write('0xbb50', '0xbb54', {threshold: 500}, function (err) { // threshold range: 100-10000
					if (err){
						console.log(chalk.red('[         error ]') + ' failed to change the threshold. ' + err);
					} else { 
						console.log('[ debug message ] changed the gas threshold value to 500 ppm.');
					}
				});

				//gasSensor.write('0xbb50', '0xbb51', {config : false});    // uncomment to turn off gas measurements.
			} else if(dev.name === 'remoteCtrl') {
				remoteCtrl = dev;
				/***  write your application here   ***/

				// you can call the private function to enable all the indication/notification of each Characteristic automatically.
				configNotifyAll(remoteCtrl);
				// you can also manually enable or disable the indication/notification of each Characteristic.
				// remoteCtrl.configNotify('0xbb70', '0xcc32', true); // multiState key

				// Register your handler to handle notification or indication of each Characteristic.
				remoteCtrl.onNotified('0xbb70', '0xcc32', remoteCtrlHdlr);    // multiState key
			} else if(dev.name === 'gasSensor') {
				gasSensor = dev;
				/***  write your application here   ***/

				// you can call the private function to enable all the indication/notification of each Characteristic automatically.                    
				configNotifyAll(gasSensor); 

				// you can also manually enable or disable the indication/notification of each Characteristic.
				// gasSensor.configNotify('0xbb60', '0xcc28', true);	// buzzer
				// gasSensor.configNotify('0xbb50', '0xcc04', true);	// gas
				gasSensor.configNotify('0xbb00', '0xcc00', false);	// DIn  Set to false to disable the notification
				gasSensor.configNotify('0xbb10', '0xcc02', false);	// AIn  Set to false to disable the notification

				// Register your handler to handle notification or indication of each Characteristic.
				gasSensor.onNotified('0xbb60', '0xcc28', buzzerHdlr);	// buzzer
				gasSensor.onNotified('0xbb50', '0xcc04', gasHdlr);		// gas
				gasSensor.onNotified('0xbb00', '0xcc00', callbackDIn);	// DIn
				gasSensor.onNotified('0xbb10', '0xcc02', callbackAIn);	// AIn
				
				gasSensor.write('0xbb50', '0xbb52', {period: 250}, function (err) {
					if (err){
						console.log(chalk.red('[         error ]') + ' failed to change the period. ' + err);
					} else {
						gasSensor.read('0xbb50', '0xbb52', function (err, value) {
							if (err){
								console.log(chalk.red('[         error ]') + ' failed to read period. ' + err);
							} else {
								console.log('[ debug message ] changed the reporting period to ' + value.period / 100 + 's.'); // (recommend range: 100-255)
							}
						});
					}
				});
				
				gasSensor.write('0xbb50', '0xbb53', {option: 1}, function (err) { // option 0:Propane, 1:Smoke(default), 2:Methane, 3:Ethanol
					if (err){
						console.log(chalk.red('[         error ]') + ' failed to change the option. ' + err);
					} else {
						console.log('[ debug message ] changed the measuring gas option to Smoke.');
					}
				});
				
				gasSensor.write('0xbb50', '0xbb54', {threshold: 500}, function (err) { // threshold range: 100-10000
					if (err){
						console.log(chalk.red('[         error ]') + ' failed to change the threshold. ' + err);
					} else {
						console.log('[ debug message ] changed the gas threshold value to 500 ppm.');
					}
				});


				//gasSensor.write('0xbb50', '0xbb51', {config : false});    // uncomment to turn off gas measurements.

        /*** you will have to switch case between device addresses only if you have multiple gas sensor modules. ***/
/*                    switch (dev.addr) {
                        case '0x689e192a8c5e':
                            //  write your application for the 1st gas sensor  //
                            gasSensor1 = dev;
                            configNotifyAll(gasSensor1);
                            gasSensor1.onNotified('0xbb60', '0xcc28', buzzerHdlr); // buzzer
							gasSensor1.onNotified('0xbb50', '0xcc04', gasHdlr);    // gas
                            gasSensor1.write('0xbb50', '0xbb52', {period: 255}, function (err) {
                                if (err) 
                                    console.log(chalk.red('[         error ]') + ' failed to change the period. ' + err);
                                else {
                                    gasSensor.read('0xbb50', '0xbb52', function (err, value) {
                                        if (err)
                                            console.log(chalk.red('[         error ]') + ' failed to read period. ' + err);
                                        else
                                            console.log('[ debug message ] changed the reporting period to ' + value.period / 100 + 's.'); // (recommend range: 100-255)
                                    });
                                }
                            });
                            break;

                        case '0x20914838225b':
                            //  write your application for the 2nd gas sensor  //
							gasSensor2 = dev;
                            configNotifyAll(gasSensor2);
                            gasSensor2.onNotified('0xbb60', '0xcc28', buzzerHdlr); // buzzer
							gasSensor2.onNotified('0xbb50', '0xcc04', gasHdlr);    // gas
                            gasSensor2.write('0xbb50', '0xbb52', {period: 255}, function (err) {
                                if (err)
                                    console.log(chalk.red('[         error ]') + ' failed to change the period. ' + err);
                                else {
                                    gasSensor.read('0xbb50', '0xbb52', function (err, value) {
                                        if (err)
                                            console.log(chalk.red('[         error ]') + ' failed to read period. ' + err);
                                        else
                                            console.log('[ debug message ] changed the reporting period to ' + value.period / 100 + 's.'); // (recommend range: 100-255)
                                    });
                                }
                            });

							break;
                    }
 */

			} else {
				console.log("invalid dev.name ");
			}
			
		break;

		/***   devStatus     ***/
		case 'devStatus':
			console.log('[     devStatus ] ' + '@' + dev.addr + ', ' + msg.data);
		break;

		/***   devLeaving    ***/
		case 'devLeaving':
			console.log('[    devLeaving ]' + '@' + dev.addr);
		break;

		/***   attrsChange   ***/
		case 'attChange':
			//console.log('[   attrsChange ] ' + '@' + dev.addr + ', ' + dev.name + ', ' + msg.data.sid.uuid + ', ' + msg.data.cid.uuid + ', ' + JSON.stringify(msg.data.value));  // print all attribute changes once received.
		break;
	
		/***   attNotify     ***/
		case 'attNotify':
		break;

		/***   devNeedPasskey   ***/
		case 'devNeedPasskey':
			// cc-bnp only
			console.log('[devNeedPasskey ]');
		break;
		}
	}); // central.on
}

/*****************************************************/
/*    Weather Station Callback Handler               */
/*****************************************************/
function tempHdlr(data) {
	// show temp
	console.log('[ debug message ] Temperature : ' + data.sensorValue.toFixed(1) + ' ' + data.units);
	console.log(data);
	/***  write your application here   ***/
}

function humidHdlr(data) {
	// show humid
	console.log('[ debug message ] Humidity : ' + data.sensorValue.toFixed(1) + ' ' + data.units);
	/***  write your application here   ***/
}

function ambientLightHdlr(data) {
	// show Ambient Light
	console.log('[ debug message ] Ambient Light : ' + data.sensorValue + ' ' + data.units);
	/***  write your application here   ***/
}

function uvIndexHdlr(data) {
	// show uvIndex
	console.log('[ debug message ] UV Index : ' + data.sensorValue + ' ' + data.units);
	/***  write your application here   ***/
}

function barometerHdlr(data) {
    // show barometer
	console.log('[ debug message ] Atmospheric Pressure : ' + data.sensorValue + ' ' + data.units);
	/***  write your application here   ***/
}

function loudnessHdlr(data) {
    // show loudness
	console.log('[ debug message ] Sound Level : ' + data.sensorValue.toFixed(1) + ' ' + data.units);
	/***  write your application here   ***/
}

function pmHdlr(data) {
    // show pm
    console.log('[ debug message ] Particulate Matter : ' + data.sensorValue.toFixed(1) + ' ' + data.units);
	/***  write your application here   ***/
}


function callbackDIn(data) {
    // show dIn
    console.log('[ debug message ] dIn State : ' + data.dInState);
    /***  write your application here   ***/
}

function callbackAIn(data) {
    // show aIn
    console.log('[ debug message ] aIn : ' + data.aInCurrValue + ' ' + data.sensorType);
    /***  write your application here   ***/
}

/**********************************/
/* Private Utility Function       */
/**********************************/
function configNotifyAll(dev) {
	var devData = {
		permAddr: dev.addr,
		status: dev.status,
		gads: {}
	};
	
	_.forEach(dev.dump().servList, function (serv) {
		_.forEach(serv.charList, function (char) {

			if (!_.isNil(devData)) {
				devData.gads[devData.auxId] = devData;
				if (dev._controller)
					dev.configNotify(serv.uuid, char.handle, true);
			}
		});
	});

	return devData;
}

module.exports = function(){

	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		_rc = arguments[0]._rc;
		log = arguments[0]._rc.log;
	} else log = console.log;

	console.log(arguments);
	console.log(arguments[0].args);
	var args = arguments[0].args;
	log("The log works in connect.");
	if(typeof args.callback == "function") args.callback("return demo1");

	switch(args.command){
	case 'init': 
		console.log("init_hardware()");
		init_hardware();
	break;
	case 'disconnect':
	break;
	case 'connect':
	break;
	

	case 'listPeripheral':
		console.log(discovered);
	break;

	case 'status':
		
	break;

	default:
	break;
	}


}

