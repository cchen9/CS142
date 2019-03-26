'use strict';
/**
 * Define StatesController for the states component of CS142 project #4
 * problem #2.  The model data for this view (the states) is available
 * at window.cs142models.statesModel().
 */

cs142App.controller('StatesController', ['$scope', function($scope) {

   // Replace this with the code for CS142 Project #4, Problem #2
   console.log('window.cs142models.statesModel()', window.cs142models.statesModel());

   $scope.textInput = '';
   $scope.statesList = window.cs142models.statesModel();

   $scope.statesButtonFilter = function(substr) {
     if (!substr || substr.length === 0){
       $scope.filtered = $scope.statesList;
       return;
     }
     $scope.filtered = [];
      var statesListLength = $scope.statesList.length;
      for (var i = 0; i < statesListLength; i++){
        if ($scope.statesList[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1){
          $scope.filtered.push($scope.statesList[i]);
        }
      }
      if ($scope.filtered.length === 0){
        $scope.filtered = ["No matches were found!"];
      }
   };

}]);
