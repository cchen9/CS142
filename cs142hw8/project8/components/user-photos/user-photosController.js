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
     $scope.$on('uploaded photo', function() {
       var Photos = $resource('/photosOfUser/:userId', {userId:'@id'});
       var dataPhotos = Photos.query({userId:$routeParams.userId}).$promise.then(function(dataPhotos){
         //$scope.userPhotos = dataPhotos;
         console.log("Updating scope.userPhotos");
         dataPhotos = $scope.sortPhotos(dataPhotos);
         $scope.userPhotos = dataPhotos;
       }).catch(function(err){
         console.log("Updating scope.userPhotos in catch");
         $scope.userPhotos = [];
       });
       console.log("There are the photos I'm displaying!");
       console.log($scope.userPhotos);
     });

     $scope.sortPhotos = function(photos){
       console.log("trying to sort!");
              photos.sort(function(a, b){
                                        var a_likes = a.likes.length;
                                        var b_likes = b.likes.length;
                                        if (a_likes === b_likes) {
                                          console.log("a.date_time: " + a.date_time);
                                          console.log("b.date_time: " + b.date_time);

                                          if (a.date_time < b.date_time) {console.log(1); return 1;}
                                          if (a.date_time > b.date_time) {console.log(-1); return -1;}
                                          console.log(0); return 0;
                                        }
                                        else {
                                          console.log("a_likes: " + a_likes);
                                          console.log("b_likes: " + b_likes);
                                          if (a_likes < b_likes) {
                                            console.log(1);
                                            return 1;
                                          }
                                          if (a_likes > b_likes) {
                                            console.log(-1);
                                            return -1;
                                          }
                                          console.log(0);
                                          return 0;
                                        }
                                      });
            return photos;
     };

      $scope.current_uid = $rootScope.current_user._id;
      var Photos = $resource('/photosOfUser/:userId', {userId:'@id'});
      var dataPhotos = Photos.query({userId:$routeParams.userId}).$promise.then(function(dataPhotos){
        //$scope.userPhotos = dataPhotos;
        console.log("Updating scope.userPhotos");
        dataPhotos = $scope.sortPhotos(dataPhotos);
        $scope.userPhotos = dataPhotos;
      }).catch(function(err){
        console.log("Updating scope.userPhotos in catch");
        $scope.userPhotos = [];
      });
      console.log("There are the photos I'm displaying!");
      console.log($scope.userPhotos);


      $scope.addComment2Box = function(photo_id, comment) {
        console.log("We found a comment with the following text: " + comment);
        var AddCommentResource = $resource('/commentsOfPhoto/' + photo_id);
        AddCommentResource.save({comment: comment}, function (comment_result) {
          console.log('Posting comment for photo with id ' + photo_id + ' succeeded!');
          console.log(comment_result);
          var updatedPhotos = $resource('/photosOfUser/:userId', {userId:'@id'});
          var updateddataPhotos = Photos.query({userId:$routeParams.userId}, function(updateddataPhotos){
            updateddataPhotos = $scope.sortPhotos(updateddataPhotos);
            $scope.userPhotos = updateddataPhotos;
          });
        }, function errorHandling(err) {
          console.log('Posting comment for photo with id ' + photo_id + ' failed!');
        });
      };


      $scope.LikePhoto = function(photo_id){
        var LikePhotoResource = $resource('/likePhoto/' + photo_id);
        LikePhotoResource.save({}, function(like_result) {
          console.log('Posting like/unlike for photo with id ' + photo_id + ' succeeded!');
          console.log(like_result);
          var updatedPhotos = $resource('/photosOfUser/:userId', {userId: '@id'});
          var updateddataPhotos = Photos.query({userId:$routeParams.userId}, function(updateddataPhotos){
            updateddataPhotos = $scope.sortPhotos(updateddataPhotos);
            $scope.userPhotos = updateddataPhotos;
          });
        }, function errorHandling(err){
          console.log('Posting like/unlike for photo with id ' + photo_id + ' failed!');
        });
      };

      $scope.canRemovePhoto = function(photo_user_id) {
        if ($rootScope.current_user) {
          console.log("photo_user_id: " + photo_user_id);
          console.log("logged in user: " + $rootScope.current_user._id);
          if (String(photo_user_id) === String($rootScope.current_user._id)) {
            return true;
          }
          return false;
        }
        else {
          return false;
        }
      };

      $scope.removePhoto = function(photo_id){
        var RemovePhotoResource = $resource('/removePhoto/' + photo_id);
        RemovePhotoResource.save({}, function (remove_result) {
          var updatedPhotos = $resource('/photosOfUser/:userId', {userId: '@id'});
          var updateddataPhotos = Photos.query({userId:$routeParams.userId}, function(updateddataPhotos){
            updateddataPhotos = $scope.sortPhotos(updateddataPhotos);
            $scope.userPhotos = updateddataPhotos;
          });
        }, function errorHandling(err){
          console.log('Removing the photo with id ' + photo_id + ' failed!');
        });
      };

      $scope.canRemoveComment = function(comment_id){
        if ($rootScope.current_user) {
          console.log("comment_id is: " + comment_id);

          console.log("logged in user: " + $rootScope.current_user._id);
          if (String(comment_id) === String($rootScope.current_user._id)) {

            return true;
          }
          return false;
        }
        else {
          return false;
        }
      };

      $scope.removeComment = function(commentObject, photo_id) {
        console.log("Inside removeComment for comment: " + commentObject);
        var RemoveCommentResource = $resource('/removeComment/' + photo_id);
        RemoveCommentResource.save({commentObject: commentObject}, function(remove_comment_result) {
          console.log('Removing comment for photo with id ' + photo_id + ' succeeded!');
          console.log(remove_comment_result);
          var updatedPhotos = $resource('/photosOfUser/:userId', {userId:'@id'});
          var updateddataPhotos = Photos.query({userId:$routeParams.userId}, function(updateddataPhotos){
            updateddataPhotos = $scope.sortPhotos(updateddataPhotos);
            $scope.userPhotos = updateddataPhotos;
          });
        }, function errorHandling(err) {
          console.log('Removing the comment: ' + commentObject + ' of photo with id ' + photo_id + ' failed!');
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
  }]);
