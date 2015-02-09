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

        yooSlideBoxCtrl.getScrollview = function() {
            if(!yooSlideBoxCtrl.scrollview) {
                yooSlideBoxCtrl.scrollview = famousHelper.find('fa-scroll-view')[0];
            }
            return yooSlideBoxCtrl.scrollview;
        };

        yooSlideBoxCtrl.getTotalPages = function() {
            if(yooSlideBoxCtrl.getScrollview()) {
                return yooSlideBoxCtrl.getScrollview().renderNode.getTotalPages();
            } else {
                return 0;
            }
        };

        yooSlideBoxCtrl.getPageDistance = function(index) {
            if(yooSlideBoxCtrl.getScrollview()) {
                return yooSlideBoxCtrl.getScrollview().renderNode.getPageDistance(index);
            } else {
                return index;
            }
        };

        yooSlideBoxCtrl.setMouseSync = function() {
            if(yooSlideBoxCtrl.getScrollview()) {
                yooSlideBoxCtrl.getScrollview().renderNode.setMouseSync();
            }
        };

        yooSlideBoxCtrl.goToPage = function(index) {
            if(yooSlideBoxCtrl.getScrollview()) {
                yooSlideBoxCtrl.getScrollview().renderNode.goToPage(index);
            }
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
                showPager: '='
            },
            controller: controller,
            controllerAs: 'yooSlideBoxCtrl',
            bindToController: true,
            template: require('./yooSlideBox.html'),
            transclude: true,
            compile: function(tElement, tAttrs) {
                return {
                    pre: function(scope, element, attrs, ctrls) {
                        var yooSlideBoxCtrl = ctrls[0];
                        yooSlideBoxCtrl.pages = 0;
                    },
                    post: function(scope, element, attrs, ctrls) {
                        var yooSlideBoxCtrl = ctrls[0];
                        yooSlideBoxCtrl.setMouseSync();

                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
