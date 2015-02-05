'use strict';
var servicename = 'famousHelper';
var _ = require('lodash');
var angular = require('angular');
module.exports = function(app) {

    var dependencies = ['$famous'];

    function service($famous) {
        /**
         * Find famous elements
         * @param  {String} selector  - The selector (tag, id, class)
         * @param  {Object} element - Pass a element to search only inside it, otherwise ignore that attribute
         * @returns {Object} - The returned list of elements matching the selector
         */
        var find = function(selector, element) {
            if(element) {
                var searchElements = element.find(selector);
                return angular.element(_(searchElements).map(function(el) {
                    var scope = angular.element(el).scope();
                    return scope.isolate[scope.$id];
                }).value());

            } else {
                return $famous.find(selector);
            }
        };

        return {
            find: find
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
