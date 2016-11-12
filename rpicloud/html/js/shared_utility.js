/* This javascript file can be shared between nodejs and browser.

http://caolan.org/posts/writing_for_node_and_the_browser/
*/

var log = console.log;

(function(exports){
	//console.log('loading shared_utility.js');


	// http://stackoverflow.com/questions/722668/traverse-all-the-nodes-of-a-json-object-tree-with-javascript
	var traverse_json = exports.traverse_json = function traverse_json(json, func, stack) {
		if (!stack) stack = [];
	  for (var i in json) {
			stack.push(i);
	    func.apply(this, [i, json[i], stack]);  
    	if (json[i] !== null && typeof(json[i]) === "object") {
  	    traverse_json(json[i], func, stack);
	    }
			stack.pop();
  	}
	}

	function processx(key, value, stack) {
		//console.log(stack);
  	//console.log(key + " : " + value);
	}

	var o = { 
    foo:"bar",
    arr:[1,2,3],
    subo: {
        foo2:"bar2"
    }
	};

	//console.log(o);
	//console.log("------");
	traverse_json(o, processx) ;

	exports.validate = function validate(input, expect) {
		if (!expect) {
			log("There's no expect.");
			return false;
		}

		if (typeof(expect) === 'string') {
			if (typeof(input) === expect) return true;
			if (expect === 'array' && Array.isArray(input)) return true;
		} else if (typeof(expect) === 'object' && typeof(input) === 'object') {
			//console.log(input);
			//console.log(expect);
			for (var i in expect) {
				//console.log("input: " + typeof(input[i]) + "   expect: " + expect[i]);
				if (typeof(input[i]) !== expect[i] ) {
					//console.log("inconsist: " + i);
					return false;
				}
			}
			return true;
		}
		return false;
	}

	exports.endsWith = function endsWith(str, suffix) {
		if (str && suffix) return str.indexOf(suffix, str.length - suffix.length) !== -1;
		else false;
	}

	exports.guid = function guid() {
  	function s4() {
    	return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
	  }
  	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

	exports.short_guid = function guid() {
  	function s4() {
    	return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
	  }
  	return s4();
	}

	exports.timestamp = function () {
		var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "" + month + "" + day + "" + hour + "" + min + "" + sec;
	}

  exports.test = function(){
    return 'shared_utility.js: hello world'
  };

})(typeof(exports) === 'undefined' ? this['shared_utility'] = {} : exports);

