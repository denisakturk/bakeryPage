var gulp         = require('gulp'),
    scss         = require('gulp-sass'),
    pug          = require('gulp-pug'),
    styleLint    = require('gulp-stylelint'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

// Таск для SCSS + linter

gulp.task('scss', async function() {
    return gulp.src('app/scss/**/*.scss')
    .pipe(styleLint({
        failAfterError: false,
        reporters: [{
            formatter: 'string',
            console: true
        }]
    }))
    .pipe(scss())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}))
});

// Таск для BrowserSync

gulp.task('browser-sync', async function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

// Tаск для PUG

gulp.task('pug', async function() {
    return gulp.src('app/pug/*.pug')
    .pipe(pug({
            pretty: true
        }))
    .pipe(gulp.dest('app'))
});

// Таск для конкантенации скриптов в один единый файл

// gulp.task('scripts', async function() {
//     return gulp.src('app/scripts/libs/*.js')
//         .pipe(concat('libs.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('app/js'));
// });


// Таск на изменение HTML

gulp.task('code', async function() {
    return gulp.src('app/*.html')
    .pipe(browserSync.reload({ stream: true }))
});

// gulp.task('css-libs', async function() {
//     return gulp.src('app/css/libs.scss') // Выбираем файл для минификации
//         .pipe(scss()) // Преобразуем Sass в CSS посредством gulp-sass
//         .pipe(cssnano()) // Сжимаем
//         .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
//         .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
// });
 
gulp.task('clean', async function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});
 
gulp.task('img', async function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({ // С кешированием
        // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});
 
gulp.task('prebuild', async function() {
 
    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))
 
    // Переносим шрифты в продакшен

    var buildFonts = gulp.src('app/fonts/**/*') 
    .pipe(gulp.dest('dist/fonts'))
 
    // Переносим скрипты в продакшен

    var buildJs = gulp.src('app/js/**/*') 
    .pipe(gulp.dest('dist/js'))
 
    // Переносим HTML в продакшен

    var buildHtml = gulp.src('app/*.html') 
    .pipe(gulp.dest('dist'));
 
});
 
gulp.task('clear', function (callback) {
    return cache.clearAll();
})

// Tаск наблюдения за изменениями 

gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', gulp.parallel('scss'));
    gulp.watch('app/pug/**/*.pug', gulp.parallel('pug'));
    gulp.watch('app/*.html',gulp.parallel('code'));
    // gulp.watch(['app/js/common.js', 'app/libs/**/*.js'], gulp.parallel('scripts'));
});

gulp.task('default', gulp.parallel('scss', 'pug', 'browser-sync', 'watch'));
// gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'scss', 'scripts'));
