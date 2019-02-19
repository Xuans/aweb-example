/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.04.03
 */
(/* <global> */ function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "wangEditor", 'component.foundationForm'], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, wangEditor) {
        "use strict";

        function render($selector, option, css, attr, formOption, auiCtx, oWidget) {
            formOption = formOption || {};
            var mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
                initTemp = oWidget && oWidget.nsl('请输入内容') || $AW.nsl('请输入内容', attr.id, auiCtx),
                horizontalTemp = '<label title="_label_">_label__mustInput_</label><div class="editor-trigger"><p>' + initTemp + '</p></div>',
                inlineTemp = "<div class='columns'>" +
                    "<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
                    "</div>" +
                    "<div class='columns'>" +
                    "<div class='editor-trigger'><p>" + initTemp + "</p></div>" +
                    "</div>",
                isInline = formOption.formLayout === 'inline',
                labelAlign = option.labelAlign || formOption.labelAlign,
                template = isInline ? inlineTemp : horizontalTemp,
                span = option.span || formOption.span,
                labelSpan = option.labelSpan || formOption.labelSpan,
                uid = app.getUID(),
                $editorTrg, style;

            // $selector.attr("id", attr.id || '');
            //i18n
            if (auiCtx) {
                template = template
                    .replace(/_label_/g, $AW.nsl(option.label, $selector.attr('id'), auiCtx) || "")
                    .replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
            } else {
                template = template
                    .replace(/_label_/g, oWidget.nsl(option.label) || "");
            }

            if (isInline) {
                $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                    template,
                    labelSpan,
                    labelAlign,
                    auiCtx,
                    "aweb4FoundationWangEditor",
                    attr);

            } else {
                $selector.append(template);
                widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
            }


            $editorTrg = $selector.find('div.editor-trigger');

            $editorTrg.attr('id', uid);

            attr.name && $editorTrg.attr('name', attr.name);
            var editor = new wangEditor(uid);

            editor.config.uploadImgUrl = option.url;
            editor.config.uploadImgFileName = attr.name;

            editor.config.uploadImgFns.onload = function (editor, resultText, xhr) {
                // resultText 服务器端返回的text
                // xhr 是 xmlHttpRequest 对象，IE8、9中不支持

                // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
                var originalName = editor.uploadImgOriginalName || '';
                // alert(resultText);
                resultText = JSON.parse(resultText);
                if (resultText.status) {
                    editor.command(null, 'insertHtml', '<img src="' + resultText.content.result + '" alt="' + originalName + '" style="max-width:100%;"/>');
                } else if (resultText.errorMsg) {
                    app.alert(resultText.errorMsg, app.alert.ERROR);
                }
                // 如果 resultText 是图片的url地址，可以这样插入图片：

                // 如果不想要 img 的 max-width 样式，也可以这样插入：
                // editor.command(null, 'InsertImage', resultText);
            };


            editor.create();

            //自定义样式
            if (css && css.cssCode && css.cssCode.className) {
                $selector.addClass(css.cssCode.className)
            }
            if (css && (style = css.style)) {
                style.title && $selector.find('label').css(style.title);
                style.item && $('.menu-item.clearfix', $selector).css(style.item);
                style.itemHover && $AW.cssHover('.wangEditor-menu-container .menu-item', $selector, style.itemHover, ':hover');
                style.itemActive && $AW.cssHover('.wangEditor-menu-container div.menu-item .selected', $selector, style.itemActive, '');
                style.itemDefault && $('.wangEditor-menu-container .menu-item', $selector).css(style.itemDefault);
                style.editor && $('.wangEditor-container', $selector).css(style.editor);
                style.border && $('.wangEditor-container .wangEditor-txt', $selector).css(style.border);

            }
            // $.extend(true, returnValue, editorCreate);
            return editor;
        }

        if (!widget.component.foundationForm) {
            widget.component.foundationForm = {};
        }
        widget.component.foundationForm.foundationWangEditor = function (obj, oOption, oAttr, oCss, auiCtx) {
            var oWidget, $widget, $selector, formOption, isInline;

            formOption = auiCtx.configs[obj.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')] || {};
            isInline = formOption.formLayout === 'inline';

            $selector = obj;

            /*编译阶段渲染代码*/
            var editor = render($selector, oOption, oCss, oAttr, formOption, auiCtx);

            var returnValue = {
                getData: function () {
                    return encodeURIComponent(editor.$txt.html());
                },
                getText: function () {
                    return editor.$txt.text();
                },
                getFormatText: function () {
                    return editor.$txt.formatText();
                },
                setData: function (value) {
                    editor.$txt.html(decodeURIComponent(value));
                },
                resetValue: function () {
                    editor.$txt.html(decodeURIComponent(''));
                },
                disabled: function (value) {
                    value ? editor.disable() : editor.enable();
                },
                setText: function (value) {
                    editor.$txt.text(decodeURIComponent(value));
                },
                reset: function () {
                    editor.$txt.html('');
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
                getTrimValue: function () {
                    return $.trim(returnValue.getText())
                },
                focus: function () {
                    editor.$txt.trigger('focus');
                },
                mustInput: function (flag) {
                    var $label = $('[title="'+oOption.label+'"]',$selector),
                        mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>';

                    $label.empty();
                    if(flag === true){
                        $label.html(oOption.label+mustInputTemp)
                    }else{
                        $label.html(oOption.label)
                    }
                }
            };
            return returnValue;
        };


        return widget;
    });
})();