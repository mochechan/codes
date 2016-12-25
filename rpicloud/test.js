#!/usr/bin/env node
"use strict";

// to load rpicloud
var rc = require('./index.js');

// to new an rpicloud instance
var rc_test = new rc({verbose: true});

// Because waiting to new an instance is necessary, please use setTimeout to postpond your using.


setTimeout(function(){
	// These are demos how to use rpicloud.
	rc_test.add_api({api: "test", callback: function(){
		console.log("testing added callback");
		//console.log(arguments);
	}});
	rc_test.call_api({api: "readline"}); //enabling command line interface
	rc_test.call_api({api: "restify_server_start", args: {port: 9999, html: __dirname}});
	rc_test.call_api({api: "udp_server", args: {port: 9998, }});
	rc_test.log("testing rc.log() ");
	rc_test.call_api({api: "test", args: {"it":"is just a test"}});
	//console.log(rc_test.list_api());
}, 399);


