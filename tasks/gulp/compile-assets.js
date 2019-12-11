const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const rollup = require('gulp-better-rollup')
// const taskArguments = require('./task-arguments')
// const gulpif = require('gulp-if')
// const uglify = require('gulp-uglify')
// const eol = require('gulp-eol')
const cssnano = require('cssnano')

// Compile CSS task ---------------------
// --------------------------------------

const scss = () => {
  return gulp.src('app/assets/scss/app.scss')
    .pipe(sass({ includePaths: 'src/', outputStyle: 'expanded' }).on('error', sass.logError))
    // minify css add vendor prefixes and normalize to compiled css
    .pipe(postcss([
      autoprefixer,
      cssnano
    ]))
    .pipe(gulp.dest('app/public/assets/styles/'))
}

scss.displayName = 'Compile : SCSS'

// Compile js task for preview ----------
// --------------------------------------
const js = async (done) => {
  // for dist/ folder we only want compiled 'all.js' file
  // let srcFiles = isDist ? configPaths.src + 'all.js' : configPaths.src + '**/*.js'
  const dmFrontendSrc = 'src/digitalmarketplace/'
  const srcFiles = dmFrontendSrc + 'all.js'

  await gulp.src([
    srcFiles,
    '!' + dmFrontendSrc + '**/*.test.js'
  ])
    .pipe(rollup({
      // Used to set the `window` global and UMD/AMD export name.
      name: 'DMGOVUKFrontend',
      // UMD allows the published bundle to work in CommonJS and in the browser.
      format: 'umd'
    }))
    // .pipe(uglify({ie8: true }))
    // .pipe(gulpif(isDist,
    //   rename({
    //     basename: 'govuk-frontend',
    //     extname: '.min.js'
    //   })
    // ))
    // .pipe(eol())
    .pipe(gulp.dest('app/public/assets/javascript/'))

  await done()
}

js.displayName = 'Compile : JavaScript'

module.exports = {
  scss,
  js
}
