var gulp = require('gulp');
var config = require('./webpack.config.js');
var webpack = require('webpack');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');

gulp.task('webpack', function (done) {
  webpack(config, function (err, stats) {
    if (err) return done(err);
    console.log(stats.toString({ colors: true }));
    done();
  });
});

gulp.task('uglify', function () {
  return gulp.src('dist/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['webpack'], function () {
  gulp.watch('lib/*.js', ['webpack']);
});

gulp.task('build', function (done) {
  runSequence('webpack', 'uglify', done);
});
