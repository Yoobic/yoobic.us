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

        yooSlideBoxCtrl.getScrollview = function() {
            if(!yooSlideBoxCtrl.scrollview) {
                yooSlideBoxCtrl.scrollview = famousHelper.find('fa-scroll-view')[0];
            }
            return yooSlideBoxCtrl.scrollview;
        };

        yooSlideBoxCtrl.scrollviewFaOptions = {
            direction: 0,
            paginated: true,
            pagePeriod: 300,
            pageDamp: 0.4
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

        /**********Ionic API Helper methods**********/

        yooSlideBoxCtrl.cleanSlideDirection = function(slideDirection) {
            slideDirection = slideDirection || yooSlideBoxCtrl.slideDirection;
            if(slideDirection !== 'goToPreviousPage') {
                slideDirection = 'goToNextPage';
            }
            return slideDirection;
        };

        yooSlideBoxCtrl.enableContinue = function(doesContinue) {
            if(yooSlideBoxCtrl.getScrollview()) {
                $timeout(function() {
                    $timeout(function() {
                        yooSlideBoxCtrl.getScrollview().renderNode._node._.loop = doesContinue;
                    });
                });
            }
        };

        yooSlideBoxCtrl.autoPlaySet = function(autoPlay) {
            autoPlay = autoPlay !== undefined ? autoPlay : true;
            if(autoPlay) {
                yooSlideBoxCtrl.autoPlayTimeout = $timeout(function() {
                    if(yooSlideBoxCtrl.autoPlay) {
                        yooSlideBoxCtrl[yooSlideBoxCtrl.slideDirection]();
                        yooSlideBoxCtrl.autoPlaySet();
                    }
                }, yooSlideBoxCtrl.slideInterval);
                yooSlideBoxCtrl.autoPlayTimeout.cancel = $timeout.cancel;
            } else {
                yooSlideBoxCtrl.autoPlayCancel();
            }
        };

        yooSlideBoxCtrl.autoPlayCancel = function() {
            if(yooSlideBoxCtrl.autoPlayTimeout) {
                yooSlideBoxCtrl.autoPlayTimeout.cancel();
                delete yooSlideBoxCtrl.autoPlayTimeout;
            }
        };

        /**********Ionic Delegate Functions**********/

        /*
         * update() - Update the slidebox (for example if using Angular with ng-repeat, resize it for the elements inside).
         * X! slide(to, [speed]) - Slide to `to` at speed `speed`
         * XX enableSlide([shouldEnable]) - Returns boolean for whether sliding is enabled or not, shouldEnable dictates state
         * XX previous() -  go to previous slide
         * XX next() - go to next slide
         * XX stop() - stop automatically sliding
         * XX start() - start automatically sliding
         * XX currentIndex() - get current index
         * XX slidesCount() - return the total number of slides currently
         */

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
            yooSlideBoxCtrl.autoPlaySet();
        };

        yooSlideBoxCtrl.stop = function() {
            yooSlideBoxCtrl.autoPlayCancel();
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

    // directive
    var directiveDeps = ['$famous', app.name + '.slideBoxDelegate'];
    var directive = function($famous, slideBoxDelegate) {
        return {
            require: ['yooSlideBox'],
            restrict: 'AE',
            scope: {
                pagerClick: '&',
                activeSlide: '=?',
                onSlideChanged: '&',
                showPager: '=',
                animationType: '@',
                doesContinue: '=?',
                autoPlay: '=?',
                slideDirection: '=?',
                slideInterval: '=?'
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

                        yooSlideBoxCtrl.autoPlay = yooSlideBoxCtrl.autoPlay || yooSlideBoxCtrl.doesContinue;

                        yooSlideBoxCtrl.slideInterval = yooSlideBoxCtrl.slideInterval || 4000;

                        yooSlideBoxCtrl.slideDirection = yooSlideBoxCtrl.cleanSlideDirection();

                        var deregisterInstance = slideBoxDelegate._registerInstance(
                            yooSlideBoxCtrl, attrs.delegateHandle
                        );

                        scope.$on('$destroy', function() {
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

                        scope.$watch('yooSlideBoxCtrl.slideDirection', function(slideDirection) {
                            yooSlideBoxCtrl.slideDirection = yooSlideBoxCtrl.cleanSlideDirection(slideDirection);
                        });

                        scope.$watch('yooSlideBoxCtrl.doesContinue', function(doesContinue) {
                            yooSlideBoxCtrl.enableContinue(yooSlideBoxCtrl.doesContinue);
                        });

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

                        scope.$watch('yooSlideBoxCtrl.autoPlay', function(autoPlay) {
                            yooSlideBoxCtrl.autoPlaySet(autoPlay);
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
