'use strict';

var ko = require('knockout');

function FilledOrder(data) {
  this.player = data.player;
  this.spread = ko.observable(data.spread);
  this.side = 'filled';
}

module.exports = FilledOrder


