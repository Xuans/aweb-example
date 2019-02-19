/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.04.03
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget",'component.foundationForm'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		function render($selector, option, attr,css, formOption, auiCtx) {
			//初始化
			var init = function( $progressWrapper, config){
					//填充最小值的span
					var $minValSpan = $progressWrapper.find(".data-progress-box .data-text");
					$minValSpan.text(config.minVal);

					//填充最大值的p
					var $maxValSpan = $progressWrapper.find('.data-progress-box .total-num');
					$maxValSpan.text(config.maxVal);

					progressData = {
						curVal : config.initVal,
						minVal : config.minVal,
						maxVal : config.maxVal
					};

					var progressWidth = $progressWrapper.innerWidth() - $minValSpan.outerWidth() - $maxValSpan.outerWidth() - 80;
					progressData.progressWidth = progressWidth;

					//初始化游标位置
					var initCursorPos = valToPos(progressData.curVal);
					progressData.initCursorPos = initCursorPos;

					//设置progress宽度
					$progressWrapper.find('.data-progress-box .progress').width(progressWidth);

					//设置红色部分和深蓝色部分进度条位置
					$progressWrapper.find('.progress .progress-bar-danger').width(initCursorPos);
					$progressWrapper.find('.progress .progress-bar-gray').width(initCursorPos);

					//填充初始值span
					var $initValSpan = $progressWrapper.find('.data-progress-box .progress .use.pos');
					$initValSpan.text(config.initVal);
					$initValSpan.css('left', (initCursorPos - 5) + 'px');

					//填充滑块部分
					var $silderSpan = $progressWrapper.find('.data-progress-box .progress .progress-bar .non-use.pos');
					// i18n
					if(auiCtx){
						$silderSpan.find('span:eq(0)').text($AW.nsl(config.cursorText,$selector.attr('id'),auiCtx)|| '');
						$silderSpan.find('span:eq(1)').text($AW.nsl(config.unit,$selector.attr('id'),auiCtx)|| '');
					}
					

					if(!config.cursorText){
						$silderSpan.find('input').css('margin-left', '24px');
					}

					$silderSpan.find('span:eq(1)').text(config.unit || '');
					$silderSpan.find('input').val(config.initVal);

					//设置游标位置
					updateProgress(initCursorPos);

					//注册事件
					registerEvent();
				},
				//值转进度条位置
				valToPos = function(curVal){
					//相对于最小值的偏移量
					var curValOffset = curVal - progressData.minVal;
					//进度条总差值
					var maxOffset = progressData.maxVal - progressData.minVal;

					var curPos = curValOffset / maxOffset * progressData.progressWidth;
					return curPos;
				},
				//进度条位置转值
				posToVal = function(curPos){
					//进度条总差值
					var maxValOffset = progressData.maxVal - progressData.minVal;

					var curVal = curPos / progressData.progressWidth * maxValOffset;
					//取最接近的整数
					curVal = Math.round(curVal);
					return curVal;
				},

				//设置游标位置
				setCursorPos = function(val){
					val && (val = parseFloat(val));
					var cursorPos = valToPos(val);
					updateProgress(cursorPos);
				},
				//处理越界
				handleOutOfBound = function (min, max, value) {
					return Math.max(Math.min(max, value), min);
				},
				//获取数据存储对象
				getProgressData = function(){
					return progressData;
				},
				//注册事件
				registerEvent = function(){
					//绑定拖动事件
					registerDragEvent();

					//绑定上下按钮事件
					registerUpDownKeyEvent();
					//绑定左右按钮事件
					registerLeftRightKeyEvent();
				},
				//注册拖动事件
				registerDragEvent = function(){
					var isMoving = false,
						$targetProgress;

					$progressWrapper.off('.draggableProgress').on({
						'change.draggableProgress': function (e) {
							var $e = $(e.target || window.event.srcElement), $target,
								width,
								sConf = progressData;

							if (($target = $e.closest('input')).length) {
								var pos = valToPos($target.val());
								updateProgress(pos);
							}
						},
						'mousedown.draggableProgress': function (e) {
							var $e = $(e.target || window.event.srcElement);

							if ($e.closest('.data-progress-pointer').length) {
								$targetProgress = $e.closest('.data-progress-box');
								isMoving = true;
							}else if(($e.closest('.progress-bar').length || $e.closest('.progress').length)
								&& !$e.closest('.pos').length){//点击进度条内部的元素，但不包括设置.pos样式的
								updateProgress(e.offsetX);
							}
						},
						'mouseup.draggableProgress': function (e) {
							isMoving = false;
						},
						'mousemove.draggableProgress': function (e) {
							if (isMoving) {
								$targetProgress.find('input').blur();
								updateProgress(e.pageX - $targetProgress.find('.progress-bar-info').offset().left);
							}
						},
						'mouseleave.draggableProgress': function (e) {
							isMoving = false;
						}
					});
				},
				//注册上下按键事件
				registerUpDownKeyEvent = function(){
					var isUpKeyDown = false,
						isDownKeyDown = false,
						value,
						$input = $progressWrapper.find('.data-progress-box .progress .progress-bar-info.move .txt');

					//按键按下事件
					$input.off('keydown.update.upDownKey.draggableProgress').on('keydown.update.upDownKey.draggableProgress' , function(e){
						//按下方向键“上”
						if(e.keyCode === 38){
							//第一次按下方向键“上”
							if(isUpKeyDown === false){
								value = progressData.curVal;
							}
							//增加
							value = increase(value, 1);
							$input.val(value);

							isUpKeyDown = true;
						}else if(e.keyCode === 40){
							//按下方向键“下”
							if(isDownKeyDown === false){
								value = progressData.curVal;
							}
							//减少
							value = decrease(value, 1);
							$input.val(value);

							isDownKeyDown = true;
						}
					});
					//按键松开事件
					$input.off('keyup.update.upDownKey.draggableProgress').on('keyup.update.upDownKey.draggableProgress', function(e){
						//按下方向键“上”
						if(e.keyCode === 38){
							isUpKeyDown = false;

							var pos = valToPos(value);
							updateProgress(pos);
						}else if(e.keyCode === 40){
							//按下方向键“下”
							isDownKeyDown = false;

							var pos = valToPos(value);
							updateProgress(pos);
						}
					});
				},
				//注册左右按键事件
				registerLeftRightKeyEvent = function(){
					var isLeftKeyDown = false,
						isRightKeyDown = false,
						value,
						$input = $progressWrapper.find('.data-progress-box .progress .progress-bar-info.move .txt');

					//按键按下事件
					$input.off('keydown.update.leftRightKey.draggableProgress').on('keydown.update.leftRightKey.draggableProgress' , function(e){
						//按下方向键“左”
						if(e.keyCode === 39){
							//第一次按下方向键“左”
							if(isLeftKeyDown === false){
								value = progressData.curVal;
							}
							//增加
							value = increase(value, option.step);
							$input.val(value);

							isLeftKeyDown = true;
						}else if(e.keyCode === 37){
							//按下方向键“右”
							if(isRightKeyDown === false){
								value = progressData.curVal;
							}
							//减少
							value = decrease(value, option.step);
							$input.val(value);

							isRightKeyDown = true;
						}
					});
					//按键松开事件
					$input.off('keyup.update.leftRightKey.draggableProgress').on('keyup.update.leftRightKey.draggableProgress', function(e){
						//按下方向键“左”
						if(e.keyCode === 39){
							isLeftKeyDown = false;

							var pos = valToPos(value);
							updateProgress(pos);
						}else if(e.keyCode === 37){
							//按下方向键“右”
							isRightKeyDown = false;

							var pos = valToPos(value);
							updateProgress(pos);
						}
					});
				},
				//增加
				increase = function(val, step){
					val = val + step;
					val = handleOutOfBound(progressData.minVal, progressData.maxVal, val);
					return val;
				},
				//减少
				decrease = function(val, step){
					val = val - step;
					val = handleOutOfBound(progressData.minVal, progressData.maxVal, val);
					return val;
				},
				//更新进度条
				updateProgress = function (pos) {
					var $progressCtn = $progressWrapper.find('.data-progress-box'),
						sConf = progressData,
						offsetVal;

					offsetVal = posToVal(pos);
					offsetVal = handleOutOfBound(0, sConf.maxVal - sConf.minVal, offsetVal);
					progressData.curVal = offsetVal + sConf.minVal;

					if (sConf.initCursorPos > pos) {
						progressData.reduce = handleOutOfBound(0, sConf.initCursorPos, pos);
						delete progressData.plus;
						$progressCtn.find('.progress-bar-gray').css({
							width: progressData.reduce,
							zIndex: 10
						});
						$progressCtn.find('.progress-bar-danger').css({
							zIndex: 5
						});
						$progressCtn.find('.progress-bar-info').width(progressData.reduce);
					} else {
						progressData.plus = handleOutOfBound(sConf.initCursorPos, sConf.progressWidth, pos);
						delete progressData.reduce;
						$progressCtn.find('.progress-bar-gray').css({
							width: sConf.initCursorPos,
							zIndex: 10
						});
						$progressCtn.find('.progress-bar-danger').css({
							zIndex: 0
						});
						$progressCtn.find('.progress-bar-info').css({
							width: progressData.plus
						});
					}
					$progressCtn.find('.move').find('input').val(progressData.curVal);
				},
			
				//刷新组件，针对进度条起始值、最大值和初始值需要从后台获取
				refresh = function(data){
					data.minVal && (data.minVal = parseFloat(data.minVal));
					data.maxVal && (data.maxVal = parseFloat(data.maxVal));
					data.initVal && (data.initVal = parseFloat(data.initVal));
					data.step && (data.step = parseFloat(data.step));

					data = $.extend(true, option, data);
					init($progressWrapper, data);
				};

			var progressTemplate = '<div class="data-progress-box">' +
				'<span class="data-text notSelect"></span>' +
				'<div class="progress">' +
				'<div class="slide"></div>' +
				'<div class="progress-bar progress-bar-background"></div>' +
				'<div class="progress-bar box progress-bar-gray">' +
				'</div>' +
				'<span class="use pos notSelect"></span>' +
				'<div class="progress-bar progress-bar-danger right">' +
				'</div>' +
				'<div class="progress-bar move left progress-bar-info">' +
				'<span class="non-use pos"><span class="notSelect"></span><input class="txt" type="text" pattern="\d*"/><div class="data-progress-pointer"></div><span class="notSelect"></span></span>' +
				'</div>' +
				'</div>' +
				'<span class="total-num notSelect"></span>' +
				'</div>',
				horizontalTemp = '<label class="data-progress-wrap" title="_label_">_label__content_</label>',
				inlineTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' style='margin-top: 2.9rem;' title='_label_'>_label_</label>" +
					"</div>" +
					"<div class='columns data-progress-wrap'>_content_</div>",
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
				progressData = {},
				$progressWrapper;

			if(isInline){
				inlineTemp = inlineTemp.replace(/_content_/, progressTemplate);
				template = inlineTemp;
			}else{
				horizontalTemp = horizontalTemp.replace(/_content_/, progressTemplate);
				template = horizontalTemp;
			}

			$selector.attr("id", attr.id || '');
			// i18n
			if(auiCtx){
				template = template.replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx)|| "");
			}



				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4FoundationEditableSilder",
						attr);

					attr.id && $selector.attr('id', attr.id);

					$progressWrapper = $selector.closest('.data-progress-wrap');
				} else {
					$selector.append(template);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);

					$progressWrapper = $selector.find('.data-progress-wrap');
				}

				//初始化
				init($progressWrapper, option);

            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }

			return {
				getValue : function(){
					var progressData = getProgressData();
					return progressData.curVal;
				},
				//设置游标位置
				setValue : setCursorPos,
		
				//刷新组件
				refresh : refresh,

				// 一个行为类型方法的 实现
				display: function(result, input1, input2, condition) {

					if (result) {
						$selector.css('display', 'none');
						if(isInline){
							$selector.prev(".columns").hide();
						}
					} else {
						$selector.css('display', 'block');
						if(isInline){
							$selector.prev(".columns").show();
						}
					}
				},

				show: function(e, size) {

					$selector.css('display', 'block');
					if(isInline){
						$selector.prev(".columns").show();
					}
				},
				resetValue:function () {
                    var cursorPos = valToPos(0);
                    updateProgress(cursorPos);
                },

				hide: function() {

					$selector.css('display', 'none');
					if(isInline){
						$selector.prev(".columns").hide();
					}

				},
				focus:function(){
					var $input = $selector.find('.data-progress-box').find('input.txt'),
                        value = $input.val(),
                        len = value&&value.length,
                        input;

                    if($input.length&&len){
                         input = $input[0];
                         if (input.createTextRange) {

                              var range = input.createTextRange();
                                  range.collapse(true);
                                  range.moveEnd('character', len);
                                  range.moveStart('character', len);
                                  range.select();

                         } else if (input.setSelectionRange) {
                              input.focus();
                              input.setSelectionRange(len, len);
                         }

                    }else{
                        $input.trigger('focus');
                    }
				},

                disabled:function (value) {
					var $input = $selector.find('.data-progress-box').find('input.txt'),
                        $progressWrapper = $selector.find('.data-progress-wrap');

					if(value){
                        $progressWrapper.off('.draggableProgress');
						$input.prop('disabled',true);
					}else{
						$input.prop('disabled',false);
						registerEvent();
					}
                }
			}
		}

		if (!widget.component.foundationForm) {
			widget.component.foundationForm = {};
		}
		widget.component.foundationForm.foundationEditableSilder = function ($selector, option, attr, css, auiCtx) {

			var formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				/*编译阶段渲染代码*/
				return render( $selector, option, attr, css,formOption, auiCtx);
			};


		return widget;
	});
})();