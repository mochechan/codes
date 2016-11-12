var p = function (arg) {
	for (var i in arg) {
		if (typeof(arg[i]) !== "function") {
			console.log("" + i + ": ");
			console.log(arg[i]);
		}
	}
}
p(process);
