'use strict';

var fullname = 'yoobic.us';

var angular = require('angular');
require('famous-angular');
var yoobicCore = require('yoobic-angular-core')();
var app = angular.module(fullname, ['famous.angular', yoobicCore.name]);
app.namespace = {} || app.namespace;
app.namespace.yoobicCore = yoobicCore.name;

// inject:folders start
require('./directives')(app);
require('./services')(app);
// inject:folders end

module.exports = function() {
    app.run([fullname + '.famousOverrides',
        function(famousOverrides) {
            famousOverrides.apply();
        }
    ]);
    return app;
};
