'use strict';
/*eslint consistent-this:[1,  "faSlideCtrl"] */
var directivename = 'faSlide';
var angular = require('angular');
module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {

        var faSlideCtrl = this;
        faSlideCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            require: ['faSlide', '^faSlideBox'],
            restrict: 'AE',
            scope: true,
            controller: controller,
            controllerAs: 'faSlideCtrl',
            bindToController: true,
            template: require('./faSlide.html'),
            transclude: true,
            compile: function(tElement, tAttrs) {
                return {
                    pre: function(scope, element, attrs, ctrls) {
                        var faSlideBoxCtrl = ctrls[1];
                        scope.faSlideBoxCtrl = faSlideBoxCtrl;
                    },
                    post: function(scope, element, attrs, ctrls) {

                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
