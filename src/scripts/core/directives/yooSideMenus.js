'use strict';
/*eslint consistent-this:[2,  "yooSideMenusCtrl"] */
var directivename = 'yooSideMenus';
var _ = require('lodash');

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {
        var yooSideMenusCtrl = this;
        yooSideMenusCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = ['$famous', '$timeline', '$window', app.name + '.sideMenuDelegate'];
    var directive = function($famous, $timeline, $window, sideMenuDelegate) {
        return {
            restrict: 'E',
            scope: {
                title: '@' // '@' reads attribute value, '=' provides 2-way binding, '&" works with functions
            },
            transclude: true,
            controller: controller,
            require: ['yooSideMenus'],
            controllerAs: 'yooSideMenusCtrl',
            bindToController: true,
            template: require('./yooSideMenus.html'),
            compile: function(tElement, tAttrs) {
                return {
                    pre: function(scope, element, attrs, ctrls) {

                    },
                    post: function(scope, element, attrs, ctrls) {

                        var Transitionable = $famous['famous/transitions/Transitionable'];
                        var GenericSync = $famous['famous/inputs/GenericSync'];
                        var MouseSync = $famous['famous/inputs/MouseSync'];
                        var TouchSync = $famous['famous/inputs/TouchSync'];
                        var EventHandler = $famous['famous/core/EventHandler'];
                        GenericSync.register({
                            'mouse': MouseSync,
                            'touch': TouchSync
                        });

                        var SnapTransition = $famous['famous/transitions/SnapTransition'];
                        var SpringTransition = $famous['famous/transitions/SpringTransition'];
                        var WallTransition = $famous['famous/transitions/WallTransition'];
                        Transitionable.registerMethod('spring', SpringTransition);
                        Transitionable.registerMethod('wall', WallTransition);
                        Transitionable.registerMethod('snap', SnapTransition);

                        var yooSideMenusCtrl = ctrls[0];
                        yooSideMenusCtrl.transitionable = new Transitionable(1);
                        var sync = new GenericSync(['mouse', 'touch']);

                        yooSideMenusCtrl.eventHandler = new EventHandler();
                        yooSideMenusCtrl.eventHandler.pipe(sync);

                        var edgeDragThreshold = [0, 0];

                        // scope.$watchGroup([
                        //     'yooSideMenusCtrl.left.getEnabled()',
                        //     'yooSideMenusCtrl.left.getWidth()',
                        //     'yooSideMenusCtrl.right.getEnabled()',
                        //     'yooSideMenusCtrl.right.getWidth()',
                        //     'yooSideMenusCtrl.content.getWidth()',
                        //     'yooSideMenusCtrl.content.getEdgeDragThreshold()',
                        //     'yooSideMenusCtrl.content.getSurface().renderNode.content.clientWidth'
                        // ], function(vals) {
                        //     var leftEnabled = vals[0];
                        //     var leftWidth = vals[1];
                        //     var rightEnabled = vals[2];
                        //     var rightWidth = vals[3];
                        //     var contentWidth = vals[4];
                        //     var threshold = vals[5];

                        var setupTranslateFns = function() {
                            var leftEnabled = yooSideMenusCtrl.left.getEnabled();
                            var leftWidth = yooSideMenusCtrl.left.getWidth();
                            var rightEnabled = yooSideMenusCtrl.right.getEnabled();
                            var rightWidth = yooSideMenusCtrl.right.getWidth();
                            var contentWidth = yooSideMenusCtrl.content.getWidth();
                            var threshold = yooSideMenusCtrl.content.getEdgeDragThreshold();

                            if(contentWidth) { // only do stuff if we have gotten back the actual content width
                                var contentTranslate = [[1, [0, 0]]];

                                if(leftEnabled) { // if leftEnabled add 0 state to left side of translate array 
                                    contentTranslate.unshift([0, [leftWidth - 0 || 0, 0]]);
                                    yooSideMenusCtrl.left.translate = $timeline([
                                        [0, [0, 0]],
                                        [1, [-leftWidth, 0]],
                                        [2, [-leftWidth * 2, 0]]
                                    ]);
                                    yooSideMenusCtrl.left.getSurface().show(); // leftEnabled is true so show left menu
                                    if(threshold && threshold !== 0) { // also make sure to update the left drag threshhold
                                        edgeDragThreshold[0] = threshold;
                                    }
                                }
                                if(rightEnabled) { // if rightEnabled add 2 state to right side of translate array
                                    contentTranslate.push([2, [-rightWidth - 0 || 0, 0]]);
                                    yooSideMenusCtrl.right.translate = $timeline([
                                        [0, [contentWidth + rightWidth, 0]],
                                        [1, [contentWidth, 0]],
                                        [2, [contentWidth - rightWidth, 0]]
                                    ]);
                                    yooSideMenusCtrl.right.getSurface().show(); // rightEnabled is true so show right menu
                                    if(threshold && threshold !== 0) { // also make sure to update the right drag threshhold
                                        edgeDragThreshold[1] = contentWidth - threshold;
                                    }
                                }
                                yooSideMenusCtrl.content.translate = $timeline(contentTranslate);
                            }
                        }

                        scope.$watch(function() {
                            return {
                                contentSize: yooSideMenusCtrl.content.getSurface().renderNode.content.clientWidth,
                                leftEnabled: yooSideMenusCtrl.left.getEnabled(),
                                leftWidth: yooSideMenusCtrl.left.getWidth(),
                                rightEnabled: yooSideMenusCtrl.right.getEnabled(),
                                rightWidth: yooSideMenusCtrl.right.getWidth(),
                                contentWidth: yooSideMenusCtrl.content.getWidth(),
                                threshold: yooSideMenusCtrl.content.getEdgeDragThreshold()
                            };
                        }, setupTranslateFns, true);

                        angular.element($window).on('resize', setupTranslateFns);

                        var start;
                        var startX;
                        var updateAllowed;
                        var startInBounds = function() {
                            var threshold = yooSideMenusCtrl.content.getEdgeDragThreshold();
                            if(!threshold || start <= 0.5 || start >= 1.5) {
                                return true;
                            } else if(typeof startX === 'number') {
                                return startX <= edgeDragThreshold[0] || startX >= edgeDragThreshold[1];
                            }
                            return true;
                        };

                        sync.on('start', function(data) {
                            start = yooSideMenusCtrl.transitionable.get();
                            startX = data.clientX;
                        });

                        sync.on('update', function(data) {
                            if(updateAllowed || startInBounds()) {
                                if(!updateAllowed) {
                                    updateAllowed = true;
                                }
                                var delta = yooSideMenusCtrl.transitionable.get() - data.delta[0] / 300;
                                if(delta < start + 1 && delta > start - 1) {
                                    yooSideMenusCtrl.transitionable.set(yooSideMenusCtrl.transitionable.get() - data.delta[0] / 300);
                                }
                            } 
                            // else {
                            //     console.log('bad start from ', startX, 'with start position of', start);
                            //     console.log('update after start not within', yooSideMenusCtrl.content.getEdgeDragThreshold(), 'px of edge', data);
                            // }
                        });

                        sync.on('end', function(data) {
                            if(updateAllowed || startInBounds()) {
                                var next;
                                if(Math.abs(data.velocity[0]) > 0.5) {
                                    next = data.velocity[0] > 0 ? Math.floor(yooSideMenusCtrl.transitionable.get()) : Math.ceil(yooSideMenusCtrl.transitionable.get());
                                } else {
                                    next = Math.round(yooSideMenusCtrl.transitionable.get());
                                }
                                yooSideMenusCtrl.transitionable.set(next, {
                                    period: 300,
                                    method: 'wall',
                                    dampingRatio: 0.2
                                });
                            } 
                            updateAllowed = false;
                        });

                        var deregisterInstance = sideMenuDelegate._registerInstance(
                            yooSideMenusCtrl, attrs.delegateHandle || attrs.id
                        );

                        scope.$on('$destroy', function() {
                            deregisterInstance();
                        });
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
