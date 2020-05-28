const res='resources';
const data = require('./package.json');
const {src, dest, watch, series, parallel} = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const minify = require('cssnano');
const header = require('gulp-header');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const prefix = require('autoprefixer');
const browserSync = require('browser-sync');
const optimizejs = require('gulp-optimize-js');
const fileinclude = require('gulp-file-include');
const heading=`/*>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<
>=>>=>>=>>=>>=>>=>>=>> BISMILLAH-HIR RAHMAN-NIR RAHEEM <<=<<=<<=<<=<<=<<=<<=<<=<
>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<-->=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<
>=<>  Template: ${data.app.name} v-${data.version} (${data.homepage})
>=<>  Author: ${data.author.name}(${data.author.link})
>=<>  Description: ${data.description}
>=<>  Copyright: ${new Date().getFullYear()} | Licensed Under ${data.license}
>=<>  Keywords: ${data.keywords}
>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<
>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<START>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<*/`
function clear_app(done) {
	del.sync([data.app.dist]);
	return done();
}
function set_favicon(done) {
    return src("resources/favicon.ico").pipe(dest(data.app.dist));
}
function set_images(done) {
    return src(res+'/images/**/*').pipe(dest(data.app.dist+'/assets'));
}
function template_factory(done) {
    return src(res+'/template/**/*.html') .pipe(fileinclude({
        prefix: '@{', suffix: '}',
        basepath: res+'/includes'
    })).pipe(dest(data.app.dist));
}
function style_factory(done) {
   return src(res+'/styles/**/*.scss').pipe(header(heading)).pipe(sass()).pipe(dest(data.app.dist+'/assets/styles'));
}
function style_vendors(done) {
   return src(data.app.styles).pipe(sass()).pipe(concat('vendors.css')).pipe(dest(data.app.dist+'/assets/styles'));
}
function script_factory(done) {
    return src(res+'/scripts/**/*.js').pipe(dest(data.app.dist+'/assets/scripts'));
}
function script_vendors(done) {
    return src(data.app.scripts).pipe(concat('vendors.js')).pipe(dest(data.app.dist+'/assets/scripts'));
}
function live_factory(done) {
    return browserSync.init({ server: { baseDir: data.app.dist }, port: 9937 });
}
exports.default=series( clear_app, parallel(
    set_favicon,
    template_factory,
    style_factory,
    style_vendors,
    script_factory,
    script_vendors,
    set_images
));
function watch_factory(done) {
  return watch(res, exports.default).on('change', browserSync.reload);
}
exports.watch=series(exports.default,parallel(watch_factory, live_factory));