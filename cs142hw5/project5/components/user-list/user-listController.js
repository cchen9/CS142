'use strict';
/*
cs142App.controller('UserListController', ['$scope',
    function ($scope) {
        $scope.main.title = 'Users';
        $scope.userlist = window.cs142models.userListModel();
        console.log('window.cs142models.userListModel()', window.cs142models.userListModel());
    }]);
*/

cs142App.controller('UserListController', ['$scope',
    function ($scope) {
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
         $scope.userlist = data;
       });};

    $scope.FetchModel('user/list', $scope.doneCallback);
  }]);
