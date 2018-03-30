(function () {
    'use strict';

    function ClickableRowsFeatureFactory($timeout) {

        function ClickableRowsFeature(params) {
            this.$scope = params.$scope;
            this.ctrl = params.ctrl;
            this.selectionPivot = null;

            this.$scope.rowClickCallBackHandler = _.bind(this.rowClickCallBackHandler, this);
            this.$scope.rowDblClickCallBackHandler = _.bind(this.rowDblClickCallBackHandler, this);
        }

        ClickableRowsFeature.prototype.rowClickCallBackHandler = function (event, row) {
            var that = this;
            if (!event.ctrlKey && !event.shiftKey) {
                //reset all checkboxes
                var isSelected = row.optionList.selected;
                that.ctrl.dataStorage.setAllRowsSelected(false, that.$scope.isPaginationEnabled());
                //toggle current row
                row.optionList.selected = !isSelected;
                that.selectionPivot = row;
                // we need to push it to the event loop to make it happen last
                // (e.g.: all the elements can be selected before we call the callback)
                $timeout(function () {
                    that.$scope.clickedRowCallback({ rowId: row.rowId, row: row });

                    // that.$scope.selectedRowCallback({
                    //     rows: that.ctrl.dataStorage.getSelectedRows()
                    // });
                }, 0);
                
                return false;
            }
            if (event.ctrlKey && event.shiftKey) {
                event.preventDefault();
                that.selectRowsBetweenIndexes(that.ctrl.dataStorage.getRowIndex(that.selectionPivot), that.ctrl.dataStorage.getRowIndex(row));
                return false;
            }
            event.preventDefault();
            
            if (event.ctrlKey) {
                row.optionList.selected = !row.optionList.selected;
                that.selectionPivot = row;

            }
            if (event.shiftKey) {
                that.ctrl.dataStorage.setAllRowsSelected(false, that.$scope.isPaginationEnabled());
                that.selectRowsBetweenIndexes(that.ctrl.dataStorage.getRowIndex(that.selectionPivot), that.ctrl.dataStorage.getRowIndex(row));
            }
            $timeout(function () {
                that.$scope.selectedRowCallback({
                    rows: that.ctrl.dataStorage.getSelectedRows()
                });
            }, 0);
            return false;

        };

        ClickableRowsFeature.prototype.selectRowsBetweenIndexes = function (ia, ib) {
            var that = this;
            var bot = Math.min(ia, ib);
            var top = Math.max(ia, ib);

            for (var i = bot; i <= top; i++) {
                var opt = that.ctrl.dataStorage.getRowOptions(i);
                if(opt) {
                    opt.selected = true;
                }
            }
        }
        ClickableRowsFeature.prototype.rowDblClickCallBackHandler = function (event, row) {
            var that = this;
            // we need to push it to the event loop to make it happen last
            // (e.g.: all the elements can be selected before we call the callback)
            $timeout(function () {
                that.$scope.dblClickedRowCallback({ rowId: row.rowId, row: row });
            }, 0);
        };

        return {
            getInstance: function (params) {
                return new ClickableRowsFeature(params);
            }
        };
    }

    angular
        .module('mdDataTable')
        .service('ClickableRowsFeature', ClickableRowsFeatureFactory);
}());