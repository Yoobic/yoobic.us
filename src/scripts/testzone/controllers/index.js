'use strict';

module.exports = function(app) {
    // inject:start
    require('./sidemenu')(app);
    require('./slidebox')(app);
    // inject:end
};