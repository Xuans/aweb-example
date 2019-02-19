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
            define(["jquery", "widget","component.form"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,Form) {
        "use strict";
        widget.component.form.checkboxGroup = function (obj, oOption, oAttr, oCss) {
            var oWidget,
                $widget,
                $selector, $temp,
                option,
                attr,
                checkboxTemp = '<label class="checkbox _inline_"><input data-checked type="checkbox" name="_name_" value="_value_"><span class="checkbox-label form-label">_label_</span></label>',
                formInline, $formWidget,
                i, label, inlineClass, isInline, isChecked, len, b = [], checkboxHtml, optionList;

                $selector = obj;
                option = oOption;
                attr = oAttr;
                optionList = option.checkboxGroup;
                isInline = option.isInline;
                $formWidget = $selector.closest('form');
                formInline = $formWidget.length && $formWidget.hasClass('form-inline');

                if (option) {
                    if (optionList && optionList.length) {
                        option.title ? $selector.find('.label-title').text(option.title) : $selector.find('.label-title').empty();
                        for (i = 0, len = optionList.length; i < len; ++i) {
                            label = (optionList[i].label !== undefined ? optionList[i].label.toString() : '');
                            isChecked = optionList[i].value ? 'checked' : '';
                            inlineClass = isInline ? 'inline' : '';
                            checkboxHtml = checkboxTemp.replace(/_value_/, (optionList[i].value !== undefined ? optionList[i].value.toString() : ''))
                                .replace(/_name_/, attr.name)
                                .replace(/_label_/, label)
                                .replace(/_inline_/, inlineClass)
                                .replace(/_checked_/, isChecked)
                                .replace(/data-checked/, (optionList[i].checked) ? 'checked' : '');
                            b.push(checkboxHtml);
                        }

                        if (formInline) {
                            $selector.wrap('<label data-widget-type="aweb3CheckboxGroup" class="form-inline-radio-group-label" id="' + attr.id + '"/>');
                            $selector.attr('id', '').text(option.title);

                            $temp = $('<div class="form-inline-radio-group"/>');

                            $selector = $selector.parent().append($temp);

                            $temp.append(b.join(''));

                            $temp.find('.checkbox').addClass('form-label');
                            $temp.find('.checkbox-label').removeClass('form-label');

                        } else {

                            $temp = $('<div class="radio-group control-group" data-widget-type="aweb3CheckboxGroup" id="' + attr.id
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

                            var i, item, selector;

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
                    valueList: function () {
                        var $selector2, list = [];
                        $selector2 = ($selector.closest('form').length !== 0 ? $selector.closest('form') : $selector.parent());
                        $selector2.find('input[name="' + attr.name + '"]').each(function () {
                            if (this.checked === true) {
                                list.push(this.value);
                            }
                        });
                        return list;
                    },
                    getter: this.valueList,
                    setter: function (data) {

                    }
                }
            
        };
    });
})();