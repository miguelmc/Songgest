angular.module('users').controller('UsersController',
  ['$scope', '$routeParams', '$location', 'Authentication', 'Users',
    function($scope, $routeParams, $location, Authentication, Users) {
      $scope.authentication = Authentication;

      $scope.find = function() {
        $scope.users= Users.query();
      };

      $scope.findOne = function() {
        $scope.user = Users.get({
          userId: $routeParams.userId
        });
      };

      $scope.delete = function(user) {
        if (user) {
          user.$remove(function() {
            for (var i in $scope.users) {
              if ($scope.users[i] === user) {
                $scope.users.splice(i, 1);
              }
            }
          });
        } else {
          $scope.user.$remove(function() {
            $location.path('users');
          });
        }
      };

    }
  ]
);
