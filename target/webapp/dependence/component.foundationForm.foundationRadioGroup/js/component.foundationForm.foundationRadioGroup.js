/**
 * @author hefuxiang@agree.com.cn
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget",'component.foundationForm'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";
        
        function render($selector, option, attr,css, formOption, auiCtx) {
            //添加radio
            var addRadio = function($radioGroup, value, label, checked){
                var template = radioTemp.replace(/_label_/g, ($AW.nsl(label, attr.id, auiCtx)) || ('radio'+ index )).
                    replace(/_id_/g, $radioGroup.attr('id') + "_" + index);
                index++;
                
                if(option.disabled){
					template = template.replace(/_disabled_/g, "disabled='true'");
				}else{
					template = template.replace(/_disabled_/g, "");
				}
                
                $radioGroup.append(template);
                var $radio = $radioGroup.find('input:last');
                
                //name有配置就使用，否则使用id
                attr.name ? $radio.attr('name', attr.name) 
                        : $radio.attr('name', $radioGroup.attr('id'));
                $radio.val(value);
                checked && $radio.attr('checked', true);
                
                //设置input的父label的display属性
                if(option.horizontal){
                    $radio.closest('div').addClass('radio radio-info radio-inline');
                    /*$radio.parent('div').parent('div').css('padding-bottom', '16px');*/
                }else{
                    $radio.closest('div').addClass('radio');
                }
            },
            init = function($selector){
                $radioGroup = $selector.find('.radioGroup');
                
                attr.id && $radioGroup.attr('id', attr.id);
                
                if(option.radioGroup){
                    for(var i = 0, radio; i < option.radioGroup.length; i++) {
                        radio = option.radioGroup[i];
                        addRadio($radioGroup, radio.value, radio.label, radio.checked);
                    }
                }
            };

            var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
                horizontalRadioGroupTemp = "<div><label title='_label_'>_label__mustInput_</label><div class='radioGroup'></div></div>",
            inlineRadioGroupTemp = "<div class='columns'>" + 
                                        "<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
                                    "</div>" + 
                                    "<div class='columns'>" + 
                                      "<div class='radioGroup'></div>" + 
                                    "</div>",
                radioTemp = "<div><input id='_id_' type='radio' _disabled_><label for='_id_' title='_label_'>_label_</label></div>",
                classname, 
                index = 0,
                $radioGroup, 
                radioObj,
                checkedObj,
                isInline = formOption.formLayout === 'inline', 
                labelAlign = option.labelAlign || formOption.labelAlign,
                radioGroupTemp = isInline ? inlineRadioGroupTemp : horizontalRadioGroupTemp,
                span = option.span || formOption.span,
                labelSpan = option.labelSpan || formOption.labelSpan,
                style;
            //i18n
            if(auiCtx){
                radioGroupTemp = radioGroupTemp.replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx) || "")
                .replace(/_mustInput_/, option.mustInput ? mustInputTemp: "");
            }

                
            if (isInline) {
                    $selector =  widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector, 
                            radioGroupTemp, 
                            labelSpan, 
                            labelAlign, 
                            auiCtx, 
                            "aweb4FoundationRadioGroup",
                            attr);
                    attr.id && $selector.attr('id', attr.id);
                } else {
                    $selector.append(radioGroupTemp);
                    widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
                }
            
            //初始化
            init($selector);
            ///样式处理
            $radioGroup = $selector.find('.radioGroup');

            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }
            if(css && (style=css.style)){

               /* style.label && $radioGroup.parent().css(style.label);*/
                if(style.label) {
                    if(!isInline){
                        $radioGroup.parent().css(style.label);
                    }else{
                        if(typeof auiCtx ==='undefined') {
                            $selector.children().first().find('label').css(style.label);
                        }else{
                            $selector.prev().find('label').css(style.label);
                        }

                    }
                }
                style.position && $selector.css(style.position);
                style.font && $radioGroup.find("label").css(style.font);
                if(style.radio) {
                    radioObj = JSON.parse(JSON.stringify(style.radio));
                    $AW.cssHover('.radioGroup .radio label',$selector,style.radio,'::before');
                    $AW.cssHover('.radioGroup .radio label',$selector,{'width':radioObj['width'],'height':radioObj['height']},'::after');
                    $AW.cssHover('.radioGroup input[type=radio]',$selector,{'width':radioObj['width'],'height':radioObj['height']},'');
                }
                if(style.ie8Input){
                    $AW.cssHover('.radioGroup input[type=radio]',$selector,style.ie8Input,'');
                }
                style.inputHover && $AW.cssHover('.radioGroup .radio label',$selector,style.inputHover,':hover:before');
                if(style.inputChecked) {
                    checkedObj = JSON.parse(JSON.stringify(style.inputChecked));
                    style.inputChecked && $AW.cssHover('.radioGroup input[type=radio]:checked + label', $selector, {'border-color': checkedObj['border-color']}, '::before');
                    style.inputChecked && $AW.cssHover('.radioGroup .radio label', $selector, $.extend({}, style.inputChecked, {'background-color': checkedObj['background-color']}), ':after');
                }
                }
            return {
            	setRadioGroup: function(radioGroup){
            		if(!radioGroup){
            			radioGroup = [];
            		}
            		if(radioGroup === 'auiAjaxTest'){
            			radioGroup = [
            			                   {value:"radioGroup1",label:"单选1",checked:false},
            			                   {value:"radioGroup2",label:"单选2",checked:false}
            			                  ];
            		}
            		$radioGroup.empty();
            		 if(radioGroup){
                         for(var i = 0, radio; i < radioGroup.length; i++) {
                             radio = radioGroup[i];
                             addRadio($radioGroup, radio.value, radio.label, radio.checked);
                         }
                     } 
            	},
                setValue : function(val){
                    if(val){
                        $radioGroup.find(':radio').each(function(){
                            if($(this).val() == val){
                                $(this).attr('checked', true);
                            }
                        });
                    }
                },
                getValue : function(){
                    return $radioGroup.find('input:checked').val();
                },

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
                //禁用行为
                disabled:function (value) {
                    var $input =$radioGroup.find("input[type='radio']");
                    value? $input.prop('disabled',true):$input.prop('disabled',false);

                },
                resetValue:function () {
                    $radioGroup.find(':checked').attr('checked', false);
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
        }
        
        if (!widget.component.foundationForm ) {
            widget.component.foundationForm = {};
        }
        widget.component.foundationForm.foundationRadioGroup = function ($selector, oOption, oAttr, oCss, auiCtx) {
            var

                formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

                /*编译阶段渲染代码*/
                return render( $selector,oOption, oAttr, oCss, formOption, auiCtx);
            };

        return widget;
    });
})();