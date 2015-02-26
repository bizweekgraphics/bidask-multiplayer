'use strict';

var ko = require('knockout');

function Player(data) {
  this.name = data.name;
  this.cash = ko.observable(0);
}

module.exports = Player;