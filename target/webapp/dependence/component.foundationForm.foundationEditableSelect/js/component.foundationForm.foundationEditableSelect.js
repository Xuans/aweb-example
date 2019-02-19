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

			function render($selector, attr, formoption, option, css, auiCtx) {
				var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
					horizontalTemp =
						'<label title="_label_">_label__mustInput_</label>' +
						'<div class="input-group input-warp">' +
						'<select id="selector" class="input-group-field edit-select"></select>' +
						'<div class="form-error-arrow"></div>' +
						'<label class="form-error-msg"></label>' +
						'</div>',
					inlineTemp =
						'<div class="columns">' +
						'<label for="middle-label" class="text-right middle" title="_label_">_label__mustInput_</label>' +
						'</div>' +
						'<div class="columns">' +
						'<div class="input-group input-warp">' +
						'<select id="selector" class="input-group-field edit-select"></select>' +
						'<div class="form-error-arrow"></div>' +
						'<label class="form-error-msg"></label>' +
						'</div>' +
						'</div>',
					layout = formoption.formLayout,//布局
					labelAlign = option.labelAlign || formoption.labelAlign,//标题的对齐方式
					span = option.span || formoption.span,//组件的跨度
					isInline = layout === 'inline',
					labelSpan = option.labelSpan || formoption.labelSpan,//标题的跨度
					baseHTML = isInline ? inlineTemp : horizontalTemp, $select,
					editableSelect, $input,$par,$body,$s;
				//i18n
				if (auiCtx) {
					baseHTML = baseHTML
						.replace(/_label_/g, $AW.nsl(option.label, attr.id, auiCtx) || "")
						.replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
				}
					if (isInline) {
						$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
							baseHTML,
							labelSpan,
							labelAlign,
							auiCtx,
							"aweb4FoundationEditableSelect",
							attr);

						attr.id && $selector.attr('id', attr.id);
						$selector.addClass('foundationEditableSelect');
					} else {
						$selector.append(baseHTML);
						widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
					}
                $body = $('body');
				$AW.cssHover('.foundationEditableSelect li ',$body,{
					color:'#444',
					display: 'list-item',
					cursor: 'pointer',
					margin: '3px',
					padding: '5px 6px',
					'list-style': 'none',
					'line-height':'15px',
					'word-wrap':' break-word'},'');
				$AW.cssHover('.foundationEditableSelect li',$body,{'background-color': 'rgba(4,190,189,0.1)','color':'#444'},':hover');
				if (option.option) {
					 $s = $selector.find('select');
					$.each(option.option, function (i, o) {
						if (auiCtx) {
							$s.append('<option value="' + $AW.nsl(o.value, attr.id, auiCtx) + '">' + $AW.nsl(o.name, attr.id, auiCtx) + '</option>');
						} else {
							$s.append('<option value="' + ($AW_widget && $AW_widget.nsl(o.value)) + '">' + ($AW_widget && $AW_widget.nsl(o.name)) + '</option>');
						}
					})
				}
				$select = $selector.find('select').css('height', '32px');
				$select.attr('id', attr.id);
				editableSelect = $select.editableSelect();
				$selector.find('input').addClass('editableselect-input');
				$input = $selector.find('input');
				$par = $input.parent();

				$par.add($input).css({
					width: '100%'
				});

				// 一个行为类型方法的 实现
				editableSelect.display = function (result, input1, input2, condition) {
					this[result ? 'hide' : 'show']();
				};

				editableSelect.show = function () {
					$selector.removeClass('hide');
					isInline && $selector.prev(".columns").removeClass('hide');
				};

				editableSelect.hide = function () {
					$selector.addClass('hide');
					isInline && $selector.prev(".columns").addClass('hide');
				};

				editableSelect.disabled = function (value) {
					value ? $input.prop('disabled', true) : $input.prop('disabled', false);
				};


				return editableSelect;
			}

			if (!widget.component.foundationForm) {
				widget.component.foundationForm = {};
			}

			widget.component.foundationForm.foundationEditableSelect = function ($selector,option,attr,css,auiCtx) {
				var 
					formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {},
					editableSelect,
					$input;
				
				editableSelect = render($selector, attr, formOption, option, css, auiCtx);
				$input = $selector.find('input');

				//自定义样式
				if (css && css.cssCode && css.cssCode.className) {
					$selector.addClass(css.cssCode.className)
				}
				return {

					getter: function () {
						return $input.attr('data-value');
					},

					setter: function (value) {
						//set value
						if ($.isEmptyObject(value)) {
							return;
						}
						$.each(value, function (i, e) {
							editableSelect.addOption(e.value, e.text);
						})
					},
					setValue: function (data) {
						$input.val(data.text);
						$input.attr('data-value', data.value);
					},
					resetValue: function () {
						$input.val('');
						$input.attr('data-value', '');
					},

					success: function ($obj) {

						var $label = $selector.find('.form-error-msg'),
							$arrow = $selector.find('.form-error-arrow'),
							$inputGroup = $input.parent('.input-group');
						$obj && ($input = $obj);
						$inputGroup.removeClass('form-error');
						$input.off('.error');
						$label.css("display", "none");
						$arrow.css("display", "none");
					},

					error: function ($obj, errorMsg) {
						var $label = $selector.find('.form-error-msg'),
							$arrow = $selector.find('.form-error-arrow'),
							$inputGroup = $input.parent('.input-group');

						$obj && ($input = $obj);

						$label.empty().append('<i class="fa fa-exclamation-circle"></i>' + errorMsg);
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

					clean: function (e) {
						var $label = $selector.find('.form-error-msg'),
						 $arrow = $selector.find('.form-error-arrow');

						$label.add($arrow).css("display", "none");
						$selector.find('input').removeClass('form-error');
					},

					validateHandler: function (value) {
						return {
							result: true,        //校验结果
							value: value,        //传输的格式
							errorMsg: ''         //校验失败的结果
						}
					},

					display: function () { editableSelect.display },
					show: function () { editableSelect.show },
					hide: function () { editableSelect.hide },
					disabled: function (value) { editableSelect.disabled(value) },
                    mustInput: function (booleans) {
                        var $label = $('[title="'+option.label+'"]',$selector),
                        	mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>';

                        $label.empty();
                        if(booleans === true){
                            $label.html(mustInputTemp+option.label)
                        }else{
                            $label.html(option.label)
                        }
                    }
				}
			}

		});
})();