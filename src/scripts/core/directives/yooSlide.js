'use strict';
/*eslint consistent-this:[1,  "yooSlideCtrl"] */
var directivename = 'yooSlide';
var angular = require('angular');
module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {

        var yooSlideCtrl = this;
        yooSlideCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [];
    var directive = function() {
        return {
            require: ['yooSlide', '^yooSlideBox'],
            restrict: 'AE',
            scope: true,
            controller: controller,
            controllerAs: 'yooSlideCtrl',
            bindToController: true,
            template: require('./yooSlide.html'),
            transclude: true,
            compile: function(tElement, tAttrs) {
                return {
                    pre: function(scope, element, attrs, ctrls) {
                        // copying parent controller on the local scope, so we have easy access in the template
                        var yooSlideBoxCtrl = ctrls[1];
                        scope.yooSlideBoxCtrl = yooSlideBoxCtrl;
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
