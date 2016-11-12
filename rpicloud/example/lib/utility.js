/* This script provides many standalone functions.
R.validate(input, expect);
R.endsWith(string, suffix);
R.timestamp();
*/

var log = R.log || console.log;

exports.mkdirParent = function mkdirParent(dirPath, mode, callback) {
  //Call the standard fs.mkdir
  R.fs.mkdir(dirPath, mode, function(error) {
    //When it fail in this way, do the custom steps
    if (error && error.errno === 34) {
      //Create all the parents recursively
      mkdirParent(R.path.dirname(dirPath), mode, callback);
      //And then the directory
      mkdirParent(dirPath, mode, callback);
    }
    //Manually run the callback since we used our own callback to do all these
    callback && callback(error);
  });
};

//R.utility.mkdirParent('a/b/c/d/e');


// to list network interfaces
var ifaces = require('os').networkInterfaces();
var findNetworkInterfaces = function (callback) {
	var ifs = {};
	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0 ;

		ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}

			if (alias >= 1) {
				// this single interface has multiple ipv4 addresses
				//console.log(ifname + ':' + alias, iface.address);
				ifs[ifname + ':' + alias] = iface.address;
			} else {
				// this interface has only one ipv4 adress
				//console.log(ifname, iface.address);
				ifs[ifname] = iface.address;
			}
		});
	});
	callback(ifs);
}



