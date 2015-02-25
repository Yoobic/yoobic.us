'use strict';
var controllername = 'slidebox';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$famous', app.namespace.core + '.famousHelper', '$timeout', app.namespace.core + '.slideBoxDelegate'];

    function controller($famous, famousHelper, $timeout, slideBoxDelegate) {
        var vm = this;
        vm.message = 'Hello World';
        vm.goToPage = function(index) {
            slideBoxDelegate.$getByHandle('myslidebox').goToPage(index);
        };

        vm.animations = ['animation1', 'animation2', 'standard'];
        vm.sidebarWidth = 200;
        vm.settingsWidth = 175;

        vm.getContentSize = function() {
            return [window.innerWidth - vm.sidebarWidth, undefined];
        };
        vm.getVisualPhoneCaseProperties = function() {
            return {
                backgroundImage: 'url(images/phone-case.png)',
                backgroundSize: 'cover'
            };
        };
        vm.getVisualPhoneSize = function() {
            return [Math.floor(window.innerHeight * 730 / 1584), window.innerHeight];
        };
        vm.getVisualPhoneScreenSize = function() {
            return [Math.floor(window.innerHeight * 730 / 1584 * 0.9), Math.floor(window.innerHeight * 0.7)];
        };
    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
