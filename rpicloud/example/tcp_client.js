
// client
var s = require('net').Socket();
s.connect(9997);
s.write('Hello');
s.end();


