(function (undefined) {

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

        //渲染在foundationForm上使用的按钮
        function renderBtnInFoundationForm($selector, option, attr, css, auiCtx) {
            var classname,
                btnTemplate = "<button class='btn' type='button'></button>",
                classRegExp = /medium-\d+/,
                $button,
                icon,
                useIcon,
                iconPosition,
                borderHColor, borderAColor,
                btnLocation, style, borderObj, btnClass,
                iconTmp, btnText,
                init = function () {

                    $button = $selector.find('button');
                    if (auiCtx) {
                        $button.text($AW.nsl(option.name, attr.id, auiCtx) || $AW.nsl(attr.desp, attr.id, auiCtx));
                    }
                    attr.id && $button.attr('id', attr.id);
                    attr['data-authority'] && $button.attr('data-authority', attr['data-authority']);
                    option.status === 'disabled' && $button.attr('disabled', option.status);

                    if (useIcon && icon) {
                        iconTmp = '<span><i class="' + icon + '"></i></span>';
                        btnText = $button.html();
                        //图标加在右边
                        if (iconPosition === 1||iconPosition==='right') {
                            $button.html(btnText + iconTmp);
                            $('span', $button).css('padding-left', '10px');
                        } else {
                            //图标加在左边
                            $button.html(iconTmp + btnText);
                            $('span', $button).css('padding-right', '10px');
                        }
                    }
                    if (btnLocation) {
                        $button.closest('div').css('text-align', btnLocation);
                    }

                };

            //把默认的模板替换掉
            $selector.wrap('<div/>');
            $selector = $selector.parent();

            option.icon && (icon = option.icon);
            option.useIcon && (useIcon = option.useIcon);
            option.iconPosition && (iconPosition = option.iconPosition);
            option.btnLocation && (btnLocation = option.btnLocation);

            classname = $selector.attr("class");

            if (classRegExp.test(classname)) {
                $selector.attr("class", classname.replace(classRegExp, "medium-" + option.span));
            } else {
                $selector.addClass("medium-" + option.span);
            }

            $selector.addClass("columns");

            init();

            $button = $selector.find('button');

            //样式处理
            if (css && css.theme) {
                if (css.theme['function']) {
                    $button.removeClass().addClass('btn ' + css.theme['function']);
                }
            }
            //自定义样式
            if (css && css.cssCode && css.cssCode.className) {
                $button.addClass(css.cssCode.className)
            }
            if (css && (style = css.style)) {
                borderObj = style.border && JSON.parse(JSON.stringify(style.border));

                if (btnClass = $button.prop('className')) {
                    btnClass = btnClass.split(' ')[1];
                }

                if (style.border && !$.isEmptyObject(borderObj) && borderObj['border-color']) {
                    style.border = $.extend(true, {}, style.border, {'border-color': borderObj['border-color'] + '!important'});
                }

                if (btnClass) {
                    $AW.cssHover('.btn.' + btnClass, $selector, $.extend({}, style.border, style.font, style.size, style.backgroundColor), '');
                    $AW.cssHover('.btn.' + btnClass + ' span i', $selector, style.icon, '');
                } else {
                    $AW.cssHover('.btn', $selector, $.extend({}, style.icon, style.border, style.font, style.size, style.backgroundColor), '');
                    $AW.cssHover('.btn' + ' span i', $selector, style.icon, '');
                }

                if (style.hoverBtn) {
                    if (borderHColor) {
                        style.hoverBtn = borderHColor && $.extend(true, {}, style.hoverBtn, {'border-color': borderHColor + '!important'});
                    }
                    if (btnClass) {
                        $AW.cssHover('.btn.' + btnClass, $selector, style.hoverBtn, ':hover');
                    } else {
                        $AW.cssHover('.btn', $selector, style.hoverBtn, ':hover');
                    }
                }

                if (style.activeBtn) {
                    borderAColor = JSON.parse(JSON.stringify(style.activeBtn))['border-color'];
                    style.activeBtn = borderAColor && $.extend(true, {}, style.activeBtn, {'border-color': borderAColor + '!important'});
                    if (btnClass) {
                        $AW.cssHover('.btn.' + btnClass, $selector, style.activeBtn, ':active');
                    } else {
                        $AW.cssHover('.btn', $selector, style.activeBtn, ':active');
                    }
                }
            }

        }


        //创建默认的按钮
        function renderDefaultBtn($button, option, attr, css, auiCtx) {
            var
                style, btnClass, borderObj, borderHColor, borderAColor,
                iconTmp, btnText;

            if (option) {
                //处理按钮位置
                if (option.btnLocation) {
                    $button.parent('div').css('text-align', option.btnLocation);
                }
                $button.text($AW.nsl(option.name, $button.attr('id'), auiCtx) || $AW.nsl('按钮', $button.attr('id'), auiCtx));

                if (option.useIcon && option.icon) {
                    iconTmp = '<span><i class="' + option.icon + '"></i></span>';
                    btnText = $button.html();
                    //图标加在右边
                    if (option.iconPosition === 1) {
                        $button.html(btnText + iconTmp);
                        $('span', $button).css('padding-left', '10px');
                    } else {
                        //图标加在左边
                        $button.html(iconTmp + btnText);
                        $('span', $button).css('padding-right', '10px');
                    }
                }
            }

            if (option.status === 'disabled') {
                $button.attr('disabled', 'true');
            }

            //样式处理
            if (!$.isEmptyObject(css) && css.theme) {
                if (css.theme['function']) {
                    $button.removeClass().addClass('btn ' + css.theme['function']);
                }
            }
            //自定义样式
            if (css && css.cssCode && css.cssCode.className) {
                $button.addClass(css.cssCode.className)
            }

            if (!$.isEmptyObject(css) && (style = css.style)) {

                if (btnClass = $button.prop('className')) {
                    btnClass = btnClass.split(' ')[1];
                }

                if (style.border) {
                    borderObj = JSON.parse(JSON.stringify(style.border));
                    if (!$.isEmptyObject(borderObj) && borderObj['border-color']) {
                        style.border = $.extend(true, {}, style.border, {'border-color': borderObj['border-color'] + '!important'});
                    }
                }
                if (btnClass) {
                    $AW.cssHover('.btn.' + btnClass, $button, $.extend({}, style.icon, style.border, style.font, style.size, style.backgroundColor), '', true);
                    $AW.cssHover('.btn.' + btnClass + ' span i', $button, style.icon, '', true);
                } else {
                    $AW.cssHover('.btn', $button, $.extend({}, style.icon, style.border, style.font, style.size, style.backgroundColor), '', true);
                    $AW.cssHover('.btn' + ' span i', $button, style.icon, '', true);
                }
                if (style.hoverBtn) {
                    borderHColor = JSON.parse(JSON.stringify(style.hoverBtn))['border-color'];
                    if (borderHColor) {
                        style.hoverBtn = borderHColor && $.extend(true, {}, style.hoverBtn, {'border-color': borderHColor + '!important'});
                    }
                    if (btnClass) {
                        $AW.cssHover('.btn.' + btnClass, $button, style.hoverBtn, ':hover', true);
                    } else {
                        $AW.cssHover('.btn', $button, style.hoverBtn, ':hover', true);
                    }
                }
                if (style.activeBtn) {
                    borderAColor = JSON.parse(JSON.stringify(style.activeBtn))['border-color'];
                    style.activeBtn = borderAColor && $.extend(true, {}, style.activeBtn, {'border-color': borderAColor + '!important'});
                    if (btnClass) {
                        $AW.cssHover('.btn.' + btnClass, $button, style.activeBtn, ':active', true);
                    } else {
                        $AW.cssHover('.btn', $button, style.activeBtn, ':active', true);
                    }
                }

            }
        }

        //根据容器决定渲染方法
        function determineRenderByCtn(obj, oOption, oAttr, oCss, auiCtx) {
            var $selector, $container, widgetType, ctnRenderMethodMap;

            $selector = obj;
            //获取父容器的类型
            $container = $selector.parent('div');
            widgetType = $container.attr('data-widget-type');


            if (widgetType === 'aweb4FoundationRowCtn') {
                renderBtnInFoundationForm(obj, oOption, oAttr, oCss, auiCtx);

            } else {
                renderDefaultBtn(obj, oOption, oAttr, oCss, auiCtx);
            }


        }

        if (!widget.component.btn) {
            widget.component.btn = {};
        }

        widget.component.btn.normalBtn = function ($selector, oOption, oAttr, oCss, auiCtx) {
            var timerKey = true;
            determineRenderByCtn($selector, oOption, oAttr, oCss, auiCtx);

            return {
                display: function (result, input1, input2, condition) {
                    this[result ? 'hide' : 'show']();
                },
                show: function () {

                    $selector.removeClass('hide');
                },
                hide: function () {
                    $selector.addClass('hide');
                },
                getter: function () {
                    return {
                        icon: oOption.icon,
                        name: oOption.name,
                        btnLocation: oOption.btnLocation,
                        iconPosition: oOption.iconPosition

                    };
                },
                setter: function (data) {
                    oOption.icon = data.icon;
                    oOption.name = data.name;
                    oOption.btnLocation = data.btnLocation;
                    oOption.iconPosition = data.iconPosition;
                    determineRenderByCtn($selector, oOption, oAttr, oCss, auiCtx);
                },
                reset: function (e) {
                    app.reset($selector.closest('form'));
                },
                disabled: function (value) {
                    var $button = $selector;
                    value ? $button.prop('disabled', true) : $button.prop('disabled', false);
                },
                verifyCodeCountdown: function ($input, num, text) { //废弃
                    var context = this,
                        updateTime = function () {
                            if (num !== 0) {
                                $input.attr("disabled", true);
                                context.setter({
                                    name: (text || '') + num + 's'
                                });

                                num--;
                            } else {
                                $input.removeAttr("disabled");
                                context.setter({
                                    name: "重新获取"
                                });
                                return;
                            }

                            setTimeout(function () {
                                updateTime()
                            }, 1000);
                        };
                    updateTime();
                },
                verifyCodeCountdownV2: function (num, text) {
                    var context = this,name=oOption.name,
                        updateTime = function () {
                            if (timerKey) {
                                if (num !== 0) {
                                    context.disabled(true);
                                    context.setter({
                                        name: (text || '') + num + 's'
                                    });
                                    num--;
                                } else {
                                    context.disabled(false);
                                    context.setter({
                                        name: "重新获取"
                                    });
                                    return;
                                }

                                setTimeout(function () {
                                    updateTime()
                                }, 1000);
                            }else{
                                timerKey = true;
                                context.disabled(false);
                                context.setter({
                                    name: name
                                });
                                determineRenderByCtn($selector, oOption, oAttr, oCss, auiCtx);
                            }
                        };
                    updateTime();


                },
                setLoading: function (value) {
                    var $button = $selector,
                        $Div = document.createElement("div");
                    $Div.className = 'loading-pic';
                    if (value) {
                        if ($button.children("div").length) {
                            return false;
                        }
                        $button.addClass('loading-btn');
                        $button.append($Div);
                        $Div.onclick = function (e) {
                            e.stopPropagation();
                        }
                    } else {
                        $button.children().remove('.loading-pic');
                        $button.removeClass("loading-btn")
                    }
                },
                resetCountdown: function () {
                    timerKey = false;
                }
            };
        };

        return widget;
    });
})();
