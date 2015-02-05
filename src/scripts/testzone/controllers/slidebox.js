'use strict';
var controllername = 'slidebox';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = ['$famous', app.namespace.core + '.famousHelper', '$timeout'];

    function controller($famous, famousHelper, $timeout) {
        var vm = this;
        vm.message = 'Hello World';
        $timeout(function() {
            //var scrollview = $famous.find('fa-scroll-view')[0];

        }, 500);

    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
