/* to eval();
*/

R.event.on("eval", function(arg){
	//console.log("in eval XXXXXXXXXXXXXXXXXX");
	//console.log(arguments);

	if (!arguments[0]) {
		console.log("no any input");
		return;
	}

	if (typeof(arguments[0]) != 'string') {
		console.log("not a string");
		return;
	}

	try {
		eval(arguments[0]);
	} catch (e) {
		R.log(e);
	}

});

