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
			define(["jquery", "widget",'ctn'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		widget.ctn.foundationRowCtn = function (obj, oOption, attr, oCss,auiCtx) {
            var Ctn = $AW.ctn,
                oWidget, $widget, option, css,formOption;

                $widget = obj;
                formOption = auiCtx.configs[$widget.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

                if(formOption.formLayout === 'inline'){
                    $widget.addClass('inline-form-ctn');
				}

                Ctn.renderHeader(oOption, obj, oCss,auiCtx);
                return {
	                display: function (result, input1, input2, condition) {
		                this[result ? 'hide' : 'show']();
	                },
	                show: function () {
		                $widget.removeClass('hide');
	                },
	                hide: function () {
		                $widget.addClass('hide');
	                },
                    setHeader: function (headerText) {
                        if(oOption.header){
                            Ctn.setHeader(headerText,obj);
                        }else{
                            oOption.header = headerText;
                            Ctn.renderHeader(oOption, obj, oCss,auiCtx);
                        }
                    }
                }

            };

		return widget;
	});
})();
