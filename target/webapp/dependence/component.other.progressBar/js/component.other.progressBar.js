/**
 * @author hefuxiang@agree.com.cn
 *  Date: 2017.03.02
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", 'progressbar'], factory);
		}
		// global
		else {
			factory();
		}

	})
		(function ($, widget) {
			"use strict";

			var classRegExp = /medium-\d+/;

			function render($selector, option, attr,css, formOption, auiCtx) {

				var verticalTemplate = '<label>_label_<div class="progressbarContainer"></div></label>',
					inlineTemplate = "<div class='columns'>" +
						"<label for='middle-label' class='text-right middle'>_label_</label>" +
						"</div>" +
						"<div class='columns'>" +
						"<div class='progressbarContainer'>" +
						"</div>",
					isInline = formOption.formLayout === 'inline',
					labelAlign = option.labelAlign || formOption.labelAlign,
					template = isInline ? inlineTemplate : verticalTemplate,
					span = option.span || formOption.span,
					labelSpan = option.labelSpan || formOption.labelSpan,
					container,
					bar,
                    initLineBar = function () {
                        var $container = $('.progressbarContainer', $selector),
                            config;

                        $container.addClass('line');

                        // $selector.css('height', option.ctnHeight);

                        config = $.extend(true, option, {
                            step: function (state, bar) {
                                if (option.fixedText) {
                                    bar.setText(option.text_);
                                } else {
                                    bar.setText(Math.round(bar.value() * 100) + ' %');
                                }
                            }
                        });

                        var bar = new ProgressBar.Line($container[0], config);
                        bar.animate(0);
                        return bar;
                    },
                    //初始化圆形bar
                    initCircleBar = function () {
                        var $container = $('.progressbarContainer', $selector),
                            config;
                        $container.addClass('circle');

                        $container.css('height', option.ctnHeight);
                        $container.css('width', option.ctnHeight);

                        config = $.extend(true, option, {
                            step: function (state, circle) {
                                if (option.fixedText) {
                                    circle.setText(option.text_);
                                } else {
                                    circle.path.setAttribute('stroke', state.color);

                                    var value = Math.round(circle.value() * 100);
                                    if (value === 0) {
                                        circle.setText('');
                                    } else {
                                        circle.setText(value);
                                    }
                                }
                            }
                        });

                        //设置进度条位置
                        setPosition($container, option.barLocation);

                        var bar = new ProgressBar.Circle($container[0], config);

                        bar.animate(0);
                        return bar;
                    },
                    //初始化半圆进度条
                    initSemiCircleProgressBar = function () {
                        var $container = $('.progressbarContainer', $selector),
                            config;
                        $container.addClass('semiCircle');

                        $container.css('height', option.ctnHeight);
                        $container.css('width', option.ctnHeight);

                        //设置进度条位置
                        setPosition($container, option.barLocation);

                        config = $.extend(true, option, {
                            step: function (state, bar) {
                                if (option.fixedText) {
                                    bar.setText(option.text_);
                                } else {
                                    bar.path.setAttribute('stroke', state.color);
                                    var value = Math.round(bar.value() * 100);
                                    if (value === 0) {
                                        bar.setText('');
                                    } else {
                                        bar.setText(value);
                                    }
                                    bar.text.style.color = state.color;
                                }
                            }
                        });

                        var bar = new ProgressBar.SemiCircle($container[0], config);

                        bar.animate(0);
                        return bar;
                    },
                    //初始化形状
                    initShape = function (shape) {
                        var bar;
                        if (shape == 'line') {
                            bar = initLineBar();
                        } else if (shape == 'circle') {
                            bar = initCircleBar();
                        } else if (shape == 'semiCircle') {
                            bar = initSemiCircleProgressBar();
                        }
                        return bar;
                    },
                    //设置位置
                    setPosition = function ($container, barLocation) {
                        if (barLocation == 'left') {
                            $container.css('margin-left', 0).css('margin-right', 'auto');
                        } else if (barLocation == 'center') {
                            $container.css('margin-left', 'auto').css('margin-right', 'auto');
                        } else if (barLocation == 'right') {
                            $container.css('margin-left', 'auto').css('margin-right', 0);
                        }
                    },
                    //刷新
                    refresh = function (data) {
                        bar.animate(data);
                    };

				$selector.attr("id", attr.id || '');
				template = template.replace(/_label_/, option.label || '');

				if (isInline) {
					$selector = renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4ProgressBar");
				} else {
					$selector.append(template);
					renderContainerSpan($selector, span);
				}

				bar = initShape(option.shape_);
				refresh(1.0);


				return $.extend({
					'refresh': refresh,
					//只有固定文本的时候才有效
					'setText': function (text) {
						if (option.fixedText) {
							option.text_ = text;
							bar.setText(option.text_);
						}
					},
					'bar': bar,
					display: function (result, input1, input2, condition) {
						this[result ? 'hide' : 'show']();
					},
					show: function () {
						$selector.removeClass('hide');
					},
					hide: function () {
						$selector.addClass('hide');
					}
				});
			}

			//设置运行期label和元素的span
			function renderRunnerInlineLabelSpan($selector, template, labelSpan, labelAlign, auiCtx, dataWidgetType) {
				var $form = $selector.closest("[data-widget-type=aweb4FoundationFormCtn]"),
					$row = $selector.closest("[data-widget-type=aweb4FoundationRowCtn]"),
					$ele = $selector.closest("[data-widget-type=" + dataWidgetType + "]");

				var pwdOption = auiCtx.configs[$ele.attr("id")],
					formOption = auiCtx.configs[$form.attr("id")],
					$temp = $(template);

				//$row.append($temp);
				// $ele.remove();
				$ele.replaceWith($temp);
				$selector = $($temp[1]);

				renderContainerSpan($temp.eq(0), labelSpan);
				renderContainerSpan($temp.eq(1), (pwdOption.span || formOption.span) - labelSpan);

				$($temp[0]).find("label:eq(0)").attr("class", "middle " + labelAlign);

				return $selector;
			}

			//设置编辑期label和元素的span
			function renderEditorInlineLabelSpan($selector, labelSpan, eleSpan, labelAlign) {
				renderContainerSpan($selector.find("div").eq(0), labelSpan);
				renderContainerSpan($selector.find("div").eq(1), eleSpan);

				$selector.find("label").attr("class", "middle " + labelAlign)
			}

			//设置容器的span，编辑期和运行的容器不同
			function renderContainerSpan($target, span) {
				var classname = $target.attr("class");

				if (classRegExp.test(classname)) {
					$target.attr("class", classname.replace(classRegExp, "medium-" + span));
				} else {
					$target.addClass("medium-" + span);
				}

				$target.addClass("columns");
			}

			if (!widget.component.other) {
				widget.component.other = {};
			}
			widget.component.other.progressBar = function ($selector, oOption, oAttr, oCss, auiCtx) {
				var
				    formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				return render($selector, oOption, oAttr,oCss, formOption, auiCtx);
			};


			return widget;
		});
})();