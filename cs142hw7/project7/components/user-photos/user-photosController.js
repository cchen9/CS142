'use strict';

/*
cs142App.controller('UserPhotosController', ['$scope', '$routeParams',
  function($scope, $routeParams) {
    var userId = $routeParams.userId;
    $scope.userPhotos = window.cs142models.photoOfUserModel($routeParams.userId);
    $scope.user = window.cs142models.userModel($routeParams.userId);
    var right_toolbar_photos = 'Photos of ';
    right_toolbar_photos += $scope.user.first_name;
    right_toolbar_photos += ' ';
    right_toolbar_photos += $scope.user.last_name;
    $scope.main.right_toolbar = right_toolbar_photos;
    console.log('UserPhoto of ', $routeParams.userId);

    console.log('window.cs142models.photoOfUserModel($routeParams.userId)',
       window.cs142models.photoOfUserModel(userId));
  }]);
*/

cs142App.controller('UserPhotosController', ['$scope', '$routeParams','$resource', '$rootScope',
  function($scope, $routeParams, $resource, $rootScope) {
    /*
     * Since the route is specified as '/photos/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     */
      var Photos = $resource('/photosOfUser/:userId', {userId:'@id'});
      var dataPhotos = Photos.query({userId:$routeParams.userId}).$promise.then(function(dataPhotos){
        //$scope.userPhotos = dataPhotos;
        console.log("Updating rootScope.userPhotos");
        $rootScope.userPhotos = dataPhotos;
      }).catch(function(err){
        console.log("Updating rootScope.userPhotos in catch");
        $rootScope.userPhotos = [];
      });
      console.log("There are the photos I'm displaying!");
      console.log($rootScope.userPhotos);


      $scope.addComment2Box = function(photo_id, comment) {
        console.log("We found a comment with the following text: " + comment);
        var AddCommentResource = $resource('/commentsOfPhoto/' + photo_id);
        AddCommentResource.save({comment: comment}, function (comment_result) {
          console.log('Posting comment for photo with id ' + photo_id + ' succeeded!');
          console.log(comment_result);
          var updatedPhotos = $resource('/photosOfUser/:userId', {userId:'@id'});
          var updateddataPhotos = Photos.query({userId:$routeParams.userId}, function(dataPhotos){
            $rootScope.userPhotos = updateddataPhotos;
          });
        }, function errorHandling(err) {
          console.log('Posting comment for photo with id ' + photo_id + ' failed!');
        });
      };

      var User = $resource('/user/:userId', {userId:'@id'});
      var data = User.get({userId:$routeParams.userId}, function(data){
        $scope.user = data;
        var right_toolbar_photos = 'Photos of ';
        right_toolbar_photos += $scope.user.first_name;
        right_toolbar_photos += ' ';
        right_toolbar_photos += $scope.user.last_name;
        $scope.main.right_toolbar = right_toolbar_photos;
      });

   /*
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

   $scope.doneCallbackPhotos = function(data) {
      $scope.$apply(function () {
        $scope.userPhotos = data;
      });};

  $scope.doneCallbackUser = function(data) {
     $scope.$apply(function () {
       $scope.user = data;
       var right_toolbar_photos = 'Photos of ';
       right_toolbar_photos += $scope.user.first_name;
       right_toolbar_photos += ' ';
       right_toolbar_photos += $scope.user.last_name;
       $scope.main.right_toolbar = right_toolbar_photos;
     });};

   $scope.FetchModel('photosOfUser/' + $routeParams.userId, $scope.doneCallbackPhotos);
   $scope.FetchModel('user/' + $routeParams.userId, $scope.doneCallbackUser);
   */
  }]);
