/* to control RPI's gpio pins
*/
var gpio_table = {};

R.event.on("gpio", function(){
	console.log("gpio XXXXXXXXXXXXXXXXXX");
	console.log(arguments[0]);
	
	switch(arguments[0][0]){
		case 'init':
			// gpio mode 1 in; gpio mode 2 out; 
		break;
		case 'on':
			R.event.emit("child_process", "exec", "gpio");
		break;
		case 'off':
			R.event.emit("child_process", "exec", "gpio");
		break;
		case 'write':
			R.event.emit("child_process", "exec", "gpio");
		break;
		case 'read':
			R.event.emit("child_process", "exec", "gpio");
		break;
		case 'readall':
			R.event.emit("child_process", "exec", "gpio readall", function (err, stdout, stderr) {

			});
		break;
		default:
			console.log("on/off/write/read");
		break;
	}
});


