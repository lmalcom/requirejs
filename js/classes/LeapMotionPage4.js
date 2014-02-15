define(['LeapMotionPage3'], function(LMP){ 
	var LeapMotionPage4 = {}; 
	//Page View 
	LeapMotionPage4 = LMP.extend({ 
		events: _.extend({}, LMP.prototype.events, {
			'keydown': 'changePage'
		}), 
		defaultCSS: _.extend({}, LMP.defaultCSS, { 
			'background':'url("images/black_lozenge.png")', 
			'.btn': {
				'width':'200px',
				'height':'200px', 
				'display':'inline-block',
				'float':'left',
				'margin':'10px',
				'border':'1px dotted rgba(0,0,0,.3)',
				'background-color':'rgba(0,0,0,.5)',
			},
			'.btn:hover': {
				'background-color':'rgba(0,0,0,.8)',
			}
		}), 
		className: LMP.prototype.className + ' LeapMotionPage4', 
		
	});  
	return LeapMotionPage3; 
}); 