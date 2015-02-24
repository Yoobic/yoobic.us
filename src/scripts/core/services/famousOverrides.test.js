'use strict';
var angular = require('angular-mocks');
var app = require('../')('app');
var unitHelper = require('unitHelper');
var _ = require('lodash');
var servicename = 'famousOverrides';

describe(app.name, function() {

    describe('Services', function() {

        describe(servicename, function() {
            var numberOfSurfaces = 5;
            var waitTime = 500;
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

            beforeEach(function() {
                this.service.apply();
            });

            afterEach(function() {
                delete this.Scrollview;
            });

            it('should be defined', function() {
                expect(this.service).toBeDefined();
            });

            it('should exposes an apply function', function() {
                expect(this.service.apply).toBeDefined();
            });

            it('goToFirst() should succeed', function() {

                var scrollview = new this.Scrollview();
                scrollview.sequenceFrom(createSurfaces.call(this));

                scrollview.goToNextPage();
                expect(scrollview.getCurrentIndex()).toEqual(1);

                scrollview.goToFirst();
                expect(scrollview.getCurrentIndex()).toEqual(0);
            });

            it('goToLast() should succeed', function() {

                var scrollview = new this.Scrollview();
                scrollview.sequenceFrom(createSurfaces.call(this));

                scrollview.goToLast();
                expect(scrollview.getCurrentIndex()).toEqual(numberOfSurfaces - 1);

            });

            it('getAbsolutePosition() with no surfaces should return 0', function() {

                var scrollview = new this.Scrollview();

                var absolutePosition = scrollview.getAbsolutePosition();
                expect(absolutePosition).toEqual(0);

            });

            it('getAbsolutePosition() with surfaces should succeed', function(done) {
                var scrollview = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];
                var Modifier = this.$famous['famous/core/Modifier'];
                // var ViewSequence = this.$famous['famous/core/ViewSequence'];
                var modifier = new Modifier({
                    size: [100, 100]
                });

                // var options = {
                //     array: createSurfaces.call(this)
                //     // trackSize: true
                // };

                // var viewSeq = new ViewSequence(options);

                // scrollview.sequenceFrom(viewSeq);

                scrollview.sequenceFrom(createSurfaces.call(this));
                Engine.createContext().add(modifier).add(scrollview);
                scrollview.goToLast();
                setTimeout(function() {
                    var absolutePosition = scrollview.getAbsolutePosition();

                    expect(absolutePosition >= (numberOfSurfaces - 1.5) * 100).toBeTruthy();
                    done();
                }, waitTime);

            });

            it('getContainerSize() with surfaces should succeed', function(done) {
                var expectedSize = [200, 300];
                var scrollview = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];
                var Modifier = this.$famous['famous/core/Modifier'];
                // var ViewSequence = this.$famous['famous/core/ViewSequence'];
                var modifier = new Modifier({
                    size: expectedSize
                });

                // var options = {
                //     array: createSurfaces.call(this)
                //     // trackSize: true
                // };

                // var viewSeq = new ViewSequence(options);

                // scrollview.sequenceFrom(viewSeq);
                scrollview.sequenceFrom(createSurfaces.call(this));
                Engine.createContext().add(modifier).add(scrollview);

                setTimeout(function() {
                    var size = scrollview.getContainerSize();
                    expect(size).toEqual(expectedSize);
                    done();
                }, waitTime);

            });

            var checkGetPageDistance = function(direction, done) {

                var expectedSize = [200, 300];

                var scrollview = new this.Scrollview({
                    direction: direction
                });
                var Engine = this.$famous['famous/core/Engine'];
                var Modifier = this.$famous['famous/core/Modifier'];
                var modifier = new Modifier({
                    size: expectedSize
                });
                var surfaces = createSurfaces.call(this);
                scrollview.sequenceFrom(surfaces);
                Engine.createContext().add(modifier).add(scrollview);

                setTimeout(function() {
                    surfaces.forEach(function(surface, index) {
                        var distance = scrollview.getPageDistance(index);
                        expect(distance).toBe(index);
                    });
                    scrollview.setPosition(expectedSize[direction] / 2);
                    setTimeout(function() {
                        surfaces.forEach(function(surface, index) {
                            var distance = scrollview.getPageDistance(index);
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
                var expectedSize = [200, 300];
                var scrollview = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];
                var Modifier = this.$famous['famous/core/Modifier'];
                var modifier = new Modifier({
                    size: expectedSize
                });

                scrollview.sequenceFrom(createSurfaces.call(this));
                Engine.createContext().add(modifier).add(scrollview);
                var total = scrollview.getTotalPages();
                expect(total).toEqual(numberOfSurfaces);

            });

            it('getTotalPages() with no surfaces should return null', function() {

                var scrollview = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];

                Engine.createContext().add(scrollview);
                var total = scrollview.getTotalPages();
                expect(total).toEqual(0);

            });

            it('setMouseSync() should succeed', function() {

                var scrollview = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];

                Engine.createContext().add(scrollview);
                scrollview.setMouseSync();
                expect(_(scrollview.sync._eventInput.listeners).has('mouseup')).toBeTruthy();
            });

            describe('#enableSlide()', function() {
                beforeEach(function() {
                    var scrollview = new this.Scrollview();
                    var Engine = this.$famous['famous/core/Engine'];
                    var Surface = this.$famous['famous/core/Surface'];
                    var EventHandler = this.$famous['famous/core/EventHandler'];

                    var eventHandler = new EventHandler();

                    var surface = new Surface({
                        content: 'toto',
                        size: [100, 100]
                    });

                    surface.pipe(scrollview);
                    scrollview.sequenceFrom([surface]);
                    Engine.createContext().add(scrollview);
                    eventHandler.pipe(scrollview);

                    this.scrollview = scrollview;
                    this.surface = surface;
                });

                it('should call enableSync() and succeed', function() {
                    var slideEnabled = this.scrollview.enableSlide(true);

                    expect(this.scrollview._touchCount).toBe(0);
                    this.surface._eventOutput.emit('mousewheel', unitHelper.mockEvent({
                        count: 1
                    }));

                    expect(this.scrollview._touchCount).toBe(1);
                    expect(slideEnabled).toBe(true);
                });

                it('should call disableSync() and succeed', function() {
                    var slideEnabled = this.scrollview.enableSlide(false);

                    expect(this.scrollview._touchCount).toBe(0);
                    this.surface._eventOutput.emit('mousewheel', unitHelper.mockEvent({
                        count: 1
                    }));

                    expect(this.scrollview._touchCount).toBe(0);
                    expect(slideEnabled).toBe(false);
                });

                it('should return the current setting when not called with an argument', function() {
                    expect(this.scrollview._touchCount).toBe(0);

                    this.scrollview.enableSlide(true);
                    var slideEnabled = this.scrollview.enableSlide();
                    expect(slideEnabled).toBe(true);

                    this.surface._eventOutput.emit('mousewheel', unitHelper.mockEvent({
                        count: 1
                    }));
                    expect(this.scrollview._touchCount).toBe(1);

                    this.scrollview.enableSlide(false);
                    var slideEnabled2 = this.scrollview.enableSlide();
                    expect(slideEnabled2).toBe(false);

                    this.surface._eventOutput.emit('mousewheel', unitHelper.mockEvent({
                        count: 1
                    }));
                    expect(this.scrollview._touchCount).toBe(1);
                });
            });

            it('setLoop() should succeed', function() {

                var scrollview = new this.Scrollview();
                var Engine = this.$famous['famous/core/Engine'];
                var Surface = this.$famous['famous/core/Surface'];

                var surface = new Surface({
                        content: 'toto',
                        size: [100, 100]
                    });

                scrollview.sequenceFrom([surface]);
                Engine.createContext().add(scrollview);
                expect(scrollview._node._.loop).toBe(false);
                scrollview.setLoop(true);
                expect(scrollview._node._.loop).toBe(true);
                scrollview.setLoop(false);
                expect(scrollview._node._.loop).toBe(false);
            });
        });
    });
});
