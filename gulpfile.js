var gulp = require('gulp'),
  connect = require('gulp-connect'),
  sass = require('gulp-sass'),
  concat = require('gulp-concat'),
  exec = require('gulp-exec'),
  shell = require('gulp-shell'),
  run = require('gulp-run'),
  babel = require('gulp-babel');

gulp.task('connect', function() {
  connect.server({
    port: 8010,
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./app/**/*.html')
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src(['./app/**/*.js',
            'app.js',
            'dist/**/*.js'])
    .pipe(connect.reload());
});

gulp.task('scss', function() {
  gulp.src('./app/**/*.scss')
    .pipe(connect.reload());
});

gulp.task('concatAndBuildCss', function () {
  gulp.src('./app/**/*.scss')
    .pipe(concat('test.scss'))
    .pipe(sass())
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('watch', function () {
  gulp.watch(['./app/**/*.html'], ['html']);
  gulp.watch(['./app/**/*.js'], ['babelfy', 'js']);
  gulp.watch(['./app/**/*.scss'], ['concatAndBuildCss', 'scss']);
});

gulp.task('babelfy', function() {
  gulp.src('./app/components/**/*.js')
      .pipe(babel({
        presets: ['es2015']
      }))
      .pipe(gulp.dest('dist'))
});

//gulp.task('serve', ['concatAndBuildCss', 'connect', 'watch']);
gulp.task('serve', ['babelfy', 'concatAndBuildCss', 'connect', 'watch']);