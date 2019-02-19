/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

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

		var AUI_IMAGE_PATH='./img/404.png';

		function render($selector, option,  attr,css, formOption, auiCtx) {



			var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
				horizontalTemp = '<label title="_label_">_label__mustInput_</label><div class="input-group input-warp"><input class="input-group-field" type="text"><div class="form-error-arrow"></div><label class="form-error-msg"></label>'
				+ '<span class="input-verifyCode"><img/></span>' +
				'</div>',
				inlineTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
					"</div>" +
					"<div class='columns'>" +
					"<div class='input-group input-warp'><input class='input-group-field' type='text'><div class='form-error-arrow'></div><label class='form-error-msg'></label>" +
					"<span class='input-verifyCode'><img/></span></div>" +
					"</div>",
				spanTemplate = '<span class="input-group-label"></span>',
				classname,
				$input,
				$img,
				$span,
				returnValue,
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? inlineTemp : horizontalTemp,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
                init = function () {
                    var style,inputOBj, heightvalue;
                    $input = $selector.find('input');
                    $img = $selector.find('.input-verifyCode>img');
                    $span = $selector.find('span.input-verifyCode');

                    setVerifyImgSrc(option.src);
                    attr.name && $input.attr('name', attr.name);
                    if(auiCtx){
                        (option.placeholder || option.placeholder === 0 ) && $input.attr('placeholder', $AW.nsl(option.placeholder,attr.id,auiCtx));
                        option.imgTitle && $img.attr('title', $AW.nsl(option.imgTitle,attr.id,auiCtx));
                    }

                    option.autocomplete && $input.attr('autocomplete','off');
                    option.checkCodeCtnWidth && $span.css({
                        'min-width': option.checkCodeCtnWidth,
                        'width':option.checkCodeCtnWidth
                    });


                    //自定义样式
                    if(css && css.cssCode && css.cssCode.className){
                        $selector.addClass(css.cssCode.className)
                    }
                    //设置样式
                    if (css && (style = css.style)) {
                        if (style.input) {
                            // $input.css($.extend({}, style.input));
                            inputOBj = JSON.parse(JSON.stringify(style.input));
                            $AW.cssHover('.input-group',$selector,style.input,'');
                            // inputOBj['width'] && $selector.find('.input-group').css({'width': inputOBj['width']});
                            if (inputOBj['height']) {
                                heightvalue = inputOBj['height'];
                                if (heightvalue.substr(heightvalue.length - 2, 2) === 'px') {
                                    $selector.find('.form-error-msg').css({'top': (parseFloat(inputOBj['height']) + 5) + 'px'});
                                }
                            }
                        }
                        style.inputIconHover && $AW.cssHover('.input-warp:hover>span i', $selector, style.inputIconHover, '');

                        if (style.inputActive) {
                            $AW.cssHover('.input-group', $selector, style.inputActive, ':focus');
                            $AW.cssHover('.input-group', $selector, style.inputActive, ':hover');
                        }
                        style.position && $selector.css(style.position);

                        if(style.input){
                            $span.css({'border-radius': style.input['border-radius']});
                        }

                        if (style.title) {
                            if (!isInline) {
                                $input.parent().prev().css(style.title);
                            } else {
                                if (typeof auiCtx === 'undefined') {
                                    $selector.children().first().find('label').css(style.title);
                                } else {
                                    $selector.prev().find('label').css(style.title);
                                }
                            }
                        }
                    }


                    //处理小图标
                    handleIconAndAppend(style);
                    //注册事件
                    registerEvent();
                },
                //处理小图标
                handleIconAndAppend = function (style) {
                    if (option.icon && option.useIcon) {
                        var iconTmplate = '<span class="input-group-label"><i class="' + option.icon + '"></i></span>',
                            $iconBtn;

                        //图标加在右边
                        if (option.iconPosition) {
                            $input.after(iconTmplate);
                            $iconBtn = $input.parent('div').children(':last');
                            $iconBtn.addClass('input-r-btn');

                        } else {
                            //图标加在左边
                            $input.before(iconTmplate);
                            $iconBtn = $input.parent('div').children(':first');
                            $iconBtn.addClass('input-l-btn');

                        }
                        if (style && style.inputIcon) {
                            $iconBtn.css(style.inputIcon);
                        }

                    }
                },
                //去掉src中verify.do?random=12346546的?random=12346546
                removeParamForSrc = function (src) {
                    if (src) {
                        var index = src.indexOf('?');
                        if (index !== -1) {
                            src = src.substring(0, index);
                        }
                    }
                    return src;
                },
                //注册事件
                registerEvent = function () {
                    if (option.isCheckCodeChangeOnClick) {
                        $img.off('click.checkCodeChange.img').on('click.checkCodeChange.img', function (e) {
                            refreshVerifyImage();
                        });
                    }
                },
                //设置验证码路径
                setVerifyImgSrc = function (src) {
                    //ie8兼容
                    var rand = Date.now?Date.now():new Date().getTime();

                    if(!src || window.auiApp) {
                        src = AUI_IMAGE_PATH;

                        $img.attr('src', src).css('height','30px');
                    }else{
                        if(~src.indexOf('data')){
                            $img.attr('src',src)
                        }else{
                            $img.attr('src', src + '?random=' + rand);
                        }

                    }


                },
                //获取验证码路径,不包含?random=111312
                getVerifyImageSrc = function () {
                    var src = $img.attr('src');
                    return removeParamForSrc(src);
                },
                //刷新验证码
                refreshVerifyImage = function () {
                    var src = getVerifyImageSrc();

                    if(~src.indexOf('data')){
                        app.ajax({
                            url: option.src,
                            type: "get",
                            success: function(response) {
                                if (response.status && response.content && response.content.basic64ImgStr) {
                                    src = response.content.basic64ImgStr.replace("\n\r", "");

                                    setVerifyImgSrc(src);

                                }
                            },
                            error: function(e) {
                                app.alert("获取验证码失败", app.alert.ERROR);
                            }
                        });
                    }else{
                        setVerifyImgSrc(src);
                    }




                },
                setValue = function (data) {
                    $input.val(data);
                },
                getValue = function () {
                    return $input.val();
                },
                resetValue = function () {
                    $input.val('');
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

               formOption = formOption || {};
		    	//i18n
		    	if(auiCtx){
				template = template
				.replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx)|| "")
				.replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
			}


				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4FoundationVerifyInput",
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
				setVerifyImgSrc: setVerifyImgSrc,
				getVerifyImageSrc: getVerifyImageSrc,
				refreshVerifyImage: refreshVerifyImage,
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
				error: function ($input, errorMsg) {
					var $arrow = $input.next(),
                        $inputGroup = $input.parent('.input-group'),
						$label = $arrow.next();

					$label.empty().append('<i class="fa fa-exclamation-circle"></i>' + errorMsg);

                    $label.add($arrow).css("display", "block");
                    $inputGroup.addClass('form-error');
					$input
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
                disabled:function(value){
                    value ?  $input.prop('disabled',true):$input.prop('disabled',false);
                },

				/*
				 *  desp Clean Callback
				 *   params： @jquery event handler event
				 *
				 * */
				clean: function (event) {
					/*	resetValue();*/
					var $label = $input.next().next('label'),
                        $inputGroup = $input.parent('.input-group'),
					   $arrow = $input.next('div');
                    $inputGroup.removeClass('form-error');
					$input.off('.error');

                    $label.add($arrow).css("display", "none");
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
                    $label.add($arrow).css("display", "none");
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
						value: $input.val(),        //传输的格式
						errorMsg: ''         //校验失败的结果
					}
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
			return returnValue;
		}

		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}
		widget.component.foundationForm.foundationVerifyInput = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var

				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				return render($selector, oOption, oAttr, oCss, formOption, auiCtx);
			};


		return widget;
	});
})();