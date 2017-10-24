(function () {
    'use strict';

    function SelectableRowsFeatureFactory($timeout) {

        function SelectableRowsFeature(params) {
            this.$scope = params.$scope;
            this.ctrl = params.ctrl;

            this.$scope.onCheckboxChange = _.bind(this.onCheckboxChange, this);
            this.$scope.onCheckboxClick = _.bind(this.onCheckboxClick, this);
        }
        SelectableRowsFeature.prototype.onCheckboxClick = function ($event) {
            var that = this;
            if ($event.stopPropagation) {    // standard
                $event.stopPropagation();
            } else {    // IE6-8
                 $event.cancelBubble = true;
            }
        };
        SelectableRowsFeature.prototype.onCheckboxChange = function () {
            var that = this;

            // we need to push it to the event loop to make it happen last
            // (e.g.: all the elements can be selected before we call the callback)
            $timeout(function () {
                that.$scope.selectedRowCallback({
                    rows: that.ctrl.dataStorage.getSelectedRows()
                });
            }, 0);
        };

        return {
            getInstance: function (params) {
                return new SelectableRowsFeature(params);
            }
        };
    }

    angular
        .module('mdDataTable')
        .service('SelectableRowsFeature', SelectableRowsFeatureFactory);
}());