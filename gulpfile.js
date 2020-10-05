'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');

var ASSETS_ROOT = './src';
var DEST_ROOT = './public/assets';

sass.compiler = require('node-sass');

//SASS FUNCTIONS
gulp.task('build:css', function () {
    return gulp
        .src(`${ASSETS_ROOT}/scss/*.scss`)
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(gulp.dest(`${DEST_ROOT}/css`))
});

//JS FUNCTIONS
gulp.task('build:js', function () {
    return gulp
        .src(`${ASSETS_ROOT}/js/*.js`)
        .pipe(uglify())
        .pipe(replace(/ {2,}/g, ''))
        .pipe(replace(/\n/g, ''))
        .pipe(gulp.dest(`${DEST_ROOT}/js`))
});


//STARTERS
//WACHER
gulp.task('dev-build', function () {
    gulp.watch(`${ASSETS_ROOT}/scss/**/*.*`, gulp.series('build:css'));
    gulp.watch(`${ASSETS_ROOT}/js/*.js`, gulp.series('build:js'));
});

//PROD
gulp.task('build', gulp.series('build:css', 'build:js'));
