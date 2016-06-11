angular.module('BaseballStats')
	.factory('tpsFactory',
	[
		'$http',
		function tpsFactory($http) {
			const host = 'http://localhost:8081';
			const path = '/tps';

			function getTicketPriceSnapshotsById(eventId) {
				return $http.get(`${host}${path}/${eventId}`).then((data) => {
					return data;
				});
			}

			return {
				getTpsById: getTicketPriceSnapshotsById
			}
		}
	]
)