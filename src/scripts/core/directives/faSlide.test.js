'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var directivename = 'faSlide';
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

            it('should require faSlideBox', function() {
                var self = this;
                expect(function() {
                    var element = unitHelper.compileDirective.call(self, directivename, '<fa-slide></fa-slide>');
                    element.html();
                }).toThrowError();

                expect(function() {
                    var element = unitHelper.compileDirective.call(self, 'faSlideBox', '<fa-slide-box><fa-slide></fa-slide></fa-slide-box>');
                    var slideEl = element.find('fa-slide');
                    // var slide = unitHelper.compileDirective.call(self, directivename, '<fa-slide></fa-slide>');
                    return slideEl.html().trim();
                }).toBeDefined();
            });

        });
    });
});
