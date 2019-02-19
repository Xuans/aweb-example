(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget","template"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget,artTemplate) {
        "use strict";

        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model
            context.$view = $widget;
            context.option=$.extend(true,{},context.setting,option);
            context.attr = attr;
            context.css = css;
            context.pageContext = auiCtx;
            context.render = artTemplate.compile(context.option.content);

            //View Model
            context.viewCache = {};

            //初始化
            context._init();

            //渲染样式
            context._render();
        };

        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'your name',

            debug: window.auiApp && window.auiApp.debug,

            //常量表
            //constant:{},
            setting: {
                tagName:'div',
                attr:[],
                content:''
            },
            

            //初始化（私有）
            _init: function () {
                var $view=this.$view,
                    $widget,
                    contentHtml,
                    option = this.option,
                    attrs=option.attrs,
                    i, attr, map = {},
                    render = this.render;

                //tag name
                $widget = $('<' + option.tagName+'/>');

               if(attrs){
                   //attr
                   for(i=attrs.length;attr=attrs[--i];){
                       map[attr.name]=attr.value;
                   }
               }

                map['data-widget-type']=$view.attr('data-widget-type');
                map.id=this.attr.id;

                $widget.attr(map);

                if( option.content){
                    contentHtml= render({});
                    //content
                    $widget.append(contentHtml);
                }

                //replace with
                $view.replaceWith($widget);

                this.$view=$widget;
            },
            artTemplate: function(data){
                var $widget = this.$view,
                    option =this.option,
                    contentHtml,
                    render = this.render;
                
                contentHtml = render(data);
                $widget.empty().append(contentHtml);

            },


            //渲染主题、样式（私有）
            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    cssCode,
                    className,
                    style;

                if (css) {

                    //样式解析机制
                    if (style = css.style) {
                        style.content && this.$view.css(style.content);

                        // Hate Love  --> hover\active\link\visited\before\afrer
                        style.contentFocus && $AW.cssHover('', this.$view, style.contentFocus, ':focus');
                        style.contentHover && $AW.cssHover('', this.$view, style.contentHover, ':hover');
                        style.contentActive && $AW.cssHover('', this.$view, style.contentActive, ':active');

                        style.contentLink && $AW.cssHover('', this.$view, style.contentLink, ':link');
                        style.contentVisted && $AW.cssHover('', this.$view, style.contentVisted, ':visited');
                        style.contentBefore && $AW.cssHover('', this.$view, style.contentBefore, '::before');
                        style.contentAfter && $AW.cssHover('', this.$view, style.contentAfter, '::after');

                    }

                    //自定义样式
                    if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                        this.$view.addClass(className);
                    }
                }
            },
            destroy: function () {
                this.$view.off().empty();
            },
            behavior: function (result, input1, input2, condition) {
                this[result ? 'hide' : 'show']();
            },
            show: function () {
                this.$view.removeClass('hide');
            },

            hide: function () {
                this.$view.addClass('hide');
            },
        };

        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        widget.component.htmlTag = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();