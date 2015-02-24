'use strict';

var ko = require('knockout');

function Ask(data) {
  this.price = data.price;
  this.fixed = ko.observable(false);
}

module.exports = Ask;