'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var servicename = 'slideBoxDelegate';
describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {

            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.service = $injector.get(app.name + '.' + servicename);
            }));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            it('should expose a goToPage method', function() {
                expect(this.service.goToPage).toBeDefined();
            });

            it('should expose a getTotalPages method', function() {
                expect(this.service.getTotalPages).toBeDefined();
            });
        });
    });
});
