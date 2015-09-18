

var app = angular.module("ArticleRequest", ["ngSanitize", "ngS3upload"]);

app.config(function(ngS3Config) {
  ngS3Config.theme = 'bootstrap3';
});

app.filter('capitalize', function() {
	return function(input, all) {
		return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
});

app.factory("maintainers", ['$http', function($http){
	var m = this;

	m.newAR = function(ar){
		return $http.post(util.rails_env.current+"/maintainers/article-request/new", ar);
	}

	return m;
}]);

app.controller("AR", ["$http", "maintainers", function($http, maintainers){
	var ar = this;
	ar.requestingUser = {},
	ar.hasClient = true,
	ar.allClients = false,
	ar.currentClient = "";

	ar.createAR = function(doc){
		doc.user = ar.requestingUser.jive_id;
		doc.client = ar.currentClient;
		maintainers.newAR(doc).success(function(resp){
			if(resp.status == 0)
				ar.onSuccess = resp.message;
		});
	}

	ar.getUser = function(){
		$http.get(util.rails_env.current+"/users/"+window.parent._jive_current_user.ID).success(function(resp){
			ar.requestingUser = resp.user;
			if(!resp.user.client)
				ar.hasClient = false;
			else if(resp.user.client == "all")
				ar.allClients = true;
			else
				ar.currentClient = ar.requestingUser.client
		});
	}
	ar.setClient = function(client){
		ar.currentClient = client;
	}

	ar.getUser();

}]);