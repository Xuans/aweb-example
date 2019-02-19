/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author pangjinquan@agree.com.cn
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "chosen.jquery",'component.foundationForm'], factory);
        }
        // global
        else {
            factory();
        }
    })
    (function ($, widget) {
        "use strict";
        function renderSelect($selector, option, attr,css, formOption, auiCtx) {
            var setSelectOption = function (options) {
                    var i, item, valTemp, despTemp, html = '';

                    if (options) {
                        if (!option.multiSelect && option.clear) {//单选&&开启标题
                            html += '<option></option>';
                        }
                        //提示选项
                        if(option.emptyOption){
                            html += '<option value="">'+option.emptyOption+'</option>';
                        }
                        for (i = -1; (item = options[++i]);) {
                            valTemp = $AW.nsl(item.value+'', attr.id, auiCtx);
                            despTemp =  $AW.nsl(item.desp+'', attr.id, auiCtx);
                            html += '<option value="' + (item.value !== undefined ?  valTemp: '') + '">' + (item.desp !== undefined ? despTemp : '') + '</option>';
                        }
                    }
                    return html;
                },

            //生成下拉选择框
                init = function($el,option) {
                    var no_results_text =  option.no_results_text || "无选项";
                    //i18n
                    if(auiCtx){
                        no_results_text = $AW.nsl(no_results_text,$selector.attr('id'),auiCtx);
                    }
                    $el.append(setSelectOption(option.option));

                $el.chosen({
                        no_results_text:no_results_text,
                        single_backstroke_delete : true,
                        allow_single_deselect : option.clear,
                        inherit_select_classes : false,
                        search_contains : true,

                        placeholder_text_single: option.defaultShowLabel,
                        placeholder_text_multiple: option.defaultShowLabel,
                        disable_search: option.disable_search,
                        display_selected_options: option.display_selected_options,
                        disable_search_threshold: option.disable_search_threshold ? option.disable_search_threshold : 0
                    });



                },
            //重置下拉框
                resetSelect = function(el) {
                    el.empty();
                    el.trigger("chosen:updated");
                },
            //重置选择内容
                resetValue = function() {
                    $select.val("");
                    $select.trigger("chosen:updated");
                },
                focus = function(e){
                    var e = e||window.event;

                    e.stopPropagation? e.stopPropagation():(e.cancelBubble = true);
                    $select.trigger('chosen:open').trigger('chosen:activate');

                },

            //获取下拉框选择项
                getValue = function() {
                    var value = $select.val(),
                        returnObj = [],obj={},
                        i,

                        $choice;

                    if(option.multiSelect){
                        //按选择顺序取值

                        value = $.makeArray($select.parent().find(".search-choice").map(function(index,item){

                            return $select.find('option').eq($(item).children('a').attr('data-option-array-index')).val();
                        }));
                    }

                    if (option.allReturn && option.multiSelect) {//全量返回&&多选

                        if (value != null) {
                            for (i = 0; i < value.length; i++ ) {

                                obj.value = value[i];
                                obj.desp = $select.find('option[value='+value[i]+']').text();
                                returnObj.push(obj);
                            }
                        }
                        return returnObj;
                    } else if (!option.allReturn && !option.multiSelect){
                        return [value];
                    } else if (option.allReturn && !option.multiSelect) {
                        var returnObj = {};
                        returnObj.value = value;
                        returnObj.desp = $select.find('option[value='+value+']').text();
                        return returnObj.value === "" ? [] : [returnObj];
                    } else if (!option.allReturn && option.multiSelect) {
                        return value;
                    }
                },
                getFirstValue=function() {
	                var value = getValue();

	                return value && value[0];
                },

            //校验下拉框选中的值是否为空时使用
                getValidateValue = function(){
                    var str,
                        result = getValue();
                    if($.isArray(result)){
                        //选择到的值为空字符串时也校验不通过
                        str = result.length === 0 ? '' : result.length=== 1 && result[0] == '' ? '' : result.length;
                    }else{
                        str = result.toString();
                    }
                    return str!==undefined && str!==null;
                },
                setValue = function (values) {//下拉框下拉内容回显
                    if(!values){
                        values = [];
                    }
                    if(values === "auiAjaxTest"){
                        values = [
                            {
                                value : "one",
                                desp : "测试选项1"
                            },
                            {
                                value : "two",
                                desp : "测试选项2"
                            }
                        ]
                    }

                    if(!$.isArray(values)) {
	                    values = [values];
                    }

                    resetSelect($select);
                    $select.append(setSelectOption(values));
                    $select.trigger("chosen:updated");

                    //设置默认值
                    var len = values.length, defaultValues = [];
                    for(var i = 0 ; i< len; i++) {
                        var obj = values[i];
                        if (obj.isDefault != undefined && (obj.isDefault || obj.isDefault == 'true')) {//判断是否是默认值
                            if (!option.multiSelect) {//单选的情况，取第一个解析到的默认值，其他忽略
                                setSelectValue([obj.value]);
                                break;
                            } else {
                                defaultValues.push(obj.value);
                            }
                        }
                    }

                    if (defaultValues.length > 0) {
                        setSelectValue(defaultValues);
                    }
                },

                setSelectValue = function(values) {//输入框的已选择内容的回显
                    if (values instanceof Array) {
                        var len = values.length, isContain = true;
                        for (var i = 0; i < len; i++) {
                            if (!$select.find('option[value="'+values[i]+'"]').length) {
                                isContain = false;
                                if(option.promptFlag){
                                    app.alert("数据("+values[i]+")错误，不存在于原下拉框value中", app.alert.ERROR);
                                }
                                break;
                            }
                        }

                        if (isContain) {
                            if (!option.multiSelect) {
                                $select.val([values[0]]);
                            } else {
                                $select.val(values);
                            }
                            $select.trigger("chosen:updated");
                        }
                    }
                };

            var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
                horizontalTemp = "<label title='_label_'>_label__mustInput_</label><div class='input-group foundationSelect'><select></select><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>",
                inlineTemp = "<div class='columns'>" +
                    "<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
                    "</div>" +
                    "<div class='columns'><div class='input-group foundationSelect'>" +
                    "<select></select><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>" +
                    "</div>",
                isInline = formOption.formLayout === 'inline',
                labelAlign = option.labelAlign || formOption.labelAlign,
                template = isInline ? inlineTemp : horizontalTemp,
                span = option.span || formOption.span,
                labelSpan = option.labelSpan || formOption.labelSpan,
                $select,
                style,
                inputObj,
                classname,
                returnValue;
            //i18n
            if(auiCtx){
                template = template
                .replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx)|| "")
                .replace(/_mustInput_/, option.mustInput ? mustInputTemp: "");
            }
            



                if (isInline) {
                    $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                        template,
                        labelSpan,
                        labelAlign,
                        auiCtx,
                        "aweb4foundationSelect",
                        attr);
                    attr.id && $selector.attr('id', attr.id);
                } else {
                    $selector.append(template);
                    widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
                }

                $select = $selector.find('select');

                option.disabled && $select.attr("disabled","disabled");
                option.multiSelect && $select.attr("multiple","multiple");
	            option.defaultSelectLabel && $select.attr("data-placeholder",$AW.nsl(option.defaultSelectLabel,$selector.attr('id'),auiCtx));
                init($select, option);


            //阻止搜索框的change事件的冒泡
	        $('.chosen-search input',$selector)
                .off('.foundationSelect')
                .on('change.foundationSelect',function(){
                    return false;
                });

            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }
            //样式解析设置
            if(css && (style = css.style)){
                if(style.title) {
                    if(!isInline){
                        $select.parent().prev().css(style.title);
                    }else{
                        if(typeof auiCtx ==='undefined') {
                            $selector.children().first().find('label').css(style.title);
                        }else{
                            $selector.prev().find('label').css(style.title);
                        }
                    }
                }
                if(style.input){
                    inputObj=JSON.parse(JSON.stringify(style.input));
                    $AW.cssHover('.foundationSelect .chosen-container',$selector,$.extend({},style.input,{'width':''}),'');
                    inputObj['width'] && $selector.find('.input-group').css({'width':inputObj['width']});
                }
                if(style.selectActive){
                    $AW.cssHover('.chosen-container',$select,style.selectActive,':hover');
                }

                style.position && $selector.css(style.position);
                style.arrowIcon && $AW.cssHover('.chosen-container-single .chosen-single div b',$selector,style.arrowIcon,':before');
                style.menuList &&  $AW.cssHover('.foundationSelect .chosen-container .chosen-results li',$selector,style.menuList,'');
                style.downMenu &&  $('.chosen-drop',$selector).css(style.downMenu);
                style.downMenuColor && $AW.cssHover('.foundationSelect .chosen-container .chosen-results li',$selector,style.downMenuColor,':hover');
                $AW.cssHover('.foundationSelect .chosen-container .chosen-results li.highlighted',$selector,style.downMenuColor,'');
                style.search && $('.chosen-search input',$selector).css(style.search);
                style.mobileSelectCtn && $('.foundationSelect', $selector).css(style.mobileSelectCtn);
                style.mobileSelect && $('.foundationSelect select', $selector).css(style.mobileSelect);
                style.mobileSelectActive && $AW.cssHover('.foundationSelect select', $selector, style.mobileSelectActive, ':active');
                style.mobileSelectFocus && $AW.cssHover('.foundationSelect select', $selector, style.mobileSelectFocus, ':focus');
            }

            //返回内容
            returnValue = {
                setSelectOption :function (options) {
                    resetSelect($select);
                    $select.append(setSelectOption(options));
                    $select.trigger("chosen:updated");

                },
                //获取下拉框选择项
                getValue : getValue,
	            getFirstValue: getFirstValue,
                getValidateValue : getValidateValue,
                setValue : setValue,//回显及生命周期方法
                setSelectValue : setSelectValue,
                resetValue : resetValue,
                focus:focus,

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
                //校验回调
                /*
                 * desp Error Callback
                 * params @jquery object $input
                 *           @string error message
                 *
                 * */
                error:function($select,errorMsg){

                    var $targetDiv = $selector.find('.chosen-container'),
                        $arrow=$targetDiv.next(),
                        $inputGroup = $targetDiv.parent('.input-group'),
                        $label = $arrow.next();
                    $label.empty().append('<i class="fa fa-exclamation-circle"></i>'+errorMsg);

                    $label.add($arrow).css("display", "block");
                    $inputGroup.addClass('form-error');

                    $targetDiv
                        .off('.error')
                        .on({
                            'mouseenter.error': function () {
                                $label.css("display", "block");
                                $arrow.css("display", "block");
                            },
                            'mouseleave.error': function () {
                                $label.css("display", "none");
                                $arrow.css("display", "none");
                            }
                        });

                },

                /*
                 *  desp Clean Callback
                 *   params： @jquery event handler event
                 *
                 * */
	            clean: function (event) {
		            var $targetDiv = $selector.find('.chosen-container'),
                        $arrow=$targetDiv.next(),
                        $inputGroup = $targetDiv.parent('.input-group'),
                        $label = $arrow.next();
                    $label.add($arrow).css("display", "none");
                    $inputGroup.removeClass('form-error');
		            $targetDiv.off('.error');
	            },

                /*
                 *   desp success callback
                 *   params  @jquery object $input
                 *
                 * */
                success:function($select){
	                returnValue.clean();
                },
                disabled:function(value){
                    if(value) {
                        $select.prop('disabled',true).trigger("chosen:updated");
                    }else{
                        $select.prop('disabled',false).trigger("chosen:updated");
                    }
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
            return returnValue;
        }

        if (!widget.component.foundationForm ) {
            widget.component.foundationForm = {};
        }
        widget.component.foundationForm.foundationSelect = function ($selector, oOption, oAttr, oCss, auiCtx) {
            var

                formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')];

                return renderSelect($selector, oOption, oAttr, oCss,formOption||{}, auiCtx);
            };


        return widget;
    });
})();