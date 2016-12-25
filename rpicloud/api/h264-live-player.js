
const cp = require("child_process");

var log, _rc;


var x_;

module.exports = {
	start_video: function() {
		if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
			log = arguments[0]._rc.log;
			_rc = arguments[0]._rc;
		} else log = console.log;
		var args = arguments[0].args;


		log("start_video: " );
		console.log(arguments);

		x_ = cp.spawn("node", ["server-rpi.js"], {cwd: "/home/pi/h264-live-player"});
		if(typeof args.callback == "function") args.callback("video started");


	},
	stop_video: function () {
		if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
			log = arguments[0]._rc.log;
			_rc = arguments[0]._rc;
		} else log = console.log;

		log("stop_video: " );
		x_.stdin.pause();
		x_.kill();
	}
}



