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
            widget.component.form.input = function (obj, oOption, oAttr, oCss) {

                var option, j;

                //render模式 input框
                option = oOption;
                Form.renderForm(obj, option, option['input_type'], oCss);

                return {
                }

            };
        });
})();