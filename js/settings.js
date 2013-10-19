window.Settings =  {
	"classes" : [],
	"page" : {
			"modelProps" : {
				"settings": {},
				"options" : {}
							
			}, 
			"viewProps": {
				'className':'Page'
			}, 
			"collection" : [
					{
						"modelProps": {
							"settings" : {
								'secret':'oh hey'
							}, 
							"options" : {}
						},
						"viewProps": {
							"css" : {
								"width":"100px", 
								"height":"100px",
								"background":"green"
							}
						}									
					},
					{ 
						"modelProps": {
							"settings" : {
								'wompem':'oh hey'
							}, 
							"options" : { 
							}
						}, 
						"viewProps": {
							"className":"Panel",
							"css" : {
								"width":"200px", 
								"height":"100px",
								"background":"blue"
							}
						}, 									
						"collection" :[ 
								{
									"modelProps": {
										"settings" : {
											'secret':'oh hey'
										}, 
										"options" : {}
									},
									"viewProps": {
										"css" : {
											"width":"70px", 
											"height":"100px",
											"background":"rgba(100,0,200, .7)", 
											"border-radius":"100%"
										}
									}									
								},
						]
					}
				]
				
			},
		}	
	
