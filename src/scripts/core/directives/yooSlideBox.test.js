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
                this.$timeout = $injector.get('$timeout');
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
                // this.$scope.$apply();

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
                    '</yoo-slide-box>', 300
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

            it('should bind to does-continue', function() {
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
                expect(this.controller.doesContinue).toBe(false);

                vm.doesContinue = true;
                this.$scope.$digest();
                expect(this.controller.doesContinue).toBe(true);

                vm.doesContinue = false;
                this.$scope.$digest();
                expect(this.controller.doesContinue).toBe(false);
            });

            it('should set loop if does-continue is true', function() {
                var vm = this.$scope.vm;
                vm.doesContinue = false;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box does-continue="{{vm.doesContinue}}">' +
                    '   <yoo-slide>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                spyOn(this.controller, 'setLoop');

                vm.doesContinue = true;
                this.$scope.$digest();
                expect(this.controller.setLoop).toHaveBeenCalledWith(vm.doesContinue);
            });

            it('should bind to auto-play', function() {
                var vm = this.$scope.vm;
                vm.autoPlay = true;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box auto-play="{{vm.autoPlay}}">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                expect(this.controller.autoPlay).toBe(true);

                vm.autoPlay = false;
                this.$scope.$digest();
                expect(this.controller.autoPlay).toBe(false);
            });

            it('should bind to slide-interval', function() {
                var vm = this.$scope.vm;
                vm.slideInterval = 300;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box slide-interval="{{vm.slideInterval}}">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');

                expect(this.controller.slideInterval).toBe(300);

                vm.slideInterval = 200;
                this.$scope.$digest();
                expect(this.controller.slideInterval).toBe(200);
            });

            it('should bind to slide-direction', function() {
                var vm = this.$scope.vm;
                vm.slideDirection = 'invalid slideDirection!!';
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box slide-direction="{{vm.slideDirection}}">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');
                expect(this.controller.slideDirection).toBe('goToNextPage');

                vm.slideDirection = 'goToPreviousPage';
                this.$scope.$digest();
                expect(this.controller.slideDirection).toBe('goToPreviousPage');

                vm.slideDirection = 'goToNextPage';
                this.$scope.$digest();
                expect(this.controller.slideDirection).toBe('goToNextPage');
            });

            describe('auto-play', function() {
                it('should work', function() {
                    var vm = this.$scope.vm;
                    vm.autoPlay = true;
                    unitHelper.compileDirective.call(this, directivename,
                        '<yoo-slide-box auto-play="{{vm.autoPlay}}">' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '</yoo-slide-box>');
                    spyOn(this.controller, this.controller.slideDirection);

                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    expect(this.controller[this.controller.slideDirection].calls.count()).toBe(3);
                });

                it('should use default slideInterval and slideDirection', function() {
                    var vm = this.$scope.vm;
                    vm.autoPlay = true;
                    unitHelper.compileDirective.call(this, directivename,
                        '<yoo-slide-box auto-play="{{vm.autoPlay}}">' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '</yoo-slide-box>');
                    spyOn(this.controller, 'goToNextPage');
                    spyOn(this.controller, 'goToPreviousPage');

                    expect(this.controller.slideInterval).toBe(4000);
                    expect(this.controller.slideDirection).toBe('goToNextPage');
                    expect(this.controller.goToNextPage.calls.count()).toBe(0);
                    this.$timeout.flush(4000);
                    this.$timeout.flush(4000);
                    this.$timeout.flush(4000);
                    expect(this.controller.goToNextPage.calls.count()).toBe(3);
                    expect(this.controller.goToPreviousPage.calls.count()).toBe(0);
                });

                it('should default to true if does-continue is true', function() {
                    var vm = this.$scope.vm;
                    vm.doesContinue = true;
                    unitHelper.compileDirective.call(this, directivename,
                        '<yoo-slide-box does-continue="{{vm.doesContinue}}">' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '</yoo-slide-box>');
                    spyOn(this.controller, this.controller.slideDirection);

                    expect(this.controller.autoPlay).toBe(true);
                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    expect(this.controller[this.controller.slideDirection].calls.count()).toBe(3);
                });

                it('should default to false if does-continue is false', function() {
                    var vm = this.$scope.vm;
                    vm.doesContinue = false;
                    unitHelper.compileDirective.call(this, directivename,
                        '<yoo-slide-box does-continue="{{vm.doesContinue}}">' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '</yoo-slide-box>');
                    spyOn(this.controller, this.controller.slideDirection);

                    expect(this.controller.autoPlay).toBe(false);
                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    expect(this.controller[this.controller.slideDirection].calls.count()).toBe(0);
                });

                it('should obey slide-interval binding', function() {
                    var vm = this.$scope.vm;
                    vm.autoPlay = true;
                    vm.slideInterval = 300;
                    unitHelper.compileDirective.call(this, directivename,
                        '<yoo-slide-box auto-play="{{vm.autoPlay}}" slide-interval="{{vm.slideInterval}}">' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '</yoo-slide-box>');
                    spyOn(this.controller, this.controller.slideDirection);

                    this.$timeout.flush(vm.slideInterval);
                    this.$timeout.flush(vm.slideInterval);
                    expect(this.controller.goToNextPage.calls.count()).toBe(2);

                    vm.slideInterval = 3000;
                    this.$scope.$digest();
                    expect(this.controller.slideInterval).toBe(3000);
                    this.controller.goToNextPage.calls.reset();
                    this.$timeout.flush(vm.slideInterval);
                    this.$timeout.flush(vm.slideInterval);
                    this.$timeout.flush(vm.slideInterval);
                    expect(this.controller.goToNextPage.calls.count()).toBe(3);
                });

                it('should obey slide-direction binding', function() {
                    var vm = this.$scope.vm;
                    vm.autoPlay = true;
                    vm.slideDirection = 'goToPreviousPage';
                    unitHelper.compileDirective.call(this, directivename,
                        '<yoo-slide-box auto-play="{{vm.autoPlay}}" slide-direction="{{vm.slideDirection}}">' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '</yoo-slide-box>');
                    spyOn(this.controller, 'goToNextPage');
                    spyOn(this.controller, 'goToPreviousPage');
                    expect(this.controller.slideDirection).toBe('goToPreviousPage');

                    expect(this.controller.goToPreviousPage.calls.count()).toBe(0);
                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    expect(this.controller.goToPreviousPage.calls.count()).toBe(2);

                    vm.slideDirection = 'goToNextPage';
                    this.$scope.$digest();
                    expect(this.controller.slideDirection).toBe('goToNextPage');
                    expect(this.controller.goToNextPage.calls.count()).toBe(0);
                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    this.$timeout.flush(this.controller.slideInterval);
                    expect(this.controller.goToNextPage.calls.count()).toBe(3);
                    expect(this.controller.goToPreviousPage.calls.count()).toBe(2);
                });
            });

            it('active-slide should bind', function() {
                var vm = this.$scope.vm;
                vm.activeSlide = 0;
                unitHelper.compileDirective.call(this, directivename,
                    '<yoo-slide-box active-slide="vm.activeSlide">' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '</yoo-slide-box>');
                spyOn(this.controller, 'goToPage');

                vm.activeSlide = 2;
                this.$scope.$digest();
                expect(this.controller.goToPage).toHaveBeenCalledWith(vm.activeSlide);

                vm.activeSlide = 1;
                this.$scope.$digest();
                expect(this.controller.goToPage).toHaveBeenCalledWith(vm.activeSlide);

                delete vm.activeSlide;
                this.$scope.$digest();
                expect(this.controller.goToPage.calls.count()).toBe(2);
            });

            it('on-slide-change binding should run when changing slides', function() {
                var vm = this.$scope.vm;
                vm.changed = jasmine.createSpy();
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box on-slide-changed="vm.changed()">' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '</yoo-slide-box>');
                this.controller.goToNextPage();
                expect(vm.changed).toHaveBeenCalled();

            });

            it('on-slide-change binding should run when changing slides', function() {
                var vm = this.$scope.vm;
                // vm.autoPlay = true;
                // vm.slideInterval = 300;
                vm.testFn1 = function() {};
                vm.testFn2 = function() {};
                vm.changed = function() {
                    vm.testFn1();
                };

                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box on-slide-changed="vm.changed()">' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '   <yoo-slide></yoo-slide>' +
                    '</yoo-slide-box>');
                var Scrollview = this.$famous['famous/views/Scrollview'];

                var fakeCurrentIndex = 0;

                spyOn(Scrollview.prototype, 'getCurrentIndex').and.callFake(function() {
                    return fakeCurrentIndex;
                });
                spyOn(Scrollview.prototype, 'goToNextPage').and.callFake(function(index) {
                    fakeCurrentIndex++;
                });
                spyOn(Scrollview.prototype, 'goToPreviousPage').and.callFake(function(index) {
                    fakeCurrentIndex--;
                });

                spyOn(vm, 'testFn1');
                spyOn(vm, 'testFn2');

                this.controller.goToNextPage();
                this.$scope.$digest();
                this.controller.goToNextPage();
                this.$scope.$digest();
                this.controller.goToNextPage();
                this.$scope.$digest();
                expect(vm.testFn1.calls.count()).toBe(3);

                vm.changed = function() {
                    vm.testFn2();
                };

                this.controller.goToPreviousPage();
                this.$scope.$digest();
                this.controller.goToPreviousPage();
                this.$scope.$digest();
                expect(vm.testFn2.calls.count()).toBe(2);
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

                describe('#goToPage', function() {
                    beforeEach(function() {
                        unitHelper.compileDirectiveFamous.call(this, directivename,
                            '<yoo-slide-box>' +
                            '<yoo-slide>' + '</yoo-slide>' +
                            '<yoo-slide>' + '</yoo-slide>' +
                            '<yoo-slide>' + '</yoo-slide>' +
                            '</yoo-slide-box>'
                        );
                        var scrollview = this.$famous.find('fa-scroll-view')[0].renderNode;

                        spyOn(scrollview, 'goToPage').and.callThrough();
                        spyOn(scrollview, 'goToNextPage');
                        spyOn(scrollview, 'goToPreviousPage');

                        this.scrollview = scrollview;
                    });

                    it('should call the Scrollview method', function() {
                        this.controller.goToPage(2);
                        expect(this.scrollview.goToPage).toHaveBeenCalledWith(2);
                    });

                    it('should call Scrollview#goToNextPage() the correct number of times', function() {
                        this.controller.goToPage(5);
                        expect(this.scrollview.goToNextPage.calls.count()).toBe(5);
                        expect(this.scrollview.goToPreviousPage.calls.count()).toBe(0);
                    });

                    it('should call Scrollview#goToPreviousPage() the correct number of times', function() {
                        this.controller.goToPage(-4);
                        expect(this.scrollview.goToNextPage.calls.count()).toBe(0);
                        expect(this.scrollview.goToPreviousPage.calls.count()).toBe(4);
                    });
                });

                it('#start() should enable autoPlay', function() {
                    unitHelper.compileDirective.call(this, directivename,
                        '<yoo-slide-box>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '</yoo-slide-box>');
                    expect(this.controller.autoPlay).toBeFalsy();
                    spyOn(this.controller, 'goToNextPage');

                    this.controller.start();
                    this.$scope.$digest();

                    this.$timeout.flush(4000);
                    this.$timeout.flush(4000);
                    this.$timeout.flush(4000);
                    expect(this.controller.goToNextPage.calls.count()).toBe(3);
                });

                it('#stop() should disable autoPlay', function() {
                    var vm = this.$scope.vm;
                    vm.autoPlay = true;
                    unitHelper.compileDirective.call(this, directivename,
                        '<yoo-slide-box auto-play="{{vm.autoPlay}}">' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '   <yoo-slide></yoo-slide>' +
                        '</yoo-slide-box>');
                    expect(this.controller.autoPlay).toBe(true);
                    spyOn(this.controller, 'goToNextPage');

                    this.$timeout.flush(4000);
                    this.$timeout.flush(4000);
                    this.$timeout.flush(4000);
                    expect(this.controller.goToNextPage.calls.count()).toBe(3);
                    this.controller.goToNextPage.calls.reset();

                    this.controller.stop();
                    this.$scope.$digest();
                    this.$scope.$digest();

                    this.$timeout.flush(4000);
                    this.$timeout.flush(4000);
                    this.$timeout.flush(4000);
                    expect(this.controller.goToNextPage.calls.count()).toBe(0);
                });

                it('#goToNextPage() should call the Scrollview method', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = this.$famous['famous/views/Scrollview'];

                    spyOn(Scrollview.prototype, 'goToNextPage');

                    this.controller.goToNextPage();
                    expect(Scrollview.prototype.goToNextPage).toHaveBeenCalled();
                });

                it('#goToPreviousPage() should call the Scrollview method', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = this.$famous['famous/views/Scrollview'];

                    spyOn(Scrollview.prototype, 'goToPreviousPage');

                    this.controller.goToPreviousPage();
                    expect(Scrollview.prototype.goToPreviousPage).toHaveBeenCalled();
                });

                it('#enableSlide() should call the Scrollview method', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    var Scrollview = this.$famous['famous/views/Scrollview'];

                    spyOn(Scrollview.prototype, 'enableSlide');

                    this.controller.enableSlide();
                    expect(Scrollview.prototype.enableSlide).toHaveBeenCalled();
                });

                it('#currentIndex() should succeed', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'getCurrentIndex').and.returnValue(7);
                    var index = this.controller.currentIndex();
                    expect(this.controller.getCurrentIndex).toHaveBeenCalled();
                    expect(index).toBe(7);

                });

                it('#slidesCount() should succeed', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'getTotalPages').and.returnValue(7);
                    var count = this.controller.slidesCount();
                    expect(this.controller.getTotalPages).toHaveBeenCalled();
                    expect(count).toBe(7);
                });

                it('#slide() should succeed', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'goToPage');

                    this.controller.slide(2);
                    expect(this.controller.goToPage).toHaveBeenCalledWith(2);
                });

                it('#next() should succeed', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    spyOn(this.controller, 'goToNextPage');

                    this.controller.next();
                    expect(this.controller.goToNextPage).toHaveBeenCalled();
                });

                it('#previous() should succeed', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );
                    spyOn(this.controller, 'goToPreviousPage');

                    this.controller.previous();
                    expect(this.controller.goToPreviousPage).toHaveBeenCalled();
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

                it('#goToPreviousPage() should call directives goToPreviousPage method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'goToPreviousPage');
                    this.slideBoxDelegate.goToPreviousPage();
                    expect(this.controller.goToPreviousPage).toHaveBeenCalled();
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

                it('#goToNextPage() should call directives goToNextPage method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'goToNextPage');
                    this.slideBoxDelegate.goToNextPage();
                    expect(this.controller.goToNextPage).toHaveBeenCalled();
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

                it('#enableSlide() should call directives enableSlide method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'enableSlide');
                    this.slideBoxDelegate.enableSlide(true);
                    expect(this.controller.enableSlide).toHaveBeenCalledWith(true);
                });

                it('#start() should call directives start method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'start');
                    this.slideBoxDelegate.start();
                    expect(this.controller.start).toHaveBeenCalled();
                });

                it('#stop() should call directives stop method from another controller', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-slide-box>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '<yoo-slide>' + '</yoo-slide>' +
                        '</yoo-slide-box>'
                    );

                    spyOn(this.controller, 'stop');
                    this.slideBoxDelegate.stop();
                    expect(this.controller.stop).toHaveBeenCalled();
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
