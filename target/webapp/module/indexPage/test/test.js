define([].concat(window.aweb.transformJsConfig(["ctn","ctn.divCtn","component.img"])).concat(window.aweb.transformCssConfig(["AUI/css/layout.ctn.css"])),function(){return (function() {
    return function() {
        return function(auiCtx) {
            "use strict";
            var $el, handler, scope, spaLifecycle;
            "IDETAG";
            "IDETAG";
            "CUSTOM_CODE";
            if (!spaLifecycle) {
                spaLifecycle = {
                    load: function(_$el, _scope, _handler) {
                        auiCtx.pageParams = $.extend(true, _scope, app.domain.get("page"));
                        auiCtx.context = this;
                        $el = _$el, handler = _handler, scope = _scope;
                        /*覆盖页面加载时的属性或方法*/
                        /*覆盖auiCtx属性或方法 */
                        auiCtx.auiCtxLoad.call(this, auiCtx, _$el, _scope, _handler);
                        /*事件绑定*/
                        this.delegateEvents.call(this, auiCtx.delegateEvents);
                    },
                    resume: function($el, scope, handler) {
                        /*覆盖页面恢复时的属性或方法*/
                        auiCtx.auiCtxResume.call(this, auiCtx, $el, scope, handler);
                    },
                    pause: function($el, scope, handler) {
                        /*覆盖页面切出时的属性或方法*/
                        auiCtx.auiCtxPause.call(this, auiCtx, $el, scope, handler);
                    },
                    unload: function($el, scope, handler) {
                        /*覆盖页面销毁时的属性或方法*/
                        auiCtx.auiCtxUnload.call(this, auiCtx, $el, scope, handler);
                    }
                };
            }
            return spaLifecycle;
        }(function() {
            var auiCtx, $el, scope, handler, g_globalParams = aweb.globalVariables, pageParams;
            auiCtx = {
                external: {},
                attr: {
                    divCtn1: {
                        id: "divCtn1",
                        widgetName: "普通容器1",
                        desp: "普通容器1",
                        "data-authority": "10"
                    },
                    img2: {
                        id: "img2",
                        widgetName: "图片2",
                        desp: "图片2"
                    }
                },
                css: {},
                configs: {
                    divCtn1: {
                        header: "",
                        collapse: false,
                        titleInfo: {
                            edmID: "19585F24DA2AFFBB5C58-7AF2",
                            edmKey: "",
                            fields: [],
                            keys: []
                        },
                        infoPosition: "right",
                        packupBtn: false,
                        pickupHeight: ""
                    },
                    img2: {
                        src: "./img/4B6094FF79C56B337B06-B69D.png",
                        alt: ""
                    }
                },
                pageNSL: [],
                widgetNSL: {},
                validations: {},
                lifecycle: {},
                variables: {},
                ajaxOption: {},
                eventCallback: {},
                delegateEvents: {},
                widgetLoadedEvents: {},
                intervals: {},
                auiCtxLoad: function(auiCtx, _$el, _scope, _handler) {
                    var configs = auiCtx.configs, attr = auiCtx.attr, css = auiCtx.css, variables = auiCtx.variables;
                    $el = _$el;
                    pageParams = scope = _scope;
                    handler = _handler;
                    auiCtx.$el = _$el;
                    auiCtx.scope = _scope;
                    auiCtx.handler = _handler;
                    handler.auiCtx = auiCtx;
                    variables.divCtn1 = $AW.ctn.divCtn($("#divCtn1", $el), configs.divCtn1, attr.divCtn1, $AW.css("ctn.divCtn", css.divCtn1), auiCtx);
                    variables.img2 = $AW.component.img($("#img2", $el), configs.img2, attr.img2, $AW.css("component.img", css.img2), auiCtx);
                },
                auiCtxResume: function(auiCtx, $el, scope, handler) {},
                auiCtxPause: function(auiCtx, $el, scope, handler) {},
                auiCtxUnload: function(auiCtx, $el, scope, handler) {}
            };
            window.aweb && window.aweb.debug && (window.auiCtx = auiCtx);
            return auiCtx;
        }());
    };
});});