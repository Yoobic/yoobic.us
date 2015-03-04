'use strict';
/*eslint consistent-this:[2,  "yooSideMenusCtrl"] */
var directivename = 'yooSideMenus';

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
                        var TouchSync = $famous['famous/inputs/TouchSync'];
                        var EventHandler = $famous['famous/core/EventHandler'];

                        var SnapTransition = $famous['famous/transitions/SnapTransition'];
                        var SpringTransition = $famous['famous/transitions/SpringTransition'];
                        var WallTransition = $famous['famous/transitions/WallTransition'];
                        Transitionable.registerMethod('spring', SpringTransition);
                        Transitionable.registerMethod('wall', WallTransition);
                        Transitionable.registerMethod('snap', SnapTransition);

                        var yooSideMenusCtrl = ctrls[0];
                        yooSideMenusCtrl.transitionable = new Transitionable(1);
                        var sync = new TouchSync();
                        yooSideMenusCtrl.eventHandler = new EventHandler();
                        yooSideMenusCtrl.eventHandler.pipe(sync);

                        yooSideMenusCtrl.translateContent = $timeline([
                            [0, [yooSideMenusCtrl.leftWidth - 0 || 0, 0]],
                            [1, [0, 0]],
                            [2, [-yooSideMenusCtrl.rightWidth - 0 || 0, 0]]
                        ]);

                        var start;
                        sync.on('start', function(data) {
                            start = yooSideMenusCtrl.transitionable.get();
                        });

                        sync.on('update', function(data) {
                            var delta = yooSideMenusCtrl.transitionable.get() - data.delta[0] / 300;
                            if(delta < start + 1 && delta > start - 1) {
                                yooSideMenusCtrl.transitionable.set(yooSideMenusCtrl.transitionable.get() - data.delta[0] / 300);
                            }
                        });

                        sync.on('end', function(data) {
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
