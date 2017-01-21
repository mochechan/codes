
const cp = require("child_process");

var log, _rc;


module.exports = {
	piface2: function() {
		if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
			log = arguments[0]._rc.log;
			_rc = arguments[0]._rc;
		} else log = console.log;
		var args = arguments[0].args;


		console.log("===== piface2: ");
		console.log(arguments);

		for(var i in args.on){
			var cmd = ("sudo gpio -p write " + (200 + args.on[i]) + " 1");
			console.log(cmd);
			cp.exec(cmd);
		}

		for(var i in args.off){
			var cmd = ("sudo gpio -p write " + (200 + args.off[i]) + " 0");
			console.log(cmd);
			cp.exec(cmd);
		}


	},
}



