
app.factory("bunchball", ['$http', function($http){
	var bb = {};
	bb.leaders = function(){
		return $http.get(util.rails_env.current+"/api/gamification/leaderboard?user="+window._jive_current_user.username);
	}

	bb.missions = function(){
		return $http.get(util.rails_env.current+"/api/gamification/missions?user="+window._jive_current_user.username);	
	}

	return bb;
}]);