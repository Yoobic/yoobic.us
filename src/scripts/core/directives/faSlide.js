'use strict';
/*eslint consistent-this:[2,  "faSlideCtrl"] */
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
            restrict: 'AE',
            scope: {
                title: '@' // '@' reads attribute value, '=' provides 2-way binding, '&" works with functions
            },
            transclude: true,
            controller: controller,
            controllerAs: 'faSlideCtrl',
            bindToController: true,
            template: require('./faSlide.html'),
            link: function(scope, element, attrs) {

            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
