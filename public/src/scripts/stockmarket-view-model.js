'use strict';

var ko = require('knockout');
var d3 = require('d3');
var $ = require('jquery');
require('./vendor/jquery-ui.js');
var Order = require('./order.js');
var FilledOrder = require('./filled-order.js');
var Player = require('./player');

var socket = require('./websockets.js');

function StockMarketViewModel() {
  socket.on('connect', function() {
    self.player = 'player' + Date.now();
    socket.emit('new-player', self.player);
  })

  socket.on('update', function(data) {
    var orders = jsonToModels(data);
    self.orders(orders);
    updateCash();
  })

  socket.on('new-offer', function(data) {
    console.log('new offer')
    var newOrder = new Order(data);
    self.orders.push(newOrder);
  });

  socket.on('new-player', function(data) {
    if(self.players.indexOf(data) === -1) {
      var newPlayer = new Player({name: data});
      self.players.push(newPlayer);    
    }
  })

  function jsonToModels(data) {
    return JSON.parse(data).map(function(item) {
      return item.side === 'filled' ? new FilledOrder(item) : new Order(item);
    });
  }


  var self = this;

  self.orders = ko.observableArray([]);
  self.cash = ko.observable(0);
  self.players = ko.observableArray([])
  self.player;

  function updateSpread(drag, drop) {
    var spread = ko.dataFor(drop).price - ko.dataFor(drag).price;
    ko.dataFor(drag).spread(parseFloat(spread.toFixed(2)));
  }

  function updateCash() {
    self.players().forEach(function(player, index) {
      var cash = self.orders().filter(function(order) {
        return order.side === 'filled' && order.player === player.name;
      }).map(function(order) {
        return parseFloat(order.spread());
      }).reduce(function(prev, curr) {
        return prev + curr;
      }, 0);

      self.players()[index].cash(cash);
    })

    console.log(self.players());

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

          var filledOrder = new FilledOrder({player: self.player, spread: dragData.spread()})

          self.orders()[dropIndex] = filledOrder;
          self.orders.splice(dragIndex, 1);

          socket.emit('update', ko.toJSON(self.orders()));

        }
      };

      viewModel.side === 'ask' ? orderEl.draggable(dragConfig) : orderEl.droppable(dropConfig);

    }
  }
}

module.exports = StockMarketViewModel;