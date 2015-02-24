var dependencies = require('../../package.json').optionalDependencies;

var libs = [];
for(var dependency in dependencies) {
  libs.push(dependency);
}

module.exports = libs;