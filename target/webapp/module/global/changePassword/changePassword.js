define([].concat(window.aweb.transformJsConfig(["component.btn.normalBtn","component.foundationForm","component.foundationForm.foundationPassword","ctn.foundationRowCtn","ctn","ctn.foundationFormCtn"])).concat(window.aweb.transformCssConfig(["AUI/css/component.btn.css","foundation/css/foundation.css","AUI/css/layout.ctn.css"])),function(){return (function() {
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
                    foundationFormCtn8: {
                        desp: "Foundation表单容器8",
                        widgetName: "Foundation表单容器8",
                        name: "",
                        id: "foundationFormCtn8"
                    },
                    foundationRowCtn9: {
                        desp: "Foundation表单行容器9",
                        widgetName: "Foundation表单行容器9",
                        name: "",
                        id: "foundationRowCtn9"
                    },
                    foundationRowCtn10: {
                        desp: "Foundation表单行容器10",
                        widgetName: "Foundation表单行容器10",
                        name: "",
                        id: "foundationRowCtn10"
                    },
                    foundationRowCtn11: {
                        desp: "Foundation表单行容器11",
                        widgetName: "Foundation表单行容器11",
                        name: "",
                        id: "foundationRowCtn11"
                    },
                    foundationRowCtn12: {
                        desp: "Foundation表单行容器12",
                        widgetName: "Foundation表单行容器12",
                        name: "",
                        id: "foundationRowCtn12"
                    },
                    foundationPassword13: {
                        desp: "旧密码",
                        widgetName: "旧密码",
                        name: "",
                        id: "foundationPassword13"
                    },
                    foundationPassword14: {
                        desp: "新密码",
                        widgetName: "新密码",
                        name: "",
                        id: "foundationPassword14"
                    },
                    foundationPassword15: {
                        desp: "重复新密码",
                        widgetName: "重复新密码",
                        name: "",
                        id: "foundationPassword15"
                    },
                    submitBtn: {
                        desp: "提交",
                        widgetName: "提交",
                        id: "submitBtn",
                        "data-authority": "10"
                    }
                },
                css: {
                    foundationFormCtn8: {
                        theme: {
                            "function": "btn-focus"
                        }
                    },
                    foundationRowCtn9: {
                        theme: {
                            "function": "btn-focus"
                        }
                    },
                    foundationRowCtn10: {
                        theme: {
                            "function": "btn-focus"
                        }
                    },
                    foundationRowCtn11: {
                        theme: {
                            "function": "btn-focus"
                        }
                    },
                    foundationRowCtn12: {
                        theme: {
                            "function": "btn-focus"
                        }
                    },
                    foundationPassword13: {
                        theme: {
                            "function": "btn-focus"
                        }
                    },
                    foundationPassword14: {
                        theme: {
                            "function": "btn-focus"
                        }
                    },
                    foundationPassword15: {
                        theme: {
                            "function": "btn-focus"
                        }
                    },
                    submitBtn: {
                        theme: {
                            "function": "btn-focus"
                        }
                    }
                },
                configs: {
                    foundationFormCtn8: {
                        formLayout: "inline",
                        labelAlign: "text-right",
                        labelSpan: 5,
                        backPlane: false,
                        header: "",
                        collapse: false,
                        span: 12
                    },
                    foundationRowCtn9: {
                        header: ""
                    },
                    foundationRowCtn10: {
                        header: ""
                    },
                    foundationRowCtn11: {
                        header: ""
                    },
                    foundationRowCtn12: {
                        header: ""
                    },
                    foundationPassword13: {
                        mustInput: false,
                        pwdVisible: true,
                        errorMsgOrientation: "bottom",
                        prepend: "",
                        label: "旧密码",
                        iconclose: "fa fa-toggle-on",
                        iconopen: "fa fa-toggle-off",
                        labelAlign: "",
                        iconPosition: 1,
                        labelSpan: "",
                        disabled: false,
                        placeholder: "",
                        append: "",
                        span: 8,
                        autocomplete: false
                    },
                    foundationPassword14: {
                        mustInput: false,
                        pwdVisible: true,
                        errorMsgOrientation: "bottom",
                        prepend: "",
                        label: "新密码",
                        iconclose: "fa fa-toggle-on",
                        iconopen: "fa fa-toggle-off",
                        labelAlign: "",
                        iconPosition: 1,
                        labelSpan: "",
                        disabled: false,
                        placeholder: "",
                        append: "",
                        span: 8,
                        autocomplete: false
                    },
                    foundationPassword15: {
                        mustInput: false,
                        pwdVisible: true,
                        errorMsgOrientation: "bottom",
                        prepend: "",
                        label: "重复新密码",
                        iconclose: "fa fa-toggle-on",
                        iconopen: "fa fa-toggle-off",
                        labelAlign: "",
                        iconPosition: 1,
                        labelSpan: "",
                        disabled: false,
                        placeholder: "",
                        append: "",
                        span: 8,
                        autocomplete: false
                    },
                    submitBtn: {
                        ctnRenderMethodMap: {
                            aweb4FoundationRowCtn: "renderBtnInFoundationForm",
                            _other_: "renderDefaultBtn"
                        },
                        btnLocation: "center",
                        name: "提交",
                        useIcon: false,
                        icon: "",
                        iconPosition: 0,
                        status: "normal",
                        span: ""
                    }
                },
                pageNSL: [],
                widgetNSL: {},
                validations: {},
                lifecycle: {},
                variables: {},
                ajaxOption: {
                    _submitBtn_click: {
                        type: "POST",
                        url: "changePassword.do",
                        urlDivider: "/",
                        timeout: undefined,
                        noAgreeBusData: true,
                        ajaxProcessData: true,
                        ajaxNoBlobData: true,
                        validate: true,
                        validateSuccessCallback: null,
                        validateCleanCallback: null,
                        data: function() {
                            var data;
                            data = [ {
                                desp: "旧密码",
                                name: "oldPassword",
                                validate: {
                                    regex: "^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[~!#@&%\\^\\$_\\(\\)\\*\\.]+$)(.{6,30})$",
                                    errorMsg: "密码长度需在6-30之间，并且包含数字、字母和符号",
                                    require: "false",
                                    hasChineseCharacter: "false",
                                    widgetID: "foundationPassword13",
                                    pageContext: auiCtx
                                },
                                queryString: false,
                                urlExternal: false,
                                value: auiCtx.variables.foundationPassword13.getValue()
                            }, {
                                desp: "密码",
                                name: "newPassword",
                                validate: {
                                    regex: "^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[~!#@&%\\^\\$_\\(\\)\\*\\.]+$)(.{6,30})$",
                                    errorMsg: "密码长度需在6-30之间，并且包含数字、字母和符号",
                                    require: "false",
                                    hasChineseCharacter: "false",
                                    widgetID: "foundationPassword14",
                                    pageContext: auiCtx
                                },
                                queryString: false,
                                urlExternal: false,
                                value: auiCtx.variables.foundationPassword14.getValue()
                            }, {
                                desp: "密码",
                                name: "repeatNewPassword",
                                validate: {
                                    regex: "^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[~!#@&%\\^\\$_\\(\\)\\*\\.]+$)(.{6,30})$",
                                    errorMsg: "密码长度需在6-30之间，并且包含数字、字母和符号",
                                    require: "false",
                                    hasChineseCharacter: "false",
                                    widgetID: "foundationPassword15",
                                    pageContext: auiCtx
                                },
                                queryString: false,
                                urlExternal: false,
                                value: auiCtx.variables.foundationPassword15.getValue()
                            } ];
                            return data;
                        },
                        shelter: "正在加载数据，请稍候…",
                        success: function(response) {
                            if (response.status) {
                                if (response.type && response.type !== "AJAX") {
                                    app.open(response);
                                } else {
                                    auiCtx.variables.foundationPassword13.resetValue();
                                    auiCtx.variables.foundationPassword14.resetValue();
                                    auiCtx.variables.foundationPassword15.resetValue();
                                    app.alert("密码修改成功！");
                                    auiCtx.eventCallback._submitBtn_click(response);
                                }
                            } else if (response.errorMsg) {
                                app.alert(response.errorMsg, app.alert.ERROR);
                            }
                        }
                    }
                },
                eventCallback: {
                    _submitBtn_click: function(response) {}
                },
                delegateEvents: {
                    "click #submitBtn": function(e) {
                        aweb.debug && aweb.stepTo("global-changePassword-事件配置-“提交”事件");
                        $.ajax(auiCtx.ajaxOption._submitBtn_click);
                    }
                },
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
                    variables.foundationFormCtn8 = $AW.ctn.foundationFormCtn($("#foundationFormCtn8", $el), configs.foundationFormCtn8, attr.foundationFormCtn8, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn8), auiCtx);
                    variables.foundationRowCtn9 = $AW.ctn.foundationRowCtn($("#foundationRowCtn9", $el), configs.foundationRowCtn9, attr.foundationRowCtn9, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn9), auiCtx);
                    variables.foundationRowCtn10 = $AW.ctn.foundationRowCtn($("#foundationRowCtn10", $el), configs.foundationRowCtn10, attr.foundationRowCtn10, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn10), auiCtx);
                    variables.foundationRowCtn11 = $AW.ctn.foundationRowCtn($("#foundationRowCtn11", $el), configs.foundationRowCtn11, attr.foundationRowCtn11, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn11), auiCtx);
                    variables.foundationRowCtn12 = $AW.ctn.foundationRowCtn($("#foundationRowCtn12", $el), configs.foundationRowCtn12, attr.foundationRowCtn12, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn12), auiCtx);
                    variables.foundationPassword13 = $AW.component.foundationForm.foundationPassword($("#foundationPassword13", $el), configs.foundationPassword13, attr.foundationPassword13, $AW.css("component.foundationForm.foundationPassword", css.foundationPassword13), auiCtx);
                    variables.foundationPassword14 = $AW.component.foundationForm.foundationPassword($("#foundationPassword14", $el), configs.foundationPassword14, attr.foundationPassword14, $AW.css("component.foundationForm.foundationPassword", css.foundationPassword14), auiCtx);
                    variables.foundationPassword15 = $AW.component.foundationForm.foundationPassword($("#foundationPassword15", $el), configs.foundationPassword15, attr.foundationPassword15, $AW.css("component.foundationForm.foundationPassword", css.foundationPassword15), auiCtx);
                    variables.submitBtn = $AW.component.btn.normalBtn($("#submitBtn", $el), configs.submitBtn, attr.submitBtn, $AW.css("component.btn.normalBtn", css.submitBtn), auiCtx);
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