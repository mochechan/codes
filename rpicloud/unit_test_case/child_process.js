
var assert = R.node.assert;

R.event.emit("exec", {command: "pwd", callback: function(error, stdout, stderr){
	assert.equal(error, null, "exec");
	assert.equal(typeof(stdout) === 'string', true, "exec");
	assert.equal(stdout.length > 0, true, "exec");
	assert.equal(typeof(stderr) === 'string', true, "exec");
}} );

R.event.emit("spawn", 
	{	command: "du",
		args: [],
		options: {},
		stderr: function(data){
			console.log("stderr:" + data);
		},
		stdout: function(data){
			console.log("stdout:" + data);
		},
		close: function(code){
			console.log("on_close: " + code);
		},
});


