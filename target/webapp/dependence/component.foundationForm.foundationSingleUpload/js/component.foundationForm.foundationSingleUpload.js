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
			define(["jquery", "widget", 'component.foundationForm', 'fileUpload'], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget) {
		"use strict";

		function render( $selector, option,  attr, css,formOption, auiCtx) {
			//初始化


			var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
			   horizontalTemp = '<label title="_label_">_label__mustInput_</label><div class="input-group file-uploader-warp"><input class="file-uploader-input input-group-field" type="file"/><div class="file-uploader-wrap-fake"> <input type="text"  class="file-uploader-input-fake input-group-field " /></div> <div class="form-error-arrow"></div><label class="form-error-msg"></label></div>',
				inlineTemp = "<div class='columns'>" +
					"<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
					"</div>" +
					"<div class='columns'>" +
					"<div class='input-group file-uploader-warp'><input class='file-uploader-input input-group-field' type='file'/><div class='file-uploader-wrap-fake'> <input type='text'  class='file-uploader-input-fake input-group-field ' /></div><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>" +
					"</div>",
				spanTemplate = '<span class="input-group-label"></span>',
				value,
				inputType,
				prepend,
				append,
				icon, iconAppended = false,
				iconPosition,
				$input,
                $fakeInput,
                fullFileName,
				fileName,
				returnValue,
				useIcon,
                isFirst=true,
				isInline = formOption.formLayout === 'inline',
				labelAlign = option.labelAlign || formOption.labelAlign,
				template = isInline ? inlineTemp : horizontalTemp,
				span = option.span || formOption.span,
				labelSpan = option.labelSpan || formOption.labelSpan,
				isIE = /msie/i.test(window.navigator.userAgent) && !window.opera,
                init = function () {
                    var style, heightValue, inputObj,name,id,$el,$clone,
                        events = auiCtx.delegateEvents, i, eventParams, eventType, eventSelector,
                        callback={},

                        change = function($fakeInput,$input){
                            var name = $input.val(),

                                accept = '(' + (option.accept || '').replace(/\s/g, '').split(',').join('|') + ')'.replace(/\./g, '\\\\\\\\.');
                            fullFileName = name;

                            if (name) {

                                try {
                                    name = name.match(new RegExp('([^\\\\/]+)' + accept + '$'));
                                } catch (e) {
                                    app.alert('上传类型格式错误！', app.alert.ERROR);
                                }

                                if (accept && !name) {
                                    app.alert('上传文件格式不为“' + accept + '”！', app.alert.ERROR);
                                }
                                name = name && name[1] || '';

                                fileName = name;
                                $fakeInput.val(name);

                            }
                        },
                        placeholder = option.placeholder || '请选择上传文件';

                    if(auiCtx){
                        placeholder = $AW.nsl(placeholder,$selector.attr('id'),auiCtx)
                    }

                    $input = $selector.find('input.file-uploader-input');
                    $fakeInput =$selector.find('.file-uploader-wrap-fake .input-group-field ');

                    $input.attr({
                        id: attr.name,
                        name: attr.name,
                        placeholder:placeholder ,
                        accept: option.accept || ''
                    })
                        .off('.getfileData')
                        .off('change');
                    $fakeInput.attr('placeholder', option.placeholder || '请选择上传文件');

					/* $input.removeAttr('value');*/

                    if(!isFirst){
                        id = attr.id;
                        $el=auiCtx.$el;
                        for (i in events) {
                            if (events.hasOwnProperty(i) && i.indexOf('#'+id) !== -1 && i.indexOf('input')!==-1) {
                                eventParams = i.split(' ');
                                eventType = eventParams[0];
                                eventSelector = eventParams.slice(1).join(' ');

                                if(($clone=$(eventSelector,$el)).is($input)){
                                    callback[eventType]=events[i];
                                }
                            }
                        }
                    }


                    $input
                        .on({
                            'change.getfileData': function () {

                                change($fakeInput,$input);
                            }
                        });

                    if(!isFirst){
                        $input.on(callback);
                    }else{
                        isFirst=false;
                    }

                    option.disabled && $input.attr('disabled', option.disabled);


                    //自定义样式
                    if(css && css.cssCode && css.cssCode.className){
                        $selector.addClass(css.cssCode.className)
                    }

                    //设置样式
                    if (css && (style = css.style)) {
                        if (style.input) {
                            inputObj = JSON.parse(JSON.stringify(style.input));
                            $AW.cssHover('.file-uploader-warp', $selector, style.input, '');
                            style.input['background-color'] && $('.file-uploader-input-fake',$selector).css({'background-color':style.input['background-color']});
                            inputObj['width'] && $selector.find('input.file-uploader-input').css({'width': inputObj['width']});
                            if (inputObj['height']) {
                                heightValue = inputObj['height'];
                                if (heightValue.substr(heightValue.length - 2, 2) === 'px') {
                                    $selector.find('.form-error-msg').css({'top': (parseFloat(inputObj['height']) + 5) + 'px'});
                                }
                            }
                        }
                        style.position && $selector.css(style.position);
                        if (style.inputActive) {
                            $AW.cssHover('.file-uploader-warp', $selector, style.inputActive, ':focus');
                            $AW.cssHover('.file-uploader-warp', $selector, style.inputActive, ':hover');
                        }
                        style.inputIconHover && $AW.cssHover('input.file-uploader-input:hover>span i', $selector, style.inputIconHover, '');
                        if (style.title) {
                            if (!isInline) {
                                $input.parent().prev().css(style.title);
                            } else {
                                if (typeof auiCtx === 'undefined') {
                                    $selector.children().first().find('label').css(style.title);
                                } else {
                                    $selector.prev().find('label').css(style.title);
                                }
                            }
                        }
                    }

                    //设置错误信息位置
					/*	$input.next('label').addClass('form-error-msg-' + option.errorMsgOrientation);*/

                    //处理小图标及前后置内容
                    if(!iconAppended) {
                        handleIconAndAppend(style);
                        iconAppended = true;
                    }

                    //处理数据输入
//					handleInput();
                },

                handleIconAndAppend = function (style) {
                    //前置内容
                    if (prepend) {
                        $span = $(spanTemplate);
                        $span.text( $AW.nsl(prepend, attr.id, auiCtx));
                        $input.before($span);
                    }

                    //后置内容
                    if (append) {
                        $span = $(spanTemplate);
                        $span.text( $AW.nsl(append, attr.id, auiCtx));
                        $input.parent('div').append($span);

                    }

                    if (icon && useIcon) {
                        var iconTmplate = '<span class="input-group-label"><i class="' + icon + '"></i></span>',
                            $iconBtn,
                            $span;

                        //图标加在右边
                        if (iconPosition) {
                            $input.parent('div').children(':last').after(iconTmplate);
                            $iconBtn = $input.parent('div').children(':last');
                            $iconBtn.addClass('input-r-btn');


                        } else {
                            //图标加在左边
                            $input.parent('div').children(':first').before(iconTmplate);
                            $iconBtn = $input.parent('div').children(':first');
                            $iconBtn.addClass('input-l-btn');

                        }
                        if (style && style.inputIcon) {
                            $iconBtn.css(style.inputIcon);
                        }

                    }
                },
                handleInput = function () {
                    var input;

                    input = $input[0];

                    $input.css({
                        color: (!input.files || !input.files.length) ? 'transparent' : ''
                    });

                    $input.off('change.input').on('change.input', function (e) {
                        $input.css({
                            color: (!this.files || !this.files.length) ? 'transparent' : ''
                        });
                    });
                },
                getValue = function () {
                    var files = $input[0].files;

                    return files && files.length ? files[0] : null;
                },
                resetValue = function () {
                    $input.val('');
                    $fakeInput.val('');
                },
                getFileSize =function () {
                    var fileSize = 0,files = $input[0].files,
                        filePath,fileSystem,file;

                    if (isIE &&!files) {   // IE浏览器
                        try{
                            filePath = $input.val(); // 获得上传文件的绝对路径
                            fileSystem = new ActiveXObject("Scripting.FileSystemObject");
                            file = fileSystem.GetFile(filePath);
                            fileSize = file.Size;    // 文件大小，单位：b
                        }catch (e){
                            app.alert(e+"如果错误为：Error:Automation 服务器不能创建对象；"+
                                "请按以下方法配置浏览器："+
                                "请打开【Internet选项-安全-Internet-自定义级别-ActiveX控件和插件-对未标记为可安全执行脚本的ActiveX控件初始化并执行脚本（不安全）-点击启用-确定】",app.alert.MESSAGE,'undefined');
                            return false;
                        }

                    } else if(files && files.length){    // 非IE浏览器
                        fileSize = $input[0].files[0].size;
                    }else{
                        app.alert('当前未选择任何文件',app.alert.WARNING);
                    }

                    return fileSize / 1024;//KB

                },
                getFullFileName = function () {
                    if(fullFileName){
                        return fullFileName;
                    }else{
                        app.alert('当前未选择任何文件',app.alert.WARNING);
                    }

                },
                getFileName = function(){
                    if(fileName){
                        return fileName;
                    }else{
                        app.alert('当前未选择任何文件',app.alert.WARNING);

                    }

                };

			option.input_type && (inputType = option.input_type);
			option.prepend && (prepend = option.prepend);
			option.append && (append = option.append);
			option.icon && (icon = option.icon);
			option.iconPosition && (iconPosition = option.iconPosition);
			option.useIcon && (useIcon = option.useIcon);

			//i18n
			    if(auiCtx){
				template = template
				.replace(/_label_/g, $AW.nsl(option.label,$selector.attr('id'),auiCtx) || "")
				.replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
			}

				if (isInline) {
					$selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
						template,
						labelSpan,
						labelAlign,
						auiCtx,
						"aweb4foundationSingleUpload",
						attr);

					attr.id && $selector.attr('id', attr.id);
				} else {
					$selector.append(template);
					widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
				}

				//初始化
				init();


			returnValue = {
				getValue: getValue,
				resetValue: resetValue,
				getFileSize:getFileSize,
                getFullFileName:getFullFileName,
                getFileName:getFileName,
				triggerUpload:function () {
                    $input.trigger('click');
                },


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
				error: function ($input, errorMsg) {
					var $arrow = $input.next(),
						$label = $arrow.next();

					$label.empty().append('<i class="fa fa-exclamation-circle"></i>' + errorMsg);
					$label.css("display", "block");
					$arrow.css("display", "block");
					$input
						.addClass('form-error')
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

				/*
				 *  desp Clean Callback
				 *   params： @jquery event handler event
				 *
				 * */
				clean: function (event) {
					/*	resetValue();*/
					var $label = $input.next().next('label');
					var $arrow = $input.next('div');

					$input.off('.error').removeClass('form-error');

					$label.css("display", "none");
					$arrow.css("display", "none");
				},

				/*
				 *   desp success callback
				 *   params  @jquery object $input
				 *
				 * */
				success: function ($input) {
					var $label = $input.next().next('label');
					var $arrow = $input.next('div');

					$input.removeClass('form-error');
					$input.off('.error');

					$label.css("display", "none");
					$arrow.css("display", "none");
				},

				/*
				*   desp isEmpty
				*   return boolean isEmpty
				* */
				isEmpty: function (value) {
					var ret= {
						value: value
					};

					if(!(ret.result=!!$input.val())){
						ret.errorMsg='上传文件不能为空';
					}

					return ret;
				},

				disabled:function(value){
					value ? $fakeInput.prop('disabled',true):$fakeInput.prop('disabled',false);
                    value ? $input.prop('disabled',true):$input.prop('disabled',false);
				},

				upload: function (uploadOption) {
					var validateResult, url,

						queryString = {},
						urlExternal = [],
						urlDivider,

						data = {},

						i, item, items;

                    if( $input[0].files && $input[0].files.length){
                        if (!(uploadOption && (url = uploadOption.url) && !!~url.indexOf('##')) ) {
                            uploadOption = $.extend(true, {
                                type: "post",
                                contentType: "application/x-www-form-urlencoded;charset=utf-8",
//							dataType: "json",
                                traditional: true,
                                shelter: false,
                                urlDivider: '\/',
                                validateSuccessCallback: function ($elem) {
                                    $elem.closest('.control-group').removeClass('danger');
                                },
                                validateErrorCallback: function ($elem, errMsg) {
                                    $elem.closest('.control-group').addClass('danger');
                                },
                                validateCleanCallback: function (foucusEvent) {
                                    $(this).closest('.control-group').removeClass('danger');
                                }
                            }, uploadOption);

                            urlDivider = uploadOption.urlDivider;

                            //get value and validate
                            validateResult = app.validate(uploadOption.data, uploadOption.validateSuccessCallback, uploadOption.validateErrorCallback, uploadOption.validateCleanCallback, uploadOption.validateContinue, uploadOption.validate);

                            if (validateResult.result) {
                                uploadOption.data = validateResult.data;

                                //自定义属性
                                //shelter
                                uploadOption.timeout = $.isNumeric(uploadOption.timeout) ? uploadOption.timeout : 30000;
                                if (uploadOption.shelter) {
                                    app.shelter.show(uploadOption.shelter === true ? null : uploadOption.shelter, uploadOption.timeout);
                                }

                                //process data
                                if ($.isArray(uploadOption.data)) {
                                    for (items = uploadOption.data, i = items.length; item = items[--i];) {
                                        if (item.queryString) {
                                            queryString[item.name] = item.value;
                                        } else if (item.urlExternal) {
                                            urlExternal.push(item.value);
                                        } else {
                                            data[item.name] = item.value;
                                        }
                                    }
                                    uploadOption.data = data;
                                }

                                //添加token
                                if (window.ctoken) {
                                    uploadOption.data = (uploadOption.data || {});
                                    uploadOption.data.ctoken = window.ctoken;
                                }

                                //deal url
                                if (urlExternal.length) {
                                    urlExternal = urlDivider + urlExternal.join(urlDivider);
                                    if (url[url.length - 1] === '?') {
                                        url[url.length - 1] = '\/';
                                    }

                                    url += urlExternal;
                                }

                                if (!$.isEmptyObject(queryString)) {
                                    url += (url.indexOf('?') !== -1 ? '' : '?') + $.param(queryString);
                                }

                                uploadOption.url = url;

                                //exec ajax

                                return $.ajaxFileUpload({
                                    url: uploadOption.url,
                                    fileElementId: attr.name,
                                    secureuri: !!option.secureuri,
                                    type: 'post',
                                    data: uploadOption.data,
                                    dataType: uploadOption.dataType || 'json',
                                    success: function (data) {
                                        if (uploadOption.shelter) {
                                            app.shelter.hide();
                                        }

                                        try {
                                            uploadOption.success(data);
                                        } catch (e) {
                                            console.error(e);
                                        } finally {
                                            init();
                                        }
                                    },
                                    error: function (xhr, status, errMsg) {
                                        if (uploadOption.shelter) {
                                            app.shelter.hide();
                                        }

                                        try {
                                            uploadOption.success({
                                                status: false,
                                                content: {
                                                    result: ''
                                                },
                                                errorMsg: errMsg
                                            });
                                        } catch (e) {

                                        }finally {
                                            init();
                                        }
                                    }
                                });
                            }
                        }
                    }else{
                        app.alert('当前未选择任何文件',app.alert.WARNING);
					}
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
		widget.component.foundationForm.foundationSingleUpload = function ($selector, oOption, oAttr, oCss, auiCtx) {
			var

				formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

				return render($selector, oOption,  oAttr, oCss,formOption, auiCtx);
			};


		return widget;
	});
})();