/**
 * Created by Darren Tarrant on 12/04/2016.
 *
 * The header directive...
 */
(function() {

    var app = angular.module('abcApp');

    app.directive('abcHeader', [
        'abcContactServ',
        '$timeout',
        '$rootScope',
        function(abcContactServ, $timeout, $rootScope) {
            return {
                restrict: 'E',
                replace: true,
                controller: ['$scope', function($scope) {

                    $scope.data = {
                        searchTerm: '',
                        isOpen: false,
                        results: []
                    };

                    var searchTimer;

                    $scope.onKeyPress = function($event) {

                        // is it enter and do we have a search term?
                        if ( $event.keyCode == 13 && $scope.data.searchTerm.length > 0 ) {

                            $scope.data.isOpen = false; // make sure the dropdown closes
                            $scope.doSearch();
                        }
                    };

                    // the user has clicked the search button or the search with panel in the dropdown
                    $scope.doSearch = function() {

                        if ( $scope.data.searchTerm.length > 0 ) {
                            // broadcast on the root scope that a search is wanted
                            $rootScope.$broadcast('doSearch', $scope.data.searchTerm);
                        }
                    };

                    // the user has clicked a result in our search dropdown
                    $scope.showContact = function(contact) {

                        // set the search term to the full name and then open call the service to show this contact details
                        $scope.data.searchTerm = contact.name;

                        abcContactServ.showContact(contact);

                    };

                    // called by the dropdown directive whenever its open state changes
                    $scope.toggleOpen = function(open) {

                        // if it's no open - clear the search results
                        if ( open === false ) {
                            $scope.data.results = [];
                        }
                    };

                    // called when the search box text is changed
                    $scope.searchChanged = function() {

                        if ( angular.isDefined(searchTimer) ) {
                            $timeout.cancel(searchTimer);
                        }

                        if ( !angular.isDefined($scope.data.searchTerm) || $scope.data.searchTerm.length === 0 ) {

                            // close it
                            $scope.data.isOpen = false;

                        } else {

                            // open it and start a search
                            $scope.data.isOpen = true;

                            searchTimer = $timeout(function() {

                                abcContactServ.getContacts($scope.data.searchTerm).then(

                                    function(contacts) {
                                        $scope.data.results = contacts;
                                    }
                                );

                            }, 300);
                        }
                    };

                    // listens to broadcasts on the root scope informing us the user has clicked a filter in the listings
                    $rootScope.$on('listFilterApplied', function() {

                        // clear any search or results we may have
                        $scope.data.searchTerm = '';
                        $scope.data.results = [];
                    });

                }],
                templateUrl: 'abcHeader/abcHeader-tpl.html'
            };
        }
    ]);
})();