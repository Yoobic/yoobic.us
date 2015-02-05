'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var directivename = 'yooSlide';
var unitHelper = require('unitHelper');

describe(app.name, function() {

    describe('Directives', function() {

        describe(directivename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.$templateCache = $injector.get('$templateCache');
                this.$compile = $injector.get('$compile');
                this.$scope = $injector.get('$rootScope').$new();
            }));

            it('should require yooSlideBox', function() {
                var self = this;
                expect(function() {
                    var element = unitHelper.compileDirective.call(self, directivename, '<yoo-slide></yoo-slide>');
                    element.html();
                }).toThrowError();
            });

        });
    });
});
