
app.factory("maintainers", ['$http', function($http){
	var m = this;

	m.createCommentMaintainer = function(comment){
		return $http.post(util.rails_env.current+"/maintainers/comment/new", { com: comment.id, user: util.currentUser })
	}

	return m;
}]);