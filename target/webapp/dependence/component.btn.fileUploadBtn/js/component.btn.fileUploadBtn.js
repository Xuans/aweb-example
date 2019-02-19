(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "fileUpload"], factory);
        }
        // global
        else {
            factory();
        }

    })
    
    (function ($, widget) {
            "use strict";

            function FileUpload($el, option, attr, auiCtx, css) {
                /*
                 * option:{
                 *   tips:鼠标移动到当前位置时显示的信息
                 *   accept:''，接受文件类型
                 *   canEditName:可以编辑文件名,
                 *   changeCallback     //发生改变时的callback
                 * }
                 * */

                var $parent,
                    $input = $el.find('input[type=file]'),
                    $next, $title,
                    id = $input.attr('id'),
                    html, left,
                    extensionName,
                    change = function (e) {
                        var $el = $(this),
                            name = $el.val(),
                            accept = '(' + ($el.prop('accept') || '').replace(/\s/g, '').split(',').join('|') + ')'.replace(/\./g, '\\\\\\\\.');
                        if (name) {

                            try {
                                name = name.match(new RegExp('([^\\\\/]+)' + accept + '$'));
                            } catch (e) {
                                app.alert('上传类型格式错误！', app.alert.ERROR);
                            }
                            extensionName = name && name[2] || '';
                            name = name && name[1] || '';

                            //i18n
                            if (auiCtx) {
                                name = $AW.nsl(name, $el.attr('id'), auiCtx);
                                option.tips = $AW.nsl(option.tips, $el.attr('id'), auiCtx);
                            }
                            $title.children('span').text(name);
                            $title.children('i').removeClass('hide');
                            $parent.attr('title', name);

                            if (accept && !name) {
                                app.alert('上传文件格式不为“' + accept + '”！', app.alert.ERROR);
                            }

                            option.changeCallback && option.changeCallback.call(this, e);

                        } else {
                            $title.children('span').text('');
                            $title.children('i').addClass('hide');
                            if (auiCtx) {

                                option.tips = $AW.nsl(option.tips, $el.attr('id'), auiCtx);
                            }
                            $parent.attr('title', option.tips);
                        }
                    };

                $el.removeAttr('name');
                $input.attr('name', attr.name);
                $('p>button', $el).addClass('file-upload-btn');
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
                }, option);


                if (!($parent = $input.parent('.aweb3_5-fileUploadBtn')).length) { //避免同一对象重复添加
                    html =
                        [
                            '<i class="fa fa-cloud-upload"></i>',
                            '<div class="aweb3_5-fileUploadBtn-title">',
                            '<span>' +  $AW.nsl('没有选中文件', $el.attr('id'), auiCtx) + '</span>',
                            (option.canEditName ? '<input type="text" class="hide text-left"/>&nbsp;<i class="fa fa-edit hide"></i>' : ''),
                            '</div>'
                        ].join('');


                    $input.addClass('aweb3_5-fileUploadBtn-input').wrap('<div class="aweb3_5-fileUploadBtn"></div>');

                    $parent = $input.parent();
                    //i18n
                    if (auiCtx) {

                        option.tips = $AW.nsl(option.tips, $el.attr('id'), auiCtx);
                    }
                    $parent.attr('title', option.tips);
                    $parent.append(html);

                    $next = $input.next();

                    //标题绑定事件
                    $title = $parent.children('.aweb3_5-fileUploadBtn-title');
                    $title.children('i')
                        .on('click.aweb3_5', function () {
                            $title.children('i').addClass('hide');

                            $title.children('input')
                                .removeClass('hide')
                                .val($title.children('span').addClass('hide').text());

                            $title.children('input').focus();
                        });

                    $title.children('input')
                        .on('blur.aweb3_5', function () {
                            $title.children('i').removeClass('hide');

                            $title.children('span')
                                .removeClass('hide')
                                .text($(this).addClass('hide').val());

                            $parent.attr('title', $(this).val());
                        });

                    //上传文件改变
                    $input.on('change.aweb3_5', change);
                } else {
                    $next = $input.next();

                    $parent.find('.fa-edit')[option.canEditName ? 'removeClass' : 'addClass']('hide');
                }
                $parent.addClass('bootstrap-upload');

                left = ($parent.width() - $next.width()) / 2 || 0;
                if (auiCtx) {
                    $el.find('[data-role="uploadBtn"]').text($AW.nsl(option.name, $el.attr('id'), auiCtx));
                }

                //自定义样式
                if (css && css.cssCode && css.cssCode.className) {
                    $parent.addClass(css.cssCode.className)
                }
                if (!id) {
                    id = app.getUID();
                    $input.prop('id', id);
                }
                $input.prop('accept', option.accept);
                $input.css({
                    height: '100%',
                    width: '100%',
                    zIndex: 3,
                    position: 'relative',
                    left: 0,
                    top: 50,
                    opacity: 0
                });



                return {
                    getName: function () {
                        return $title.children('span').text();
                    },
                    getExtensionName: function () {
                        return extensionName;
                    },
                    upload: function upload(url, uploadConfig) {
                        var _option = $.extend(true, {}, uploadConfig, option.unloadConfig, option.uploadConfig);

                        _option.data = $.extend(true, {}, _option.data, {
                            name: this.getName()
                        });

                        if (url && $.ajaxFileUpload) {
                            app.shelter.show(_option.tips);
                            $.ajaxFileUpload({
                                url: url,
                                fileElementId: id,
                                secureuri: _option.secureuri,
                                type: 'post',
                                data: _option.data,
                                dataType: 'json',
                                success: function (data) {
                                    app.shelter.hide();

                                    $input = $parent.children('#' + id);
                                    $input.prop('accept', option.accept);
                                    $input.on('change.aweb3_5', change);

                                    _option.callback && _option.callback(data);
                                },
                                error: function (xhr, status, errMsg) {
                                    app.shelter.hide();
                                    app.alert(errMsg, app.alert.ERROR, _option.title);
                                }
                            });
                            return true;
                        } else {
                            return false;
                        }
                    },
                    destroy: function () {
                        $parent.children(':not(:input)').remove();
                        $el.unwrap()
                            .removeClass('aweb3_5-fileUploadBtn-input')
                            .off('.aweb3_5')
                            .val('')
                            .css({
                                height: '',
                                width: '',
                                opacity: '',
                                'margin-left': ''
                            });
                        $el = null, $parent = null, $title = null;
                    }
                }
            }

            if (!widget.component.btn) {
                widget.component.btn = {};
            }

            widget.component.btn.fileUploadBtn = function (obj, oOption, oAttr, oCss, auiCtx) {
                var  $widget, option, attr, css, fileUploadIns, action;

                $widget = obj;
                option = oOption;
                attr = oAttr;
                css = oCss;
                fileUploadIns = FileUpload($widget, option, attr, auiCtx, css);

                action = {
                    display: function (result, input1, input2, condition) {
                        this[result ? 'hide' : 'show']();
                    },
                    show: function () {
                        obj.removeClass('hide');
                    },
                    hide: function () {
                        obj.addClass('hide');
                    }
                };

                //return fileUpload($widget, option, attr);
                return $.extend(true, action, fileUploadIns);
            };

            return widget;
    });
})();