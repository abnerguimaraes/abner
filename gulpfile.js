var gulp = require('gulp');
// var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var rename = require('gulp-rename');
const fsExtra = require('fs-extra');

var paths = {
  scripts: ['www/object/*/js/*.js', 'www/object/ab-support/js/*.js'],
  images:  'www/object/*/img/**',
  css:     'www/object/**/css/*.css',
  fonts:   'www/fonts/*.{ttf,woff,eot,svg}'
};

const moveFiles = () => {
  fsExtra.copySync('./build/css', './www/css');
  fsExtra.copySync('./build/js', './www/js');
};

//Minifica o CSS
gulp.task('css', function() {
  // del.sync('build/css');
  return gulp.src(paths.css)
    // Initiate sourcemap
    .pipe(sourcemaps.init())
    // Minify the stylesheet
    .pipe(cleanCss({ compatibility: 'ie8', rebase: false}))
    // Combine all CSS files found inside the src directory
    .pipe(concat('webcomp.abner.min.css'))
    // Write sourcemap
    .pipe(sourcemaps.write())
    // Write the minified file in the css directory
    .pipe(gulp.dest('build/css'));
});

//Minifica o script
gulp.task('scripts', function() {
  // del.sync('build/js');
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    //.pipe(uglify())
    //.pipe(terser())
    .pipe(concat('webcomp.abner.min.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/js'));
});

//Copia todas as imagens 
gulp.task('images', function() {
  // del.sync('build/img');
  return gulp.src(paths.images)
    // .pipe(imagemin({optimizationLevel: 5}))
    .pipe(rename(function(path) {
      var imgPath = "\\img\\";
      var index = path.dirname.indexOf(imgPath);
      var newPath = path.dirname.substring(index + imgPath.length);
      var newp = path.dirname + "/" + path.basename + "" + path.extname;
      path.dirname = index < 0 ? '' : newPath;
    }))
    .pipe(gulp.dest('./build/img'))
    .on('end', function() {
        //del.sync(['./build/img/']);
    });
});

//Copia as fontes
gulp.task('fonts', function() {
  // del.sync('build/fonts/');
  return gulp.src(paths.fonts)
    .pipe(rename({ dirname: '' }))
    .pipe(gulp.dest('build/fonts/'))
    .on('end', function() {
      moveFiles();
    });
});

// Fica olhando o diretorio e se alguem mudar algo, ele gera um novo arquivo
gulp.task('watch', function() {
  gulp.watch(paths.scripts, gulp.series('scripts'));
  gulp.watch(paths.images, gulp.series('images'));
  gulp.watch(paths.css, gulp.series('css'));
  gulp.watch(paths.fonts, gulp.series('fonts'));
});

// The default task (called when you run `gulp` from cli) 
// gulp.task('default', ['images', 'scripts', 'css', 'fonts']);

// Gulp v4
gulp.task('default',
  gulp.series('images', 'scripts', 'css', 'fonts')
);
