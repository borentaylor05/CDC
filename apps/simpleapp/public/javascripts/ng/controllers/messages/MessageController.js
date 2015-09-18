

app.controller("MessageController", ['$scope', '$sce', '$http', function($scope, $sce, $http){
	$http.defaults.transformResponse = function(data, headers){ return util.fix(data); };
	var msgs = this;
	msgs.sgs = []; 
	msgs.selectedGroups = [];
	msgs.recipients = [];
	msgs.doneSelecting = msgs.messageSent = false;
	
	msgs.send = function(msg, urgent){
		var params = {
			sender: window._jive_current_user.id,
			groups: msgs.selectedGroups,
			urgent: urgent,
			body: msg
		}
		$http.post(util.rails_env.current+"/message", params).success(function(resp){
			resp = util.fixResp(resp);
			msgs.messageSent = true;
			msgs.status = resp.status;
			if(msgs.status == 0){
				msgs.responseMessage = resp.message;
			}
			else if(msgs.status == 2){
				util.createUser(function(){
					msgs.send(msg);
				});
			}
			else{
				msgs.responseMessage = resp.error;
			}
		});
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
			alert("Error!");
		//	console.log(err);
		});
	}
	
	// if unchecked, removes from selected
	msgs.alreadyAdded = function(group){
		if(msgs.selectedGroups.indexOf(group) < 0)
			return false;
		else
			return true;
	}
	msgs.pushSelected = function(group){
		msgs.selectedGroups = util.pushOrRemove(msgs.selectedGroups, group);
		util.adjustHeight();
	}
	msgs.removeGroup = function(sg, data){
		msgs.selectedGroups = util.pushOrRemove(msgs.selectedGroups, sg);
		msgs.alreadyAdded(sg);
		angular.forEach(msgs.sgs, function (secGroup) {
        //    secGroup.selected = false;
        });
	}
	msgs.showMessage = function(){
		var group, i;
		msgs.showAllClients = false;
		msgs.doneSelecting = true;
	}
	msgs.getLobTitles = function(client){
		$http.get(util.rails_env.current+"/api/clients/"+client.trim()+"/lob-titles").success(function(resp){
			var lobs = [],
				titles = [];
			resp = util.fixResp(resp);
			msgs.lobs = resp.lobs;
			angular.forEach(msgs.lobs, function(lob){
				lobs.push({ name: lob, type: 'lob' });
				msgs.lobs = lobs;
			});
			lobs = null;
			msgs.groups = msgs.lobs;
		});
	}
	msgs.setDoneSelecting = function(status){
		msgs.doneSelecting = status;
		msgs.showAllClients = !status;
	}
	msgs.setMessageSent = function(status){
		msgs.messageSent = status;
	}
	msgs.setShowClients = function(val){
		msgs.showAllClients = val;
	}
	msgs.setClient = function(name){
		msgs.client = name;
		if(name == 'all'){
			msgs.showAllClients = true;
			msgs.selectedGroups = util.pushOrRemove(msgs.selectedGroups, {name: "Admins", type: "admin"});
		}
		else{
			msgs.showAllClients = false;
			msgs.getLobTitles(name);
		}
	}

	// on page load
	gadgets.util.registerOnLoadHandler(function() {
		osapi.jive.corev3.people.getViewer({"fields":"displayName,jive.username,-resources"}).execute(function(user){
			window._jive_current_user = user.content;
			window._jive_current_user.username = user.content.jive.username;
			gadgets.window.adjustHeight();
			gadgets.window.adjustWidth();
			msgs.checkInit(function(resp){
				if(resp.status == 0){
					if(resp.client.name == 'all'){
						msgs.showAllClients = true;
						msgs.userClient = 'all'
					}
					else{
						msgs.client = msgs.userClient = resp.client.name
						msgs.getLobTitles(msgs.client);
					}
				}
			}); 	
		});
	});
}]);