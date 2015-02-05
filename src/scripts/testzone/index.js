'use strict';
require('angular-ui-router');
require('famous-angular');
var modulename = 'testzone';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var angular = require('angular');
    var core = require('../core')(namespace);
    var app = angular.module(fullname, ['ui.router', 'famous.angular', core.name]);
    app.namespace = app.namespace || {};
    app.namespace.core = core.name;
    // inject:folders start
    require('./controllers')(app);
    // inject:folders end

    app.config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
            $stateProvider.state('home', {
                url: '/',
                template: require('./views/home.html')
            });
            $stateProvider.state('slidebox', {
                url: '/slidebox',
                template: require('./views/slidebox.html'),
                controller: fullname + '.slidebox',
                controllerAs: 'vm'
            });
        }
    ]);

    return app;
};
