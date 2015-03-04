'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var rename = $.rename;
var gmux = require('gulp-mux');
var runSequence = require('run-sequence');
var constants = require('../common/constants')();
var helper = require('../common/helper');
var exec = require('child_process').exec;

gulp.task('docs', 'Generate documentation.', function(done) {
    return runSequence('dist', 'copydoc', done);
});

gulp.task('copydoc', false, function() {
    var dest = constants.docs.docsFolder;
    dest = helper.isMobile(constants) ? dest + '/www' : dest;

    gulp.src(constants.dist.distFolder + '/' + constants.fonts.dest + '/*')
        .pipe(gulp.dest(dest + '/' + constants.fonts.dest));

    gulp.src(constants.dist.distFolder + '/' + constants.style.dest + '/*')
        .pipe(gulp.dest(dest + '/' + constants.style.dest));

    gulp.src(constants.dist.distFolder + '/' + constants.browserify.bundleName)
        .pipe(gulp.dest(dest));

    gulp.src(constants.dist.distFolder + '/index.html')
        .pipe(rename('testzone.html'))
        .pipe(gulp.dest(dest));
});

gulp.task('docs:full', 'Generate documentation.', function(done) {
    return runSequence('docs', 'docsGhPages', done);
});

gulp.task('docsGhPages', false, function() {
    exec('rm -rf .git && ' +
        'git init && ' +
        'git checkout --orphan gh-pages && ' +
        'git add . && ' +
        'git commit -m "docs" && ' +
        'git remote add origin https://github.com/yoobic/yoobic.us && ' +
        'git push -f && ' +
        'rm -rf .git', {
            cwd: constants.docs.docsFolder
        }, helper.execHandler);
});
