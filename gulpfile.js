const gulp = require('gulp');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");
const changed = require("gulp-changed");
const browserSync = require('browser-sync').create();

//setting : paths
const paths = {
    root: './dist/',
    ejs: {
        src: ['./src/ejs/**/*.ejs', '!' + './src/ejs/**/_*.ejs'],
        watch: './src/ejs/**/*.ejs',
        dist: './dist/'
    },
    styles: {
        src: './src/assets/sass/**/*.scss',
        dist: './dist/css/'
    },
    images: {
        src: [
            './src/assets/images/**/*.jpg',
            './src/assets/images/**/*.png',
            './src/assets/images/**/*.gif',
            './src/assets/images/**/*.svg',
            './src/assets/images/**/*.ico'
        ],
        dist: './dist/images/'
    },
    scripts: {
        src: './src/assets/js/**/*.js',
        dist: "./dist/js/"
    }
};

//gulpコマンドの省略
const { watch, task, src, dest, parallel } = require('gulp');

//ejs
gulp.task('ejs', function () {
    return (
        src(paths.ejs.src)
            .pipe(plumber({
                errorHandler: notify.onError({
                    title: 'ejsエラーだよ',
                    message: '<%= error.message %>'
                })
            }))
            .pipe(ejs({}, {}, { ext: '.html' }))
            .pipe(rename({
                extname: '.html'
            }))
            .pipe(gulp.dest(paths.ejs.dist))
    );
});

//Sass
gulp.task('sass', function () {
    return (
        src(paths.styles.src)
            .pipe(plumber({
                errorHandler: notify.onError({
                    title: 'Sassエラーだよ',
                    message: '<%= error.message %>'
                })
            }))
            .pipe(sassGlob())
            .pipe(sass({
                outputStyle: 'compressed'
            }))
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(autoprefixer({
                browsers: ['ie >= 11'],
                cascade: false,
                grid: true
            }))
            .pipe(gulp.dest(paths.styles.dist))
    );
});

//JS Compress
gulp.task('js', function () {
    return (
        src(paths.scripts.src)
            .pipe(plumber({
                errorHandler: notify.onError({
                    title: 'jsエラーだよ',
                    message: '<%= error.message %>'
                })
            }))
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest(paths.scripts.dist))
    );
});

gulp.task('images', function() {
    return (
        src(paths.images.src)
            .pipe(changed(paths.images.dist))
            .pipe(plumber({
                errorHandler: notify.onError({
                    title: 'imgエラーだよ',
                    message: '<%= error.message %>'
                })
            }))
            .pipe(
                imagemin([
                    pngquant({
                        quality: [.7, .85],
                        speed: 1
                    }),
                    mozjpeg({
                        quality: 85,
                        progressive: true
                    })
                ])
            )
            .pipe(gulp.dest(paths.images.dist))
    );
});

// browser-sync
task('browser-sync', () => {
    return browserSync.init({
        server: {
            baseDir: paths.root,
            index: 'index.html'
        },
        port: 8080,
        reloadOnRestart: true
    });
});

// browser-sync reload
gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

//watch
gulp.task('watch', (done) => {
    watch(paths.ejs.watch, gulp.task('ejs'));
    watch(paths.styles.src, gulp.task('sass'));
    watch(paths.scripts.src, gulp.task('js'));
    watch(paths.images.src, gulp.task('images'));
    done();
});
gulp.task('default', parallel('watch', 'browser-sync'));