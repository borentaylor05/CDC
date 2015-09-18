

app.controller("UnreadMessages", ['$http', '$sce', '$scope', '$interval', function($http, $sce, $scope, $interval){
	// required to return clean json object
	$http.defaults.transformResponse = function(data, headers){ return util.fix(data); };
	var msgs = this;
	msgs.spaces = [];
	msgs.overlay = msgs.userInitiated = msgs.sending = false;

	msgs.getUnreadMessages = function(){
		$http.get(util.rails_env.current+"/messages?user="+window._jive_current_user.id).success(function(resp){
			resp = JSON.parse(resp);
			msgs.unread = resp.messages;
		//	console.log(msgs.unread);
			msgs.checkUnread();
		}).error(function(err){
		//	alert("Error! "+err);
		});
	}
	msgs.acknowledge = function(m){
		var data = {
			jive_id: window._jive_current_user.id,
			message: m.id
		}
		$http.post(util.rails_env.current+"/message/acknowledge", data).success(function(resp){
			resp = JSON.parse(resp);
		//	console.log(resp);
			msgs.unread = resp.messages;
			msgs.checkUnread();
		}).error(function(err){
		//	alert("Error! "+err);
		});
	}
	msgs.openMessages = function(){
		msgs.getUnreadMessages();
		msgs.setOverlay(true);
	}
	msgs.checkUnread = function(){
		if(msgs.unread.length > 0)
			msgs.setOverlay(true);
	}
	msgs.checkInit = function(callback){
		$http.get(util.rails_env.current+"/user/check?user="+window._jive_current_user.id).success(function(resp){
			resp = JSON.parse(resp);
			if(resp.status == 0){
				msgs.userInitiated = true;
				msgs.user = resp.user;
				msgs.client = resp.client;
			}
			else
				msgs.userInitiated = false;
			callback(resp);
		}).error(function(err){
		//	alert("Error! "+err);
		});
	}
	
	msgs.goToSender = function(jive_id){
		$http.get("/api/core/v3/people/"+jive_id).success(function(resp){
			resp = JSON.parse(resp);
			 var win = window.open(resp.resources.html.ref, '_blank');
			 win.focus();
		});
	}
	msgs.setSending = function(sending){
		msgs.sending = sending;
	}


	msgs.setOverlay = function(status){
		msgs.overlay = status;
	}
	msgs.checkForUrgent = function(){
		$http.get(util.rails_env.current+"/user/"+window._jive_current_user.id+"/check-pending").success(function(resp){
			resp = util.fixResp(resp);
			if(resp.status == 0){
				if(resp.pending)
					msgs.getUnreadMessages();
			}
			else
				alert(resp.error);
		}).error(function(err){
		//	alert("Error! "+err);
		});
	}

	// on page load
	gadgets.util.registerOnLoadHandler(function() {
		osapi.jive.corev3.people.getViewer({"fields":"displayName,jive.username,-resources"}).execute(function(user){
			window._jive_current_user = user.content;
			window._jive_current_user.username = user.content.jive.username;
			msgs.checkInit(function(resp){
				if(resp.status == 0){
					msgs.getUnreadMessages();
				}
				else{
					util.createUser(function(){});
				}
				setTimeout(function(){ util.adjustHeight(); }, 500);
			});
			$interval(function(){ 
				msgs.checkForUrgent();
			}, 180000);
			setTimeout(function(){ util.adjustHeight(); }, 500);	
		});
	});

}]);
