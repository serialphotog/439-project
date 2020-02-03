var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var fancy_log = require('fancy-log');

var paths = {
	pages: ['src/html/**/*.html'],
	styles: ['src/css/**/*.css'],
	js: ['src/js/**/*.js'],
};

// The watch task
var watched = watchify(browserify({
	basedir: '.',
	debug: true,
	entries: './src/js/calculator.js',
	cache: {},
	packageCache: {}
})).on('error', (err) => {
	console.log(err.message);
	this.emit('end');
});

// copies all of the html resources to the final distribution directory
gulp.task('copy-html', () => {
	return gulp.src(paths.pages)
		   	.pipe(gulp.dest('dist'));
});

// Performs the full assets copy
gulp.task('copy', gulp.series(gulp.parallel('copy-html'), () => {
	return gulp.src(paths.styles)
			.pipe(gulp.dest('dist/css'));
}));

// Bundles all of the Javascript resources
function bundle() {
	return watched.bundle()
			.on('error', fancy_log)
			.pipe(source('calc.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/js'));
}

// Watches for changes to watched files
gulp.task('watch', () => {
	gulp.watch(['src/css/**/*.css', 'src/html/**/*.html'], gulp.parallel('copy'));
	gulp.watch(['src/js/**/*.js'], bundle);
});

// Setup the tasks
gulp.task('default', gulp.series(gulp.parallel('copy'), bundle, gulp.parallel('watch')));
watched.on('update', bundle);
watched.on('log', fancy_log);