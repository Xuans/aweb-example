/*!
 * Javascript library v3.0
 *
 * Date: 2017.02.24
 */

/**
 * @author hefuxiang@agree.com.cn
 */
(/* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", 'component.foundationForm'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        function render($selector, option,attr,  css, formOption, auiCtx) {
            //格式化数据
            var formatData = function (value, inputType) {
                    var formatedData = 0,
                        //金额格式化
                        formatMoney = function (money, decimalCount, intSplitChar, floatSplitChar) {
                            var returnValue;
                            if (!money) {
                                if (inputType == 'floatAmount') {
                                    return parseFloat(0).toFixed(decimalCount);
                                }
                                return 0;
                            }
                            decimalCount = decimalCount >= 0 && decimalCount <= 20 ? decimalCount : 2;
                            money = parseFloat((money + "").replace(/[^\d\.-]/g, "")).toFixed(decimalCount) + "";
                            intSplitChar || (intSplitChar = '');
                            floatSplitChar || (floatSplitChar = '.');

                            var intPart = money.split(".")[0].split("").reverse(),
                                decimalPart = money.split(".")[1],
                                result = "";
                            for (var i = 0; i < intPart.length; i++) {
                                result += intPart[i] + ((i + 1) % 3 == 0 && (i + 1) != intPart.length ? intSplitChar : "");
                            }
                            if (decimalPart) {
                                returnValue = result.split("").reverse().join("") + floatSplitChar + decimalPart;
                            } else {
                                returnValue = result.split("").reverse().join("");
                            }
                            //处理格式化后值为-,111.123的情况，去掉分隔符
                            if (returnValue.length > 3) {
                                if (returnValue[0] == '-' && returnValue[1] == intSplitChar) {
                                    var intSplitCharIndex = returnValue.indexOf(intSplitChar);
                                    returnValue = returnValue.substring(0, intSplitCharIndex)
                                        + returnValue.substring(intSplitCharIndex + 1, returnValue.length);
                                }
                            }
                            return returnValue;
                        };

                    switch (inputType) {
                        case 'floatAmount':
                            formatedData = formatMoney(value, maxAccuracy, intSplitChar, floatSplitChar);
                            break;
                        case 'integerAmount':
                            formatedData = formatMoney(value, 0, intSplitChar);
                            break;
                        default:
                            formatedData = value;
                            break;
                    }
                    return formatedData;
                },
                //获取输入框光标位置
                getCursortPosition = function (ctrl) {
                    var CaretPos = 0;
                    // IE Support
                    if (document.selection) {
                        ctrl.focus();
                        var Sel = document.selection.createRange();
                        Sel.moveStart('character', -ctrl.value.length);
                        CaretPos = Sel.text.length;
                    }
                    // Firefox support
                    else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                        CaretPos = ctrl.selectionStart;
                    return (CaretPos);
                },
                //设置光标位置
                setCaretPosition = function (ctrl, pos) {
                    if (ctrl.setSelectionRange) {
                        ctrl.focus();
                        ctrl.setSelectionRange(pos, pos);
                    } else if (ctrl.createTextRange) {
                        var range = ctrl.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', pos);
                        range.moveStart('character', pos);
                        range.select();
                    }
                },
                //处理数据输入
                handleInput = function () {
                    var preValue = '', beforeVal = '',
                        preCursorPos,
                        isKeyPress = false;
                    $input.off('keydown.input.digitInput').on('keydown.input.digitInput', function (e) {
                        if (!isKeyPress) {
                            isKeyPress = true;
                            //获取当前输入前光标位置
                            preCursorPos = getCursortPosition(e.target);
                        }
                    });
                    $input.off('focus.input.digitInput').on('focus.input.digitInput', function (e) {
                        beforeVal = $input.val();
                    });
                    $input.off('keyup.input.digitInput').on('keyup.input.digitInput', function (e) {
                        //ctrl和shift都不处理
                        if (e.keyCode === 16 || e.keyCode === 17) {
                            return;
                        }
                        //按下shift，同时按下左方向键或者右方向键 不处理
                        if ((e.keyCode === 37 || e.keyCode === 39) && e.shiftKey) {
                            return;
                        }
                        //按下ctrl，同时按下c或者v或者a键 不处理
                        if ((e.keyCode === 67 || e.keyCode === 86 || e.keyCode === 65) && e.ctrlKey) {
                            return;
                        }

                        //获取输入后的光标位置
                        var cursorPos = getCursortPosition(e.target),
                            curVal = $(e.target).val(),
                            inputSuccess = false;

                        if (isKeyPress) {
                            isKeyPress = false;
                        }
                        switch (inputType) {
                            case 'floatAmount':
                                var regex = new RegExp('^-?\\d*\\.?\\d{0,' + maxAccuracy + '}$');
                                if (isNaN(curVal) && curVal !== '-') {
                                    inputSuccess = false;
                                } else if (!regex.test(curVal)) {//校验浮点精度
                                    inputSuccess = false;
                                } else {
                                    inputSuccess = true;
                                }
                                break;
                            case 'integerAmount':
                                var regex = /^-?\d*$/;
                                if (!regex.test(curVal) && curVal !== '-') {
                                    inputSuccess = false;
                                } else {
                                    inputSuccess = true;
                                }
                                break;
                            default:
                                inputSuccess = true;
                                break;
                        }
                        if (inputSuccess) {
                            preValue = curVal;
                            _setValue_(curVal);
                            $(e.target).val(curVal);
                            //设置输入后光标位置
                            setCaretPosition(e.target, cursorPos);
                        } else {
                            $(e.target).val(preValue);
                            //设置输入前光标位置
                            setCaretPosition(e.target, preCursorPos);
                        }
                        if (beforeVal !== $(e.target).val()) {
                            $input.trigger('ichange');
                        }
                    });
                },
                //处理数据输入
                handleDataFormatAndScopeCheck = function () {
                    //获取焦点事件
                    $input.off('focus.formatDataAndCheck').on('focus.formatDataAndCheck', function (e) {
                        var $target = $(e.target);
                        //恢复非格式化数据
                        $target.val(parseFloat(value).toString());
                        //清除错误样式
                        clearErrorStyle($target);
                    });

                    //失去焦点事件
                    $input.off('blur.formatDataAndCheck').on('blur.formatDataAndCheck', function (e) {
                        var formatedData,
                            $target = $(e.target),
                            curVal = $target.val();

                        if (curVal) {
                            if (!isNaN(curVal)) {
                                if (inputType == 'floatAmount' && maxAccuracy) {
                                    var regex = new RegExp('^-?\\d*\\.\\d{0,' + maxAccuracy + '}$');
                                    if (!regex.test(curVal)) {
                                        curVal = parseFloat(curVal).toFixed(maxAccuracy);
                                    }
                                }

                                //输入范围检查
                                if (scopeCheck(curVal)) {
                                    _setValue_(curVal);
                                } else {
                                    _setValue_(handleOutOfBorder(curVal));
                                    //                                app.alert('数值超出范围!', app.alert.ERROR);

                                    //设置错误样式
                                    if(option.minAmount && (curVal<option.minAmount)){
                                        setErrorStyle($target,"小于最小值"+option.minAmount);
                                    }else if(option.maxAmount && (curVal>option.maxAmount)){
                                        setErrorStyle($target,"大于最大值"+option.maxAmount);
                                    }


                                }
                            } else {
                                _setValue_(0);
                                setErrorStyle($target,'非法数值!');
                            }
                        }

                        $target.val(formatData(value, inputType));
                    });
                },
                //处理输入范围检查
                scopeCheck = function (curVal) {
                    var minAmount = option.minAmount,
                        maxAmount = option.maxAmount;
                    //下界和上界都配置
                    if (!isNaN(minAmount) && !isNaN(maxAmount)) {
                        var fValue = parseFloat(curVal);
                        //如果超出范围，重置为上次输入的值
                        if (fValue < minAmount || fValue > maxAmount) {
                            return false;
                        }
                    } else if (!isNaN(minAmount) && isNaN(maxAmount)) {
                        //只配置minAmount
                        var fValue = parseFloat(curVal);
                        if (fValue < minAmount) {
                            return false;
                        }
                    } else if (isNaN(minAmount) && !isNaN(maxAmount)) {
                        //只配置maxAmount
                        var fValue = parseFloat(curVal);
                        if (fValue > maxAmount) {
                            return false;
                        }
                    }
                    return true;
                },
                //增加
                increase = function (val) {
                    val || (val = 0);
                    val = parseFloat(val) + step;

                    val = handleOutOfBorder(val);

                    if (inputType === 'floatAmount') {
                        val = parseFloat(val).toFixed(maxAccuracy);
                    } else {
                        val = Math.floor(val);
                    }
                    return val;
                },
                //减少
                decrease = function (val) {
                    val = parseFloat(val) - step;

                    val = handleOutOfBorder(val);

                    if (inputType === 'floatAmount') {
                        val = parseFloat(val).toFixed(maxAccuracy);
                    } else {
                        val = Math.floor(val);
                    }
                    return val;
                },
                //设置值
                _setValue_ = function (val) {
                    val || (val = 0);
                    if (inputType === 'floatAmount') {
                        value = parseFloat(val).toFixed(maxAccuracy);
                    }
                    value = val;
                },
                //越界处理
                handleOutOfBorder = function (val) {
                    if (!scopeCheck(val)) {
                        if (!isNaN(minAmount) && val < minAmount) {
                            val = minAmount;
                        }
                        if (!isNaN(maxAmount) && val > maxAmount) {
                            val = maxAmount;
                        }
                    }
                    return val;
                },
                //处理按上下键增减数值
                handleValueChange = function () {
                    var preVal,
                        isUpKeyDown = false,
                        isDownKeyDown = false;
                    $input.off('keydown.changeValue').on('keydown.changeValue', function (e) {
                        //按下方向键“上”
                        if (e.keyCode === 38) {
                            //第一次按下方向键“上”
                            if (isUpKeyDown === false) {
                                preVal = value;
                            }
                            //增加
                            preVal = increase(preVal);

                            $input.val(preVal);

                            isUpKeyDown = true;
                        } else if (e.keyCode === 40) {
                            //按下方向键“下”
                            if (isDownKeyDown === false) {
                                preVal = value;
                            }
                            //减少
                            preVal = decrease(preVal);

                            $input.val(preVal);

                            isDownKeyDown = true;
                        }
                    });

                    $input.off('keyup.changeValue').on('keyup.changeValue', function (e) {
                        //按下方向键“上”
                        if (e.keyCode === 38) {
                            isUpKeyDown = false;

                            value = preVal;
                            $input.val(value);
                        } else if (e.keyCode === 40) {
                            //按下方向键“下”
                            isDownKeyDown = false;

                            value = preVal;
                            $input.val(value);
                        }
                    });
                },
                //处理按钮点击
                handleBtnClick = function () {
                    $lBtn.off('click.changValue').on('click.changValue', function () {
                        //减少
                        value = decrease(value);
                        $input.val(value);

                        $input.trigger('change');
                    });

                    $rBtn.off('click.changValue').on('click.changValue', function () {
                        //增加
                        value = increase(value);
                        $input.val(value);

                        $input.trigger('change');
                    });
                },
                //设置错误样式
                setErrorStyle = function ($input,errorMsg) {
                    var $arrow = $input.next(), $inputGroup = $input.parent('.input-group'), $label = $arrow.next();
                    $label.empty().append('<i class="fa fa-exclamation-circle"></i>' + errorMsg);

                    $label.add($arrow).css("display", "block");

                    $inputGroup
                        .addClass('form-error')
                        .off('.error')
                        .on({
                            'mouseenter.error': function () {
                                $label.add($arrow).css("display", "block");
                            },
                            'mouseleave.error': function () {
                                $label.add($arrow).css("display", "none");
                            }
                        });
                },
                //清除错误样式
                clearErrorStyle = function () {
                    var $arrow = $input.next(),
                        $inputGroup = $input.parent('.input-group'),
                        $label = $arrow.next();

                    $label.add($arrow).css("display", "none");
                    $inputGroup.removeClass('form-error').off('.error');
                },
                init = function ($selector) {
                    var style;
                    $input = $selector.find('input[type="text"]');
                    $lBtn = $('.input-l-btn', $selector);
                    $rBtn = $('.input-r-btn', $selector);
                    $lBtn.add($rBtn).css('border', '0');
                    //样式初始格式化配置
                    // $input.focus(function () {
                    // 	$input.parent().css({
                    // 		"box-shadow": "#0 0 5px rgba(77,77,77,0.2)",
                    // 		"transition": "box-shadow 0.5s, border-color 0.25s ease-in-out"
                    // 	});
                    // });

                    attr.name && $input.attr('name', attr.name);
                    //i18n
                    if (auiCtx) {
                        option.placeholder && $input.attr('placeholder', $AW.nsl(option.placeholder, $selector.attr('id'), auiCtx));
                    }

                    if (option.disabled) {
                        $input.attr('disabled', option.disabled);
                    }


                    option.autocomplete && $input.attr('autocomplete', 'off');

                    //自定义样式
                    if (css && css.cssCode && css.cssCode.className) {
                        $selector.addClass(css.cssCode.className)
                    }

                    //样式解析处理

                    if (css && (style = css.style)) {
                        if (style.input) {
                            $input.css($.extend({}, style.input, {'width': ''}));
                            JSON.parse(JSON.stringify(style.input))['width'] && $selector.find('.input-group').css({'width': JSON.parse(JSON.stringify(style.input))['width']});
                        }
                        if (style.inputHover) {
                            $AW.cssHover('.foundationDigitInput', $selector, style.inputHover, ':hover');
                        }
                        style.position && $selector.css(style.position);
                        if (style.title) {
                            if (!isInline) {
                                $input.parent().prev().css(style.title);
                            } else {
                                if (typeof auiCtx === 'undefined') {
                                    $selector.children().first().find('label').css(style.title);
                                } else {
                                    $selector.prev().find('label').css(style.title);
                                }

                            }
                        }
                        if (style.buttonHover) {
                            $AW.cssHover(".input-l-btn", $selector, style.buttonHover, ":hover");
                            $AW.cssHover(".input-r-btn", $selector, style.buttonHover, ":hover");
                        }
                    }

                    if (inputType === 'floatAmount') {
                        value = parseFloat(value).toFixed(maxAccuracy);
                    }
                    //设置input初始显示值
                    if (!scopeCheck(value)) {
                        value = handleOutOfBorder(value);
                        setErrorStyle($input,'默认值超出范围!');
                    }
                    (value || value == 0) && $input.val(formatData(value, inputType));

                    if (!option.disabled) {
                        //处理数据输入
                        handleInput();

                        //处理数据格式化及范围检查
                        handleDataFormatAndScopeCheck();

                        //处理按上下键增减数值
                        handleValueChange();

                        //处理btn点击
                        handleBtnClick();

                        //移除disabled样式
                        $lBtn.removeClass('disabled');
                        $rBtn.removeClass('disabled');
                    } else {
                        //设置两按钮不可用
                        $lBtn.addClass('disabled');
                        $rBtn.addClass('disabled');
                    }
                },
                //设置值
                setValue = function (val) {
                    //输入范围检查
                    if (scopeCheck(val)) {
                        value = val;
                    } else {
                        setErrorStyle($selector.find(".input-group-field.digitInput"),'数值超出范围!');
                        return;
                    }
                    $input.val(formatData(value, inputType));
                },
                //获取值
                getValue = function () {
                    value || (value = 0);
                    if (inputType === 'floatAmount') {
                        return parseFloat(value).toFixed(maxAccuracy);
                    } else {
                        return parseInt(value,10);
                    }
                },
                //获取格式化的值
                getFormatValue = function () {
                    return formatData(value, inputType);
                },
                //重置值
                resetValue = function () {
                    value = option.value || 0;
                    $input.val(formatData(value, inputType));
                },
                focus = function () {

                    var value = $input.val(),
                        len = value && value.length,
                        input;

                    if ($input.length && len) {
                        input = $input[0];
                        if (input.createTextRange) {

                            var range = input.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', len);
                            range.moveStart('character', len);
                            range.select();

                        } else if (input.setSelectionRange) {
                            input.focus();
                            input.setSelectionRange(len, len);
                        }

                    } else {
                        $input.trigger('focus');
                    }
                };

            var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
                horizontalTemp = "<label title='_label_'>_label__mustInput_</label><div class='input-group foundationDigitInput'><span class='input-l-btn input-group-label '>-</span> <input class='input-group-field digitInput' type='text'/>" +
                    "<div class='form-error-arrow'></div><label class='form-error-msg'></label>"
                    + "<span class='input-r-btn input-group-label '>+</span></div>",

                inlineTemp = "<div class='columns'>" +
                    "<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
                    "</div>" +
                    "<div class='columns '><div class='input-group foundationDigitInput'>" +
                    "<span class='input-l-btn input-group-label '>-</span> <input class='input-group-field digitInput' type='text'/><div class='form-error-arrow'></div><label class='form-error-msg'></label>" +
                    "<span class='input-r-btn input-group-label '>+</span>" +
                    "</div></div>",
                classname,
                value,
                inputType,
                $input,
                $lBtn,
                $rBtn,
                $labelBtn,
                returnValue,
                minAmount,
                maxAmount,
                intSplitChar,
                floatSplitChar,
                maxAccuracy,
                step,
                isInline = formOption.formLayout === 'inline',
                labelAlign = option.labelAlign || formOption.labelAlign,
                template = isInline ? inlineTemp : horizontalTemp,
                span = option.span || formOption.span,
                labelSpan = option.labelSpan || formOption.labelSpan,
                style;


            option.input_type && (inputType = option.input_type);

            option.value ? (value = option.value) : (value = 0);
            (option.minAmount === 0 || option.minAmount) && (minAmount = option.minAmount);
            (option.maxAmount === 0 || option.maxAmount) && (maxAmount = option.maxAmount);

            option.intSplitChar && (intSplitChar = option.intSplitChar);
            option.floatSplitChar && (floatSplitChar = option.floatSplitChar);
            option.maxAccuracy >= 0 && option.maxAccuracy <= 20
                ? (maxAccuracy = option.maxAccuracy) : (maxAccuracy = 2);
            option.step ? (step = parseFloat(option.step)) : (step = 1);
            //i18n
            if (auiCtx) {
                template = template
                    .replace(/_label_/g, $AW.nsl(option.label, $selector.attr('id'), auiCtx) || "")
                    .replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
            }



                if (isInline) {
                    $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                        template,
                        labelSpan,
                        labelAlign,
                        auiCtx,
                        "aweb4FoundationDigitInput",
                        attr);

                    attr.id && $selector.attr('id', attr.id);
                } else {
                    $selector.append(template);
                    widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
                }



            //初始化
            init($selector);


            returnValue = {
                //设置值
                setValue: setValue,
                //获取值
                getValue: getValue,
                //获取格式化的值
                getFormatValue: getFormatValue,
                //重置值
                resetValue: resetValue,
                focus: focus,

                //组件行为部分
                // 一个行为类型方法的 实现
                display: function (result, input1, input2, condition) {
                    this[result ? 'hide' : 'show']();
                },
                error: function (){
                    setErrorStyle($selector.find(".input-group-field.digitInput"),"非法数值!");
                },

                clean: function () {
                    clearErrorStyle($input);
                },

                success: function () {
                    var $label = $input.next().next('label'),
                        $inputGroup = $input.parent('.input-group'),
                        $arrow = $input.next('div');

                    $inputGroup.removeClass('form-error');
                    $input.off('.error');

                    $label.add($arrow).css("display", "none");
                },

                show: function () {
                    $selector.removeClass('hide');
                    isInline && $selector.prev(".columns").removeClass('hide');
                },

                hide: function () {
                    $selector.addClass('hide');
                    isInline && $selector.prev(".columns").addClass('hide');
                },
                disabled: function (value) {

                    if (value) {
                        $input.prop('disabled', true);
                        $lBtn.add($rBtn).addClass('disabled');
                        $lBtn.add($rBtn).off('click.changValue');
                    } else {
                        $lBtn.add($rBtn).removeClass('disabled');
                        $input.prop('disabled', false);
                        handleBtnClick()
                    }

                },
                getTrimValue: function () {
                    return $.trim(getValue())
                },
                mustInput: function (flag) {
                    var $label = $('[title="'+option.label+'"]',$selector);

                    $label.empty();
                    if(flag === true){
                        $label.html(option.label+mustInputTemp)
                    }else{
                        $label.html(option.label)
                    }
                },
                setMax: function (max) {
                    if(typeof(max)==="number") option.maxAmount = max;
                },
                setMin: function (min) {
                    if(typeof(min)==="number") option.minAmount = min;
                }
            };
            return returnValue;
        }

        if (!widget.component.foundationForm) {
            widget.component.foundationForm = {};
        }
        widget.component.foundationForm.foundationDigitInput = function ($selector, option, attr, css, auiCtx) {

            var formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

            return render($selector, option, attr,css, formOption, auiCtx);
        };


        return widget;
    });
})();