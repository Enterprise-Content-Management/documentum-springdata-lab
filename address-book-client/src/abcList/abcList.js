/**
 * Created by Darren Tarrant on 12/04/2016.
 */
(function() {
    "use strict";

    var app = angular.module('abcApp');

    app.directive('abcList', [
        '$rootScope',
        'abcContactServ',
        'GROUP_NAMES',
        function($rootScope, abcContactServ, GROUP_NAMES) {
            return {
                restrict: 'E',
                replace: true,
                controller: ['$scope', function($scope) {

                    $scope.data = {
                        filter: 'all',
                        groups: GROUP_NAMES,
                        contacts: [],
                        state: 'none'
                    };

                    // the user has clicked the add button
                    $scope.addContact = function() {
                        // call the service
                        abcContactServ.startCreateContact();
                    };

                    // users clicked on the delete button for a contact
                    $scope.deleteContact = function(contact) {

                        abcContactServ.deleteContact(contact).then(

                            // nothing to on success as we'll be told via a broadcast anyway
                            function() {},

                            function(error) {

                            }
                        );
                    };

                    // the user has clicked a contact row - show its details
                    $scope.showContact = function(contact, asEdit) {

                        // call the service to show it
                        abcContactServ.showContact(contact, asEdit);
                    };

                    // helper function for getting all or searching contacts
                    var getContacts = function(withTerm) {

                        $scope.data.state = 'getting';

                        abcContactServ.getContacts(withTerm).then(

                            function(contacts) {

                                $scope.data.contacts = contacts;

                                if ( !angular.isDefined(withTerm) ) {
                                    $scope.data.state = 'got';
                                } else {
                                    $scope.data.state = 'found';
                                }
                            },

                            function(error) {
                                $scope.data.state = 'error';
                            }
                        );

                    };

                    // the user has clicked all contacts filter
                    $scope.showAll = function() {

                        $scope.data.filter = 'all';

                        // tell anyone who cares this has happened
                        $rootScope.$broadcast('listFilterApplied');

                        // get contacts
                        getContacts();
                    };

                    // the user has clicked a group filter
                    $scope.showGroup = function(grp) {

                        $scope.data.filter = grp;

                        // tell anyone who cares this has happened
                        $rootScope.$broadcast('listFilterApplied');

                        // get contacts by group
                        $scope.data.state = 'getting';

                        abcContactServ.getContactsByGroup(grp).then(

                            function(contacts) {
                                $scope.data.contacts = contacts;
                                $scope.data.state = 'got';
                            },

                            function(error) {
                                $scope.data.state = 'error';
                            }
                        );
                    };

                    // start by getting all contacts
                    getContacts();

                    // this tells us that a search has been requested by another directive
                    $rootScope.$on('doSearch', function(e, term) {

                        // set the term as the filter - that'll make no filters selected and make the filter show
                        // in the list prompt
                        $scope.data.filter = term;

                        // get contacts
                        getContacts(term);

                    });

                    // this tells us that a contact has had a change group - this may affect us if we're showing this group
                    $rootScope.$on('contactGroupChange', function(e, contact, group) {

                        if ( group == $scope.data.filter ) {
                            // refetch the contacts
                            $scope.showGroup(group);
                        }

                    });

                    // this tells us a contact has been updated
                    $rootScope.$on('contactUpdated', function(e, contact) {

                        // do we have this contact in our list?
                        var index;
                        for ( var i=0; i<$scope.data.contacts.length; i++ ) {
                            if ( contact.id == $scope.data.contacts[i].id ) {
                                index = i;
                                break;
                            }
                        }

                        if ( angular.isDefined(index) ) {

                            // update this entry
                            $scope.data.contacts[index] = contact;
                        }

                    });

                    // this tells us a contact has been deleted
                    $rootScope.$on('contactDeleted', function(e, contact) {

                        // do we have this contact in our list?
                        var index;
                        for ( var i=0; i<$scope.data.contacts.length; i++ ) {
                            if ( contact.id == $scope.data.contacts[i].id ) {
                                index = i;
                                break;
                            }
                        }

                        if ( angular.isDefined(index) ) {

                            // remove this entry
                            $scope.data.contacts.splice(index, 1);
                        }

                    });

                    // this tells us that a new contact has been created - call off for contacts again
                    $rootScope.$on('contactCreated', function(e, contact) {

                        // we need to figure out which way to re-populate the list
                        if ( $scope.data.state == 'found' ) {

                            // redo the search
                            getContacts($scope.data.filter);

                        } else {

                            if ( $scope.data.filter == 'all' ) {

                                // get all contacts
                                getContacts();

                            } else {

                                // we're showing with a group - redo it
                                $scope.showGroup($scope.data.filter);
                            }
                        }

                    });

                }],
                templateUrl: 'abcList/abcList-tpl.html'
            };
        }
    ]);
})();