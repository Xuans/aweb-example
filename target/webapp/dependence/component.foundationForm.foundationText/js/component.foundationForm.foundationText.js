/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.04.03
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

		function render($selector, option,attr, css, formOption, auiCtx) {
			formOption = formOption || {};

			var horizontalTemp = '<label title="_label_">_label_</label><div class="text-div"></div>',
				inlineTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' title='_label_'>_label_</label>" +
					"</div>" +
					"<div class='columns'>" +
					"<div class='text-div'></div>" +
					"</div>",
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? inlineTemp : horizontalTemp,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
				$div, style,returnValue;
			$selector.attr("id", attr.id || '');
		    	if(auiCtx){
				template = template
				.replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx)|| "");
			}

				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4FoundationText",
						attr);
					$selector.attr('id', attr.id);
				} else {
					$selector.append(template);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
				}

			$div = $selector.find('div.text-div');
			option.content && $div.html(option.content);

            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }
			//样式解析配置
			if (css && (style = css.style)) {
				if (style.title) {
					if (!isInline) {
						$div.prev('label').css(style.title);
					} else {
						if (typeof auiCtx === 'undefined') {
							$selector.children().first().find('label').css(style.title);
						} else {
							$selector.prev().find('label').css(style.title);
						}
					}
				}
				style.position && $selector.css(style.position);
				style.content && $div.css(style.content);
			}

			returnValue = {
				setValue: function (data) {
					$div.html(data);
				},
				getValue: function () {
					return $div.html();
				},
				resetValue:function () {
                    $div.html('');
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
                getTrimValue:function () {
                    return $.trim(returnValue.getValue())
                }
			};
			return returnValue;
		}

		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}

		widget.component.foundationForm.foundationText = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var
				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')];

				return render($selector, oOption, oAttr, oCss,formOption, auiCtx);
			};


		return widget;
	});
})();