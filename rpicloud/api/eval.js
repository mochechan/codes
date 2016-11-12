/* to eval();
*/

module.exports = function eval_ () {
	var log, _rc;
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		log = arguments[0]._rc.log;
		_rc = arguments[0]._rc;
	} else log = console.log;

	var args = arguments[0].args;
	//console.log("in eval");
	//console.log(args);

	if (typeof(args) != 'string') {
		log("not a string");
		return;
	}

	var re;
	try {
		re = eval(args);
	} catch (e) {
		log(e);
	}

	log("The eval returns: ");
	log(re);
	return this;
}


