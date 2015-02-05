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
                this.$famous = $injector.get('$famous');
            }));

            afterEach(function() {
                unitHelper.cleanDocument();
            });

            it('should require yooSlideBox', function() {
                var self = this;
                expect(function() {
                    var element = unitHelper.compileDirective.call(self, directivename, '<yoo-slide></yoo-slide>');
                    element.html();
                }).toThrowError();

                expect(function() {
                    var element = unitHelper.compileDirective.call(self, 'yooSlideBox', '<yoo-slide-box><yoo-slide></yoo-slide></yoo-slide-box>');
                    var slideEl = element.find('yoo-slide');
                    return slideEl.html().trim();
                }).toBeDefined();
            });

            it('should wrap visible HTML content with a fa-surface', function() {
                var element = unitHelper.compileDirectiveFamous.call(this, 'yooSlideBox', '<yoo-slide-box><yoo-slide><div>Hello World!</div></yoo-slide></yoo-slide-box>');
                var surfaces = this.$famous.find('fa-surface', element);
                expect(surfaces[0].renderNode.content.innerText).toMatch('Hello World!');
            });

            it('should handle an fa-surface from the consumer', function() {
                var element = unitHelper.compileDirectiveFamous.call(this, 'yooSlideBox', '<yoo-slide-box><yoo-slide><fa-surface><div>Hello World!</div></fa-surface></yoo-slide></yoo-slide-box>');
                var surfaces = this.$famous.find('fa-surface', element);
                expect(surfaces.length).toBe(1);
                expect(surfaces[0].renderNode.content.innerText).toMatch('Hello World!');
            });

        });
    });
});