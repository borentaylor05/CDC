

app.factory("documents", ['$http', function($http){
	var docs = {};

	docs.getByTag = function(tag){
		return osapi.jive.core.get({
	        "href": "/contents?filter=tag("+tag+")&filter=type(document)",
	        "v": "v3"
	    });
	}
	docs.search = function(term){
		return osapi.jive.core.get({
	        "href": "/search/contents?filter=search("+term+")&filter=type(document)",
	        "v": "v3"
	    });
	}
	docs.getReplies = function(com){
		return osapi.jive.core.get({
	        "href": "/comments/"+com.api_id+"/comments",
	        "v": "v3"
	    });
	}
	
	docs.toggleResolved = function(doc, com){
		return $http.post(util.rails_env.current+"/old/comment/toggle", {api: com.api_id});
	}
	docs.checkForNewComments = function(docs){
		return $http.post(util.rails_env.current+"/old/content", { data: docs } );
	}
	docs.checkAndInitComments = function(coms){
		return $http.post(util.rails_env.current+"/old/comments", { data: coms, user: window.parent._jive_current_user.ID } );
	}
	docs.getComments = function(url){
		parts = url.split("/api/core/v3");
		if(parts.length > 1)
			url = parts[1];
		return osapi.jive.core.get({
	        "href": url,
	        "v": "v3"
	    });
	}
	docs.replyToComment = function(com, body){
		var comment = {
			"content": {"type": "text/html", "text": "<body><p>"+body+"</p></body>"},
			"type": "comment"
		}
		return osapi.jive.core.post({
	        "href": "/comments/"+com.api_id+"/comments",
	        "v": "v3",
	        "body": comment
	    });
	}
	docs.getParticipated = function(){
		return osapi.jive.core.get({
	        "href": "/contents?filter=relationship(participated)&filter=type(document)",
	        "v": "v3"
	    });
	}
	docs.getByDocId = function(docID){
		return osapi.jive.core.get({
	        "href": "/contents?filter=entityDescriptor(102,"+util.fixDocNum(docID)+")",
	        "v": "v3"
	    });
	}
	docs.byId = function(id){
		return osapi.jive.core.get({
	        "href": "/contents/"+id,
	        "v": "v3"
	    });
	}

	return docs;
}]);