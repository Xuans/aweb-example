/**
 * Created by quanyongxu@agree.com.cn on 2016/8/15 0015.
 */
/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

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

		var LAYOUT_CONST={
				DEFAULT_CLASS: 'aweb4_2-divCtn-default',
				HEADER_TEMPLATE: '<div data-widget-role="header">_header_</div>'
			},
			$selector,
			renderHeader=function (option, $widget, oCss,auiCtx) {
				var $header, j;

				if (option.header) {
					$widget.prepend(LAYOUT_CONST.HEADER_TEMPLATE.replace('_header_', $AW.nsl(option.header,$widget[0].id,auiCtx)));

					$header = $widget.children('[data-widget-role=header]');
					//添加样式
					$widget.closest('[data-widget-type]').addClass('header-only-ctn');

					if (option.collapse) {
						$header.css('cursor', 'pointer');
						$header.append('<i class="fa fa-angle-down pull-right">').off('click.auiRender').on('click.auiRender', function () {
							if ($header.hasClass('collapseOn')) {
								$header.removeClass('collapseOn').nextAll().slideDown(function () {
									$(this).css({
										overflow:'',
										display:''
									});
								});
								$header.children('i').removeClass('fa-angle-down ').addClass('fa-angle-up');
							} else {
								$header.addClass('collapseOn').nextAll().slideUp();
								$header.children('i').removeClass('fa-angle-up').addClass('fa-angle-down');
							}
						});
					} else {
						$header.off('click.auiRender');
					}
				} else {
					//移除样式
					$widget.closest('[data-widget-type]').removeClass('header-only-ctn');
				}

				renderDivCtnCss($widget,oCss);

			},
			renderDivCtnCss=function ($selector,css) {
				var style;
                //自定义样式
                if(css && css.cssCode && css.cssCode.className){
                    $selector.addClass(css.cssCode.className)
                }
				if(!$.isEmptyObject(css) && css.style){
					style = css.style;
                    console.log(style.content);
					style.title &&  $selector.find('[data-widget-role="header"]').first().css(style.title);
					style.content &&  $selector.closest('[data-widget-type]').css(style.content);
                    style.titleInfo && $AW.cssHover('.dc-title-infoData', $selector, style.titleInfo, '');
                    style.stateIcon && $AW.cssHover('.dc-title-icon',$selector, style.stateIcon, '');
				}

			},
			collapseHeader = function(collapse,animate,$widget){
                var $header = $widget.children('[data-widget-role=header]');
                if (collapse) {
                    if(!animate){
                        $header.removeClass('collapseOn').nextAll().slideDown(function () {
                            $(this).css({
                                overflow:'',
                                display:''
                            });
                        });
					}else{
                        $header.removeClass('collapseOn').nextAll().css({
                            overflow:'',
                            display:''
                        });
					}

                    $header.children('i').removeClass('fa-angle-down').addClass('fa-angle-up');
                } else {
                    if(!$header.hasClass('collapseOn')) {
                    	if(!animate){
                            $header.addClass('collapseOn').nextAll().slideUp();
						}else{
                            $header.addClass('collapseOn').nextAll().css({
                                overflow:'hidden',
                                display:'none'
                            });
						}
                        $header.children('i').removeClass('fa-angle-up').addClass('fa-angle-down');
                    }


                }
            },
            setHeader =function (headerText,$widget) {
				var $header;
				if(($header = $(' [data-widget-role="header"]',$widget)) && $header.length){
                    $header.html(headerText);
				}

            };

		if(!widget.ctn){
			widget.ctn={};
		}

		// widget.ctn.configHeader=configHeader;
		widget.ctn.renderHeader=renderHeader;
		widget.ctn.renderDivCtnCss=renderDivCtnCss;
        widget.ctn.collapseHeader = collapseHeader;
        widget.ctn.setHeader = setHeader;

		return widget;
	});
})();