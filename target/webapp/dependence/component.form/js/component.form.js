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

            var Form = {};

            Form.fitlerSelector = function (sel) {
                var VIRTUAL_REGEX = /:(?:hover|active|link|focus|before)/g;
                return sel.replace(VIRTUAL_REGEX, '').replace(/^,/, '');
            };
            Form.configForm = function (oWidget, oOption, type) {

                var formWidget,
                    attr,
                    $widget, $input,
                    temp, innerTemp,
                    sel = (/text|money|data/).test(type) ? 'Input' : (type.substring(0, 1).toUpperCase() + type.substring(1)),
                    isInline;

                formWidget = oWidget.closest('formCtn');

                $widget = oWidget[0].$widget;
                attr = oWidget.attr();
                isInline = formWidget.length && formWidget.option().formLayout === 'form-inline';

                $widget.children('[data-widget-type]').remove();

                if (oOption) {

                    switch (type) {
                        case 'select':

                            innerTemp = '<select _readonly_ data-widget-type="_dataWidgetType_" id="_id_" >' + Form.renderSelectOpt(oOption.option) + '</select>';
                            break;
                        case 'textarea':

                            innerTemp = '<textarea _readonly_ data-widget-type="_dataWidgetType_" id="_id_" placeholder="_placeholder_"></textarea>';
                            break;
                        default:    //input password checkbox radio

                            innerTemp = '<input _readonly_ data-widget-type="_dataWidgetType_" type="_type_" id="_id_" placeholder="_placeholder_">';
                    }

                    if (oOption.label) {
                        if (isInline) {
                            temp = '<label  data-widget-type="_dataWidgetType_"><span class="form-label">_label_</span>' + innerTemp + '</label>';
                        } else {
                            temp = '<div  data-widget-type="_dataWidgetType_" class="control-group"><label class="control-label" for="_id_">_label_</label><div class="controls">' + innerTemp + '</div></div>'
                        }
                    } else {
                        temp = innerTemp;
                    }

                    temp = temp
                        .replace(/_dataWidgetType_/, 'aweb4' + sel)
                        .replace(/data-widget-type="_dataWidgetType_"/, '')
                        .replace(/_label_/, oOption.label || '')
                        .replace(/_type_/, type)
                        .replace(/_id_/g, attr.id)
                        .replace(/_readonly_/, oOption.readOnly ? 'readonly' : '')
                        .replace(/_placeholder_/, oOption.placeholder || '');

                    $widget.append(temp);
                    $input = $widget.find('input,textarea').prop('checked', !!oOption.checked).css('resize', oOption.resizable ? '' : 'none');

                    Form.toggleFormType(type, oOption, $input, isInline);

                    if (oOption.mustInput) {
                        $input.parent().append('<span style="color:red;vertical-align:middle;"> * </span>');
                    }

                    if (oOption.suffix) {
                        $input.parent().append('<span style="vertical-align:middle">' + oOption.suffix + '</span>');
                    }

                }
                oWidget.display(isInline);
            };
            Form.renderForm = function (obj, oOption, type, oCss) {
                var option,
                    $input, $widget, $form,
                    isInline;

                $widget = obj;
                $input = $widget;
                $form = $widget.closest('form');
                option = oOption;
                isInline = $form.length && $form.hasClass('form-inline');

                if (option) {
                    if (option.label) {
                        if (isInline) {
                            $input.wrap('<label/>');
                            $widget = $input.parent();
                            $widget.prepend('<span class="form-label">' + option.label + '</span>');

                        } else {
                            $input.wrap('<div class="controls"/>');

                            $widget = $input.parent()
                                    .wrap('<div class="control-group"/>').parent();

                            $widget.prepend('<label class="control-label">' + option.label + '</label>');

                        }
                    }
                    if (oOption.mustInput) {
                        $input.parent().append('<span style="color:red;vertical-align:middle"> * </span>');
                    }
                    if (oOption.suffix) {
                        $input.parent().append('<span style="vertical-align:middle">' + oOption.suffix + '</span>');
                    }

                    if ($widget.children().length) {
                        $widget.attr({ 'data-widget-type': $input.attr('data-widget-type') }).addClass($input[0].className);
                        $input.removeAttr('data-widget-type').removeClass();
                    }


                    $input.append(Form.renderSelectOpt(option.option)).prop({
                        placeholder: option.placeholder || '',
                        checked: !!option.checked
                    }).val(option.value || '').css('resize', oOption.resizable ? '' : 'none');

                    option.readOnly && $input.attr('readonly', 'true');

                    type && Form.toggleFormType(type, option, $input, isInline);

                    //特殊处理style
                    if (!$.isEmptyObject(oCss)) {

                        var i, item, selector;

                        for (i in oCss) {
                            if(oCss.hasOwnProperty(i) && !$.isEmptyObject(item = oCss[i])){
                                    selector = i || '';

                                    //class
                                    if (item.length) {
                                        (selector ? $widget.find(Form.fitlerSelector(selector)) : $widget).addClass(item.join(' '));
                                    }
                            }

                        }
                    }

                }
            };
            Form.renderSelectOpt = function (option) {
                var i, item, html = '';

                if (option) {
                    for (i = -1; (item = option[++i]);) {
                        html += '<option value="' + (item.value !== undefined ? item.value.toString() : '') + '">' + (item.desp !== undefined ? item.desp.toString() : '') + '</option>';
                    }
                }
                return html;
            };

            Form.toggleFormType = function (type, option, $input, isInline) {

                var _formatCurrency = function (num) {

                    var sign, cents;
                    num = num.toString().replace(/\$|\,/g, '');
                    if (isNaN(num))
                        num = "0";
                    sign = (num == (num = Math.abs(num)));
                    num = Math.floor(num * 100 + 0.50000000001);
                    cents = num % 100;
                    num = Math.floor(num / 100).toString();
                    if (cents < 10)
                        cents = "0" + cents;
                    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
                        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                            num.substring(num.length - (4 * i + 3));
                    return (((sign) ? '' : '-') + num + '.' + cents);
                },
                    $parent;

                switch (type) {
                    case 'date':
                        $input.datepicker({
                            autoSize: true,
                            dateFormat: (option.formatter && option.formatter.replace(/yy/g, 'y')) || 'yy-mm-dd'
                        });
                        break;
                    case 'money':
                        if (!isNaN(option.value)) {
                            $input.val(_formatCurrency(option.value));
                        }
                        $input.on('blur.aweb4', function () {
                            $(this).val(_formatCurrency(this.value));
                        });
                        break;
                    case 'radio':
                    case 'checkbox':
                        $parent = $input.parent();

                        $parent.addClass(type);
                        option.value && $input.val(option.value);

                        if (isInline) {
                            $parent.addClass('form-label');
                            $parent.children('span').removeClass('form-label');
                        }


                        break;

                    case 'text':
                    case 'select':
                    case 'textarea':
                        option.value && $input.val(option.value);
                        break;

                }
            };

            widget.component.form = {};

            return Form;
        });
})();