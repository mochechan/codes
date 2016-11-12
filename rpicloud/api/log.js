
module.exports = function log(msg) {
	var log, _rc;
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') log = arguments[0]._rc.log;
	else log = console.log;

	//console.log(msg);
	log(msg.args.msg);
}
