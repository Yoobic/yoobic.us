'use strict';
var controllername = 'slidebox';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$famous', app.namespace.core + '.famousHelper', '$timeout', app.namespace.core + '.slideBoxDelegate'];

    function controller($famous, famousHelper, $timeout, slideBoxDelegate) {
        var vm = this;
        vm.message = 'Hello World';
        vm.doesContinue = true;
        vm.shouldEnableSlide = true;
        vm.autoPlay = true;
        // vm.slideInterval = 2000;
        vm.goToPage = function(index) {
            slideBoxDelegate.$getByHandle('myslidebox').goToPage(index);
        };
        vm.toggleLoop = function() {
            vm.doesContinue = !vm.doesContinue;
        };
        vm.toggleSlide = function() {
            vm.shouldEnableSlide = !vm.shouldEnableSlide;
            slideBoxDelegate.$getByHandle('myslidebox').enableSlide(vm.shouldEnableSlide);
        };
        vm.toggleAutoPlay = function() {
            vm.autoPlay = !vm.autoPlay;
        };
        vm.slideDirections = ['goToNextPage', 'goToPreviousPage', 'invalidDirection'];
        vm.activeSlides = [0, 1, 2, 3, 4, 5];
        vm.slideIntervals = [5, 500, 750, 1000, 2000, 4000, 8000, 30000];
        vm.animations = ['animation1', 'animation2', 'standard'];

    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
