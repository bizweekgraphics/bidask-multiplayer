var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'bidask-multiplayer'
    },
    port: 4000
  },

  test: {
    root: rootPath,
    app: {
      name: 'bidask-multiplayer'
    },
    port: 4000    
  },

  production: {
    root: rootPath,
    app: {
      name: 'bidask-multiplayer'
    },
    port: process.env.PORT    
  }
};

module.exports = config[env];