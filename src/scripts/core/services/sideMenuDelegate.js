'use strict';
var servicename = 'sideMenuDelegate';

module.exports = function(app) {
    app.factory(app.name + '.' + servicename, require('../utils/delegateService')([

    ]));
};
