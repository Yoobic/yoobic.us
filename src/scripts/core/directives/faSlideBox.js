'use strict';
/*eslint consistent-this:[2,  "faSlideBoxCtrl"] */
var directivename = 'faSlideBox';

module.exports = function(app) {

    // controller
    var controllerDeps = ['$famous', app.name + '.famousHelper'];
    var controller = function($famous, famousHelper) {
        var faSlideBoxCtrl = this;
        faSlideBoxCtrl.directivename = directivename;

        var EventHandler = $famous['famous/core/EventHandler'];
        faSlideBoxCtrl.eventHandler = new EventHandler();

        faSlideBoxCtrl.getScrollView = function() {
            if(!faSlideBoxCtrl.scrollView) {
                faSlideBoxCtrl.scrollView = famousHelper.find('fa-scroll-view')[0];
            }
            return faSlideBoxCtrl.scrollView;
        };

        faSlideBoxCtrl.getTotalPage = function() {
            faSlideBoxCtrl.getScrollView().getTotalPage();
        };
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = ['$famous'];
    var directive = function($famous) {
        return {
            require: ['faSlideBox'],
            restrict: 'AE',
            scope: {
                title: '@' // '@' reads attribute value, '=' provides 2-way binding, '&" works with functions
            },
            controller: controller,
            controllerAs: 'faSlideBoxCtrl',
            bindToController: true,
            template: require('./faSlideBox.html'),
            transclude: true,
            compile: function(tElement, tAttrs) {
                return {
                    pre: function(scope, element, attrs) {

                    },
                    post: function(scope, element, attrs, ctrls) {
                        var faSlideBoxCtrl = ctrls[0];
                        faSlideBoxCtrl.getScrollView().renderNode.sync.addSync(['mouse']);
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
