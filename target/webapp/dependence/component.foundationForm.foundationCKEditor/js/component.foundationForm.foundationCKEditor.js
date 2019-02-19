/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.04.03
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", "ckEditor", 'component.foundationForm'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget, _CKEDITOR) {
		"use strict";

		var CKEDITOR = _CKEDITOR || window.CKEDITOR;

		function render( $selector, option, attr, css,formOption, auiCtx) {
			var horizontalTemp = '<label title="_label_">_label_</label><textarea rows="10" cols="80"></textarea>',
				inlineTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' title='_label_'>_label_</label>" +
					"</div>" +
					"<div class='columns'>" +
					"<textarea rows='10' cols='80'></textarea>" +
					"</div>",
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? inlineTemp : horizontalTemp,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
				$textarea;

			$selector.attr("id", attr.id || '');

			if(auiCtx){
				template = template
				.replace(/_label_/g, $AW.nsl(option.label,attr.id,auiCtx) || "");
			}

			if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4FoundationCKEditor",
						attr);

				} else {
					$selector.append(template);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
				}

			$textarea = $selector.find('textarea');
			attr.name && $textarea.attr('name', attr.name);

			var ckEditor = CKEDITOR.replace($textarea[0]);
            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }

			// 给ckEditor添加 display show hide 方法
			return {
				setData: function () {
					ckEditor.setData.apply(ckEditor, arguments);
				},
				getData: function () {
					return ckEditor.getData.apply(ckEditor, arguments);
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
				}
			};
		}

		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}
		widget.component.foundationForm.foundationCKEditor = function ($selector, option, attr, css, auiCtx) {

			var formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				return render($selector, option, attr,css, formOption, auiCtx);
			
		};

		return widget;
	});
})();