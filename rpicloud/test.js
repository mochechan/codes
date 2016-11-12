#!/usr/bin/env node
"use strict";

var rc = require('./index.js');
var rc_test = new rc({verbose: true});


// These are demos.
setTimeout(function(){
	//rc_test.call_api("open_downstairs");
	//console.log(rc_test.list_api());
rc_test.call_api({api_name: "readline"}); //enabling command line interface
rc_test.call_api({api_name: "http_server_start"});
	rc_test.log("testing rc.log() ");
}, 100);


