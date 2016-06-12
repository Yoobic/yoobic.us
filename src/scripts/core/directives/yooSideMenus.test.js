'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var _ = require('lodash');
var app = require('../')('app');
var directivename = 'yooSideMenus';
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
                this.famousHelper = $injector.get(app.name + '.famousHelper');
                this.$scope.vm = {};
            }));

            afterEach(function() {
                unitHelper.cleanDocument();
            });

            it('should succeed', function() {
                var element = unitHelper.compileDirective.call(this, directivename, '<yoo-side-menus></yoo-side-menus>');
                expect(element.html().trim()).toBeDefined();
            });

            it('should auto implement the sideMenu event pipeline', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-side-menus>' +
                    '<yoo-side-menu-content>' + '</yoo-side-menu-content>' +
                    '<yoo-side-menu side="left">' + '</yoo-side-menu>' +
                    '<yoo-side-menu side="right">' + '</yoo-side-menu>' +
                    '</yoo-side-menus>'
                );
                this.$scope.$digest();

                var eventhandler = this.controller.eventHandler;
                var contentSurface = this.controller.content.getSurface().renderNode;
                var leftMenuSurface = this.controller.left.getSurface().renderNode;
                var rightMenuSurface = this.controller.content.getSurface().renderNode;

                var testEventsHandled = 0;

                eventhandler.on('testevent', function(evt) {
                    testEventsHandled++;
                });

                contentSurface._eventOutput.emit('testevent', unitHelper.mockEvent({
                    count: 1
                }));
                leftMenuSurface._eventOutput.emit('testevent', unitHelper.mockEvent({
                    count: 1
                }));
                rightMenuSurface._eventOutput.emit('testevent', unitHelper.mockEvent({
                    count: 1
                }));
                expect(testEventsHandled).toBe(3);
            });

            it('should support MouseSync & TouchSync', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-side-menus>' +
                    '<yoo-side-menu-content>' + '</yoo-side-menu-content>' +
                    '<yoo-side-menu side="left">' + '</yoo-side-menu>' +
                    '<yoo-side-menu side="right">' + '</yoo-side-menu>' +
                    '</yoo-side-menus>'
                );

                var eventhandler = this.controller.eventHandler;
                expect(_(eventhandler.listeners).has('mouseup')).toBeTruthy();
                expect(_(eventhandler.listeners).has('touchend')).toBeTruthy();
            });

            it('should replace html with surfaces', function() {
                unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-side-menus>' +
                    '<yoo-side-menu-content>' +
                    '<div>surface{{view}}</div>' +
                    '</yoo-side-menu-content>' +
                    '<yoo-side-menu side="left">' +
                    '<div>surface{{view}}</div>' +
                    '</yoo-side-menu>' +
                    '<yoo-side-menu side="right">' +
                    '<div>surface{{view}}</div>' +
                    '</yoo-side-menu>' +
                    '</yoo-side-menus>', 300
                );

                this.$scope.views = [0, 1];

                var contentSurface = this.controller.content.getSurface().renderNode;
                var leftMenuSurface = this.controller.left.getSurface().renderNode;
                var rightMenuSurface = this.controller.content.getSurface().renderNode;

                // The watcher resolves view sequencing
                expect(contentSurface._node).not.toBeNull();
                expect(leftMenuSurface._node).not.toBeNull();
                expect(rightMenuSurface._node).not.toBeNull();
            });

            ddescribe('sideMenu', function() {
                describe('defaults', function() {
                    beforeEach(function() {
                        unitHelper.compileDirectiveFamous.call(this, directivename,
                            '<yoo-side-menus>' +
                            '<yoo-side-menu-content>' + '</yoo-side-menu-content>' +
                            '<yoo-side-menu>' + '</yoo-side-menu>' +
                            '</yoo-side-menus>'
                        );
                        this.sideMenu = this.directive.find('yoo-side-menu');
                        this.sideMenuCtrl = this.sideMenu.controller('yooSideMenu');
                    });

                    it('should succeed', function() {
                        expect(this.sideMenu.html().trim()).toBeDefined();
                    });

                    it('side should default to left', function() {
                        expect(this.sideMenuCtrl.side).toBe('left');
                    });

                    it('width should default to 275px', function() {
                        expect(this.sideMenuCtrl.width).toBe(275);
                    });

                    it('is-enabled should default to true', function() {
                        expect(this.sideMenuCtrl.isEnabled).toBe(true);
                    });
                });
                describe('bindings', function() {
                    beforeEach(function() {
                        var vm = this.$scope.vm;
                        vm.side = 'right';
                        vm.width = 300;
                        vm.isEnabled = false;
                        unitHelper.compileDirectiveFamous.call(this, directivename,
                            '<yoo-side-menus>' +
                            '<yoo-side-menu-content>' +
                            '<fa-surface fa-size="[525, undefined]">' + '</fa-surface>' +
                            '</yoo-side-menu-content>' +
                            '<yoo-side-menu side="{{vm.side}}" width="{{vm.width}}" is-enabled="{{vm.isEnabled}}">' +
                            '</yoo-side-menu>' +
                            '</yoo-side-menus>'
                        );
                        this.sideMenu = this.directive.find('yoo-side-menu');
                        this.sideMenuCtrl = this.sideMenu.controller('yooSideMenu');
                        this.$scope.$digest();
                    });

                    it('should one-way bind to side and change sides cleanly', function() {
                        expect(this.sideMenuCtrl.side).toBe('right');
                        expect(typeof this.controller.right).toBe('object');
                        expect(typeof this.controller.left).toBe('undefined');

                        var vm = this.$scope.vm;
                        vm.side = 'left';
                        this.$scope.$digest();
                        expect(this.sideMenuCtrl.side).toBe('left');
                        expect(typeof this.controller.left).toBe('object');
                        expect(typeof this.controller.right).toBe('undefined');
                    });

                    it('should one-way bind to width', function() {
                        expect(this.sideMenuCtrl.width).toBe(300);

                        var vm = this.$scope.vm;
                        vm.width = 400;
                        this.$scope.$digest();
                        expect(this.sideMenuCtrl.width).toBe(400);
                    });

                    it('should one-way bind to is-enabled', function() {
                        expect(this.sideMenuCtrl.isEnabled).toBe(false);

                        var vm = this.$scope.vm;
                        vm.isEnabled = true;
                        this.$scope.$digest();
                        expect(this.sideMenuCtrl.isEnabled).toBe(true);
                    });
                });
                describe('sideMenuCtrl', function() {
                    beforeEach(function() {
                        unitHelper.compileDirectiveFamous.call(this, directivename,
                            '<yoo-side-menus>' +
                            '<yoo-side-menu-content>' + '</yoo-side-menu-content>' +
                            '<yoo-side-menu side="left" width="300" is-enabled="false">' + '</yoo-side-menu>' +
                            '</yoo-side-menus>'
                        );
                        this.sideMenu = this.directive.find('yoo-side-menu');
                        this.sideMenuCtrl = this.sideMenu.controller('yooSideMenu');
                    });

                    it('#getSurface() should succeed', function() {
                        var Surface = this.$famous['famous/core/Surface'];
                        expect(this.sideMenuCtrl.getSurface().renderNode instanceof Surface).toBeTruthy();
                    });

                    it('#getWidth() should succeed', function() {
                        expect(this.sideMenuCtrl.getWidth()).toBe(300);
                    });

                    it('#getEnabled() should succeed', function() {
                        expect(this.sideMenuCtrl.getEnabled()).toBe(false);
                    });

                });

            });

            describe('sideMenuContent', function() {
                describe('sideMenuContentCtrl', function() {
                    beforeEach(function() {
                        unitHelper.compileDirectiveFamous.call(this, directivename,
                            '<yoo-side-menus>' +
                            '<yoo-side-menu-content>' +
                            '<fa-surface fa-size="[525, undefined]">' + '</fa-surface>' +
                            '</yoo-side-menu-content>' +
                            '<yoo-side-menu>' + '</yoo-side-menu>' +
                            '</yoo-side-menus>'
                        );
                        this.sideMenuContent = this.directive.find('yoo-side-menu-content');
                        this.sideMenuContentCtrl = this.sideMenuContent.controller('yooSideMenuContent');
                    });

                    it('#getSurface() should succeed', function() {
                        var Surface = this.$famous['famous/core/Surface'];
                        expect(this.sideMenuContentCtrl.getSurface().renderNode instanceof Surface).toBeTruthy();
                    });

                    it('#getWidth() should succeed', function() {
                        expect(this.sideMenuContentCtrl.getWidth()).toBe(525);
                    });

                });

            });

            describe('sideMenuDelegate', function() {

                beforeEach(inject(function($injector) {
                    this.sideMenuDelegate = $injector.get(app.name + '.sideMenuDelegate');
                }));

                it('should deregister on $destory', function() {
                    unitHelper.compileDirectiveFamous.call(this, directivename,
                        '<yoo-side-menus>' +
                        '<yoo-side-menu-content>' + '</yoo-side-menu-content>' +
                        '<yoo-side-menu side="left">' + '</yoo-side-menu>' +
                        '<yoo-side-menu side="right">' + '</yoo-side-menu>' +
                        '</yoo-side-menus>'
                    );

                    expect(this.sideMenuDelegate._instances.length).toBe(1);
                    this.$scope.$destroy();
                    expect(this.sideMenuDelegate._instances.length).toBe(0);
                });

            });

        });
    });
});
