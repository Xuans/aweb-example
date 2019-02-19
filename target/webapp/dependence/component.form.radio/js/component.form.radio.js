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
			widget.component.form.radio = function (obj, oOption, oAttr, oCss) {
				
				Form.renderForm(obj, oOption, 'radio', oCss);

				return {
					getValue: function () {
						var $widget = obj, $selector,
							value,
							attr = oAttr;
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