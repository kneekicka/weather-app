.controller('WeatherCTRL', function($scope, $window, $interval, LocalWeather, Weather){
	//Places array init
	$scope.places = angular.fromJson($window.localStorage.getItem('places') || '[]');
	//Icons set for weather 
	var icons = {
		'Clear': {
			'day': "wi wi-day-sunny",
			'night': "wi wi-night-clear"
		},
		'Clouds': "wi wi-cloudy",
		'Snow': "wi wi-snow",
		'Rain': "wi wi-rain",
		'Drizzle': "wi wi-sprinkle",
		'Thunderstorm': "wi wi-thunderstorm",
		"Haze": 'wi wi-day-haze',
		"Mist": 'wi wi-fog',
		"Error": 'glyphicon glyphicon-remove-sign'
	};
	//Setting scope view
	function scopeView(city){
		$scope.temp = city.main.temp || 0;
		$scope.city = city.name || "We're sorry";
		$scope.country = city.sys.country || "We're sorry";
		$scope.humidity = city.main.humidity || 0;
		$scope.wind = city.wind.speed || 0;
		$scope.iconKey = city.weather[0].main || 0;
		$scope.icon = getIcon($scope.iconKey, city.dt) || getIcon('Error');
	}
	function getIcon(key, dateTime) {
		//Changing background color depending on sky info
		var heading = angular.element( document.querySelector( '#customPanelHeading' ) );
		if(key == "Clear" || key == "Haze"){
			if (heading.hasClass("covered")){
				heading.removeClass("covered").addClass("clear");
			} else {
				heading.addClass("clear");
			}
		} else {
			if (heading.hasClass("clear")){
				heading.removeClass("clear").addClass("covered");
			} else {
				heading.addClass("covered");
			}
		};
		//Day or bight sky icon
		if (icons[$scope.iconKey]) {
			if (key === 'Clear') {
				return icons[key][dayOrNight(dateTime)];
			}
			return icons[key];
		}
	};	

	$scope.unit = 'C';
	//Getting location
	LocalWeather.getLocation().success(function(data) {
		//Getting latitude and longitude from response
		var lat = 'lat=' + data.loc.split(',')[0],
			lon = '&lon=' + data.loc.split(',')[1];
		//Setting values to scope
		LocalWeather.getWeather(lat, lon).success(function(data) {
			scopeView(data);
		}).error(function(data){
			alert("Sorry, we can't show you weather right now, please try again later");
		})
	}).error(function(data){
		alert("Sorry, we can't get your location right now, please try again later");
	});
	//Watching a city from the list
	$scope.watchCity = function(index){
		var gotCity = localStorage.getItem("places", index);
		gotCity = JSON.parse(gotCity);
		scopeView(gotCity[index]);
	}
	//Getting hours of when the measurements were taken
	function dayOrNight(UTCdate) {
		var hours = new Date(UTCdate * 1000).getHours();
		if (hours > 6 && hours < 20) {
			return 'day';
		}
		return 'night';
	};
	//Adding a new city to localStorage
	$scope.addPlace = function(place) {
		$scope.places.push(place);
		$window.localStorage.setItem('places', angular.toJson($scope.places));
		angular.element( document.querySelector( '#cityAdd' ) ).val("");
	};

	//Removing a city 
    $scope.removePlace = function(index) {
    	$scope.places.splice(index, 1);
    	$window.localStorage.setItem('places', angular.toJson($scope.places));
    };

	//  Update weather for all saved places.
	$scope.updateWeather = function() {

	  var updatePlace = function(place, i) {
	    // Search by City ID.
	    Weather.byCityId(place.id).then(
	      function(result) {
	        $scope.places[i] = result;
	      }
	    );
	  };
	  for (var i = 0, l = $scope.places.length; i < l; i ++) {
	    updatePlace($scope.places[i], i);
	  }
	};    
	// Update weather every minute.
	$interval($scope.updateWeather, 60000);

	$scope.search = function(){
		Weather.byCityName($scope.query).then(
			function(result) {
				scopeView(result);
			},
			function() {
				$window.alert("Unable to find city");
			}
		)  
	};
	//Adding new city and transfering its info to the view
	$scope.addCity = function(){
		Weather.byCityName($scope.query).then(
			function(result) {
			 	for (var i = 0, l = $scope.places.length; i < l; i ++) {
					var place = $scope.places[i];
					if (place.id === result.id) {
			    		$window.alert("This city is already added");
			      		return;
			    	}
			 	}
				$scope.addPlace(result);
				scopeView(result);
			},
			function() {
				$window.alert("Unable to find city");
			}
		)
	};	
})