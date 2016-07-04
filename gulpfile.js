var gulp = require('gulp'),
	ngAnnotate = require('gulp-ng-annotate'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	sass = require('gulp-sass'),
	cssMin = require('gulp-minify-css');

//JS files builder
gulp.task('scripts', function(){
	gulp.src('public/app/*.js')
		.pipe(concat('app.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('public/build'));
});
//Scss compilation task
gulp.task('sass', function(){
	return gulp.src('public/scss/style.scss')
		   .pipe(sass())
		   .pipe(cssMin())
		   .pipe(gulp.dest('public/css'))
});
//Default task
gulp.task('default', ['scripts', 'sass']);