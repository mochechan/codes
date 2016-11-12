/*
var s = new service({
	"name": 'This is my service name.',
	"start_callback": function () {}, 
	"stop_callback": function () {},
});
*/

function service () {
	var that = this;
	that.status = 'pending';
	that.name = arguments[0].name || 'noname';
	that.start_callback = arguments[0].start || function () {console.log('no given start callback');};
	that.stop_callback = arguments[0].stop || function () {console.log('no given stop callback');};
}

service.prototype.start = function (){
	this.status = 'started';
	if (typeof(this.start_callback) === 'function') this.started = this.start_callback(arguments)
	else return false;
}

service.prototype.stop = function (){
	this.status = 'stopped';
	if (typeof(this.stop_callback) === 'function') this.stopped = this.stop_callback(arguments)
	else return false;
}



module.exports = service;


