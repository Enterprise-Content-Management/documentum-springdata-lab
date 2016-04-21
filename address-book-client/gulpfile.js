/**
 * Created by Darren Tarrant on 12/04/2016.
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var connect = require('gulp-connect');
var del = require('del');
var bf = require('main-bower-files');
var es = require('event-stream');

// helper for getting filtered files from bower components using a filter
var bowerFiles = function(filter) {
    return bf(filter, {includeDev: true});
};

// map of various source and destination paths
var paths = {
    appJsSrc: './src/**/*.js',
    appLessSrc: './src/less/abcApp.less',
    appTemplatesSrc: ['./src/**/*-tpl.html', '!./src/index.html'],
    appTemplatesOut: 'abc-templates.js',
    appIndexSrc: './src/index.html',
    distDev: './public',
    distCss: 'css/abc.css',
    libJsOut: '/libs',
    watchLessSrc: './src/**/*.less',
    fontAwesomeSrc: './bower_components/font-awesome/fonts/*',
    fontAwesomeOut: '/fonts/'
};

// pipes i.e the workers
var pipes = {};

// lints the app js files and puts them into the output folder
pipes.buildAppJs = function() {
    console.log('[pipe] [buildAppJs] starting');
    return gulp.src(paths.appJsSrc)
        .pipe(plugins.jshint({
            globals: {
                angular: false,
                console: false,
                document: true,
                sessionStorage: true,
                localStorage: true,
                window: true,
                define: false,
                module: false
            },
            undef: true,
            curly: true,
            unused: 'vars'
        }))
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        //.pipe(plugins.jshint.reporter('fail'))
        .pipe(gulp.dest(paths.distDev))
        .on('end', function() {
            console.log('[pipe] [buildAppJs] completed');
        });
};

// runs less on the app main less file, renames to css and pushes to output folder
pipes.buildAppCss = function() {
    console.log('[pipe] [buildAppCss] starting');
    return gulp.src(paths.appLessSrc)
        .pipe(plugins.less())
        .pipe(plugins.rename(paths.distCss))
        .pipe(gulp.dest(paths.distDev))
        .on('end', function() {
            console.log('[pipe] [buildAppCss] completed');
        });
};

// gets all js files from bower (angular etc) and pushes them to the dist folder
pipes.buildBowerJs = function() {
    console.log('[pipe] [buildBowerJs] starting');
    return gulp.src(bowerFiles('**/*.js')).
        pipe(gulp.dest(paths.distDev + paths.libJsOut))
        .on('end', function() {
            console.log('[pipe] [buildBowerJs] completed')
        });
};

// fetches the font awesome fonts and puts them in the output directory
pipes.buildFontAwesome = function() {
    console.log('[pipe] [buildFontAwesome] starting');
    return gulp.src(paths.fontAwesomeSrc).
        pipe(gulp.dest(paths.distDev + paths.fontAwesomeOut))
        .on('end', function() {
            console.log('[pipe] [buildFontAwesome] completed')
        });
};

// simply orders lib js files
pipes.orderLibJs = function() {
    return plugins.order(['jquery.js', 'angular.js']);
};

// uses a special plugin to figure the order of angular js files!!
pipes.orderAppJs = function() {
    return plugins.angularFilesort();
};

// minifies the index html and injects paths to scripts etc
pipes.buildIndex = function() {

    console.log('[pipe] [buildIndex] starting');

    // we need the lib js ordered
    var orderedLibsJs = pipes.buildBowerJs()
        .pipe(pipes.orderLibJs());

    // order the app js files
    var orderedAppJs = pipes.buildAppJs()
        .pipe(pipes.orderAppJs());

    // get the css
    var css = pipes.buildAppCss();

    // and the templates
    var templates = pipes.buildAppTemplates();

    // now validate and write the index before pushing to the dis folder
    return gulp.src(paths.appIndexSrc)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.reporter())
        .pipe(gulp.dest(paths.distDev)) // write to make paths relative
        .pipe(plugins.inject(orderedLibsJs, {relative: true, name: 'bower'}))
        .pipe(plugins.inject(orderedAppJs, {relative: true}))
        .pipe(plugins.inject(templates, {relative: true, name: 'partials'}))
        .pipe(plugins.inject(css, {relative: true}))
        .pipe(gulp.dest(paths.distDev))
        .on('end', function() {
            console.log('[pipe] [buildIndex] completed');
        });

};

// builds the whole app and pushes to the dist folder
pipes.buildAppDev = function() {
    console.log('[pipe] [buildAppDev] starting');
    return es.merge(pipes.buildIndex(), pipes.buildFontAwesome())
        .on('end', function() {
            console.log('[pipe] [buildAppDev] completed');
        });
};

// validates the app templates (-tpl.html) and pushes them all
// into a single javascript file in the dist folder
pipes.buildAppTemplates = function() {
    console.log('[pipe] [buildAppTemplates] starting');
    return gulp.src(paths.appTemplatesSrc)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.reporter())
        .pipe(plugins.htmlhint.failReporter())
        .pipe(plugins.ngHtml2js({
            moduleName: 'abcTemplates',
            declareModule: false
        }))
        .pipe(plugins.concat(paths.appTemplatesOut))
        .pipe(gulp.dest(paths.distDev))
        .on('end', function() {
            console.log('[pipe] [buildAppTemplates] completed')
        });
};

// cleans the dist dev folder
gulp.task('clean-dev', function() {
    return del(paths.distDev).then(function(paths) {
        if (paths && paths !== '') {
            console.log('[gulp][clean-dev] completed');
        }
    });
});

// cleans, builds and starts connect
gulp.task('clean-build-dev-app', ['clean-dev', 'connect'], pipes.buildAppDev);

// starts a gulp server publishing from the public folder
gulp.task('connect', function() {
   connect.server({
       root: 'public',
       port: 4000
   });
});

// builds and pushes the dev app and then watches for changes and pushes updates when they occur
gulp.task('watch-dev', ['clean-build-dev-app'], function() {

    // watch the index html
    gulp.watch(paths.appIndexSrc, {interval: 500}, function() {
        console.log('===================================================');
        console.log('[watch] [index] change detected');

        // rebuild the index html
        return pipes.buildIndex()
            .on('end', function() {
                console.log('[watch] [index] updates deployed');
                console.log('===================================================');

            });

    });

    // watch the app js src
    gulp.watch(paths.appJsSrc, {interval: 500}, function() {
        console.log('===================================================');
        console.log('[watch] [appJs] change detected');

        // rebuild the app js
        return pipes.buildAppJs()
            .on('end', function() {

                console.log('[watch] [appJs] updates deployed');
                console.log('===================================================');

            });

    });

    // watch the app html templates
    gulp.watch(paths.appTemplatesSrc, {interval: 500}, function() {
        console.log('===================================================');
        console.log('[watch] [appTemplates] change detected');

        // rebuild the app template htmls
        return pipes.buildAppTemplates()
            .on('end', function() {

                console.log('[watch] [appTemplates] updates deployed');
                console.log('===================================================');

            });

    });

    // watch the app less files
    gulp.watch(paths.watchLessSrc, {interval: 500}, function() {
        console.log('===================================================');
        console.log('[watch] [appLess] change detected');
        return pipes.buildAppCss()
            .on('end', function() {
                console.log('[watch] [appLess] updates deployed');
                console.log('===================================================');
            });
    });

});

gulp.task('default', ['watch-dev']);
