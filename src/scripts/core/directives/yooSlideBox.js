'use strict';
/*eslint consistent-this:[2,  "yooSlideBoxCtrl"] */
var directivename = 'yooSlideBox';

module.exports = function(app) {

    // controller
    var controllerDeps = ['$famous', '$timeline', '$timeout', app.name + '.famousHelper'];
    var controller = function($famous, $timeline, $timeout, famousHelper) {

        var yooSlideBoxCtrl = this;
        yooSlideBoxCtrl.directivename = directivename;

        var EventHandler = $famous['famous/core/EventHandler'];
        yooSlideBoxCtrl.eventHandler = new EventHandler();

        yooSlideBoxCtrl.scrollviewFaOptions = {
            direction: 0,
            paginated: true,
            pagePeriod: 300,
            pageDamp: 0.4
        };

        yooSlideBoxCtrl.getScrollview = function() {
            if(!yooSlideBoxCtrl.scrollview) {
                yooSlideBoxCtrl.scrollview = famousHelper.find('fa-scroll-view')[0];
            }
            return yooSlideBoxCtrl.scrollview;
        };

        /**********Exposed ScrollView Functions**********/

        yooSlideBoxCtrl.getTotalPages = function() {
            if(yooSlideBoxCtrl.getScrollview()) {
                return yooSlideBoxCtrl.getScrollview().renderNode.getTotalPages();
            } else {
                return 0;
            }
        };

        yooSlideBoxCtrl.getCurrentIndex = function() {
            try {
                if(yooSlideBoxCtrl.getScrollview()) {
                    return yooSlideBoxCtrl.getScrollview().renderNode.getCurrentIndex();
                } else {
                    return 0;
                }
            } catch(err) {
                return 0;
            }
        };

        yooSlideBoxCtrl.getContainerLength = function() {
            if(yooSlideBoxCtrl.getScrollview()) {
                return yooSlideBoxCtrl.getScrollview().renderNode.getContainerLength() || 0;
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

        yooSlideBoxCtrl.goToPage = function(index) {
            if(yooSlideBoxCtrl.getScrollview()) {
                yooSlideBoxCtrl.getScrollview().renderNode.goToPage(index);
            }
        };

        yooSlideBoxCtrl.goToPreviousPage = function() {
            if(yooSlideBoxCtrl.getScrollview()) {
                yooSlideBoxCtrl.getScrollview().renderNode.goToPreviousPage();
            }
        };

        yooSlideBoxCtrl.goToNextPage = function() {
            if(yooSlideBoxCtrl.getScrollview()) {
                yooSlideBoxCtrl.getScrollview().renderNode.goToNextPage();
            }
        };

        yooSlideBoxCtrl.enableSlide = function(shouldEnable) {
            if(yooSlideBoxCtrl.getScrollview()) {
                yooSlideBoxCtrl.getScrollview().renderNode.enableSlide(shouldEnable);
            }
        };

        yooSlideBoxCtrl.setLoop = function(doesContinue) {
            if(yooSlideBoxCtrl.getScrollview()) {
                yooSlideBoxCtrl.getScrollview().renderNode.setLoop(doesContinue);
            }
        };

        /**********Ionic Delegate Functions**********/

        yooSlideBoxCtrl.slidesCount = function() {
            return yooSlideBoxCtrl.getTotalPages();
        };

        yooSlideBoxCtrl.currentIndex = function() {
            return yooSlideBoxCtrl.getCurrentIndex();
        };

        yooSlideBoxCtrl.slide = function(index) {
            yooSlideBoxCtrl.goToPage(index);
        };

        yooSlideBoxCtrl.previous = function() {
            yooSlideBoxCtrl.goToPreviousPage();
        };

        yooSlideBoxCtrl.next = function() {
            yooSlideBoxCtrl.goToNextPage();
        };

        yooSlideBoxCtrl.start = function() {
            yooSlideBoxCtrl.autoPlay = true;
        };

        yooSlideBoxCtrl.stop = function() {
            yooSlideBoxCtrl.autoPlay = false;
        };

        yooSlideBoxCtrl.startInner = function() {
            yooSlideBoxCtrl.stopInner();
            yooSlideBoxCtrl.autoPlayTimeout = $timeout(function() {
                yooSlideBoxCtrl[yooSlideBoxCtrl.slideDirection]();
                yooSlideBoxCtrl.startInner();
            }, yooSlideBoxCtrl.slideInterval);
            yooSlideBoxCtrl.autoPlayTimeout.cancel = $timeout.cancel.bind(this, yooSlideBoxCtrl.autoPlayTimeout);
        };

        yooSlideBoxCtrl.stopInner = function() {
            if(yooSlideBoxCtrl.autoPlayTimeout) {
                yooSlideBoxCtrl.autoPlayTimeout.cancel();
                delete yooSlideBoxCtrl.autoPlayTimeout;
            }
        };

        /**********Setup Functions**********/

        yooSlideBoxCtrl.setMouseSync = function() {
            if(yooSlideBoxCtrl.getScrollview()) {
                yooSlideBoxCtrl.getScrollview().renderNode.setMouseSync();
            }
        };

        yooSlideBoxCtrl.setAnimation = function(animationType, size) {
            switch(animationType) {
                case 'animation1':
                    //var size = yooSlideBoxCtrl.getContainerLength();

                    yooSlideBoxCtrl.slideTranslate = $timeline([
                        [-1, [-50, 30]],
                        [0, [0, 30]],
                        [10, [-size * 10, -35 * 10]]
                    ]);

                    yooSlideBoxCtrl.slideScale = $timeline([
                        [-1, [1, 1]],
                        [0, [1, 1]],
                        [10, [0.1, 0.1]]
                    ]);

                    yooSlideBoxCtrl.slideRotate = $timeline([
                        [0, 0]
                    ]);

                    yooSlideBoxCtrl.slideOpacity = $timeline([
                        [0, 1]
                    ]);
                    break;

                case 'animation2':
                    yooSlideBoxCtrl.slideTranslate = $timeline([
                        [-1, [-40, 100]],
                        [0, [0, 0]],
                        [1, [60, 0]]
                    ]);

                    yooSlideBoxCtrl.slideScale = $timeline([
                        [-1, [0.7, 0.7]],
                        [0, [0.8, 0.8]],
                        [1, [0.7, 0.7]]
                    ]);

                    yooSlideBoxCtrl.slideOpacity = $timeline([
                        [-1, 0.4],
                        [0, 1],
                        [1, 0.4]
                    ]);

                    yooSlideBoxCtrl.slideRotate = $timeline([
                        [-1, -Math.PI / 10],
                        [0, 0],
                        [1, Math.PI / 10]
                    ]);
                    break;

                default:
                    yooSlideBoxCtrl.slideTranslate = $timeline([
                        [-1, [-4, 0]],
                        [0, [0, 0]],
                        [1, [4, 0]]
                    ]);

                    yooSlideBoxCtrl.slideScale = $timeline([
                        [0, [1, 1]]
                    ]);

                    yooSlideBoxCtrl.slideRotate = $timeline([
                        [0, 0]
                    ]);

                    yooSlideBoxCtrl.slideOpacity = $timeline([
                        [0, 1]
                    ]);
                    break;
            }
        };
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    var directiveDeps = ['$famous', 'yoobic.angular.core.directiveBinder', 'yoobic.angular.core.scopeHelper', app.name + '.slideBoxDelegate'];
    var directive = function($famous, directiveBinder, scopeHelper, slideBoxDelegate) {

        return {
            require: ['yooSlideBox'],
            restrict: 'AE',
            scope: {
                animationType: '@',
                pagerClick: '&',
                activeSlide: '=?',
                onSlideChanged: '&',
                showPager: '=',
                autoPlay: '@',
                doesContinue: '@',
                slideDirection: '@',
                slideInterval: '@'
            },
            controller: controller,
            controllerAs: 'yooSlideBoxCtrl',
            bindToController: true,
            template: require('./yooSlideBox.html'),
            transclude: true,
            compile: function(tElement, tAttrs) {
                function cleanSlideDirection(slideDirection) {
                    if(slideDirection !== 'goToPreviousPage') {
                        slideDirection = 'goToNextPage';
                    }
                    return slideDirection;
                }
                return {
                    pre: function(scope, element, attrs, ctrls) {
                        var yooSlideBoxCtrl = ctrls[0];
                        yooSlideBoxCtrl.pages = 0;

                        directiveBinder.toPrimitive(scope, attrs, yooSlideBoxCtrl, 'doesContinue', false, 'boolean');
                        directiveBinder.toPrimitive(scope, attrs, yooSlideBoxCtrl, 'autoPlay', yooSlideBoxCtrl.doesContinue, 'boolean');
                        directiveBinder.toPrimitive(scope, attrs, yooSlideBoxCtrl, 'slideInterval', 4000, 'number');

                        yooSlideBoxCtrl.slideDirection = cleanSlideDirection(yooSlideBoxCtrl.slideDirection);
                        attrs.$observe('slideDirection', function(slideDirection) {
                            yooSlideBoxCtrl.slideDirection = cleanSlideDirection(slideDirection);
                        });

                        var deregisterInstance = slideBoxDelegate._registerInstance(
                            yooSlideBoxCtrl, attrs.delegateHandle

                        );

                        scope.$on('$destroy', function() {
                            yooSlideBoxCtrl.stopInner();
                            deregisterInstance();
                        });
                    },
                    post: function(scope, element, attrs, ctrls) {
                        var yooSlideBoxCtrl = ctrls[0];
                        yooSlideBoxCtrl.setMouseSync();

                        // attrs.$observe('animationType', function(animationType) {
                        //     yooSlideBoxCtrl.setAnimation(animationType);
                        // });

                        scope.$watch('yooSlideBoxCtrl.animationType', function(animationType) {
                            yooSlideBoxCtrl.setAnimation(animationType, yooSlideBoxCtrl.getContainerLength());
                        });

                        scope.$watch('yooSlideBoxCtrl.activeSlide', function(slide) {
                            if(typeof slide !== 'undefined') {
                                yooSlideBoxCtrl.goToPage(slide);
                            }
                        });

                        scopeHelper.$watchPostDigest(scope, 'yooSlideBoxCtrl.doesContinue', function(doesContinue) {
                            yooSlideBoxCtrl.setLoop(doesContinue);
                        });
                        // var __postDigestQueued = false;
                        // scope.$watch('yooSlideBoxCtrl.doesContinue', function(doesContinue, oldDoesContinue) {
                        //     if(__postDigestQueued) {
                        //         return;
                        //     }
                        //     __postDigestQueued = true;
                        //     scope.$$postDigest(function() {
                        //         __postDigestQueued = false;
                        //         yooSlideBoxCtrl.setLoop(yooSlideBoxCtrl.doesContinue);
                        //     });
                        // });

                        scope.$watch(function() {
                            return yooSlideBoxCtrl.getContainerLength();
                        }, function(size) {
                            yooSlideBoxCtrl.setAnimation(yooSlideBoxCtrl.animationType, size);
                        });

                        scope.$watch(function() {
                            return yooSlideBoxCtrl.getCurrentIndex();
                        }, function(index) {
                            if(yooSlideBoxCtrl.onSlideChanged) {
                                yooSlideBoxCtrl.onSlideChanged(index);
                            }
                        });

                        scope.$watch(function() {
                            return {
                                autoPlay: yooSlideBoxCtrl.autoPlay,
                                slideInterval: yooSlideBoxCtrl.slideInterval,
                                slideDirection: yooSlideBoxCtrl.slideDirection
                            };
                        }, function(newVal, oldVal) {
                            if(newVal.slideDirection !== oldVal.slideDirection) {
                                yooSlideBoxCtrl.slideDirection = cleanSlideDirection(newVal.slideDirection);
                            }

                            if(newVal.autoPlay) {
                                yooSlideBoxCtrl.startInner(); // start autoPlay $timeout loop
                            } else {
                                yooSlideBoxCtrl.stopInner(); // stop autoPlay & cancel $timeout
                            }
                        }, true);

                        // $interval(function() {
                        //     console.log(' index: ', yooSlideBoxCtrl.getCurrentIndex());
                        // }, 1000);
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
