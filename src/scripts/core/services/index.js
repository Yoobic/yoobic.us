'use strict';

module.exports = function(app) {
    // inject:start
    require('./famousHelper')(app);
    require('./famousOverrides')(app);
    require('./slideBoxDelegate')(app);
    // inject:end
};