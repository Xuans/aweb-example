/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author lijiancheng@agree.com.cn
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", 'component.foundationForm','awebIcon','template'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget,_,icons,artTemplate) {
		"use strict";

		//CONST
		var CONST={
			MUST_INPUT:'<span style="color: #ff0000; padding-right:2px;">*</span>',

			HOR_TEMP:'<label title="_label_">_label__mustInput_</label>' +
						'<div class="input-group input-warp">' +
							'<div data-role="input" class="input-group-field" style="cursor:pointer;" type="text"/>' +
							'<div class="form-error-arrow"></div>' +
							'<label class="form-error-msg"></label>' +
						'</div>',
			INL_TEMP:'<div class="columns">' +
						'<label for="middle-label" class="text-right middle" title="_label_">_label__mustInput_</label>' +
					'</div>' +
					'<div class="columns">' +
						'<div class="input-group input-warp">' +
							'<div data-role="input" class="input-group-field" style="cursor:pointer;" type="text" />' +
							'<div class="form-error-arrow"></div>' +
							'<label class="form-error-msg"></label>' +
						'</div>' +
					'</div>',

			SPAN_TEMP:'<span class="input-group-label "></span>',

			ICON_MODAL_TEMP:
					'<div class="foundation-select-icon-header clearfix">' +
						'<div class="aui-aside-search-bar-ctt">' +
							'<i class="aui aui-sousuo"></i><input type="text" class="aui-search-query foundation-select-icon-search" placeholder="搜索图标">' +
						'</div>' +
						'<div class="foundation-select-icon-size-toggle">' +
							'<button data-role="b" class="toggle-btn ">大</button>' +
							'<button data-role="m" class="toggle-btn active">中</button>' +
							'<button data-role="s" class="toggle-btn  ">小</button>' +
						'</div>' +
					'</div>',

			ICON_MODAL_CTN_CLASS:'foundation-select-icon-ctn',
			ICON_LIST_TEMP:'<div class="foundation-select-icon-icons-wrapper">' +
								'{{each iconList as item index}}'+
									'<ul class="foundation-select-icon-icon-list md clearfix">'+
										'{{each item.iconArr}}'+
										'<li class="icon-wrapper" title="{{$value.value}}"><i class="{{item.namespace}} {{$value.value}}"></i><span class="icon-name"><span>{{$value.name}}</span></span></li>'+
										'{{/each}}'+
									'</ul>' +
								'{{/each}}'+
							'</div>',
			ICON_LIST_HTML:''
		};

		//methods
		var render=function($selector, option, css, attr, formOption, auiCtx) {
			var mustInputTemp = CONST.MUST_INPUT,
				horizontalTemp = CONST.HOR_TEMP,
				inlineTemp = CONST.INL_TEMP,
				spanTemplate = CONST.SPAN_TEMP,
				value,
				prepend=option.prepend||'',
				append=option.append||'',
				icon=option.icon||'',
				iconPosition=option.iconPosition===0?0:1,
				$input,
				useIcon=option.useIcon||'',
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? inlineTemp : horizontalTemp,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
				//初始化
				init = function () {
					var style, inputHeight,
						inputObj, beforeVal;

					$input = $selector.find("[data-role=input]");
					attr.name && $input.attr('name', attr.name);

					//i18n
					option.placeholder=$AW.nsl(option.placeholder, $selector.attr('id'), auiCtx);
					option.disabled && option.disabled === true ? $input.attr("disabled","disabled").css({"background-color" : "#eee","cursor" : "not-allowed"}) : $input.removeAttr("disabled");
					option.autocomplete && $input.attr('autocomplete', 'off');
					//自定义样式
					if (css && css.cssCode && css.cssCode.className) {
						$selector.addClass(css.cssCode.className)
					}
					//设置样式
					if (css && (style = css.style)) {
						if (style.input) {
							inputObj = JSON.parse(JSON.stringify(style.input));
							$AW.cssHover('.input-group', $selector, $.extend({}, inputObj), '');
							// inputObj['width'] && $selector.find('.input-group').css({'width':inputObj['width']});
							if (inputObj['height']) {
								inputHeight = inputObj['height'];
								if (inputHeight.substr(inputHeight.length - 2, 2) === 'px') {
									$selector.find('.form-error-msg').css({ 'top': (parseFloat(inputObj['height']) + 5) + 'px' });
								}
							}
						}
						style.position && $selector.css(style.position);
						if (style.inputActive) {
							$AW.cssHover('.input-group', $selector, style.inputActive, ':focus');
							$AW.cssHover('.input-group', $selector, style.inputActive, ':hover');
						}
						style.inputIconHover && $AW.cssHover('.input-warp:hover>span i', $selector, style.inputIconHover, '');
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

					//设置inp初始显示值
					setValue(value);

					//处理小图标及前后置内容
					handleIconAndAppend(style);

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
						if (style && style.inputIcon) {
							$iconBtn.css(style.inputIcon);
						}

					}
				},
				//设置错误样式
				setErrorStyle = function (_, errorMsg) {
					var $arrow = $input.next(),
						$inputGroup = $input.parent('.input-group'),
						$label = $arrow.next();

					$label.empty().append('<i class="fa fa-exclamation-circle"></i>' + errorMsg);

					$label.add($arrow).css("display", "block");
					$inputGroup.addClass('form-error');

				},
				//清除错误样式
				clearErrorStyle = function () {
					var $label = $input.next().next('label'),
						$inputGroup = $input.parent('.input-group'),
						$arrow = $input.next('div');

					$input.off('.error');
					$inputGroup.removeClass('form-error');

					$label.add($arrow).css("display", "none");
				},
				setValue = function (data) {
					$input.empty().append(!data ? '' : '<i class="' + data + '"/>');
				},
				getValue = function () {
					return $input.children('i').attr('class');
				},
				resetValue = function () {

					setValue(option.value|| '');

					clearErrorStyle();
				},
				focus = function () {
					$input.trigger('focus');
				},
				listen=function(){

					if($input.attr("disabled") === "disabled"){
						return false;
					}
						$input
						.parent()
						.off('.selectIcon')
						.on({
							'click.selectIcon':function(e){
								showModal($input,option.label);
							}
						});
				};

			//i18n
			if (auiCtx) {
				template = template
					.replace(/_label_/g, $AW.nsl(option.label, $selector.attr('id'), auiCtx) || "")
					.replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
				(option.value || option.value === 0) && (value = $AW.nsl(option.value, $selector.attr('id'), auiCtx));
			}

			if (isInline) {
				$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
					template,
					labelSpan,
					labelAlign,
					auiCtx,
					"aweb4foundationSelectIcon",
					attr);

				attr.id && $selector.attr('id', attr.id);
			} else {
				$selector.append(template);
				widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
			}

			//初始化
			init();

			//监听
			listen();

			return {
				setValue: setValue,
				getValue: getValue,
				focus: focus,
				resetValue: resetValue,

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
				error: setErrorStyle,
				clean: function () {
					clearErrorStyle();
				},
				success: function () {
					var $label = $input.next().next('label'),
						$inputGroup = $input.parent('.input-group'),
						$arrow = $input.next('div');
						
					$inputGroup.removeClass('form-error');
					$input.off('.error');

					$label.add($arrow).css("display", "none");
				},
				disabled: function (value) {
					value ? $input.prop('disabled', true) : $input.prop('disabled', false);
				},
				clear: function () {
					$input.empty();
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
		},
			showModal=function($context,title) {
				app.popover({
					$elem: $context,
					title: '配置 - ' + title,
					content: '',
					//width: '60%',
					//height: '80%',
					placement:'auto',
					init: function (popInstance) {

						var $popoverBody = $(this).find('.aweb-popover-body'),
							$search,
							$wrapper,


							iconList = [],


							filter = function () {
								var $show = $(),
									$hide = $(),
									key = $search.val().toLowerCase();

								$wrapper.each(function () {
									var $this = $(this);

									if ($this.attr('title').toLowerCase().indexOf(key) !== -1) {
										$show.push(this);
									} else {
										$hide.push(this);
									}
								});

								$show.show();
								$hide.hide();
							};


						$popoverBody
							.addClass(CONST.ICON_MODAL_CTN_CLASS)
							.append(CONST.ICON_MODAL_TEMP)
							.append(CONST.ICON_LIST_HTML)
							.on({
								'click.selectIcon': function (e) {
									var $el = $(e.target || event.srcElement),
										$iconWrapper = $el.closest('.icon-wrapper');

									if ($iconWrapper.length) {
										$context.empty().append('<i class="' + $iconWrapper.children('i').attr('class') + '"/>');
										popInstance.close();
									}
								}
							});

						$wrapper = $popoverBody.find('.icon-wrapper');
						$search = $popoverBody
							.find('.foundation-select-icon-search')
							.off('keyup.foundation-select-icon-search');

						$search.on({
							'keyup.auiConfigure': function (e) {

								//防止抖动
								app.performance.shortDelay(filter);
							}
						});

						$popoverBody
							.find('.foundation-select-icon-size-toggle')
							.on('click.auiConfigure', function (e) {
								var $el = $(e.target || event.srcElement),
									$iconList = $popoverBody.find('.foundation-select-icon-icon-list');

								$el
									.addClass('active')
									.siblings().removeClass('active');

								switch ($el.attr('data-role')) {
									case 's':
										$iconList.addClass('sm');
										$iconList.removeClass('md');
										break;
									case 'm':
										$iconList.addClass('md');
										$iconList.removeClass('sm');
										break;
									default:
										$iconList.removeClass('md').removeClass('sm');
								}
							});
					}
				});
			};

		//init
		var i, len,
			iconArr=icons && icons.iconArr||[],
			iconList=[];

		if (iconArr.length) {
			for (i = 0, len = iconArr.length; i < len; i++) {
				iconList.push({
					namespace: iconArr[i].namespace,
					iconArr: iconArr[i].code && JSON.parse(iconArr[i].code.replace(/\b(name|value)\b/g, '"$1"').replace(';', ''))
				})
			}
		}
		CONST.ICON_LIST_HTML=artTemplate.compile(CONST.ICON_LIST_TEMP)({
			iconList:iconList
		});

		//exports
		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}
		widget.component.foundationForm.foundationSelectIcon = function ($selector, option, attr, css, auiCtx) {
			return render(
				$selector,
				option,
				css,
				attr,
				auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {},
				auiCtx
			);
		};

		return widget;
	});
})();