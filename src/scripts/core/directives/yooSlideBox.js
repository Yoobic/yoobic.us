'use strict';
/*eslint consistent-this:[2,  "yooSlideBoxCtrl"] */
var directivename = 'yooSlideBox';

module.exports = function(app) {

    // controller
    var controllerDeps = ['$famous', app.name + '.famousHelper'];
    var controller = function($famous, famousHelper) {
        var yooSlideBoxCtrl = this;
        yooSlideBoxCtrl.directivename = directivename;

        var EventHandler = $famous['famous/core/EventHandler'];
        yooSlideBoxCtrl.eventHandler = new EventHandler();

        yooSlideBoxCtrl.getScrollView = function() {
            if(!yooSlideBoxCtrl.scrollView) {
                yooSlideBoxCtrl.scrollView = famousHelper.find('fa-scroll-view')[0];
            }
            return yooSlideBoxCtrl.scrollView;
        };

        yooSlideBoxCtrl.getTotalPage = function() {
            yooSlideBoxCtrl.getScrollView().getTotalPage();
        };
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = ['$famous'];
    var directive = function($famous) {
        return {
            require: ['yooSlideBox'],
            restrict: 'AE',
            scope: {
                title: '@' // '@' reads attribute value, '=' provides 2-way binding, '&" works with functions
            },
            controller: controller,
            controllerAs: 'yooSlideBoxCtrl',
            bindToController: true,
            template: require('./yooSlideBox.html'),
            transclude: true,
            compile: function(tElement, tAttrs) {
                return {
                    pre: function(scope, element, attrs) {

                    },
                    post: function(scope, element, attrs, ctrls) {
                        var yooSlideBoxCtrl = ctrls[0];
                        yooSlideBoxCtrl.getScrollView().renderNode.sync.addSync(['mouse']);
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
