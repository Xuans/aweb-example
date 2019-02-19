/*
 * v4.0
 *
 * Date: 2017.11.3
 */

/**
 * @author zhanghaixian@agree.com
 */
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

        widget.component.icon = function($selector, option, attr,css){
            var style;


                $selector.removeClass().addClass(option.icon);
                //自定义样式
                if(css && css.cssCode && css.cssCode.className){
                    $selector.addClass(css.cssCode.className)
                }
                if(css && (style = css.style)){
                    style.icon && $selector.css(style.icon);
                }
                return {
                    getter: function () {
                        return $selector.attr('class');
                    },
                    setter: function (value) {
                        $selector.removeClass().addClass(value.icon);
                    },
                    display: function (result, input1, input2, condition) {
                        this[result ? 'show' : 'hide']();
                    },
                    show: function () {
                        $selector.removeClass('hide');
                    },
                    hide: function () {
                        $selector.addClass('hide');
                    }
                }
            };


        return widget;
    });
})();
