'use strict';

module.exports = function(app) {
    // inject:start
    require('./famousOverrides')(app);
    // inject:end
};