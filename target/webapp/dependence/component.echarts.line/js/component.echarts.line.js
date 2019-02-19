
/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

    "use strict";
    (function (factory) {

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "echarts","component.echarts"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,echarts,Component) {
        "use strict";
        
        widget.component.echarts.line=function(obj, oOption){
            var $div, option, auiCtx;
                $div            = obj;
                option          = $.extend(true, {}, oOption);
                auiCtx          = arguments[4];
                option.series = option.series.elements || option.series || [];//keys和fields可以在这里取到

                return Component.renderCharts($div, option, 'line', auiCtx);
        };

        return widget;
    });
})();
