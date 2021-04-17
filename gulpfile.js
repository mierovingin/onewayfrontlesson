var { watch, src, dest, parallel, series } = require('gulp');

var browserSync = require('browser-sync');
var del = require('del');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var pug = require('gulp-pug');
var imagemin = require('gulp-imagemin');

function devServer(cb) {
    var params = {
        watch: true,
        reloadDebounce: 150,
        notify: false,
        server: { baseDir: './build'},
    };

    browserSync.create().init(params);
    cb();
}

function clearBuild() {
    return del('build/');
}

function buildPages() {
    return src('src/pages/*.html')
        .pipe(dest('build/'));
}

function buildStyles() {
    return src('src/styles/*.scss')
        .pipe(sass())
        .pipe(postcss([
            autoprefixer(),
            cssnano()
        ]))
        .pipe(dest('build/styles/'));
}

function buildScripts() {
    return src('src/scripts/**/*.js')
        .pipe(dest('build/scripts/'));
}

function buildAssets(cb) {
    src(['src/assets/**/*.*', '!src/assets/img/**/*.*'])
        .pipe(dest('build/assets/'));

    src('src/assets/img/**/*.*')
        .pipe(imagemin())
        .pipe(dest('build/assets/img'));
    cb();
}

function watchFiles() {
    watch('src/pages/*.html', buildPages);
    watch('src/styles/*.scss', buildStyles);
    watch('src/scripts/**/*.js', buildScripts);
    watch('src/assets/**/*.*', buildAssets);
}
exports.default =
    series(
        clearBuild,
    parallel(
        devServer,
        series(
        parallel(buildPages, buildStyles, buildScripts, buildAssets),
    watchFiles
        )
    )
);