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
			define(["jquery", "widget", 'ctn'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		widget.ctn.foundationFormCtn =function (obj, oOption, attr, oCss,auiCtx) {
			var Ctn = $AW.ctn,
				 $widget, option, css;

				$widget = obj;
				option = oOption;
				Ctn.renderHeader(oOption, obj, oCss,auiCtx);

			$widget
				.off('.aweb4_2')
				.on('submit.aweb4_2', function () {
					return false;
				});
            $widget
                .off('.enterToNext')
                .on('keyup.enterToNext', function (e) {
                    var keycode = e.which || window.event.keyCode,
                        $target, $input,$nextInput,$nextNextInput,
                        index;

                    // 判断所按是否回车键
                    if (keycode === 13 && ($target = $(e.target || window.event.srcElement)).is(':input')) {
                        $input = $(this).find(':input:not(button,:disabled)');

                        index = $input.index($target);
                            // 设置焦点
						$nextInput = $input.eq(index + 1);
						$nextNextInput = $input.eq(index + 2);


						if($nextInput.attr('class') && $nextInput.attr('class').indexOf('combotree')>=0){

                            // $nextInput.combotree('showPanel');
                            $($nextNextInput)[0].focus();
                            // $nextInput.next('[data-span-id]').trigger('click');

						}else if($nextInput.attr('class') && $nextInput.attr('class').indexOf('datepicker')>=0){

                                $($nextInput)[0].focus();

						}else if($nextInput.is('select')){

                            $nextInput.trigger('chosen:open').trigger('chosen:activate');

						}else if($nextInput.attr('class') && $nextInput.attr('class').indexOf('textbox')>=0){

                            $input.eq(index + 2).focus();
						}else{
                            $nextInput.focus();
						}

                    }

                    return false;// 取消默认的提交行为
                });

			return {
				display: function (result, input1, input2, condition) {
					this[result ? 'hide' : 'show']();
				},
				show: function () {
					$widget.removeClass('hide');

					$(window).trigger('resize');
				},
				hide: function () {
					$widget.addClass('hide');
				},
				collapseHeader: function (collapse,animate) {
					Ctn.collapseHeader(collapse,animate, $widget);
				},
                setHeader:function (headerText) {
				    if(option.header){
                        Ctn.setHeader(headerText,obj);
                    }else{
				        oOption.header = headerText;
                        Ctn.renderHeader(oOption, obj, oCss,auiCtx);
                    }

               },
				/*
				*   desp:   当键入enter的时候，自动切换到下一元素
				*   option:{
				*       callback    @handler    等到去到表单最后一个的时候，执行的回调函数
				*   }
				* */
				enterToNext: function (callback) {

					$widget
						.off('.enterToNext')
						.on('keyup.enterToNext', function (e) {
							var keycode = e.which || window.event.keyCode,
								$target, $input,$nextInput,$nextNextInput,
								index;

							// 判断所按是否回车键
							if (keycode === 13 && ($target = $(e.target || window.event.srcElement)).is(':input')) {
								$input = $(this).find(':input:not(button,:disabled)');
								index = $input.index($target);

								if (index === $input.length - 1) {
									$target.blur();
									callback && callback();
								} else {
									// 设置焦点
                                    $nextInput = $input.eq(index + 1);
                                    $nextNextInput = $input.eq(index + 2);

                                    if($nextInput.attr('class') && $nextInput.attr('class').indexOf('combotree')>=0){

                                        // $nextInput.combotree('showPanel');
                                        $($nextNextInput)[0].focus();
                                        // $nextInput.next('[data-span-id]').trigger('click');


                                    }else if($nextInput.attr('class') && $nextInput.attr('class').indexOf('datepicker')>=0){

                                        $($nextInput)[0].focus();

                                    }else if($nextInput.is('select')){

                                        $nextInput.trigger('chosen:open').trigger('chosen:activate');

                                    }else if($nextInput.attr('class') && $nextInput.attr('class').indexOf('textbox')>=0){

                                        $input.eq(index + 2).focus();
                                    }else{
                                        $nextInput.focus();
                                    }
								}
							}

							return false;// 取消默认的提交行为
						});
				}
			}
		};

		return widget;
	});
})();