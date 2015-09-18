app.factory("salesforce", ['$http', function($http){
	var sf = {};
	var ALIAS = 'salesforce';
	var base = "https://na16.salesforce.com",
	user = window.parent._jive_current_user.ID;

	sf.accounts = function(){
		return $http.get(util.rails_env.current+"/salesforce?user="+user);
	}
	sf.searchForContact = function(name){
		return $http.get(util.rails_env.current+"/salesforce/search/contact?search="+name+"&user="+user);
	}

	sf.loadAccounts = function(){
		var resources = {};
		return osapi.jive.connects.get({
	        alias : ALIAS,
	        href : resources.query,
	        params : { q : 'SELECT Id, Name, Type, BillingCity, BillingState FROM Account ORDER BY Name' }
	    });
	}

	return sf;
}]);