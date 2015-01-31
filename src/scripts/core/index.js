'use strict';

var fullname = 'yoobic.us';

var angular = require('angular');
require('famous-angular');
var app = angular.module(fullname, ['famous.angular']);
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
