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
    var directiveDeps = ['$famous'];
    var directive = function($famous) {

        /**
         * Transclude the contents provided by the consumer into the template and
         * append it to the tElement.
         * @param {string|Element} template - the template for the slide with one fa-surface and ng-transclude
         * @param {Element} tElement - the tElement passed to the compile function containing the consumer's slide contents
         * @param {bool} wrapWithSurface - a boolean indicating whether the consumer's contents need the fa-surface wrapper from the template
         */
        var transcludeConsumerProvidedContents = function(template, tElement, wrapWithSurface) {
            template = angular.element(template); // make sure template is an angular element

            if(wrapWithSurface) {
                tElement.append(template
                    .find('ng-transclude') // find the the template's ng-transclude
                    .parent() // select the parent of the template's ng-transclude (the fa-surface)
                    .empty() // delete the selected element's contents
                    .append(tElement.contents())); // append the consumer contents from tElement
            } else {
                tElement.append(template
                    .find('ng-transclude') // find the the template's ng-transclude
                    .parent() // select the parent of the template's ng-transclude (the fa-surface)
                    .parent() // select the parent of the template's fa-surface
                    .empty() // delete the selected element's contents
                    .append(tElement.contents())); // append the consumer contents from tElement
            }
        };

        return {
            require: ['yooSlide', '^yooSlideBox'],
            restrict: 'AE',
            scope: true,
            controller: controller,
            controllerAs: 'yooSlideCtrl',
            bindToController: true,
            compile: function(tElement, tAttrs) {
                var template = require('./yooSlide.html');
                var wrapWithSurface = tElement.find('fa-surface').length ? false : true;
                transcludeConsumerProvidedContents(template, tElement, wrapWithSurface);
                return {
                    pre: function(scope, element, attrs, ctrls) {
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
