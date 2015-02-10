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
    var directiveDeps = ['$timeline', app.name + '.famousHelper'];
    var directive = function($timeline, famousHelper) {
        return {
            require: ['yooSlide', '^yooSlideBox'],
            restrict: 'AE',
            scope: true,
            controller: controller,
            controllerAs: 'yooSlideCtrl',
            bindToController: true,
            compile: function(tElement, tAttrs) {
                /*
                var surfaces = tElement.find('fa-surface');

                if(surfaces.length <= 0) {
                    tElement[0].innerHTML = '<fa-surface>' + angular.element(tElement[0]).html() + '</fa-surface>';
                    surfaces = tElement.find('fa-surface');
                }
                surfaces.attr('fa-pipe-to', 'yooSlideBoxCtrl.eventHandler');
                surfaces.attr('class', 'full-height');

                tElement[0].innerHTML = require('./yooSlide.html').replace('<ng-transclude></ng-transclude>', tElement[0].innerHTML);
                */

                famousHelper.manualTransclude(require('./yooSlide.html'), tElement, 'fa-surface', '<fa-surface></fa-surface>');
                var surfaces = tElement.find('fa-surface');
                surfaces.attr('fa-pipe-to', 'yooSlideBoxCtrl.eventHandler');
                surfaces.attr('class', 'full-height');
                surfaces.attr('fa-z-index', 'yooSlideBoxCtrl.pages - yooSlideCtrl.pageIndex');
                return {
                    pre: function(scope, element, attrs, ctrls) {
                        // copying parent controller on the local scope, so we have easy access in the template
                        var yooSlideBoxCtrl = ctrls[1];
                        var yooSlideCtrl = ctrls[0];
                        scope.yooSlideBoxCtrl = yooSlideBoxCtrl;
                        yooSlideCtrl.pageIndex = yooSlideBoxCtrl.pages++;
                        yooSlideCtrl.getPageDistance = function() {
                            return yooSlideBoxCtrl.getPageDistance(yooSlideCtrl.pageIndex);
                        };

                        yooSlideCtrl.translate = $timeline([
                            [-10, [300, 0]],
                            [-1, [300, 0]],
                            [0, [0, 0.8]],
                            [1, [-300, 0]],
                            [10, [-300, 0]]
                        ]);

                        yooSlideCtrl.scale = $timeline([
                            [-1, [0.1, 0.1]],
                            [0, [0.3, 0.3]],
                            [1, [0.1, 0.1]]
                        ]);

                        yooSlideCtrl.rotate = $timeline([
                            [-1, -0 * Math.PI / 10],
                            [0, 0],
                            [1, 0 * Math.PI / 10]
                        ]);
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
