'use strict';
/*eslint consistent-this:[1,  "faSlideCtrl"] */
var directivename = 'faSlide';

module.exports = function(app) {

    // controller
    var controllerDeps = [];
    var controller = function() {

        var faSlideCtrl = this;
        faSlideCtrl.directivename = directivename;
    };
    controller.$inject = controllerDeps;

    /*eslint-disable consistent-this */

    // directive
    var directiveDeps = [];
    var directive = function() {

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
            require: ['faSlide', '^faSlideBox'],
            restrict: 'AE',
            scope: true,
            controller: controller,
            controllerAs: 'faSlideCtrl',
            bindToController: true,
            compile: function(tElement, tAttrs) {
                var template = require('./faSlide.html');
                var wrapWithSurface = tElement.find('fa-surface').length ? false : true;
                transcludeConsumerProvidedContents(template, tElement, wrapWithSurface);
                return {

                    pre: function(scope, element, attrs, ctrls) {},
                    post: function(scope, element, attrs, ctrls) {
                        var faSlideCtrl = ctrls[0];
                        var faSlideBoxCtrl = ctrls[1];
                        faSlideCtrl.eventHandler = faSlideBoxCtrl.eventHandler;
                        faSlideCtrl.getScrollView = faSlideBoxCtrl.getScrollView;
                    }
                };
            }
        };
    };
    directive.$inject = directiveDeps;

    app.directive(directivename, directive);
};
