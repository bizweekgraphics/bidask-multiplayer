'use strict';

var ko = require('knockout');

var Order = require('./order.js');

function StockMarketViewModel() {
  var self = this;

  self.orders = ko.observableArray([]);

  self.addOrder = function() {
    console.log('test');
    var newOrder = new Order({price: 5});
    self.orders.push(newOrder);
  }
}

module.exports = StockMarketViewModel;