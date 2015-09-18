var gadget_helper = {
	post: function(url, data, callback){
		var params = {};
		params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
		params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.POST;
  		params[gadgets.io.RequestParameters.POST_DATA] = gadgets.io.encodeValues(data);
  		gadgets.io.makeRequest(url, callback, params);
	},
	put: function(url, data, callback){
		var params = {};
		params[gadgets.io.RequestParameters.CONTENT_TYPE] = gadgets.io.ContentType.JSON;
		params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.PUT;
  		params[gadgets.io.RequestParameters.POST_DATA] = gadgets.io.encodeValues(data);
  		gadgets.io.makeRequest(url, callback, params);
	},
	get: function(url, params, callback){
		params[gadgets.io.RequestParameters.METHOD] = gadgets.io.MethodType.GET;
  		gadgets.io.makeRequest(url, callback, params);
	}
}

var util = {
	fixResp: function(resp){
		 if(typeof resp == "string")
			resp = JSON.parse(resp);
		return resp;
	},
	get_doc_from_link: function(url){
		url = url.split("?")[0]; // strip any parameters
		return url.substr(url.lastIndexOf('/') + 1);
	},
	currentUser: {},
	isEmpty: function(obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }
    	return true;
	},
	lastPart: function(url){
		var parts = url.split("/");
		return parts[parts.length - 1];
	},
	fix: function(data){
		return data.replace(/^throw [^;]*;/, '');
	},
	fixDocNum: function(doc_id){
		if(doc_id.indexOf("DOC") >= 0)
			return doc_id.substring(4);
		else
			return doc_id;
	},
	adjustHeight: function(){
		setTimeout(function(){
			gadgets.window.adjustHeight();
		}, 1000);
	},
	responseCheck: function(data){
		if(typeof data !== 'undefined' && typeof data.content !== 'undefined' && data.type !== "document")
			data = data.content;
		return data;
	},
	capitaliseFirstLetter: function(string){
	    return string.charAt(0).toUpperCase() + string.slice(1);
	},
	truncate: function(string, length){
		if(string.length > length)
			return string.substring(0, length)+"...";
		else
			return string;
	},
	getRelevant: function(list, type){
		var relevant = [];
		for(var i = 0 ; i < list.length ; i++){
			if(list[i].type === type)
				relevant.push(list[i]);
		}
		return relevant;
	},
	toggle: function(val){
		if(val)
			val = false;
		else
			val = true;
		return val;
	},
	rails_env: {
		local: "http://localhost:3000",
		remote: "https://lit-inlet-2632.herokuapp.com",
		current: "https://lit-inlet-2632.herokuapp.com",
		setCurrent: function(env){
			this.current = env;
		}
	},
	clearAndAlert: function(div, type, text){
		div.empty();
		div.append("<div class='alert alert-"+type+"'>"+text+"</div>");
	},
	nav_fix: function(){
		$(".jive-link-anchor-small").each(function(){
			$(this).on("click touch",function(e){
				$(".navigation").css("top", "40px");
			});
		});
		$(".jive-rendered-content").prepend("<span id='top'></span>");
		this.link_fix();
	},
	link_fix: function(){
		$(".jive-link-wiki-small").each(function(){
			$(this).on("click touch",function(e){
				e.preventDefault();
				$(".navigation").css("top", "40px");
				var doc = util.get_doc_from_link($(this).attr("href"));
				var id = "#"+doc.split("#")[1];
				window.open("/docs/"+doc, '_blank');
			});
		});
	},
	pushOrRemove: function(array, item){
		var index = array.indexOf(item);
		if (index > -1) {
    		array.splice(index, 1);
		}
		else{
			array.push(item);
		}
		return array;
	},
	remove: function(array, item){
		var index = array.indexOf(item);
		if (index > -1) {
    		return array.splice(index, 1);
		}
	},
	get_doc_html: function(docNum, callback){
		if(docNum.indexOf("DOC") >= 0)
			docNum = docNum.substring(4);
		osapi.jive.corev3.contents.get({
		     entityDescriptor: "102,"+docNum
		 }).execute(function(data){
		 	if(data.status === 403){
		 		var error = "<h4 class='access-error'>"+
						"Oops it looks like you don't have permission to view this document..."+
						"<p>"+
							"If you believe this is a mistake, please reach out to your community specialist."+
						"</p>"+
					"</h4>";
		 		$(".spinner").addClass("hide");
		 		$(".navigation").append('<i id="close" class="fa fa-close fa-3x"></i><h2>Unauthorized</h2>');
		 	//	wwc.close_doc();
		 		$(".doc-container").append(error);
		 		return;
		 	}
			if(data.hasOwnProperty('list') && data.list.length > 0){
				var thisDoc = data.list[0];
				$(".doc-container").html(thisDoc.content.text);
				$(".doc-container").prepend('<h1 class="header">'+thisDoc.subject+'<span class="original tiny"><a target="_blank" href="https://social.teletech.com/docs/'+thisDoc.id+'">Click here to see original document.</a></span></h1>');
				$(".doc-container").append("</br>");
				util.nav_fix();
			//	wwc.link_fix();
				gadgets.window.adjustHeight();
				callback(thisDoc.contentID);
			}
			gadgets.window.adjustHeight();
		});
	},
	getUrlParams: function(sParam){
		var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) 
	    {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) 
	        {
	            return sParameterName[1];
	        }
	    }
	},
	createUser: function(callback){
		var user = {
				jive_id: window._jive_current_user.id, 				// removed parent, lowercase id
				employee_id: window._jive_current_user.username,	// removed parent
				name: window._jive_current_user.displayName 		// removed parent
			}
		gadget_helper.post(this.rails_env.current+"/user", user, function(resp){
			callback();
		});	
	},
	showFeatureBtn: function(jive_user_id, api_id){
		$("div.overlay > button#featureMe").remove();
		osapi.jive.core.get({
	        "href": "/people/"+jive_user_id+"/extprops",
	        "v": "v3"
	    }).execute(function(response){
	    	if(response.content.siteManager == "true"){
	    		osapi.jive.core.get({
			        "href": "/contents/"+api_id+"/extprops",
			        "v": "v3"
			    }).execute(function(props){
			    	if( typeof props.content.featured == "undefined" || props.content.featured == "false")
	    				$("div.overlay").prepend('<button id="featureMe" class="btn btn-md btn-warning"><i class="fa fa-star"></i>&nbsp <span>Feature This Document</span></button>');
			    	else
			    		$("div.overlay").prepend('<button id="featureMe" class="btn btn-md btn-success"><i class="fa fa-check"></i>&nbsp <span>Featured</span></button>');
			    	$("#featureMe").on("click touch", function(e){
						if($(this).hasClass("btn-warning")){
							$(this).removeClass("btn-warning").addClass("btn-success");
							$(this).children().first().removeClass("fa-start").addClass("fa-check");
							$(this).children().last().text("Featured");
							doc.setExtendedProperties(api_id, {featured: true});
						}
						else{
							$(this).removeClass("btn-success").addClass("btn-warning");
							$(this).children().first().removeClass("fa-check").addClass("fa-star");
							$(this).children().last().text("Feature This Document");
							doc.setExtendedProperties(api_id, {featured: false});
						}
						doc.reload();
					});
			    });
	    	}
	    });
	},
	fixDate: function(dateString) {
		var dateRegex=/(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)\.(\d\d\d)\+0000/;
	    //First try to match the strict date format from Jive
	    var match = dateRegex.exec(dateString);
	    if (!match) {
	        //On fail, fall back to default date parsing
	        return new Date(dateString);
	    }
	    var year = parseInt(match[1]);
	    var month = parseInt(match[2]) - 1; //javascript expects a month between 0 and 11
	    var day = parseInt(match[3]);
	    var hour = parseInt(match[4]);
	    var min = parseInt(match[5]);
	    var s = parseInt(match[6]);
	    var ms = parseInt(match[7]);

	    var d = new Date();
	    d.setUTCFullYear(year, month, day);
	    d.setUTCHours(hour, min, s, ms);

	    return d;
	},
	merge: function(holder, resp){
		var arr = [];
		for(var i = 0 ; i < resp.length ; i++){
			resp[i].text = holder[i].content.text;
			resp[i].author = holder[i].author.displayName;
			resp[i].posted_at = holder[i].publishedTime+" on "+holder[i].publishedCalendarDate;
		}
		return resp;
	},
	rails: {
		update_client: function(jive_id, client){
			params = {
				jive_id: jive_id,
				client: client
			}
			gadget_helper.post(util.rails_env.current+"/user/update-client", params, function(resp){
			//	console.log("UPD",resp);
			});
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
