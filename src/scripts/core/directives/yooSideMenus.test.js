'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
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
            }));

            it('should succeed', function() {
                var element = unitHelper.compileDirective.call(this, directivename, '<yoo-side-menus></yoo-side-menus>');
                expect(element.html().trim()).toBeDefined();
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
