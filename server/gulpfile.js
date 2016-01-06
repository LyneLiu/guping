var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var react = require('gulp-react');
var nodemon = require('gulp-nodemon');
// var browserify = require('gulp-browserify');
var source = require("vinyl-source-stream");
var browserify = require('browserify');
var reactify = require('reactify');

gulp.task('mocha', function () {
    gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log);
});

gulp.task('watch-mocha', function () {
  gulp.watch(['test/**'], ['mocha']);
});

/*
gulp.task('jsx', function () {
  return gulp.src('public/js/ *.jsx')
  .pipe(react())
  .pipe(gulp.dest('public/dist'));
});

gulp.task('watch-jsx', function () {
  gulp.watch(['public/js/ *.jsx'], ['jsx']);
});
*/

gulp.task('browserify', function(){
  var b = browserify();
  b.transform(reactify); // use the reactify transform
  b.add('../client/js/app.jsx');
  return b.bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('public/dist'));
});

gulp.task('start', function () {
  nodemon({
    script: 'bin/www'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('default', function () {
    // gulp.run('mocha', 'watch-mocha', 'jsx', 'watch-jsx', 'start', 'scripts');
    gulp.run('browserify', 'start');
});
