

app.controller("Champion", ['$scope', 'users', 'documents', 'maintainers', function($scope,users,documents,maintainers){
	var champ = this;
	var baseDate = new Date("February 26, 2015 12:13:00");
	champ.relevantDocs = [],
		champ.comHolder = [],
		champ.comments = [],
		champ.allReplies = [],
		champ.repliedTo = [], // need to delete after demo
		champ.currentDoc = {},
		champ.currentCom = {},
		champ.replying = champ.inited = false,
		champ.user = {};
	champ.loading = {
		reply: false,
		review: false,
		main: true,
		comments: false
	}

	var valid = function(doc){
		if(doc.resources.comments && doc.resources.self)
			return true;
		else
			return false;
	}

	// take relevant props of doc objects and put them in array
	// this limits the amount of data sent to the server
	var aggregateDocs = function(all){
		var docHolder = [];
		for(var i = 0 ; i < all.length ; i++){
			if(!valid(all[i]))
				continue;
			var doc = {
				doc: all[i].resources.html.ref,
				api: parseInt(util.lastPart(all[i].resources.self.ref)),
				commentsUrl: all[i].resources.comments.ref,
				title: all[i].subject,
				commentCount: all[i].replyCount
			}
			docHolder.push(doc);
		//	champ.getDocComments(resp.content.list[i], "doc_id");
		}
		return docHolder;
	}
	var aggregateComments = function(comments){
		var comResp = [];
		for(var i = 0 ; i < comments.length ; i++){
			var created = util.fixDate(comments[i].published);
			var now = new Date();
			if(created > baseDate){
			//	console.log("YES");
				c = {
					api: util.lastPart(comments[i].id),
					content: util.lastPart(comments[i].rootURI),
					index: i
				};
				comResp.push(c);
				champ.comHolder.push(comments[i]);
			}
		}
		return comResp;
	}
	champ.setReplying = function(status,com){
		champ.replying = status;
		if(status)
			champ.currentCom = com;
		else
			champ.currentCom = {};
		util.adjustHeight();
	}
	champ.newMaintainer = function(com){
		champ.currentCom = com;
		champ.loading.review = true;
		maintainers.createCommentMaintainer(com).success(function(resp){
			if(resp.status == 0)
				com.being_reviewed = util.toggle(com.being_reviewed);
			champ.loading.review = false;
		});
	}
	champ.isCurrent = function(com){
		if(com == champ.currentCom)
			return true;
		else
			return false;
	}
	champ.showComments = function(doc){
		champ.currentDoc = doc;
		champ.loading.comments = true;
		champ.comments = [];
		champ.comHolder = [];
		documents.getComments(doc.commentsUrl).execute(function(resp){
			var allComments = resp.content.list;
			var coms = aggregateComments(allComments);
			champ.checkAndInitComments(coms);
		});
	}
	champ.checkAndInitComments = function(coms){
		documents.checkAndInitComments(coms).success(function(resp){
			console.log("COMS", resp);
			console.log("HOLDER", champ.comHolder);
			champ.comments = util.merge(champ.comHolder, resp);
			console.log(champ.comments);
			champ.inited = true;
			champ.loading.comments = false;
			util.adjustHeight();
		});
	}
	champ.checkForNewComments = function(docs){
		documents.checkForNewComments(docs).success(function(resp){
			champ.relevantDocs = resp.newComments;
			console.log("DOCS",champ.relevantDocs);
			champ.loading.main = false;
			util.adjustHeight();
		});
	}
	champ.getByParticipated = function(){
		champ.loading.main = true; // finished in chechForNewComments
		documents.getParticipated().execute(function(resp){
			var docHolder = aggregateDocs(resp.content.list);
			champ.checkForNewComments(docHolder);
		});
	}
	champ.getByTag = function(tag){
		documents.getByTag(tag).execute(function(resp){
			console.log("TAG", resp);
			var docHolder = aggregateDocs(resp.content.list);
			champ.checkForNewComments(docHolder);
		});
	}
	champ.getDocComments = function(doc, from){
		documents.getComments(doc.resources.comments.ref).execute(function(resp){
			champ.replying = false;
		});
	}
	champ.init = function(user, callback){
		users.getExtendedProperties(user).execute(function(resp){
			champ.user.extendedProperties = resp.content;
			$scope.$apply(champ.user);
		});
	}
	champ.replyToComment = function(com, body){
		champ.loading.reply = true;
		documents.replyToComment(com, body).execute(function(resp){
			champ.repliedTo.push(com.id);
			console.log("REPLIED", com);
			champ.loading.reply = false;
			champ.replying = false;
			$scope.$apply(champ.posting);
			$scope.$apply(champ.replying);
		//	if(resp.status == 201)
		//		com.replied; 
		});
	}
	champ.toggleResolved = function(doc, com){
		console.log(com);
		if(com.resolved){
			doc.dif++;
			com.resolved = false;
		}
		else{
			doc.dif--;
			com.resolved = true;
		}
		documents.toggleResolved(doc, com).success(function(data){
			if(data.status != 0)
				alert("Something went wrong...");
		});
	}
	champ.hasReplied = function(com){
		if(champ.repliedTo.indexOf(com.id) > -1)
			return true;
		else
			return false;
		console.log("REPLIED", champ.repliedTo.indexOf(com.id));
	}
	champ.checkAuthor = function(c){
		if(c.author == window._jive_current_user.displayName)
			return c.resolved ? "You" : "You (resolve to clear)";
		else
			return c.author;
	}
	champ.unsetCurrentDoc = function(){
		champ.currentDoc = {};
		util.adjustHeight();
	}

	// on page load
	gadgets.util.registerOnLoadHandler(function() {
		navigation.init(gadgets.views.getParams(), function(){
			gadgets.window.adjustHeight();
			champ.user = {
				jive_id: window._jive_current_user.id,
				username: window._jive_current_user.username,
				name: window._jive_current_user.name
			};
			console.log("Champ", champ.user);
			champ.init(champ.user, champ.getByParticipated());
		//	champ.init(champ.user, champ.getByTag('jmc-demo-tag'));
		});
	});

}]);

