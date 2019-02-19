/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author lihao01@agree.com.cn
 */
(/* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "bootstrap-switch", 'component.foundationForm'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        function renderSwitch($selector, option, attr, css, formOption, auiCtx) {var setValue = function (data) {
                    switcher.bootstrapSwitch('setState', data || false);
                },
                getValue = function () {
                    return $(switcher.get()).attr('checked') ? true : false;
                };

            var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
                horizontalTemp = "<label title='_label_'>_label__mustInput_</label><div class='switch'><input type='checkbox' /></div>",
                inlineTemp = "<div class='columns'>" +
                    "<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
                    "</div>" +
                    "<div class='columns'>" +
                    "<div class='switch'><input type='checkbox' /></div>" +
                    "</div>",
                classname,
                $input,
                switcher,
                style,
                returnValue,
                isInline = formOption.formLayout === 'inline',
                labelAlign = option.labelAlign || formOption.labelAlign,
                template = isInline ? inlineTemp : horizontalTemp,
                span = option.span || formOption.span,
                labelSpan = option.labelSpan || formOption.labelSpan,
                openText = option.openText || "开",
                closeText = option.closeText || "关";
            if (auiCtx) {
                template = template
                    .replace(/_label_/g, $AW.nsl(option.label, $selector.attr('id'), auiCtx) || "")
                    .replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
                openText = $AW.nsl(openText, $selector.attr('id'), auiCtx);
                closeText = $AW.nsl(closeText, $selector.attr('id'), auiCtx);
            }

            if (isInline) {
                $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                    template,
                    labelSpan,
                    labelAlign,
                    auiCtx,
                    "aweb4FoundationSwitch",
                    attr);
                attr.id && $selector.attr('id', attr.id);

            } else {
                $selector.append(template);
                widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
            }

            $input = $selector.find("input");
            switcher = $input.bootstrapSwitch({
                onText: openText,
                offText: closeText,
//                    state : option.defaultOpen,
                readonly: option.disabled,
                labelWidth: Number(option.labelWidth) || '20px',
                handleWidth: Number(option.handleWidth) || '24px'

            });
            setValue(option.defaultOpen);


            returnValue = {
                setValue: setValue,
                getValue: getValue,

                // 一个行为类型方法的 实现
                display: function (result, input1, input2, condition) {
                    this[result ? 'hide' : 'show']();
                },

                /*
                 *   @show   弹窗行为
                 *       @e      Event Handler   事件句柄
                 *       @size   Object
                 *           @height     String  高度
                 *           @width      String  宽度
                 *   占位符为 ##_var##.接口名(e,size);
                 * */
                show: function () {
                    $selector.removeClass('hide');
                    isInline && $selector.prev(".columns").removeClass('hide');
                },

                /*
                 *   @hide   隐藏行为
                 * */
                hide: function () {
                    $selector.addClass('hide');
                    isInline && $selector.prev(".columns").addClass('hide');
                },
                disabled: function (value) {

                    var $switch = $selector.find('.switch');
                    if (value) {
                        switcher.bootstrapSwitch('disabled', true);
                    } else {
                        switcher.bootstrapSwitch('disabled', false);
                    }
                },
                resetValue: function () {
                    switcher.bootstrapSwitch('setState', false);
                },
                mustInput: function (flag) {
                    var $label = $('[title="'+option.label+'"]',$selector);

                    $label.empty();
                    if(flag === true){
                        $label.html(option.label+mustInputTemp)
                    }else{
                        $label.html(option.label)
                    }
                }

            };


            //自定义样式
            if (css && css.cssCode && css.cssCode.className) {
                $selector.addClass(css.cssCode.className)
            }
            if (css && (style = css.style)) {
                if (style.title) {
                    if (!isInline) {
                        $selector.find('label').css(style.title);
                    } else {
                        if (typeof auiCtx === 'undefined') {
                            $selector.children().first().find('label').css(style.title);
                        } else {
                            $selector.prev().find('label').css(style.title);
                        }

                    }
                }
                style.position && $selector.css(style.position);
                style.radius && $selector.find('.bootstrap-switch').css(style.radius);
                style['switch'] && $('div.switch', $selector).css(style['switch']);
                style.open && $AW.cssHover('.bootstrap-switch.bootstrap-switch-on', $selector, style.open, '');
                style.open && $AW.cssHover('.bootstrap-switch .bootstrap-switch-handle-on.bootstrap-switch-primary', $selector, style.open, '');
                style.open && $AW.cssHover('.bootstrap-switch .bootstrap-switch-handle-on.bootstrap-switch-default', $selector, style.open, '');
                style.close && $AW.cssHover('.bootstrap-switch.bootstrap-switch-wrapper.bootstrap-switch-off', $selector, style.close, '');
                style.close && $AW.cssHover('.bootstrap-switch .bootstrap-switch-handle-off.bootstrap-switch-primary', $selector, style.close, '');
                style.close && $AW.cssHover('.bootstrap-switch .bootstrap-switch-handle-off.bootstrap-switch-default', $selector, style.close, '');
                style.disabled && $AW.cssHover('.bootstrap-switch.bootstrap-switch-wrapper.bootstrap-switch-readonly', $selector, style.disabled, '');
                /*style.disabled && $AW.cssHover('.bootstrap-switch .bootstrap-switch-handle-off.bootstrap-switch-default',$selector,style.disabled,'');*/
            }

            return returnValue;
        }

        if (!widget.component.foundationForm) {
            widget.component.foundationForm = {};
        }
        widget.component.foundationForm.foundationSwitch = function ($selector, oOption, oAttr, oCss, auiCtx) {
            var
                formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')];

            return renderSwitch($selector, oOption, oAttr, oCss, formOption || {}, auiCtx);
        };

        return widget;
    });
})();