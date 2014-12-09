var gulp = require('gulp');
var connect = require('gulp-connect');
var colors = require('colors');
var watch = require('gulp-watch');

var wiredep = require('wiredep').stream;

gulp.task('bower', function () {
  gulp.src('index.html')
    .pipe(wiredep({
      optional: 'configuration',
      goes: 'here'
    }))
    .pipe(gulp.dest('./dest'));
});

gulp.task('dev', function() {
  // Start a server
  connect.server({
    root: '',
    port: 3000,
    livereload: true
  });
  console.log('[CONNECT] Listening on port 3000'.yellow.inverse);
  // Watch HTML files for changes
  console.log('[CONNECT] Watching files for live-reload'.blue);
  watch({
    glob: ['./js/**.js', './css/**.css', './index.html']
  })
    .pipe(connect.reload());
});