'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource']);

cs142App.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/login-register', {
              templateUrl: 'components/login-register/login-registerTemplate.html',
              controller: 'login-registerController'
            }).
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

cs142App.controller('MainController', ['$scope', '$resource', '$rootScope', '$location', '$http',
    function ($scope, $resource, $rootScope, $location, $http) {
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
          if ($rootScope.current_user) {
            console.log("No redirecting needed!");
          }
          else {
            // no logged user, redirect to /login-register unless already there
            if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
              $location.path("/login-register");
            }
          }
        });

        var selectedPhotoFile; // Holds the last file selected by the user

        // Called on file selection - we simply save a reference to the file in selectedPhotoFile
        $scope.inputFileNameChanged = function (element) {
          selectedPhotoFile = element.files[0];
        };

        // Has the user selected a file?
        $scope.inputFileNameSelected = function() {
          return !!selectedPhotoFile;
        };

        // Upload the photo file selected by the user using a post request to the URL /photos/ew
        $scope.uploadPhoto = function() {
            if (!$scope.inputFileNameSelected()) {
              console.error("uploadPhoto called will no selected file");
              return;
            }
            console.log('fileSubmitted', selectedPhotoFile);
            // Create a DOM form and add the file to it under the name uploadedphoto
            var domForm = new FormData();
            domForm.append('uploadedphoto', selectedPhotoFile);

            // Using $http to POST the form
            $http.post('/photos/new', domForm, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).then(function successCallback(response){
            // The photo was successfully uploaded. XXX - Do whatever you want on success.
                console.log('Added photo was successfully uploaded!');
                // Update the userPhotos object that will be displayed on the page!
                var Photos = $resource('/photosOfUser/:userId', {userId:'@id'});
                var dataPhotos = Photos.query({userId:$rootScope.current_user._id}, function(dataPhotos){
                  $rootScope.userPhotos = dataPhotos;
                });
            }, function errorCallback(response){
            // Couldn't upload the photo. XXX  - Do whatever you want on failure.
                console.error('ERROR uploading photo', response);
            });
        };

        $rootScope.$watch('current_user', function(newValue, oldValue, scope) {
          if ((oldValue === null || oldValue === undefined || oldValue === '') && newValue) {
            scope.$broadcast('log-in occurred');
            scope.loginMessage = "Hi " + $rootScope.current_user.first_name;
            var Version = $resource("/test/info");
            var data = Version.get({}, function(data){
                $scope.vInfo = 'Version is ' + data.version + '.';
            });
          }
          if (oldValue && (newValue === undefined || newValue === null || newValue === '')) {
            scope.$broadcast('log-out occurred');
            scope.loginMessage = "Please login!";
            $location.path("/login-register");
            $rootScope.loginFailureMessage = '';
            $rootScope.registerFailureMessage = '';
            $scope.main.right_toolbar = '';
            $scope.vInfo = '';
          }
        });

        $scope.main = {};
        $scope.main.title = 'Users';
        $scope.main.right_toolbar = '';
        $scope.LogoutButton = function() {
          $rootScope.current_user = null;
          var LogoutResource = $resource('/admin/logout');
          LogoutResource.save({}, function(error){
              console.log("Front end detected this error with logout: " + error);
            });
        };
        /*
        var Version = $resource("/test/info");
        var data = Version.get({}, function(data){
            $scope.vInfo = 'Version is ' + data.version + '.';
        });
        */
}]);
