(function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget","ckEditor"], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		widget.component.platformEditor = function(obj, oOption, oAttr, oCss){
			var oWidget, $widget, attr, option, css,
				$selector, id;


				$selector = obj;
				option = oOption;
				attr = oAttr;
				css = oCss;

				$selector.attr('id',id);
				id = attr.id;
				CKEDITOR.replace(id);

				/*编译阶段渲染代码*/
				return {
					getter: function () {
						return CKEDITOR.instances[attr.id].getData();
					},
					setter: function (value) {
						return CKEDITOR.instances[attr.id].setData(value);
					},
					display: function (result, input1, input2, condition) {
						this[result ? 'hide' : 'show']();
					},
					show: function () {
						$selector.next().removeClass('hide');
					},
					hide: function () {
						$selector.next().addClass('hide');
					}
				}
			};

		return widget;
	});
})();
