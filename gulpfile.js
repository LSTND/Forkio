const { src, dest, watch, parallel, series } = require('gulp')
const clean = require('gulp-clean')
const browserSync = require('browser-sync').create()
const autoPrefixer = require('gulp-autoprefixer')
const cssClean = require('gulp-clean-css')
const concat = require('gulp-concat')
const imageMin = require('gulp-imagemin')
const jsMin = require('gulp-js-minify')
const sass = require('gulp-sass')(require('sass'))
const unglify = require('gulp-uglify')
const rigger = require('gulp-rigger')

//clean all file
const clearDist = () => {
  return src('./dist').pipe(clean())
}
//create css min file
const styles = () => {
  return src('./src/scss/style.scss')
    .pipe(concat('styles.min.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(
      cssClean({
        level: 2,
      }),
    )
    .pipe(
      autoPrefixer({
        grid: true,
        overrideBrowserslist: ['last 3 versions'],
        cascade: true,
      }),
    )
    .pipe(dest('./dist/css/'))
    .pipe(browserSync.stream())
}

//create server
const server = () => {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
  })
}

const watcher = () => {
  watch('./src/**/*.scss', styles) //style
  watch('./src/**/*.js', scripts) //js
  watch('./src/**/*.html', html) //html
  watch('./src/img/**/*.+(png|jpg|gif|svg|PNG)', images) // img
}

//js
const scripts = () => {
  return src('./src/js/script.js')
    .pipe(rigger())
    .pipe(concat('scripts.min.js'))
    .pipe(unglify())
    .pipe(dest('./dist/scripts/'))
    .pipe(browserSync.stream())
}

// html concat
const html = () => {
  return src('./src/index.html')
    .pipe(rigger())
    .pipe(dest('./dist'))
    .pipe(browserSync.stream())
}

//image
const images = () => {
  return src('./src/img/**/*.+(png|jpg|gif|svg|PNG)')
    .pipe(imageMin())
    .pipe(dest('./dist/img/'))
}

exports.dev = series(styles, scripts, html, images, parallel(server, watcher))
exports.build = series(clearDist, styles, scripts, html, images)
