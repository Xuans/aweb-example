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

		function render($selector,  option, attr, css,formOption, auiCtx) {
			//添加checkbox
			var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
				horizontalCheckboxGroupTemp = "<div ><label title='_label_'>_label__mustInput_</label><div class='checkboxGroup'></div></div>",
				inlineCheckboxGroupTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
					"</div>" +
					"<div class='columns'>" +
					"<div class='checkboxGroup'></div>" +
					"</div>",
				checkboxTemp = "<div><input id='_id_' type='checkbox' _disabled_><label for='_id_' title='_label_'>_label_</label></div>",
				classname,
				$checkboxGroup,
				index = 0,
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				checkboxGroupTemp = isInline ? inlineCheckboxGroupTemp : horizontalCheckboxGroupTemp,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
				style,
				$checkbox,
				checkboxObj,
                addCheckbox = function ($checkboxGroup, value, label, checked) {
                    var template,$checkbox;
                    if(auiCtx){
                        template = checkboxTemp.replace(/_label_/g, $AW.nsl(label,$selector.attr("id"),auiCtx) || ('label' + index)).replace(/_id_/g, $checkboxGroup.attr('id') + "_" + index);
                    }
                    if(option.disabled){
                        template = template.replace(/_disabled_/g, "disabled='true'");
                    }else{
                        template = template.replace(/_disabled_/g, "");
                    }

                    index++;

                    $checkboxGroup.append(template);
                    $checkbox = $checkboxGroup.find('input:last');

                    attr.name ? $checkbox.attr('name', attr.name)
                        : $checkbox.attr('name', attr.id);
                    $checkbox.val(value);
                    checked && $checkbox.attr('checked', true);

                    //设置input的父label的display属性
                    if (option.horizontal) {
                        $checkbox.closest('div').addClass('checkbox checkbox-success checkbox-inline');

                    } else {
                        $checkbox.closest('div').addClass('checkbox checkbox-success');
                    }
                },
                init = function ($selector) {
                    var i, checkbox;
                    $checkboxGroup = $selector.find('.checkboxGroup');
                    attr.id && $checkboxGroup.attr('id', attr.id);

                    if (option.checkboxGroup) {
                        for ( i = 0; i < option.checkboxGroup.length; i++) {
                            checkbox = option.checkboxGroup[i];
                            addCheckbox($checkboxGroup, checkbox.value, checkbox.label, checkbox.checked);
                        }
                    }
                };

			    if(auiCtx){
				checkboxGroupTemp = checkboxGroupTemp
				.replace(/_label_/g, $AW.nsl((option.label),$selector.attr("id"),auiCtx)|| "")
				.replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
			}

				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						checkboxGroupTemp,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4FoundationCheckboxGroup",
						attr);
					attr.id && $selector.attr('id', attr.id);
				} else {
					$selector.append(checkboxGroupTemp);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
				}

			//初始化
			init($selector);

            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }
			///样式处理
			$checkboxGroup = $selector.find('.checkboxGroup');

			if (css && (style = css.style)) {
				style.label && $checkboxGroup.prev('label').css(style.label);
				if (style.label) {
					if (!isInline) {
						$checkboxGroup.prev('label').css(style.label);
					} else {
							$selector.prev().find('label').css(style.label);
					}
				}
				style.position && $selector.css(style.position);
				style.font && $checkboxGroup.find("label").css(style.font);
				style.font && $checkboxGroup.find("label").css(style.font);


				if (style.checkbox) {
					$AW.cssHover('.checkboxGroup .checkbox label', $selector, style.checkbox, '::before');
					$AW.cssHover('.checkboxGroup input[type=checkbox]', $selector, {
						'width': style.checkbox.width,
						'height': style.checkbox.height
					}, '');
				}

				style.inputHover && $AW.cssHover('.checkboxGroup .checkbox label', $selector, style.inputHover, ':hover:before');
				if(style.inputChecked) {
                    checkboxObj =  JSON.parse(JSON.stringify(style.inputChecked));
                    $AW.cssHover('.checkboxGroup input[type=checkbox]:checked + label', $selector, style.inputChecked, '::before');
                    $AW.cssHover('.checkboxGroup input[type=checkbox]:checked + label', $selector, $.extend({}, style.inputChecked, {'border-color': checkboxObj['border-color']}), ':after');
                }
				}
			return {
				setCheckboxGroup: function (checkboxGroup) {
					var i,checkbox;
					if (!checkboxGroup) {
						checkboxGroup = [];
					}
					if (checkboxGroup === 'auiAjaxTest') {
						checkboxGroup = [
							{value: "checkboxgroup1", label: "复选1", checked: false},
							{value: "checkboxgroup2", label: "复选2", checked: false}
						];
					}
					$checkboxGroup.empty();
					if (checkboxGroup) {
						for ( i = 0; i < checkboxGroup.length; i++) {
							checkbox = checkboxGroup[i];
							addCheckbox($checkboxGroup, checkbox.value, checkbox.label, checkbox.checked);
						}
					}
				},
				setValue: function (values) {
					var i,$checkboxs = $checkboxGroup.find(':checkbox').attr('checked', false);
					if (values) {
						for ( i = 0; i < values.length; i++) {
							$checkboxs.each(function () {
								if ($(this).val() === values[i]) {
									$(this).attr('checked', true);
								}
							});
						}
					}
				},
				getValue: function () {
					var resultArr = [];
					$checkboxGroup.find(':checked').each(function () {
						resultArr.push($(this).val());
					});
					return resultArr;
				},
				//全选
				selectAll: function () {
					$checkboxGroup.find(':checkbox').attr('checked', true);
				},
				//反选
				reverseSelection: function () {
					var $selects = $checkboxGroup.find(':checked'),
					 $all = $checkboxGroup.find('input'),
                        isChecked = false,i;
					$all.each(function () {
						 isChecked = false;
						for ( i = 0; i < $selects.length; i++) {
							if ($selects[i] === this) {
								isChecked = true;
								break;
							}
						}
						if (!isChecked) {
							$(this).attr('checked', true);
						}
					});

					$selects.each(function () {
						$(this).attr('checked', false);
					});
				},
				//重置
				resetValue: function () {
					$checkboxGroup.find(':checked').attr('checked', false);
				},

				// 一个行为类型方法的 实现
				display: function (result, input1, input2, condition) {
					this[result ? 'hide' : 'show']();
				},

				show: function (e, size) {
					$selector.removeClass('hide');
					isInline && $selector.prev(".columns").removeClass('hide');
				},

				hide: function () {
					$selector.addClass('hide');
					isInline && $selector.prev(".columns").addClass('hide');
				},
				//禁用行为
				disabled:function (value) {
					var $input =$checkboxGroup.find("input[type='checkbox']");
					value? $input.prop('disabled',true):$input.prop('disabled',false);

				},
				mustInput:function (flag){
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
		widget.component.foundationForm.foundationCheckboxGroup = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var formOption;

				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				/*编译阶段渲染代码*/
				return render( $selector, oOption, oAttr, oCss, formOption, auiCtx);
			};


		return widget;
	});
})();