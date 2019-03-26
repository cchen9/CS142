'use strict';

  cs142App.controller('login-registerController', ['$scope', '$routeParams','$resource', '$rootScope', '$location', '$window',
  function ($scope, $routeParams, $resource, $rootScope, $location, $window) {
    /*
     * Since the route is specified as '/users/:userId' in $routeProvider config the
     * $routeParams  should have the userId property set with the path from the URL.
     * Resource.action([parameters], [success], [error])
     * Success callback is called with (value (Object | array), responseHeaders (Function), status (number), statusText (string))
     * arguments, where value is populated resource instance or collection object.  The error callback is called with
     * (httpResponse) argument.
     */
     $scope.textInput = '';
     $scope.passwordInput = '';
     $scope.passwordInput2 = '';
     $scope.buttonClick = function() {
        $scope.login_name = $scope.textInput;
        $scope.password = $scope.passwordInput;
        if (!$scope.login_name || !$scope.password) {
          $rootScope.loginFailureMessage = "At least one of the required fields is missing.";
          return;
        }
        console.log("Button was clicked and new login_name is: " + $scope.login_name + " and password: " + $scope.password);
        var LoginResource = $resource('/admin/login');
        LoginResource.save({login_name: $scope.login_name, password: $scope.password}, function(potential_user) {
          if (potential_user) {
            console.log("There exists a user with specified login_name and password in the database.");
            $rootScope.current_user = potential_user;
            $location.path('/users/' + $rootScope.current_user._id);
          }
          else {
            $rootScope.loginFailureMessage = "No user with specified login_name and password could be found. Try to login again.  If you are a new user, please register below.";
            console.log('No user with specified login_name and passowrd was found.');
            //$scope.no_existing_user = true;
          }
        }, function errorHandling(err) {
          console.log("Error was thrown by LoginResource.save");
          //$scope.no_existing_user = true;
          $rootScope.loginFailureMessage = "No user with specified login_name and password could be found. Try to login again.  If you are a new user, please register below.";
          //console.log('No user with specified login_name and password was found.');
        });
     };
     $scope.openRegistrationButton = function(){
         $scope.openRegistration = true;
     };
     $scope.registerbuttonClick = function() {
       $scope.login_name = $scope.textInputRegister;
       $scope.password = $scope.passwordInputRegister;
       $scope.password2 = $scope.password2InputRegister;
       $scope.firstname = $scope.firstnameInputRegister;
       $scope.lastname = $scope.lastnameInputRegister;
       $scope.location = $scope.locationInputRegister;
       $scope.description = $scope.descriptionInputRegister;
       $scope.occupation = $scope.occupationInputRegister;
       if (!$scope.login_name || !$scope.password || !$scope.password2 || !$scope.firstname || !$scope.lastname) {
         console.log("At least one of the required fields is missing");
         $rootScope.registerFailureMessage = "At least one of the required fields is missing";
         return;
       }
       if ($scope.password !== $scope.password2) {
         console.log("The two passwords input by the user do not match");
         $rootScope.registerFailureMessage = "The two passwords input by the user do not match";
         return;
       }
       var RegisterResource = $resource('/user');
       RegisterResource.save({login_name : $scope.login_name,
                              password : $scope.password,
                              first_name : $scope.firstname,
                              last_name : $scope.lastname,
                              location : $scope.location,
                              description : $scope.description,
                              occupation : $scope.occupation},
                            function (potential_user) {
                              console.log('this is the newly registered user:');
                              console.log(potential_user);
                              $rootScope.registerFailureMessage = "User was successfully registered.";
                              $scope.textInputRegister = '';
                              $scope.passwordInputRegister = '';
                              $scope.password2InputRegister = '';
                              $scope.firstnameInputRegister = '';
                              $scope.lastnameInputRegister = '';
                              $scope.locationInputRegister = '';
                              $scope.descriptionInputRegister = '';
                              $scope.occupationInputRegister = '';
                              //$rootScope.current_user = potential_user;
                              //$location.path('/users/' + $rootScope.current_user._id);
                            },
                            function errorHandling (error) {
                              //console.log("Error was thrown by RegisterResource.save");
                              $rootScope.registerFailureMessage = error.data;
                              console.log("the error is: ");
                              console.log(error);
                              //console.log(error.config);
                              //console.log(error.data);
                              //console.log(error.resource);
                            });
     };
  }]);
