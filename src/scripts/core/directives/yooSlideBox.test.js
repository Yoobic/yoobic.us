'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var directivename = 'yooSlideBox';
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
                this.$scope.vm = {};
            }));

            afterEach(function() {
                unitHelper.cleanDocument();
            });

            it('should succeed', function() {
                var element = unitHelper.compileDirectiveFamous.call(this, directivename, '<yoo-slide-box></yoo-slide-box>');
                expect(element.html().trim()).toBeDefined();
            });

            it('should auto implement the slideBox event pipeline', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box>' +
                    '<yoo-slide>' +
                    '<div class="test"></div>' +
                    '</yoo-slide>' +
                    '</yoo-slide-box>'
                );
                this.$scope.$apply();

                var scrollview = this.$famous.find('fa-scroll-view')[0].renderNode;
                var surface = this.$famous.find('fa-surface')[0].renderNode;

                var testEventHandled = false;

                scrollview._eventInput.on('testevent', function() {
                    testEventHandled = true;
                });

                surface._eventOutput.emit('testevent', unitHelper.mockEvent({
                    count: 1
                }));

                expect(testEventHandled).toBe(true);
            });

            it('should support MouseSync', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box>' +
                    '<yoo-slide>' +
                    '<div class="test"></div>' +
                    '</yoo-slide>' +
                    '</yoo-slide-box>'
                );

                var scrollview = this.$famous.find('fa-scroll-view')[0].renderNode;
                var surface = this.$famous.find('fa-surface')[0].renderNode;

                expect(scrollview._touchCount).toBe(0);
                surface._eventOutput.emit('mousedown', unitHelper.mockEvent({
                    count: 1
                }));

                expect(scrollview._touchCount).toBe(1);
            });

            it('should show yoo-pager if show-pager is true', function() {
                var element = unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box show-pager="true">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                expect(element.find('yoo-pager').length).toBe(1);
            });

            it('should hide pager if show-pager is false', function() {
                var element = unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box show-pager="false">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                expect(element.find('yoo-pager').length).toBe(0);
            });

            it('should one-way bind to show-pager', function() {
                var vm = this.$scope.vm;
                vm.showPager = true;
                var element = unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box show-pager="vm.showPager">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                expect(element.find('yoo-pager').length).toBe(1);

                vm.showPager = false;
                this.$scope.$digest();
                //console.log(element.html());
                expect(element.find('yoo-pager').length).toBe(0);

            });

            it('slideBoxCtrl.getScrollview() should succeed', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box>' +
                    '<yoo-slide>' +
                    '<div class="test"></div>' +
                    '</yoo-slide>' +
                    '</yoo-slide-box>'
                );
                var Scrollview = this.$famous['famous/views/Scrollview'];
                var scrollview = this.controller.getScrollview();
                expect(scrollview.renderNode instanceof Scrollview).toBeTruthy();
            });

            it('slideBoxCtrl.getTotalPages() should succeed', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box>' +
                    '<yoo-slide>' +
                    '<div class="test"></div>' +
                    '</yoo-slide>' +
                    '</yoo-slide-box>'
                );
                var Scrollview = this.$famous['famous/views/Scrollview'];

                var spy = jasmine.createSpy('fn').and.returnValue(10);
                Scrollview.prototype.getTotalPages = spy;
                this.controller.getTotalPages();
                expect(spy).toHaveBeenCalled();
            });

            it('slideBoxCtrl.getPageDistance() should succeed', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box>' +
                    '<yoo-slide>' +
                    '<div class="test"></div>' +
                    '</yoo-slide>' +
                    '</yoo-slide-box>'
                );
                var Scrollview = this.$famous['famous/views/Scrollview'];

                var spy = jasmine.createSpy('fn').and.returnValue(10);
                Scrollview.prototype.getPageDistance = spy;
                this.controller.getPageDistance(1);
                expect(spy).toHaveBeenCalled();
            });

        });
    });
});
