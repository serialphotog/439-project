var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var fancy_log = require('fancy-log');

// The watch task
var watched = watchify(browserify({
	basedir: '.',
	debug: true,
	entries: './src/calc.js',
	cache: {},
	packageCache: {}
}).on('error', (err) => {
	console.log(err.message);
	this.emit('end');
})).transform('babelify', {
	presets: ['es2015']
});

// Bundles all of the Javascript resources
function bundle() {
	return watched.bundle()
			.on('error', fancy_log)
			.pipe(source('calc.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('scripts/'));
}

// Watches for changes to watched files
gulp.task('watch', () => {
	gulp.watch(['src/js/**/*.js'], bundle);
});

// Setup the tasks
gulp.task('default', gulp.series(bundle, gulp.parallel('watch')));
watched.on('update', bundle);
watched.on('log', fancy_log);