'use strict';

var ko = require('knockout');

function Order(data) {
  this.price = data.price;
  this.fixed = ko.observable(false);
  this.side = data.side;
  this.spread = ko.observable();
}

module.exports = Order;