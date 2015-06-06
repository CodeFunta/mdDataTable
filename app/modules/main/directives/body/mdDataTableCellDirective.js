(function(){
    'use strict';

    function mdDataTableCellDirective(ColumnAwareService, ColumnOptionProvider){
        return {
            restrict: 'E',
            templateUrl: '/main/templates/mdDataTableCell.html',
            replace: true,
            transclude: true,
            scope: {},
            link: function($scope){
                console.log('cell-directive start');

                $scope.columnIndex = _.clone($scope.$parent.cellIndex);

                ColumnAwareService.subscribeToOptionListChange(function(value){
                    $scope.alignRule = value[$scope.columnIndex].alignRule;
                    $scope.columnClass = getColumnClass($scope.alignRule);
                });

                $scope.$parent.cellIndex++;

                function getColumnClass(a) {
                    if (a === ColumnOptionProvider.ALIGN_RULE.ALIGN_RIGHT) {
                        return 'rightAlignedColumn';
                    } else {
                        return 'leftAlignedColumn';
                    }
                }
                console.log('cell-directive end');
            }
        };
    }

    angular
        .module('mdDataTable')
        .directive('mdDataTableCell', mdDataTableCellDirective);
}());