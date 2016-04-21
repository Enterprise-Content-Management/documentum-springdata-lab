/**
 * Created by Darren Tarrant on 13/04/2016.
 *
 * the controller for the contact details modal
 */
(function() {
    "use strict";

    var app = angular.module('abcApp');

    app.controller('abcContactDetailsCtrl', [
        '$scope',
        '$rootScope',
        'data',
        '$uibModalInstance',
        'GROUP_NAMES',
        'abcContactServ',
        function ($scope, $rootScope, data, $uibModalInstance, GROUP_NAMES, abcContactServ) {

            $scope.data = {
                contact: data.contact,
                inEdit: false,
                editCopy: undefined,
                groups: GROUP_NAMES,
                isNew: false
            };

            // handles the selection of a photo and calls the service to upload it
            $scope.onImageSelected =function(files) {

                // did we get a file?
                if ( files.length > 0 ) {

                    // call the service to upload it
                    abcContactServ.uploadContactPhoto($scope.data.contact, files[0]).then(

                        function(updated) {
                            $scope.data.contact = updated;
                        },

                        function(error) {

                        }
                    );
                }
            };

            // users clicked on the delete button
            $scope.deleteContact = function() {

                abcContactServ.deleteContact($scope.data.contact).then(

                    function() {
                        // nothing to do here expect close the modal
                        $uibModalInstance.dismiss();
                    },

                    function(error) {

                    }
                );
            };

            // applies any changes to the contact
            $scope.saveEdits = function() {

                // call the server, in the meantime make sure no buttons etc can be clicked
                $scope.data.disabled = true;

                if ( $scope.data.isNew !== true ) {

                    // this is an existing contact so just update it
                    abcContactServ.updateContact(angular.copy($scope.data.editCopy)).then(
                        function (contact) {

                            // make this our main contact and stop editing
                            $scope.data.contact = contact;
                            $scope.data.editCopy = undefined;
                            $scope.data.inEdit = false;
                            $scope.data.disabled = false;

                        },

                        function (error) {

                        }
                    );

                } else {

                    // this is a new contact so call for it to be added
                    // this is an existing contact so just update it
                    abcContactServ.createContact(angular.copy($scope.data.editCopy)).then(
                        function (contact) {

                            // make this our main contact and stop editing
                            $scope.data.contact = contact;
                            $scope.data.editCopy = undefined;
                            $scope.data.inEdit = false;
                            $scope.data.disabled = false;
                            $scope.data.isNew = false;

                        },

                        function (error) {

                        }
                    );

                }
            };

            // stops editing and returns to read view
            $scope.stopEditing = function() {

                if ( $scope.data.isNew === true ) {

                    // when it's a new contact we just discard the modal
                    $uibModalInstance.dismiss();

                } else {
                    $scope.data.editCopy = undefined;
                    $scope.data.inEdit = false;
                }
            };

            // starts editing for the contact
            $scope.startEditing = function() {

                // make a copy to edit with
                $scope.data.editCopy = angular.copy($scope.data.contact);

                $scope.data.inEdit = true;
            };

            // returns a comma delimited string of the contacts groups
            $scope.getGroupsList = function() {
                return $scope.data.contact.groups.join(", ");
            };

            // returns true if the contact is in a group
            $scope.isInGroup = function(group) {

                if ( $scope.data.contact.groups.length === 0 ) {
                    return false;
                }

                return $scope.data.contact.groups.indexOf(group) != -1;
            };

            // adds or removes the contact to/from groups
            $scope.toggleGroup = function(group) {

                // is he in it?
                if ( $scope.isInGroup(group) !== true ) {

                    abcContactServ.addToGroup(angular.copy($scope.data.contact), group).then(

                        function(updated) {
                            // steal the groups
                            $scope.data.contact.groups = updated.groups;

                        },

                        function(error) {
                            // deal with it
                        }
                    );

                } else {

                    abcContactServ.removeFromGroup(angular.copy($scope.data.contact), group).then(

                        function(updated) {
                            // steal the groups
                            $scope.data.contact.groups = updated.groups;

                        },

                        function(error) {
                            // deal with it
                        }
                    );
                }

            };

            // start us editing if we've been asked to
            if ( data.edit === true ) {
                $scope.startEditing();

                // also if we've been told the contact is new
                if ( data.isNew === true ) {
                    $scope.data.isNew = true;
                }
            }
        }
    ]);

})();