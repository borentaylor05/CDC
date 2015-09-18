

app.factory("users", ['$http', function($http){
	var users = {};

	users.getAll = function(count, start){
		if(!count)
			count = "";
		if(!start)
			start = "";
		return $http.get(util.rails_env.current+"/users?count="+count+"&start="+start);
	}
	users.get = function(user){
		return $http.get(util.rails_env.current+"/users/"+user.jive_id);
	}
	users.getExtendedProperties = function(user){
		return osapi.jive.core.get({
	        "href": "/people/"+user.jive_id+"/extprops",
	        "v": "v3"
	    });
	}
	users.createExtendedProperties = function(user, props){
		return osapi.jive.core.post({
	        "href": "/people/"+user.jive_id+"/extprops",
	        "v": "v3",
	        "body": props
	    });
	}
	users.deleteExtendedProperty = function(user, prop){
		return osapi.jive.core.delete({
	        "href": "/people/"+user.jive_id+"/extprops",
	        "v": "v3",
	        "body": prop
	    });
	}
	users.search = function(term){
		return $http.get(util.rails_env.current+"/users/search?term="+term);
	}

	return users;
}]);