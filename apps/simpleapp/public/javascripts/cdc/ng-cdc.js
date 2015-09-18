app.directive('stopEvent', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if(attr && attr.stopEvent)
                element.bind(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
        }
    };
 });

app.factory('atoz', function($http){
	var atoz = {};

	atoz.getRange = function(start, end){
		return $http.get(util.rails_env.current+"/cdc/api/get-range?start="+start+"&end="+end);
	}
	atoz.topicSearch = function(term){
		return $http.get(util.rails_env.current+"/cdc/api/search?search="+term);
	}
	atoz.getTopic = function(topic){
		return $http.get(util.rails_env.current+"/cdc/api/topic?id="+topic.id);
	}

	return atoz;
});

app.factory('addressBook', function($http){
	var addressBook = {};

	addressBook.getEntries = function(){
		return $http.get(util.rails_env.current+"/cdc/address-book");
	}
	addressBook.getEntry = function(entry){
		return $http.get(util.rails_env.current+"/cdc/address-book/entry?id="+entry.id);
	}

	return addressBook;
});

app.factory('people', function($http){
	var people = {};

	people.get = function(limit){
		return osapi.jive.core.get({
	        	"href": "/people?count="+limit,
	        	"v": "v3"
	   		});
	}

	return people;
});

app.factory('countries', function(){
	var countries = {};

	countries.all = [{"name":"Afghanistan","doc":"DOC-304717"},{"name":"Albania","doc":"DOC-304120"},{"name":"Algeria","doc":"DOC-304120"},{"name":"American Samoa","doc":"DOC-304120"},{"name":"Andorra","doc":"DOC-304120"},{"name":"Anegada (see Virgin Islands, British )","doc":"DOC-304120"},{"name":"Angola","doc":"DOC-304719"},{"name":"Anguilla (UK)","doc":"DOC-304120"},{"name":"Antigua and Barbuda","doc":"DOC-304120"},{"name":"Argentina","doc":"DOC-304717"},{"name":"Armenia","doc":"DOC-304120"},{"name":"Aruba","doc":"DOC-304120"},{"name":"Austral Islands (see French Polynesia (France))","doc":"DOC-304120"},{"name":"Australia","doc":"DOC-304120"},{"name":"Austria","doc":"DOC-304120"},{"name":"Azerbaijan","doc":"DOC-304717"},{"name":"Azores","doc":"DOC-304120"},{"name":"Bahamas, The","doc":"DOC-304120"},{"name":"Bahrain","doc":"DOC-304120"},{"name":"Bangladesh","doc":"DOC-304717"},{"name":"Barbados","doc":"DOC-304120"},{"name":"Barbuda (see Antigua and Barbuda)","doc":"DOC-304120"},{"name":"Belarus","doc":"DOC-304120"},{"name":"Belize","doc":"DOC-304717"},{"name":"Benin","doc":"DOC-304719"},{"name":"Bermuda (UK)","doc":"DOC-304120"},{"name":"Bhutan","doc":"DOC-304717"},{"name":"Bolivia","doc":"DOC-304717"},{"name":"Bonaire (see Netherlands Antilles)","doc":"DOC-304120"},{"name":"Bora-Bora (see French Polynesia (France))","doc":"DOC-304120"},{"name":"Bosnia and Herzegovina","doc":"DOC-304120"},{"name":"Botswana","doc":"DOC-304717"},{"name":"Brazil","doc":"DOC-304717"},{"name":"British Indian Ocean Territory (UK)","doc":"DOC-304120"},{"name":"Brunei","doc":"DOC-304120"},{"name":"Bulgaria","doc":"DOC-304120"},{"name":"Burkina Faso","doc":"DOC-304719"},{"name":"Burma (Myanmar)","doc":"DOC-304717"},{"name":"Burundi","doc":"DOC-304719"},{"name":"Caicos Islands (see Turks and Caicos Islands (UK))","doc":"DOC-304120"},{"name":"Cambodia","doc":"DOC-304717"},{"name":"Cameroon","doc":"DOC-304719"},{"name":"Canada","doc":"DOC-304120"},{"name":"Canary Islands (Spain)","doc":"DOC-304120"},{"name":"Cape Verde","doc":"DOC-304717"},{"name":"Cayman Islands (UK)","doc":"DOC-304120"},{"name":"Central African Republic","doc":"DOC-304719"},{"name":"Chad","doc":"DOC-304719"},{"name":"Chile","doc":"DOC-304120"},{"name":"China","doc":"DOC-304717"},{"name":"Christmas Island (Australia)","doc":"DOC-304120"},{"name":"Cocos (Keeling) Islands (Australia)","doc":"DOC-304120"},{"name":"Colombia","doc":"DOC-304717"},{"name":"Comoros","doc":"DOC-304719"},{"name":"Congo, Republic of the","doc":"DOC-304719"},{"name":"Cook Islands (New Zealand)","doc":"DOC-304120"},{"name":"Costa Rica","doc":"DOC-304120"},{"name":"Côte d'Ivoire","doc":"DOC-304719"},{"name":"Croatia","doc":"DOC-304120"},{"name":"Cuba","doc":"DOC-304120"},{"name":"Curaçao (see Netherlands Antilles)","doc":"DOC-304120"},{"name":"Cyprus","doc":"DOC-304120"},{"name":"Czech Republic","doc":"DOC-304120"},{"name":"Democratic Republic of the Congo","doc":"DOC-304719"},{"name":"Denmark","doc":"DOC-304120"},{"name":"Djibouti","doc":"DOC-304719"},{"name":"Dominica","doc":"DOC-304120"},{"name":"Dominican Republic","doc":"DOC-304717"},{"name":"Dubai (see United Arab Emirates)","doc":"DOC-304120"},{"name":"Easter Island (Chile)","doc":"DOC-304120"},{"name":"Ecuador","doc":"DOC-304717"},{"name":"Egypt","doc":"DOC-304120"},{"name":"El Salvador","doc":"DOC-304717"},{"name":"England (see United Kingdom)","doc":"DOC-304120"},{"name":"Equatorial Guinea","doc":"DOC-304719"},{"name":"Eritrea","doc":"DOC-304717"},{"name":"Estonia","doc":"DOC-304120"},{"name":"Ethiopia","doc":"DOC-304717"},{"name":"Falkland Islands (Islas Malvinas)","doc":"DOC-304120"},{"name":"Faroe Islands (Denmark)","doc":"DOC-304120"},{"name":"Fiji","doc":"DOC-304120"},{"name":"Finland","doc":"DOC-304120"},{"name":"France","doc":"DOC-304120"},{"name":"French Guiana (France)","doc":"DOC-304717"},{"name":"French Polynesia (France)","doc":"DOC-304120"},{"name":"Gabon","doc":"DOC-304719"},{"name":"Galápagos Islands (see Ecuador)","doc":"DOC-304717"},{"name":"Gambia, The","doc":"DOC-304719"},{"name":"Georgia","doc":"DOC-304120"},{"name":"Germany","doc":"DOC-304120"},{"name":"Ghana","doc":"DOC-304719"},{"name":"Gibraltar (UK)","doc":"DOC-304120"},{"name":"Greece","doc":"DOC-304120"},{"name":"Greenland (Denmark)","doc":"DOC-304120"},{"name":"Grenada","doc":"DOC-304120"},{"name":"Grenadines (see Saint Vincent and the Grenadines)","doc":"DOC-304120"},{"name":"Guadeloupe","doc":"DOC-304120"},{"name":"Guam (US)","doc":"DOC-304120"},{"name":"Guatemala","doc":"DOC-304717"},{"name":"Guernsey (see United Kingdom)","doc":"DOC-304120"},{"name":"Guinea","doc":"DOC-304719"},{"name":"Guinea-Bissau","doc":"DOC-304719"},{"name":"Guyana","doc":"DOC-304717"},{"name":"Haiti","doc":"DOC-304719"},{"name":"Holy See (see Italy)","doc":"DOC-304120"},{"name":"Honduras","doc":"DOC-304717"},{"name":"Hong Kong SAR (China)","doc":"DOC-304120"},{"name":"Hungary","doc":"DOC-304120"},{"name":"Iceland","doc":"DOC-304120"},{"name":"India","doc":"DOC-304717"},{"name":"Indonesia","doc":"DOC-304717"},{"name":"Iran","doc":"DOC-304717"},{"name":"Iraq","doc":"DOC-304120"},{"name":"Ireland","doc":"DOC-304120"},{"name":"Isle of Man (see United Kingdom)","doc":"DOC-304120"},{"name":"Israel","doc":"DOC-304120"},{"name":"Italy","doc":"DOC-304120"},{"name":"Ivory Coast (see Côte d'Ivoire)","doc":"DOC-304719"},{"name":"Jamaica","doc":"DOC-304120"},{"name":"Japan","doc":"DOC-304120"},{"name":"Jersey (see United Kingdom)","doc":"DOC-304120"},{"name":"Jordan","doc":"DOC-304120"},{"name":"Jost Van Dyke (see Virgin Islands, British )","doc":"DOC-304120"},{"name":"Kazakhstan","doc":"DOC-304120"},{"name":"Kenya","doc":"DOC-304717"},{"name":"Kiribati","doc":"DOC-304120"},{"name":"Kuwait","doc":"DOC-304120"},{"name":"Kyrgyzstan","doc":"DOC-304120"},{"name":"Laos","doc":"DOC-304717"},{"name":"Latvia","doc":"DOC-304120"},{"name":"Lebanon","doc":"DOC-304120"},{"name":"Lesotho","doc":"DOC-304120"},{"name":"Liberia","doc":"DOC-304719"},{"name":"Libya","doc":"DOC-304120"},{"name":"Liechtenstein","doc":"DOC-304120"},{"name":"Lithuania","doc":"DOC-304120"},{"name":"Luxembourg","doc":"DOC-304120"},{"name":"Macau SAR (China)","doc":"DOC-304120"},{"name":"Macedonia","doc":"DOC-304120"},{"name":"Madagascar","doc":"DOC-304719"},{"name":"Madeira Islands (Portugal)","doc":"DOC-304120"},{"name":"Malawi","doc":"DOC-304719"},{"name":"Malaysia","doc":"DOC-304717"},{"name":"Maldives","doc":"DOC-304120"},{"name":"Mali","doc":"DOC-304719"},{"name":"Malta","doc":"DOC-304120"},{"name":"Marquesas Islands (see French Polynesia (France))","doc":"DOC-304120"},{"name":"Marshall Islands","doc":"DOC-304120"},{"name":"Martinique (France)","doc":"DOC-304120"},{"name":"Mauritania","doc":"DOC-304717"},{"name":"Mauritius","doc":"DOC-304120"},{"name":"Mayotte (France)","doc":"DOC-304719"},{"name":"Mexico","doc":"DOC-304717"},{"name":"Micronesia, Federated States of","doc":"DOC-304120"},{"name":"Monaco","doc":"DOC-304120"},{"name":"Mongolia","doc":"DOC-304120"},{"name":"Montenegro","doc":"DOC-304120"},{"name":"Montserrat (UK)","doc":"DOC-304120"},{"name":"Moorea (see French Polynesia (France))","doc":"DOC-304120"},{"name":"Morocco","doc":"DOC-304120"},{"name":"Mozambique","doc":"DOC-304719"},{"name":"Namibia","doc":"DOC-304717"},{"name":"Nauru","doc":"DOC-304120"},{"name":"Nepal","doc":"DOC-304717"},{"name":"Netherlands Antilles","doc":"DOC-304120"},{"name":"Netherlands, The","doc":"DOC-304120"},{"name":"New Caledonia (France)","doc":"DOC-304120"},{"name":"New Zealand","doc":"DOC-304120"},{"name":"Nicaragua","doc":"DOC-304717"},{"name":"Niger","doc":"DOC-304719"},{"name":"Nigeria","doc":"DOC-304719"},{"name":"Niue (New Zealand)","doc":"DOC-304120"},{"name":"Norfolk Island (Australia)","doc":"DOC-304120"},{"name":"North Korea","doc":"DOC-304717"},{"name":"Northern Ireland (see United Kingdom)","doc":"DOC-304120"},{"name":"Northern Mariana Islands (US)","doc":"DOC-304120"},{"name":"Norway","doc":"DOC-304120"},{"name":"Oman","doc":"DOC-304120"},{"name":"Pakistan","doc":"DOC-304717"},{"name":"Palau","doc":"DOC-304120"},{"name":"Panama","doc":"DOC-304717"},{"name":"Papua New Guinea","doc":"DOC-304717"},{"name":"Paraguay","doc":"DOC-304717"},{"name":"Peru","doc":"DOC-304717"},{"name":"Philippines","doc":"DOC-304717"},{"name":"Pitcairn Islands (UK)","doc":"DOC-304120"},{"name":"Poland","doc":"DOC-304120"},{"name":"Portugal","doc":"DOC-304120"},{"name":"Puerto Rico (US)","doc":"DOC-304120"},{"name":"Qatar","doc":"DOC-304120"},{"name":"Réunion (France)","doc":"DOC-304120"},{"name":"Romania","doc":"DOC-304120"},{"name":"Rota (see Northern Mariana Islands (US))","doc":"DOC-304120"},{"name":"Rurutu (see French Polynesia (France))","doc":"DOC-304120"},{"name":"Russia","doc":"DOC-304120"},{"name":"Rwanda","doc":"DOC-304719"},{"name":"Saba (see Netherlands Antilles)","doc":"DOC-304120"},{"name":"Saint Barthelemy (France) (see Guadeloupe)","doc":"DOC-304120"},{"name":"Saint Eustasius (see Netherlands Antilles)","doc":"DOC-304120"},{"name":"Saint Helena (UK)","doc":"DOC-304120"},{"name":"Saint Kitts and Nevis","doc":"DOC-304120"},{"name":"Saint Lucia","doc":"DOC-304120"},{"name":"Saint Maarten (see Netherlands Antilles)","doc":"DOC-304120"},{"name":"Saint Martin (France) (see Guadeloupe)","doc":"DOC-304120"},{"name":"Saint Pierre and Miquelon (France)","doc":"DOC-304120"},{"name":"Saint Vincent and the Grenadines","doc":"DOC-304120"},{"name":"Saipan (see Northern Mariana Islands (US))","doc":"DOC-304120"},{"name":"Samoa","doc":"DOC-304120"},{"name":"San Marino","doc":"DOC-304120"},{"name":"São Tomé and Príncipe","doc":"DOC-304719"},{"name":"Saudi Arabia","doc":"DOC-304717"},{"name":"Scotland (see United Kingdom)","doc":"DOC-304120"},{"name":"Senegal","doc":"DOC-304719"},{"name":"Serbia","doc":"DOC-304120"},{"name":"Seychelles","doc":"DOC-304120"},{"name":"Sierra Leone","doc":"DOC-304719"},{"name":"Singapore","doc":"DOC-304120"},{"name":"Slovakia","doc":"DOC-304120"},{"name":"Slovenia","doc":"DOC-304120"},{"name":"Society Islands (see French Polynesia (France))","doc":"DOC-304120"},{"name":"Solomon Islands","doc":"DOC-304719"},{"name":"Somalia","doc":"DOC-304719"},{"name":"South Africa","doc":"DOC-304717"},{"name":"South Georgia and the South Sandwich Islands (U.K.)","doc":"DOC-304120"},{"name":"South Korea","doc":"DOC-304717"},{"name":"South Sandwich Islands (see South Georgia and the South Sandwich Islands (UK))","doc":"DOC-304120"},{"name":"South Sudan","doc":"DOC-304719"},{"name":"Spain","doc":"DOC-304120"},{"name":"Sri Lanka","doc":"DOC-304717"},{"name":"Sudan","doc":"DOC-304719"},{"name":"Suriname","doc":"DOC-304717"},{"name":"Swaziland","doc":"DOC-304717"},{"name":"Sweden","doc":"DOC-304120"},{"name":"Switzerland","doc":"DOC-304120"},{"name":"Syria","doc":"DOC-304120"},{"name":"Tahiti (see French Polynesia (France))","doc":"DOC-304120"},{"name":"Taiwan","doc":"DOC-304120"},{"name":"Tajikistan","doc":"DOC-304717"},{"name":"Tanzania","doc":"DOC-304717"},{"name":"Thailand","doc":"DOC-304717"},{"name":"Timor-Leste (East Timor)","doc":"DOC-304719"},{"name":"Tinian (see Northern Mariana Islands (US))","doc":"DOC-304120"},{"name":"Tobago (see Trinidad and Tobago)","doc":"DOC-304120"},{"name":"Togo","doc":"DOC-304719"},{"name":"Tokelau (New Zealand)","doc":"DOC-304120"},{"name":"Tonga","doc":"DOC-304120"},{"name":"Tortola (see Virgin Islands, British )","doc":"DOC-304120"},{"name":"Trinidad and Tobago","doc":"DOC-304120"},{"name":"Tubuai (see French Polynesia (France))","doc":"DOC-304120"},{"name":"Tunisia","doc":"DOC-304120"},{"name":"Turkey","doc":"DOC-304717"},{"name":"Turkmenistan","doc":"DOC-304120"},{"name":"Turks and Caicos Islands (UK)","doc":"DOC-304120"},{"name":"Tuvalu","doc":"DOC-304120"},{"name":"Uganda","doc":"DOC-304719"},{"name":"Ukraine","doc":"DOC-304120"},{"name":"United Arab Emirates","doc":"DOC-304120"},{"name":"United Kingdom","doc":"DOC-304120"},{"name":"Uruguay","doc":"DOC-304120"},{"name":"Uzbekistan","doc":"DOC-304120"},{"name":"Vanuatu","doc":"DOC-304719"},{"name":"Vatican City (see Italy)","doc":"DOC-304120"},{"name":"Venezuela","doc":"DOC-304717"},{"name":"Vietnam","doc":"DOC-304717"},{"name":"Virgin Gorda (see Virgin Islands, British )","doc":"DOC-304120"},{"name":"Virgin Islands, British","doc":"DOC-304120"},{"name":"Wake Island","doc":"DOC-304120"},{"name":"Wales (see United Kingdom)","doc":"DOC-304120"},{"name":"Western Sahara","doc":"DOC-304717"},{"name":"Yemen","doc":"DOC-304717"},{"name":"Zambia","doc":"DOC-304719"},{"name":"Zanzibar (see Tanzania)","doc":"DOC-304717"},{"name":"Zimbabwe","doc":"DOC-304719"}];

	return countries;
});

app.directive("elWidth", function(){
	return function(scope, el, attrs){
		el.css("width", attrs.elWidth);
	}
});


app.controller("cdcController", ['$http', '$scope', 'atoz', 'addressBook', 'people', 'countries', 'gamification', function($http, $scope, atoz, addressBook, people, countries, gamification){
	var cdc = this;
	cdc.dualSearch = true;
	cdc.showOverlay = cdc.showNew = cdc.postingComment = false;
	cdc.currentDoc = null; // jive id of current doc
	cdc.topics = [];
	cdc.prs = [];
	cdc.prSearchTerm = "";
	cdc.testComments = [];
	cdc.currentTopic = {};
	cdc.currentEntry = {};
	cdc.countries = countries.all;
	cdc.loading = {
		prs: false,
		topics: false,
		ab: false
	}

	cdc.getAllTopics = function(start, end){
		// call function from factory
		var realEnd;
		switch(end){
			case "E":
				realEnd = "D";
			break;
			case "K":
				realEnd = "J";
			break;
			case "S":
				realEnd = "R";
			break;
			case "Z":
				realEnd = "Z";
			break;
		}
		cdc.topicSearchTerm = start+"-"+realEnd;
		cdc.loading.topics = true;
		atoz.getRange(start, end).success(function(resp){
			resp = util.fixResp(resp);
			cdc.topics = resp.topics;
			cdc.loading.topics = false;
		});
	}
	cdc.getComments = function(docID){
		osapi.jive.core.get({
	        "href": "/contents/"+docID,
	        "v": "v3"
	    }).execute(function(resp){
	    	resp = util.fixResp(resp);
	    	cdc.comStartIndex = resp.replyCount;
	    	if((cdc.comStartIndex - 25) >= 0)
	    		cdc.comStartIndex -= 25;
	    	else
	    		cdc.comStartIndex = 0;
	    	$scope.$apply(cdc.comStartIndex);
	    	osapi.jive.core.get({
		        "href": "/contents/"+docID+"/comments?startIndex="+cdc.comStartIndex.toString(),
		        "v": "v3"
		    }).execute(function(resp){
		    	resp = util.fixResp(resp);
		    	cdc.testComments = resp.list.reverse();
		    	$scope.$apply(cdc.testComments);
		    	cdc.setCurrentDoc(docID)
		    });
	    });
	}
	cdc.setShowNew = function(){
		cdc.showNew = true;
	}
	cdc.setCurrentDoc = function(id){
		cdc.currentDoc = id;
	}
	cdc.newComment = function(body){
		cdc.postingComment = true;
		var data = {
			"content": { "type": "text/html", "text": body },
			"type": "comment"
		}
		osapi.jive.core.post({
			"href": "/contents/"+cdc.currentDoc+"/comments",
			"v": "v3",
			"body": data
		}).execute(function(resp){
			resp = util.fixResp(resp);
			$("#clear").val("");
			cdc.showNew = false;
			cdc.postingComment = false;
			cdc.getComments(cdc.currentDoc);
		});
	}	
	cdc.searchTopics = function(term){
		$scope.data.atoz = null;
		cdc.topicSearchTerm = term;
		cdc.loading.topics = true;
		atoz.topicSearch(term).success(function(resp){
			resp = util.fixResp(resp);
			cdc.topics = resp.topics;
			cdc.loading.topics = false;
		});
		if(cdc.dualSearch){
			cdc.prSearchTerm = term;
			cdc.prSearch(term);
		}
	}
	cdc.getTopic = function(topic){
		if(cdc.currentTopic == topic)
			cdc.currentTopic = {};
		else{
			cdc.currentTopic = topic;
			atoz.getTopic(topic).success(function(resp){
				resp = util.fixResp(resp);
				cdc.topicInfo = resp.topic;
			});
		}
		if(cdc.dualSearch)
			cdc.prSearch(topic.topic);
	}
	cdc.getEntries = function(){
		cdc.loading.ab = true;
		addressBook.getEntries().success(function(resp){
			resp = util.fixResp(resp);
			cdc.entries = resp.entries;
			cdc.loading.ab = false;
		});
	}
	cdc.getEntry = function(entry){
		if(cdc.currentEntry != entry){
			cdc.emptied = false;
			cdc.currentEntry = entry;
			addressBook.getEntry(entry).success(function(resp){
				resp = util.fixResp(resp);
				cdc.entryInfo = resp.entry;
			});
		}
		else
			cdc.currentEntry = null;

	}
	cdc.hasAttachment = function(prefix, doc){
		var tags = doc.tags;
		if(tags.indexOf(prefix+"-attachment") >= 0)
			return true;
		else
			return false;
	}
	cdc.stopProp = function($event){
		$event.stopPropagation();
	}
	cdc.prSearch = function(pr){
		cdc.loading.prs = true;
		cdc.prSearchTerm = pr;
		osapi.jive.core.get({
	        	"href": "/search/contents?filter=search("+pr+")",
	        	"v": "v3"
	    	}).execute(function(resp){
		    	resp = util.fixResp(resp);
		    	cdc.prs = resp.list;
		    	cdc.loading.prs = false;
		    	$scope.$apply(cdc.prs);
	    });
	}
	cdc.isCurrentTopic = function(topic){
		if(topic == cdc.currentTopic)
			return true;
		else
			return false;
	}
	cdc.isCurrentEntry = function(entry){
		if(entry == cdc.currentEntry)
			return true;
		else
			return false;
	}
	cdc.getLeaders = function(){
		gamification.leaderboard().success(function(resp){			
	    	resp = util.fixResp(resp);
	    	console.log(resp);
	    	cdc.leaders = resp.leaders;
	    });
	}
	cdc.getTopThree = function(){
		gamification.top_three().success(function(resp){
			resp = util.fixResp(resp);
			if(resp.status === 0){
				cdc.top_three = resp.missions;
			}
		});
	};
	cdc.getDocNum = function(url){
		return util.lastPart(url);
	};
	cdc.close = function(input){
		switch(input){
			case "ab":
				$scope.ab = null;
			break;
			case "atoz":
				cdc.topics = [];
			break;
			case "pr":
				cdc.prs = [];
			break;
			case "countries":
				$scope.data.countries = [];
			break;
		}
	};
	cdc.gameInit = function(){
		cdc.getLeaders();
		cdc.getTopThree();
	};
	cdc.getAvatarUrl = function(user){
		var cur = "https://social.teletech.com/api/core/v3/people/";
		return cur+user.jive_id+"/avatar";
	};
	cdc.newTab = function(doc){
		alert(doc.resources.html.ref);
	};
	cdc.getDocNum = function(doc){
		var parts = doc.resources.html.ref.split("/");
		return parts[parts.length-1];
	};
	cdc.getDocs = function(prefix, category){
		osapi.jive.core.get({
	        "href": "/contents?filter=tag("+prefix+"-"+category+")&count=100",
	        "v": "v3"
	    }).execute(function(resp){
	    	resp = util.responseCheck(resp);
	    	category = category.replace("-", "");
	    	// you don't know which will finish first, so merge the arrays if length > 0
	    	if(cdc[category] && cdc[category].length > 0){
	    		cdc[category].push.apply(cdc[category], resp.list);	    		
	    	}
	    	else{
	    		cdc[category] = resp.list;
	    	}
	    //	console.log("For: "+prefix+"-"+category, cdc[category]);
	    	$scope.$apply(cdc[category]);
	    	util.adjustHeight();
	    });
	};
	cdc.getRecent = function(){
		osapi.jive.core.get({
	        "href": "/activities/recent/content",
	        "v": "v3"
	    }).execute(function(resp){
	    	resp = util.fixResp(resp);
	    //	console.log(resp);
	    	cdc.recentDocs = resp.list;
	    });
	};
	gadgets.util.registerOnLoadHandler(function() {
		navigation.init($http, function(){
			// on page load
			cdc.currentUser = window._jive_current_user;
			cdc.getEntries();
			cdc.gameInit();
			cdc.getDocs("cdc", "quicklinks");
			cdc.getDocs("cdc", "jobaids");
		//	cdc.getDocs("cdc", "program-flow");
			cdc.getRecent();
			setInterval(function(){ cdc.getRecent(); }, 30000);
			util.adjustHeight();
		});							
	});
}]);




