#!/usr/bin/env node
"use strict";
var http = require('http');
var url = require('url');
var dht22 = require('node-dht-sensor');

if (dht22.initialize(11,12)) setInterval(function(){
	console.log(dht22.read());
}, 1000);
else console.log("failed to initialize.");
