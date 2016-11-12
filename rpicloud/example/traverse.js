
//your object
var o = { 
    foo:"bar",
    arr:[1,2,3],
    subo: {
        foo2:"bar2"
    }
};

//called with every property and it's value
function process_(key,value) {
    console.log(key + " : "+value);
}

function traverse_object(o,func) {
    for (var i in o) {
		console.log("o:");
		console.log(o);
        if (o[i] !== null && typeof(o[i]) === "object") {
            //going on step down in the object tree!!
            process.nextTick(function(){
				traverse_object(o[i],func)
			});
        } //else {
        	func.apply(this,[i,o[i]]);  
		//}
    }
}

//that's all... no magic, no bloated framework
traverse_object(o,process_);

