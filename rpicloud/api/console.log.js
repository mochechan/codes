/* to dump a runtime variable 
issue: some problems
*/


var log, _rc;
module.exports = function () {
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		_rc = arguments[0]._rc;
		log = arguments[0]._rc.log;
	} else log = console.log;
	var args = arguments[0].args;

	console.log("in console.log");
	console.log(arguments);

	if (args && typeof(args) === 'string') {
		try {
			console.log(eval(args));
		} catch (error) {
			log(error);
			log(error.stack);
			return;
		}

		var eval_;
		try {
			eval_ = eval(args);
		} catch (err) {
			log(err);
			log(err.stack);
			return;
		}

		if (typeof(eval_) === 'object') {
			var result = [];
			for (var i in eval(args)) {
				result.push(i);
			}
			if (result.length > 0) log(result);
		} else {
			log(typeof(eval_));
		}
	} else {
		log("invalid args");
	}
	return this;
}

