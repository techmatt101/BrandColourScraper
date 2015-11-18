var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', ['content', 'popup', 'background', 'icons'], function() {
    return gulp.src('app/*.*')
        .pipe(gulp.dest('dist'));
});

gulp.task('icons', function() {
    return gulp.src('app/icons/*.png')
        .pipe(gulp.dest('dist/icons'));
});

gulp.task('content', function() {
    return gulp.src('app/content/*.js')
        .pipe(concat('content.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('background', function() {
    return gulp.src('app/background/*.js')
        .pipe(concat('background.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('popup', ['popup-js'], function() {
    return gulp.src(['app/popup/*.css', 'app/popup/*.html'])
        .pipe(gulp.dest('dist'));
});

gulp.task('popup-js', function() {
    return gulp.src('app/popup/*.js')
        .pipe(concat('popup.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});