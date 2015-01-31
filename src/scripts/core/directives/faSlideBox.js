'use strict';
/*eslint consistent-this:[2,  "faSlideBoxCtrl"] */
var directivename = 'faSlideBox';

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {
        var faSlideBoxCtrl = this;
        faSlideBoxCtrl.directivename = directivename;
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
            controllerAs: 'faSlideBoxCtrl',
            bindToController: true,
            template: require('./faSlideBox.html'),
            link: function(scope, element, attrs) {

            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
