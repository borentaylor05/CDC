
app.directive("appendEp", function(){
	var html = '<div class="row added" ng-repeat="(key,value) in u.extProps">'+
		        		'<div class="col-xs-5"><input type="text" class="form-control ep" ></div>'+
		        		'<div class="col-xs-5"><input type="text" class="form-control ep" ></div>'+
		        	'</div>';
	return function(scope, el, attrs){
		el.bind("click", function(){
			el.parent().parent().prev().append(html);
		});
	}
});

app.directive("remover", function($http, users){
	return {
			restrict: "E",
			template: '<button class="btn btn-xs btn-danger pull-right remover">Remove All</button>',
			scope: {
				callback: "&",
				person: "="
			},
			link: function(scope, el, attrs){
				el.bind("click", function(){
					if(confirm("Are you sure you want to delete extended properties for "+scope.person.employee_id+"? ")){
						var cb = scope.callback,
						p = scope.person;
						users.deleteExtendedProperty(scope.person).execute(function(resp){
							cb({ user: p });
						});
					}
				});
		}
	}
});

app.directive("saveEps", function(users){
	return {
		scope: {
			inputClass: "@",
			person: "=",
			status: "=",
			callback: "&"
		},
		link: function(scope, el, attrs){			
			el.bind("click", function(){
				var cb = scope.callback;
				var id = (scope.person.jive_id),
					p = scope.person,
					props = {},
					c = 0;
				scope.status = true;
				scope.$apply(scope.status);
				$(scope.inputClass).each(function(){
					if(c % 2 === 0)
						key = $(this).val().trim();
					else{
						props[key] = $(this).val().trim();
					}
					c++;
				});
				users.getExtendedProperties(scope.person).execute(function(resp){
					var clientExists = false;
					for (var key in props) {
					    resp.content[key] = props[key];
					    if(key === "client"){
					    	clientExists = true;
					    	util.rails.update_client(id, props[key].toLowerCase());
					    }
					}
					if(!clientExists)
						util.rails.update_client(id, null);
					if(!util.isEmpty(props)){
						users.createExtendedProperties(p, props).execute(function(resp){
							// console.log(resp);
						});
					}
					else{
						alert("You must include a property to set.");
					}
				});
			});
		}
	}
});

app.controller("Users", ['$scope', 'users', function($scope, users){
	var u = this;
	u.onload = true;
	u.people = [];
	u.extProps = [];
	u.epsSaved = false;

	u.getAll = function(count, start){
		u.epsSaved = false;
		users.getAll(count, start).success(function(resp){
			console.log(resp);
			if(status == 0)
				u.people = resp.users;
			console.log(u.people[0]);
		});
	}
	u.getEPs = function(person){
		u.epsSaved = false;
		$("#saveEdit").removeClass("hide");
		u.current = person;
		users.getExtendedProperties(person).execute(function(resp){
			u.extProps = resp.content;
			$scope.$apply(u.extProps);
		});
	}
	u.clear = function(){
		u.getAll();
		$(".ep").each(function(){
			var cur = $(this).val();
			if(cur.length < 1){
				$(this).remove();
			}
		});
		$(".added").each(function(){
			$(this).remove();
		});
	}
	u.search = function(term){
		users.search(term).success(function(resp){
			u.people = resp.users;
		});
	}
	u.meetsCriteria = function(person){
		return true;
	}
	// on page load
	if(u.onload == true)
		u.getAll();

}]);