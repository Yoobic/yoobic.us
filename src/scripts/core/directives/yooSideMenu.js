'use strict';
/*eslint consistent-this:[2,  "yooSideMenuCtrl"] */
var directivename = 'yooSideMenu';
var angular = require('angular');
var _ = require('lodash');

// XXside
// string
// Which side the side menu is currently on. Allowed values: 'left' or 'right'.
//
// XXis-enabled
// (optional)
// boolean
// Whether this side menu is enabled.
//
// XXwidth
// (optional)
// number
// How many pixels wide the side menu should be. Defaults to 275.

module.exports = function(app) {

    // controller
    var controllerDeps = [app.name + '.famousHelper', '$element'];
    var controller = function(famousHelper, $element) {
        var yooSideMenuCtrl = this;
        yooSideMenuCtrl.directivename = directivename;

        yooSideMenuCtrl.getSurface = function() {
            if(!yooSideMenuCtrl.surface) {
                yooSideMenuCtrl.surface = famousHelper.find('fa-surface', $element)[0];
            }
            return yooSideMenuCtrl.surface;
        };

        yooSideMenuCtrl.getWidth = function() {
            return yooSideMenuCtrl.width || 0;
        };

        yooSideMenuCtrl.getEnabled = function() {
            return yooSideMenuCtrl.isEnabled || false;
        };
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = ['$window', '$timeline', app.name + '.famousHelper', app.namespace.yoobicCore + '.directiveBinder', app.namespace.yoobicCore + '.scopeHelper'];
    var directive = function($window, $timeline, famousHelper, directiveBinder, scopeHelper) {
        return {
            restrict: 'E',
            scope: true,
            controller: controller,
            controllerAs: 'yooSideMenuCtrl',
            bindToController: true,
            require: ['yooSideMenu', '^yooSideMenus'],
            priority: 0,
            compile: function(tElement, tAttrs) {
                function cleanSide(side) {
                    if(side !== 'right') {
                        side = 'left';
                    }
                    return side;
                }

                if(_.isUndefined(tAttrs.width)) {
                    tAttrs.$set('width', '275');
                }
                if(_.isUndefined(tAttrs.isEnabled)) {
                    tAttrs.$set('isEnabled', 'true');
                }
                // if(_.isUndefined(tAttrs.side)) {
                // tAttrs.$set('side', cleaxnSide(tAttrs.side));
                // }
                famousHelper.manualTransclude(require('./yooSideMenu.html'), tElement, 'fa-surface', '<fa-surface></fa-surface>');
                var surfaces = tElement.find('fa-surface');
                surfaces.attr('fa-pipe-to', 'yooSideMenusCtrl.eventHandler');
                surfaces.attr('class', 'full-height');
                surfaces.attr('fa-z-index', '-100');
                return {
                    pre: function(scope, element, attrs, ctrls) {
                        // copying parent controller on the local scope, so we have easy access in the template
                        var yooSideMenusCtrl = ctrls[1];
                        var yooSideMenuCtrl = ctrls[0];
                        yooSideMenuCtrl.$scope = scope;
                        scope.yooSideMenusCtrl = yooSideMenusCtrl;
                        scope.translate = yooSideMenuCtrl.translate = $timeline([1, [0, 0]]);

                        // directiveBinder['@'](scope, attrs, yooSideMenuCtrl, 'width');
                        directiveBinder.toPrimitive(scope, attrs, yooSideMenuCtrl, 'width', 275, 'number');
                        directiveBinder.toPrimitive(scope, attrs, yooSideMenuCtrl, 'isEnabled', true, 'boolean');

                        // bind side property to controller so we can attach it to the parent as yooSideMenusCtrl[side]
                        directiveBinder['@'](scope, attrs, yooSideMenuCtrl, 'side');

                        yooSideMenuCtrl.side = cleanSide(yooSideMenuCtrl.side);
                        yooSideMenusCtrl[yooSideMenuCtrl.side] = yooSideMenuCtrl;

                        attrs.$observe('side', function(newSide) {
                            var oldSide = newSide === 'left' ? 'right' : 'left';
                            if(yooSideMenusCtrl[oldSide] && yooSideMenusCtrl[oldSide] === yooSideMenuCtrl) {
                                delete yooSideMenusCtrl[oldSide];
                            }
                            newSide = cleanSide(newSide);
                            yooSideMenuCtrl.side = newSide;
                            yooSideMenusCtrl[newSide] = yooSideMenuCtrl;
                        });

                        scope.$on('$destroy', function() {
                            delete yooSideMenusCtrl[yooSideMenuCtrl.side];
                        });
                    },
                    post: function(scope, element, attrs, ctrls) {
                        // var yooSideMenusCtrl = ctrls[1];
                        var yooSideMenuCtrl = ctrls[0];
                        scope.$watch('yooSideMenuCtrl.isEnabled', function(newVal, oldVal) {
                            if(newVal === oldVal || !newVal) {
                                yooSideMenuCtrl.getSurface(element).hide();
                                yooSideMenuCtrl.translate = angular.noop;
                            } else if(newVal) {
                                yooSideMenuCtrl.getSurface(element).show();
                            }
                        });
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};