

app.factory('redeliveries', ['$http', function($http){
	var red = {};

	red.publications = function(){
		return $http.get(util.rails_env.current+"/fx/api/redelivery/publications");
	}
	red.getPubRedeliveries = function(id){
		return $http.get(util.rails_env.current+"/fx/api/publication/"+id+"/redeliveries");	
	}
	red.getRedelivery = function(id){
		return $http.get(util.rails_env.current+"/fx/api/redelivery/"+id);	
	}
	red.search = function(term){
		return $http.get(util.rails_env.current+"/fx/api/search/redeliveries?term="+term);		
	}

	return red;
}]);