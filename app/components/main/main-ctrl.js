angular.module('BaseballStats')
	.controller('MainController',
	[
		'$scope',
		'$http',
		($scope, $http) => {
			const backendURL = 'http://localhost:8081/data';
			$scope.events = [];
			$scope.eventHash = {};

			function loadTicketData() {
				$http.get(backendURL).then((data) => {
					splitData(data.data);
				});
			}

			function splitData(events) {
				for (let event of events) {
					if (event.UTC) {
						let gameTime = new Date(event.datetime_local);
						let ticketPriceTime = new Date(event.UTC);
						let timeBeforeGame = gameTime - ticketPriceTime;

						event['timeToGame'] = timeConversion(timeBeforeGame);
						if ($scope.eventHash[event.id]) {
							$scope.eventHash[event.id].push(event);
						} else {
							$scope.eventHash[event.id] = [event];
						}
					}
				}

				let data = createGraphDataSet($scope.eventHash);
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
							games.push(thisEvent[eventPriceIndex].short_title);
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
				google.charts.load('current', {'packages':['corechart']});
				google.charts.setOnLoadCallback(drawChart);

				function drawChart() {
					var data = google.visualization.arrayToDataTable(dataToBeGraphed);

					var options = {
						title: 'Company Performance',
						legend: { position: 'bottom' }
					};

					var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

					chart.draw(data, options);
				}
			}

			function init() {
				loadTicketData();
			}

			init();
		}
	]
);