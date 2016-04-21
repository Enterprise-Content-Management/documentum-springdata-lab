/**
 * Created by Darren Tarrant on 13/04/2016.
 */
(function() {
    "use strict";

    var app = angular.module('abcApp');

    app.controller('abcCreateContactCtrl', [
        '$scope',
        '$uibModalInstance',
        'abcContactServ',
        function ($scope, $uibModalInstance, abcContactServ) {

            $scope.data = {
                name: undefined
            };

            // users clicked the create button - close with the new name
            $scope.create = function() {
                $uibModalInstance.close($scope.data.name);
            };

        }
    ]);

})();