'use strict';

var ko = require('knockout');

function Order(data) {
  this.price = data.price;
  this.fixed = ko.observable(false);
  this.bid = data.bid;
  this.ask = data.ask;
}

module.exports = Order;