(function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", "flatpickr", 'component.foundationForm'], factory);
		}
		// global
		else {
			factory();
		}
	})
	(function ($, widget) {
		"use strict";

		function renderDatepicker( $selector, option, attr,  css,formOption, auiCtx) {
			var mustInputTemp = '<span style="color:#ff0000;padding-right:2px;">*</span>',
				horizontalTemp = '<label title="_label_">_label__mustInput_</label><div class="input-group input-warp"><input type="text" name="" placeholder=_INPUTTIPS_><div class="form-error-arrow"></div><label class="form-error-msg"></label></div>',
				inlineTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
					"</div>" +
					"<div class='columns'>" +
					"<div class='input-group input-warp'><input type='text' placeholder=_INPUTTIPS_ /><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>" +
					"</div>",
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? inlineTemp : horizontalTemp,
				span = option.span || formOption.span || 1,
				labelSpan = option.labelSpan || formOption.labelSpan,
				returnValue,
				$input,
				style,
				mainColor,
				mainColorObj,
				$dateTimePick,
				validateTemplate = '<label class="form-error-msg"></label>',
				enableTime = false,
				enableSeconds = false;
			//根据format的参数设置enableTime,enableSeconds
			if (option.format && option.format.indexOf('H') !== -1) {
				enableTime = true;
				if (option.format.indexOf('S') !== -1) {
					enableSeconds = true;
				} else {
					enableSeconds = false;
				}
			} else {
				enableTime = false;
				enableSeconds = false;
			}
			// i18n
			if(auiCtx){
				template = template
				.replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx)|| "")
				.replace(/_INPUTTIPS_/,$AW.nsl(option.inputTips,$selector.attr('id'),auiCtx)|| "")
				.replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
			}


				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4DateTimePicker",
						attr);
					attr.id && $selector.attr('id', attr.id);
				} else {
					$selector.append(template);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
				}

			//设置内容
			$input = $selector.find("input");
			option.disabled && $input.attr("disabled", "disabled");

			$dateTimePick = $($input.flatpickr(
				{
					allowInput: true,
					dateFormat: option.format,
					enableTime: enableTime,
					enableSeconds: enableSeconds,
					time_24hr: true,
					onChange: function (e) {
						if (e && !e.trigger) {
							$input.trigger('Change');
						}
					}
				}).calendarContainer);
			//添加校验模板
			$input.after(validateTemplate);

            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }

			//样式

			if (css && ( style = css.style)) {
				if (style.title) {
					if (!isInline) {
						$selector.find("label").eq(0).css(style.title);
					} else {
						if (typeof auiCtx === 'undefined') {
							$selector.children().first().find('label').css(style.title);
						} else {
							$selector.prev().find('label').css(style.title);
						}
					}
				}
				if (style.input) {
					$input.css($.extend({}, style.input, {'width': ''}));
					$input.parent().css({'width':  JSON.parse(JSON.stringify(style.input))['width']});
				}
				style.position && $selector.css(style.position);
				if (style.mainColor) {
					mainColor = style.mainColor;
					mainColorObj =  JSON.parse(JSON.stringify(style.mainColor));
					$AW.cssHover('.flatpickr-next-month', $dateTimePick, {'color': mainColorObj['color']}, ':hover');
					$AW.cssHover('.flatpickr-prev-month', $dateTimePick, {'color': mainColorObj['color']}, ':hover');
					$AW.cssHover('.flatpickr-next-month svg', $dateTimePick, {'fill': mainColorObj['color']}, ':hover');
					$AW.cssHover('.flatpickr-prev-month svg', $dateTimePick, {'fill': mainColorObj['color']}, ':hover');
					$AW.cssHover('.flatpickr-current-month .cur_month', $dateTimePick, {'color': mainColorObj['color']}, ':hover');
					$AW.cssHover('.flatpickr-day.today', $dateTimePick, {'border-color': mainColorObj['color']}, '');
					$AW.cssHover('.flatpickr-day.today', $dateTimePick, {
						'background': mainColorObj['color'],
						'color': '#fff'
					}, ':hover');
					$AW.cssHover('.flatpickr-day.today', $dateTimePick, {
						'background': mainColorObj['color'],
						'color': '#fff'
					}, ':focus');
					$AW.cssHover('.flatpickr-day.selected', $dateTimePick, {
						'border-color': mainColorObj['color'],
						'background': mainColorObj['color']
					}, '');
					$AW.cssHover('.flatpickr-day', $dateTimePick, {
						'background': mainColorObj['background-color'],
						'border-color': mainColorObj['background-color'],
						'color': mainColorObj['color']
					}, ':hover');
					$AW.cssHover('.flatpickr-current-month .cur_year', $dateTimePick, {'background': mainColorObj['background-color']}, ':hover');

				}
			}

			returnValue = {
				setValue: function (val) {
					val? $input[0]._flatpickr.setDate(val):$input[0]._flatpickr.clear();
				},
				getValue: function () {
					return $input.val();
				},
				resetValue: function () {
					$input[0]._flatpickr.clear();
				},

				// 一个行为类型方法的 实现
				display: function (result, input1, input2, condition) {
					this[result ? 'hide' : 'show']();
				},

				show: function () {
					$selector.removeClass('hide');
					isInline && $selector.prev(".columns").removeClass('hide');
				},

				hide: function () {
					$selector.addClass('hide');
					isInline && $selector.prev(".columns").addClass('hide');
				},
				error: function ($input, errorMsg) {
					var $label = $input.next('label'),
                        $inputGroup = $input.parent('.input-group');
					$label.find('span').text(errorMsg);
                    $inputGroup.addClass('form-error');
				},
				clean: function (event) {
					$input[0]._flatpickr.clear();
					var  $inputGroup = $input.parent('.input-group');
                    $inputGroup.removeClass('form-error');
				},
				success: function () {
                    var  $inputGroup = $input.parent('.input-group');
                    $inputGroup.removeClass('form-error');
				},
				setMaxDate: function (val) {
					//暂时只支持js日期格式字符串或者js日期对象
					if ($.type(val) == 'string') {
						val = new Date(val);
					}
					$input[0]._flatpickr.set('maxDate', val);
				},
				setMinDate: function (val) {
					//暂时只支持js日期格式字符串或者js日期对象
					if ($.type(val) == 'string') {
						val = new Date(val);
					}
					$input[0]._flatpickr.set('minDate', val);
				},
                mustInput: function (flag) {
                    var $label = $('[title="'+option.label+'"]',$selector);

                    $label.empty();
                    if(flag === true){
                        $label.html(mustInputTemp+option.label)
                    }else{
                        $label.html(option.label)
                    }
                }
			};
			return returnValue;
		}

		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}

		widget.component.foundationForm.foundationDateTimePicker = function ($selector,option,attr,css,auiCtx) {
			var formOption;


				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				return renderDatepicker($selector, option,  attr, css,formOption, auiCtx);
			};


		return widget;
	});
})();
