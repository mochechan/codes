
var test_path = "./test/";
var test_require = {};
var report = ["This is a self-test report."];

var fs = R.node.fs;
var log = R.log;

var self_test = function () {
	
	fs.readdir(test_path, function(err, files) {
		//log(err);
		//log(files);
		for (var i in files) {
			if(! files[i].match(/.js$/i)) continue;
			log("self_testing: " + files[i]);
			delete require.cache[R.node.path.resolve(test_path, files[i])];
			test_require[files[i]] = require(R.node.path.resolve(test_path, files[i]));
		}
	});
}


R.event.on("self_test", function(){
	log("You should better restart rpicloud after self_test. ");
	log(arguments);
	if (arguments[0]) {
		switch(arguments[0]) {
			case 'string':
			break;
			case 'object':
				report.push(arguments[0]);
			break;
			default:
			break;
		}
	} else if (!arguments[0]) {
		self_test();
	}
});


