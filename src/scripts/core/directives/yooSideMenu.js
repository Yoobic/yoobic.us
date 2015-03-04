'use strict';
/*eslint consistent-this:[2,  "yooSideMenuCtrl"] */
var directivename = 'yooSideMenu';
var angular = require('angular');
var _ = require('lodash');

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {
        var yooSideMenuCtrl = this;
        yooSideMenuCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = ['$window', '$timeline', app.name + '.famousHelper', app.namespace.yoobicCore + '.directiveBinder'];
    var directive = function($window, $timeline, famousHelper, directiveBinder) {
        return {
            restrict: 'E',
            scope: true,
            controller: controller,
            controllerAs: 'yooSideMenuCtrl',
            bindToController: true,
            require: ['yooSideMenu', '^yooSideMenus'],
            compile: function(tElement, tAttrs) {
                if(_.isUndefined(tAttrs.width)) {
                    tAttrs.$set('width', '275');
                }
                famousHelper.manualTransclude(require('./yooSideMenu.html'), tElement, 'fa-surface', '<fa-surface></fa-surface>');
                var surfaces = tElement.find('fa-surface');
                surfaces.attr('fa-pipe-to', 'yooSideMenusCtrl.eventHandler');
                surfaces.attr('class', 'full-height');

                //surfaces.attr('fa-z-index', 'yooSlideBoxCtrl.pages - yooSlideCtrl.pageIndex');

                return {
                    pre: function(scope, element, attrs, ctrls) {
                        // copying parent controller on the local scope, so we have easy access in the template
                        var yooSideMenusCtrl = ctrls[1];
                        var yooSideMenuCtrl = ctrls[0];
                        scope.yooSideMenusCtrl = yooSideMenusCtrl;

                        directiveBinder['@'](scope, attrs, yooSideMenuCtrl, 'width');

                        if(attrs.side === 'left') {

                            yooSideMenusCtrl.leftWidth = yooSideMenuCtrl.width;
                            yooSideMenuCtrl.translate = $timeline([
                                [0, [0, 0]],
                                [1, [-yooSideMenuCtrl.width, 0]]
                            ]);
                        } else if(attrs.side === 'right') {
                            yooSideMenusCtrl.rightWidth = yooSideMenuCtrl.width;
                            yooSideMenuCtrl.translate = $timeline([
                                [1, [$window.innerWidth, 0]],
                                [2, [$window.innerWidth - yooSideMenuCtrl.width, 0]]
                            ]);
                        }

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
