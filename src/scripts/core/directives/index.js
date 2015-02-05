'use strict';

module.exports = function(app) {
    // inject:start
    require('./yooSlide')(app);
    require('./yooSlideBox')(app);
    // inject:end
};