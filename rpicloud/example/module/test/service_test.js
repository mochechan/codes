var service = require('../service.js');

var s1 = new service({});

console.log(s1);
s1.start();
console.log(s1);
s1.stop();
console.log(s1);

