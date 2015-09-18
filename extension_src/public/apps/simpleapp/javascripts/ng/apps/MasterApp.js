
var app = angular.module("App", ['ngSanitize']);

app.filter('capitalize', function() {
	return function(input, all) {
		return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
	}
});

app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });

app.filter('parseUrlFilter', function () {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    return function (text, target, otherProp) {
        return text.replace(urlPattern, '<a target="' + target + '" href="$&">$&</a>');
    };
});

app.directive("showTitle", function(){
	return {
		scope: {
			game: "="
		},
		link: function(scope, el, attrs){
			el.bind("mouseover", function(){
				var info = $(el.parent().parent().find(".gInfo")[0]);
				info.text("");
				info.text(scope.game.bunchball_name+" - "+scope.game.description);
			});
		}
	} 
});

app.directive("leaderboard", function(){
	var view = "gamication-central".toString();
	var cur = "https://social.teletech.com";
	var api = cur+"/api/core/v3";
	return {
		restrict: "E",
		scope: {
			people: "=",
			user: "="
		},
		template: '<div class="widget text-center">'+
					'<h5 class="gHeader">Leaderboard</h5>'+
					'<div class="lob">For {{user.info.lob}} </div>'+
					'<load size="4em" text="Generating Leaderboard..." hide-on="people"></load>'+
					'<ul class="leaderboard text-left">'+
						'<li class="person" ng-repeat="person in people">'+
							'<a target="_blank" ng-href="'+cur+'/people/{{person.employee_id}}">'+
								'<img class="avatar pull-left" ng-src='+api+'/people/{{person.jive_id}}/avatar></img>'+
								'<div >'+
									'<span class="name"> {{ person.first_name }} {{ person.last_name }} </span>'+
									'<span class="metric"> Stack Rank: {{ person.rank }} </span> | '+
									'<span class="metric"> Tier: {{ person.tier }} </span> | '+
									'<span class="metric"> Comp Score: {{ person.comp_score }} </span>'+
								'</div>'+
							'</a>'+
						'</li>'+
					'</ul>'+
				'</div>'
	}
});

app.directive("myProgress", function(){
	return {
		restrict: "E",
		scope: {
			goal: '@',
			complete: '@'
		},
		template: 	'<div class="progress">'+
					  '<div class="progress-bar" role="progressbar" aria-valuenow="{{(complete / goal)*100}}" aria-valuemin="0" aria-valuemax="100" >'+
					    '{{(complete / goal)*100}}%'+
					  '</div>'+
					'</div>',
		link: function(scope, el, attrs){
			scope.percent = (scope.complete / scope.goal)*100;
			el.children().children().css({ "width": scope.percent+"%", "color": "black" });
		}
	}
});

app.directive("opendoc", function(){
	return {
		scope: {
			getComments: "&",
			openOverlay: "=",
			dynamic: "@"
		},
		link: function(scope, element, attrs){
			element.bind("click", function(){
				if(scope.dynamic)
					attrs.opendoc = scope.dynamic;
				scope.openOverlay = true;
				scope.$apply(scope.openOverlay);
				$(".doc-container, .coms").empty();
				$(".overlay, .sub-overlay").removeClass("hide");
				util.get_doc_html(util.fixDocNum(attrs.opendoc), function(id){
					util.adjustHeight();
					scope.getComments({doc: id});
				});
			});
		}
	} 
});

app.directive("loader", function(){
	return {
		restrict: "E",
		scope: {
			loading: "=", // boolean that determines whether to show spinner
			size: "@"
		},
		template: '<i ng-show="loading" class="fa fa-circle-o-notch fa-spin"></i>',
		link: function(scope, el, attrs){
			el.css("font-size", scope.size);
		}
	}
});
app.directive("load", function(){
	return {
		restrict: "E",
		scope: {
			hideOn: "=", // boolean that determines whether to show spinner
			size: "@",
			text: "@"
		},
		template: '<div ng-hide="hideOn"><i class="fa fa-spinner fa-spin"></i>'+
				  '<p ng-if="text"> {{ text }} </p></div>',
		link: function(scope, el, attrs){
			el.find("i").css("font-size", scope.size);
			el.find("p").css("font-size", ".8em");
		}
	}
});

app.directive("loaderCurrent", function(){
	return {
		restrict: "E",
		scope: {
			loading: "=", // boolean that determines whether to show spinner
			size: "@",
			showIf: "="
		},
		template: '<i ng-show="showIf && loading" class="fa fa-circle-o-notch fa-spin"></i>',
		link: function(scope, el, attrs){
			el.css("font-size", scope.size);
		}
	}
});

app.directive("unreadMessages", function(){
	var blank = "_blank";
	return{
		restrict: "E",
		template: '<div ng-controller="UnreadMessages as msgs" >'+
		'<div class="msg-overlay container" ng-if="msgs.overlay">'+
			'<button type="button" class="btn btn-danger pull-right" ng-click="msgs.setOverlay(false)">'+
  				'<i class="fa fa-close"></i>'+
			'</button>'+
			'<h2> You have {{ msgs.unread.length }} unread {{ msgs.unread.length > 1 ? "announcements" : "announcement" }} </h2>'+
			'<div ng-if="msgs.unread.length == 0" class="alert alert-success">'+
				'<h3>No Unread Announcements</h3>'+
				'<p>To view old messages go to: Create -> View Announcements </p>'+
				'<my-image route="view_messages.png"></my-image>'+
			'</div>'+
			'<div class="row container" ng-repeat="m in msgs.unread">'+
				'<h4>'+
					'{{ m.sender.name ? "Sender Name: " : "Sender ID: " }}'+
					'<a target="_blank" ng-href="/people/{{m.sender.employee_id}}"> {{ m.sender.name ? m.sender.name : m.sender.employee_id }} </a>'+
				'</h4>'+
				'<div class="msg-body" ng-class="{urgent: m.urgent}"> '+
					'<h2 style="margin-top: 0px;" ng-if="m.urgent">Urgent Announcement!</h2>'+
					'<p ng-bind-html="m.text | unsafe"></p>'+
					'<button class="btn btn-xs btn-success" ng-click="msgs.acknowledge(m)">Acknowledge</button>'+
				'</div>'+
			'</div>'+
		'</div>'+
		'</div>'
	}
});

app.directive("searchOverlay", function(){
	return {
		restrict: "E",
		scope: {
			showOn: "="
		},
		transclude: true,
		template: '<div ng-show="showOn"><div class="sub-overlay"></div><div class="overlay" ng-transclude></div></div>',
		link: function(scope,el,attrs){
			$(".sub-overlay").on("click touch", function(){
				scope.showOn = false;
				scope.$apply(scope.showOn);
			});
			el.find("i").on("click touch", function(){
				scope.showOn = false;
				scope.$apply(scope.showOn);
			});
		}
	}
});

app.directive("overlayTwo", function(){
	return {
		restrict: "E",
		scope: {
			comments: "=",
			showNew: "=",
			setShowNew: "&",
			newComment: "&",
			loading: "=",
			showOn: "="
		},
		template:   '<div ng-show="showOn"><div class="sub-overlay"></div>'+
					'<div class="overlay">'+
						'<div class="row" >'+
							'<div class="col-xs-9 doc-container">'+
							'</div>'+
							'<div class="col-xs-3 com-container">'+
							'<div class="text-center"><h4>Comments</h4>'+
							'<button class="btn btn-xs btn-info" ng-hide="showNew" ng-click="setShowNew()">New Comment</button></div>'+
							'<div class="text-center" id="nc" ng-if="showNew"><textarea placeholder="type comment here..." ng-model="data.body" class="form-control" id="clear"></textarea><button class="btn btn-success btn-xs" ng-click="newComment({body: data.body})">Submit</button><i ng-if="loading" class="fa fa-circle-o-notch fa-spin loader-xs"></i></div>'+
							'<div ng-repeat="c in comments" class="comment">'+
								'<h5>By <a target="_blank" ng-href="{{c.author.resources.html.ref}}">{{c.author.displayName}}</a></h5>'+
								'<div class="date">at {{ c.publishedTime }} {{ c.publishedCalendarDate }} </div>'+
								'<div class="body" ng-bind-html="c.content.text | unsafe">  </div>'+
							'</div>'+
							'</div>'+
						'</div>'+
					'</div></div>',
		link: function(scope, element, attrs){
				$(".sub-overlay").on("click touch", function(e){
					scope.showOn = false;
					scope.$apply(scope.showOn);
				});
			}
	}
		
});

app.directive("overlay", function(){
	return {
		restrict: "E",
		template: '<div class="sub-overlay hide"></div><div class="overlay hide"><i class="fa fa-close fa-3x pull-right pointer"></i><div class="doc-container"></div></div>',
		link: function(scope, element, attrs){
				element.find("i").first().css({ "color":attrs.closeColor });
				element.find("i").first().bind("click", function(){
					$(".overlay, .sub-overlay").addClass("hide");
				});
				$(".sub-overlay").on("click touch", function(e){
					$(this).addClass("hide");
					$(".overlay").addClass("hide");
				});
			}
	}
		
});

app.directive("jsTime", function(){
	return function(scope, el, attrs){
		var d = new Date(parseInt(attrs.jsTime));
		el.html("Acknowledged "+d);
	}
});

app.factory("messages", ['$http', function($http){
	var messages = {};

	messages.getAll = function(u){
		return $http.get(util.rails_env.current+"/messages/all?user="+u.jive_id);
	}
	messages.acknowledge = function(data){
		return $http.post(util.rails_env.current+"/message/acknowledge", data);
	}

	return messages;
}]);

app.factory("gamification", function($http){
	var game = {};

	game.top_three = function(){
		return $http.get(util.rails_env.current+"/api/gamification/"+window._jive_current_user.id+"/top-three");
	}

	game.leaderboard = function(){
		return $http.get(util.rails_env.current+"/api/gamification/leaderboard?user="+window._jive_current_user.id);
	}

	return game;
});


