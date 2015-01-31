'use strict';

module.exports = function(app) {
    // inject:start
    require('./faSlide')(app);
    require('./faSlideBox')(app);
    // inject:end
};