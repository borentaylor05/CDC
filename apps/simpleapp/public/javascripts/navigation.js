var navigation = {
	user: {},
	history: [],
	init: function(http, callback){				 	
		osapi.people.getViewer().execute(function(viewerData){
			http.get(util.rails_env.current+"/users/"+viewerData.id).success(function(resp){				
				resp = util.fixResp(resp)
			//	make sure any users added through db have client loaded into EP
				user.setEPWithCallback(http, viewerData.id, { client: resp.user.client, lob: resp.user.lob }, function(){
					user.get(viewerData.id, function(userData){
						var to_rails = {
							client: userData.extendedProperties.client,
							jive_id: userData.id,
							employee_id: userData.username
						}
						http.post(util.rails_env.current+"/user", to_rails).success(function(resp){
							var view;
							resp = util.fixResp(resp)
							userData.info = resp.user;	
							
							window._jive_current_user = userData;		 
						 	util.currentUser = {
						 	 	jive_id: window._jive_current_user.id,
				      			employee_id: window._jive_current_user.username,
				        		name: window._jive_current_user.name
						 	}
						 	console.log(userData);
						 	callback();					
						//	gadgets.views.requestNavigateTo(view, {my: userData, history: [view]});
						});
					});
				});
			});						
		});
	},
	makeLinks: function(){
		$(".link").each(function(){
			$(this).on("click touch", function(e){
				e.preventDefault();
				var view = $(this).attr("data-view");
				if(view.length > 0){
					navigation.go(view);
				}
			});
		});
	},
	loadNavigation: function(user){
		$(".navList").append(this.navListItem("Home", this.home()));
		if(user.extendedProperties.client == 'all'){
			$(".navList").append(this.navListItem("Create Post", "new-post"));
			$(".navList").append(this.navListItem("Manage Docs", "manage-docs"));
			$(".navList").append(this.navListItem("Manage Users", "manage-users"));
			$(".navList").append(this.navListItem("Test", "test"));
			$(".navList").append(this.navListItem("Request", "request"));
			$(".navList").append(this.navListItem("Request Queue", "request-queue"));
			$(".navList").append(this.navListItem("AU AMM Care", "au-metro-home"));
		}
		switch(user.extendedProperties.client){
			case "all":
				//alert("Works too");
			break;
		}
		// insert breadcrumbs
		for(var i = 0 ; i < this.history.length ; i++){
			var crumb = this.history[i];
			var fxn = "navigation.go('"+crumb+"');";
			$(".breadcrumb").append("<li><a onclick="+fxn+" href='#'>"+crumb+"</a></li>");
		}
	},
	navListItem: function(text, view, c){
		if(view == this.currentView())
			c = "link active "+c;
		else
			c = "link "+c;		
		return "<li><a data-view='"+view+"' href='#' >"+text+"</li>";
		 			
	},
	currentView: function(){
		return this.history[this.history.length-1];
	},
	home: function(){
		switch(this.user.extendedProperties.client){
			case "all":
				return "manager-home"
			case "fairfax":
				return "fx-home";
			case "cdc":
				return "cdc-home";
			break;
		}
	},
	go: function(view){
		if($.inArray(view, this.history) < 0)
			this.history.push(view);
		else{
			this.history.splice(this.history.indexOf(view) + 1);
		}
	//	console.log(this.history);
		gadgets.views.requestNavigateTo(view, {my: this.user, history: this.history});
	},
	userAuthorized: function(view,user){
		if(this.views[view].auth.indexOf(window._jive_current_user.extendedProperties.client) > -1)
			return true;
		else
			return false;
	},
	isAuthorized: function(user){
		return true;
	},
	views: {
		valid: function(view){
			if(navigation.views.hasOwnProperty(view) && view.length > 0 && navigation.currentView() != view )
				return true;
			else
				return false;
		},
		"manager-home": {
			auth: ['all']
		},
		"manage-docs": { 
			auth: ['all']
		},
		"manage-users": {
			auth: ['all']
		},
		"fx-home":{
			auth: ['all','fairfax']
		},
		"nz-sales-home":{
			auth: ['all','fairfax']
		},
		"nz-sales-trades":{
			auth: ['all','fairfax']
		},
		"nz-magz-home":{
			auth: ['all','fairfax']
		},
		"nz-care-home":{
			auth: ['all','fairfax']
		},
		"au-metro-home":{
			auth: ['all']
		},
		"cdc-home":{
			auth: ['all','cdc']
		},
		"test":{
			auth: ['all']
		},
		"gamification-central":{
			auth: ["all", "fairfax", "ww", "arc", "hyundai", "hrsa", "cdc"]
		}
	}
}