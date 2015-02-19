'use strict';

var namespace = 'main';

var angular = require('angular');
//require('bootstrap');
var app = angular.module(namespace, [
    // inject:modules start
    require('./core')(namespace).name,
    require('./testzone')(namespace).name
    // inject:modules end
]);

var runDeps = [];
var run = function() {};

run.$inject = runDeps;
app.run(run);

module.exports = app;
