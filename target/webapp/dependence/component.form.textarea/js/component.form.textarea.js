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
            define(["jquery", "widget","component.form"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,Form) {
        "use strict";
        widget.component.form.textarea = function (obj, oOption, oAttr, oCss) {

                Form.renderForm(obj, oOption, 'textarea', oCss);

                return {
                    getter: function () {
                        return $(obj).val();
                    },
                    setter: function (data) {
                        if (typeof data === 'string') {
                            return $(obj).val(data);
                        } else if (typeof data === 'object') {
                            $(obj).prop(data.attr).val(data.value);
                        }
                    }
                }
            
        };
    });
})();