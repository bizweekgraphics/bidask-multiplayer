'use strict';

var ko = require('knockout');

function Order(data) {
  this.price = data.price;
  this.side = data.side;
  this.spread = ko.observable(false);
  this.filled = ko.observable(false);
}

module.exports = Order;
