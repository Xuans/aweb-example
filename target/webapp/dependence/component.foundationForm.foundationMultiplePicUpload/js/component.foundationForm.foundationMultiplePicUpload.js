/*!
 * Javascript library v3.0
 *
 * Date: 2016.04.21
 */

/**
 * @author zhanghaixian@agree.com.cn
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

            function render($selector, option,  attr,css, formOption, auiCtx) {


                var pickId = "filUpload" + app.getUID(),
                    temp = $AW.nsl('点击上传图片', attr.id, auiCtx),
                    mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
                    horizontalTemp = '<label title="_label_">_label__mustInput_</label>' +
                        '<ul class="upload-ul clearfix">' +
                        '<li class="upload-pick"><div class="webuploader-container clearfix" id="' + pickId + '">' +
                        '<div class="upload-pick-content"><i class="fa fa-plus-circle"></i><div class="upload-tip-title">' + temp + '</div><div class="upload-tip">_uploadTip_</div></div>' +
                        '<div class="upload-fack" style="">' +
                        '<input type="file"  class="webuploader-element-invisible"  data-role="fileInput" multiple="multiple"  >' +
                        '<label class="upload-label"></label>' +
                        '</div></div></li>' +
                        '</ul>',
                    inlineTemp = '<div class="columns">' +
                        '<label for="middle-label" class="text-right middle" title="_label_">_label__mustInput_</label>' +
                        '</div>' +
                        '<div class="columns">' +
                        '<ul class="upload-ul clearfix">' +
                        '<li class="upload-pick"><div class="webuploader-container clearfix" id="' + pickId + '">' +
                        '<div class="upload-pick-content"><i class="fa fa-plus-circle"></i><div class="upload-tip-title">' + temp + '</div><div class="upload-tip">_uploadTip_</div></div>' +
                        '<div  class="upload-fack" >' +
                        '<input type="file" class="webuploader-element-invisible" data-role="fileInput" multiple="multiple">' +
                        '<label class="upload-label"></label>' +
                        '</div></div></li>' +
                        '</ul>' +
                        '</div>',

                    iconAppended = false,
                    $input,
                    $pick,
                    isFirst = true,
                    returnValue,
                    isInline = formOption.formLayout === 'inline',
                    labelAlign = option.labelAlign || formOption.labelAlign,
                    template = isInline ? inlineTemp : horizontalTemp,
                    span = option.span || formOption.span,
                    labelSpan = option.labelSpan || formOption.labelSpan,
                    allFileMap = {},
                    filecNum = 1,
                    context = {},


                    //初始化
                    init = function () {
                        var $el, $clone,
                            id,
                            events = auiCtx.delegateEvents, i, eventParams, eventType, eventSelector,
                            callback = {};

                        $input = $selector.find('input[data-role="fileInput"]');

                        $pick = $('#' + pickId, $selector);

                        $input.attr({
                            id: attr.name,
                            name: attr.name,
                            placeholder: option.placeholder || '请选择上传文件',
                            accept: option.accept || ''
                        });
                        $input.removeAttr('value');


                        if (!isFirst) {
                            id = attr.id;
                            $el = auiCtx.$el;
                            for (i in events) {
                                if (events.hasOwnProperty(i) && i.indexOf('#' + id) !== -1 && i.indexOf('fileInput') !== -1) {
                                        eventParams = i.split(' ');
                                        eventType = eventParams[0];
                                        eventSelector = eventParams.slice(1).join(' ');

                                        if (($clone = $(eventSelector, $el)).is($input)) {
                                            callback[eventType] = events[i];
                                        }
                                }
                            }
                        }



                        $input
                            .off('.multiple')
                            .on(
                                'change.multiple',
                                function (e) {
                                    if (e.target.files[0]
                                        && validateFile(e.target.files[0])) {
                                        var file = {
                                            id: 'file' + app.getUID(),
                                            data: e.target.files[0]
                                        };
                                        allFileMap[file.id] = file;
                                        context.file = file.data;
                                        filecNum++;
                                        createBox($pick, file);
                                    }
                                });

                        if (!isFirst) {
                            $input.on(callback);
                        } else {
                            isFirst = false;
                        }

                        $pick.off('.selectFile').on('click.selectFile',
                            function (e) {
                                $input.trigger('click.event');
                            });

                        option.disabled && $input.attr('disabled', option.disabled);
                        //自定义样式
                        if (css && css.cssCode && css.cssCode.className) {
                            $selector.addClass(css.cssCode.className)
                        }

                    },
                    //获取文件的值
                    getFiles = function () {
                        var item, files = [];
                        for (item in allFileMap) {
                            if(allFileMap.hasOwnProperty(item)){
                                files.push(allFileMap[item].data);

                            }

                        }
                        return files;
                    },
                    //重置文件值
                    resetValue = function () {
                        $input.val('');
                        allFileMap = {};
                        filecNum = 1;
                        $('ul li:gt(0)', $selector).remove();
                    },
                    //操作进度条;
                    showProgress = function (progress, $diyBar, text) {
                        var $diyProgress;
                        if (progress >= 100) {
                            progress = progress + '%';
                            text = text ||  $AW.nsl('上传完成', attr.id, auiCtx);
                        } else {
                            progress = progress + '%';
                            text = text || progress;
                        }

                        $diyProgress = $diyBar.find('.diyProgress');
                        $diyProgress.width(progress).text(text);
                    },
                    //检验图片文件是否合格
                    validateFile = function (file) {
                        var fileType, item,
                            typeArr = option.accept.split(',');

                        if (file.type.split("/")[0] !== 'image') {
                            fileType = file.name.split(".").pop();
                        } else {
                            fileType = file.type.split("/")[1];
                        }

                        if ($.inArray(fileType, typeArr) < 0) {
                            app.alert( $AW.nsl('文件类型不正确！', attr.id, auiCtx));
                            return false;
                        }

                        if (filecNum > option.numLimit) {
                            app.alert( $AW.nsl('上传文件数量超过限制！', attr.id, auiCtx));
                            return false;
                        }
                        if (file.size > (option.sizeLimit * 1024 * 1024)) {
                            app.alert($AW.nsl('文件大小超过限制!', attr.id, auiCtx));
                            return false;
                        }
                        for (item in allFileMap) {
                                if (allFileMap.hasOwnProperty(item) && allFileMap[item].data.name === file.name) {
                                    app.alert( $AW.nsl('该文件已经被选择了！', attr.id, auiCtx));
                                    return false;
                                }

                        }

                        return true;
                    },
                    //创建文件操作div;
                    createBox = function ($fileInput, file) {
                        var file_id = file.id,
                            $parentFileBox = $fileInput.parents(".upload-ul"),
                            file_len = $parentFileBox.children(".diyUploadHover").length,
                            li, $fileBox, reader;

                        //添加子容器;
                        li = '<li id="fileBox_' + file_id + '" class="diyUploadHover"> ' +
                            '<div class="viewThumb">' +
                            '<input type="hidden">' +
                            '<div class="diyBar">' +
                            '<div class="diyProgress">0%</div>' +
                            '</div>' +
                            '<p class="diyControl"><span class="diyCancel"><i></i></span></p>' +
                            '</div>' +
                            '</li>';

                        $parentFileBox.append(li);


                        $fileBox = $parentFileBox.find('#fileBox_' + file_id);

                        //绑定取消事件;
                        $fileBox.find('.diyCancel').one('click', function () {
                            removeLi($(this).parents('.diyUploadHover'), file_id);
                        });
                        if (!file.data.name) {
                            $fileBox.find('.viewThumb').append(
                                '<img src="' + file.data.src + '" >');
                        } else {
                            // 生成预览缩略图;
                            reader = new FileReader();
                            reader.onload = (function (file) {
                                return function (e) {
                                    $fileBox.find('.viewThumb').append(
                                        '<img src="' + this.result + '" >');
                                };
                            })(file.data);
                            reader.readAsDataURL(file.data);
                        }
                    },
                    //取消事件;
                    removeLi = function ($li, file_id) {
                        var i, item, files = $input[0].files;
                        /* $input.after($input.clone().val(""));
                         $input.remove();*/
                        $input.val("");
                        delete allFileMap[file_id];
                        filecNum--;
                        $li.remove();
                    };


                //i18n
                if (auiCtx) {
                    template = template
                        .replace(/_label_/g, $AW.nsl(option.label, $selector.attr('id'), auiCtx) || "")
                        .replace(/_mustInput_/, option.mustInput ? mustInputTemp : "")
                        .replace(/_uploadTip_/, $AW.nsl(option.uploadTip, $selector.attr('id'), auiCtx) || "");
                }


                    if (isInline) {
                        $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                            template,
                            labelSpan,
                            labelAlign,
                            auiCtx,
                            "aweb4foundationMultiplePicUpload",
                            attr);

                        attr.id && $selector.attr('id', attr.id);
                    } else {
                        $selector.append(template);
                        widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
                    }

                    //初始化
                    init();


                returnValue = {
                    getValue: getFiles,
                    resetValue: resetValue,

                    // 一个行为类型方法的 实现
                    display: function (result, input1, input2, condition) {
                        this[result ? 'hide' : 'show']();
                    },

                    show: function () {
                        $selector.removeClass('hide');
                        isInline && $selector.prev(".columns").removeClass('hide');
                    },

                    hide: function () {
                        $selector.addClass('hide');
                        isInline && $selector.prev(".columns").addClass('hide');
                    },
                    disabled: function (value) {
                        if (value) {
                            $input.prop('disabled', true);
                            $pick.addClass('disabled-pick')
                        } else {
                            $input.prop('disabled', false);
                            $pick.removeClass('disabled-pick');
                        }
                        // value ? $input.prop('disabled',true):$input.prop('disabled',false);
                    },
                    refresh: function (data) {
                        var i, item, file;
                        for (i = -1; item = data[++i];) {
                            file = {
                                id: item.id,
                                data: {
                                    id: item.id,
                                    src: item.src
                                }
                            };
                            allFileMap[item.id] = file;
                            createBox($pick, file);
                        }
                    },

                    isEmpty: function (value) {
                        var ret = {
                            value: value
                        };

                        if (!(ret.result = !!$input.val())) {
                            ret.errorMsg = $AW.nsl('上传文件不能为空', attr.id, auiCtx);
                        }

                        return ret;
                    },
                    mustInput: function (flag) {
                        var $label = $('[title="'+option.label+'"]',$selector);

                        $label.empty();
                        if(flag === true){
                            $label.html(option.label+mustInputTemp)
                        }else{
                            $label.html(option.label)
                        }
                    },

                    upload: function (url, uploadConfig) {
                        var filesList = returnValue.getValue(),i,xhr,formData,requestData,key;

                        if (filesList.length > 0) {
                            app.shelter.show((uploadConfig && uploadConfig.tips) || "正在上传");
                            //						for (var i = 0; i < filesList.length; i++) {
                             xhr = false;
                            try {
                                xhr = new XMLHttpRequest();//尝试创建 XMLHttpRequest 对象，除 IE 外的浏览器都支持这个方法。
                            } catch (e) {
                                xhr = ActiveXobject("Msxml12.XMLHTTP");//使用较新版本的 IE 创建 IE 兼容的对象（Msxml2.XMLHTTP）。
                            }

                            xhr.open("post", url, true);
                            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

                             formData = new FormData();

                            for ( i = 0; i < filesList.length; i++) {
                                formData.append(attr.name || "file", filesList[i]);
                            }

                            formData.append("ctoken", window.ctoken);

                            if (uploadConfig && uploadConfig.data) {
                                requestData = uploadConfig.data;
                                for (key in requestData) {
                                    if(requestData.hasOwnProperty(key)){
                                        formData.append(key, requestData[key]);

                                    }
                                }
                            }

                            xhr.onreadystatechange = function (uploadConfig, file) {
                                return function () {
                                    if (this.readyState === 4) {
                                        try {
                                            var resp = JSON.parse(this.responseText);
                                            if (this.status === 200) {
                                                uploadConfig.callback && uploadConfig.callback(resp, file);
                                                //上传成功，清空文件列表;
                                                $input.val('');
                                                filesList = [];
                                            } else {
                                                app.alert("上传失败" + this.resp.errorMsg, app.alert.ERROR);
                                            }
                                        } catch (e) {
                                            app.alert('上传失败 ' + e, app.alert.ERROR);
                                        }
                                    }
                                }
                            }(uploadConfig, context.file);

                            xhr.send(formData);
                            //						}
                            app.shelter.hide();
                        } else {
                            app.alert("当前文件列表为空,请选择文件后再进行上传操作");
                        }
                    },
                    getPicWidthHeight: function () {
                        var $img = $("img",$selector),
                            imgLength = $img.length,
                            i,img_url,arr = [],img;

                        for(i = 0;i < imgLength;i++){
                            img_url = $img.eq(i).attr("src");
                            img = new Image();
                            img.src = img_url;

                            if(img.complete){
                                arr.push({
                                    width: img.width,
                                    height: img.height
                                })
                            }else{
                            // 加载完成执行
                                img.onload = function(){
                                    arr.push({
                                        width: img.width,
                                        height: img.height
                                    })
                                };
                            }
                        }
                        return arr;
                    }


                };
                return returnValue;
            }

            if (!widget.component.foundationForm) {
                widget.component.foundationForm = {};
            }
            widget.component.foundationForm.foundationMultiplePicUpload = function ($selector, oOption, oAttr, oCss, auiCtx) {
                var

                formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};

                return render( $selector, oOption, oAttr,oCss, formOption, auiCtx);
            };

            return widget;
        });
})();