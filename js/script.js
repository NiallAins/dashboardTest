function dataCtrl($scope,$http) {
	
	//AJAX request to get data from database
	var url = "data.json";
	$http.get(url).success( function(resp) {
		$scope.data   = resp.appData;
		//Track current selected options
		$scope.selected = {
			os : "ios",
			app : $scope.data[0].title,
			date : $scope.data[0].stats[0].date
		}
		$scope.updateData();
	});

	appSelect = 1;

	//Initiate object for current app data
	$scope.currentData = {
		totalImps : 0,
		totalClicks : 0,
		ctr : 0,
		stats : [],
	};

	//Method for updating currentData object on app change.
	$scope.updateData = function() {
		//Reset Variables
		var graphPos = [];
		$scope.currentData.stats = [];
		$scope.currentData.totalImps = 0;
		$scope.currentData.totalClicks = 0;

		for (a in $scope.data) {
			var app = $scope.data[a];

			//Get correct app at correct date
			if (app.title === $scope.selected.app) {
				var j = -1;
				for (st in app.stats) {
					j++;
					if (app.stats[st].date === $scope.selected.date) {
						for(var i = 0; i < 8; i++) {
							$scope.currentData.stats.push({
								date   : formatDate(app.stats[i + j].date),
								imps   : ($scope.selected.os === 'ios') ? app.stats[i + j].ios.imps : app.stats[i + j].android.imps,
								clicks : ($scope.selected.os === 'ios') ? app.stats[i + j].ios.clicks : app.stats[i + j].android.clicks,
							});
							$scope.currentData.totalImps += $scope.currentData.stats[i].imps;
							$scope.currentData.totalClicks += $scope.currentData.stats[i].clicks;

							//Calcuate where on the graph the points will be placed.
							$scope.currentData.stats[i].graphPos = {
								xImp : parseInt(i) * 128,
								yImp : 380 - ($scope.currentData.stats[i].imps * (350/1000)),
								xClick : parseInt(i) * 128,
								yClick : 380 - ($scope.currentData.stats[i].clicks * (350/1000))
							};
						}
						$scope.currentData.ctr = Math.round(($scope.currentData.totalClicks / $scope.currentData.totalImps) * 1000) / 10;

						//Draw graph once data is loaded
						drawGraph($scope.currentData.stats);
						break;
					}
				}
			}
		}
		//Get available dates for data
		$scope.dropdownDates = [];
		for (var i = 0; i < $scope.data[0].stats.length - 8; i++) {
			$scope.dropdownDates.push({value: $scope.data[0].stats[i].date + ' - ' + $scope.data[0].stats[i + 8].date});
		}
	}

	//Set positon of info popups based on points' graph position
	$scope.setPopup = function(p, type) {
		if (type === "imp") {
			return {
				"top" : p.graphPos.yImp + 156,
				"left" : p.graphPos.xImp + 98
			}
		} else {
			return {
				"top" : p.graphPos.yClick + 156,
				"left" : p.graphPos.xClick + 98
			}
		}
	}

	//Turn date to readable string
	formatDate = function(date) {
		var str = ""
		switch (date.slice(3, 5)) {
			case "01": str += "Jan "; break;
			case "02": str += "Feb "; break;
			case "03": str += "Mar "; break;
			case "04": str += "Apr "; break;
			case "05": str += "May "; break;
			case "06": str += "Jun "; break;
			case "07": str += "Jul "; break;
			case "08": str += "Aug "; break;
			case "09": str += "Sep "; break;
			case "10": str += "Oct "; break;
			case "11": str += "Nov "; break;
			case "12": str += "Dec "; break;
		}
		str += date.slice(0, 2) + ", " + date.slice(6, 8);

		return str; 
	}
}