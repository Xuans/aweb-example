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
            define(["jquery", "widget"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        widget.component.img = function($selector, option, attr,css,auiCtx){
            var
                timeStamp = '?version='+app.getUID();



                $selector.attr({
                    alt: $AW.nsl(option.alt, attr.id, auiCtx),
                    src: option.src+timeStamp || ''
                });
                //自定义样式
                if(css && css.cssCode && css.cssCode.className){
                    $selector.addClass(css.cssCode.className)
                }
                if(css.style && css.style.imgStyle){
                    $selector.css(css.style.imgStyle);
                }

                return {
                    getter: function () {
                        return JSON.stringify({alt:$selector.attr('alt'),src:$selector.attr('src')});
                    },
                    setter: function (value) {
                        var src;
                        if(value.src.indexOf('data:image')===0||value.src.indexOf('?') !== -1 ) {
	                        src = value.src;
                        }else{
                            src = value.src+timeStamp;
                        }
                        $selector.attr({'src':src, 'alt': value.alt});
                    },
                    display: function (result, input1, input2, condition) {
                        this[result ? 'hide' : 'show']();
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
