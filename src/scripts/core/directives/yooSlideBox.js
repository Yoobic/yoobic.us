'use strict';
/*eslint consistent-this:[2,  "yooSlideBoxCtrl"] */
var directivename = 'yooSlideBox';

module.exports = function(app) {

    // controller
    var controllerDeps = ['$famous', '$timeline', app.name + '.famousHelper'];
    var controller = function($famous, $timeline, famousHelper) {

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
            }
            catch(err) {
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
                var toPageIndex = index % yooSlideBoxCtrl.getTotalPages();
                if(toPageIndex < 0) {
                    toPageIndex += yooSlideBoxCtrl.getTotalPages();
                }
                yooSlideBoxCtrl.getScrollview().renderNode.goToPage(toPageIndex);
            }
        };

        /**********Ionic Delegate Functions**********/

        /*
         * update() - Update the slidebox (for example if using Angular with ng-repeat, resize it for the elements inside).
         * X! slide(to, [speed]) - Slide to `to` at speed `speed`
         * enableSlide([shouldEnable]) - Returns boolean for whether sliding is enabled or not, shouldEnable dictates state
         * XX previous() -  go to previous slide
         * XX next() - go to next slide
         * stop() - stop automatically sliding
         * start() - start automatically sliding
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
            yooSlideBoxCtrl.goToPage(yooSlideBoxCtrl.getCurrentIndex() - 1);
        };

        yooSlideBoxCtrl.next = function() {
            yooSlideBoxCtrl.goToPage(yooSlideBoxCtrl.getCurrentIndex() + 1);
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
                showPager: '=',
                animationType: '@'
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

                        scope.$watch(function() {
                            return yooSlideBoxCtrl.getContainerLength();
                        }, function(size) {
                            yooSlideBoxCtrl.setAnimation(yooSlideBoxCtrl.animationType, size);
                        });

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
