const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const bSync = require("browser-sync").create();

const opt = "dev";

const sassObj =
  opt === "dev"
    ? {
        sourceComments: true,
        outputStyle: "expanded"
      }
    : {
        outputStyle: "compressed"
      };

const pugObj =
  opt === "dev"
    ? {
        baseDir: "./src/views/pages",
        pretty: true
      }
    : {
        baseDir: "./src/views/pages",
        pretty: false
      };

function style() {
  return gulp
    .src("./src/scss/styles.scss")
    .pipe(plumber())
    .pipe(sass(sassObj).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest("./public/css"))
    .pipe(bSync.stream());
}

function pugTask() {
  return gulp
    .src("./src/views/pages/**/*.pug")
    .pipe(plumber())
    .pipe(pug(pugObj))
    .pipe(gulp.dest("./public/"));
}

function babelTask() {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(concat("scripts-min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./public/js"));
}

function watch() {
  bSync.init({
    server: {
      baseDir: "./public"
    }
  });

  gulp.watch("./src/scss/**/*.scss", style);
  // gulp.watch("./src/views/pages/**/*.pug", pugTask).on("change", bSync.reload);
  gulp.watch("./src/js/**/*.js", babelTask).on("change", bSync.reload);
  // Si no se utiliza pug, descomentar la línea siguiente
  gulp.watch("./public/*.html").on("change", bSync.reload);
}

gulp.task("default", watch);
