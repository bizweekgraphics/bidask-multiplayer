var gulp = require('gulp');

module.exports = function() {
  
  gulp.watch(['./app/**/*.js', './lib/**/*.js'], ['jshint']);

  gulp.watch(['./public/src/scripts/*.js'], ['browserify', 'jshint']);

  gulp.watch(['./public/src/index.html'], ['html']);

  gulp.watch('./public/src/**/*.scss', ['sass']);
};