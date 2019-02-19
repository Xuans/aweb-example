define([].concat(window.aweb.transformJsConfig([ "component.btn.normalBtn", "component.foundationForm", "component.foundationForm.foundationPassword", "ctn.foundationRowCtn", "ctn", "ctn.foundationFormCtn", "ctn.divCtn", "component.foundationForm.foundationVerifyInput", "component.foundationForm.foundationInput", "ctn.loginCtn", "layout.rowCtn" ])).concat(window.aweb.transformCssConfig([ "AUI/css/component.btn.css", "foundation/css/foundation.css", "AUI/css/layout.ctn.css", "loginCtn/loginCtn.css" ])), function() {
    return function() {
        return function() {
            return function(auiCtx) {
                "use strict";
                var $el, handler, scope, spaLifecycle;
                "IDETAG";
                "IDETAG";
                spaLifecycle = {
                    load: function(_$el, _scope, _handler) {
                        auiCtx.pageParams = $.extend(true, _scope, app.domain.get("page"));
                        auiCtx.context = this;
                        $el = _$el, handler = _handler, scope = _scope;
                        /*覆盖页面加载时的属性或方法*/ /*覆盖auiCtx属性或方法 */ auiCtx.auiCtxLoad.call(this, auiCtx, _$el, _scope, _handler);
                        /*事件绑定*/ this.delegateEvents.call(this, auiCtx.delegateEvents);
                    },
                    resume: function($el, scope, handler) {
                        /*覆盖页面恢复时的属性或方法*/ auiCtx.auiCtxResume.call(this, auiCtx, $el, scope, handler);
                    },
                    pause: function($el, scope, handler) {
                        /*覆盖页面切出时的属性或方法*/ auiCtx.auiCtxPause.call(this, auiCtx, $el, scope, handler);
                    },
                    unload: function($el, scope, handler) {
                        /*覆盖页面销毁时的属性或方法*/ auiCtx.auiCtxUnload.call(this, auiCtx, $el, scope, handler);
                    }
                };
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
                        loginPageCtn: {
                            id: "loginPageCtn",
                            widgetName: "登录页面",
                            desp: "普通容器5",
                            "data-authority": "10"
                        },
                        rowCtn1: {
                            desp: "栅栏布局5",
                            widgetName: "栅栏布局1",
                            id: "rowCtn1",
                            "data-authority": "10"
                        },
                        divCtn1: {
                            desp: "普通容器6",
                            widgetName: "普通容器1",
                            id: "divCtn1",
                            "data-authority": "10"
                        },
                        divCtn2: {
                            desp: "普通容器7",
                            widgetName: "普通容器2",
                            id: "divCtn2",
                            "data-authority": "10"
                        },
                        divCtn3: {
                            desp: "普通容器22",
                            widgetName: "普通容器3",
                            id: "divCtn3",
                            "data-authority": "10"
                        },
                        loginPanel: {
                            id: "loginPanel",
                            widgetName: "登录容器",
                            desp: "登录容器",
                            "data-authority": "10"
                        },
                        loginPageFoundationFormCtn: {
                            desp: "Foundation表单容器16",
                            widgetName: "Foundation表单容器2",
                            name: "",
                            id: "loginPageFoundationFormCtn"
                        },
                        foundationRowCtn2: {
                            desp: "Foundation表单行容器17",
                            widgetName: "Foundation表单行容器2",
                            name: "",
                            id: "foundationRowCtn2"
                        },
                        username2: {
                            desp: "用户",
                            widgetName: "用户2",
                            name: "username",
                            id: "username2"
                        },
                        passoword2: {
                            desp: "密码",
                            widgetName: "密码2",
                            name: "password",
                            id: "passoword2"
                        },
                        loginCheckCode2: {
                            desp: "验证码",
                            widgetName: "验证码2",
                            name: "checkCode",
                            id: "loginCheckCode2"
                        },
                        loginBtn: {
                            desp: "登录按钮",
                            widgetName: "登录按钮",
                            id: "loginBtn",
                            "data-authority": "10"
                        }
                    },
                    css: {
                        loginPageCtn: {
                            style: {
                                content: {
                                    top: "0",
                                    right: "0",
                                    bottom: "0",
                                    left: "0",
                                    "background-color": "@sLv1MenuBgColor",
                                    height: "100%",
                                    width: "100%",
                                    position: "absolute"
                                }
                            }
                        },
                        rowCtn1: {
                            style: {
                                row: {
                                    position: "absolute"
                                }
                            }
                        },
                        loginPanel: {
                            style: {
                                content: {
                                    "background-color": "#fff"
                                }
                            },
                            cssCode: {
                                className: "aw-loginPage-loginPage-44c1"
                            }
                        },
                        username2: {
                            style: {
                                input: {
                                    "border-radius": "8px",
                                    height: "42px"
                                }
                            }
                        },
                        passoword2: {
                            style: {
                                input: {
                                    "border-radius": "8px",
                                    height: "42px"
                                }
                            }
                        },
                        loginCheckCode2: {
                            style: {
                                input: {
                                    "border-radius": "8px",
                                    height: "42px"
                                }
                            }
                        },
                        loginBtn: {
                            style: {
                                hover: {
                                    "background-color": "#0ec8c7"
                                },
                                backgroundColor: {
                                    "background-color": "@sMainColor"
                                },
                                size: {
                                    width: "99%",
                                    height: "42px"
                                },
                                activeBtn: {
                                    "background-color": "@sMainActiveColor"
                                },
                                hoverBtn: {
                                    "background-color": "@sMainColor"
                                },
                                font: {
                                    color: "#ffffff"
                                }
                            },
                            theme: {
                                "function": "btn-custom"
                            }
                        }
                    },
                    configs: {
                        loginPageCtn: {
                            header: "",
                            collapse: false,
                            titleInfo: {
                                edmID: "F454322BEF075445D302-1903",
                                edmKey: "",
                                fields: [],
                                keys: []
                            },
                            infoPosition: "right",
                            packupBtn: false,
                            pickupHeight: ""
                        },
                        rowCtn1: {
                            container: "container",
                            row: [ {
                                offset: 0,
                                span: 3
                            }, {
                                offset: 0,
                                span: 6
                            }, {
                                offset: 0,
                                span: 3
                            } ],
                            type: "row"
                        },
                        divCtn1: {
                            header: "",
                            collapse: false,
                            titleInfo: {
                                edmID: "E10AB6212A5AC0866660-F975",
                                edmKey: "",
                                fields: [],
                                keys: []
                            },
                            infoPosition: "right",
                            packupBtn: false,
                            pickupHeight: ""
                        },
                        divCtn2: {
                            header: "",
                            collapse: false,
                            titleInfo: {
                                edmID: "446FD3F74FDDE146501A-9996",
                                edmKey: "",
                                fields: [],
                                keys: []
                            },
                            infoPosition: "right",
                            packupBtn: false,
                            pickupHeight: ""
                        },
                        divCtn3: {
                            header: "",
                            collapse: false,
                            titleInfo: {
                                edmID: "734881689A88BE90F139-B8A0",
                                edmKey: "",
                                fields: [],
                                keys: []
                            },
                            infoPosition: "right",
                            packupBtn: false,
                            pickupHeight: ""
                        },
                        loginPanel: {
                            header: "AWEB 图形化开发平台",
                            LogoPanel: true,
                            logo: "icon",
                            icon: "fa fa-agree",
                            img: {
                                src: "",
                                alt: "赞同科技",
                                title: "赞同科技",
                                width: "150px",
                                height: "200px"
                            }
                        },
                        loginPageFoundationFormCtn: {
                            formLayout: "horizontal",
                            labelAlign: "text-right",
                            backPlane: false,
                            labelSpan: 3,
                            header: "",
                            collapse: false,
                            span: 12
                        },
                        foundationRowCtn2: {
                            header: ""
                        },
                        username2: {
                            minAmount: "",
                            mustInput: false,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            icon: "fa iconfont icon-user-o",
                            useIcon: true,
                            input_type: "",
                            prepend: "",
                            label: "",
                            labelAlign: "",
                            iconPosition: 0,
                            labelSpan: "",
                            disabled: false,
                            placeholder: "用户/Username",
                            maxAmount: "",
                            value: "",
                            append: "",
                            span: ""
                        },
                        passoword2: {
                            mustInput: false,
                            pwdVisible: true,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            label: "",
                            iconclose: "",
                            iconopen: "fa iconfont icon-lock",
                            labelAlign: "",
                            iconPosition: 0,
                            labelSpan: "",
                            disabled: false,
                            placeholder: "密码/Password",
                            append: "",
                            span: ""
                        },
                        loginCheckCode2: {
                            mustInput: false,
                            imgTitle: "看不清？换一张",
                            src: "verifyImage.do",
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            icon: "fa iconfont icon-verification-code",
                            useIcon: true,
                            checkCodeCtnWidth: "76px",
                            label: "",
                            isCheckCodeChangeOnClick: true,
                            labelAlign: "",
                            iconPosition: 0,
                            labelSpan: "",
                            placeholder: "验证码/Code",
                            span: ""
                        },
                        loginBtn: {
                            ctnRenderMethodMap: {
                                aweb4FoundationRowCtn: "renderBtnInFoundationForm",
                                _other_: "renderDefaultBtn"
                            },
                            btnLocation: "center",
                            name: "登录/Login",
                            useIcon: false,
                            icon: "",
                            iconPosition: 0,
                            status: "normal",
                            span: ""
                        }
                    },
                    pageNSL: [],
                    widgetNSL: {},
                    validations: {
                        username2: {
                            data: function() {
                                return [ {
                                    desp: "用户2",
                                    name: "username",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "用户名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                                        regex: "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$",
                                        id: "#username2 input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "username2",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.username2.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.username2.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.username2.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.username2.clean.apply($el, arguments);
                            }
                        },
                        passoword2: {
                            data: function() {
                                return [ {
                                    desp: "密码2",
                                    name: "password",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "密码长度需在6-30之间，并且包含数字、字母和符号",
                                        regex: "^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[~!#@&%\\^\\$_\\(\\)\\*\\.]+$)(.{6,30})$",
                                        id: "#passoword2 input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "passoword2",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.passoword2.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.passoword2.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.passoword2.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.passoword2.clean.apply($el, arguments);
                            }
                        },
                        loginCheckCode2: {
                            data: function() {
                                return [ {
                                    desp: "验证码2",
                                    name: "checkCode",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        errorMsg: "",
                                        regex: "",
                                        id: "#loginCheckCode2 input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "loginCheckCode2",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.loginCheckCode2.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.loginCheckCode2.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.loginCheckCode2.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.loginCheckCode2.clean.apply($el, arguments);
                            }
                        }
                    },
                    lifecycle: {
                        loginPanel_load_init_000003: {
                            func: function() {
                                aweb.debug && aweb.stepTo("loginPage-loginPage-生命周期配置-初始化登录容器");
                                var $loginPanel = $("#loginPanel", $el).parent(), $loginPage = $("#loginPageCtn", $el), resizeID = app.getUID();
                                if ($loginPage.length && $loginPanel.length) {
                                    $loginPanel.css({
                                        transition: "margin-top linear 0.2s",
                                        "-moz-transition": "margin-top linear 0.2s",
                                        "-webkit-transition": "margin-top linear 0.2s",
                                        "-o-transition": "margin-top linear 0.2s"
                                    });
                                    app.screen.addResizeHandler({
                                        uid: resizeID,
                                        isGlobal: true,
                                        timeout: 300,
                                        callback: function() {
                                            $loginPanel.css({
                                                marginTop: Math.max(($loginPage.height() - $loginPanel.height()) / 3, 100)
                                            });
                                        }
                                    });
                                }
                                setTimeout(function() {
                                    app.screen.triggerResizeHandler(resizeID, true);
                                }, 300);
                            },
                            times: 0,
                            clock: 1e3,
                            immediate: false,
                            isPause: true
                        },
                        loginPageCtn_load_init_000004: {
                            func: function() {
                                aweb.debug && aweb.stepTo("loginPage-loginPage-生命周期配置-登录按钮键盘事件处理");
                                auiCtx.variables.loginPageFoundationFormCtn.enterToNext(function loginAction() {
                                    $.ajax(auiCtx.ajaxOption._loginBtn_click_event14);
                                });
                            },
                            times: 0,
                            clock: 1e3,
                            immediate: false,
                            isPause: true
                        }
                    },
                    variables: {},
                    ajaxOption: {
                        _loginBtn_click_event14: {
                            type: "POST",
                            url: "signIn.do",
                            urlDivider: "/",
                            timeout: 6e4,
                            noAgreeBusData: true,
                            ajaxProcessData: true,
                            ajaxNoBlobData: true,
                            validate: true,
                            validateSuccessCallback: null,
                            validateCleanCallback: null,
                            data: function() {
                                var data;
                                data = [ {
                                    desp: "用户名",
                                    name: "username",
                                    validate: {
                                        regex: "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$",
                                        errorMsg: "用户名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "username2",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.username2.getValue()
                                }, {
                                    desp: "密码",
                                    name: "password",
                                    validate: {
                                        regex: "^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[~!#@&%\\^\\$_\\(\\)\\*\\.]+$)(.{6,30})$",
                                        errorMsg: "密码长度需在6-30之间，并且包含数字、字母和符号",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "passoword2",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.passoword2.getValue()
                                }, {
                                    desp: "权限码",
                                    name: "checkCode",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        maxLength: "4",
                                        minLength: "4",
                                        widgetID: "loginCheckCode2",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.loginCheckCode2.getValue()
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._loginBtn_click_event14(response);
                                        window.ctoken = response.content.result;
                                        if (window.ctoken) {
                                            app.setData("ctoken", window.ctoken);
                                            app.globalRouter.open({
                                                status: true,
                                                title: "首页",
                                                page: "indexPage#indexPage"
                                            });
                                        }
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        }
                    },
                    eventCallback: {
                        _loginBtn_click_event14: function(response) {}
                    },
                    delegateEvents: {
                        "blur #username2 input": function() {
                            aweb.debug && aweb.stepTo("loginPage-loginPage-校验配置-用户2");
                            app.validate(auiCtx.validations.username2.data, auiCtx.validations.username2.successCallback, auiCtx.validations.username2.errorCallback, auiCtx.validations.username2.cleanCallback, true, true);
                        },
                        "blur #passoword2 input": function() {
                            aweb.debug && aweb.stepTo("loginPage-loginPage-校验配置-密码2");
                            app.validate(auiCtx.validations.passoword2.data, auiCtx.validations.passoword2.successCallback, auiCtx.validations.passoword2.errorCallback, auiCtx.validations.passoword2.cleanCallback, true, true);
                        },
                        "blur #loginCheckCode2 input": function() {
                            aweb.debug && aweb.stepTo("loginPage-loginPage-校验配置-验证码2");
                            app.validate(auiCtx.validations.loginCheckCode2.data, auiCtx.validations.loginCheckCode2.successCallback, auiCtx.validations.loginCheckCode2.errorCallback, auiCtx.validations.loginCheckCode2.cleanCallback, true, true);
                        },
                        "click.event14 #loginBtn": function(e) {
                            aweb.debug && aweb.stepTo("loginPage-loginPage-事件配置-登录");
                            $.ajax(auiCtx.ajaxOption._loginBtn_click_event14);
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
                        variables.loginPageCtn = $AW.ctn.divCtn($("#loginPageCtn", $el), configs.loginPageCtn, attr.loginPageCtn, $AW.css("ctn.divCtn", css.loginPageCtn), auiCtx);
                        variables.rowCtn1 = $AW.layout.rowCtn($("#rowCtn1", $el), configs.rowCtn1, attr.rowCtn1, $AW.css("layout.rowCtn", css.rowCtn1), auiCtx);
                        variables.divCtn1 = $AW.ctn.divCtn($("#divCtn1", $el), configs.divCtn1, attr.divCtn1, $AW.css("ctn.divCtn", css.divCtn1), auiCtx);
                        variables.divCtn2 = $AW.ctn.divCtn($("#divCtn2", $el), configs.divCtn2, attr.divCtn2, $AW.css("ctn.divCtn", css.divCtn2), auiCtx);
                        variables.divCtn3 = $AW.ctn.divCtn($("#divCtn3", $el), configs.divCtn3, attr.divCtn3, $AW.css("ctn.divCtn", css.divCtn3), auiCtx);
                        variables.loginPanel = $AW.ctn.loginCtn($("#loginPanel", $el), configs.loginPanel, attr.loginPanel, $AW.css("ctn.loginCtn", css.loginPanel), auiCtx);
                        variables.loginPageFoundationFormCtn = $AW.ctn.foundationFormCtn($("#loginPageFoundationFormCtn", $el), configs.loginPageFoundationFormCtn, attr.loginPageFoundationFormCtn, $AW.css("ctn.foundationFormCtn", css.loginPageFoundationFormCtn), auiCtx);
                        variables.foundationRowCtn2 = $AW.ctn.foundationRowCtn($("#foundationRowCtn2", $el), configs.foundationRowCtn2, attr.foundationRowCtn2, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn2), auiCtx);
                        variables.username2 = $AW.component.foundationForm.foundationInput($("#username2", $el), configs.username2, attr.username2, $AW.css("component.foundationForm.foundationInput", css.username2), auiCtx);
                        variables.passoword2 = $AW.component.foundationForm.foundationPassword($("#passoword2", $el), configs.passoword2, attr.passoword2, $AW.css("component.foundationForm.foundationPassword", css.passoword2), auiCtx);
                        variables.loginCheckCode2 = $AW.component.foundationForm.foundationVerifyInput($("#loginCheckCode2", $el), configs.loginCheckCode2, attr.loginCheckCode2, $AW.css("component.foundationForm.foundationVerifyInput", css.loginCheckCode2), auiCtx);
                        variables.loginBtn = $AW.component.btn.normalBtn($("#loginBtn", $el), configs.loginBtn, attr.loginBtn, $AW.css("component.btn.normalBtn", css.loginBtn), auiCtx);
                        auiCtx.lifecycle.loginPanel_load_init_000003.func();
                        auiCtx.lifecycle.loginPageCtn_load_init_000004.func();
                    },
                    auiCtxResume: function(auiCtx, $el, scope, handler) {},
                    auiCtxPause: function(auiCtx, $el, scope, handler) {},
                    auiCtxUnload: function(auiCtx, $el, scope, handler) {}
                };
                window.aweb && window.aweb.debug && (window.auiCtx = auiCtx);
                return auiCtx;
            }());
        };
    };
});