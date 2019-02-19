
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
        var renderLoginCtn = function ($selector, option,attr,css, auiCtx) {
                var $widgetpannel, $widgetHeader,
                    $logoWarp,$logoPanel,$logoImg,
                    timeStamp = '?version='+app.getUID();
                if ($selector.length) {
                    $selector.wrap('<div class="login-panel"></div>').removeAttr('id');

                    $widgetpannel = $selector.parent();
                    $widgetHeader = $('<div class="logo-bg login-circle-block" ><span class="login-logo"><i class=" fa fa-agree"></i></span></div><div class="login-item-title"></div>');

                    $widgetpannel.prepend($widgetHeader);

                } else {
                    $selector = $selector.children('.login-panel');

                    $widgetpannel = $selector;

                }
                $widgetpannel.attr('id', attr.id);
                //i18n
                if(auiCtx){
                    $widgetpannel.find('.login-item-title').empty().html($AW.nsl(option.header,attr.id,auiCtx) || '');
                }


                $logoPanel = $widgetpannel.find('.logo-bg');


                if(option.LogoPanel){
                    $logoPanel.removeClass('login-none-block').addClass('login-circle-block');

                }else{
                    $logoPanel.removeClass('login-circle-block').addClass('login-none-block');

                }
                $logoWarp =$logoPanel.find('.login-logo');

                if(option.logo && option.logo ==='icon'){

                    $logoWarp.empty().html('<i class="'+option.icon+'"></i>');

                }else if(option.img){
                    $logoImg= $('<img/>');
                    option.img.src = option.img.src+timeStamp;
                    $logoImg.attr(option.img);

                    $logoWarp.empty();
                    $logoImg.appendTo($logoWarp);
                }
                renderDivCtnCss($widgetpannel, css);
            },
            renderDivCtnCss = function ($selector, css) {
                var style;
                //自定义样式
                if(css && css.cssCode && css.cssCode.className){
                    $selector.addClass(css.cssCode.className)
                }
                if (!$.isEmptyObject(css) && css.style) {
                    style = css.style;
                    style.title && $selector.find('.login-item-title').css(style.title);
                    if(style.iconBlock) {
                        if($selector.find('.login-circle-block').length>0){
                            $AW.cssHover('.logo-bg.login-circle-block',$selector,style.iconBlock,'');
                        }else{
                            $AW.cssHover('.logo-bg.login-none-block',$selector,style.iconBlock,'');
                        }
                    }
                    style.icon && $selector.find('.login-logo').css(style.icon);
                    style.content && $selector.css(style.content);
                }

            };

        widget.ctn.loginCtn = function ($selector, option, attr, css, auiCtx) {

                renderLoginCtn($selector, option,attr,css, auiCtx);

                return {
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
            }

    });
})();