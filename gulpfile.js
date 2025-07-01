const {watch, src, dest} = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const options = {
    readFolder: './src',
    target: './dist'
}

function pages_js_files() {
    console.log('parse_js_folders started.');
    return src(
        [
            options.readFolder + '/**/*.js'
        ]
    ).pipe(
        babel({
            presets: ['@babel/env'],
            minified: true,
            compact: true,
            comments: false
        })
    ).pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(dest(options.target + '/'));
}


exports.default = function () {
    return new Promise(resolve => {
        pages_js_files();
        resolve();
    })
};

exports.watch = function () {
    watch(options.readFolder + '/**/*.js', pages_js_files);
};
