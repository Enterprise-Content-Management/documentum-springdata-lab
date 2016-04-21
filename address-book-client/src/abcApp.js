/**
 * Created by Darren Tarrant on 12/04/2016.
 */
(function() {
    "use strict";

    // the main angular app module - all modules tie into or are injected into this
    var app = angular.module('abcApp', [
        'angular-growl',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'abcTemplates'
    ]);

    // the constant used for the available group names
    app.constant('GROUP_NAMES', ['Friends', 'Family', 'Work']);

    /*
     Set default headers on all http requests...
     */
    app.config([ '$httpProvider', function ( $httpProvider ) {
        /*jshint -W069 */
        $httpProvider.defaults.headers.common['Accept'] = 'application/json';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/vnd.emc.documentum+json; application/json; charset=utf-8';
        /*jshint -W069 */
        $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/vnd.emc.documentum+json; application/json; charset=utf-8';
        /*jshint -W069 */
    } ]);

    // directive for handling file selection changes
    app.directive('abcFileChanged', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.abcFileChanged);

                element.bind('change', function(e) {

                    // normalise the data into a simple array of file objects
                    var list = [];
                    for ( var i=0; i< e.target.files.length; i++ ) {
                        list.push(e.target.files[i]);
                    }
                    scope.$applyAsync(function() {
                        onChangeHandler(list);
                    });

                });

                element.bind('click', function(e) {
                    element[0].value = null;
                });
            }
        };
    });


})();