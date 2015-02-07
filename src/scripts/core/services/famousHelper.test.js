'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var servicename = 'famousHelper';
var unitHelper = require('unitHelper');

describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.service = $injector.get(app.name + '.' + servicename);
                this.$templateCache = $injector.get('$templateCache');
                this.$compile = $injector.get('$compile');
                this.$scope = $injector.get('$rootScope').$new();

            }));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            describe('#find()', function() {
                it('should find all famous element when element argument is null', function() {
                    unitHelper.compileDirectiveFamous.call(this, '',
                        '<fa-surface></fa-surface>' +
                        '<fa-surface></fa-surface>'
                    );
                    var retval = this.service.find('fa-surface');
                    expect(retval.length).toBe(2);

                });

                it('should find only children when element argument is not null', function() {
                    var element = unitHelper.compileDirectiveFamous.call(this, '',
                        '<fa-surface></fa-surface>' +
                        '<fa-view id="myview">' +
                        '    <fa-surface></fa-surface>' +
                        '    <fa-surface></fa-surface>' +
                        '    <fa-surface></fa-surface>' +
                        '</fa-view>');
                    var myview = element.find('fa-view');
                    var retval = this.service.find('fa-surface', myview);

                    expect(retval instanceof angular.element).toBeTruthy();
                    expect(retval.length).toBe(3);
                });
            });

            describe('#wrapElement()', function() {
                it('should succeed', function() {

                    var element = angular.element('<component><h1><div></div></h1></component>');
                    var expectedContent = element.html();
                    this.service.wrapElement(element, '<fa-surface></fa-surface>');
                    expect(element.find('fa-surface').length).toBe(1);
                    expect(element.find('fa-surface')[0].innerHTML).toBe(expectedContent);
                    expect(element[0].nodeName).toBe('COMPONENT');
                });
            });

            describe('#manualTransclude()', function() {
                it('should succeed when no selector found', function() {

                    var element = angular.element('<h1><div></div></h1>');
                    var template = angular.element('<component><ng-transclude></ng-transclude></component>');

                    this.service.manualTransclude(template, element, 'fa-surface', '<fa-surface id="added"></fa-surface>');
                    var surface = element.find('fa-surface');
                    expect(surface.length).toBe(1);
                    expect(surface[0].attributes.id.value).toBe('added');
                });

                it('should succeed when selector found', function() {

                    var element = angular.element('<component><fa-surface id="present"><h1><div></div></h1></fa-surface></component>');
                    var template = angular.element('<content><ng-transclude></ng-transclude></content>');
                    this.service.manualTransclude(template, element, 'fa-surface', '<fa-surface></fa-surface>');
                    var surface = element.find('fa-surface');
                    expect(surface.length).toBe(1);
                    expect(surface[0].attributes.id.value).toBe('present');
                });

                it('when no ng-tansclude element should throw Error', function() {
                    expect(function() {
                        var element = angular.element('<component><fa-surface id="present"><h1><div></div></h1></fa-surface></component>');
                        var template = angular.element('<content></content>');
                        this.service.manualTransclude(template, element, 'fa-surface', '<fa-surface></fa-surface>');
                    }.bind(this)).toThrowError();
                });
            });

        });
    });
});
