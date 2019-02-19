(function(undefined) {

    (function(factory) {
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
    (function($, widget) {
        "use strict";

        //根据容器决定渲染方法
        function determineRenderByCtn(obj, oOption, oAttr, oCss, auiCtx) {
            var  $selector, $container, widgetType;

                $selector = obj;
                //获取父容器的类型
                $container = $selector.parent('div');
                widgetType = $container.attr('data-widget-type');


            if (widgetType === 'aweb4FoundationRowCtn') {

                renderBtnGroupInFoundationForm(obj, oOption, oAttr, oCss, auiCtx)

            }else{
                renderDefaultBtnGroup(obj, oOption, oAttr, oCss, auiCtx);
            }
        }

        //渲染在foundationFrom行容器上使用的按钮组
        function renderBtnGroupInFoundationForm(obj, oOption, oAttr, oCss, auiCtx) {

            var
                $selector,$template,
                template = "<div data-widget-type='aweb4Foundation ButtonGroup'></div>",
                render = function($selector, option, attr, event, css) {
                    var buttonGroupTemp = "<div class='btn-group horizonal'></div>",
                        buttonTemp = "<button class='btn btn-normal' type='button'>_name_</button>",
                        iconTmp = '<span><i class="_icon_"></i></span>',
                        classname,
                        classRegExp = /medium-\d+/,
                        $buttonGroup,
                        index = 1,
                        style,borderObj,i,btnConfig,
                        cssCode,className,
                        addButton = function($buttonGroup, btnConfig) {
                            var $button,
                                temp = buttonTemp.replace(/_name_/, btnConfig.name || ('buttion' + index));
                            $buttonGroup.append(temp);
                            $button = $('button:last', $buttonGroup);

                            btnConfig.id && $button.attr('id', btnConfig.id);
                            (btnConfig.status === 'disabled') && $button.attr('disabled', btnConfig.status);
                            btnConfig['data-authority'] && $button.attr('data-authority', btnConfig['data-authority']);

                            //处理按钮位置
                            if (option.btnLocation) {
                                $button.closest('div').css('text-align', option.btnLocation);
                            }

                            if (btnConfig.useIcon && btnConfig.icon) {
                                var btnText = $button.html();
                                temp = iconTmp.replace(/_icon_/, btnConfig.icon);
                                //图标在右边
                                if (btnConfig.iconPosition === 1) {
                                    $button.html(btnText + temp);
                                    $('span', $button).css('padding-left', '10px');
                                } else {
                                    //图标在左边
                                    $button.html(temp + btnText);
                                    $('span', $button).css('padding-right', '10px');
                                }
                            }

                            //添加事件配置中的selector
                            event || (event = {});
                            event.selector || (event.selector = []);
                            event.selector.push({
                                'desp': '按钮"' + $button.text() + '"',
                                'value': '###_ID## ' + 'button:eq(' + (index - 1) + ')'
                            });

                            index++;
                        };

                    buttonGroupTemp = buttonGroupTemp
                        .replace(/_label_/, "medium-" + option.label || "");

                    classname = $selector.attr("class");

                    if (classRegExp.test(classname)) {
                        $selector.attr("class", classname.replace(classRegExp, "medium-" + option.span));
                    } else {
                        $selector.addClass("medium-" + option.span);
                    }

                    $selector.addClass("columns");

                    $selector.append(buttonGroupTemp);

                    $buttonGroup = $('.btn-group', $selector);

                    attr.id && $buttonGroup.attr('id', attr.id);

                    //处理布局方向
                    if (!option.horizonal) {
                        $buttonGroup.removeClass('horizonal').addClass('vertical');
                    }

                    if (option.button) {
                        for (i = 0; i < option.button.length; i++) {
                            btnConfig = option.button[i];
                            addButton($buttonGroup, btnConfig);
                        }
                    }

                    //样式处理
                    if (!$.isEmptyObject(css) && css.theme) {
                        css.theme['function']  && $buttonGroup.find("button").removeClass().addClass('btn ' + css.theme['function']);
                    }

                    if (css &&  (style = css.style) && !$.isEmptyObject(style)) {
                        if(style.border){
                            borderObj = JSON.parse(JSON.stringify(style.border));
                            borderObj && (style.border = $.extend(true,{},style.border,{'border-color':borderObj['border-color']+'!important'}));
                            $selector.find("button").css('cssText','border-color:'+borderObj['border-color']+'!important');
                        }

                        $selector.find("button").css($.extend({}, style.icon, style.border, style.font, style.size, style.backgroundColor));
                        style.hover && $AW.cssHover('.btn', $selector, style.hover, ':hover')
                    }
                    if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                        $selector.addClass(className);
                    }

                };

                $selector = obj;
                $selector.after(template);
                $template = $selector.next();
                $selector.remove();
                $selector = $template;

                render($selector, oOption, oAttr, oCss);

        }

        //渲染默认的buttonGroup
        function renderDefaultBtnGroup($selector, option, oAttr, css, auiCtx) {
            var
                buttonTemp = '<button type="button" class="btn  btn-focus" >_name_</button>',
                iconTmp = '<span><i class="_icon_"></i></span>',
                index = 1,i,
                style,borderObj,
                addButton = function($buttonGroup, btnConfig) {
                    var $button,
                        temp = buttonTemp.replace(/_name_/, btnConfig.name || ('buttion' + index));

                    $buttonGroup.append(temp);
                    $button = $('button:last', $buttonGroup);

                    btnConfig.id && $button.attr('id', btnConfig.id);
                    btnConfig.status === 'disabled' && $button.attr('disabled', btnConfig.status);
                    btnConfig['data-authority'] && $button.attr('data-authority', btnConfig['data-authority']);

                    if (btnConfig.useIcon && btnConfig.icon) {
                        var btnText = $button.html();
                        temp = iconTmp.replace(/_icon_/, btnConfig.icon);
                        //图标在右边
                        if (btnConfig.iconPosition === 1) {
                            $button.html(btnText + temp);
                            $('span', $button).css('padding-left', '10px');
                        } else {
                            //图标在左边
                            $button.html(temp + btnText);
                            $('span', $button).css('padding-right', '10px');
                        }
                    }

                    index++;
                };


            if (option.button && option.button.length) {
                for ( i = 0; i < option.button.length; i++) {
                    addButton($selector, option.button[i]);
                }

                //处理布局方向
                if (!option.horizonal) {
                    $selector.css('display', 'inline-block');
                    $selector.find('button').css('display', 'block');

                    //处理按钮位置
                    if (option.btnLocation) {
                        $selector.parent('div').css('text-align', option.btnLocation);
                    }
                } else {
                    //处理按钮位置
                    if (option.btnLocation) {
                        $selector.css('text-align', option.btnLocation);
                    }
                }
            }

            //样式处理
            if (!$.isEmptyObject(css) && css.theme) {
                css.theme['function'] && $selector.find("button").removeClass().addClass('btn ' +  css.theme['function'] );
            }
            if (css && (style = css.style) && !$.isEmptyObject(style)) {
                borderObj = JSON.parse(JSON.stringify(style.border));
                borderObj && (style.border = $.extend(true,{},style.border,{'border-color':borderObj['border-color']+'!important'}));
                $selector.find("button").css('cssText','border-color:'+borderObj['border-color']+'!important');
                $selector.find("button").css($.extend({}, style.icon, style.border, style.font, style.size, style.backgroundColor));
                style.hover && $AW.cssHover('button', $selector, style.hover,':hover');
            }

            if (css && css.cssCode && css.cssCode.className) {
                $selector.addClass(css.cssCode.className)
            }

        }

        if(!widget.component.btn){
            widget.component.btn={};
        }
        widget.component.btn.btnGroup=function(obj, oOption, oAttr, oCss, auiCtx) {
            determineRenderByCtn(obj, oOption, oAttr, oCss, auiCtx);

            return {
	            display: function (result, input1, input2, condition) {
		            this[result ? 'hide' : 'show']();
	            },
	            show: function () {
		            obj.removeClass('hide');
	            },
	            hide: function () {
		            obj.addClass('hide');
	            }
            }
        };

        return widget;
    });
})();