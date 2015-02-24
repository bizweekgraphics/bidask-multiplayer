var gulp = require('./gulp')([
  'watch',
  'browserify',
  'vendor',
  'sass',
  'jshint',
  'nodemon',
  'browser-sync',
  'html'
])

gulp.task('default', ['sass', 'html', 'jshint', 'vendor', 'browserify', 'nodemon', 'browser-sync', 'watch']);
