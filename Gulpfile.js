var gulp = require('gulp'),
	coffee = require('gulp-coffee'),
	compass = require('gulp-compass'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	coffeeify = require('coffeeify'),
	browserify = require('browserify'),
	transform = require('vinyl-transform'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserSync = require('browser-sync'),
	minify = require('minify'),
	plumber = require('gulp-plumber'),
	gutil = require('gulp-util'),
	rename = require('gulp-rename'),
	gzip = require('gulp-gzip');

gulp.task('compass', function(){
	gulp.src('app/source/sass/stylesheet.scss')
	.pipe(compass({
		css:'app/public/css'
		,sass:'app/source/sass'
		,image:'app/source'
		,generated_images_path:'app/public/img'
		,relative_assets: true
		,task: "watch"
	}))
	.on('error', handleErrors);
});

gulp.task("browserify_main",function() {
	browserify({
		entries: ["app/source/coffee/app.coffee"],
		extensions: [".coffee"],
		transform: ["coffeeify"] // npm install --save-dev coffeeify
	})
	.bundle()
	.on('error', console.log)
	.pipe(source('app.js'))
	.pipe(buffer())
	.pipe(gulp.dest('app/public/js'));
});

gulp.task('vendors', function(){
	gulp.src('app/source/libs/**/*.js')
		.pipe(concat('vendors.js'))
		.on('error', console.log)
		.pipe(gulp.dest('app/public/js/libs'))
});

gulp.task('browser_sync', function(){
	config = {
		server: {
			baseDir: 'app/public',
		},
		open: false
	}
	browserSync(config);
});

gulp.task('gzip', function() {
  return gulp.src('app/public/**/*.{html,xml,json,css,js}')
    .pipe(gzip({}))
    .pipe(gulp.dest('app/public/'));
});

function handleErrors(e){
	gutil.log(e)
}

gulp.task('watch', function (){
	gulp.watch('app/source/coffee/**/*.coffee', ['browserify_main']);
	gulp.watch('app/source/libs/**/*.js', ['vendors']);
});

gulp.task ('minify', function(){
	return gulp.src('app/public/js/*.js')
    .pipe(uglify({mangle: false}))
	.pipe(rename({
    	basename: "app",
		suffix: ".min",
    	extname: ".js"
	}))
    .pipe(gulp.dest('app/public/js/'));
})

gulp.task('default',  ['vendors', 'browserify_main', 'compass', 'browser_sync', 'watch']);
gulp.task('fast',  ['vendors', 'browserify_main', 'compass', 'watch']);
gulp.task('run',  ['vendors', 'minify', 'gzip']);

gulp.task('build', ['vendors', 'browserify_main', 'compass', 'minify']);
