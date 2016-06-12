'use strict';
var controllername = 'sidemenu';

module.exports = function(app) {
    /*jshint validthis: true */

    var deps = [];

    function controller() {
        var vm = this;
        vm.edgeDragThreshold = true;
        vm.message = 'Hello World';

    }

    controller.$inject = deps;
    app.controller(app.name + '.' + controllername, controller);
};
