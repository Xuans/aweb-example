/**
 * Created by quanyongxu@agree.com.cn on 2016/8/18 0015.
 */
/*!
 * Javascript library v3.0
 *
 * Date: 2016.08.18
 */

/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

    "use strict";
    (function (factory) {

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "echarts", "component.echarts"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, echarts, Component) {
        "use strict";

        widget.component.echarts.pie = function ($selector, oOption) {
            var  option, auiCtx;

            option = $.extend(true, {}, oOption);
            option.data = option.data.elements || option.data || [];//keys和fields可以在这里取到
            auiCtx  = arguments[4];
            return Component.renderCharts($selector, option, 'pie',auiCtx);

        };

        return widget;
    });
})();
