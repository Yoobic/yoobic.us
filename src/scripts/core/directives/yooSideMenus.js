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
    var directiveDeps = ['$famous', '$timeline', app.name + '.sideMenuDelegate'];
    var directive = function($famous, $timeline, sideMenuDelegate) {
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

                        scope.$watchGroup([
                            'yooSideMenusCtrl.left.getEnabled()',
                            'yooSideMenusCtrl.left.getWidth()',
                            'yooSideMenusCtrl.right.getEnabled()',
                            'yooSideMenusCtrl.right.getWidth()',
                            'yooSideMenusCtrl.content.getWidth()'
                        ], function(vals) {
                            var leftEnabled = 0;
                            var leftWidth = 1;
                            var rightEnabled = 2;
                            var rightWidth = 3;
                            var contentWidth = 4;

                            if(vals[contentWidth]) {
                                var contentTranslate = [];

                                if(vals[leftEnabled]) {
                                    contentTranslate.push([0, [vals[leftWidth] - 0 || 0, 0]]);
                                    yooSideMenusCtrl.left.translate = $timeline([
                                        [0, [0, 0]],
                                        [1, [-vals[leftWidth], 0]],
                                        [2, [-vals[leftWidth] * 2, 0]]
                                    ]);
                                    yooSideMenusCtrl.left.getSurface().show();
                                }

                                contentTranslate.push([1, [0, 0]]);

                                if(vals[rightEnabled]) {
                                    contentTranslate.push([2, [-vals[rightWidth] - 0 || 0, 0]]);
                                    yooSideMenusCtrl.right.translate = $timeline([
                                        [0, [vals[contentWidth] + vals[rightWidth], 0]],
                                        [1, [vals[contentWidth], 0]],
                                        [2, [vals[contentWidth] - vals[rightWidth], 0]]
                                    ]);
                                    yooSideMenusCtrl.right.getSurface().show();
                                }

                                yooSideMenusCtrl.content.translate = $timeline(contentTranslate);
                            }
                        });

                        var start;
                        var startInBounds = function(start, data, threshold) {
                            if(!yooSideMenusCtrl.content.edgeDragThreshold) {
                                return true;
                            } else {
                                var lBound = threshold +
                                    start === 0 ? yooSideMenusCtrl.left.getWidth() :
                                    start === 2 ? -threshold : 0;
                                var rBound = yooSideMenusCtrl.content.getWidth() + threshold +
                                    start === 0 ? yooSideMenusCtrl.left.getWidth() :
                                    start === 2 ? -threshold : 0;
                            }
                        };

                        var _cancelUpdate;
                        var _cancelStart = function(data) {
                            if(!yooSideMenusCtrl.content.edgeDragThreshold) {
                                return false;
                            } else {
                                transitionable.
                                _cancelUpdate = true &&
                                data.clientX >= yooSideMenusCtrl.content.edgeDragThreshold &&
                                // data.offsetX >= yooSideMenusCtrl.content.edgeDragThreshold &&
                                // data.x >= yooSideMenusCtrl.content.edgeDragThreshold &&
                                data.clientX <= yooSideMenusCtrl.content.getWidth() - yooSideMenusCtrl.content.edgeDragThreshold //&&
                                // data.offsetX <= yooSideMenusCtrl.content.getWidth() - yooSideMenusCtrl.content.edgeDragThreshold //&&
                                // data.x <= yooSideMenusCtrl.content.getWidth() - yooSideMenusCtrl.content.edgeDragThreshold
                                ;
                                console.log('_cancelUpdate', _cancelUpdate);
                                return _cancelUpdate;
                            }
                        };


                        var _cancelEnd = function() {
                                console.log('_cancelUpdate', _cancelUpdate);
                            if(_cancelUpdate) {
                                _cancelUpdate = false;
                                return true;
                            } else {
                                _cancelUpdate = false;
                                return false;
                            }
                        };
                        sync.on('start', function(data) {
                            if(!_cancelStart(data)) {
                                console.log('allowed start', yooSideMenusCtrl.content.edgeDragThreshold, data);
                            } else {
                                 console.log('start not close to edge', yooSideMenusCtrl.content.edgeDragThreshold, data);
                            }
                            start = yooSideMenusCtrl.transitionable.get();
                        });

                        sync.on('update', function(data) {
                            if(!_cancelUpdate) {
                                console.log('allowed update',data);
                                var delta = yooSideMenusCtrl.transitionable.get() - data.delta[0] / 300;
                                if(delta < start + 1 && delta > start - 1) {
                                    yooSideMenusCtrl.transitionable.set(yooSideMenusCtrl.transitionable.get() - data.delta[0] / 300);
                                }

                            } else {
                                console.log('update after start not close to edge', yooSideMenusCtrl.content.edgeDragThreshold, data);
                            }
                        });

                        sync.on('end', function(data) {
                            if(!_cancelEnd()) {
                                console.log('allowed end',data);
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
                            } else {
                                console.log('end not close to edge', yooSideMenusCtrl.content.edgeDragThreshold, data);
                            }
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
