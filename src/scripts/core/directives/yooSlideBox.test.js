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
                this.$interval = $injector.get('$interval');
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

            it('should one-way bind to animation-type', function() {
                var vm = this.$scope.vm;
                vm.animationType = 'animation1';
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box animation-type="{{vm.animationType}}">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');

                spyOn(this.controller, 'setAnimation').and.callThrough();

                vm.animationType = 'animation2';
                this.$scope.$digest();
                expect(this.controller.setAnimation).toHaveBeenCalled();
                expect(this.controller.setAnimation.calls.argsFor(0)).toEqual([vm.animationType, 0]);

            });

            xit('should two-way bind to does-continue', function() {
                var vm = this.$scope.vm;
                vm.doesContinue = false;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box does-continue="{{vm.doesContinue}}">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');

                spyOn(this.controller, 'enableContinue').and.callThrough();

                vm.doesContinue = true;
                this.$scope.$digest();
                expect(this.controller.enableContinue).toHaveBeenCalled();
                expect(this.controller.enableContinue.calls.argsFor(0)).toEqual([vm.doesContinue, 0]);

            });

            it('auto-play should default to true if does-continue is true', function() {
                var vm = this.$scope.vm;
                vm.doesContinue = true;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box does-continue="vm.doesContinue">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                expect(this.controller.doesContinue).toBe(true);
                expect(this.controller.autoPlayPromise).toBeDefined();
                expect(this.controller.autoPlay).toBe(true);
            });

            iit('auto-play should default to false if does-continue is false', function() {
                var vm = this.$scope.vm;
                vm.doesContinue = false;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box does-continue="vm.doesContinue">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                expect(this.controller.doesContinue).toBe(false);
                expect(this.controller.autoPlayPromise).toBeUndefined();
                expect(this.controller.autoPlay).toBe(false);
            });

            it('should bind to auto-play', function() {
                var vm = this.$scope.vm;
                vm.autoPlay = false;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box auto-play="vm.autoPlay">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                expect(this.controller.autoPlayPromise).toBeUndefined();

                vm.autoPlay = true;
                this.$scope.$digest();
                expect(this.controller.autoPlayPromise).toBeDefined();

                vm.autoPlay = false;
                this.$scope.$digest();
                expect(this.controller.autoPlayPromise).toBeUndefined();
            });

            it('slide-interval should default to 4000', function() {
                var vm = this.$scope.vm;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box>' +
                    '</yoo-slide-box>');

                expect(this.controller.slideInterval).toBe(4000);
            });

            it('should one-way bind to slide-interval', function() {
                var vm = this.$scope.vm;
                vm.slideInterval = 300;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box slide-interval="vm.slideInterval">' +
                    '</yoo-slide-box>');

                expect(this.controller.slideInterval).toBe(300);

                vm.slideInterval = 200;
                this.$scope.$digest();
                expect(this.controller.slideInterval).toBe(200);
            });

            it('auto-play should work', function() {
                var vm = this.$scope.vm;
                vm.autoPlay = true;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box auto-play="vm.autoPlay">' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '</yoo-slide-box>');
                spyOn(this.controller, 'goToNextPage');

                this.$interval.flush(this.controller.slideInterval * 3);
                expect(this.controller.goToNextPage.calls.count()).toBe(3);
            });

            it('slide-interval binding should affect auto-play speed', function() {
                var vm = this.$scope.vm;
                vm.autoPlay = true;
                vm.slideInterval = 300;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box auto-play="vm.autoPlay" slide-interval="vm.slideInterval">' +
                    '</yoo-slide-box>');
                spyOn(this.controller, 'goToNextPage');

                this.$interval.flush(vm.slideInterval * 2);
                expect(this.controller.goToNextPage.calls.count()).toBe(2);

                vm.slideInterval = 3000;
                this.$scope.$digest();
                expect(this.controller.slideInterval).toBe(3000);
                this.controller.goToNextPage.calls.reset();
                this.$interval.flush(vm.slideInterval * 3);
                expect(this.controller.goToNextPage.calls.count()).toBe(3);
            });

            describe('slideBoxCtrl', function() {

                it('#getScrollview() should succeed', function() {
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

                it('#getTotalPages() should succeed', function() {
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

                it('#getPageDistance() should succeed', function() {
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

                it('#getPageDistance() should return index when no scrollview', function() {
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

                it('#getCurrentIndex() should succeed', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = this.$famous['famous/views/Scrollview'];

                    spyOn(Scrollview.prototype, 'getCurrentIndex').and.returnValue(7);
                    var index = this.controller.getCurrentIndex();
                    expect(Scrollview.prototype.getCurrentIndex).toHaveBeenCalled();
                    expect(index).toBe(7);
                });

                it('#goToPage() should call the famo.us Scrollview method', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        // '<yoo-slide>' + '</yoo-slide>' +
                        // '<yoo-slide>' + '</yoo-slide>' +
                        // '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = this.$famous['famous/views/Scrollview'];

                    spyOn(Scrollview.prototype, 'goToPage');

                    this.controller.goToPage(2);
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(2);
                });

                xit('#goToPage() should wrap if index exceeds the bounds', function() {
                    var self = this;
                    unitHelper.compileDirectiveFamous.call(self, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = self.$famous['famous/views/Scrollview'];

                    var currentIndex = 0;

                    spyOn(Scrollview.prototype, 'getCurrentIndex').and.callFake(function() {
                        return currentIndex;
                    });

                    spyOn(Scrollview.prototype, 'goToPage').and.callFake(function(index) {
                        currentIndex = index;
                    });

                    self.controller.goToPage(5);
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(2);

                    expect(self.controller.getCurrentIndex()).toBe(2);

                    self.controller.goToPage(-2);
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(1);

                    expect(self.controller.getCurrentIndex()).toBe(1);

                });

                it('#currentIndex() should succeed', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = this.$famous['famous/views/Scrollview'];

                    spyOn(Scrollview.prototype, 'getCurrentIndex').and.returnValue(7);
                    var index = this.controller.currentIndex();
                    expect(Scrollview.prototype.getCurrentIndex).toHaveBeenCalled();
                    expect(index).toBe(7);

                });

                it('#slide() should call the famo.us Scrollview and succeed', function() {
                    var self = this;
                    unitHelper.compileDirectiveFamous.call(self, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = self.$famous['famous/views/Scrollview'];

                    var currentIndex = 0;

                    spyOn(Scrollview.prototype, 'getCurrentIndex').and.callFake(function() {
                        return currentIndex;
                    });

                    spyOn(Scrollview.prototype, 'goToPage').and.callFake(function(index) {
                        currentIndex = index;
                    });

                    self.controller.slide(2);
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(2);

                    expect(self.controller.getCurrentIndex()).toBe(2);

                });

                xit('#slide() should wrap if index exceeds the bounds', function() {
                    var self = this;
                    unitHelper.compileDirectiveFamous.call(self, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = self.$famous['famous/views/Scrollview'];

                    var currentIndex = 0;

                    spyOn(Scrollview.prototype, 'getCurrentIndex').and.callFake(function() {
                        return currentIndex;
                    });

                    spyOn(Scrollview.prototype, 'goToPage').and.callFake(function(index) {
                        currentIndex = index;
                    });

                    self.controller.slide(5);
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(2);

                    expect(self.controller.getCurrentIndex()).toBe(2);

                    self.controller.slide(-2);
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(1);

                    expect(self.controller.getCurrentIndex()).toBe(1);

                });

                xit('#next() should succeed and wrap', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = this.$famous['famous/views/Scrollview'];

                    var currentIndex = 0;

                    spyOn(Scrollview.prototype, 'goToPage').and.callFake(function(index) {
                        currentIndex = index;
                    });
                    spyOn(Scrollview.prototype, 'getCurrentIndex').and.callFake(function() {
                        return currentIndex;
                    });

                    expect(this.controller.getCurrentIndex()).toBe(0);

                    this.controller.next();
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(1);
                    expect(this.controller.getCurrentIndex()).toBe(1);

                    this.controller.next();
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(2);
                    expect(this.controller.getCurrentIndex()).toBe(2);

                    this.controller.next();
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(0);
                    expect(this.controller.getCurrentIndex()).toBe(0);
                });

                xit('#previous() should succeed and wrap', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = this.$famous['famous/views/Scrollview'];

                    var currentIndex = 0;

                    spyOn(Scrollview.prototype, 'goToPage').and.callFake(function(index) {
                        currentIndex = index;
                    });
                    spyOn(Scrollview.prototype, 'getCurrentIndex').and.callFake(function() {
                        return currentIndex;
                    });

                    expect(this.controller.getCurrentIndex()).toBe(0);

                    this.controller.previous();
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(2);
                    expect(this.controller.getCurrentIndex()).toBe(2);

                    this.controller.previous();
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(1);
                    expect(this.controller.getCurrentIndex()).toBe(1);

                    this.controller.previous();
                    expect(Scrollview.prototype.goToPage).toHaveBeenCalledWith(0);
                    expect(this.controller.getCurrentIndex()).toBe(0);
                });

            });

            describe('slideBoxDelegate', function() {
                beforeEach(inject(function($injector) {
                    this.slideBoxDelegate = $injector.get(app.name + '.slideBoxDelegate');
                }));

                it('#goToPage() should call directives goToPage method from another controller', function() {
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

                it('#slide() should call directives slide method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'slide');
                    var index = 2;
                    this.slideBoxDelegate.slide(index);
                    expect(this.controller.slide).toHaveBeenCalledWith(index);
                });

                it('#getCurrentIndex() should call directives getCurrentIndex method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'getCurrentIndex');
                    this.slideBoxDelegate.getCurrentIndex();
                    expect(this.controller.getCurrentIndex).toHaveBeenCalled();
                });

                it('#currentIndex() should call directives currentIndex method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'currentIndex');
                    this.slideBoxDelegate.currentIndex();
                    expect(this.controller.currentIndex).toHaveBeenCalled();
                });

                it('#getTotalPages() should call directives getTotalPages method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'getTotalPages');
                    this.slideBoxDelegate.getTotalPages();
                    expect(this.controller.getTotalPages).toHaveBeenCalled();
                });

                it('#slidesCount() should call directives slidesCount method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'slidesCount');
                    this.slideBoxDelegate.slidesCount();
                    expect(this.controller.slidesCount).toHaveBeenCalled();
                });

                it('#previous() should call directives previous method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'previous');
                    this.slideBoxDelegate.previous();
                    expect(this.controller.previous).toHaveBeenCalled();
                });

                it('#next() should call directives next method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'next');
                    this.slideBoxDelegate.next();
                    expect(this.controller.next).toHaveBeenCalled();
                });

                it('should deregister on $destroy', function() {
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

                it('should call slideBox by its handle', function() {
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
