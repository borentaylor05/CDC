var templates = {
	jive: {
		comment: {
			"content": {
				"type": "text/html", 
				"text": "<body><p>This is a comment</p></body>"
			},
			"parent": "",
			"type": "comment"
		}
	},
	docHolder: '<div class="overlayHolder row">'+
			'<div class="col-xs-9 docHolder">'+
				'<h1 class="title">  </h1>'+
			'</div>'+
			'<div class="col-xs-3 commentHolder">'+
			'</div>'+
		'</div>',
	modal: '<div class="modal-header">'+
	        '<h3 class="modal-title">Im a modal!</h3>'+
	    '</div>'+
	    '<div class="modal-body">'+
	        '<h4>Extended Properties <span class="tiny"><strong>(Do not change these unless you know what you are doing!)</strong></span></h4>'+
        '<form id="extpropsForm">'+
        	'<div class="row">'+
        		'<div class="col-xs-5"><strong>Key</strong></div>'+
        		'<div class="col-xs-5"><strong>Value</strong></div>'+
        	'</div><div id="epList">'+
        	'<div class="row">'+
			        		'<div class="col-xs-5"><input type="text" class="form-control ep" value=""></div>'+
			        		'<div class="col-xs-5"><input type="text" class="form-control ep" value=""></div>'+
			        	'</div>'+
	    '</div>'+
	    '</div><div class="row">'+
			        		'<div class="col-xs-3"><button id="addEP" class="btn btn-sm btn-info"><i class="fa fa-plus"></i>&nbspAdd EP</button></div>'+
			        	'</div>'+
			'</form>'+
	    '<div class="modal-footer">'+
	        '<button class="btn btn-primary" ng-click="u.ok()">OK</button>'+
	        '<button class="btn btn-warning" ng-click="u.cancel()">Cancel</button>'+
	    '</div>',

	skeheader: '<div class="container clearfix navContainer">'+
					'<div class="navbar-header ">'+
					  '<a class="navbar-brand" href="#">SKE Management</a>'+
					'</div>'+
				'</div>',

	manage_sidebar: '<div id="sidebar-wrapper">'+
				        '<ul class="sidebar-nav">'+
				            '<li class="sidebar-brand">'+
				                '<a href="#">'+
				                    'Actions'+
				                '</a>'+
				            '</li>'+
				            '<ul class="navList">'+
							'</ul>'+
				        '</ul>'+
				    '</div>',

    care_sidebar: '<div id="sidebar-wrapper">'+
				        '<ul class="sidebar-nav">'+
				            '<li class="sidebar-brand">'+
				                '<a href="#">'+
				                    'General'+
				                '</a>'+
				            '</li>'+
				            '<ul class="">'+
				            	'<li>Products</li>'+
				            	'<li>Geos</li>'+
				            	'<li>Mastheads</li>'+
				            	'<li>Systems</li>'+
				            	'<li>Processes</li>'+
				            	'<li>Packages Inc Benefits</li>'+
							'</ul>'+
							'<li class="sidebar-brand">'+
				                '<a href="#">'+
				                    'Special'+
				                '</a>'+
				            '</li>'+
				            '<ul class="">'+
				            	'<li>Billing</li>'+
				            	'<li>Membership</li>'+
				            	'<li>Subs Sales</li>'+
				            	'<li>Retention / Saves</li>'+
							'</ul>'+
				        '</ul>'+
				    '</div>'
}