angular.module('BaseballStats')
	.factory('eventFactory',
	[
		'$http',
		function eventFactory($http) {
			const host = 'http://localhost:8081';
			const path = '/events';

			function getEvents() {
				return $http.get(host + path).then((data) => {
					return data;
				});
			}

			function getEventById(eventId) {
				return $http.get(`${host}${path}/${eventId}`).then((data) => {
					return data;
				});
			}

			return {
				getEvents: getEvents,
				getEventById: getEventById
			}
		}
	]
)