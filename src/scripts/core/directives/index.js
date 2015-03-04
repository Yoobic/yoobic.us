'use strict';

module.exports = function(app) {
    // inject:start
    require('./yooPager')(app);
    require('./yooSideMenu')(app);
    require('./yooSideMenuContent')(app);
    require('./yooSideMenus')(app);
    require('./yooSlide')(app);
    require('./yooSlideBox')(app);
    // inject:end
};