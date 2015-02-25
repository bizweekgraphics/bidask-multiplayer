'use strict';

var ko = require('knockout');
var d3 = require('d3');
var $ = require('jquery');
require('./vendor/jquery-ui.js');
var Order = require('./order.js');

function StockMarketViewModel() {
  var self = this;

  self.orders = ko.observableArray([]);

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
        }
      };

      viewModel.side === 'ask' ? orderEl.draggable(dragConfig) : orderEl.droppable(dropConfig);

    }
  }

  function updateSpread(drag, drop) {
    var spread = ko.dataFor(drop).price - ko.dataFor(drag).price;
    ko.dataFor(drag).spread(spread);
  }
}

module.exports = StockMarketViewModel;