#!/usr/bin/env node
'use strict'

// to load rpicloud
var Rc = require('./index.js')

// to new an rpicloud instance
var rcTest = new Rc({verbose: true})

// Because waiting to new an instance is necessary, please use setTimeout to postpond your using.

setTimeout(function () {
  // These are demos how to use rpicloud.
  rcTest.add_api({api: 'test',
    callback: function () {
      console.log('testing added callback')
    // console.log(arguments);
    }})
  rcTest.call_api({api: 'readline'}) // enabling command line interface
  rcTest.call_api({api: 'restify_server_start', args: {port: 9999, html: __dirname}})
  rcTest.call_api({api: 'udp_server', args: {port: 9998}})
  rcTest.log('testing rc.log() ')
  rcTest.call_api({api: 'test', args: {'it': 'is just a test'}})
  rcTest.call_api({api: 'nbg6817', args: {}})
  // rcTest.call_api({api: 'sivann_ble', args: {'command': 'init'}})
  // console.log(rc_test.list_api());
}, 399)
