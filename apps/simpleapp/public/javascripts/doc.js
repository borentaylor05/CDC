var doc = {
	getAll: function(i){
		if(i < 0) return;
		osapi.jive.core.get({
	        "href": "/contents?startIndex="+i.toString(),
	        "v": "v3"
	    }).execute(function(response){
	    	response = util.responseCheck(response);
	    	console.log(response);
	    	if(typeof response === "undefined" ){
	    		alert("Something went wrong in the HTTP request.");
	    		doc.getAll(-1);
	    	}
	        if(response.list.length > 0){
	        	var docs = [];
	        	for(var j = 0 ; j < response.list.length ; j++){
	        		var doc = {
	        			doc_id: response.list[j].id,
	        			api_id: response.list[j].contentID,
	        			subject: response.list[j].subject,
	        			views: response.list[j].viewCount
	        		}
	        		docs.push(doc);
	        	}
	        	console.log(docs);
	        	doc.getAll(-1); 
	        	// make post request here
	        //	doc.getAll(i + 100);
	        }
	        else{
	        	doc.getAll(-1);
	        }
	    });
	},
	get: function(api_id, callback){
		osapi.jive.core.get({
	        "href": "/contents/"+api_id,
	        "v": "v3"
	    }).execute(function(response){
	    	// consecutive requests return different objects
	    	data = util.responseCheck(response);
	    	doc.getExtendedProperties(data.contentID, function(extprops){
	    		doc.getData(data, extprops, function(docData){
	    			callback(docData);
	    		});
	    	});
	    });	
	},
	getData: function(docObj, extendedProperties, callback){
		var d = {
			title: docObj.subject,
			api_id: docObj.contentID,
			doc_id: docObj.id,
			extendedProperties: extendedProperties,
			tags: docObj.tags,
			views: docObj.viewCount,
			summary: docObj.content.text.substring(0, 2000)
		}
		callback(d);
	},
	modalDisplay: function(api_id, type){
		this.get(api_id, function(docObj){
			$(".modal-title").text("Edit "+docObj.title);
			$(".modal-body").empty();
			if(type === "ep"){
				$(".modal-body").append(doc.extendedPropertiesList(docObj.extendedProperties));
				$("#addEP").on("click touch", function(e){
					e.preventDefault();
					$("#epList").append(doc.epRow());
				});
				$("#saveEdit").unbind("click touch");
				$("#saveEdit").on("click touch", function(e){
					e.preventDefault();
					doc.saveExtendedProperties($(this).attr("data-id"),".ep");
					doc.reload();
				});
			}
			else if(type === "feature"){
				$(".modal-body").append(doc.messageForm(api_id));
				gadget_helper.get(util.rails_env.current+"/content/get-message?api_id="+api_id.toString(), {}, function(resp){
					var json = JSON.parse(resp.text);
					$("#message").val(json.message);
				});
				$("#saveEdit").unbind("click touch");
				$("#saveEdit").on("click touch", function(e){
					e.preventDefault();
					var msg = $("#message").val();
					gadget_helper.post(util.rails_env.current+"/content/attach-message", 
										{api_id: $(this).attr("data-id"),  message: msg}, 
										function(data){
											$("#saveEdit").addClass("hide");
											$(".modal-body").empty().append("<div class='alert alert-success'>Message saved!</div> ");
										});
				});
			}
		});
	},
	saveExtendedProperties: function(api_id, className){
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
		this.setExtendedProperties(api_id, props);
		$("#saveEdit").addClass("hide");
		$(".modal-body").empty().append("<div class='alert alert-success'>Properties Saved! Sometimes it can take ~1 minute for the changes to take effect.</div> ");
	},
	epRow: function(){
		var row = '<div class="row">'+
		        		'<div class="col-xs-5"><input type="text" class="form-control ep"></div>'+
		        		'<div class="col-xs-5"><input type="text" class="form-control ep"></div>'+
		        	'</div>';
		return row;
	},
	list: function(startIndex){
		if(!startIndex)
			startIndex = 0;
		gadget_helper.get(util.rails_env.current+"/contents?start="+startIndex.toString(), {}, function(resp){
			var docs = JSON.parse(resp.text);
			if(docs.length > 0){
	        	doc.makeList(docs, function(){ 
	        		setTimeout(function(){
	        			gadgets.window.adjustHeight()
	        		}, 1000); 
	        	});
	        }
		});
	/*	osapi.jive.core.get({
	        "href": "/contents?count=30&startIndex="+startIndex.toString(),
	        "v": "v3"
	    }).execute(function(response){
	    	response = util.responseCheck(response);
	        if(response.list.length > 0){
	        	doc.makeList(response.list, function(){ setTimeout(function(){
	        		gadgets.window.adjustHeight()}, 2000); });
	        }
	    }); */
	},
	listByExtProp: function(key, value){
		$(".docRow, .docError").remove();
		if(value === "everyone")
			this.list(0);
		else if(key === "client"){
			gadget_helper.get(util.rails_env.current+"/contents?client="+value, {}, function(resp){
		    	var docs = JSON.parse(resp.text);
		    	if(docs.length > 0){
		    	//	var documents = util.getRelevant(data.list, "document");
		    		doc.makeList(docs, function(){ 
		        		setTimeout(function(){
		        			gadgets.window.adjustHeight();
		        		}, 2000); 
		        	});
		    	}
		    	else{
		    		$("#docList").append("<div style='margin-top:20px;' class='text-center docError'><strong>There are no documents for that client...</strong></div>");
		    	}
		    	doc.attachHandlers();
		    });
		}
	},
	search: function(content){
		$(".docRow, .docError").remove();
		osapi.jive.core.get({
	        "href": "/search/contents?filter=search("+content+")",
	        "v": "v3"
	    }).execute(function(data){
	    	data = util.responseCheck(data);
	    	if(data.list.length > 0)
	    		doc.makeList(data.list, function(){});
	    	else{
	    		$("#docList").append("<div style='margin-top:20px;' class='text-center docError'><strong>The search did not match any document...</strong></div>");
	    	}
	    	doc.attachHandlers();
	    });
	},
	makeList: function(docs, callback){
    	for(var j = 0 ; j < docs.length ; j++){
    		var doc_id = util.fixDocNum(docs[j].doc_id);
			var d = {
    			doc_id: doc_id,
    			api_id: docs[j].api_id,
    			subject: docs[j].title
    		}
    		this.row(d);
    	} 
    	gadgets.window.adjustHeight();
    	callback();
	},
	row: function(docObj){
		this.getExtendedProperties(docObj.api_id, function(props){
			docObj.extendedProperties = props;
			if(props.featured === "true"){
				var fBtn = '<div class="col-xs-2"><button id="'+docObj.api_id+'" data-id="'+docObj.api_id+'" class="btn btn-success btn-sm feature yes"><i class="fa fa-check"></i>&nbsp&nbspFeatured</button></div>';
				var vBtn = '<div id="view'+docObj.api_id+'" class="col-xs-2"><button data-id="'+docObj.api_id+'" class="btn btn-primary btn-sm viewdocObj" data-toggle="modal" data-target="#myModal">Edit Message</button></div>'
			}
			else{
				var fBtn = '<div class="col-xs-2"><button id="'+docObj.api_id+'" data-id="'+docObj.api_id+'" class="btn btn-warning btn-sm feature" ><i class="fa fa-star"></i>&nbsp&nbspFeature</button></div>';
				var vBtn = '<div id="view'+docObj.api_id+'" class="col-xs-2"><button data-id="'+docObj.api_id+'" class="btn btn-primary btn-sm viewdocObj disabled" data-toggle="modal" data-target="#myModal" >Edit Message</button></div>'
			} 
			var row = '<div class="row docRow text-left">'+
					'<div class="col-xs-3"><span><a href="#" id="DOC-'+docObj.doc_id+'">'+util.truncate(docObj.subject, 25)+'</a></span></div>'+
					'<div class="col-xs-1"><span>'+docObj.doc_id+'</span></div>'+
					'<div class="col-xs-1"><span>'+docObj.api_id+'</span></div>'+
				//	'<div class="col-xs-1"><span>'+docObj.views+'</span></div>'+
					fBtn+
					vBtn+
					'<div id="edit'+docObj.api_id+'" class="col-xs-2"><button data-id="'+docObj.api_id+'" class="btn btn-default btn-sm editDoc" data-toggle="modal" data-target="#myModal">Edit Props</button></div>'+
				  '</div>';

			$("#docRows").append(row);
			$("#DOC-"+docObj.doc_id.toString()).on("click touch", function(e){
				e.preventDefault();
				$(".overlay").removeClass("hide");
				util.get_doc_html($(this).attr("id").substring(4), function(api_id){
					util.showFeatureBtn(gadgets.views.getParams().my.id.toString(), api_id);
					setTimeout(function(){gadgets.window.adjustHeight(); }, 2000);
				});
			});
			$("#"+docObj.api_id.toString()).on("click touch", function(e){
				e.preventDefault();
				doc.fixFeatureBtn($(this));
			});
			$("#edit"+docObj.api_id.toString()).on("click touch", function(e){
				e.preventDefault();
				$("#saveEdit").removeClass("hide");
				$("#saveEdit").attr("data-id", $(this).attr("id").substring(4));
				doc.modalDisplay($(this).attr("id").substring(4), "ep");
			});
			$("#view"+docObj.api_id.toString()).on("click touch", function(e){
				e.preventDefault();
				$("#saveEdit").attr("data-id", $(this).attr("id").substring(4));
				doc.modalDisplay($(this).attr("id").substring(4), "feature");
			});	
		});
		
	},
	setExtendedProperties: function(api_id, propObj){
		this.getExtendedProperties(api_id, function(ep){
			for (var key in propObj) {
			    ep[key] = propObj[key];
			    if(key === "client"){
			    	doc.rails.update_client(api_id, propObj[key].toLowerCase());
			    }
			    else if(key === "featured"){
			    	doc.rails.set_feature(api_id, propObj[key]);
			    }
			}
			if(!util.isEmpty(propObj)){
				osapi.jive.corev3.documents.get({
			        id: api_id
			    }).execute(function (curDoc) { 
				   curDoc.createExtProps(ep).execute(function (resp) {
				   //	console.log("SET",resp);
				    // responds with resp.content(Object).<props>
				   }); 
				}); 
			}
		});	
	},
	getExtendedProperties: function(id, callback){
		console.log("ID: ", id);
		osapi.jive.core.get({
	        "href": "/contents/"+id.toString()+"/extprops",
	        "v": "v3"
	    }).execute(function(response){
	    	callback(response.content);
	    });
	},
	attachHandlers: function(){
		$(".feature").each(function(){
			$(this).on("click touch", function(e){
				e.preventDefault();
				doc.fixFeatureBtn($(this));
			})
		});
	},
	fixFeatureBtn: function(btn){
		if(btn.hasClass("yes")){
			$(btn).parent().next().children().first().addClass("disabled");
			btn.removeClass("btn-success yes").addClass("btn-warning");
			var icon = btn.children().first();
			$(icon).removeClass("fa-check").addClass("fa-star");
			this.setExtendedProperties($(btn).attr("id"), { featured: false });
			doc.rails.create($(btn).attr("id"), false);
		}
		else{
			$(btn).parent().next().children().first().removeClass("disabled");
			btn.removeClass("btn-warning").addClass("btn-success yes");
			var icon = btn.children().first();
			$(icon).removeClass("fa-star").addClass("fa-check");
			this.setExtendedProperties($(btn).attr("id"), { featured: true });
			doc.rails.create($(btn).attr("id"), true);
		}		
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
	messageForm: function(api_id){
		var form = '<form id="messageForm">'+
			        	'<p>Type any message you want to appear with the featured article.</p>'+
			        	'<textarea id="message" class="form-control" rows="4"></textarea>'+
			        '</form>';
		return form;
	},
	reload: function(){
		$("#docRows").empty();
		this.list(0);
	},
	rails: {
		create: function(api_id, featured){
			doc.get(api_id, function(docData){

				var to_rails = {
					featured: featured,
					api_id: docData.api_id,
					doc_id: docData.doc_id,
					title: docData.title,
					jive_id: gadgets.views.getParams().my.id,
					client: docData.extendedProperties.client,
					tags: docData.tags,
					message: docData.summary
				}
				console.log("INFO", to_rails);
				gadget_helper.post(util.rails_env.current+"/content", to_rails, function(resp){
					console.log("RESP", resp);
				});
			});
		},
		update_client: function(api_id, client){
			gadget_helper.post(util.rails_env.current+"/content/update-client", 
	    		{client: client, api_id: api_id},
	    		function(resp){
	    		//	console.log(resp);
	    		});
		},
		set_feature: function(api_id, value){
			gadget_helper.post(util.rails_env.current+"/content", 
	    		{featured: value, api_id: api_id},
	    		function(resp){
	    		//	doc.reload();
	    		});
		}
	}
}




