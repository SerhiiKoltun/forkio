const {src, dest} = require("gulp");
const gulp = require("gulp");
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require("gulp-autoprefixer");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();

const srcPath = 'src/'
const distPath = 'dist/'

const path = {
    build: {
        css: distPath + 'assets/css/',
        js: distPath + 'assets/js/',
        fonts: distPath + 'assets/fonts/',
        images: distPath + 'assets/img/',
    },
    src: {
        html: srcPath + '*.html',
        css: srcPath + 'assets/scss/*.scss',
        js: srcPath + 'assets/js/*.js',
        fonts: srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
        images: srcPath + 'assets/img/**/*.{png,jpg,svg,gif,ico,webp,webmanifest,xml,json}',
    },
    watch: {
        html: srcPath + '**/*.html',
        css: srcPath + 'assets/scss/**/*.scss',
        js: srcPath + 'assets/js/**/*.js',
        fonts: srcPath + 'assets/fonts/**/*.{eot,woff,woff2,ttf,svg}',
        images: srcPath + 'assets/img/**/*.{png,jpg,svg,gif,ico,webp,webmanifest,xml,json}'
    },
    clean: './' + distPath
}

function server() {
    browserSync.init({
        server: "./",
        injectChanges: true
    });
}


function css() {
    return src(path.src.css, { base: srcPath + 'assets/scss' })
      .pipe(sass().on('error', sass.logError))
      .pipe(
        autoprefixer({
          cascade: false,
          overrideBrowserslist: true[
            ('> 1%',
            'ie >= 8',
            'edge >= 15',
            'ie_mob >= 10',
            'ff >= 45',
            'chrome >= 45',
            'safari >= 7',
            'opera >= 23',
            'ios >= 7',
            'android >= 4',
            'bb >= 10')
          ],
        })
      )
      .pipe(
        cleanCSS({
          compatibility: 'ie8',
        })
      )
      .pipe(concat('styles.css'))
      .pipe(
        rename({
          suffix: '.min',
          extname: '.css',
        })
      )
      .pipe(dest(path.build.css))
      .pipe(browserSync.reload({ stream: true }));
}

function js() {
    return src(path.src.js, {base: srcPath + 'assets/js'})
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}))
}

function images() {
    return src(path.src.images, {base: srcPath + 'assets/img'})
        .pipe(imagemin())
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({stream: true}))
}



function clean() {
    return del(path.clean)
}

function watchFiles() {
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch("./*.html").on("change", browserSync.reload);
}

const build = gulp.series(clean, gulp.parallel(css,js,images),server)
const watch = gulp.parallel(build, watchFiles);

exports.css = css
exports.js = js
exports.images = images
exports.clean = clean
exports.build = build
exports.watch = watch