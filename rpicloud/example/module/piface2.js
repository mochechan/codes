/*
PiFace digital 2
piface2 {"output":0, "value":"on", callback: function(){}} //turn on relay0
piface2 {"output":0, "value":"off"} //turn off relay0
piface2 {"output":1, "value":"on"} //turn on relay1
piface2 {"output":1, "value":"off"} //turn off relay1
piface2 {"output":2, "value":"on"} //turn on output2
piface2 {"output":2, "value":"off"} //turn off output2

The callback function is optional.

removing jp5 jp6 to disable relay1 relay2
connecting jp3 to share single power supply
removing jp7 to disable onboard LEDs and relays
{relay:1, value: off} {output: 1, value: on}

todo: to support mulitple piface
*/


var piface2 = {output:208};
if (!R.status.piface2) R.status.piface2 = {};

R.event.on("piface2", function(){
	console.log("piface2 XXXXXXXXXXXXXXXXXX");
	console.log(arguments);

	if (arguments[0].relay || arguments[0].output) {
		var _value, _pin; 
		if (arguments[0].value && arguments[0].value === 'on') _value = 1;
		else if (arguments[0].value && arguments[0].value === 'off') _value = 0;
		else _value = arguments[0].value;

		for (var i in arguments[0]) {
			switch (i) {
				case 'relay':
				case 'output':
					_pin = parseInt(arguments[0][i]);
					if (_pin >= 0 && _pin < 8) _pin += 200;
				break;
				default:
				break;
			}
		}
		var _cmd = "gpio -p write " + _pin + " " + _value;
		R.event.emit("exec", {command:_cmd});
		return;
	}

	R.event.emit("exec", {command:"gpio -p readall", callback: function () {
		console.log("reading");
		//console.log(arguments[1]);

		if (arguments[0]) {
			console.log("no wiringPI gpio ");
			return;
		}
		if (arguments[1]) {
			var _x0 = arguments[1].replace(/ /g, '');
			//console.log(_x0);
			var _x1 = _x0.split('\n');
			//console.log(_x1);
			//var _x2 = [];
			for (var i in _x1) {
				if (_x1[i].length >1 && _x1[i].indexOf('-') == -1) {
					var _x3 = _x1[i].split('|');
					//console.log(_x3);
					R.status.piface2[_x3[1]] = {digital: _x3[2], analog: _x3[3]};
				}
			}
			//console.log(_x2);
		}
		if (arguments[0] && arguments[0].callback && typeof(arguments[0].callback) === 'function') {
			arguments[0].callback(R.status.piface2);
		} else {
			console.log("piface2 status");
			console.log(R.status.piface2);
		}
	}});
	return;

});

