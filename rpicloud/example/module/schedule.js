/* scheduler
	schedule {add: {tags:[], event: "", args: {}, callback: function () {}, suspended: false} }
schedule {"add": {"tags":[], "event": "", "args": {}, "suspended": false} }
*/
var schedule = [{id:"xxx", tags:[], event: "", args: {}, callback: function(){}, suspended: false}];
// schedule[i].timeout = {hour: 10, minute: 10, second: 10} run once
// schedule[i].interval = {hour: 10, minute: 10, second: 10} run always
// schedule[i].exact = {hour: 10, minute: 10, second: 10} at exact time


R.event.on("schedule", function(){
	//var args = arguments.splice(1,1);
	console.log("schedule XXXXXXXXXXXXXXXXXX");
	console.log(arguments);
	for (var i in arguments[0]) {
		switch(i) {
			case 'add': 
				if (!arguments[0][i]){
					console.log("no input");
					return;
				}
				if (typeof(arguments[0][i]) !== 'object') {
					console.log("input is not an object");
					return;
				}
				var item = arguments[0][i];
				if (!item.tags || !Array.isArray(item.tags)) {
					console.log("tags is not an array");
					return;
				}
				console.log("item");
				console.log(item);

			break;
			default: 
				console.log("incorrect action");
			break;
		}

	}

	switch(arguments[0].action){
		case 'add':
			console.log("add");
			console.log(R.utility.guid());
			console.log(R.utility.short_guid());
			var id = R.utility.short_guid();

		break;
		case 'del':
		break;
		case 'enable':
		break;
		case 'disable':
		break;
		case 'update':
		break;
		case 'list':
			console.log(schedule);
		break;
		case '':
		default:
			console.log("schedule: incorrect command");
		break;
	}
});



