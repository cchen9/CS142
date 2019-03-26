"use strict";

/**
 * Create an angular module called 'cs142App' and assign it to a DOM property with the same name.
 * The [] argument specifies module is to be created and doesn't require any other module.
 */
var cs142App = angular.module('cs142App', ['ngRoute']);
//var cs142App = angular.module('cs142App', []);

/**
 * Create a controller named 'MainController'.  The array argument specifies the controller
 * function and what dependencies it has.  We specify the '$scope' service so we can have access
 * to the angular scope of view template.
 */
cs142App.controller('MainController', ['$scope', function($scope) {
   // We defined an object called 'main' with a single property 'title' that is used
   // by the html view template to get the page's title in the browser tab.
   $scope.main = {};
   $scope.main.title = 'CS142 Project #4';
   //https://stackoverflow.com/questions/16928341/update-parent-scope-variable-in-angular
   $scope.main.motto = '';
   $scope.main.name = '';

   $scope.main.state0 = {};
   $scope.main.state0.exampleview = true;
   $scope.main.state0.statesview = false;
   $scope.main.state0.nextView = 'states';

   $scope.main.state1 = {};
   $scope.main.state1.exampleview = false;
   $scope.main.state1.statesview = true;
   $scope.main.state1.nextView = 'example';

   $scope.main.state = {};
   $scope.main.stateNo = 0;
   $scope.main.state.exampleview = $scope.main.state0.exampleview;
   $scope.main.state.statesview = $scope.main.state0.statesview;
   $scope.main.state.nextView = $scope.main.state0.nextView;

   $scope.buttonClick = function(){
     if ($scope.main.stateNo === 0){
       $scope.main.stateNo = 1;
       $scope.main.state.exampleview = $scope.main.state1.exampleview;
       $scope.main.state.statesview = $scope.main.state1.statesview;
       $scope.main.state.nextView = $scope.main.state1.nextView;
     }
     else if ($scope.main.stateNo === 1){
       $scope.main.stateNo = 0;
       $scope.main.state.exampleview = $scope.main.state0.exampleview;
       $scope.main.state.statesview = $scope.main.state0.statesview;
       $scope.main.state.nextView = $scope.main.state0.nextView;
     }
   };


}]);

cs142App.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/example', {
        templateUrl: 'components/example/exampleTemplate.html',
        controller: 'ExampleController'
      }).
      when('/states', {
        templateUrl: 'components/states/statesTemplate.html',
        controller: 'StatesController'
      }).
      otherwise({
        redirectTo: '/example'
      });
  }]);
