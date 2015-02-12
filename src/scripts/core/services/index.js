'use strict';

module.exports = function(app) {
    // inject:start
    require('./famousHelper')(app);
    require('./famousOverrides')(app);
    require('./sideMenuDelegate')(app);
    require('./slideBoxDelegate')(app);
    // inject:end
};