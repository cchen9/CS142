'use strict';

var cs142App = angular.module('cs142App', ['ngRoute', 'ngMaterial', 'ngResource', 'angular-thumbnails']);

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
            alert("Welcome " + $rootScope.current_user.first_name + "! " + "If you wish to upload a photo, first select an image file from the CHOOSE FILE button. Afterwards, follow the instructions that will pop up.");
            var userlisthResource = $resource('/userloginnames');
            userlisthResource.query({}, function(datah){
              var datahcp = datah.slice(0);
              $scope.userlisth = datahcp.map(user => user.login_name);
              $rootScope.usercheckboxarray = [];
              console.log("Starting datah from server looks like: " + datah);
              for (var i = 0; i < datah.length; i++){
                var newobj = {login_name: datah[i].login_name, checked: false};
                $rootScope.usercheckboxarray = $rootScope.usercheckboxarray.concat([newobj]);
              }
              //$rootScope.usercheckboxarray = datah.forEach(function(obj){obj.checked = false;});
              console.log("My usercheckboxarray initially: " + $rootScope.usercheckboxarray[0] + " " + $rootScope.usercheckboxarray[0].checked + " " + $rootScope.usercheckboxarray[0].login_name);
            });
          }

          if (!$rootScope.current_user) {
            // no logged user, redirect to /login-register unless already there
            if (next.templateUrl !== "components/login-register/login-registerTemplate.html") {
              $location.path("/login-register");
            }
          }
        });

        var selectedPhotoFile; // Holds the last file selected by the user

        // Called on file selection - we simply save a reference to the file in selectedPhotoFile
        $scope.inputFileNameChanged = function (element) {
          /*
          var userlisthResource = $resource('/userloginnames');
          userlisthResource.query({}, function(datah){
            var datahcp = datah.slice(0);
            $scope.userlisth = datahcp.map(user => user.login_name);
            $rootScope.usercheckboxarray = [];
            console.log("Starting datah from server looks like: " + datah);
            for (var i = 0; i < datah.length; i++){
              var newobj = {login_name: datah[i].login_name, checked: false};
              $rootScope.usercheckboxarray = $rootScope.usercheckboxarray.concat([newobj]);
            }
            //$rootScope.usercheckboxarray = datah.forEach(function(obj){obj.checked = false;});
            console.log("My usercheckboxarray initially: " + $rootScope.usercheckboxarray[0] + " " + $rootScope.usercheckboxarray[0].checked + " " + $rootScope.usercheckboxarray[0].login_name);
          });
          */
          selectedPhotoFile = element.files[0];
          alert($rootScope.current_user.first_name + ", you have selected an input file. \n You now have the option to to specify a list of users (a sharing list) that can see the photo.");
          alert("If you wish to decline this option and specify no list, the photo will be visible to everyone.  To decline this option. Leave the box labeled SPECIFY SHARING LIST unchecked and press the ADD PHOTO button to upload the photo.");
          alert("However, if you wish to associate a sharing list with this photo, leave the box labeled SPECIFY SHARING LIST checked. If the selected photo has a sharing list associated with it, only the owner of the photo and those on the list can see it.");
          alert("To select users for the sharing list, check those boxes labeled with login names of users who you wish to see the uploaded photo.  If at this point you do not check any user boxes your sharing list will be empty and only you can see the uploaded photo.");
          alert("After selecting the users for the sharing list, press the ADD PHOTO button to upload the photo.");
        };

        // Has the user selected a file?
        $scope.inputFileNameSelected = function() {
          return !!selectedPhotoFile;
        };

        $scope.clearVisibility = function(){
          $scope.visibleuser = [];
          $rootScope.displayuser = $scope.visibleuser;
        };

        // Upload the photo file selected by the user using a post request to the URL /photos/ew
        $scope.uploadPhoto = function() {
            if (!$scope.inputFileNameSelected()) {
              alert("You have called uploadPhoto with no selected file. That does not work! Please select a file first with the CHOOSE FILE button in the toolbar!");
              console.error("uploadPhoto called with no selected file");
              return;
            }

            if (!$scope.specifysharinglist)
            {
              $scope.visibleuser = $scope.userlisth.slice(0);
              console.log("I am not specifying a sharing list");
              console.log('fileSubmitted', selectedPhotoFile);
              console.log('visible user: ' + $scope.visibleuser);
            }
            else
            {
              var unselectedusers = $rootScope.usercheckboxarray.filter(
                function(user)
                {
                  if (user.checked) {
                    return false;
                  }
                  else
                  {
                    return true;
                  }
                });

              var selectedusers = $rootScope.usercheckboxarray.filter(function(user){return user.checked;});
              if (!selectedusers || selectedusers.length === 0){
                $scope.visibleuser = [];
              }
              else {
                console.log("Checked user objects: " + selectedusers);
                var procselected = selectedusers.map(user => user.login_name);
                console.log("My filtered array of checked users is: " + procselected);
                $scope.visibleuser = procselected;
              }
            }
            /*
            for (var i = 0; i < $scope.visibleuser.length; i++){
              if ($scope.visibleuser[i].hasOwnProperty('login_name')){
                $scope.visibleuser[i] = $scope.visibleuser[i].login_name;
              }
            }
            */
            // Create a DOM form and add the file to it under the name uploadedphoto
            console.log('rehashed visible user: ' + $scope.visibleuser);
            $rootScope.displayuser = $scope.visibleuser;
            var domForm = new FormData();
            domForm.append('uploadedphoto', selectedPhotoFile);
            domForm.append('visibility', $scope.visibleuser);
            console.log("DomForm: " + domForm);
            //domForm.append('visibility', names);
            // Using $http to POST the form
            $http.post('/photos/new', domForm, {
              transformRequest: angular.identity,
              headers: {'Content-Type': undefined}
            }).then(function successCallback(response){
            // The photo was successfully uploaded. XXX - Do whatever you want on success.
                $scope.selectvisibility = true;
                console.log('Added photo was successfully uploaded!');
                $rootScope.$broadcast('uploaded photo');
                alert("You have successfully uploaded photo. There are " + $rootScope.displayuser.length + " people (other than yourself) who can see this photo.\n The sharing list is the following: " + $rootScope.displayuser);
                alert("To upload the same photo with the same sharing list selections, click on the ADD PHOTO button directly.");
                alert("To upload the same photo with different sharing list selections, make modifications to the SPECIFY SHARING LIST checkbox and the checkboxes labeled with login_names of users as needed before clicking the ADD PHOTO button.");
                alert("To upload a different photo, start again by pressing the CHOOSE FILE button to start the process again and continue following instructions as given.");
            }, function errorCallback(response){
            // Couldn't upload the photo. XXX  - Do whatever you want on failure.
                console.error('ERROR uploading photo', response);
                alert("ERROR uploading photo");
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
            //scope.$broadcast('log-out occurred');
            scope.loginMessage = "Please login!";
            //$location.path("/login-register");
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
          $rootScope.$broadcast('log-out occurred');
          var LogoutResource = $resource('/admin/logout');
          $scope.userlisth = null;
          $rootScope.displayuser = null;
          $rootScope.usercheckboxarray = null;
          LogoutResource.save({}, function(error){
              console.log("Front end detected this error with logout: " + error);
            });
          $location.path("/login-register");
        };
        /*
        var Version = $resource("/test/info");
        var data = Version.get({}, function(data){
            $scope.vInfo = 'Version is ' + data.version + '.';
        });
        */
}]);
