var d3 = require('d3');

function wssController(io) {
  io.on('connection', function(socket) {
    console.log('connection made');

    socket.on('update', function(data) {
      io.sockets.emit('update', data);
    });

    socket.on('new-player', function(data) {
      io.sockets.emit('new-player', data);
    })
  });

  setInterval(function() {
    io.sockets.emit('new-offer', generateOrder());
  }, 1500)

  function generateOrder() {
    var priceMean = 19.02;
    var priceStdev = 4;

    var side = Math.random() < 0.5 ? 'bid' : 'ask';
    var price = d3.random.normal(priceMean, priceStdev)().toFixed(2);

    return {price: price, side: side};
  }
}

module.exports = wssController;