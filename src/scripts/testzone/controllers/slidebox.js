'use strict';
var controllername = 'slidebox';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$famous', app.namespace.core + '.famousHelper', '$timeout', app.namespace.core + '.slideBoxDelegate'];

    function controller($scope, $famous, famousHelper, $timeout, slideBoxDelegate) {
        var vm = this;
        vm.message = 'Hello World';
        vm.goToPage = function(index) {
            slideBoxDelegate.$getByHandle('myslidebox').goToPage(index);
        };

        vm.animations = ['animation1', 'animation2', 'standard'];
        vm.sidebarWidth = 250;
        vm.getContentSize = function(){
            return [window.innerWidth - vm.sidebarWidth, undefined];
        }
        // var EventHandler = $famous['famous/core/EventHandler'];
        // $scope.eventHandler = new EventHandler();
        // $scope.options = {
        //   scrollViewOuter: {
        //     direction: 0,
        //     paginated: true
        //   },
        //   scrollViewInner :{
        //     direction: 1
        //   }
        // };

    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
