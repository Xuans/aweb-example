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
			define(["jquery", "widget", 'component.foundationForm', 'bootstrap-wysiwyg','template'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget, _,__, artTemplate) {
		"use strict";

		//CONST
		var CONST = {
			MUST_INPUT: '<span style="color: #ff0000; padding-right:2px;">*</span>',

			HOR_TEMP: '<label title="_label_">_label__mustInput_</label>' +
			'<div class="input-group input-warp">' +
			'_content_' +
			'<div class="form-error-arrow"></div>' +
			'<label class="form-error-msg"></label>' +
			'</div>',
			INL_TEMP: '<div class="columns">' +
			'<label for="middle-label" class="text-right middle" title="_label_">_label__mustInput_</label>' +
			'</div>' +
			'<div class="columns">' +
			'<div class="input-group input-warp">' +
			'_content_' +
			'<div class="form-error-arrow"></div>' +
			'<label class="form-error-msg"></label>' +
			'</div>' +
			'</div>',

			CONTENT_TEMP: `
		                    <div class="ws-btn-toolbar no-select" data-role="editor-toolbar" data-target="[data-role=#editor]">
		                        <div class="ws-btn-group">
		                            <a class="ws-btn ws-btn-transparent dropdown-toggle" data-toggle="dropdown" title="字体" data-role="font"><i class="fa fa-font"></i><b class="caret"></b></a>
		                        </div>
		                        <div class="ws-btn-group">
		                            <a class="ws-btn ws-btn-transparent dropdown-toggle" data-toggle="dropdown" title="字体大小"><i class="fa fa-text-height"></i>&nbsp;<b class="caret"></b></a>
		                        </div>
		                        <div class="ws-btn-group">
		                            <a class="ws-btn ws-btn-transparent dropdown-toggle" data-toggle="dropdown" title="字体颜色"><i class="fa fa-tint"></i>&nbsp;<b class="caret"></b></a>
		                        </div>
		                        <div class="ws-btn-group">
		                            <a class="ws-btn ws-btn-transparent" data-edit="bold" title="加粗(Ctrl/Cmd+B)"><i class="fa fa-bold"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="italic" title="倾斜(Ctrl/Cmd+I)"><i class="fa fa-italic"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="strikethrough" title="删除线"><i class="fa fa-strikethrough"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="underline" title="下划线(Ctrl/Cmd+U)"><i class="fa fa-underline"></i></a>
		                        </div>
		                        <div class="ws-btn-group">
		                            <a class="ws-btn ws-btn-transparent" data-edit="insertunorderedlist" title="项目符号"><i class="fa fa-list-ul"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="insertorderedlist" title="编号"><i class="fa fa-list-ol"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="indent" title="增加缩进量(Tab)"><i class="fa fa-toggle-right"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="outdent" title="减少缩进量(Shift+Tab)"><i class="fa fa-toggle-left"></i></a>
		                        </div>
		                        <div class="ws-btn-group">
		                            <a class="ws-btn ws-btn-transparent" data-edit="justifyleft" title="文本左对齐(Ctrl/Cmd+L)"><i class="fa fa-align-left"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="justifycenter" title="居中(Ctrl/Cmd+E)"><i class="fa fa-align-center"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="justifyright" title="文本右对齐(Ctrl/Cmd+R)"><i class="fa fa-align-right"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="justifyfull" title="分散对齐(Ctrl/Cmd+J)"><i class="fa fa-align-justify"></i></a>
		                        </div>
		                        <div class="ws-btn-group">
		                            <a class="ws-btn ws-btn-transparent dropdown-toggle" data-toggle="dropdown" title="插入超链接"><i class="fa fa-link"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="unlink" title="移除超链接"><i class="fa fa-cut"></i></a>
		                        </div>
		
		                        <div class="ws-btn-group">
		                            <input type="file" data-role="magic-overlay" data-target="#picturews-btn" data-edit="insertImage"/>
		                            <a class="ws-btn ws-btn-transparent " title="插入或拉拽图片" id="picturews-btn"><i class="fa fa-picture-o"></i></a>
		                        </div>
		                        <div class="ws-btn-group">
		                            <a class="ws-btn ws-btn-transparent" data-edit="undo" title="撤销(Ctrl/Cmd+Z)"><i class="fa fa-undo"></i></a>
		                            <a class="ws-btn ws-btn-transparent" data-edit="redo" title="重做(Ctrl/Cmd+Y)"><i class="fa fa-repeat"></i></a>
		                        </div>
								<div class="ws-btn-group pull-right">
		                            <a class="ws-btn ws-btn-transparent" data-role="fullscreen" title="全屏"><i class="fa fa-expand"></i></a>
		                        </div>
		                    </div>
		                    <div data-role="editor"></div>
			`,
			FULLSCREEN_ROLE:'fullscreen',
			FULLSCREEN_CLASS:'ws-fullscreen',
			ACTIVE_BTN_CLASS:'ws-btn-active'
		};

		//methods
		var render = function ($selector, option, css, attr, formOption, auiCtx) {
			var mustInputTemp = CONST.MUST_INPUT,
				value,
				$input,
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? CONST.INL_TEMP : CONST.HOR_TEMP,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
				fileUploadError = function(reason, detail) {
					var msg = [reason, detail].join(' ');
					if (reason === 'unsupported-file-type') {
						msg = "不支持的格式 " + detail;
					} else if (detail === 'Internal Server Error') {
						msg = "系统内部错误 ";
					}
					app.alert(msg,app.alert.ERROR);
				},
				//初始化
				init = function () {
					var style, inputHeight,
						inputObj, beforeVal;

					$input = $selector.find('[data-role="editor"]');

					$input.wysiwyg({
						activeToolbarClass: CONST.ACTIVE_BTN_CLASS,
						toolbarSelector: $('[data-role="editor-toolbar"]',$selector),
						fileUploadError: function(){

							fileUploadError.apply(fileUploadError,arguments);
						}
					});

					//i18n
					option.disabled && $input.attr('disabled', option.disabled);

					//自定义样式
					if (css && css.cssCode && css.cssCode.className) {
						$selector.addClass(css.cssCode.className)
					}
					//设置样式
					if (css && (style = css.style)) {
						if (style.input) {
							inputObj = JSON.parse(JSON.stringify(style.input));
							$AW.cssHover('.input-group', $selector, $.extend({}, inputObj), '');

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

					$selector
						.off('.wysiwyg')
						.on({
							'click.wysiwyg':function(e){
								var $target=$(e.target||event.srcElement).closest('[data-role]');

								switch($target.attr('data-role')){
									case CONST.FULLSCREEN_ROLE:
										if($target.hasClass(CONST.ACTIVE_BTN_CLASS)){
											$target.removeClass(CONST.ACTIVE_BTN_CLASS);
											$input.parent().removeClass(CONST.FULLSCREEN_CLASS);
										}else{
											$target.addClass(CONST.ACTIVE_BTN_CLASS);
											$input.parent().addClass(CONST.FULLSCREEN_CLASS);
										}
										break;
								}
							}
						});
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

					setValue(option.value || '');

					clearErrorStyle();
				},
				focus = function () {
					$input.trigger('focus');
				};

			//i18n
			template = template
				.replace(/_label_/g, $AW.nsl(option.label, $selector.attr('id'), auiCtx) || "")
				.replace(/_mustInput_/, option.mustInput ? mustInputTemp : "")
				.replace(/_content_/, CONST.CONTENT_TEMP);


			(option.value || option.value === 0) && (value = $AW.nsl(option.value, $selector.attr('id'), auiCtx));


			if (isInline) {
				$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
					template,
					labelSpan,
					labelAlign,
					auiCtx,
					"aweb4foundationWysiwyg",
					attr);

				attr.id && $selector.attr('id', attr.id);
			} else {
				$selector.append(template);
				widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
			}

			//初始化
			init();

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
				clean: clearErrorStyle,

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
				}
			};
		};



		//exports
		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}
		widget.component.foundationForm.foundationWysiwyg = function ($selector, option, attr, css, auiCtx) {
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