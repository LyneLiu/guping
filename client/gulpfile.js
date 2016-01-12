var gulp = require('gulp');
// var browserify = require('gulp-browserify');
var source = require("vinyl-source-stream"); // instead gulp-browserify
var browserify = require('browserify');
var reactify = require('reactify');
var babelify = require("babelify");
var browserifyShim = require("browserify-shim");

/*
gulp.task("browserify",function(){
    return browserify()
        .add('js/app.jsx')
        .transform(reactify)
        // .transform(babelify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});
*/

gulp.task("browserify",function(){
    return browserify({entries: 'js/app.jsx', extensions: ['.jsx'], debug: true})
        .transform('babelify', {presets: ['es2015', 'react']})
        .transform(browserifyShim, {
            shim:{
                "cli-jquery":"global:$"
            }
         })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', function () {
    gulp.watch(['js/*.jsx'], ['browserify']);
});
