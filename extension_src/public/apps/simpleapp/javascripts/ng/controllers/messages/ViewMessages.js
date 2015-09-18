

app.controller("ViewMessages", ['messages', function(messages){
	var view = this;
	var jsTime;
	view.allMessages = [],
		view.user = {};
	
	view.all = function(u){
		messages.getAll(u).success(function(resp){
			view.allMessages = resp.messages;
			setTimeout(function(){ gadgets.window.adjustHeight(); gadgets.window.adjustWidth(); }, 500);
		}).error(function(err){
			alert("Error getting 'messages' from factory");
		//	console.log(err);
		});
	}
	view.acknowledge = function(m){
		var data = {
			jive_id: window.parent._jive_current_user.ID,
			message: m.id
		}
		messages.acknowledge(data).success(function(resp){
			view.all(view.user);
		}).error(function(err){
			alert("Error!");
		//	console.log(err);
		});
	}

	// on page load
	gadgets.util.registerOnLoadHandler(function() {
		osapi.jive.corev3.people.getViewer({"fields":"displayName,jive.username,-resources"}).execute(function(user){
			window._jive_current_user = user.content;
			window._jive_current_user.username = user.content.jive.username;
			view.user = {
				jive_id: window._jive_current_user.id
			}
			gadgets.window.adjustHeight();
			gadgets.window.adjustWidth();
			view.all(view.user);	
		});
	});

}]);