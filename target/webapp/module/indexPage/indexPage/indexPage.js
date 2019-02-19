define([].concat(window.aweb.transformJsConfig([ "jquery", "slimScroll", "component.leftCatalog", "component.topNav", "ctn", "ctn.divCtn" ])).concat(window.aweb.transformCssConfig([ "leftCatalog/leftCatalogBootstrap.css", "leftCatalog/leftCatalog.css", "topNav/topNav.css", "AUI/css/layout.ctn.css" ])), function() {
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
                        indexPage: {
                            desp: "首页",
                            widgetName: "首页",
                            id: "indexPage",
                            "data-authority": "10"
                        },
                        banner: {
                            desp: "顶部导航栏25",
                            widgetName: "顶部导航栏25",
                            id: "banner"
                        },
                        leftCatalog: {
                            desp: "侧边菜单",
                            widgetName: "侧边菜单",
                            id: "leftCatalog"
                        },
                        awebMainContainer: {
                            desp: "主容器",
                            widgetName: "主容器",
                            id: "awebMainContainer",
                            "data-authority": "10"
                        }
                    },
                    css: {
                        indexPage: {
                            cssCode: {
                                className: "aw-indexPage-indexPage-4"
                            }
                        },
                        banner: {
                            style: {
                                logo: {
                                    width: "50px",
                                    "margin-top": "0.8em",
                                    height: "50px"
                                }
                            }
                        },
                        leftCatalog: {
                            cssCode: {
                                className: "aw-indexPage-indexPage-29"
                            }
                        },
                        awebMainContainer: {
                            cssCode: {
                                className: "aw-indexPage-indexPage-39"
                            }
                        }
                    },
                    configs: {
                        indexPage: {
                            header: "",
                            collapse: false,
                            titleInfo: {
                                edmID: "EAE5C608F65C6E1D70A5-1F3C",
                                edmKey: "",
                                fields: [],
                                keys: []
                            },
                            infoPosition: "right",
                            packupBtn: false,
                            pickupHeight: ""
                        },
                        banner: {
                            left_catalog: {
                                layers: 2
                            },
                            preview_menu: [ {
                                children: [ {
                                    icon: "fa fa-sign-out",
                                    name: "退出登录",
                                    id: "exit",
                                    uuid: "A24C70BB4E6E14D1986F-0259"
                                } ],
                                noCircle: false,
                                icon: "fa fa-cogs",
                                name: "用户操作",
                                id: "userOpr",
                                uuid: "3E55C84FFAFF8803F490-BDC0"
                            } ],
                            logo: {
                                src: "http:/127.0.0.1:42397/projectSources/target/webapp/img/E3E6C408C1FBC3F82E6E-D936.png",
                                alt: "赞同科技",
                                title: ""
                            },
                            message_area: {
                                name: "",
                                icon: "",
                                text: ""
                            }
                        },
                        leftCatalog: {
                            collapseOpen: false,
                            autoShow: false
                        },
                        awebMainContainer: {
                            header: "",
                            collapse: false,
                            titleInfo: {
                                edmID: "F070B325B3529BB155A6-A24D",
                                edmKey: "",
                                fields: [],
                                keys: []
                            },
                            infoPosition: "right",
                            packupBtn: false,
                            pickupHeight: ""
                        }
                    },
                    pageNSL: [],
                    widgetNSL: {},
                    validations: {},
                    lifecycle: {
                        leftCatalog_load_init_000002: {
                            func: function() {
                                aweb.debug && aweb.stepTo("indexPage-indexPage-生命周期配置-侧边菜单设置数据");
                                auiCtx.variables.leftCatalog.refresh([ {
                                    id: "welcomePage",
                                    pid: null,
                                    value: "example#customAweb",
                                    name: "欢迎页面",
                                    icon: "fa fa-agree"
                                } ]);
                            },
                            times: 0,
                            clock: 1e3,
                            immediate: false,
                            isPause: true
                        },
                        awebMainContainer_load_init_000004: {
                            func: function() {
                                aweb.debug && aweb.stepTo("indexPage-indexPage-生命周期配置-主容器初始操作");
                                /**
 * 
 *  实例化主页
 */
                                (function(scope) {
                                    var $ctn = $('<div data-role="container" class="aweb4-container">' + '<ul data-role="tab" class="nav nav-tabs aweb-tabs"></ul>' + '<div class="aweb-main" data-role="content"></div>' + "</div>"), Controller = app.Controller, siteName = document.title, $indexPanel = $("#awebMainContainer"), openPage = function() {
                                        var hash = decodeURI(window.location.hash), hashArr = hash && hash.split("?"), i, hashItem, path, querys, j, queryItem, title, pages = app.router.pages, option = {}, content = {}, flag = false, domID, key, pageId;
                                        if (hash && hash.match("#/")) {
                                            path = hashArr[0].slice(2);
                                            if (hashArr[1]) {
                                                hashItem = hashArr[1];
                                                querys = hashItem.split("&");
                                                for (j = 0; j < querys.length; j++) {
                                                    queryItem = querys[j].split("=");
                                                    if (queryItem[0] === "title" && queryItem[1]) {
                                                        title = queryItem[1];
                                                    } else if (queryItem[0] === "pageId" && queryItem[1]) {
                                                        pageId = queryItem[1];
                                                    } else if (queryItem[0] && queryItem[1]) {
                                                        content[queryItem[0]] = queryItem[1];
                                                    }
                                                }
                                            }
                                            if (path && path.match(/^\S+\/\S+\/\S+$/)) {
                                                if (!$.isEmptyObject(pages)) {
                                                    for (key in pages) {
                                                        if (pages.hasOwnProperty(key) && pages[key]) {
                                                            if (pageId && pages[key].id === pageId && path && path === pages[key].page.replace(/#/g, "/")) {
                                                                flag = true;
                                                                domID = key;
                                                            }
                                                        }
                                                    }
                                                }
                                                if (flag) {
                                                    app.open(pages[domID]);
                                                } else {
                                                    option.page = path.replace(/\//g, "#");
                                                    option.status = true;
                                                    option.id = pageId;
                                                    option.title = title;
                                                    option.content = content;
                                                    option.page && app.open(option);
                                                }
                                            }
                                        } else {}
                                    };
                                    //resizeUID = app.getUID();
                                    $indexPanel.append($ctn);
                                    app.router = new Controller({
                                        View: Controller.View,
                                        view: {
                                            isGlobal: true,
                                            ctn: $ctn,
                                            tabs: $ctn.children("[data-role=tab]"),
                                            ctt: $ctn.children("[data-role=content]"),
                                            contextMenuOption: {
                                                FIRST: [ "middle", "others", "all" ],
                                                CURRENT: [ "refresh", "middle", "others", "all" ],
                                                LAST: [ "middle", "others", "all" ],
                                                _DEFAULT: [ "middle", "others", "all" ],
                                                ONLY: [ "middle" ],
                                                middle: {
                                                    name: "关闭此窗口",
                                                    filter: ":eq(_index_)"
                                                },
                                                others: {
                                                    name: "关闭其他窗口",
                                                    filter: ":not(:eq(_index_))"
                                                },
                                                all: {
                                                    name: "关闭所有窗口",
                                                    filter: ""
                                                },
                                                refresh: {
                                                    name: "刷新此窗口",
                                                    action: "refresh"
                                                },
                                                ctnTemp: '<ul class="dropdown-menu" style="position:fixed;"></ul>',
                                                lineTemp: '<li data-action="_action_" data-filter="_filter_">_name_</li>'
                                            },
                                            contextMenuCallback: {
                                                doAction: function($target, action) {
                                                    switch (action) {
                                                      case "refresh":
                                                        var handler = this.controller.getCurrentHandler();
                                                        if (handler) {
                                                            handler.stepTo(handler.currentStep);
                                                        }
                                                        break;
                                                    }
                                                },
                                                closeTab: function(filter) {
                                                    if (typeof filter === "string") {
                                                        app.shelter.show("正在关闭标签页，请稍候…");
                                                        var $children = this.$tabs.children(filter), domIDMap = {}, stack = this.stack, i, domID;
                                                        $children.each(function() {
                                                            domIDMap[$(this).attr("data-dom-id")] = true;
                                                        });
                                                        for (i = -1; domID = stack[++i]; ) {
                                                            if (domIDMap[domID]) {
                                                                this.close(domID);
                                                            }
                                                        }
                                                        app.shelter.hide();
                                                    }
                                                }
                                            }
                                        }
                                    });
                                    app.open = function() {
                                        app.router.open.apply(app.router, arguments);
                                    };
                                    app.tab = app.tab || {};
                                    app.tab.close = app.close = function() {
                                        app.router.tab.close.apply(app.router.tab, arguments);
                                    };
                                    //绑定 URL 改变事件
                                    app.router.on(app.router.STATUS.AFTER_RESUME + ".seo," + app.router.STATUS.AFTER_LOAD + ".seo", function(type, handler) {
                                        var option = handler.option, title = option.title, content = option.content, hash = decodeURI(window.location.hash), page = "#/" + handler.option.page.replace(/#/g, "/"), queryStrings = "", key;
                                        if (!$.isEmptyObject(content)) {
                                            for (key in content) {
                                                if (content.hasOwnProperty(key) && content[key]) {
                                                    queryStrings += "&" + key + "=" + content[key];
                                                }
                                            }
                                        }
                                        if (title) {
                                            if (queryStrings) {
                                                if (option.id) {
                                                    page = page + "?" + "title=" + title + "&pageId=" + option.id + queryStrings;
                                                } else {
                                                    page = page + "?" + "title=" + title + queryStrings;
                                                }
                                            } else {
                                                if (option.id) {
                                                    page = page + "?" + "title=" + title + "&pageId=" + option.id;
                                                } else {
                                                    page = page + "?" + "title=" + title;
                                                }
                                            }
                                            document.title = title + "-" + siteName;
                                        } else {
                                            if (queryStrings) {
                                                if (option.id) {
                                                    page = page + "?" + "pageId=" + option.id + queryStrings;
                                                } else {
                                                    page = page + "?" + queryStrings;
                                                }
                                            } else {
                                                if (option.id) {
                                                    page = page + "?" + "pageId=" + option.id;
                                                }
                                            }
                                            document.title = siteName;
                                        }
                                        //判断是否需要改变 URL，如果默认打开首页，判断条件代码如下，‘mainPage’应与默认打开的首页的 id 一致。
                                        if (option.id !== "mainPage" && hash !== page || option.id === "mainPage" && hash !== page && hash !== "") {
                                            if (window.history.pushState) {
                                                window.history.pushState(null, null, page);
                                            } else {
                                                window.location.hash = page;
                                            }
                                        }
                                        //如果不需要打开首页，判断条件如下
                                        if (hash !== page) {
                                            if (window.history.pushState) {
                                                window.history.pushState(null, null, page);
                                            } else {
                                                window.location.hash = page;
                                            }
                                        }
                                    });
                                    //判断页面是否是WINDOW类型
                                    if (!app.getQueryStringMap().windowId) {
                                        openPage();
                                    } else {}
                                    window.addEventListener("hashchange", function() {
                                        openPage();
                                    });
                                    if (window.auiApp) {
                                        var i = 12;
                                        while (--i) {
                                            app.open({
                                                id: "error" + i,
                                                page: "error#404",
                                                title: "示例页面-" + i,
                                                status: true
                                            });
                                        }
                                    }
                                })(window);
                            },
                            times: 0,
                            clock: 1e3,
                            immediate: false,
                            isPause: true
                        }
                    },
                    variables: {},
                    ajaxOption: {
                        _banner__exit_click_signOut: {
                            type: "POST",
                            url: "./signOut.do",
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
                                auiCtx.eventCallback._banner__exit_click_signOut = function() {
                                    delete window.ctoken;
                                    app.removeData("ctoken");
                                    document.location.reload(true);
                                };
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._banner__exit_click_signOut(response);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        }
                    },
                    eventCallback: {
                        _banner__exit_click_signOut: function(response) {}
                    },
                    delegateEvents: {
                        "click.signOut #banner #exit": function(e) {
                            aweb.debug && aweb.stepTo("indexPage-indexPage-事件配置-退出登录");
                            $.ajax(auiCtx.ajaxOption._banner__exit_click_signOut);
                        },
                        "click.event71 #leftCatalog .left-menu": function(e) {
                            aweb.debug && aweb.stepTo("indexPage-indexPage-事件配置-“侧边菜单”点击事件");
                            /**
 * 
 * 获取侧边栏点击事件的值
 */
                            var data = auiCtx.variables.leftCatalog.getClickNode();
                            /**
 * 
 * 打开对应的页面
 */
                            if (data && data.value) {
                                app.open({
                                    id: data.id,
                                    page: data.value,
                                    title: data.name,
                                    status: true
                                });
                            }
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
                        variables.indexPage = $AW.ctn.divCtn($("#indexPage", $el), configs.indexPage, attr.indexPage, $AW.css("ctn.divCtn", css.indexPage), auiCtx);
                        variables.banner = $AW.component.topNav($("#banner", $el), configs.banner, attr.banner, $AW.css("component.topNav", css.banner), auiCtx);
                        variables.leftCatalog = $AW.component.leftCatalog($("#leftCatalog", $el), configs.leftCatalog, attr.leftCatalog, $AW.css("component.leftCatalog", css.leftCatalog), auiCtx);
                        variables.awebMainContainer = $AW.ctn.divCtn($("#awebMainContainer", $el), configs.awebMainContainer, attr.awebMainContainer, $AW.css("ctn.divCtn", css.awebMainContainer), auiCtx);
                        auiCtx.lifecycle.leftCatalog_load_init_000002.func();
                        auiCtx.lifecycle.awebMainContainer_load_init_000004.func();
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