var express = require('express');
var config = require('./config/config');
var fs = require('fs');
var app = express();


var server = app.listen(config.port);
console.log('app running on port ' + config.port);

// Execute commands in clean exit
process.on('exit', function () {
    console.log('Exiting ...');
    // close other resources here
    console.log('bye');
});

// happens when you press Ctrl+C
process.on('SIGINT', function () {
    console.log( '\nGracefully shutting down from  SIGINT (Crtl-C)' );
    process.exit();
});

// usually called with kill
process.on('SIGTERM', function () {
    console.log('Parent SIGTERM detected (kill)');
    // exit cleanly
    process.exit(0);
});

require('./config/express')(app, config);

var io = require('socket.io')(server)
require('./libs/wss-controller.js')(io);


