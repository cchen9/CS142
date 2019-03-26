'use strict';
/*
cs142App.controller('UserListController', ['$scope',
    function ($scope) {
        $scope.main.title = 'Users';
        $scope.userlist = window.cs142models.userListModel();
        console.log('window.cs142models.userListModel()', window.cs142models.userListModel());
    }]);
*/

cs142App.controller('UserListController', ['$scope', '$resource', '$rootScope',
    function ($scope, $resource, $rootScope) {
      var userlist = $resource('user/list');
      var data = userlist.query({}, function(data){
          $scope.userlist = data;
        });

      $scope.$on('log-in occurred', function() {
        var userlist = $resource('user/list');
        var data = userlist.query({}, function(data){
            $scope.userlist = data;
        });
      });

      $scope.$on('delete-account occurred', function(){
        var userlist = $resource('user/list');
        var data = userlist.query({}, function(data){
          $scope.userlist = data;
        });
      });
      
      $scope.$on('log-out occurred', function() {
        $scope.userlist = {};
        });
  }]);
