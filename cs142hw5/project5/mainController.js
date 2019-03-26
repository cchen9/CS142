'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/users', {
                templateUrl: 'components/user-list/user-listTemplate.html',
                controller: 'UserListController'
            }).
            when('/users/:userId', {
                templateUrl: 'components/user-detail/user-detailTemplate.html',
                controller: 'UserDetailController'
            }).
            when('/photos/:userId', {
                templateUrl: 'components/user-photos/user-photosTemplate.html',
                controller: 'UserPhotosController'
            }).
            otherwise({
                redirectTo: '/users'
            });
    }]);

cs142App.controller('MainController', ['$scope',
    function ($scope) {
        $scope.main = {};
        $scope.main.title = 'Users';
        $scope.main.right_toolbar = '';
        $scope.FetchModel = function(url, doneCallback){
          var XHR = new XMLHttpRequest();
          XHR.onreadystatechange = function(){
            if (XHR.readyState !== 4) { return;}
            if (XHR.status !== 200) { return;}
            var data = JSON.parse(XHR.responseText);
            doneCallback(data);
          };
          XHR.open('GET', url);
          XHR.send();
        };

     $scope.doneCallback = function(data) {
        $scope.$apply(function () {
          $scope.vInfo = 'The current version is ' + data.__v + '.';
        });};

     $scope.FetchModel('test/info', $scope.doneCallback);
}]);
