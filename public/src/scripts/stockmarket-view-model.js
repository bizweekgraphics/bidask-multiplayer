'use strict';

var ko = require('knockout');
var d3 = require('d3');
var $ = require('jquery');
require('./vendor/jquery-ui.js');
var Order = require('./order.js');
var FilledOrder = require('./filled-order.js');

var io = require('socket.io-client');
var host = location.origin.replace(/^http/, 'ws')
var socket = io.connect(host);

function StockMarketViewModel() {
  socket.on('connect', function() {
    console.log('connected');
  })

  socket.on('update', function(data) {
    console.log(data);
    var orders = jsonToModels(data);
    self.orders(orders);
  })

  function jsonToModels(data) {
    return JSON.parse(data).map(function(item) {
      if(item.side === 'filled') {
        return new FilledOrder(item);
      } else {
        return new Order(item);
      }
    });
  }


  var self = this;

  self.orders = ko.observableArray([]);
  self.cash = ko.observable(0);

  self.addOrder = function() {
    var newOrder = generateOrder();
    self.orders.push(newOrder);
  }

  function generateOrder() {
    var priceMean = 19.02;
    var priceStdev = 4;

    var side = Math.random() < 0.5 ? 'bid' : 'ask';
    var price = d3.random.normal(priceMean, priceStdev)().toFixed(2);

    return new Order({price: price, side: side})
  }

  function updateSpread(drag, drop) {
    var spread = ko.dataFor(drop).price - ko.dataFor(drag).price;
    ko.dataFor(drag).spread(parseFloat(spread.toFixed(2)));
  }

  function updateCash() {

    var cash = self.orders().filter(function(order) {
      return order.side === 'filled';
    }).map(function(order) {
      return parseFloat(order.spread());
    }).reduce(function(prev, curr) {
      return prev + curr;
    });

    self.cash(cash.toFixed(2));
  }

  ko.bindingHandlers.dragdrop = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

      var orderEl = $(element);

      var dragConfig = {
        revert: "invalid",
        opacity: 1,
        snap: ".ui-droppable",
        snapMode: "inner"
      };

      var dropConfig = {
        over: function(event, ui) {
          var dragEl = ui.draggable[0];
          var dropEl = event.target

          updateSpread(dragEl, dropEl)
        },
        out: function(event, ui) {
          ko.dataFor(ui.draggable[0]).spread(false);
        },
        drop: function(event, ui) {
          var dragData = ko.dataFor(ui.draggable[0]);
          var dropData = ko.dataFor(event.target);


          var dragIndex = self.orders.indexOf(dragData);
          var dropIndex = self.orders.indexOf(dropData);   

          var filledOrder = new FilledOrder({spread: dragData.spread()})

          self.orders()[dropIndex] = filledOrder;
          self.orders.splice(dragIndex, 1);

          socket.emit('update', ko.toJSON(self.orders()));

          updateCash();
        }
      };

      viewModel.side === 'ask' ? orderEl.draggable(dragConfig) : orderEl.droppable(dropConfig);

    }
  }
}

module.exports = StockMarketViewModel;