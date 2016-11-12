module.exports = function demo1() {
	var log;
	if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') log = arguments[0]._rc.log;
	else log = console.log;

	console.log("This is the demo1 event.");
	console.log(arguments);
	console.log(arguments[0].args);
	if (typeof(arguments[0]) === 'function') arguments[0]("This is a demo event.");
	log("The log works in demo1.");
}
