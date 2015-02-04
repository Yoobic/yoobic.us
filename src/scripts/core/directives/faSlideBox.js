'use strict';
 /*eslint consistent-this:[1,  "faSlideBoxCtrl"] */
var directivename = 'faSlideBox';

module.exports = function(app) {

    // controller
    var controllerDeps = ['$famous'];
    var controller = function($famous) {
        var faSlideBoxCtrl = this;
        faSlideBoxCtrl.directivename = directivename;

        var EventHandler = $famous['famous/core/EventHandler'];
        faSlideBoxCtrl.eventHandler = new EventHandler();

        faSlideBoxCtrl.getScrollView = function() {
            if(!faSlideBoxCtrl.scrollView) {
                faSlideBoxCtrl.scrollView = $famous.find('fa-scroll-view')[0];
            }
            return faSlideBoxCtrl.scrollView;
        };
    };
    controller.$inject = controllerDeps;

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
                        // scope.$watch
                        // console.log(faSlideBoxCtrl.getScrollView());
                        // setTimeout(function() {
                        debugger;
                        faSlideBoxCtrl.getScrollView().renderNode.sync.addSync(['mouse']);
                        // faSlideBoxCtrl.scrollView = $famous.find('fa-scroll-view')[0].renderNode;
                        // }, 1000);
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
