/**
 * @author pangjinquan@agree.com.cn
 */
(/* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", 'component.foundationForm'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        function renderFileUploader($selector, option, attr, css, formOption, auiCtx) {


            var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
                 tips = option.tips || "",
                ctnTemp = "<label title='_label_'>_label__mustInput_</label>" +
                    "<div class ='hide'><input type='file' class ='hide' multiple='multiple'/></div>" +
                    "<div class='uploadPanel '>" +
                    "<div class='uploadHead'>" +
                    "<span>" +
                    "<i class='fa fa-paperclip'></i><button style='margin-right:1px;' type='button' class='btn btn-normal'  data-role='chooseBtn'>选择文件</button>" +
                    "</span>" +
                    "(<span data-role='fileNum'>0 </span>/<span data-role='lessfileNum'></span>)" +
                    "<span data-role='errormsg' class='upload-error-msg'>！选择文件数量已达上限</span>" +
                    "<div  class='upload-tips'>" + tips + "</div>" +
                    "</div>" +
                    "<div class='filesList'></div>" +
                    "<span style='display: none;position:relative;'><i class='fa fa-upload'></i><button type='button' class='btn btn-focus'  data-role='uploadBtn'>上传文件</button></span></div>",
                inlineTemp = "<div class='columns'><label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label></div>" +
                    "<div class='columns mutifile-uploader'><div class ='hide'><input type='file' class ='hide' multiple='multiple'/></div>" +
                    "<div class='uploadPanel '>" +
                    "<div class='uploadHead'>" +
                    "<span>" +
                    "<i class='fa fa-paperclip'></i><button style='margin-right:1px;' type='button' class='btn btn-normal'  data-role='chooseBtn'></button>" +
                    "</span>" +
                    "(<span data-role='fileNum'>0</span>/<span data-role='lessfileNum'></span>)" +
                    "<span data-role='errormsg' class='upload-error-msg'>！选择文件数量已达上限</span>" +
                    "<div  class='upload-tips'>" + tips + "</div>" +
                    "</div>" +
                    "<div class='filesList'></div>" +
                    "<span style='display: none;position:relative;'><i class='fa fa-upload'></i><button type='button' class='btn btn-focus'  data-role='uploadBtn'></button></span></div></div>",
                classname,
                $input,
                $chooseBtn,
                $uploadBtn,
                $listDiv,
                $panel,
                $fileNumSpan,
                $lessfileNum,
                $errormsg,
                filesList = [],
                option = $.extend({
                    name: '上传',
                    tips: '点击上传文件',
                    accept: undefined,
                    canEditName: false,
                    changeCallback: undefined,
                    uploadConfig: {
                        callback: undefined,
                        tips: '正在上传文件，请稍候…',
                        secureuri: false,
                        data: undefined,
                        title: '上传错误'
                    }
                }, option),
                //bbin start
                isInline = formOption.formLayout === 'inline',
                labelAlign = option.labelAlign || formOption.labelAlign,
                template = isInline ? inlineTemp : ctnTemp,
                span = option.span || formOption.span,
                labelSpan = option.labelSpan || formOption.labelSpan,
                init = function () {
                    var itemTemp = '<li ><i class="fa fa-paperclip"></i><span class="fileName"> _name_<a>[删除]</a> </span></li>',
                        lessFileNum;

                    $chooseBtn = $selector.find('[data-role="chooseBtn"]');
                    $uploadBtn = $selector.find('[data-role="uploadBtn"]');
                    $input = $selector.find('input[type="file"]');
                    $panel = $selector.find('.uploadPanel').first();
                    $listDiv = $selector.find('.filesList');
                    $fileNumSpan = $selector.find('[data-role="fileNum"]');
                    $lessfileNum = $selector.find('[data-role="lessfileNum"]');
                    $errormsg = $selector.find('[data-role="errormsg"]');
                    $uploadBtn.attr("id", attr.id || '');//给上传按钮设置id
                    option.fileType && $input.attr('accept', option.fileType);
                    //i18n
                    if (auiCtx) {
                        option.chooseBtn && $chooseBtn.text($AW.nsl(option.chooseBtn, $selector.attr('id'), auiCtx));
                        option.chooseBtn && $uploadBtn.text($AW.nsl(option.submitBtn, $selector.attr('id'), auiCtx));
                    }

                    lessFileNum = option.numLimit ? option.numLimit : Number.MAX_SAFE_INTEGER;
                    $lessfileNum.text(lessFileNum);

                    $chooseBtn.off('.chosefile').on('click.chosefile', function () {
                        $input.trigger('click');
                    });

                    $input.off('.chosefile').on('change.chosefile', function () {
                        var files = $input[0].files,len,i,file,isRepeat,lessThanLimit,item, $a;

                        if ((files && files.length > 0)|| $input.val()) {
                            $uploadBtn.parent().css("display", "inline-block");
                            $listDiv.addClass("has-files");
                             len = files.length;
                            for ( i = 0; i < len; i++) {
                                    file = files[i];
                                    isRepeat = isContainFile(filesList, file);
                                    lessThanLimit = filesList.length < (option.numLimit ? option.numLimit : Number.MAX_SAFE_INTEGER);
                                if (!isRepeat && lessThanLimit) {
                                    filesList.push(file);
                                    $errormsg.css('display', 'none');
                                } else if (!isRepeat && !lessThanLimit) {
                                    /*app.alert("文件数超过限制数", app.alert.ERROR);*/
                                    $errormsg.css('display', 'inline-block');
                                    break
                                }
                            }
                            $input.val("");//重置input框，防止change事件不触发
                        } else {
                            setFilesNum($fileNumSpan, filesList);
                            $listDiv.removeClass('has-files');
                            $uploadBtn.parent().css("display", "none");
                        }

                        $listDiv.children().remove();//先清空上次的文件列表

                        if (filesList.length > 0) {
                            $uploadBtn.parent().css("display", "inline-block");
                            $listDiv.addClass("has-files");
                             len = filesList.length;
                            for ( i = 0; i < len; i++) {
                                 file = filesList[i];
                                 item = itemTemp.replace(/_name_/, file.name + '----');
                                $listDiv.append(item);
                            }
                            setFilesNum($fileNumSpan, filesList);
                            //绑定删除操作事件

                            $a = $listDiv.find('a');
                            $a.unbind("click"); //先进行解绑，避免重复绑定
                            $a.on('click', function () {
                                var $li = $(this).parent().parent();
                                filesList.splice($li.index(), 1);
                                $li.remove();
                                setFilesNum($fileNumSpan, filesList);
                                if (filesList.length <= 0) {
                                    $uploadBtn.parent().css("display", "none");
                                    $errormsg.css('display', 'none');
                                } else if ((filesList.length <= lessFileNum) && (filesList.length > 0)) {
                                    $errormsg.css('display', 'none');
                                }
                            });
                        } else {
                            $listDiv.removeClass('has-files');
                            setFilesNum($fileNumSpan, filesList);
                            $uploadBtn.parent().css("display", "none");
                        }
                    });


                    if (css && css.cssCode && css.cssCode.className) {
                        $selector.addClass(css.cssCode.className)
                    }

                    if (!$.isEmptyObject(css) && css.style) {
                        var style = css.style, selectFileObj;
                        style.uploadDiv && $panel.css(style.uploadDiv);
                        if (style.selectFile) {
                            selectFileObj = JSON.parse(JSON.stringify(style.selectFile));
                            $chooseBtn.css('cssText', 'border-color:' + selectFileObj['border-color'] + '!important;');
                            $chooseBtn.css($.extend({}, style.selectFile, {'border-color': selectFileObj['border-color'] + '!important'}))
                                .prev('i').css('color', selectFileObj['color']);

                            $AW.cssHover('.filesList span.fileName a', $panel, {'color': selectFileObj['color']}, '');
                        }
                        style.uploadFile && $uploadBtn.css(style.uploadFile);
                        style.line && $listDiv.css(style.line);
                    }
                },
                isContainFile = function (filesList, file) {
                    var isContain = false;
                    if (filesList.length > 0) {
                        $.each(filesList, function (index, item) {
                            if (item.name === file.name && item.type === file.type && item.size === file.size) {
                                isContain = true;
                                return isContain;
                            }
                        });
                    } else {
                        $uploadBtn.parent().css("display", "none");
                    }
                    return isContain;
                },
                setFilesNum = function (fileNumSpan, filesList) {

                    fileNumSpan.text(filesList.length);
                };

            formOption = formOption || {};
            //i18n
            if (auiCtx) {
                tips = $AW.nsl(tips, $selector.attr('id'), auiCtx);
                template = template.replace(/_label_/g, $AW.nsl(option.label, $selector.attr('id'), auiCtx) || "")
                    .replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
            }

            if (isInline) {
                $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                    template,
                    labelSpan,
                    labelAlign,
                    auiCtx,
                    "aweb4foundationUploadButton",
                    attr);
                attr.id && $selector.attr('id', attr.id);
            } else {
                $selector.append(template);
                widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
            }

            init();

            //出参
            return {
                cleanFile: function () {
                    /*    $input.replaceWith(
                            $input
                                .val('')
                                .clone(true)
                        );
                        $input =  $selector.find('input[type="file"]');*/
                    $input.val('');
                },
                resetValue: function () {
                    $input.val('');
                    filesList = [];
                    $input.trigger('change');
                },
                upload: function (url, uploadConfig) {
                    var validateResult, items, item,
                        queryString = {},
                        urlExternal = [],
                        urlDivider,
                        valiData,
                        data = []
                    ;
                    uploadConfig = $.extend(true, {}, uploadConfig, option.unloadConfig, option.uploadConfig);
                    if (filesList.length > 0) {
                        if (uploadConfig.tips) {
                            app.shelter.show(uploadConfig.tips || "正在上传");
                        }

//						for (var i = 0; i < filesList.length; i++) {
                        var xhr = false;
                        try {
                            xhr = new XMLHttpRequest();//尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
                        } catch (e) {
                            xhr = ActiveXobject("Msxml12.XMLHTTP");//使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
                        }

                        xhr.open("post", url, true);
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                        var formData = new FormData();

                        for (var i = 0; i < filesList.length; i++) {
                            formData.append(attr.name || "file", filesList[i]);
                        }

                        formData.append("ctoken", window.ctoken);
                        if ((validateResult = app.validate(uploadConfig.data,
                            uploadConfig.validateSuccessCallback,
                            uploadConfig.validateErrorCallback,
                            uploadConfig.validateCleanCallback,
                            uploadConfig.validateContinue,
                            uploadConfig.validate)) && validateResult.result) {

                            validateResult.data = validateResult.data || [];

                            //自定义属性
                            //shelter
                            if (!uploadConfig.tips) {
                                uploadConfig.timeout = $.isNumeric(uploadConfig.timeout) ? uploadConfig.timeout : 3e4;
                                if (uploadConfig.shelter) {
                                    app.shelter.show(uploadConfig.shelter === true ? null : uploadConfig.shelter, uploadConfig.timeout);
                                }
                            }


                            //process data
                            if ($.isArray(validateResult.data)) {
                                for (items = validateResult.data, i = items.length; item = items[--i];) {
                                    if (item.queryString) {
                                        queryString[item.name] = item.value;
                                    } else if (item.urlExternal) {
                                        urlExternal.push(item.value);
                                    } else {
                                        var obj = {};
                                        obj[item.name] = item.value;
                                        data.push(obj);
                                    }
                                }
                            }

                            valiData = data;

                            for (var i = 0; i < data.length; i++) {
                                var item = data [i];
                                for (var key in item) {
                                    if (item.hasOwnProperty(key)) {
                                        formData.append(key, item[key]);

                                    }
                                }
                            }


                            xhr.onreadystatechange = function (uploadConfig, file) {
                                return function () {
                                    if (this.readyState === 4) {

                                        app.shelter.hide();

                                        try {
                                            var resp = JSON.parse(this.responseText);
                                            if (this.status === 200) {
                                                uploadConfig.callback && uploadConfig.callback(resp, file);
                                                //上传成功，清空文件列表;
                                                $listDiv.children().remove();
                                                $listDiv.removeClass('has-files');
                                                $uploadBtn.parent().css("display", "none");
                                                $errormsg.css('display', 'none');
                                                $fileNumSpan.text(0);
                                                $errormsg.css('display', 'none');
                                                filesList = [];
                                            } else {
                                                app.alert("上传失败" + this.resp.errorMsg, app.alert.ERROR);
                                            }
                                        } catch (e) {
                                            app.alert('上传失败 ' + e, app.alert.ERROR);
                                            console.error(e);
                                        }
                                    }
                                }
                            }(uploadConfig, filesList);

                            xhr.send(formData);
                        } else {
                            app.shelter.hide();
                        }
//						}

                    } else {
                        app.alert("当前文件列表为空,请选择文件后再进行上传操作");
                    }
                },

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
                mustInput: function (flag) {
                    var $label = $('[title="'+option.label+'"]',$selector);

                    $label.empty();
                    if(flag === true){
                        $label.html(option.label+mustInputTemp)
                    }else{
                        $label.html(option.label)
                    }
                }

            }
        }

        if (!widget.component.foundationForm) {
            widget.component.foundationForm = {};
        }
        widget.component.foundationForm.foundationUploadButton = function ($selector, oOption, oAttr, oCss, auiCtx) {

            var
                formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')];

            return renderFileUploader($selector, oOption, oAttr, oCss, formOption, auiCtx);
        };


        return widget;
    });
})();