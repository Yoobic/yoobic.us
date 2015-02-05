'use strict';
var angular = require('angular-mocks');
var app = require('../')('app');
var servicename = 'famousOverrides';
describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {
            var numberOfSurfaces = 10;
            var waitTime = 300;
            var createSurfaces = function() {
                var Surface = this.$famous['famous/core/Surface'];
                var surfaces = [];
                for(var i = 0; i < numberOfSurfaces; i++) {
                    surfaces.push(new Surface({
                        content: 'toto' + i,
                        size: [100, 100]
                    }));
                }
                return surfaces;
            };
            beforeEach(function() {
                angular.mock.module(app.name);
            });

            beforeEach(inject(function($injector) {
                this.service = $injector.get(app.name + '.' + servicename);
                this.$famous = $injector.get('$famous');
                this.Scrollview = this.$famous['famous/views/Scrollview'];
            }));

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            it('should exposes an apply function', function() {
                expect(this.service.apply).toBeDefined();
            });

            it('goToFirst() should succeed', function() {
                this.service.apply();
                var scrollView = new this.Scrollview();
                scrollView.sequenceFrom(createSurfaces.call(this));

                scrollView.goToNextPage();
                expect(scrollView.getCurrentIndex()).toEqual(1);

                scrollView.goToFirst();
                expect(scrollView.getCurrentIndex()).toEqual(0);
            });

            it('goToLast() should succeed', function() {
                this.service.apply();
                var scrollView = new this.Scrollview();
                scrollView.sequenceFrom(createSurfaces.call(this));

                scrollView.goToLast();
                expect(scrollView.getCurrentIndex()).toEqual(numberOfSurfaces - 1);

            });

            it('getAbsolutePosition() with no surfaces should return 0', function() {
                this.service.apply();
                var scrollView = new this.Scrollview();

                var absolutePosition = scrollView.getAbsolutePosition();
                expect(absolutePosition).toEqual(0);

            });

            it('getAbsolutePosition() with surfaces should succeed', function(done) {
                this.service.apply();
                var scrollView = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];
                var Modifier = this.$famous['famous/core/Modifier'];
                var modifier = new Modifier({
                    size: [100, 100]
                });

                scrollView.sequenceFrom(createSurfaces.call(this));
                Engine.createContext().add(modifier).add(scrollView);

                scrollView.goToLast();
                setTimeout(function() {
                    var absolutePosition = scrollView.getAbsolutePosition();
                    expect(absolutePosition > 850).toBeTruthy();
                    done();
                }, waitTime);

            });

            it('getContainerSize() with surfaces should succeed', function(done) {
                this.service.apply();
                var expectedSize = [200, 300];
                var scrollView = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];
                var Modifier = this.$famous['famous/core/Modifier'];
                var modifier = new Modifier({
                    size: expectedSize
                });

                scrollView.sequenceFrom(createSurfaces.call(this));
                Engine.createContext().add(modifier).add(scrollView);

                setTimeout(function() {
                    var size = scrollView.getContainerSize();
                    expect(size).toEqual(expectedSize);
                    done();
                }, waitTime);

            });

            var checkGetPageDistance = function(direction, done) {
                this.service.apply();
                var expectedSize = [200, 300];

                var scrollView = new this.Scrollview({
                    direction: direction
                });
                var Engine = this.$famous['famous/core/Engine'];
                var Modifier = this.$famous['famous/core/Modifier'];
                var modifier = new Modifier({
                    size: expectedSize
                });
                var surfaces = createSurfaces.call(this);
                scrollView.sequenceFrom(surfaces);
                Engine.createContext().add(modifier).add(scrollView);

                setTimeout(function() {
                    surfaces.forEach(function(surface, index) {
                        var distance = scrollView.getPageDistance(index);
                        expect(distance).toBe(index);
                    });
                    scrollView.setPosition(expectedSize[direction] / 2);
                    setTimeout(function() {
                        surfaces.forEach(function(surface, index) {
                            var distance = scrollView.getPageDistance(index);
                            expect(distance).toBe(index - 1 / 2);
                        });
                        done();
                    }, waitTime);

                }, waitTime);
            };

            it('getPageDistance() with surfaces should succeed when direction is 0', function(done) {
                checkGetPageDistance.call(this, 0, done);
            });

            it('getPageDistance() with surfaces should succeed when direction is 1', function(done) {
                checkGetPageDistance.call(this, 1, done);
            });

            it('getTotalPages() with surfaces should succeed', function() {
                this.service.apply();
                var expectedSize = [200, 300];
                var scrollView = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];
                var Modifier = this.$famous['famous/core/Modifier'];
                var modifier = new Modifier({
                    size: expectedSize
                });

                scrollView.sequenceFrom(createSurfaces.call(this));
                Engine.createContext().add(modifier).add(scrollView);
                var total = scrollView.getTotalPages();
                expect(total).toEqual(numberOfSurfaces);

            });

            it('getTotalPages() with no surfaces should return null', function() {
                this.service.apply();
                var scrollView = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];

                Engine.createContext().add(scrollView);
                var total = scrollView.getTotalPages();
                expect(total).toEqual(0);

            });
        });
    });
});
