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
			define(["jquery", "widget", 'ctn'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";
		
		widget.ctn.formCtn = function (obj, oOption, attr, oCss,auiCtx) {
			var Ctn=$AW.ctn,
				oWidget, $widget, option, css;

				$widget = obj;
				option = oOption;
				Ctn.renderHeader(oOption, obj, oCss,auiCtx);


			$widget
				.removeClass('form-inline form-horizontal')
				.addClass(option.formLayout)
				.off('.aweb4_2')
				.on('submit.aweb4_2', function () {
					return false;
				});

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