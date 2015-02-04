'use strict';
/*eslint consistent-this:[1,  "faSlideCtrl"] */
var directivename = 'faSlide';

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {
        var faSlideCtrl = this;
        faSlideCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

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
                    pre: function(scope, element, attrs, ctrls) {},
                    post: function(scope, element, attrs, ctrls) {
                        var faSlideCtrl = ctrls[0];
                        var faSlideBoxCtrl = ctrls[1];
                        faSlideCtrl.eventHandler = faSlideBoxCtrl.eventHandler;
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
