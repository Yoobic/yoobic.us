'use strict';

module.exports = function(app) {
    // inject:start
    require('./yooPager')(app);
    require('./yooSlide')(app);
    require('./yooSlideBox')(app);
    // inject:end
};