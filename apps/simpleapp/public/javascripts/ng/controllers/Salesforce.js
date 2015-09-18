var ALIAS = 'salesforce';

app.controller("SF", ['salesforce', function(salesforce){
	var sf = this;
    sf.peopleMatches = [];
	var resources = {},
        user = window.parent._jive_current_user.ID;

	sf.getAccounts = function(){
        salesforce.accounts().success(function(resp){
            if(resp.status == 1 && resp.type == "oauth"){
                window.open(util.rails_env.current+"/salesforce/authenticate?user="+user, '_blank');
            }
            else{
                console.log(resp);
            }
        });
    }
    sf.searchForContact = function(name){
        salesforce.searchForContact(name).success(function(resp){
            console.log(resp);
            if(resp.status == 1 && resp.type == "oauth"){
                window.open(util.rails_env.current+"/salesforce/authenticate?user="+user, '_blank');
            }
            else{
                sf.peopleMatches = resp.results;
            }
        });
    }

}]);