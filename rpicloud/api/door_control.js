var exec = require('child_process').exec;

module.exports = {
	open_downstairs: function open_downstairs () {
		console.log(arguments);
		console.log("opening downstairs");
		exec("sudo ~/pibrella_28byj 2000; sudo ~/pibrella_28byj -2000;");
	},
	open_main_gate: function open_main_gate () {

	}
}


