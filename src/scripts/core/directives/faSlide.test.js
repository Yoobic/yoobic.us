'use strict';
/*eslint consistent-this:[0] */
var angular = require('angular-mocks');
var app = require('../')('app');
var directivename = 'faSlide';
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
            }));

            afterEach(function() {
                unitHelper.cleanDocument();
            });

            it('should require faSlideBox', function() {
                var self = this;
                expect(function() {
                    var element = unitHelper.compileDirective.call(self, directivename, '<fa-slide></fa-slide>');
                    element.html();
                }).toThrowError();

                expect(function() {
                    var element = unitHelper.compileDirective.call(self, 'faSlideBox', '<fa-slide-box><fa-slide></fa-slide></fa-slide-box>');
                    var slideEl = element.find('fa-slide');
                    return slideEl.html().trim();
                }).toBeDefined();
            });

            it('should wrap visible HTML content with a fa-surface', function() {
                var element = unitHelper.compileDirectiveFamous.call(this, 'faSlideBox', '<fa-slide-box><fa-slide><div>Hello World!</div></fa-slide></fa-slide-box>');
                var surfaces = this.$famous.find('fa-surface', element);
                expect(surfaces[0].renderNode.content.innerText).toMatch('Hello World!');
            });

            it('should handle an fa-surface from the consumer', function() {
                var element = unitHelper.compileDirectiveFamous.call(this, 'faSlideBox', '<fa-slide-box><fa-slide><fa-surface><div>Hello World!</div></fa-surface></fa-slide></fa-slide-box>');
                var surfaces = this.$famous.find('fa-surface', element);
                expect(surfaces.length).toBe(1);
                expect(surfaces[0].renderNode.content.innerText).toMatch('Hello World!');
            });

        });
    });
});

// Surface {
//     _matrix: null,
//     _opacity: 1,
//     _origin: null,
//     _size: null,
//     _eventOutput: EventHandler {
//         listeners: Object {
//             mousewheel: ...,
//             wheel: ...,
//             touchstart: ...,
//             touchmove: ...,
//             touchend: ...,
//             touchcancel: ...,
//             unpipe: ...,
//             start: ...,
//             update: ...,
//             end: ...,
//             resize: ...,
//             mousedown: ...,
//             mousemove: ...,
//             mouseup: ...,
//             mouseleave: ...
//         },
//         _owner: Surface {
//             _matrix: ...,
//             _opacity: ...,
//             _origin: ...,
//             _size: ...,
//             _eventOutput: ...,
//             eventForwarder: ...,
//             id: ...,
//             _element: ...,
//             _sizeDirty: ...,
//             _originDirty: ...,
//             _transformDirty: ...,
//             _invisible: ...,
//             options: ...,
//             properties: ...,
//             attributes: ...,
//             content: ...,
//             classList: ...,
//             size: ...,
//             _classesDirty: ...,
//             _stylesDirty: ...,
//             _attributesDirty: ...,
//             _contentDirty: ...,
//             _trueSizeCheck: ...,
//             _dirtyClasses: ...,
//             _currentTarget: ...
//         },
//         downstream: [],
//         downstreamFn: [],
//         upstream: [],
//         upstreamListeners: Object {
//             mousewheel: ...,
//             wheel: ...,
//             touchstart: ...,
//             touchmove: ...,
//             touchend: ...,
//             touchcancel: ...,
//             unpipe: ...,
//             start: ...,
//             update: ...,
//             end: ...,
//             resize: ...,
//             mousedown: ...,
//             mousemove: ...,
//             mouseup: ...,
//             mouseleave: ...
//         }
//     },
//     eventForwarder: function() {...
//     },
//     id: 2,
//     _element: null,
//     _sizeDirty: true,
//     _originDirty: false,
//     _transformDirty: false,
//     _invisible: false,
//     options: Object {},
//     properties: Object {
//         backgroundColor: 'red'
//     },
//     attributes: Object {},
//     content: < div class = "fa-surface" > < div class = "ng-scope" > Hello World! < /div></div > ,
//     classList: ['full-height'],
//     size: null,
//     _classesDirty: true,
//     _stylesDirty: true,
//     _attributesDirty: true,
//     _contentDirty: true,
//     _trueSizeCheck: true,
//     _dirtyClasses: [],
//     _currentTarget: null
// }
