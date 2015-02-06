'use strict';
/*eslint consistent-this:[1,  "yooSlideCtrl"] */
var directivename = 'yooSlide';
var angular = require('angular');
module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {

        var yooSlideCtrl = this;
        yooSlideCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [app.name + '.famousHelper'];
    var directive = function(famousHelper) {
        return {
            require: ['yooSlide', '^yooSlideBox'],
            restrict: 'AE',
            scope: true,
            controller: controller,
            controllerAs: 'yooSlideCtrl',
            bindToController: true,
            //template: require('./yooSlide.html'),
            //transclude: true,
            compile: function(tElement, tAttrs) {
                //console.log(tElement);
                var surfaces = tElement.find('fa-surface');

                if(surfaces.length <= 0) {
                    tElement[0].innerHTML = '<fa-surface>' + angular.element(tElement[0]).html() + '</fa-surface>';
                    surfaces = tElement.find('fa-surface');
                }
                surfaces.attr('fa-pipe-to', 'yooSlideBoxCtrl.eventHandler');
                try {
                    surfaces.attr('class', 'full-height');
                } catch(err) {
                    debugger;
                }
                tElement[0].innerHTML = require('./yooSlide.html').replace('<ng-transclude></ng-transclude>', tElement[0].innerHTML);

                return {
                    pre: function(scope, element, attrs, ctrls) {
                        // copying parent controller on the local scope, so we have easy access in the template
                        var yooSlideBoxCtrl = ctrls[1];
                        scope.yooSlideBoxCtrl = yooSlideBoxCtrl;
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
