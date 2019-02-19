( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";
	
	widget.component.platformSplitBar=function(){
			var $widget = arguments[0];
			return {
				display: function (result, input1, input2, condition) {
					this[result ? 'hide' : 'show']();
				},
				show: function () {
					$widget.removeClass('hide');
				},
				hide: function () {
					$widget.addClass('hide');
				}
			}
	};

        return widget;
    });
})();