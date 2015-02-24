var gulp = require('gulp');
var sass = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var size = require('gulp-size');
var plumber = require('gulp-plumber');
var reload = require('browser-sync').reload;

module.exports = function() {
  gulp.task('sass', function () {
    gulp.src('./public/src/**/*.scss')
      .pipe(plumber())
      .pipe(sass({
        includePaths: [
  
        ],
      }))
      .pipe(minifycss())
      .pipe(gulp.dest('./public/build/'))
      .pipe(size())
      .pipe(reload({stream: true}));
  });
};