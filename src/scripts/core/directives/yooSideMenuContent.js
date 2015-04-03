'use strict';
/*eslint consistent-this:[2,  "yooSideMenuContentCtrl"] */
var directivename = 'yooSideMenuContent';
var _ = require('lodash');

module.exports = function(app) {

    // controller
    var controllerDeps = [app.name + '.famousHelper'];
    var controller = function(famousHelper) {
        var yooSideMenuContentCtrl = this;
        yooSideMenuContentCtrl.directivename = directivename;

        yooSideMenuContentCtrl.getSurface = function() {
            if(!yooSideMenuContentCtrl.surface) {
                yooSideMenuContentCtrl.surface = famousHelper.find('fa-surface')[0];
            }
            return yooSideMenuContentCtrl.surface;
        };

        yooSideMenuContentCtrl.getWidth = function() {
            if(yooSideMenuContentCtrl.getSurface() && yooSideMenuContentCtrl.getSurface().renderNode.getSize()) {
                return yooSideMenuContentCtrl.getSurface().renderNode.getSize()[0];
            } else {
                return 0;
            }
        };

        yooSideMenuContentCtrl.getEdgeDragThreshold = function() {
            if(typeof yooSideMenuContentCtrl.edgeDragThreshold === 'number') {
                return yooSideMenuContentCtrl.edgeDragThreshold;
            } else if(yooSideMenuContentCtrl.edgeDragThreshold === true) {
                if(yooSideMenuContentCtrl.getSurface() && yooSideMenuContentCtrl.getSurface().renderNode.getSize()) {
                    var edgeWidth = yooSideMenuContentCtrl.getSurface().renderNode.getSize()[0] * 0.05;
                    return 25 > edgeWidth ? 25 : edgeWidth;
                }
                return 25;
            }
            return 0;
        };

    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [app.name + '.famousHelper', app.namespace.yoobicCore + '.directiveBinder'];
    var directive = function(famousHelper, directiveBinder) {
        return {
            restrict: 'E',
            scope: true,
            controller: controller,
            controllerAs: 'yooSideMenuContentCtrl',
            require: ['yooSideMenuContent', '^yooSideMenus'],
            bindToController: true,
            priority: 100,
            compile: function(tElement, tAttrs) {
                famousHelper.manualTransclude(require('./yooSideMenuContent.html'), tElement, 'fa-surface', '<fa-surface></fa-surface>');
                var surfaces = tElement.find('fa-surface');

                surfaces.attr('fa-pipe-to', 'yooSideMenuContentCtrl.dragContent && yooSideMenusCtrl.eventHandler');
                surfaces.attr('class', 'full-height');
                surfaces.attr('fa-z-index', '50');

                return {
                    pre: function(scope, element, attrs, ctrls) {
                        var yooSideMenuContentCtrl = ctrls[0];
                        var yooSideMenusCtrl = ctrls[1];
                        // yooSideMenuContentCtrl.$scope = scope;
                        // attach controller w/ scope to parent as yooSideMenusCtrl.content
                        yooSideMenusCtrl.content = yooSideMenuContentCtrl;
                        scope.yooSideMenusCtrl = yooSideMenusCtrl;

                        // var EventHandler = $famous['famous/core/EventHandler'];

                        directiveBinder.toPrimitive(scope, attrs, yooSideMenuContentCtrl, 'dragContent', true, 'boolean');
                        directiveBinder.toPrimitive(scope, attrs, yooSideMenuContentCtrl, 'edgeDragThreshold', false);

                        // attrs.$observe('edgeDragThreshold', function(edgeDragThreshold) {
                        //     edgeDragThreshold = scope.$eval(edgeDragThreshold);
                        //     yooSideMenuContentCtrl.edgeDragThreshold = cleanEdgeDragThreshold(edgeDragThreshold);
                        // });

                    },
                    post: function(scope, element, attrs, ctrls) {
                        // copying parent controller on the local scope, so we have easy access in the template
                        // var yooSideMenuContentCtrl = ctrls[0];
                        // var yooSideMenusCtrl = ctrls[1];
                        // scope.yooSideMenusCtrl = yooSideMenusCtrl;
                        // var surfaceEvents = ['click', 'mousedown', 'mousemove', 'mouseup', 'mouseover', 'mouseout', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'keydown', 'keyup', 'keypress'];
                        // _(surfaceEvents).forEach(function(eventName) {

                        //     yooSideMenuContentCtrl.getSurface().renderNode.on(eventName, function(evt) {
                        //         if(evt.x <= yooSideMenuContentCtrl.edgeDragThreshold || evt.x >= yooSideMenuContentCtrl.getWidth() - yooSideMenuContentCtrl.edgeDragThreshold) {

                        //         };
                        //     });
                        // });

                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
