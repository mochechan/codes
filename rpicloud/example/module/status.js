var log = R.log;
//var blocked = require('blocked');
var ping = require('ping');


// showing warning message if some functions blocked. 
//R.npm.blocked(function(ms){
	// cannot use R.log() here, no idea why.
  //console.log('WARN: SOME FUNCTIONS BLOCKED FOR %sms', ms | 0);
  //console.log(new Date());
	//console.log(arguments); // useless
//});
// test case:
//setInterval(function(){ Array(100000000).join('a') }, 3000);

R.service.timers.cpu_temperature = setInterval(function () {

	R.event.emit("exec", {command: "vcgencmd measure_temp", 
		callback: function (err, stdout, stderr) {
			if (err) return;
			var temp = stdout.toString();
			var temp = temp.replace('temp=','');
			var temp = temp.replace('\'C\n','');
			//console.log(temp);
			R.status.cpu_temperature = parseFloat(temp);
	}});

	R.event.emit("exec", {command: "cat /proc/meminfo",
		callback: function (err, stdout, stderr) {
			if (err) return;
			R.status.meminfo = {};
			var item1 = stdout.split('kB\n');
			for (var i in item1) {
				if (item1[i].length < 2) continue;
				var item2 = item1[i].replace(/ /g,'');
				var item3 = item2.split(':');
				R.status.meminfo[item3[0]] = item3[1];
			}
	}});

	R.event.emit("exec", {command: "cat /proc/cpuinfo",
		callback: function (err, stdout, stderr) {
			if (err) return;
			R.status.cpuinfo = stdout;
	}});

  ping.sys.probe('google.com', function(isAlive){
    //var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
		if (isAlive) {
			R.status.internet_connected = true;
			R.event.emit("google_reachable", {});
		} else {
			if (R.status.internet_connedted === true) log("Internet is disconnected.");
			R.status.internet_connected = false;
			R.event.emit("google_unreachable", {});
		}
  });

	//FIXME
	R.event.emit("exec", {command: "top -d 0.5 -b -n2",
		callback: function (err, stdout, stderr) {
			if (err) return;
			//console.log(stdout);
	}});
}, 3000);


 
