/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author lihao01@agree.com.cn
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
        
        function renderPassword( $selector, option,attr, css,formOption, auiCtx) {

            //初始化
            var init = function () {
                var inputObj,style,heightvalue;
                $input = $selector.find('input');
                if(auiCtx){
                    $input.attr('placeholder' , $AW.nsl(option.placeholder,$selector.attr('id'),auiCtx) || "");
                }
                option.disabled && $input.attr("disabled","disabled");
                option.autocomplete && $input.attr('autocomplete','off');

                    //自定义样式
                    if(css && css.cssCode && css.cssCode.className){
                        $selector.addClass(css.cssCode.className)
                    }

                //处理样式解析
                if(css&&(style =css.style)) {
                    if(style.input){
                        inputObj = JSON.parse(JSON.stringify(style.input));
                        $AW.cssHover('.input-group',$selector,$.extend({},inputObj),'');
                        style.position && $selector.css(style.position);
                        // inputObj['width'] && $selector.find('.input-group').css({'width':inputObj['width']});
                       if(inputObj['height']) {
                           heightvalue =inputObj['height'];
                           if(heightvalue.substr(heightvalue.length-2,2)==='px') {
                               $selector.find('.form-error-msg').css({'top': (parseFloat(inputObj['height']) + 5) + 'px'});
                           }
                       }
                    }
                    style.inputIconHover && $AW.cssHover('.input-warp:hover>span i',$selector,style.inputIconHover,'');
                    if(style.inputActive){
                        $AW.cssHover('.input-group',$selector,style.inputActive,':focus');
                        $AW.cssHover('.input-group',$selector,style.inputActive,':hover');
                    }

                    if(style.title) {
                        if(!isInline){
                            $input.parent().prev().css(style.title);
                        }else{
                            if(typeof auiCtx ==='undefined') {
                                $selector.children().first().find('label').css(style.title);
                            }else{
                                $selector.prev().find('label').css(style.title);
                            }
                        }
                    }
                }

                handleIcon(style);
            },
                //处理小图标
               handleIcon = function(style){
                if (option.iconopen && option.pwdVisible) {
                    var iconTmplate = '<span class="input-group-label"><i class="' + option.iconopen + '"></i></span>',
                        $iconBtn,
                        $span,
                        inputValue,
                        inputHtml,
                        $inputCopy,
                        $inputParent  = $input.parent(),
                        $labelI,$inputB;

                    //前置内容
                    if (option.prepend) {
                        $span = $(spanTemplate).addClass('left-text');
                        $span.text( $AW.nsl(option.prepend, attr.id, auiCtx));
                        $input.before($span);

                    }

                    //后置内容
                    if (option.append) {
                        $span = $(spanTemplate).addClass('right-text');
                        $span.text( $AW.nsl(option.append, attr.id, auiCtx));
                        $input.parent('div').append($span);

                    }

                    //图标加在右边
                    if (option.iconPosition) {
                        $input.parent('div').children(':last').after(iconTmplate);
                        $iconBtn = $input.parent('div').children(':last');
                        $iconBtn.addClass('input-r-btn');

                    } else {
                        //图标加在左边
                        $input.parent('div').children(':first').before(iconTmplate);
                        $iconBtn = $input.parent('div').children(':first');
                        $iconBtn.addClass('input-l-btn');


                    }
                    if(style && style.inputIcon){
                        $iconBtn.css(style.inputIcon);
                    }


                    inputHtml = $input[0].outerHTML;
                    //为图标绑定点击事件
                    $inputParent.find('span.input-group-label').off('click.changeIcon').on('click.changeIcon', function(){

                        $labelI = $inputParent.find('span.input-group-label i');
                        inputValue = $input.val();

                        if ($labelI.attr('class') === option.iconopen) {

                            if(app.getUA() === app.getUA.TYPE.MSIE){
                                $input =  $selector.find('input');
                                $inputCopy = $(inputHtml.replace('password','text'));
                                $input.replaceWith($inputCopy.val(inputValue));
                            }else{
                                $input[0].type = "text";
                            }
                            $labelI.removeClass(option.iconopen);
                            $labelI.addClass(option.iconclose);
                        } else {

                            if(app.getUA() === app.getUA.TYPE.MSIE){
                                 $input =  $selector.find('input');
                                 $inputCopy = $(inputHtml.replace('text','password'));
                                 $input.replaceWith($inputCopy.val(inputValue));
                            }else{
                                $input[0].type = "password";
                            }
                            $labelI.removeClass(option.iconclose);
                            $labelI.addClass(option.iconopen);
                        }
                    });
                }
            },
                //获取值
                getValue = function(){
                    return $input.val();
                },
                //设置值
                setValue = function(val){
                    $input.val(val);
                },
                //重置值
                resetValue = function(){
                    $input.val('');
                },
				focus = function(){
                    var value = $input.val(),
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
				};

        	var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>';
            var horizontalTemp = "<label title='_label_'>_label__mustInput_</label><div class='input-group input-warp'><input class='input-group-field' type='password'><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>",
                inlineTemp = "<div class='columns'>" + 
                                    "<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
                                "</div>" + 
                                "<div class='columns'>" + 
                                  "<div class='input-group input-warp'><input class='input-group-field' type='password'><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>" +
                                "</div>",
                spanTemplate = '<span class="input-group-label"></span>',
                isInline = formOption.formLayout === 'inline', 
                labelAlign = option.labelAlign || formOption.labelAlign,
                template = isInline ? inlineTemp : horizontalTemp,
                span = option.span || formOption.span,
                labelSpan = option.labelSpan || formOption.labelSpan,
                $input;
            //i18n
            if(auiCtx){
                template = template
                .replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx) || "")
                .replace(/_mustInput_/, option.mustInput ? mustInputTemp: "");
            }

                if (isInline) {
                    $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                            template,
                            labelSpan,
                            labelAlign,
                            auiCtx,
                            "aweb4FoundationPassword",
                            attr);

                    attr.id && $selector.attr('id', attr.id);
                } else {
                    $selector.append(template);
                    widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
                }

                //初始化
                init();


         /*   //设置错误信息位置
            $input.next('label').addClass('form-error-msg-'  + option.errorMsgOrientation);
          */
            return {
                getValue : getValue,
                setValue : setValue,
                resetValue : resetValue,
                focus:focus,

	            // 一个行为类型方法的 实现
	            display: function (result, input1, input2, condition) {
		            this[result ? 'hide' : 'show']();
	            },

	            /*
				 *   @show   弹窗行为
				 *       @e      Event Handler   事件句柄
				 *       @size   Object
				 *           @height     String  高度
				 *           @width      String  宽度
				 *   占位符为 ##_var##.接口名(e,size);
				 * */
	            show: function () {
		            $selector.removeClass('hide');
		            isInline && $selector.prev(".columns").removeClass('hide');
	            },

	            /*
				 *   @hide   隐藏行为
				 * */
	            hide: function () {
		            $selector.addClass('hide');
		            isInline && $selector.prev(".columns").addClass('hide');
	            },
                
                //校验回调
                /*
                * desp Error Callback
                * params @jquery object $input
                *           @string error message
                *
                * */
                        error:function($input, errorMsg){
                            var $arrow = $input.next(),
                                $label = $arrow.next(),
                                $inputGroup = $input.parent('.input-group');

                            $label.empty().append('<i class="fa fa-exclamation-circle"></i>'+errorMsg);
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


                /*
                *  desp Clean Callback
                *   params： @jquery event handler event
                *
                * */
                        clean:function(event){
                         /*   resetValue();*/
                            var $arrow = $input.next(),$label=$arrow.next(),$inputGroup = $input.parent('.input-group');

                            $label.add($arrow).css("display","none");
                            $inputGroup.removeClass('form-error');
                        },

                /*
                *   desp success callback
                *   params  @jquery object $input
                *
                * */
                 success:function($input){
                            var $label = $input.next().next('label'),
                                $inputGroup = $input.parent('.input-group'),
                                $arrow = $input.next('div');

                            $inputGroup.removeClass('form-error');
                            $input.off('.error');

                           $label.add($arrow).css("display","none");

                        },
                disabled:function(value){
                    value ?  $input.prop('disabled',true):$input.prop('disabled',false);
                },
                getTrimValue:function () {
                    return $.trim(getValue())
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
        }

        if (!widget.component.foundationForm ) {
            widget.component.foundationForm = {};
        }

        widget.component.foundationForm.foundationPassword = function ($selector, oOption, oAttr, oCss, auiCtx) {
            var

                formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

                return renderPassword($selector, oOption, oAttr, oCss,formOption, auiCtx);
            };

        return widget;
    });
})();