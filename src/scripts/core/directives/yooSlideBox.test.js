'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var directivename = 'yooSlideBox';
var unitHelper = require('unitHelper');
var _ = require('lodash');

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
                this.famousHelper = $injector.get(app.name + '.famousHelper');
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

            it('should work with ng-repeated views', function() {
                var vm = this.$scope.vm;
                vm.views = _.range(10);
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box show-pager="true">' +
                    '<yoo-slide ng-repeat="view in vm.views">' +
                    '<fa-surface fa-size="[300, 100]"></fa-surface>' +
                    '</yoo-slide>' +
                    '</yoo-slide-box>');

                var scrollView = this.$famous.find('fa-scroll-view')[0].renderNode;
                this.$scope.$digest();
                expect(scrollView.getTotalPages()).toEqual(vm.views.length);
            });

            it('should replace html with surfaces', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box>' +
                    '<yoo-slide ng-repeat="view in views">' +
                    '<div>surface{{view}}</div>' +
                    '</yoo-slide>' +
                    '</yoo-slide-box>', 300, this.$scope
                );

                this.$scope.views = [0, 1];

                var scrollView = this.$famous.find('fa-scroll-view')[0].renderNode;

                // The watcher resolves view sequencing
                expect(scrollView._node).toBeNull();
                this.$scope.$apply();
                expect(scrollView._node.index).toBe(0);
                var results = this.$famous.find('fa-surface');
                expect(results.length).toEqual(this.$scope.views.length);
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
