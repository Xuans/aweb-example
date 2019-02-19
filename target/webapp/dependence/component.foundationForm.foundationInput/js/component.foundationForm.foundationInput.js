/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author lihao01@agree.com.cn
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

		function render( $selector, option,attr,css, formOption, auiCtx) {
			//初始化
			var init = function () {
					var style,heightvalue,inputObj,beforeVal;
					$input = $selector.find('input');
					beforeVal = $input.val()||"";
					attr.name && $input.attr('name', attr.name);
					//i18n
					if(auiCtx){
						(option.placeholder || option.placeholder === 0 ) && $input.attr('placeholder', $AW.nsl(option.placeholder,$selector.attr('id'),auiCtx));
					}
					
					option.disabled && $input.attr('disabled', option.disabled);
					option.autocomplete && $input.attr('autocomplete','off');


                    //自定义样式
                    if(css && css.cssCode && css.cssCode.className){
                         $selector.addClass(css.cssCode.className);
                    }
					//设置样式
					if(css && (style=css.style)) {
						if(style.input){
							inputObj = JSON.parse(JSON.stringify(style.input));
							$AW.cssHover('.input-group',$selector,$.extend({},inputObj),'');
							// inputObj['width'] && $selector.find('.input-group').css({'width':inputObj['width']});
							if(inputObj['height']) {
								heightvalue =inputObj['height'];
								if(heightvalue.substr(heightvalue.length-2,2)==='px') {
									$selector.find('.form-error-msg').css({'top': (parseFloat(inputObj['height']) + 5) + 'px'});
								}
							}
						}
						style.position && $selector.css(style.position);
						if(style.inputActive){
							$AW.cssHover('.input-group',$selector,style.inputActive,':focus');
							$AW.cssHover('.input-group',$selector,style.inputActive,':hover');
						}
						style.inputIconHover && $AW.cssHover('.input-warp:hover>span i',$selector,style.inputIconHover,'');
						if(style.title) {
							if(!isInline){
								$input.parent().prev().css(style.title);
							}else{
								if(typeof auiCtx ==='undefined') {
									$selector.children().first().find('label').css(style.title);
								}else{
									$selector.prev().find('label').css(style.title);
								}
							}
						}
					}

					//设置错误信息位置

					/*	$input.next('label').addClass('form-error-msg-' + option.errorMsgOrientation);*/

					//设置inp初始显示值
					(value || value === 0)&& $input.val(formatData(value, inputType));

					//处理小图标及前后置内容
					handleIconAndAppend(style);

					//处理数据输入
					//如果输入类型选择'无'，则不使用输入校验
					if(inputType){
					    handleInput();
					}
					//处理格式化数据显示和输入范围检查
					handleDataFormatAndScopeCheck();

					$input
						.off('inputChange')
						.on({

                        'focus.inputChange':function(e){

                        	beforeVal = $input.val();
						},
						'keyup.inputChange':function(e){
                        	var $target = $(e.target || event.srcElement);

                            if(beforeVal!==$target.val()){

                                beforeVal = $target.val();
                            	$input.trigger('ichange');
							}
						}
					})
				},
				//动态格式化代码
                dyncFormatData=function(noUpdate){
                    var formatedData,
                        $target = $input,
                        curVal = $target.val();

                    if (inputType === 'floatAmount' || inputType === 'integerAmount') {
                        //输入范围检查
                        if (handleScopeCheck(curVal)) {
                            value = curVal;
                        } else {
                            //设置错误样式
                            value = handleOutOfBorder(curVal);
                            setErrorStyle($target,'数值超出范围!');
//								app.alert('数值超出范围!', app.alert.ERROR);
                        }
                    } else {
                        value = curVal;
                    }

                    formatedData = formatData(value, inputType);

                    if(curVal!==formatedData && !noUpdate){
                        $target.val(formatedData);
                    }
                },
				//格式化数据
				formatData = function (value, inputType) {
					value || value === 0 || (value = '');
					var formatedData = '',
						//金额格式化
						formatMoney = function (money, decimalCount) {
							decimalCount = decimalCount >= 0 && decimalCount <= 20 ? decimalCount : 2;
							money = (money+'')
								.replace(/[^\d\.-]/g, "")
								.replace(new RegExp('(\\.\\d*)?$'),function(match){
									return match?(parseFloat(match).toFixed(decimalCount)+'').replace(/^0\./,'.'):'.00';
								});

							var intPart = money.split(".")[0].split("").reverse(),
								decimalPart = money.split(".")[1],
								result = "";
							for (var i = 0; i < intPart.length; i++) {
								result += intPart[i] + ((i + 1) % 3 == 0 && (i + 1) != intPart.length ? "," : "");
							}
							if (decimalPart) {
								return result.split("").reverse().join("") + "." + decimalPart;
							} else {
								return result.split("").reverse().join("");
							}
						},
						//格式化银行卡
						formatBankCard = function (value, countInGroup) {
							//默认4个一组
							countInGroup || (countInGroup = 4);

							var formatedData = '';
							//每countInGroup位插入空格
							if (value) {
								for (var i = 0; i < value.length; i++) {
									formatedData += value[i];
									if ((i + 1) % countInGroup == 0) {
										formatedData += ' ';
									}
								}
								//如果最后一个是空格，去掉
								if (formatedData[formatedData.length - 1] == ' ') {
									formatedData = formatedData.substring(0, formatedData.length - 1);
								}
							}
							return formatedData;
						};
					if (value  || value === 0) {
						switch (inputType) {
							case 'floatAmount':
								isNaN(value) && (value = 0);
								formatedData = formatMoney(value, 2);
								break;
							case 'integerAmount':
								isNaN(value) && (value = 0);
								formatedData = formatMoney(value, 0);
								break;
							case 'bankCard':

							//no break
							case 'idCard':
								formatedData = formatBankCard(value);
								break;
							default:
								formatedData = value;
								break;
						}
					}

					return formatedData;
				},
				//处理小图标
				handleIconAndAppend = function (style) {
					//前置内容
					if (prepend) {
						$span = $(spanTemplate).addClass('left-text');

						$span.text( $AW.nsl(prepend, attr.id, auiCtx));
						$input.before($span);

					}

					//后置内容
					if (append) {
						$span = $(spanTemplate).addClass('right-text');
                      /*  $span.addClass('append-span');*/
						$span.text( $AW.nsl(append, attr.id, auiCtx));
						$input.parent('div').append($span);

					}

					if (icon && useIcon) {
						var iconTmplate = '<span class="input-group-label"><i class="' + icon + '"></i></span>',
							$iconBtn,
							$span;

						//图标加在右边
						if (iconPosition) {
							$input.parent('div').children(':last').after(iconTmplate);
							$iconBtn = $input.parent('div').children(':last');
							$iconBtn.addClass('input-r-btn');


						} else {
							//图标加在左边
							$input.parent('div').children(':first').before(iconTmplate);
							$iconBtn = $input.parent('div').children(':first');
							$iconBtn.addClass('input-l-btn');

						}
						if(style && style.inputIcon){
							$iconBtn.css(style.inputIcon);
						}

					}
				},
				//越界处理
				handleOutOfBorder = function(val) {
					if (!handleScopeCheck(val)) {
						if (!isNaN(minAmount) && val < minAmount) {
							val = minAmount;
						}
						if (!isNaN(maxAmount) && val > maxAmount) {
							val = maxAmount;
						}
					}
					return val;
				},
				//处理格式化数据
				handleDataFormatAndScopeCheck = function () {
					//获取焦点事件
					$input.off('focus.formatData').on('focus.formatData', function (e) {
						var $target = $(e.target),
							currentValue=$target.val();
						//恢复非格式化数据

						if(value!==currentValue) {
							$target.val(value);
						}

						//清除错误样式
						clearErrorStyle($target);
					});

					//失去焦点事件
					$input.off('blur.formatDataAndCheck').on('blur.formatDataAndCheck', function (e) {
						dyncFormatData();
					});
				},
				//处理输入范围检查
				handleScopeCheck = function (curVal) {
					//下界和上界都配置
					if (!isNaN(minAmount) && !isNaN(maxAmount)) {
						var fValue = parseFloat(curVal);
						//如果超出范围，重置为上次输入的值
						if (fValue < minAmount || fValue >= maxAmount) {
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
						if (fValue >= maxAmount) {
							return false;
						}
					}
					return true;
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
					else if (ctrl.selectionStart || ctrl.selectionStart === '0')
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
					var preValue = '',
						preCursorPos,
						isKeyPress = false;
					$input.off('keydown.input').on('keydown.input', function (e) {
						if (!isKeyPress) {
							isKeyPress = true;
							//获取当前输入前光标位置
							preCursorPos = getCursortPosition(e.target);
						}
					});
					$input.off('keyup.input').on('keyup.input', function (e) {
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
								if (isNaN(curVal) && curVal !== '-') {
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
							case 'bankCard':
								var regex = /^\d*$/;
								if (!regex.test(curVal)) {
									inputSuccess = false;
								} else {
									inputSuccess = true;
								}
								break;
							case 'idCard':
								var regex = /^[xX0-9]{0,19}$/;
								if (!regex.test(curVal)) {
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
							value = curVal;
							$(e.target).val(curVal);
							//设置输入后光标位置
							setCaretPosition(e.target, cursorPos);
						} else {
							$(e.target).val(preValue);
							//设置输入前光标位置
							setCaretPosition(e.target, preCursorPos);
						}
					});
				},
				//设置错误样式
				setErrorStyle = function($input,errorMsg){
                    var $arrow = $input.next(),
                        $inputGroup = $input.parent('.input-group'),
                        $label = $arrow.next();

                    $label.empty().append('<i class="fa fa-exclamation-circle"></i>'+errorMsg);

                    $label.add($arrow).css("display", "block");
                    $inputGroup.addClass('form-error');

                    $input
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
				clearErrorStyle = function($input){
                   if($input && $input.next) {
                       var $label = $input.next().next('label'),
                           $inputGroup = $input.parent('.input-group'),
						   $arrow = $input.next('div');

                       $input.off('.error');
                       $inputGroup.removeClass('form-error');

                       $label.add($arrow).css("display", "none");
                   }
				},
				setValue = function (data) {
					value = data;
					var formatedData = formatData(value, inputType);
					$input.val(formatedData);
				},
				getValue = function () {
                      dyncFormatData(true);
					return value||$input.val();
				},

				getFormatValue = function () {
					return formatData(value, inputType);
				},
				resetValue = function () {
					value = (option.value || option.value === 0) ? option.value : '';
					var formatedData = formatData(value, inputType);
					$input.val(formatedData);
                    clearErrorStyle($input);
				},
				focus = function(){
                    var value = $input.val(),
                        len = value&&value.length,
                        input;

                    if($input.length&&len){
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

                    }else{
                        $input.trigger('focus');
                    }
				};

			var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
				horizontalTemp = '<label title="_label_">_label__mustInput_</label><div class="input-group input-warp"><input class="input-group-field" type="text" ><div class="form-error-arrow"></div><label class="form-error-msg"></label></div>',
				inlineTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
					"</div>" +
					"<div class='columns'>" +
					"<div class='input-group input-warp'><input class='input-group-field' type='text' ><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>" +
					"</div>",
				spanTemplate = '<span class="input-group-label "></span>',
				classname,
				value='',
				inputType,
				prepend,
				append,
				icon,
				iconPosition,
				$input,
				returnValue,
				minAmount,
				maxAmount,
				useIcon,
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? inlineTemp : horizontalTemp,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan;

			option.input_type && (inputType = option.input_type);
			(option.value || option.value === 0) && (value =  option.value );
			option.prepend && (prepend = option.prepend);
			option.append && (append = option.append);
			option.icon && (icon = option.icon);
			option.iconPosition && (iconPosition = option.iconPosition);
			option.minAmount && (minAmount = option.minAmount);
			option.maxAmount && (maxAmount = option.maxAmount);
			option.useIcon && (useIcon = option.useIcon);
			//i18n
			if(auiCtx){
				template = template
				.replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx)|| "")
				.replace(/_mustInput_/, option.mustInput ? mustInputTemp: "");
				(option.value || option.value === 0) && (value =   $AW.nsl(option.value,$selector.attr('id'),auiCtx));
			}
			

				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4FoundationInput",
						attr);

					attr.id && $selector.attr('id', attr.id);
				} else {
					$selector.append(template);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
				}

				//初始化
				init();


			returnValue = {
				setValue: setValue,
				getValue: getValue,
				focus:focus,
				getFormatValue: getFormatValue,
                getTrimValue:function () {
               		 return $.trim(getValue())
            	},
				resetValue: resetValue,

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
				error: setErrorStyle,

				/*
				 *  desp Clean Callback
				 *   params： @jquery event handler event
				 *
				 * */
				clean: function (e) {
					clearErrorStyle($input);
				},

				/*
				 *   desp success callback
				 *   params  @jquery object $input
				 *
				 * */

				success: function ($input) {
					var $label = $input.next().next('label'),
                        $inputGroup = $input.parent('.input-group'),
					    $arrow = $input.next('div');

                    $inputGroup.removeClass('form-error');
					$input.off('.error');

                    $label.add($arrow).css("display","none");
				},

				/*
				 *
				 * desp validate handler
				 * params @value
				 * return params {
				 *
				 *
				 *   }
				 * */
				validateHandler: function (value) {

					return {
						result: true,        //校验结果
						value: value,        //传输的格式
						errorMsg: ''         //校验失败的结果
					}
				},
                disabled:function(value){
					value ?  $input.prop('disabled',true):$input.prop('disabled',false);
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

		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}
		widget.component.foundationForm.foundationInput = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var

				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};


				return render($selector, oOption, oAttr,oCss, formOption, auiCtx);
			};


		return widget;
	});
})();