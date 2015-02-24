'use strict';

var ko = require('knockout');

function Bid(data) {
  this.price = data.price;
  this.fixed = ko.observable(false);
}

module.exports = Bid;