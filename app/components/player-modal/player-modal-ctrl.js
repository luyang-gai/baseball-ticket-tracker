angular.module('BaseballStats')
  .controller('PlayerModalCtrl',
  [
    '$scope',
    '$uibModalInstance',
    'player',
    function($scope, $modalInstance, player) {
      $scope.player = player;

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.filterFields = function(player) {
        var fieldsToIgnore = ['#', 'Name', 'Team', 'DL', 'nextStart'];
        var results = {};
        angular.forEach(player, function(value, key) {
          if (!fieldsToIgnore.includes(key)) {
            results[key] = value;
          }
        });
        return results;
      }
    }
  ]
);