/* to quit rpicloud
*/

var log, _rc;

module.exports = function quit () {
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') {
		log = arguments[0]._rc.log;
		_rc = arguments[0]._rc;
	} else log = console.log;
	log("in quit");
	//log(arguments);
	var args = arguments[0].args || {};
	//console.log(args);

	//arguments[0].parent.event.on("quit", function(){ });

	if (args && args.confirmed && args.confirmed === 'yes') {
		log("The rpicloud is going to quit.");
		setTimeout(function(){
			process.exit(0);
		}, 567);
	} else {
		log('confirmed:yes to confirm to exit');
	}
}

