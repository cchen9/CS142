'use strict';
/*
cs142App.controller('UserDetailController', ['$scope', '$routeParams',
  function ($scope, $routeParams) {
    var userId = $routeParams.userId;
    $scope.user = window.cs142models.userModel($routeParams.userId);
    var right_toolbar = $scope.user.first_name;
    right_toolbar += ' ';
    right_toolbar += $scope.user.last_name;
    $scope.main.right_toolbar = right_toolbar;
    console.log('UserDetail of ', userId);

    console.log('window.cs142models.userModel($routeParams.userId)',
        window.cs142models.userModel(userId));

  }]);
*/
  cs142App.controller('UserDetailController', ['$scope', '$routeParams',
    function ($scope, $routeParams) {
      /*
       * Since the route is specified as '/users/:userId' in $routeProvider config the
       * $routeParams  should have the userId property set with the path from the URL.
       */

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
           $scope.user = data;
           var right_toolbar = $scope.user.first_name;
           right_toolbar += ' ';
           right_toolbar += $scope.user.last_name;
           $scope.main.right_toolbar = right_toolbar;
         });};

      $scope.FetchModel('user/' + $routeParams.userId, $scope.doneCallback);
    }]);
