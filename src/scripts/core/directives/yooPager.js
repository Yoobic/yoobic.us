'use strict';
/*eslint consistent-this:[2,  "yooPagerCtrl"] */
var directivename = 'yooPager';
var _ = require('lodash');
module.exports = function(app) {

    // controller
    var controllerDeps = ['$scope'];
    var controller = function($scope) {
        var yooPagerCtrl = this;
        yooPagerCtrl.directivename = directivename;
        yooPagerCtrl.slidesRange = [];
        yooPagerCtrl.pagerClick = function(index) {
            $scope.yooSlideBoxCtrl.goToPage(index);
            $scope.yooSlideBoxCtrl.pagerClick(index);
        };
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = ['$timeline'];
    var directive = function($timeline) {
        return {
            require: ['yooPager', '^yooSlideBox'],
            restrict: 'AE',
            scope: {},
            controller: controller,
            controllerAs: 'yooPagerCtrl',
            bindToController: true,
            template: require('./yooPager.html'),
            compile: function(tElement, tAttrs) {
                return {
                    pre: function(scope, element, attrs, ctrls) {
                        // copying parent controller on the local scope, so we have easy access in the template
                        var yooPagerCtrl = ctrls[0];
                        var yooSlideBoxCtrl = ctrls[1];
                        scope.yooSlideBoxCtrl = yooSlideBoxCtrl;

                        scope.$watch(function() {
                            return yooSlideBoxCtrl.getTotalPages();
                        }, function(newvalue) {
                            yooPagerCtrl.slidesRange = _.range(newvalue);
                        });

                        yooPagerCtrl.markerOpacity = $timeline([
                            [-1, 0.3],
                            [0, 1],
                            [1, 0.3]
                        ]);

                        yooPagerCtrl.markerScale = $timeline([
                            [-1, [0.6, 0.6]],
                            [0, [1, 1]],
                            [1, [0.6, 0.6]]
                        ]);
                    },
                    post: function(scope, element, attrs) {

                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
