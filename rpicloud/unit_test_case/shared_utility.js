
var assert = R.node.assert;
var u = R.shared_utility;

assert.equal(u.validate(true,"boolean"), true, "validate");
assert.equal(u.validate(false,"boolean"), true, "validate");
assert.equal(u.validate(null,"object"), true, "validate");
assert.equal(u.validate(function(){},"function"), true, "validate");
assert.equal(u.validate("ABC","string"), true, "validate");
assert.equal(u.validate("","string"), true, "validate");
assert.equal(u.validate('',"string"), true, "validate");
assert.equal(u.validate((typeof 1),"string"), true, "validate");
assert.equal(u.validate(123,"number"), true, "validate");
assert.equal(u.validate(12.3,"number"), true, "validate");
assert.equal(u.validate(Math.LN2,"number"), true, "validate");
assert.equal(u.validate(Infinity,"number"), true, "validate");
assert.equal(u.validate(NaN,"number"), true, "validate");
assert.equal(u.validate({a:123},"object"), true, "validate");
assert.equal(u.validate([123],"object"), true, "validate");
assert.equal(u.validate([123],"array"), true, "validate");
assert.equal(u.validate(undefined,"undefined"), true, "validate");

assert.equal(u.validate([123],undefined), false, "validate");

assert.equal(u.validate({a:'',b:123,c:{},d:false,e:function(){}},{a:'string',b:'number',c:'object',d:'boolean',e:'function'}), true, "validate");
assert.equal(u.validate({a:'',b:123,c:{},d:false,e:function(){}},{a:'istring',b:'number',c:'object',d:'boolean',e:'function'}), false, "validate");


assert.equal(u.endsWith('abc','c'), true, "utility.endsWith");
assert.equal(u.endsWith('123','3'), true, "utility.endsWith");
assert.equal(u.endsWith('abcd','c'), false, "utility.endsWith");
assert.equal(u.endsWith('1234','3'), false, "utility.endsWith");

assert.equal(u.endsWith('abc','a'), false, "utility.endsWith");
assert.equal(u.endsWith('123','1'), false, "utility.endsWith");
assert.equal(u.endsWith('abcd','b'), false, "utility.endsWith");
assert.equal(u.endsWith('1234','2'), false, "utility.endsWith");

assert.equal(typeof(u.timestamp()) === 'string', true, "utility.timestamp");
assert.equal(u.timestamp().length === 14, true, "utility.timestamp");

assert.equal(typeof(u.guid()) === 'string', true, "utility.guid");
assert.equal(u.guid().length === 36, true, "utility.guid");

assert.equal(typeof(u.short_guid()) === 'string', true, "utility.short_guid");
assert.equal(u.short_guid().length === 4, true, "utility.short_guid");

//assert.equal(true,false,"test");

