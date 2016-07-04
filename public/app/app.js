angular.module('app', [])
	.factory('Weather', function($q, $http) {
		// Api request path
		this.api = "http://api.openweathermap.org/data/2.5/weather?";
		this.units = "&units=metric";
		this.appKey = '&appid=5ea3bc93110c2c2d7596cb94cd4316f9';
		this.cb = "&callback=JSON_CALLBACK";
		// City name searching function
	    this.byCityName = function(query) {
	    	var deferred = $q.defer();
		    if(query){
			    // Call the API using JSONP.
			    $http.jsonp(this.api + this.units + this.appKey + this.cb + '&q=' + encodeURI(query)).then(
			    	function(response) {
			        	var statusCode = parseInt(response.data.cod);
			        	if (statusCode === 200) {
			        		// Call successful.
			            	deferred.resolve(response.data);
			          	}
			          	else {
			            	// Something went wrong. Probably the city doesn't exist.
			            	deferred.reject(response.data.message);
			          	}
			        },
			        function(error) {
			          // Unable to connect to API.
			          deferred.reject(error);
			        }
			    );  
			}	
	    	// Return a promise.
	     	return deferred.promise;
	    }; 
	    //Search a city by it's id
	    this.byCityId = function(id) {
	    	var deferred = $q.defer();

	    	$http.jsonp(this.api + this.units + this.appKey + this.cb + '&id=' + id).then(
	        	function(response) {
	          		var statusCode = parseInt(response.data.cod);

	          		if (statusCode === 200) {
	            		deferred.resolve(response.data);
	          		}
	          		else {
	            		deferred.reject(response.data.message);
	          		}
	        	},
	        	function(error) {
	          		deferred.reject(error); 
	        	}
	      	);
	      	return deferred.promise;
	    };
	    return this;
	})
	//Getting weather data for current location
	.factory('LocalWeather', function($http, Weather){
		//Get local position
		var loc = {};

		loc.getLocation = function(){
			return $http.jsonp("http://ipinfo.io/json?callback=JSON_CALLBACK");
		};

		loc.getWeather = function(lat, long){
			return $http.jsonp(Weather.api + lat + long + Weather.units + Weather.appKey + Weather.cb);
		};

		return loc;
	})