'use strict';

var io = require('socket.io-client');
var host = location.origin.replace(/^http/, 'ws')
var socket = io.connect(host);


module.exports = socket;