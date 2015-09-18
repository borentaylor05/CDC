var user = {
	
	getAll: function(i){
		if(i < 0) return;
		osapi.jive.core.get({
	        "href": "/people?count=100&startIndex="+i.toString(),
	        "v": "v3"
	    }).execute(function(response){
	    	if(typeof response.content !== 'undefined'){
	    		var list = response.content.list;
	    	}
	    	else if(typeof response.list !== 'undefined'){
	    		var list = response.list;
	    	}
	    	else{
	    		alert("Something went wrong in the HTTP request.");
	    		user.getAll(-1);
	    	}
	        if(list.length > 0){
	        	var jiveUsers = [];
	        	for(var j = 0 ; j < list.length ; j++){
	        		var userStuff = {
	        			employee_id: list[j].jive.username,
	        			jive_user_id: list[j].id
	        		}
	        		jiveUsers.push(userStuff);
	        	} 
	        	// make post request here
	        	users.getAll(i + 100);
	        }
	        else{
	        	users.getAll(-1);
	        }
	    });
	},
	get: function(jive_user_id, callback){
		osapi.jive.core.get({
	        "href": "/people/"+jive_user_id,
	        "v": "v3"
	    }).execute(function(response){
	    	// consecutive requests return different objects
	    	data = user.responseCheck(response);
	    	user.getExtendedProperties(data.id, function(extprops){
	    		user.getData(data, extprops, function(userData){
	    			callback(userData);
	    		});
	    	});
	    });	
	},
	extendedProperties: {},
	setExtendedProperties: function(jive_user_id, propObj){
		this.getExtendedProperties(jive_user_id, function(ep){
			for (var key in propObj) {
			    ep[key] = propObj[key];
			    if(key === "client")
			    	user.rails.update_client(jive_user_id, propObj[key].toLowerCase());
			}
			if(!util.isEmpty(propObj)){
				osapi.jive.corev3.people.get({  
				    id: jive_user_id.toString() 
				}).execute(function (currentUser) {   
				   currentUser.createExtProps(ep).execute(function (resp) {
				   	//console.log(resp);
				    // responds with resp.content(Object).<props>
				   }); 
				}); 
			}
			else{
				alert("You must include a property to set.");
			}
		});
		
	},
	setEPWithCallback: function(http, jive_user_id, propObj, callback){
		this.getExtendedProperties(jive_user_id, function(ep){
			for (var key in propObj) {
			    ep[key] = propObj[key];
			    if(key === "client")
			    	user.rails.update_client(http, jive_user_id, propObj[key].toLowerCase());
			}
			if(!util.isEmpty(propObj)){
				osapi.jive.corev3.people.get({  
				    id: jive_user_id.toString() 
				}).execute(function (currentUser) {   
				   currentUser.createExtProps(ep).execute(function (resp) {
				   		callback();	
				   }); 
				}); 
			}
			else{
				alert("You must include a property to set.");
			}
		});
	},
	deleteExtendedProperty: function(jive_user_id, obj, key){
		delete obj[key];
		this.setExtendedProperties(jive_user_id, obj); 
	},
	getExtendedProperties: function(jive_user_id, callback){
		osapi.jive.corev3.people.get({  
		    id: jive_user_id.toString(),  
		}).execute(function (currentUser) {  
	        currentUser.getExtProps().execute(function (resp) {  
	            user.extendedProperties = resp.content;  
	            callback(resp.content);
	        });
		});
	},
	saveExtendedProperties: function(jive_user_id, className){
		var c = 0;
		var props = {};
		var key = "";
		$(className).each(function(){
			if(c % 2 === 0)
				key = $(this).val();
			else{
				props[key] = $(this).val();
			}
			c++;
		});
		this.setExtendedProperties(jive_user_id, props);
		$("#saveEdit").addClass("hide");
		$(".modal-body").empty().append("<div class='alert alert-success'>Properties Saved! Sometimes it can take ~1 minute for the changes to take effect.</div> ")
	},
	initCurrentUser: function(jive_user_id, callback){
		osapi.jive.corev3.people.get({  
		    id: jive_user_id.toString(),  
		}).execute(function (currentUser) {  
	        currentUser.getExtProps().execute(function (resp) {  
	            user.extendedProperties = resp.content; 
	            callback(resp.content);
	        });
		});
	},
	search: function(name){
		$(".personRow, .personError").remove();
		osapi.jive.core.get({
	        "href": "/search/people?filter=search("+name+")",
	        "v": "v3"
	    }).execute(function(data){
	    	data = user.responseCheck(data);
	    	if(data.list.length > 0)
	    		user.makeList(data.list, util.adjustHeight());
	    	else{
	    		$("#peopleList").append("<div style='margin-top:20px;' class='text-center personError'><strong>The search did not match any user...</strong></div>");
	    	}
	    	user.attachHandlers();
	    });
	},
	makeList: function(people, callback){
    	for(var i = 0 ; i < people.length ; i++){
    		$("#peopleList").append(user.row(people[i]));
    	}
    	gadgets.window.adjustHeight();
    	callback();
	},
	listAll: function(startIndex, callback){
		osapi.jive.core.get({
	        "href": "/people?count=30&startIndex="+startIndex.toString(),
	        "v": "v3"
	    }).execute(function(data){
	    	data = user.responseCheck(data);
	    	var people = data.list;
	    	user.makeList(people, callback);
	    });
	},
	responseCheck: function(data){
		if(typeof data.content !== 'undefined')
			data = data.content;
		return data;
	},
	listByClient: function(client){
		$(".personRow, .personError").remove();
		if(client === "everyone")
			this.listAll(0, function(){});
		else{
			osapi.jive.core.get({
		        "href": "/extprops/client/"+client,
		        "v": "v3"
		    }).execute(function(data){
		    	data = user.responseCheck(data);
		    	if(data.list.length > 0){
		    		var people = util.getRelevant(data.list, "person");
		    		user.makeList(people, function(){ util.adjustHeight(); });
		    	}
		    	else{
		    		$("#peopleList").append("<div style='margin-top:20px;' class='text-center personError'><strong>There are no people for that client...</strong></div>");
		    	}
		    	user.attachHandlers();
		    });
		}
	},
	row: function(person){
		var row = '<div class="row personRow text-center">'+
					'<div class="col-xs-1"><span>'+person.id+'</span></div>'+
					'<div class="col-xs-2"><span>'+person.jive.username+'</span></div>'+
					'<div class="col-xs-2"><span>'+person.displayName+'</span></div>'+
					'<div class="col-xs-3"><span>'+person.emails[0].value+'</span></div>'+
					'<div class="col-xs-2"><button data-id="'+person.id+'" class="btn btn-primary btn-sm specialtyBtn" data-toggle="modal" data-target="#myModal"><i class="fa fa-plus"></i>&nbsp Add Specialty</button></div>'+
					'<div class="col-xs-2"><button data-username="'+person.jive.username+'" data-id="'+person.id+'" class="btn btn-default btn-sm editBtn" data-toggle="modal" data-target="#myModal">Edit</button></div>'+
				  '</div>';
		return row;
	},
	epRow: function(){
		var row = '<div class="row">'+
		        		'<div class="col-xs-5"><input type="text" class="form-control ep"></div>'+
		        		'<div class="col-xs-5"><input type="text" class="form-control ep"></div>'+
		        	'</div>';
		return row;
	},
	extendedPropertiesList: function(ep){
		var list = '<h4>Extended Properties <span class="tiny"><strong>(Do not change these unless you know what you are doing!)</strong></span></h4>'+
        '<form id="extpropsForm">'+
        	'<div class="row">'+
        		'<div class="col-xs-5"><strong>Key</strong></div>'+
        		'<div class="col-xs-5"><strong>Value</strong></div>'+
        	'</div><div id="epList">';
        	for(var key in ep){
        		list += '<div class="row">'+
			        		'<div class="col-xs-5"><input type="text" class="form-control ep" value="'+key+'"></div>'+
			        		'<div class="col-xs-5"><input type="text" class="form-control ep" value="'+ep[key]+'"></div>'+
			        	'</div>';
        	}

        	list += '</div><div class="row">'+
			        		'<div class="col-xs-3"><button id="addEP" class="btn btn-sm btn-info"><i class="fa fa-plus"></i>&nbspAdd EP</button></div>'+
			        	'</div>';
        list += '</form>';
        return list;
	},
	specialtyList: function(specialties){
		$("#specContainer, .specError").remove();
		if(specialties.length <= 0){
			return "<div class='alert alert-warning specError text-center'>There are no specialties for this client.</div>";
		}
		var list = '<div id="specContainer" class="hide"><label>Select all specialties for this user</label>'+
			        '<form id="specialties">';
			        for(var i = 0 ; i < specialties.length ; i++){
			        	if(specialties[i].attached == true)
			        		list +='<input class="specialty" type="checkbox" value="'+specialties[i].name+'" checked>&nbsp '+util.capitaliseFirstLetter(specialties[i].name);
			        	else
			        		list +='<input class="specialty" type="checkbox" value="'+specialties[i].name+'">&nbsp '+util.capitaliseFirstLetter(specialties[i].name);
			        }
			        list += '</form></div>';
		return list;	        
	},
	modalDisplay: function(jive_user_id, view){
		this.get(jive_user_id, function(userData){
			$(".modal-title").text("Edit "+userData.name);
			$(".modal-body").empty();
			if(view === "ep"){
				$(".modal-body").append(user.extendedPropertiesList(userData.extendedProperties));
				$("#addEP").on("click touch", function(e){
					e.preventDefault();
					$("#epList").append(user.epRow());
				});
			}
			else if(view === "specialty"){
				user.get(jive_user_id, function(userData){
					var selectedClient = "";
					if(userData.extendedProperties.client == "undefined" || userData.extendedProperties.client.length <= 1){
						$(".modal-body").append("<div class='alert alert-danger'>The user is not associated with a client.  Please select one from the menu:</div>");
						$(".modal-body").append(user.clientSelect());
						$("ul#clients-modal > li > a.client").each(function(){
							$(this).on("click touch", function(e){
								e.preventDefault();
								selectedClient = $(this).attr("data-client");
								user.rails.get_specialties(selectedClient, jive_user_id, function(resp){
									var specialties = JSON.parse(resp.text);
									$(".modal-body").append(user.specialtyList(specialties));
									$("#specContainer").removeClass("hide");
									$("#saveEdit").unbind("click touch");
									$("#saveEdit").on("click touch", function(e){
										e.preventDefault();
										var selected = [];
										$("input.specialty").each(function(){
											var s = {
												name: $(this).val()										
											};
											if($(this).prop("checked"))
												s.attached = true;
											else
												s.attached = false;
											selected.push(s);
										});
										user.addSpecialty(selected, jive_user_id, selectedClient, function(resp){
										//	console.log(resp);
										});
									});
								});
							});
						});	
					}
					else{
						user.rails.get_specialties(user.extendedProperties.client, jive_user_id, function(resp){
							var specialties = JSON.parse(resp.text);
							$(".modal-body").append(user.specialtyList(specialties));
							$("#specContainer").removeClass("hide");
							$("#saveEdit").unbind("click touch");
							$("#saveEdit").on("click touch", function(e){
								e.preventDefault();
								var selected = [];
								$("input.specialty").each(function(){
									var s = {
										name: $(this).val()										
									};
									if($(this).prop("checked"))
										s.attached = true;
									else
										s.attached = false;
									selected.push(s);
								});
								user.addSpecialty(selected, jive_user_id, selectedClient, function(resp){
								//	console.log(resp);
								});
							});
						});
					}

				});
			/*	gadget_helper.get(util.rails_env.current+"/specialty/"+client, {}, function(resp){
					console.log(resp);
				}); */
			}
		});
	},
	addSpecialty: function(specialties, jive_user_id, client, callback){
		if(client.length > 1){
			// set client extprop
			this.setExtendedProperties(jive_user_id, { "client":client });
			this.rails.update_client(jive_user_id, client);
			this.rails.add_specialties(jive_user_id, specialties, callback);
		}
		if(specialties.length > 0)
			this.rails.add_specialties(jive_user_id, specialties, callback);
	},
	getData: function(user, extendedProperties, callback){
		var data = {
			name: user.displayName,
			email: user.emails[0].value,
			id: user.id,
			username: user.jive.username,
			extendedProperties: extendedProperties,
			avatar: user.thumbnailUrl
		};
		callback(data);
	},
	clientSelect: function(){
		var select = '<div id="select-menu-modal" class="btn-group btn-input clearfix">'+
					  	'<button id="clients" type="button" class="btn btn-default dropdown-toggle form-control" data-toggle="dropdown">'+
					    '<span data-bind="label">Select a client</span> <span class="caret"></span>'+
					  	'</button>'+
					  	'<ul id="clients-modal" class="dropdown-menu text-left" role="menu">'+
					  		'<li><a class="client" data-client="everyone" href="#">All</a></li>'+
					    	'<li><a class="client" data-client="all" href="#">Site Managers</a></li>'+
					    	'<li><a class="client" data-client="arc" href="#">ARC</a></li>'+
					    	'<li><a class="client" data-client="cdc" href="#">CDC</a></li>'+
					    	'<li><a class="client" data-client="fairfax" href="#">Fairfax</a></li>'+
					    	'<li><a class="client" data-client="hrsa" href="#">HRSA</a></li>'+
					    	'<li><a class="client" data-client="hyundai" href="#">Hyundai</a></li>'+
					    	'<li><a class="client" data-client="spark" href="#">Spark</a></li>'+
					    	'<li><a class="client" data-client="ww" href="#">WW</a></li>'+
					    	'<li><a class="client" data-client="test" href="#">Test</a></li>'+
					  	'</ul>'+
					 '</div></br>';
		return select;
	},
	// call this function after any dynamically added elements
	attachHandlers: function(){ 
		$("button.editBtn").each(function(){
			$(this).on("click touch", function(e){
				$("#saveEdit").removeClass("hide");
				e.preventDefault();
				user.modalDisplay($(this).attr("data-id"), "ep");
				$("#saveEdit").attr("data-id", $(this).attr("data-id"));
				$("#saveEdit").attr("data-username", $(this).attr("data-username"));
			});
		});
		$("button.specialtyBtn").each(function(){
			$(this).on("click touch", function(e){
				e.preventDefault();
				user.modalDisplay($(this).attr("data-id"), "specialty");
				$("#saveEdit").attr("data-id", $(this).attr("data-id"));
				$("#saveEdit").attr("data-username", $(this).attr("data-username"));
			});
		});
	},
	rails: {
		update_client: function(http, jive_id, client){
			params = {
				jive_id: jive_id,
				client: client
			}
			http.post(util.rails_env.current+"/user/update-client", params);
		},
		get_specialties: function(client, jive_user_id, callback){
			if(user)
				var url = util.rails_env.current+"/specialties?client="+client+"&user="+jive_user_id;
			else
				var url = util.rails_env.current+"/specialties?client="+client;
			gadget_helper.get(url, {}, function(resp){
				callback(resp);
			});
		},
		add_specialties: function(jive_user_id, specialties, callback){
			var params = {
				user: jive_user_id,
				specialties: JSON.stringify(specialties)
			}
			gadget_helper.post(util.rails_env.current+"/user/add-specialties", params, function(resp){
				callback(resp);
			});
		}
	}
}



