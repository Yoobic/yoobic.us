'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var directivename = 'faSlideBox';
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

            it('should succeed', function() {
                var element = unitHelper.compileDirectiveFamous.call(this, directivename, '<fa-slide-box></fa-slide-box>');
                expect(element.html().trim()).toBeDefined();
            });

            it('should auto implement the slideBox event pipeline', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<fa-slide-box>' +
                    '<fa-slide>' +
                    '<div class="test"></div>' +
                    '</fa-slide>' +
                    '</fa-slide-box>'
                );
                this.$scope.$apply();

                var scrollView = this.$famous.find('fa-scroll-view')[0].renderNode;
                var surface = this.$famous.find('fa-surface')[0].renderNode;

                var testEventHandled = false;

                scrollView._eventInput.on('testevent', function() {
                    testEventHandled = true;
                });

                surface._eventOutput.emit('testevent', unitHelper.mockEvent({
                    count: 1
                }));

                expect(testEventHandled).toBe(true);

                // expect(scrollView._touchCount).toBe(0);
                // surface._eventOutput.emit('mousewheel', unitHelper.mockEvent({
                //     count: 1
                // }));

                // expect(scrollView._touchCount).toBe(1);
            });

            it('should support MouseSync', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<fa-slide-box>' +
                    '<fa-slide>' +
                    // '<fa-surface  class="test" fa-size="[300, 100]"></fa-surface>' +
                    '<div class="test"></div>' +
                    '</fa-slide>' +
                    '</fa-slide-box>'
                );

                var scrollView = this.$famous.find('fa-scroll-view')[0].renderNode;
                var surface = this.$famous.find('fa-surface')[0].renderNode;

                expect(scrollView._touchCount).toBe(0);
                surface._eventOutput.emit('mousedown', unitHelper.mockEvent({
                    count: 1
                }));

                expect(scrollView._touchCount).toBe(1);
            });

        });
    });
});
