'use strict';
var controllername = 'slidebox';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$famous', app.namespace.core + '.famousHelper', '$timeout', app.namespace.core + '.slideBoxDelegate'];

    function controller($famous, famousHelper, $timeout, slideBoxDelegate) {
        var vm = this;
        vm.message = 'Hello World';
        vm.doesContinue = true;
        vm.goToPage = function(index) {
            slideBoxDelegate.$getByHandle('myslidebox').goToPage(index);
        };
        vm.toggleLoop = function() {
            vm.loop = !vm.loop;
        };

        vm.animations = ['animation1', 'animation2', 'standard'];

    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
