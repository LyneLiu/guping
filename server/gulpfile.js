var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');

gulp.task('mocha', function () {
    gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'list' }))
    .on('error', gutil.log);
});

gulp.task('start', function () {
  nodemon({
    script: 'bin/www'
  , ext: 'js html'
  , env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('default', function () {
    gulp.watch(['controllers/**'], ['mocha', 'start']);

    gulp.run('start');
});






