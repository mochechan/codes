/* replacement of setInterval in nodejs

*/

var pool = {};
var timeout;
var _rc, log;

//input: {name: "name", period:5, life: 10, callback:function(){}, args: {}}
exports.add_interval = function () {

	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		log = arguments[0]._rc.log;
		_rc = arguments[0]._rc;
	} else log = console.log;
	var args = arguments[0].args || {};

	log("in add_interval");
	log(args);

	
	if (pool[args.name]) {
		log("replacing existing");
	} else {
		log("add a new interval");
		pool[args.name] = {
			name: args.name || 'default',
			period: args.period || 10,
			life: args.life || -1,
			callback: args.callback,
			args: args.args,
		};
	}
};



exports.enable_interval = function () { 
	timeout = setTimeout(function () {
		for (var i in pool) {
			if (!pool[i].countdown) {
				pool[i].countdown = pool[i].life;
			} else if (pool[i].countdown > 0 || pool[i].life === -1) {
				pool[i].callback(pool[i].args);
				pool[i].counterdown--;
			} else if (pool[i].countdown === 0) {
				delete pool[i];
			} else {
				log("ERROR: please debug.");
				process.exit(99);
			}

		}
		
	}, 1000);
};
exports.disable_interval = function () { };
exports.delete_interval = function () { };
exports.pause_interval = function () { };
exports.resume_interval = function () { };
exports.list_interval = function () { 
	console.log("in list_interval");
	console.log(pool);
};


