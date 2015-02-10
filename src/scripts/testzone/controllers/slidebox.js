'use strict';
var controllername = 'slidebox';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$famous', app.namespace.core + '.famousHelper', '$timeout', app.namespace.core + '.slideBoxDelegate'];

    function controller($famous, famousHelper, $timeout, slideBoxDelegate) {
        var vm = this;
        vm.message = 'Hello World';
        vm.goToPage = function(index) {
            slideBoxDelegate.goToPage(index);
        };

    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
