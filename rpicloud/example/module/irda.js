/* to use RPI's irda
*/

/*
R.event.addListener("irda", function(){
	console.log("irdaXXXXXXXXXXXXXXXXXX");
	console.log(arguments[0]);
});
*/

R.event.on("irda", function() {
	console.log("irda on:");
	console.log(arguments[0]);
	console.log(R.event.listenerCount());
});

exports.init = function (){};
exports.send = function () {};
exports.listen = function () {};
exports.record = function () {};
exports.recordStop = function () {};

