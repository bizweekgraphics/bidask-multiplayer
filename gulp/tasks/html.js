var gulp = require('gulp');
var htmlMin = require('gulp-minify-html');
var reload = require('browser-sync').reload;

module.exports = function() {
  gulp.task('html', function() {
    gulp.src(['./public/src/index.html'])
      .pipe(htmlMin({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(gulp.dest('./public/'))
      .pipe(reload({stream: true}));
  });  
};

