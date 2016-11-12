#!/usr/bin/env node
"use strict";
var http = require('http');
var url = require('url');
var dht22 = require('node-dht-sensor');

if (dht22.initialize(22,4)) setInterval(function(){
	http.get(url.parse("http://src.imoncloud.com:38070/event/update_HT?dht22=" + JSON.stringify(dht22.read())), function(res) {
		res.on('data', function (chunk) { console.log(JSON.parse(chunk.toString())); });
		}).on('error', function(e) { console.log("Got error: " + e.message); });
	}, 3000);
else console.log("failed to initialize.");
