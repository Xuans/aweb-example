/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author zhanghaixian@agree.com.cn
 */
( /* <global> */ function(undefined) {

    (function(factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "bootstrap_datepicker",'component.foundationForm'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function($, widget) {
        "use strict";

        //检查是否是日期
        function isDate(str, format) {
            if (str === null || str === undefined || str === false ) {
                return false;
            }
            var rgExp = /^\d{4}-(0[1-9]|1[0-2])-((0[1-9])|((1|2)[0-9])|30|31)$/,
                flag = false;
            format = format ? format: "Y-m-d";

            switch(format){
                case 'Y-m-d':
                    rgExp = /^\d{4}-(0[1-9]|1[0-2])-((0[1-9])|((1|2)[0-9])|30|31)$/;
                    break;
                case 'Y-m':
                    rgExp = /^\d{4}-(0[1-9]|1[0-2])$/;
                    break;
                case 'Y年m月d日':
                    rgExp = /^\d{4}年(0[1-9]|1[0-2])月((0[1-9])|((1|2)[0-9])|30|31)日$/;
                    break;
                case 'Y年m月':
                    rgExp = /^\d{4}年(0[1-9]|1[0-2])月$/;
                    break;
                case 'Ymd':
                    rgExp = /^\d{4}(0[1-9]|1[0-2])((0[1-9])|((1|2)[0-9])|30|31)$/;
                    break;
                case 'Ym':
                    rgExp = /^\d{4}(0[1-9]|1[0-2])$/;
                    break;
                case 'Y/m/d':
                    rgExp = /^\d{4}\/(0[1-9]|1[0-2])\/((0[1-9])|((1|2)[0-9])|30|31)$/;
                    break;
                case 'Y/m':
                    rgExp = /^\d{4}\/(0[1-9]|1[0-2])$/;
                    break;
                case 'Y':
					rgExp = /^\d{4}$/;
					break;
				case 'Y年':
					rgExp = /^\d{4}年$/;
				default:
					return true;
                    
            }

            flag = rgExp.test(str);

            //flag || app.alert('日期格式不对', app.alert.ERROR);

            return flag;
        }

        //比较两日期先后
        function compareDate(checkStartDate, checkEndDate) {
            var arys1 = [],arys2 = [],sdate,edate;
            if (checkStartDate !== null && checkEndDate !== null) {
                arys1 = checkStartDate.split('-');
                sdate = new Date(arys1[0], parseInt(arys1[1] - 1,10), arys1[2]);
                arys2 = checkEndDate.split('-');
                edate = new Date(arys2[0], parseInt(arys2[1] - 1,10), arys2[2]);
                if (sdate > edate) {
                    return false;
                } else {
                    return true;
                }
            }
        }

        function renderDatepicker($selector, option, attr,  css,formOption, auiCtx) {
            var setValue = function(val) {
                    $input.val(isDate(val, option.format) ? val : "");
                },
                getValue = function() {
                    return $input.val();
                },
				focus = function(){
					$input.trigger('focus');
				},
                cleanErrorStyle = function ($input) {
                    if($input && $input.next()) {
                        var $label = $input.next().next('label'),
                            $inputGroup = $input.parent('.input-group'),
                            $arrow = $input.next('div');

                        $input.off('.error');
                        $inputGroup.removeClass('form-error');

                        $label.add($arrow).css("display", "none");
                    }
                },
                setErrorStyle = function ($input,errorMsg) {
                    var $arrow = $input.next(),
                        $inputGroup = $input.parent('.input-group'),
                        $label = $arrow.next();

                    $label.empty().append('<i class="fa fa-exclamation-circle"></i>'+errorMsg);

                    $label.add($arrow).css("display", "block");
                    $inputGroup.addClass('form-error');
                    $input
                        .off('.error')
                        .on({
                            'mouseenter.error': function () {
                                $label.css("display", "block");
                                $arrow.css("display", "block");
                            },
                            'mouseleave.error': function () {
                                $label.css("display", "none");
                                $arrow.css("display", "none");
                            }
                        });
                },
                resetValue = function() {
                    $input.val("");
                    cleanErrorStyle($input);
                },
                // 对日期月份名称进行国际化翻译
                translateDate = function(date,attr,auiCtx){
                    var i,item,id,dataList = date;
                        auiCtx && (id = attr.id);
                       for (i = dataList.length;item = dataList[--i];) {
	                       dataList[i] = $AW.nsl(item,id,auiCtx);
                       }
                       return dataList;
                };
            var mustInputTemp = '<span style="color:#ff0000;padding-right:2px;">*</span>',
                horizontalTemp = '<label title="_label_">_label__mustInput_</label><div class="input-group"><input type="text" class="input-group-field datepicker-input" placeholder="_INPUTTIPS_"/><div class="form-error-arrow"></div><label class="form-error-msg"></label>_CLEANBTN_<span class="add-on"><i class="fa fa-calendar"></i></span> </div>',
                inlineTemp = "<div class='columns'>" +
                    "<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
                    "</div>" +
                    "<div class='columns'>" +
                    "<div class='input-group'><input type='text' class='input-group-field datepicker-input' placeholder='_INPUTTIPS_' /> <div class='form-error-arrow'></div><label class='form-error-msg'></label>_CLEANBTN_<span class='add-on'><i class='fa fa-calendar'></i></span></div>" +
                    "</div>",
                cleanBtnTemp ="<span class='add-on-clean'><i class='fa fa-times-circle'></i></span>",
                isInline = formOption.formLayout === 'inline',
                labelAlign = option.labelAlign || formOption.labelAlign,
                template = isInline ? inlineTemp : horizontalTemp,
                span = option.span || formOption.span || 1,
                labelSpan = option.labelSpan || formOption.labelSpan,
                returnValue,
                startView,
                format,
                $input,
                $icon,
                $cleanBtn,
                tomorrow,
                activeColor,
                hoverColor,
                color,
                backgroundColor,
                borderColor,
                initialDate = new Date(),
                style, mainColor, mainColorObj, $datePicker,beforeVal,
                weeks = ["日", "一", "二", "三", "四", "五", "六", "日"],
                months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                monthsShort = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],

                 ua = navigator.userAgent.toLowerCase(),
                 isIE = ua.indexOf("msie")>-1,
                 ieVersion;
                if(isIE) {
                    ieVersion = ua.match(/msie ([\d.]+)/)[1];
                }
            
            if(auiCtx){
                template = template
                .replace(/_label_/g, $AW.nsl(option.label,$selector.attr("id"),auiCtx) || "")
                .replace(/_INPUTTIPS_/, $AW.nsl(option.inputTips,$selector.attr("id"),auiCtx) || "") 
                .replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
                
            }

                template = template.replace(/_CLEANBTN_/,option.showCleanBtn? cleanBtnTemp:"");


                if (isInline) {
                    $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                        template,
                        labelSpan,
                        labelAlign,
                        auiCtx,
                        "aweb4Datepicker",
                        attr);
                    attr.id && $selector.attr('id', attr.id);

                } else {
                    $selector.append(template);
                    widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
                }


            //设置内容
            $input = $selector.find("input");
            beforeVal =  $input.val()||"";
            $input
                .on({

                    'focus.input':function(e){

                        beforeVal = $input.val();
                    },
                    'keyup.inputChange':function(e){
                        var $target = $(e.target || event.srcElement);

                        if(beforeVal!==$target.val()){

                            beforeVal = $target.val();
                            $input.trigger('change');
                        }
                    }
                });

            if(option.disabled){
                $input.attr("disabled", "disabled");
                $input.siblings('.add-on').addClass('disabled')
            }else{
                $input.siblings('.add-on').removeClass('disabled')
            }


            option.readonly && $input.attr('readonly','true');


            // 默认使用中文的配置，在此基础上使用国际化配置
            $.fn.datetimepicker.dates["zh"] = {
                days: translateDate(["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],attr,auiCtx),
                daysShort: translateDate(["周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],attr,auiCtx),
                daysMin:  translateDate(weeks,attr,auiCtx),
                months: translateDate(months,attr,auiCtx),
                monthsShort: translateDate(monthsShort,attr,auiCtx),
                today: $AW.nsl('今天', attr.id, auiCtx),
                suffix: [],
                meridiem: translateDate(["上午", "下午"],attr,auiCtx)
            };

            if(option.view){
                switch(option.view){
                    case 'hour':
                        startView = 0;
                        break;
                    case 'days':
                        startView = 1;
                        break;
                    case 'months':
                        startView = 2;
                        break;
                    case 'years':
                        startView= 3;
                        break;
                    case 'decade':
                        startView= 4;
                        break;
                }
            }
            if(option.format){
	            switch(option.format){
		            case 'Y-m-d':
			            format = 'yyyy-mm-dd';
			            break;
		            case 'Y/m/d':
			            format = 'yyyy/mm/dd';
			            break;
		            case 'Y年m月d日':
			            format = 'yyyy年mm月dd日';
			            break;
		            case 'Y-m':
			            format = 'yyyy-mm';
			            break;
		            case 'Y/m':
			            format = 'yyyy/mm';
			            break;
		            case 'Y年m月':
			            format = 'yyyy年mm月';
			            break;
		            case 'Ymd':
                        format = 'yyyymmdd';
                         break;
                     case 'Ym':
                         format = 'yyyymm';
                         break;
                    case 'Y年':
                        format = 'yyyy年';
                        break;
                    case 'Y':
                        format = 'yyyy';
                        break;
                    default:
                    	format = option.format;
	            }
            }
            if(option.default_position === 'above'){
                option.default_position  ='bottom-left';
            }else if(option.default_position === 'below'){
                option.default_position  ='bottom-right';
            }

            var setting = {
                format: format|| 'yyyy-mm-dd',
                autoclose: true,
                todayBtn: true,
                fontAwesome:'fa',
                forceParse:false,
                keyboardNavigation:true,
                startView: startView,
                minView:parseInt(option.minView,10),
                maxView:parseInt(option.maxView,10),
                language:'zh',
                todayHighlight:true,
                weekStart: parseInt(option.first_day_of_week,10),
                pickerPosition:option.default_position
            };

            if(option.dayLimit!==''&& parseInt(option.dayLimit,10)!==0){
                tomorrow = new Date();
                tomorrow.setTime(tomorrow.getTime()+24*60*60*1000*parseInt(option.dayLimit,10));
                setting.endDate = tomorrow;
            }
            
            if(option.initialDate && option.initialDate!==''&& parseFloat(option.initialDate)!==0){
                initialDate.setTime(parseInt(initialDate.getTime()+24*60*60*1000*parseInt(option.initialDate,10),10));
                setting.initialDate = initialDate;
            }
            

            $input.datetimepicker(setting).on('changeDate', function(ev){
                $cleanBtn.show();
            });
            //默认值
            if(option.defaultFlag){
            	option.defaultValue ? $input.val(option.defaultValue):$input.datetimepicker('update',initialDate);
            }
            
            $icon = $input.siblings('.add-on');
            if(option.show_icon){
                $icon.show();
            }else{
                $icon.hide();
            }
            if(!option.disabled) {
                $icon.off('.icon').on('click.icon', function () {
                    $input.focus();
                });
            }
            $cleanBtn = $input.siblings('.add-on-clean');
            $cleanBtn.off('.clean').on('click.clean',function () {
                $input.val('');
                $input.trigger('change');
                $cleanBtn.hide();
            });

            $datePicker = $($input.data('datetimepicker').picker);
            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $selector.addClass(css.cssCode.className)
            }
            //样式配置

            if (css && ( style = css.style)) {
                if(style.title) {
                    if(!isInline){
                        $selector.find("label").eq(0).css(style.title);
                    }else{
                        $selector.prev().find('label').css(style.title);
                    }
                }
                if(style.input){
                    $AW.cssHover('.input-group input',$selector,$.extend({},style.input,{'width':''}),'');
                    $input.parent().css({'width':JSON.parse(JSON.stringify((style.input)))['width']});
                }
                style.inputHover && $AW.cssHover('.input-group input',$selector,style.inputHover,':hover');
                style.position && $selector.css(style.position);
                style.inputIcon &&  $AW.cssHover('.input-group .add-on i', $selector,style.inputIcon, '');

                if (style.mainColor) {
                    mainColor = JSON.parse(JSON.stringify(style.mainColor));

                    activeColor ={"border":"1px solid "+mainColor['color'],"background-color":mainColor['color'],"color":"#ffffff"};
                    if(mainColor['background-color'].indexOf('rgba')!==-1){
                        hoverColor = {
                            "background": mainColor['background-color'],
                            "color": parseFloat(ieVersion) <= 8 ? '#fff':mainColor['color']
                      }
                    }else{
                        hoverColor = {
                            "background-color":mainColor['background-color'],
                            "color":mainColor['color']
                        }
                    }

                    color ={"color":mainColor['color']};
                    borderColor ={"color":mainColor['color'],"background-color":"#ffffff","border":"1px solid "+mainColor['color']};
                    backgroundColor ={"background-color":mainColor['background-color']};

                    $AW.cssHover('.input-group .add-on i', $selector,color, ':hover');
                    $AW.cssHover('table tr td.day.active', $datePicker,activeColor, '');
                    $AW.cssHover('table tr td.day.active', $datePicker,activeColor, ':hover');
                    $AW.cssHover('table tr td.day.active.disabled', $datePicker,activeColor, '');
                    $AW.cssHover('table tr td.day.active.disabled', $datePicker,activeColor, ':hover');

                    $AW.cssHover('thead tr:first-child th', $datePicker,color, ':hover');
                    $AW.cssHover('tfoot th', $datePicker,color, ':hover');

                    $AW.cssHover('table tr td span', $datePicker, backgroundColor, ':hover');
                    $AW.cssHover('table tr td.day', $datePicker, backgroundColor, ':hover');
                    $AW.cssHover('table tr td.hour', $datePicker, backgroundColor, ':hover');
                    $AW.cssHover('table tr td.minute', $datePicker, backgroundColor, ':hover');

                    $AW.cssHover('table tr td.today', $datePicker, hoverColor, ':hover');
                    $AW.cssHover('table tr td.today', $datePicker, hoverColor, '.active');


                    $AW.cssHover('table tr td.today', $datePicker,borderColor, '');
                    $AW.cssHover('table tr td.today', $datePicker,borderColor, ':hover');
                }
                style.datePicker && $datePicker.css(style.datePicker);
                style.inputIconHover &&  $AW.cssHover('.input-group .add-on i', $selector,style.inputIconHover , ':hover');
            }

            returnValue = {
                setValue: setValue,
                getValue: getValue,
                resetValue: resetValue,
                focus:focus,

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

			
                hide: function() {

                    $selector.css('display', 'none');
                    if(isInline){
                        $selector.prev(".columns").hide();
                    }

                },
              
                error: function($input,msg){
                    setErrorStyle($input,msg);
                },

                clean:function ($input) {

                    cleanErrorStyle($input);
                },

                success: function($input) {
                    var $label = $input.next().next('label'),
                        $inputGroup = $input.parent('.input-group'),
                        $arrow = $input.next('div');

                    $inputGroup.removeClass('form-error');
                    $input.off('.error');

                    $label.css("display","none");
                    $arrow.css("display","none");
                },
                disabled:function (value) {
                    if(value){
                        $input.prop('disabled',true);
                        $icon.off('.icon').addClass('disabled');
                    }else {
                        $input.prop('disabled', false);
                        $icon.off('.icon').on('click.icon', function () {
                            $input.focus();
                        }).removeClass('disabled');
                    }

                },
                setTimeQuantum:function (startDate,endDate) {
                    $input.datetimepicker('setStartDate',startDate);
                    $input.datetimepicker('setEndDate',endDate);
                },
                mustInput: function (flag) {
                    var $label = $('[title="'+option.label+'"]',$selector);

                    $label.empty();
                    if(flag === true){
                        $label.html(option.label+mustInputTemp)
                    }else{
                        $label.html(option.label)
                    }
                }
            };
            return returnValue;
        }

        if (!widget.component.foundationForm) {
            widget.component.foundationForm = {};
        }
        widget.component.foundationForm.foundationDatepicker = function($selector, option, attr, css, auiCtx) {

            var formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

                return renderDatepicker($selector, option, attr, css, formOption, auiCtx);
            };


        return widget;
    });
})();