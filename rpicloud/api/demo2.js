var common = "common";

module.exports = {
	demo_a: function() {
		var log;
		if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') log = arguments[0]._rc.log;
		else log = console.log;

		log("this is demo_a: " + common);
	},
	demo_b: function () {
		var log;
		if (typeof(arguments[0]._rc) === 'object' && typeof(arguments[0]._rc.log) === 'function') log = arguments[0]._rc.log;
		else log = console.log;

		log("this is demo_b: " + common);
	}
}

