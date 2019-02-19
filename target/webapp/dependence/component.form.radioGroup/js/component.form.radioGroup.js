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
            define(["jquery", "widget", "component.form"], factory);
        }
        // global
        else {
            factory();
        }

    })
        (function ($, widget, Form) {
            "use strict";
            widget.component.form.radioGroup = function (obj, oOption, oAttr, oCss) {
                var option,
                    oWidget,
                    $selector,
                    $widget, $temp,
                    value,
                    attr,
                    i, label, inlineClass, isInline, len, optionList, b = [], radioHtml,
                    formInline, $formWidget,
                    radioTemp = '<label class="radio _inline_"><input data-checked type="radio" name="_name_" value="_value_"><span class="radio-label form-label">_label_</span></label>';

                $selector = obj;
                option = oOption;
                attr = oAttr;
                $formWidget = $selector.closest('form');
                formInline = $formWidget.length && $formWidget.hasClass('form-inline');

                if (option) {
                    isInline = option.isInline;
                    optionList = option.radioGroup;
                    if (optionList && optionList.length) {
                        option.title ? $selector.find('.label-title').text(option.title) : $selector.find('.label-title').empty();
                        for (i = 0,
                            len = optionList.length; i < len; ++i) {
                            if (optionList[i].label !== undefined && optionList[i].value !== undefined && attr && attr.name !== undefined) {
                                label = optionList[i].label.toString();
                                inlineClass = isInline ? 'inline' : ' ';
                                radioHtml = radioTemp.replace(/_value_/, optionList[i].value)
                                    .replace(/_name_/, attr.name)
                                    .replace(/_label_/, label)
                                    .replace(/_inline_/, inlineClass)
                                    .replace(/data-checked/, (optionList[i].checked) ? 'checked' : '');
                                b.push(radioHtml);
                            }
                        }


                        if (formInline) {
                            $selector.wrap('<label data-widget-type="aweb3RadioGroup" class="form-inline-radio-group-label" id="' + attr.id + '"/>');
                            $selector.attr('id', '').text(option.title);

                            $temp = $('<div class="form-inline-radio-group"/>');

                            $selector = $selector.parent().append($temp);

                            $temp.append(b.join(''));

                            $temp.find('.radio').addClass('form-label');
                            $temp.find('.radio-label').removeClass('form-label');

                        } else {
                            $temp = $('<div class="radio-group control-group" data-widget-type="aweb3RadioGroup" id="' + attr.id
                                + '"><label class="control-label label-title inline">' + option.title
                                + '</label><div class="controls"></div>');

                            $temp.insertBefore($selector)
                                .attr({
                                    'data-widget-type': $selector.attr('data-widget-type'),
                                    'id': $selector.prop('id')
                                })
                                .addClass($selector[0].className.replace('form-label', ''))
                                .find('.controls')
                                .append(b.join(''));

                            $selector.remove();
                            $selector = $temp;

                        }

                        //特殊处理style
                        if (!$.isEmptyObject(oCss)) {

                            var item, selector;

                            for (i in oCss) {
                                if(oCss.hasOwnProperty(i) && !$.isEmptyObject(item = oCss[i])){
                                        selector = i || '';

                                        //class
                                        if (item.length) {
                                            (selector ? $selector.find(selector) : $selector).addClass(item.join(' '));
                                        }
                                }

                            }
                        }

                    }
                }

                return {
                    getValue: function () {
                        var $selector2, value;
                        $selector2 = ($selector.closest('form').length !== 0 ? $selector.closest('form') : $selector.parent());
                        $selector2.find('input[name="' + attr.name + '"]').each(function () {
                            if (this.checked === true) {
                                value = this.value;
                            }
                        });
                        return value;
                    }
                }


            };
        });
})();