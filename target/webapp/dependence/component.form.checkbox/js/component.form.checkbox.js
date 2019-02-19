/**
 * Created by quanyongxu@agree.com.cn on 2016/8/15 0015.
 */
/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", "component.form"], factory);
		}
		// global
		else {
			factory();
		}

	})
		(function ($, widget, Form) {
			"use strict";
			widget.component.form.checkbox = function (obj, oOption, oAttr, oCss) {
				var option,$widget, attr, $selector, value;

				//render模式 input框
				option = oOption;
				$widget = obj;
				attr = oAttr;
				Form.renderForm(obj, option, 'checkbox', oCss);

				return {
					getValue: function () {
						$selector = ($widget.closest('form').length !== 0 ? $widget.closest('form') : $widget.parent());
						$selector.find('input[name="' + attr.name + '"]').each(function () {
							if (this.checked === true) {
								value = this.value;
							}
						});
						return value;
					}
				}


			};
		});
})();