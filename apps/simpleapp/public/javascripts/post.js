var post = {
	// params has client, jive_id, title and text properties
	save: function(params, callback){
		gadget_helper.post(util.rails_env.current+"/update", params, function(resp){
			callback(resp);
		});
	},
	display: function(client, callback){
		if(!client || client === "all"){
			gadget_helper.get(util.rails_env.current+"/posts", {}, function(resp){
				console.log("RESP", resp);
				var posts = JSON.parse(resp.text);
				for(var i = 0 ; i < posts.length ; i++){
					if(posts[i].type === "update")
						var icon = "fa-quote-left";
					else
						var icon = "fa-file-text-o";
					$("#postContainer").append(post.format(icon, posts[i]));		
				}
				callback();
			});
		}
	},
	format: function(icon, postObj){
		if(postObj.type === "content")
			var t = '<a class="showDoc" id="'+postObj.id+'" href="#">'+postObj.title+'</a>';
		else
			var t = postObj.title;
		var format = '<div class="post">'+
						'<h4><i class="fa '+icon+'"></i>&nbsp&nbsp '+t+'<span class="tiny">'+postObj.updated+'</span></h4>'+
						'<p>'+postObj.body+'</p>'+
					'</div>';
		return format;
	}
}