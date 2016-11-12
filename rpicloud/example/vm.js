var util = require('util');
var vm = require('vm');
 
vm.runInThisContext(' hello = "world"; util.log("Hello " + hello);');
//vm.runInNewContext('var hello1 = "world";');

console.log(hello);
//console.log(hello1);

