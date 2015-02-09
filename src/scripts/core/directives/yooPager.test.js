'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var directivename = 'yooPager';
var unitHelper = require('unitHelper');

describe(app.name, function() {

    describe('Directives', function() {

        describe(directivename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.$templateCache = $injector.get('$templateCache');
                this.$famousHelper = $injector.get(app.name + '.' + 'famousHelper');
                this.$compile = $injector.get('$compile');
                this.$scope = $injector.get('$rootScope').$new();
            }));

            it('should require yooSlideBox', function() {
                expect(function() {
                    unitHelper.compileDirective.call(this, directivename, '<yoo-pager></yoo-pager>');
                }.bind(this)).toThrowError();
            });

            it('should call yooSlideBoxCtrl.goToPage on mouse click', function() {
                var element = unitHelper.compileDirectiveFamous.call(this, directivename,
                    '<yoo-slide-box show-pager="true">' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '   <yoo-slide>' +
                    '      <div class="test"></div>' +
                    '   </yoo-slide>' +
                    '</yoo-slide-box>');

                var index = 1;
                spyOn(this.scope.yooSlideBoxCtrl, 'goToPage');
                var surfaceElement = element.find('yoo-pager')[0].querySelectorAll('fa-surface.yoo-pager-cursor')[index];

                var surface = this.$famousHelper.getFamousElement(surfaceElement);
                unitHelper.triggerEventFamousElement(surface, 'click');

                this.$scope.$digest();
                expect(this.scope.yooSlideBoxCtrl.goToPage).toHaveBeenCalledWith(index);
            });
        });
    });
});
