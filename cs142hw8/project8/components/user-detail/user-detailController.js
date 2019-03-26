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
  cs142App.controller('UserDetailController', ['$scope', '$routeParams','$resource', '$rootScope', '$location',
    function ($scope, $routeParams, $resource, $rootScope, $location) {
      /*
       * Since the route is specified as '/users/:userId' in $routeProvider config the
       * $routeParams  should have the userId property set with the path from the URL.
       */

        var User = $resource('/user/:userId', {userId:'@id'});
        var data = User.get({userId:$routeParams.userId}, function(data){
          $scope.user = data;
          var right_toolbar = $scope.user.first_name;
          right_toolbar += ' ';
          right_toolbar += $scope.user.last_name;
          $scope.main.right_toolbar = right_toolbar;
        });

        $scope.current_uid = $rootScope.current_user._id;
        $scope.removeUser = function(user_id){
          $scope.should_remove_user = window.confirm("You are about to delete your account. To delete your account, press OK, otherwise press Cancel!");
          if (!$scope.should_remove_user){
            return;
          }
          var DeleteUserResource = $resource('/removeuser/' + user_id);
          console.log("user_id in delete: " + user_id);
          DeleteUserResource.save({}, function (remove_result) {
            var User = $resource('/user/:userId', {userId:'@id'});
            var data = User.get({userId:$routeParams.userId}, function(data){
              $scope.user = data;
              $scope.mostrecentphoto = {};
              $scope.mostrecent_show = false;
              $scope.mostpopularphoto = {};
              $scope.mostpopular_show = false;
            });
            $rootScope.$broadcast('delete-user occurred');
            $rootScope.current_user = null;
            $rootScope.displayuser = null;
            //$scope.userlisth = null;
            $rootScope.usercheckboxarray = null;
            $location.path("/login-register");
          }, function errorHandling(err){
            console.log('Removing the user with id ' + user_id + ' failed!');
          });
        };

        $scope.$on('uploaded photo', function() {
          var MostRecentPhotoResource = $resource('/mostrecentphoto/:userId', {userId:'@id'});
          var mostrecent = MostRecentPhotoResource.get({userId:$routeParams.userId}, function(mostrecent) {

            if (mostrecent.file_name === undefined || mostrecent.file_name === null){
              console.log("here in userdetail controller!");
              $scope.mostrecentphoto = {};
              $scope.mostrecent_show = false;
              console.log($scope.mostrecentphoto);
            }
            else
            {
              $scope.mostrecent_show = true;
              console.log("user detail controller code!");
              console.log("most recent photo _id: " + mostrecent._id);
              console.log("most recent file_name: " + mostrecent.file_name);
              console.log("most recent user_id: " + mostrecent.user_id);
              console.log("comments: " + mostrecent.comments);
              console.log("date_time: " + mostrecent.date_time);
              console.log("most recent photo: " + mostrecent);
              $scope.mostrecentphoto = mostrecent;
            }
          });
          var MostPopularPhotoResource = $resource('/mostcomments/:userId', {userId:'@id'});
          var mostpopular = MostPopularPhotoResource.get({userId:$routeParams.userId}, function(mostpopular){
            if (mostpopular.file_name === undefined || mostpopular.file_name === null){
              console.log("here in userdetail controller!");
              $scope.mostpopularphoto = {};
              $scope.mostpopular_show = false;
              console.log($scope.mostpopularphoto);
            }
            else {
            $scope.mostpopular_show = true;
            console.log("most popular photo _id: " + mostpopular._id);
            console.log("most popular photo file_name: " + mostpopular.file_name);
            console.log("most popular photo's user_id: " + mostpopular.user_id);
            console.log("most popular photo's comments: " + mostpopular.comments);
            console.log("most popular photo's date_time: " + mostpopular.date_time);
            $scope.mostpopularphoto = mostpopular;
          }
          });
        });

        var MostRecentPhotoResource = $resource('/mostrecentphoto/:userId', {userId:'@id'});
        var mostrecent = MostRecentPhotoResource.get({userId:$routeParams.userId}, function(mostrecent) {

          if (mostrecent.file_name === undefined || mostrecent.file_name === null){
            console.log("here in userdetail controller!");
            $scope.mostrecentphoto = {};
            $scope.mostrecent_show = false;
            console.log($scope.mostrecentphoto);
          }
          else
          {
            $scope.mostrecent_show = true;
            console.log("user detail controller code!");
            console.log("most recent photo _id: " + mostrecent._id);
            console.log("most recent file_name: " + mostrecent.file_name);
            console.log("most recent user_id: " + mostrecent.user_id);
            console.log("comments: " + mostrecent.comments);
            console.log("date_time: " + mostrecent.date_time);
            console.log("most recent photo: " + mostrecent);
            $scope.mostrecentphoto = mostrecent;
          }
        });

        var MostPopularPhotoResource = $resource('/mostcomments/:userId', {userId:'@id'});
        var mostpopular = MostPopularPhotoResource.get({userId:$routeParams.userId}, function(mostpopular){
          if (mostpopular.file_name === undefined || mostpopular.file_name === null){
            console.log("here in userdetail controller!");
            $scope.mostpopularphoto = {};
            $scope.mostpopular_show = false;
            console.log($scope.mostpopularphoto);
          }
          else {
          $scope.mostpopular_show = true;
          console.log("most popular photo _id: " + mostpopular._id);
          console.log("most popular photo file_name: " + mostpopular.file_name);
          console.log("most popular photo's user_id: " + mostpopular.user_id);
          console.log("most popular photo's comments: " + mostpopular.comments);
          console.log("most popular photo's date_time: " + mostpopular.date_time);
          $scope.mostpopularphoto = mostpopular;
        }
        });
    }]);
