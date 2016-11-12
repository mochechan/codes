
var smoke = R.npm.smokesignal;

//var defaultIP = R.node.os.networkInterfaces()[wlan]; // incorrect


var node = smoke.createNode({
  port: 8495
, address: smoke.localIp('192.168.0.54/255.255.255.0') // Tell it your subnet and it'll figure out the right IP for you
, seeds: [
	{port: 8495, address:'192.168.0.54'}, 
	{port:8495, address:'192.168.0.14'}, 
	{port:8495, address: '192.168.0.102'}] // the address of a seed (a known node)
})

// listen on network events...

node.on('connect', function() {
  console.log(" Hey, now we have at least one peer!");

  // ...and broadcast stuff -- this is an ordinary duplex stream!
  node.broadcast.write('HEYO! I\'m here')
})

node.on('disconnect', function() {
  console.log(" Bah, all peers gone.");
})

// Broadcast is a stream
//process.stdin.pipe(node.broadcast).pipe(process.stdout)

// Start the darn thing
node.start()

// mah, i'd rather stop it
node.stop()


