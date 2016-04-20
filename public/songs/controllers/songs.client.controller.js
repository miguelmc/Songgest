angular.module('songs').controller('SongsController',
  ['$scope', '$routeParams', '$location', '$timeout', '$q', '$log', 'Authentication', 'Songs', 'Triples',
    function($scope, $routeParams, $location, $timeout, $q, $log, Authentication, Songs, Triples) {
      var self = this;
      $scope.authentication = Authentication;

      self.simulateQuery = false;
      self.isDisabled    = false;
      self.repos         = loadAll();
      self.querySearch   = querySearch;
      self.selectedItemChange = selectedItemChange;
      self.searchTextChange   = searchTextChange;

      $scope.submit = function(selectedSong) {
        console.log(selectedSong);
        console.log(Authentication.user)
        var triple = new Triples({
          user: Authentication.user._id,
          song: selectedSong._id
        })

        triple.$save(function(response) {
          $location.path('/triples' + response._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      }

      $scope.create = function() {
        var song = new Songs({
          index: this.index,
          author: this.author,
          title: this.title
        });

        song.$save(function(response) {
          $location.path('songs/' + response._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.find = function() {
        $scope.songs= Songs.query();
      };

      $scope.findOne = function() {
        $scope.song = Songs.get({
          songId: $routeParams.songId
        });
      };

      $scope.update = function() {
        $scope.song.$update(function() {
          $location.path('songs/' + $scope.song._id);
        }, function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
      };

      $scope.delete = function(song) {
        if (song) {
          song.$remove(function() {
            for (var i in $scope.songs) {
              if ($scope.songs[i] === song) {
                $scope.songs.splice(i, 1);
              }
            }
          });
        } else {
          $scope.song.$remove(function() {
            $location.path('songs');
          });
        }
      };

      // ******************************
      // Internal methods
      // ******************************
      /**
      * Search for repos... use $timeout to simulate
      * remote dataservice call.
      */
      function querySearch (query) {
        var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
            deferred;
        if (self.simulateQuery) {
          deferred = $q.defer();
          $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
          return deferred.promise;
        } else {
          return results;
        }
      }
      function searchTextChange(text) {
        $log.info('Text changed to ' + text);
      }
      function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
        $scope.submit(item);
      }
      /**
      * Build `components` list of key/value pairs
      * TODO: Load with actual data.
      */
      function loadAll() {
        var repos = [
          {
            '_id'       : "1",
            'name'      : 'Oasis',
            'artist'    : 'Wonderwall',
            'album'     : 'Album',
          },
          {
            '_id'       : "2",
            'name'      : 'Snoop Dog',
            'artist'    : 'Weed',
            'album'     : 'Album',
          },
          {
            '_id'       : "3",
            'name'      : 'Metallica',
            'artist'    : 'Enter Sand Man',
            'album'     : 'Album',
          },
          {
            '_id'       : "4",
            'name'      : 'Foster the People',
            'artist'    : 'Wooohooo',
            'album'     : 'Foster',
          },
          {
            '_id'       : "5",
            'name'      : 'Dream Theater',
            'artist'    : 'Dance of Etentiy',
            'album'     : 'Scenes from a Memory',
          }
        ];
        return repos.map( function (repo) {
          repo.value = repo.name.toLowerCase();
          return repo;
        });
      }
      /**
      * Create filter function for a query string
      */
      function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
          return (item.value.indexOf(lowercaseQuery) === 0);
        };
      }
    }
  ]
);
