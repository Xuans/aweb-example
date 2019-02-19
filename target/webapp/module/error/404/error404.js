define([ "jquery" ], function() {

	return {
		load : function($el, scope, handler) {

			if(handler.errorMsg) {
				$el.find('#error404Msg', handler.errorMsg);
			}

			console.log('load',handler.cacheId);
		},
		unload : function($el,scope,handler) {
			console.log('unload',handler.cacheId);
		},
		pause : function($el, scope, handler) {
			console.log('pause',handler.cacheId);
		},
		resume : function($el, scope, handler) {

			console.log('resume',handler.cacheId);
		}
	};
});