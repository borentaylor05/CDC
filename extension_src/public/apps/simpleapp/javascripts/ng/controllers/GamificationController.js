
app.controller("Gamification", ['bunchball', function(bunchball){
	var game = this;

	game.init = function(){
		game.getMissions();
		game.getLeaders();
	}

	game.getLeaders = function(){
		bunchball.leaders().success(function(resp){
			resp = util.fixResp(resp);
			game.leaders = resp.leaders.Nitro.leaders.Leader;
			util.adjustHeight();
		});	
	}
	game.getMissions = function(){
		bunchball.missions().success(function(resp){
			resp = util.fixResp(resp);
			console.log(resp);
			game.missions = resp.missions.Nitro.challenges.Challenge;
			util.adjustHeight();
		});
	}

	// on page load
	gadgets.util.registerOnLoadHandler(function() {
		osapi.jive.corev3.people.getViewer({"fields":"displayName,jive.username,-resources"}).execute(function(user){
			console.log("GAME", user);
			window._jive_current_user = user.content;
			window._jive_current_user.username = user.content.jive.username;
			game.init();	
			gadgets.window.adjustHeight();
			gadgets.window.adjustWidth();
		});
	});

}]);