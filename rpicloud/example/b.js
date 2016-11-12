var blocked = require('blocked');
 
setInterval(function(){
  Array(10000).join('a')
}, 3000);
 
blocked(function(ms){
  console.log('BLOCKED FOR %sms', ms | 0);
});
