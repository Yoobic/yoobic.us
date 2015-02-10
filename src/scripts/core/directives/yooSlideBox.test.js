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
                var surfaceElement = this.$famous.find('fa-surface')[0];

                expect(scrollview._touchCount).toBe(0);
                unitHelper.triggerEventFamousElement(surfaceElement, 'mousedown');

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

                spyOn(Scrollview.prototype, 'getTotalPages').and.returnValue(10);
                this.controller.getTotalPages();
                expect(Scrollview.prototype.getTotalPages).toHaveBeenCalled();
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

                spyOn(Scrollview.prototype, 'getPageDistance').and.returnValue(10);
                var distance = this.controller.getPageDistance(1);
                expect(Scrollview.prototype.getPageDistance).toHaveBeenCalled();
                expect(distance).toBe(10);
            });

            it('slideBoxCtrl.getPageDistance() should return index when no scrollview', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box>' +
                    '</yoo-slide-box>'
                );
                var Scrollview = this.$famous['famous/views/Scrollview'];

                spyOn(Scrollview.prototype, 'getPageDistance').and.returnValue(10);
                spyOn(this.controller, 'getScrollview').and.returnValue(null);

                var distance = this.controller.getPageDistance(10);
                expect(distance).toBe(10);
            });

            it('slideBoxCtrl.goToPage() should call the famo.us Scrollview', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box>' +
                    '<yoo-slide>' + '</yoo-slide>' +
                    '<yoo-slide>' + '</yoo-slide>' +
                    '<yoo-slide>' + '</yoo-slide>' +
                    '</yoo-slide-box>'
                );
                var Scrollview = this.$famous['famous/views/Scrollview'];

                spyOn(Scrollview.prototype, 'goToPage');

                this.controller.goToPage(2);

                expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(2);
            });

            describe('slideBox delegate service', function() {
                beforeEach(inject(function($injector) {
                    this.slideBoxDelegate = $injector.get(app.name + '.slideBoxDelegate');
                }));

                it('slideBoxDelegate.goToPage() should call directives goToPage method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'goToPage');
                    var index = 2;
                    this.slideBoxDelegate.goToPage(index);
                    expect(this.controller.goToPage).toHaveBeenCalledWith(index);
                });

                it('slideBoxDelegate should deregister on $destory', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    expect(this.slideBoxDelegate._instances.length).toBe(1);
                    this.$scope.$destroy();
                    expect(this.slideBoxDelegate._instances.length).toBe(0);
                });

                it('slideBoxDelegate should call methods by their handle', function() {
                    var element = unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box delegate-handle="handle-a" id="directive-a">' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>' +
                        '<yoo-slide-box id="directive-b">' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    var directiveA = angular.element(element[0].querySelector('#directive-a'));
                    var directiveACtrl = directiveA.controller('yooSlideBox');
                    var directiveB = angular.element(element[0].querySelector('#directive-b'));
                    var directiveBCtrl = directiveB.controller('yooSlideBox');

                    spyOn(directiveACtrl, 'goToPage');
                    spyOn(directiveBCtrl, 'goToPage');

                    var index = 2;
                    this.slideBoxDelegate.goToPage(index);

                    expect(directiveACtrl.goToPage).toHaveBeenCalled();
                    expect(directiveBCtrl.goToPage).toHaveBeenCalled();

                    directiveACtrl.goToPage.calls.reset();
                    directiveBCtrl.goToPage.calls.reset();
                    this.slideBoxDelegate.$getByHandle('handle-a').goToPage(index);

                    expect(directiveACtrl.goToPage).toHaveBeenCalled();
                    expect(directiveBCtrl.goToPage).not.toHaveBeenCalled();
                });
            });
        });
    });
});
