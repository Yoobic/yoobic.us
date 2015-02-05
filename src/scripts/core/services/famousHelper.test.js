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
    });
});
