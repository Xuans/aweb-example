
( /* <global> */ function (undefined) {

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

        var Component=function($selector,option,attr,css,auiCtx){

            this.option=option;
            this.attr=attr;
            this.css=css;
            this.pageContext=auiCtx;

	        this.selectorID =$selector[0].id;
            this.currentStep=0;
            this.stepLength=1;
            this.hideStep = [];
            this.showStep = [];

            this.viewCache={};


	        this.$selector=$selector;
	        this.$stepChart=$selector.children('.step-chart');
	        this.$stepChartCtn =  this.$stepChart.children('.step-chart-ctn');

	        this.$stepChartCtn[option.layout ? "addClass" : "removeClass"]("step-inline");

	        this.renderStepCtn(option.stepNum || [], null, this.selectorID, auiCtx);
            this.renderStyle();
	        this.listen();
        };

        Component.prototype={
            constructor:Component,

            version:'AWOS 5.1 20180427',

            constant:{
                STEP:{
                    START:0,
                    BACK:1,
                    NEXT:2,
                    FINISH:3
                }
            },

            //init
	        renderTemp : function (index, stepData, type, $ctn, hidden, isFinal,steplength, widgetID, auiCtx) {
		        var ret,
			        numRegistry = {
				        0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
				        1: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
				        2: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
				        3: ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'J', 'K', 'L']
			        },
			        stepTemp1 = '<div class="step-chart-ctt _HIDDEN_" data-step="_STEP_"><div class="step-num"><span>_NUM_</span>_TIP_</div><div class="step-desp"><span>_DESP_</span></div></div>',
			        stepTemp2 = '<div class="step-line"><div class="step-line-progress"></div></div>',
			        stepTipTemp = '<div class="step-tip">_TIPTEXT_</div>',

			        replaceTip = function (temp) {

				        if (stepData.stepTip) {
					        //i18n
					        auiCtx && (temp = temp.replace('_TIP_', stepTipTemp).replace('_TIPTEXT_', $AW.nsl(stepData.stepTip, widgetID, auiCtx)));


				        } else {
					        temp = temp.replace('_TIP_', '');
				        }
				        return temp;
			        };
		        //i18n
		        if (auiCtx) {
			        $ctn.append(replaceTip(stepTemp1.replace('_STEP_', index).replace('_HIDDEN_', hidden ? "hide" : "").replace('_DESP_', $AW.nsl(stepData.name, widgetID, auiCtx) || $AW.nsl('步骤', widgetID, auiCtx) + $AW.nsl(numRegistry[type][index], widgetID, auiCtx)).replace('_NUM_', $AW.nsl(numRegistry[type][index], widgetID, auiCtx))));
		        }

		        if(!hidden && isFinal){

		            if(isFinal.hidden && isFinal.hidden === true && index ===steplength-2){

                    }else{
                        $ctn.append(stepTemp2);
                    }
                }

	        },
	        renderStepCtn : function (stepNum, widgetID, auiCtx) {
		        var option = this.option,
			        step = 0,
			        stepLen = stepNum.length,
			        item,i,

			        $selector = this.$selector,
			        $stepChartCtn = this.$stepChartCtn,
			        $divCtn,
			        $steps,
			        $btns, $firstBtn, $finalBtn, $pBtn, $nBtn,
			        $line,currentDiv;



		        //render html
		        $stepChartCtn.empty();
                this.showStep = [];
		        for (i = -1; item = stepNum[++i];) {
                    !item.hidden && this.showStep.push(i);
			        this.renderTemp(item.hidden ? step : step++, item, option.stepType || 0, $stepChartCtn, item.hidden, stepNum[i + 1],stepLen, widgetID, auiCtx);
		        }

		        !this.$selector.children(".step-btn-ctn").length && this.$selector.append('<div class="step-btn-ctn"><button class="step-btn-first step-btn btn btn-inverse btn-lg" data-role="stepBtnStart"></button><button class="step-btn-p step-btn pull-left btn btn-normal btn-lg" data-role="stepBtnP">上一步</button><button class="step-btn-n step-btn btn btn-inverse pull-right" data-role="stepBtnN">下一步</button><button class="step-btn-final step-btn pull-right btn btn-inverse btn-lg" data-role="stepBtnFinish"></button></div>')
			        .children(".step-btn-ctn").find('.btn:not(.step-btn-first)').hide();

		        $divCtn = $selector.children(":not(:first,.step-btn-ctn)").hide();



                currentDiv =  Math.min.apply(null, this.showStep);


		        $divCtn.eq(currentDiv).show(0);
		        $steps = $stepChartCtn.find('.step-num');
		        $line = $stepChartCtn.find('.step-line-progress');
		        $btns = $selector.children('.step-btn-ctn').find('.btn');

		        //i18n
		        if (auiCtx) {
			        $firstBtn = $btns.first().text($AW.nsl(option.stepFirstBtnText||'开始', widgetID, auiCtx)).prop('disabled', stepNum[0] && stepNum[0].stepValidate ? 'disabled' : '');
			        $finalBtn = $btns.last().text($AW.nsl(option.stepFinalBtnText || '完成', widgetID, auiCtx));
			        $pBtn = $btns.eq(1).text($AW.nsl(option.stepPrevBtnText|| '上一步', widgetID, auiCtx));
			        $nBtn = $btns.eq(2).text($AW.nsl(option.stepNextBtnText|| '下一步', widgetID, auiCtx));

		        }
		        $steps.eq(this.currentStep).addClass('step-num-active');
		        $line.eq(this.currentStep).width('50%');

		        this.$firstBtn = $firstBtn;
		        this.$finalBtn = $finalBtn;
		        this.$pBtn = $pBtn;
		        this.$nBtn = $nBtn;
		        this.$btns=$btns;
		        this.$steps = $steps;
		        this.$line = $line;
		        this.$divCtn=$divCtn;

		        this.stepLength = step;
	        },
            //renderStyle
			renderStyle:function () {
				var css = this.css,
					$selector = this.$selector,
					$chartctn = this.$stepChartCtn,
					style,$stepNodeCtn  = $chartctn.children('.step-chart-ctt');

				if(css && (style = css.style)){
				    style.stepNodeCtn && $('.step-chart',$selector).css(style.stepNodeCtn);
					style.stepNode && $('.step-num',$stepNodeCtn).css(style.stepNode);
					style.stepNodeActive && $('.step-num.step-num-active',$stepNodeCtn).css(style.stepNodeActive);
                    style.stepFocusBtn && $('.step-btn-ctn .btn.btn-inverse',$selector).css(style.stepFocusBtn);
                    style.stepFocusBtnHover && $AW.cssHover('.step-btn-ctn .btn.btn-inverse',$selector,style.stepFocusBtnHover,':hover');
                    style.stepFocusBtnActive && $AW.cssHover('.step-btn-ctn .btn.btn-inverse',$selector,style.stepFocusBtnActive,':active');
                    style.stepLine && $('.step-line',$chartctn).css(style.stepLine);
                    style.stepLineActive && $('.step-line .step-line-progress',$chartctn).css(style.stepLineActive);
                    style.stepDesp && $AW.cssHover('.step-chart>.step-chart-ctn>.step-chart-ctt>.step-desp span',$selector,style.stepDesp,'');
                    style.stepDespActive && $AW.cssHover('.step-chart>.step-chart-ctn>.step-chart-ctt>.step-num.step-num-active +.step-desp span',$selector,style.stepDespActive,'');
                    style.stepNormalBtn && $('.step-btn-ctn .btn.btn-normal',$selector).css(style.stepNormalBtn);
                    style.stepNormalBtnHover && $AW.cssHover('.step-btn-ctn .btn.btn-normal',$selector,style.stepNormalBtnHover,':hover');
                    style.stepNormalBtnActive && $AW.cssHover('.step-btn-ctn .btn.btn-normal',$selector,style.stepNormalBtnActive,':active');
				}
            },

            //listen
            listen:function(){
                var context=this;

	            context.$selector
		            .off('.stepCtn')
		            .on({
			            'click.stepCtn': function (evt) {

				            var STEP=context.constant.STEP,
					            $el = $(evt.target || window.event.srcElement),
					            $targetBtn = $el.closest('.btn');

				            if ($targetBtn.length) {

					            switch (context.$btns.index($targetBtn)) {
						            case STEP.START:
						            case STEP.NEXT:
							            context.next();
							            break;
						            case STEP.BACK:
							            context.back();
							            break;
					            }
				            }
			            }
		            });
            },

            //setter
            stepTo:function(index){
                var i,showDivIdx;

	            this.currentStep = index;
	            this.$steps.removeClass('step-num-active').slice(0, index + 1).addClass('step-num-active');
	            this.$line.width(0).slice(0, index + 1).width('100%').eq(index).width('50%');
                  if(this.hideStep.length ){
                      showDivIdx =  this.showStep[index];
                  }else{
                      showDivIdx = index;
                  }

	            this.$divCtn.hide().eq(showDivIdx).show(0);

	            this.$btns.hide();

	            switch (index) {
		            case this.constant.STEP.START:
			            this.$firstBtn.show();
			            break;
		            case this.getStepLength() - 1:
			            this.$finalBtn.show();
			            this.$pBtn.show();
			            break;
		            default:
			            this.$nBtn.show();
			            this.$pBtn.show();
	            }

            },
            back:function(){
                this.stepTo(Math.max(this.currentStep-1,0));
            },
            next:function(){
                this.stepTo(Math.min(this.currentStep+1,this.stepLength-1));
            },
	        getCurrentStep: function () {
		        return this.currentStep;
	        },
	        getStepLength: function () {
		        return this.stepLength;
	        },


	        hideSpecifyStep: function (indexs) {
		        var nNum = JSON.parse(JSON.stringify(this.option.stepNum)),
                    i, index,flag=false,item;
                this.hideStep =[];


		        if ($.isArray(indexs)) {

			        for (i = -1; $.isNumeric(index = indexs[++i]);) {

				        nNum[index].hidden = true;
                        this.hideStep.push(index);
			        }

			        this.renderStepCtn(nNum, null, this.selectorID, this.pageContext);

		        }
	        },
	        display: function (result, input1, input2, condition) {
		        return this[result ? 'hide' : 'show']();

	        },
	        show: function () {
		        this.$selector.removeClass('hide');
	        },
	        hide: function () {
		        this.$selector.addClass('hide');
	        }
        };

        widget.layout = widget.layout||{};

        widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE].join('.stepCtn,') + '.stepCtn', function (type, oWidget) {
	        var $AW = window.parent.$AW,
                option,
                handleOptionType = function (option, oWidget) {
                    var cttWidgets = oWidget.children(),
                        flag=false;

                    option.stepNum.map(function (elem, index) {
                        var cttWidget = cttWidgets.filter(':eq(' + index + ')'),
                            uuid = cttWidget.id();

                        if (cttWidget.length) {
                            if (elem.type === 'pageFlow') {
                                // cttWidget.accept(false);
                                //
                                // (!elem.data) && (elem.data = {});
                                //
                                // if (elem.data.active !== true) {
                                //     elem.data.active = true;
                                //     elem.data.uuid = app.getUID();
                                //     elem.data.code = '##_VAR##.open(##_RESPONSE_DATA##,"' + elem.data.uuid + '")';
	                             //    flag=true;
                                // }
                                //
                                // if (!elem.data.name) {
                                //     elem.data.name = elem.name;
                                // }

                            } else {
                                cttWidget.accept(true);

                                (!elem.data) && (elem.data = {});

                                if (elem.data.active !== false) {
	                                flag=true;
                                    elem.data.active = false;
                                }
                            }

                        }
                    });

                    if(flag){
	                    oWidget.option(option, true);
                    }
                },

                configStepCtn = function (stepNum) {
                    var stepMap = {}, i, item, len,
                        uid, uids = [];

                    if (stepNum.length) {

                        stepMap = {};

                        for (i = -1; item = stepNum[++i];) {

                            !item.uid && (item.uid = app.getUID());
                            stepMap[item.uid] = item;
                        }
                    }

                    //default config
                    if ((type === widget.STATUS.WIDGET_INIT)) {

                        while (stepNum.length < 2) {

                            uid = app.getUID();

                            stepMap[uid] = {
                                name:'步骤' + (stepNum.length + 1),
                                stepTip: '必填',
                                uid: uid
                            };

                            stepNum.push(stepMap[uid]);

                            if (oWidget.children().length !== stepNum.length) {

                                oWidget.append('divCtn', function (w_divCtn) {

                                    $AW(w_divCtn).attr("stepId", uid);

                                    w_divCtn.drag(false) && w_divCtn.del(false);

                                    w_divCtn.config();
                                });
                            }

                        }

                        oWidget.option(option);



                    } else if (type === widget.STATUS.WIDGET_UPDATE) {

                        if (stepNum.length > oWidget.children().length) {

                            oWidget.children().each(function (index, w_cDivCtn) {


                                if ((uid = $AW(w_cDivCtn).attr("stepId")) && (uid instanceof String)) {

                                    uids.push(uid);
                                } else {

                                    //兼容旧组件数据
                                    $AW(w_cDivCtn).attr("stepId", stepNum[index].uid);
                                    uids.push(stepNum[index].uid);
                                }
                            });

                            for (i = -1; item = stepNum[++i];) {

                                (function (i) {

                                    if (!~uids.indexOf(stepNum[i].uid)) {

                                        item.uid = app.getUID();
                                        item.name= '步骤' +(i + 1);
                                        item.stepTip='必填';


                                        oWidget.option(option);

                                        oWidget.append("divCtn", function (w_divCtn) {

                                            $AW(w_divCtn).attr("stepId", stepNum[i].uid);

                                            w_divCtn.drag(false) && w_divCtn.del(false);


                                                w_divCtn.config();
                                        });
                                    }

                                })(i);
                            }
                        } else if (stepNum.length < oWidget.children().length) {

                            oWidget.children().each(function (index, w_divCtn) {

                                !stepMap[$AW(w_divCtn).attr("stepId")] && $AW(w_divCtn).destroy();
                            });
                        }

                        handleOptionType(option, oWidget);

                    }


                };

            oWidget && oWidget.length && oWidget.each(function (index, elem) {
                var stepNum;

                oWidget = oWidget.eq(index);

                if (oWidget.href && oWidget.href() === 'layout.stepCtn') {
                    oWidget.drop(false);
                    oWidget.children().del(false);

                    option = oWidget.option();

                    stepNum = (option.stepNum || (option.stepNum = []));

                    configStepCtn(stepNum, option);
                }


            })
        });

        widget.layout.stepCtn = function (obj, oOption, oAttr, oCss, auiCtx) {

	            return new Component(obj,oOption,oAttr,oCss,auiCtx);

        };

        return widget;
    });
})();