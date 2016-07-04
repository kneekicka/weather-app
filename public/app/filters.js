//Filter to round the temperature
.filter('round', function() {
    return function(input) {
        return Math.round(input);
    };
})
//Filter to give a + sign or - sign
.filter('belowAbove', function(){
	return function(input) {
		if(input>0){
			return "+" + input;
		} else return "-" + input;
	};
});