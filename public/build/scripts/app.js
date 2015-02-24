(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./game.js')();
},{"./game.js":2}],2:[function(require,module,exports){
(function (global){
'use strict';

var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var ko = require('knockout');

var StockMarketViewModel = require('./stockmarket-view-model.js');

module.exports = function() {
  var stockMarketViewModel;

  $(document).ready(function() {
    stockMarketViewModel = new StockMarketViewModel();
    ko.applyBindings(stockMarketViewModel);
  })
}
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./stockmarket-view-model.js":4,"knockout":"knockout"}],3:[function(require,module,exports){
'use strict';

var ko = require('knockout');

function Order(data) {
  this.price = data.price;
  this.fixed = ko.observable(false);
  this.bid = data.bid;
  this.ask = data.ask;
}

module.exports = Order;
},{"knockout":"knockout"}],4:[function(require,module,exports){
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
},{"./order.js":3,"knockout":"knockout"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvYXBwLmpzIiwicHVibGljL3NyYy9zY3JpcHRzL2dhbWUuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvb3JkZXIuanMiLCJwdWJsaWMvc3JjL3NjcmlwdHMvc3RvY2ttYXJrZXQtdmlldy1tb2RlbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9nYW1lLmpzJykoKTsiLCIndXNlIHN0cmljdCc7XG5cbnZhciAkID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuJCA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuJCA6IG51bGwpO1xudmFyIGtvID0gcmVxdWlyZSgna25vY2tvdXQnKTtcblxudmFyIFN0b2NrTWFya2V0Vmlld01vZGVsID0gcmVxdWlyZSgnLi9zdG9ja21hcmtldC12aWV3LW1vZGVsLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBzdG9ja01hcmtldFZpZXdNb2RlbDtcblxuICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICBzdG9ja01hcmtldFZpZXdNb2RlbCA9IG5ldyBTdG9ja01hcmtldFZpZXdNb2RlbCgpO1xuICAgIGtvLmFwcGx5QmluZGluZ3Moc3RvY2tNYXJrZXRWaWV3TW9kZWwpO1xuICB9KVxufSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtvID0gcmVxdWlyZSgna25vY2tvdXQnKTtcblxuZnVuY3Rpb24gT3JkZXIoZGF0YSkge1xuICB0aGlzLnByaWNlID0gZGF0YS5wcmljZTtcbiAgdGhpcy5maXhlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xuICB0aGlzLmJpZCA9IGRhdGEuYmlkO1xuICB0aGlzLmFzayA9IGRhdGEuYXNrO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9yZGVyOyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGtvID0gcmVxdWlyZSgna25vY2tvdXQnKTtcblxudmFyIE9yZGVyID0gcmVxdWlyZSgnLi9vcmRlci5qcycpO1xuXG5mdW5jdGlvbiBTdG9ja01hcmtldFZpZXdNb2RlbCgpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHNlbGYub3JkZXJzID0ga28ub2JzZXJ2YWJsZUFycmF5KFtdKTtcblxuICBzZWxmLmFkZE9yZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2coJ3Rlc3QnKTtcbiAgICB2YXIgbmV3T3JkZXIgPSBuZXcgT3JkZXIoe3ByaWNlOiA1fSk7XG4gICAgc2VsZi5vcmRlcnMucHVzaChuZXdPcmRlcik7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdG9ja01hcmtldFZpZXdNb2RlbDsiXX0=
