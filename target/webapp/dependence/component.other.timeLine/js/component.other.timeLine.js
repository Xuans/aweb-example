/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.04.03
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

		var classRegExp = /medium-\d+/;

		function render( $selector, option, attr, css,formOption, auiCtx) {
			//初始化

			var template = "<div class='timeLine-ctn'><div class='timeLine-top'></div><div class='timeLine-bottom'></div></div>",
				stateTemp = '<div class="timeLine-state clearfix"></div>',
				detailsTemp = '<div class="timeLine-details clearfix"></div>',
				$topCtn,
				$bottomCtn,
				testData = [
					{
						'state': 'success',
						'stateInfo': '成功',
						'detail': {
							'scene1': '场景',
							'time1': '2016-08-13 14:37:14',
							'timeConsuming1': '4322463'
						}
					},
					{
						'state': 'unknown',
						'stateInfo': '未知',
						'detail': {
							'scene2': '场景',
							'time2': '2016-08-13 14:37:14',
							'timeConsuming2': '4322463'
						}
					}, {
						'state': 'success',
						'stateInfo': '成功',
						'detail': {
							'scene3': '场景',
							'time3': '2016-08-13 14:37:14',
							'timeConsuming3': '4322463'}
					}, {
						'state': 'unknown',
						'stateInfo': '未知',
						'detail': {
							'scene4': '场景',
							'time4': '2016-08-13 14:37:14',
							'timeConsuming4': '4322463'
						}
					}, {
						'state': 'success',
						'stateInfo': '成功',
						'detail': {
							'scene5': '场景',
							'time5': '2016-08-13 14:37:14',
							'timeConsuming5': '4322463'
						}
					}, {
						'state': 'success',
						'stateInfo': '成功',
						'detail': {
							'scene6': '场景',
							'time6': '2016-08-13 14:37:14',
							'timeConsuming6': '4322463'
						}
					},
				],
                cssCode,className,
                initTimeLineCtn = function (data) {
                    var $state,
                        $span,
                        $details,
                        stateClass,prop,$p,$div,detail,stateInfo,
                        colorClass,i,obj;

                    $topCtn.empty();
                    $bottomCtn.empty();

                    for ( i = -1; obj = data[++i];) {
                            detail = obj.detail;
                            stateInfo = obj.stateInfo;

                        if (i % 2 === 0) {
                            if (obj.state === 'success') {
                                stateClass = 'timeLine-success';
                                colorClass = 'timeLine-blueTop';
                            } else {
                                stateClass = 'timeLine-unknown';
                                colorClass = 'timeLine-orangeTop';
                            }
                            //创建状态div
                            $state = $(stateTemp);
                            $state.append('<span>' + stateInfo + '</span>');
                            $state.addClass(stateClass);

                            //创建细节信息div
                            $details = $(detailsTemp);
                            $details.addClass('timeLine-details ' + colorClass);
                            for ( prop in detail) {
                                if(detail.hasOwnProperty(prop)){
                                     $p = $('<p>' + prop + ' : ' + detail[prop] + '</p>');
                                    $details.append($p);
                                }

                            }

                             $div = $('<div></div>');
                            $div.append($state).append($details);
                            $topCtn.append($div);
                        } else {
                            if (obj.state === 'success') {
                                stateClass = 'timeLine-success';
                                colorClass = 'timeLine-blueBottom';
                            } else {
                                stateClass = 'timeLine-unknown';
                                colorClass = 'timeLine-orangeBottom';
                            }

                            //创建状态div
                            $state = $(stateTemp);
                            $state.append('<span>' + stateInfo + '</span>');
                            $state.addClass(stateClass);

                            //创建细节信息div
                            $details = $(detailsTemp);
                            $details.addClass(colorClass);
                            for ( prop in detail) {
                                if(detail.hasOwnProperty(prop)){
                                     $p = $('<p>' + prop + ' : ' + detail[prop] + '</p>');
                                    $details.append($p);
                                }

                            }

                             $div = $('<div></div>');
                            $div.append($details).append($state);
                            $bottomCtn.append($div);
                        }
                    }

                    $topCtn.width($('.timeLine-top>div', $selector).length * 450 + 'px');
                    $bottomCtn.width($('.timeLine-bottom>div', $selector).length * 450 + 'px');

                };

			$selector.attr("id", attr.id || '');

			$selector.append(template);

			$topCtn = $('.timeLine-top', $selector);
			$bottomCtn = $('.timeLine-bottom', $selector);

			initTimeLineCtn(testData);
            if (css) {
                if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                    $widget.addClass(className)
                }
            }
			return {
				'refresh': initTimeLineCtn,
				display: function (result, input1, input2, condition) {
					this[result ? 'hide' : 'show']();
				},
				show: function () {
					$selector.removeClass('hide');
				},
				hide: function () {
					$selector.addClass('hide');
				}
			}
		}

		if (!widget.component.other) {
			widget.component.other = {};
		}
		widget.component.other.timeLine = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var

				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};


				return render( $selector, oOption, oAttr, oCss,formOption, auiCtx);
			};


		return widget;
	});
})();