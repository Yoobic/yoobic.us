'use strict';

module.exports = function(app) {
    // inject:start
    require('./famousHelper')(app);
    require('./famousOverrides')(app);
    // inject:end
};