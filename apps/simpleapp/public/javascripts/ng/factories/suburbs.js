

app.factory("suburbs", ['$http', function($http){
	var suburbs = {};

	suburbs.getPublications = function(){
		return $http.get(util.rails_env.current+"/fx/api/publications");
	}
	suburbs.get = function(id){
		return $http.get(util.rails_env.current+"/fx/api/publications/"+id+"/suburbs");
	}
	suburbs.getSubPublications = function(id){
		return $http.get(util.rails_env.current+"/fx/api/suburbs/"+id+"/publications");
	}
	suburbs.getCPTs = function(id){
		return $http.get(util.rails_env.current+"/fx/api/publications/"+id+"/cost-per-thousands");
	}
	suburbs.search = function(name){
		return $http.get(util.rails_env.current+"/fx/api/suburbs/search?term="+name);
	}

	return suburbs; 	
}]);