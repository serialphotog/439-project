var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var fancy_log = require('fancy-log');
var qunit = require('gulp-qunit');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');

sass.compiler = require('node-sass');

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

// Compiles the SASS resources
gulp.task('sass', function() {
	return gulp.src('src/sass/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(prefix('last 2 version', 'safari 5', 'ie6', 'ie7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(minify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('styles/'));
});

// The testing task
gulp.task('test', function() {
	return gulp.src('./test/engine.html')
		.pipe(qunit());
});

// Watches for changes to watched files
gulp.task('watch', () => {
	gulp.watch(['src/js/**/*.js'], bundle);
	gulp.watch(['src/sass/**/*.scss'], gulp.parallel('sass'));
});

// Setup the tasks
gulp.task('default', gulp.series(bundle, gulp.parallel('watch')));
watched.on('update', bundle);
watched.on('log', fancy_log);