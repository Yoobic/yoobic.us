'use strict';
var servicename = 'slideBoxDelegate';

module.exports = function(app) {
    app.factory(app.name + '.' + servicename, require('../utils/delegateService')([
        'goToPage',
        'slide',
        'getCurrentIndex',
        'currentIndex',
        'getTotalPages',
        'slidesCount',
        'previous',
        'next'
    ]));
};