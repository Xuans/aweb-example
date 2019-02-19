(function (undefined) {

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

			function render($selector, option, attr, css, formOption, auiCtx) {
				//组件模板
				var horizontalTemp = '<label title="_label_">_label_</label><div class="img-content" data-role="imgContent"><img src="_src_" alt="_alt_">_BLABEL_</div>',
					inlineTemp = "<div class='columns'>" +
						"<label for='middle-label' class='text-right middle' title='_label_'>_label_</label>" +
						"</div>" +
						"<div class='columns'>" +
						"<div class='img-content'  data-role='imgContent'><img src='_src_' alt='_alt_'/>_BLABEL_</div>" +
						"</div>",
					$img,
					$bottomLabel,
					$imgContent,
					style,
					isInline = formOption.formLayout === 'inline',
					labelAlign = option.labelAlign || formOption.labelAlign,
					template = isInline ? inlineTemp : horizontalTemp,
					span = option.span || formOption.span,
					labelSpan = option.labelSpan || formOption.labelSpan,
					timeStamp = app.getUID();
				//i18n
				if (auiCtx) {
					template = template
						.replace(/_src_/, option.src + '?version=' + timeStamp || "")
						.replace(/_label_/g, $AW.nsl(option.label, $selector.attr('id'), auiCtx) || "")
						.replace(/_alt_/, $AW.nsl(option.alt, $selector.attr('id'), auiCtx) || "");
				}

				if (option.showLabel) {
					//i18n
					if (auiCtx) {
						template = template.replace(/_BLABEL_/, '<span class="img-bottom-label">' + $AW.nsl(option.bottomLabel, $selector.attr('id'), auiCtx) + '</span>');
					}

				} else {
					template = template.replace(/_BLABEL_/, '');
				}



				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4FoundationImg",
						attr);
					attr.id && $selector.attr('id', attr.id);
				} else {
					$selector.append(template);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
				}


				$img = $selector.find("img");
				$imgContent = $selector.find(".img-content");
				$bottomLabel = $img.next('.img-bottom-label');


				//自定义样式
				if (css && css.cssCode && css.cssCode.className) {
					$img.addClass(css.cssCode.className)
				}

				//设置样式
				if (css && (style = css.style)) {
					style.img && $imgContent.css(style.img);
					style.bottomLabel && $bottomLabel.css(style.bottomLabel)
				}

				/*  if($bottomLabel.length){
					  $bottomLabel.css('width',$img.css('width'));
				  }*/

				return {
					/**
					 * 获取图片路径
					 */
					getter: function () {
						return $img && $img.attr("src") ? $img.attr("src") : undefined;
					},
					/**
					 * 设置图片路径
					 */
					setter: function (value) {
						if(value.indexOf('data:image')===0||value.indexOf('?') !== -1 ) {
							$img && $img.attr("src", value);
						} else {
							$img && $img.attr("src", value + '?version=' + timeStamp)
						}
					},
					resetValue: function () {
						$img && $img.attr("src", '');
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
					}
				}

			}

			if (!widget.component.foundationForm) {
				widget.component.foundationForm = {};
			}

			widget.component.foundationForm.foundationImg = function ($selector,option,attr,css,auiCtx) {
				var formOption,
					imgReturn;

				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};
				//运行时代码Start
				imgReturn = render($selector, option, attr, css, formOption, auiCtx);
				//运行时代码End

				return {

					getter: imgReturn.getter,

					setter: imgReturn.setter,
				
					setSrc: imgReturn.setter,

					validateHandler: function (value) {
						return {
							result: true, //校验结果
							value: value, //传输的格式
							errorMsg: '' //校验失败的结果
						}
					},

					// 一个行为类型方法的 实现
					display: imgReturn.display,

					show: imgReturn.show,

					hide: imgReturn.hide,
					resetValue: imgReturn.resetValue
				}

			};
		});
})();