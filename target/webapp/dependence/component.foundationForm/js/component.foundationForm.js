/*!
 * Javascript library v3.0
 *
 * Date: 2017.09.27
 */

/**
 * @author hefuxiang@agree.com.cn
 */
(/* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget"], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		//检查组件渲染的span值
		var checkSpan = function (cmptSpan, labelSpan, cmptAttr) {
				if (window.auiApp) {
					if (cmptSpan < labelSpan) {
						app.alert('组件[' + cmptAttr.widgetName + ']' + 'label配置的span值过大', app.alert.ERROR);
					}
				}
			},
			//设置容器的span，编辑期和运行的容器不同
			renderContainerSpan = function ($target, span) {
				var classRegExp = /medium-\d+(?:em)?/;
				var classname = $target.attr("class");

				if (classRegExp.test(classname)) {
					$target.attr("class", classname.replace(classRegExp, "medium-" + span));
				} else {
					$target.addClass("medium-" + span);
				}

				$target.addClass("columns");
			},
			//设置运行期label和元素的span
			renderRunnerInlineLabelSpan = function ($selector, template, labelSpan, labelAlign, auiCtx, dataWidgetType, cmptAttr) {
				var $form = $selector.closest("[data-widget-type=aweb4FoundationFormCtn]"),
					$row = $selector.closest("[data-widget-type=aweb4FoundationRowCtn]"),
					$ele = $selector.closest("[data-widget-type=" + dataWidgetType + "]");

				var pwdOption = auiCtx.configs[$ele.attr("id")],
					formOption = auiCtx.configs[$form.attr("id")],
					$temp = $(template);

				$ele.replaceWith($temp);
				$selector = $($temp[1]);

				//检查组件渲染的span值
				checkSpan((pwdOption.span || formOption.span), labelSpan, cmptAttr);

				renderContainerSpan($temp.eq(0), labelSpan);

				if(labelSpan && labelSpan.match && labelSpan.match(/em/)){
					calcWidth($temp.eq(1),(pwdOption.span || formOption.span));
					dyncCalcWidth($temp.eq(1),(pwdOption.span || formOption.span));
				}else{
					renderContainerSpan($temp.eq(1), (pwdOption.span || formOption.span) - labelSpan);
				}


				$($temp[0]).find("label:eq(0)").attr("class", "middle " + labelAlign + " inline-form");

				return $selector;
			},
			//设置编辑期label和元素的span
			renderEditorInlineLabelSpan = function ($selector, labelSpan, eleSpan, labelAlign) {
				renderContainerSpan($selector.find("div").eq(0), labelSpan);
				renderContainerSpan($selector.find("div").eq(1), eleSpan);

				$selector.find("label:eq(0)").attr("class", "middle " + labelAlign);

			},
			/***
			 * 计算label占整个组件的比例（总值为12）
			 * cmptSpan 包含label和input比例
			 * labelSpan    label的比例
			 */
			computeLabelscale = function (cmptSpan, labelSpan, cmptAttr) {
				//检查组件渲染的span值
				checkSpan(cmptSpan, labelSpan, cmptAttr);
				return Math.ceil(labelSpan / cmptSpan * 12);
			},
			calcWidth=function($elem,span,i){
				var $parent=$elem.parent(),
					labelWidth,elemBoxWidth,
					parentWidth;

				if($parent.length){
					labelWidth=$elem.prev().outerWidth(true);
					parentWidth=$elem.parent().innerWidth();
					elemBoxWidth=5;

					if((parentWidth*span/24)-elemBoxWidth>labelWidth) {
						parentWidth = parentWidth * span / 12;
					}

					$elem.css('width',Math.floor(parentWidth-labelWidth-elemBoxWidth));
				}else if(arguments.length===3){
					list.splice(i,1);
				}
			},
			dyncCalcWidth=function($elem,span){
				list.push({
					$elem:$elem,
					span:span
				});
			},
			resizeHandler=function() {
				var i = list.length;
				while (i--) {
					calcWidth(list[i].$elem, list[i].span,i);
				}
			},
			list=[];


		app.screen.addResizeHandler({
			uid: app.getUID(),
			isGlobal: true,
			timeout: 100,
			callback: resizeHandler
		});

		//导出到util_下
		widget.component.foundationForm = {
			utils_: {
				renderRunnerInlineLabelSpan: renderRunnerInlineLabelSpan,
				renderEditorInlineLabelSpan: renderEditorInlineLabelSpan,
				renderContainerSpan: renderContainerSpan,
				computeLabelscale: computeLabelscale
			}
		}
	});
})();