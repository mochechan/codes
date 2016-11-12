var x = require('../api/timer.js');

var counter = 0;
var cb = function () {
	console.log(++counter);
}

x.add_interval({args:{name: "name", period: 3, life: 3, callback: cb}});
x.add_interval({args:{name: "name", period: 3, life: 3, callback: cb}});
x.add_interval({args:{name: "name", period: 3, life: 3, callback: cb}});
x.add_interval({args:{name: "name2", period: 3, life: 3, callback: cb}});
x.add_interval({args:{name: "name3", period: 3, life: 3, callback: cb}});
x.add_interval({args:{name: "name2", period: 3, life: 3, callback: cb}});
x.list_interval();
x.enable_interval();
