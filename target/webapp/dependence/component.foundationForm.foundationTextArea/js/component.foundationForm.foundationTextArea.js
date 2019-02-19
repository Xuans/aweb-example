/**
 * @author hefuxiang@agree.com.cn
 */
( /* <global> */function (undefined) {

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


			//设置高度
			var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
				horizontalTemp = "<label title='_label_'>_label__mustInput_</label><div class='fd-textarea-ctn'><textarea class='fd-textarea'/><div class='form-error-arrow'></div><label class='form-error-msg' ></label></div>",
				inlineTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
					"</div>" +
					"<div class='columns'>" +
					"<div class='fd-textarea-ctn'><textarea  class='fd-textarea' /><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>" +
					"</div>",
				classname,
				value,
				$textArea,
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? inlineTemp : horizontalTemp,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
                setHeight = function (ele) {
                    $(ele).css({'height': 'auto', 'overflow-y': 'hidden'}).height(ele.scrollHeight);
                },
                //自适应高度
                autoHeight = function () {
                    setHeight($textArea[0]);
                    $textArea.off('input.autoHeight').on('input.autoHeight', function () {
                        setHeight(this);
                    });
                },
                //初始化
                init = function () {
                    var style;
                    $textArea = $selector.find('textArea');

					/*      //设置错误信息位置
					 $textArea.next('label').addClass('form-error-msg-'  + option.errorMsgOrientation);
					 */
                    attr.name && $textArea.attr('name', attr.name);
                    option.disabled && $textArea.attr('disabled', option.disabled);
                    option.rows && $textArea.attr('rows', option.rows);

                    $textArea.attr('wrap', option.wrap ? 'soft' : 'off');
                    option.maxlength && $textArea.attr('maxlength', option.maxlength);
                    //i18n
                    if(auiCtx){
                        option.placeholder && $textArea.attr('placeholder', $AW.nsl(option.placeholder,$selector.attr('id'),auiCtx).replace(/\\n/g,'\n'));
                        option.value && $textArea.val($AW.nsl(option.value,$selector.attr('id'),auiCtx));
                    }

                    //应用自适应高度
                    option.autoHeight && autoHeight();

                    //自定义样式
                    if(css && css.cssCode && css.cssCode.className){
                        $selector.addClass(css.cssCode.className)
                    }
                    //样式解析渲染
                    if (css && (style = css.style)) {
                        if (style.title) {
                            if (!isInline) {
                                $textArea.parent().prev('label').css(style.title);
                            } else {
                                if (typeof auiCtx === 'undefined') {
                                    $selector.children().first().find('label').css(style.title);
                                } else {
                                    $selector.prev().find('label').css(style.title);
                                }
                            }
                        }
                        style.position && $selector.css(style.position);
                        style.textArea && $textArea.css(style.textArea);
                    }

                },
                //设置值
                setValue = function (val) {
                    $textArea.val(val);
                    if (option.autoHeight) {
                        //重新设置高度
                        setHeight($textArea[0]);
                    }
                },
                //获取值
                getValue = function () {
                    return $textArea.val();
                },
                //重置值
                resetValue = function () {
                    $textArea.val(option.value || '');
                    if (option.autoHeight) {
                        //重新设置高度
                        setHeight($textArea[0]);
                    }
                },
                focus = function(){

                    var value = $textArea.val(),
                        len = value&&value.length,
                        input;

                    if($textArea.length&&len){
                        input = $textArea[0];
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

                    }else{
                        $textArea.trigger('focus');
                    }
                };

            formOption = formOption || {};
			option.value && (value = option.value || '');
			//i18n
			if(auiCtx){
				template = template
				.replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx) || "")
				.replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
			}
			



				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4FoundationTextArea",
						attr);

					attr.id && $selector.attr('id', attr.id);
				} else {
					$selector.append(template);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
				}


			init($selector);

			return {
				setValue: setValue,
				getValue: getValue,
				resetValue: resetValue,
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
				error: function ($textArea, errorMsg) {
					var $arrow = $textArea.next(),
						$label = $arrow.next();

					$label.empty().append('<i class="fa fa-exclamation-circle"></i>' + errorMsg);
					$label.css("display", "block");
					$arrow.css("display", "block");
					$textArea
						.addClass('form-error')
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
				/*	resetValue();*/
					var $arrow = $textArea.next(),
						$label = $arrow.next();
					$arrow.css("display", "none");
					$label.css("display", "none");
					$textArea.removeClass('form-error');
				},

				/*
				*   desp success callback
				*   params  @jquery object $input
				*
				* */
				success: function (textArea) {
					var $label = $textArea.next().next('label');
					var $arrow = $textArea.next('div');

					$textArea.removeClass('form-error');
					$textArea.off('.error');

					$label.css("display", "none");
					$arrow.css("display", "none");
				},
                disabled:function(value){
                    value ?  $textArea.prop('disabled',true):$textArea.prop('disabled',false);
                },
                getTrimValue:function () {
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
                }
			};
		}

		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}
		widget.component.foundationForm.foundationTextArea = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var

				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				return render($selector, oOption, oAttr,  oCss, formOption, auiCtx);
			};


		return widget;
	});
})();