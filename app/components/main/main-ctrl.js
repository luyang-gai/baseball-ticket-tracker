angular.module('BaseballStats')
	.controller('MainController',
	[
		'$scope',
		'$http',
		'eventFactory',
		'tpsFactory',
		($scope, $http, eventFactory, tpsFactory) => {

			$scope.events = [];
			$scope.eventHash = {};

			$scope.optionSelected = function() {
				console.log($scope.selectedEvent);
			};

			$scope.$watch('selectedEvent', (newValue, oldValue) => {
				if (newValue) {
					getTpsById(newValue);
				}
			});

			function getTpsById(eventId) {
				tpsFactory.getTpsById(eventId).then((data) => {
					splitData(data.data);
				});
			}


			function getAllEvents() {
				eventFactory.getEvents().then((data) => {
					$scope.events = data.data;
					insertEventDataIntoHash($scope.events);
				});
			}

			function insertEventDataIntoHash(events) {
				for (let event of events) {
					$scope.eventHash[event.id] = event;
				}
			}

			function splitData(ticketPriceSnapshots) {
				let ticketPriceHashData = {};
				let currentEventData = '';

				for (let ticketPriceSnapshot of ticketPriceSnapshots) {
					if (ticketPriceSnapshot.UTC) {
						let gameTime = new Date(ticketPriceSnapshot.datetime_local);
						let ticketPriceTime = new Date(ticketPriceSnapshot.UTC);
						let timeBeforeGame = gameTime - ticketPriceTime;

						ticketPriceSnapshot['timeToGame'] = timeConversion(timeBeforeGame);
						if (ticketPriceHashData[ticketPriceSnapshot.id]) {
							ticketPriceHashData[ticketPriceSnapshot.id].push(ticketPriceSnapshot);
						} else {
							ticketPriceHashData[ticketPriceSnapshot.id] = [ticketPriceSnapshot];
						}
					}
				}

				let data = createGraphDataSet(ticketPriceHashData);
				console.log(`splitData results: ${data}`);
				createGraph(data);
			}

			function createGraphDataSet(originalData) {
				let data = [];
				var games = ['Day'];
				//loop through
				for (let event in originalData) {
					for (let eventPriceIndex in originalData[event]) {
						let thisEvent = originalData[event];
						if (eventPriceIndex === '0') {
							// games.push(thisEvent[eventPriceIndex].short_title);
							games.push('testName');
						}
						if (data[eventPriceIndex]) {
							data[eventPriceIndex].push(thisEvent[eventPriceIndex].lowest_price);
						}
						else {
							data.push([eventPriceIndex]);
							data[eventPriceIndex].push(thisEvent[eventPriceIndex].lowest_price);
						}
					}
				}
				data.unshift(games);
				return data;
			}

			//FROM STACK OVERFLOW
			function timeConversion(millisec) {
				var seconds = (millisec / 1000).toFixed(1);

				var minutes = (millisec / (1000 * 60)).toFixed(1);

				var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

				var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

				if (seconds < 60) {
					return seconds + " Sec";
				} else if (minutes < 60) {
					return minutes + " Min";
				} else if (hours < 24) {
					return hours + " Hrs";
				} else {
					return days + " Days"
				}
			}

			function createGraph(dataToBeGraphed) {
				console.log(`dataToBeGraphed: ${dataToBeGraphed}`);
				// google.charts.setOnLoadCallback(drawChart);

				// function drawChart() {
				var data = google.visualization.arrayToDataTable(dataToBeGraphed);

				var options = {
					title: 'Company Performance',
					legend: { position: 'bottom' }
				};

				var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

				chart.draw(data, options);
				// }
			}

			function init() {
				getAllEvents();
				google.charts.load('current', {'packages':['corechart']});
			}

			init();
		}
	]
);