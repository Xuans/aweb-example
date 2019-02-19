
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

        widget.component.text=function(obj, oOption){
	        var oWidget, $widget, attr, option,
		        $selector;

		        $widget=obj;
		        option=oOption;

		        if(option&&$.trim(option.content)){
			        $widget.html(option.content);
				}
				
				return {
					getter: function () {
						return $widget.html();
					},
					setter: function (value) {
						$widget.empty().append(value);
					},
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