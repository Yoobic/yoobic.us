'use strict';
var servicename = 'famousHelper';
var _ = require('lodash');
var angular = require('angular');
module.exports = function(app) {

    var dependencies = ['$famous'];

    function service($famous) {

        var getFamousElement = function(element) {
            var scope = angular.element(element).scope();
            return scope.isolate[scope.$id];
        };

        /**
         * Find famous elements
         * @param  {String} selector  - The selector (tag, id, class)
         * @param  {Object} element - Pass a element to search only inside it, otherwise ignore that attribute
         * @returns {Object} - The returned list of elements matching the selector
         */
        var find = function(selector, element) {
            if(element) {
                var searchElements = element.find(selector);
                return angular.element(_(searchElements)
                    .map(getFamousElement).value());

            } else {
                return $famous.find(selector);
            }
        };

        /**
         * Wraps an element with a wrapper
         * @param  {angular.element} element - The element to wrap
         * @param  {String|angular.element} wrapper - The wrapper
         * @example
         * famousHelper.wrap(element, '<fa-surface></fa-surface>');
         */
        var wrapElement = function(element, wrapper) {
            element[0].innerHTML = (angular.element(wrapper).append(element[0].innerHTML))[0].outerHTML;
        };

        /**
         * Performs a manual transclusion
         * @param  {String|angular.element} template - The template containing the transclusion
         * @param  {angular.element} element  - The content to transclude
         * @param  {String} selector - A selector to optionaly decide if the content needs wrapping
         * @param  {String|angular.element} wrapper  - The wrapper
         */
        var manualTransclude = function(template, element, selector, wrapper) {
            template = angular.element(template);
            var templateTransclude = template.find('ng-transclude');
            if(templateTransclude.length <= 0) {
                throw new Error('Could not find a ng-transclude element in the template');
            }
            if(element.find(selector).length === 0) {
                wrapElement(element, wrapper);
            }
            templateTransclude.replaceWith(element[0].innerHTML);
            element[0].innerHTML = template[0].outerHTML;
        };

        return {
            find: find,
            getFamousElement: getFamousElement,
            wrapElement: wrapElement,
            manualTransclude: manualTransclude
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
