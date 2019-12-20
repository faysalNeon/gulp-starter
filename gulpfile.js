const pkg = require('./package.json');
const data = require('./project.json');
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
>=<>  Template: ${data.name} v-${data.version} (${data.homepage})
>=<>  Author: ${data.author.name}(${data.author.link})
>=<>  Description: ${data.description}
>=<>  Copyright: ${new Date().getFullYear()} | Licensed Under ${pkg.license}
>=<>  Keywords: ${data.keywords}
>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<
>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<START>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<>=<*/`
function clear_app(done) {
	del.sync([data.app.dist]);
	return done();
}
function set_favicon(done) {
    return src(data.app.src+"/"+data.favicon).pipe(dest(data.app.dist));
}
function set_images(done) {
    return src(data.app.images.src).pipe(dest(data.app.images.dist));
}
function template_factory(done) {
    return src(data.app.template.src)
    .pipe(fileinclude({
        prefix: '@{',
        suffix: '}',
        basepath: data.app.template.base
    }))
    .pipe(dest(data.app.template.dist));
}
function style_factory(done) {
   return src(data.app.styles.src).pipe(header(heading)).pipe(sass()).pipe(dest(data.app.styles.dist));
}
function style_vendors(done) {
   return src(data.styles).pipe(sass()).pipe(concat('vendors.css')).pipe(dest(data.app.styles.dist));
}
function script_factory(done) {
    return src(data.app.scripts.src).pipe(dest(data.app.scripts.dist));
}
function script_vendors(done) {
    return src(data.scripts).pipe(concat('vendors.js')).pipe(dest(data.app.scripts.dist));
}
function live_factory(done) {
    return browserSync.init({ server: { baseDir: data.app.dist }, port: 7824 });
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
  return watch(data.app.src, exports.default).on('change', browserSync.reload);
}
exports.watch=series(exports.default,parallel(watch_factory, live_factory));