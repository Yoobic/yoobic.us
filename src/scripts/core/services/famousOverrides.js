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
        };

        return {
            apply: apply
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};