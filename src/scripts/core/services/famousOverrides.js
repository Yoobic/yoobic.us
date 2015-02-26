'use strict';
var servicename = 'famousOverrides';
var _ = require('lodash');

module.exports = function(app) {

    var dependencies = ['$famous'];

    function service($famous) {
        var Scrollview = $famous['famous/views/Scrollview'];
        var apply = function() {

            Scrollview.prototype.getAbsolutePosition = function getAbsolutePosition() {
                if(!this._node) {
                    return 0;
                }
                if(this._scroller.getCumulativeSize(this.getCurrentIndex())) {
                    this._lastCumulativeSize = this._scroller.getCumulativeSize(this.getCurrentIndex())[this.options.direction];
                }
                return this._lastCumulativeSize + this.getPosition();
            };

            Scrollview.prototype.goToFirst = function(velocity, position) {
                this.goToPage(0);
            };

            Scrollview.prototype.goToLast = function(velocity, position) {
                var _ = this._node._;
                this.goToPage(_.array.length - 1);
            };

            /**
             * Gets the container size of the scroll view
             * because .getSize() does not work properly
             * @returns {Array} - The size as an array of double
             */
            Scrollview.prototype.getContainerSize = function() {
                return this._scroller._contextSize;
            };

            Scrollview.prototype.getContainerLength = function() {
                return this.getContainerSize()[this.options.direction || 0];
            };

            Scrollview.prototype.getPageDistance = function(index) {
                var retVal = index;

                var length = this.getContainerLength();
                try {
                    retVal = index - this.getAbsolutePosition() / length;
                } catch(err) {}

                return retVal;
            };

            Scrollview.prototype.getTotalPages = function() {
                if(!this._node) {
                    return 0;
                }
                return this._node._.array.length;
            };

            Scrollview.prototype.setMouseSync = function() {
                this.sync.addSync(['mouse']);
            };

            Scrollview.prototype.disableSyncs = function() {
                _(this.sync._syncs).forEach(function(evt, evtName) {
                    this.sync.unpipeSync(evtName);
                }.bind(this));
            };

            Scrollview.prototype.enableSyncs = function() {
                _(this.sync._syncs).forEach(function(evt, evtName) {
                    this.sync.pipeSync(evtName);
                }.bind(this));
            };

            Scrollview.prototype.enableSlide = function(shouldEnable) {
                if(shouldEnable) {
                    this.enableSyncs();
                } else if(!shouldEnable && shouldEnable !== undefined) {
                    this.disableSyncs();
                }
                return !!this.sync._eventOutput.upstream.length;
            };

            Scrollview.prototype.setLoop = function(shouldLoop) {
                if(this._node) {
                    this._node.render();
                    this._node._.loop = shouldLoop;
                //     this.getCurrentIndex();
                //     console.log('firstIndex ',this._node._.firstIndex );
                //     this._node._.reindex(0, 0, this._node._.array.length);
                }
            };
        };

        return {
            apply: apply
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
