'use strict';

var ko = require('knockout');

function FilledOrder(data) {
  this.player = ko.observable(data.player);
  this.spread = ko.observable(data.spread);
  this.side = 'filled';
}

module.exports = FilledOrder


//On drop, ping ID to server, on confirmation, show changes locally, then ping new array to server, which is transmitted back to both