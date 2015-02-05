'use strict';
var servicename = 'famousOverrides';

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

            Scrollview.prototype.getPageDistance = function(index) {
                var retVal = index;

                var length = this.getContainerSize()[this.options.direction || 0];
                try {
                    retVal = index - this.getAbsolutePosition() / length;
                } catch(err) {}

                return retVal;
            };

            Scrollview.prototype.getTotalPage = function() {
                if(!this._node) {
                    return 0;
                }
                return this._node._.array.length;
            };
        };

        return {
            apply: apply
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};
