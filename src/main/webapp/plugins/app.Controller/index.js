(function () {
    'use strict';

    var View = function (options, controller) {
            var _default = this._default,
                context = this,
                $left, $right,
                $contextMenu,
                $tabCtn,

                queryString, windowId, windowOptions;

            $.extend(true, context, _default, options);

            context.controller = controller;

            context.$ctn = $(context.ctn).addClass('hidden');
            context.$contextMenu = $contextMenu = $(context.contextMenuTemp);
            context.$ctn.prepend($contextMenu);

            context.$tabs = $(context.tabs, context.$ctn);
            context.$left = $left = $(context.leftBtnTemp);
            context.$right = $right = $(context.rightBtnTemp);

            context.$moveBtns = context.$left.add(context.$right);

            context.pagePopInstance = {};

            context.$tabs.wrap(context.tabCtnTemp);


            context.$tabCtn = $tabCtn = context.$tabs.parent();
            $tabCtn.prepend($left);
            $tabCtn.append($right);

            context.$ctt = $(context.ctt, context.$ctn);


            context.$tabs.on({
                'click.view': function (e) {
                    var $target = $(e.target || window.event.srcElement),
                        $item = $target.closest('[data-dom-id]'),
                        domID = $item.attr('data-dom-id');

                    if (domID) {
                        if ($target.attr('data-role') === 'close') {
                            context.close(domID);
                        } else {
                            context.switchView(domID);
                        }

                        return false;
                    }

                }
            });
            if (context.contextMenuOption) {
                context.$tabs.on({
                    'contextmenu.view': function (e) {
                        var $li = $(e.target || event.srcElement).closest('[data-dom-id]'),
                            $tabs = $li.parent(),
                            $contextMenu = context.$contextMenu,

                            contextMenuOption = context.contextMenuOption,
                            contextMenuCallback = context.contextMenuCallback,
                            html = '',
                            lineTemp,
                            index, menuList, menu, length;

                        if ($li.length) {
                            length = $tabs.children().length;
                            lineTemp = contextMenuOption.lineTemp;
                            index = $li.index();

                            if ($li.hasClass('active')) {
                                switch(length){
                                    case 1:
                                        menuList = contextMenuOption.ONLY;
                                        break;

                                    default:
                                        menuList = contextMenuOption.CURRENT;
                                }
                            } else {
                                switch (index) {
                                    case 0:
                                        menuList = contextMenuOption.FIRST;
                                        break;
                                    case length - 1:
                                        menuList = contextMenuOption.LAST;
                                        break;
                                    default:
                                        menuList = contextMenuOption._DEFAULT;
                                }

                            }
                            menuList = ([].concat(menuList)).reverse();

                            for (length = menuList.length;
                                 (menu = contextMenuOption[menuList[--length]]);) {
                                html += lineTemp
                                    .replace('_action_', menu.action)
                                    .replace('_filter_', menu.filter)
                                    .replace('_name_', menu.name);
                            }

                            $contextMenu
                                .empty().append(html.replace(/_index_/g, index))
                                .css(app.position(e, $(window), $contextMenu), -15, 0).removeClass('hide')
                                .off('.viewContextMenu')
                                .one({
                                    'click.viewContextMenu': function (e) {
                                        var $target = $(e.target || event.srcElement),
                                            action = $target.attr('data-action');

                                        if (action && action !== "undefined") {
                                            contextMenuCallback.doAction.call(context, $li, action);
                                        } else {
                                            contextMenuCallback.closeTab.call(context, $target.attr('data-filter'));
                                        }

                                        $contextMenu.addClass('hide');
                                    },
                                    'mouseleave.viewContextMenu': function () {
                                        $contextMenu.addClass('hide');
                                    }
                                });

                            $tabs.off('.viewContextMenu').one('mouseleave.viewContextMenu', function (e) {
                                if (!$(e.relatedTarget).closest('ul').hasClass('aweb-tab-content-menu')) {
                                    $contextMenu.addClass('hide');
                                }
                            });
                        }

                        return false;
                    }
                });
            }
            context.$moveBtns.on({
                'click.view': function () {
                    context.focusTab(undefined, $(this));
                }
            });

            app.screen.addResizeHandler({
                uid: app.getUID(),
                isGlobal: options.isGlobal,
                timeout: 500,
                callback: function () {
                    context.focusTab(context.$tabs.children('.active'));
                }
            });

            queryString = app.getQueryStringMap();

            if ((windowId = queryString[this.windowKey]) && (windowOptions = app.getData(windowId))) {
                windowOptions = JSON.parse(windowOptions);
                windowOptions.type = this.TYPE.BLANK;

                this.controller.open(windowOptions);
            }
        },

        Model = function (options, controller) {

            $.extend(true, this, options, {
                currentStep: -1,
                intervals: {},
                timeouts: {},
                _data: {
                    scope: {}
                }
            });

            this.controller = controller;

            this.uid = this.pageId = this.cacheId = this.domID;
        },

        Controller = function (options) {
            var context = this,
                _default = this._default,
                eventController;

            $.extend(true, this, _default, options);

            options.view.controller = this;

            this.context = this;
            this.event = app.dispatcher();
            this.Model = this.Model || Model;
            this.tab = new (options.View || View)(options.view, this);
            this.pages = {};

        };

    View.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: View,

        _default: {
            ctn: '[data-role=container]',

            tabs: '#tabs',

            ctt: '#spa-page-main',

            count: {},
            stack: [],

            contextMenuTemp: '<ul class="aweb-tab-content-menu hide"></ul>',
            tabCtnTemp: '<div class="aweb-tabs-container"></div>',
            tabTemp: '<li class="active" data-dom-id="_domID_" data-tab-id="_id_" data-href="_href_" title="_title_"><a>_title_</a>_button_</li>',
            leftBtnTemp: '<button type="button" title="左移标签" class="btn aweb-tabs-left hidden" data-role="left"><i class="fa fa-chevron-left"></i>',
            rightBtnTemp: '<button type="button" title="右移标签" class="btn aweb-tabs-right hidden" data-role="right"><i class="fa fa-chevron-right"></i></button>',
            closeButtonTemp: '<button type="button" data-role="close" class="close">&times;</button>',
            untitled: '未定义',

            cttTemp: '<div id="_domID_" />',

            ctnFullClassName: 'aweb-spa-ctn-full',
            cttFullClassName: 'aweb-spa-ctt-full',

            hideNavClass: 'hide',

            pathKeyInURL: 'page',
            fullscreenKeyInURL: 'fullscreen',
            displayNavKeyInURL: 'displayNav',

            windowKey: 'windowId',

            toUpdateTitle: true
        },

        TYPE: {
            BLANK: 'BLANK',
            SUB: 'SUB',
            SELF: 'SELF',
            WINDOW: 'WINDOW',
            POPOVER: 'POPOVER'
        },
        popOption: {
            popSwitch: false
        },

        open: function (options) {
            var TYPE = this.TYPE,


                ret = false,
                title = options.title || this.untitled,
                id = options.id,
                fixed = options.fixed,
                domID,
                href = $.camelCase(options.sections.join('-')),

                handler,context,

                $tabs = this.$tabs.children(),
                $tab, $renderTo;


            if (!this.stack.length && options.type === TYPE.SELF) {
                options.type = TYPE.BLANK;
            }


            if (!options.type || options.type === TYPE.BLANK) {
                $tab = id ? $tabs.filter('[data-tab-id="' + id + '"][data-href="' + href + '"]') : $tabs.filter('[data-href="' + href + '"]');

                if ($tab.length) {
                    domID = $tab.attr('data-dom-id');

                    this.switchView(domID, !$tab.length);
                } else {
                    if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.SUB || handler.type === TYPE.POPOVER)) {

                        switch (handler.type) {
                            case TYPE.SUB:
                                app.alert('系统错误 0x01：子页面下不能打开新页面！', app.alert.ERROR, '0x01');
                                break;
                            case TYPE.POPOVER:
                                app.alert('系统错误 0x01：气泡页面下不能打开新页面！', app.alert.ERROR, '0x01');
                                break;
                        }
                    } else {
                        domID = this.getUID(id || href);

                        this.$tabs.append(this.tabTemp.replace(/_domID_/, domID).replace(/_id_/, id).replace(/_href_/, href)
                            .replace(/_title_/g, title)
                            .replace(/_button_/, fixed ? '' : this.closeButtonTemp)
                        );

                        $renderTo = $(this.cttTemp.replace(/_domID_/, domID));
                        this.$ctt.append($renderTo);

                        ret = {
                            domID: domID,
                            $renderTo: $renderTo,
                            type: TYPE.BLANK
                        };
                    }
                }
            } else {
                switch (options.type) {
                    case TYPE.SELF:
                        //暂时阻止气泡页面下自身打开页面
                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开自身页面！', app.alert.ERROR, '0x01');
                        } else {
                            handler = this.controller.getCurrentHandler();

                            this.controller.unload(handler.domID, true);

                            domID = this.getUID(id || href);

                            $renderTo = handler.$renderTo = this.updateTitleAndID(handler.type, handler.domID, domID, title, id, href, handler.$renderTo);

                            ret = {
                                $renderTo: handler.$renderTo,
                                domID: domID,
                                type: handler.type
                            };
                        }


                        break;
                    case TYPE.SUB:

                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开子页面！', app.alert.ERROR, '0x01');
                        } else {
                            domID = this.getUID(id || href);

                            $renderTo = $(this.cttTemp.replace(/_domID_/, domID));

                            ret = {
                                $renderTo: $renderTo,
                                domID: domID,
                                type: TYPE.SUB
                            };

                            app.modal({
                                title: title,
                                content: '',
                                btnConfirm: options.btnConfirm || '关闭',
                                btnCancel: options.btnCancel || '取消',
                                init: function (controller) {
                                    var $body = $(this),
                                        $close = $('<button title="关闭子页面" type="button" class="close iconfont icon-topbar-close"></button>');

                                    $body.prev().prepend($close);
                                    $body.append($renderTo);

                                    $close.one('click', function () {
                                        controller.unload();

                                        $(this).closest('.modal').modal('hide');

                                        controller.tab.resumeView();
                                    });
                                },
                                confirmHandler: function (controller) {
                                    controller.unload();

                                    $(this).closest('.modal').modal('hide');

                                    controller.tab.resumeView();
                                },
                                cancelHandler: function (controller) {
                                    controller.unload();

                                    $(this).closest('.modal').modal('hide');

                                    controller.tab.resumeView();

                                },
                                width: options.width,
                                height: options.height,
                                args: [this.controller],
                                isLargeModal: true,
                                isDialog: true,
                                backdrop: 'static',
                                noFooter: !options.hasFooter,
                                noHeader: !options.title
                            });
                        }

                        break;
                    case TYPE.POPOVER:

                        if (this.stack.length > 1 && (handler = this.controller.getCacheHandler(this.stack[this.stack.length - 1])) && (handler.type === TYPE.POPOVER)) {
                            app.alert('系统错误 0x01：气泡页面下不能打开新气泡页面！', app.alert.ERROR, '0x01');

                        } else {
                            domID = this.getUID(id || href);

                            $renderTo = $(this.cttTemp.replace(/_domID_/, domID));

                            ret = {
                                $renderTo: $renderTo,
                                domID: domID,
                                type: TYPE.POPOVER
                            };

                            context = this;
                            /*  //需要阻止第二次点击的时候仍然进行 popover 动作
                             if (this.popOption.popSwitch) {
                             this.popOption.popSwitch = !this.popOption.popSwitch;

                             } else {*/
                            app.popover({
                                $elem: options.$elem,
                                title: title,
                                content: '',
                                placement: 'auto left',
                                init: function (popIns, controller) {
                                    var $body = $(this).find('.aweb-popover-content');

                                    $body.append($renderTo);
                                    context.pagePopInstance = popIns;


                                },
                                confirmHandler: function (popIns, controller, popOption) {

                                    if (!popIns.popInstance.inState.click) {
                                        popOption.popSwitch = !popOption.popSwitch;
                                    }

                                    controller.unload();
                                    controller.tab.resumeView();

                                },

                                width: options.width,
                                height: options.height,
                                args: [this.controller, this.popOption]
                            });
                            /*  }*/
                        }

                        break;
                }
            }

            if (typeof options.fullscreen === 'boolean') {
                this.fullscreen(options.fullscreen);
            }

            if (typeof options.displayNav === 'boolean') {
                this.displayNav(options.displayNav);
            }

            return ret;
        },
        openWindow: function (options) {
            var optionStr = JSON.stringify(options || {}),
                windowId = app.getUID(),
                location = window.location || document.location,
                url = (location.origin || '') + location.pathname,
                a = document.createElement("a");

            app.setData(windowId, optionStr);

            window.open(url + '?' + app.getNewQueryStringURL({
                    windowId: windowId
                }));
        },
        close: function (domID, _doNotResume) {
            var handler,
                controller = this.controller,
                currentViewID = this.getCurrentView();

            handler = controller.getCacheHandler(domID) || controller.getCurrentHandler();
            domID = domID || currentViewID;

            if (handler) {

                if (handler.type === this.TYPE.SUB) {

                    controller.unload(domID, true);

                    handler.$renderTo.closest('.modal').modal('hide');



                } else {

                    if(/MSIE|Trident\/7\.0/i.test(navigator.userAgent)&& handler.type === this.TYPE.POPOVER){
                        this.pagePopInstance.close && this.pagePopInstance.close();
                    }

                    controller.unload(domID);

                    this.$tabs.children('[data-dom-id="' + domID + '"]').remove();
                    this.$ctt.children('#' + domID).remove();


                }

                if (!_doNotResume && domID === currentViewID) {
                    this.resumeView();
                }

            }
            return this;
        },

        getUID: function (domID) {

            if (this.count[domID]) {
                domID += (++this.count[domID]);
            } else {
                this.count[domID] = 1;
            }
            return domID;
        },
        updateTitleAndID: function (type, oldID, newID, title, id, href, $renderTo) {
            var TYPE = this.TYPE;

            title = title || this.untitled;

            switch (type) {
                case TYPE.SUB:
                    $renderTo.closest('.modal').children('.modal-header').children(':not(button)').text(title);
                    break;
                case TYPE.POPOVER:
                    $renderTo.closest('.aweb-popover').children('.aweb-popover-header').children('.aweb-popover-title').text(title);
                    break;
                default:
                    this.$tabs
                        .children('[data-dom-id="' + oldID + '"]')
                        .attr({
                            title: title,
                            'data-dom-id': newID,
                            'data-tab-id': id,
                            'data-href': href
                        })
                        .children('a').text(title);
                    break;
            }

            return $renderTo.attr('id', newID);
        },
        setTitle: function (uid, newTitle) {
            var TYPE = this.TYPE,
                model = this.controller.getCacheHandler(uid),
                $view;

            if (model && ($view = model.$renderTo)) {
                newTitle = newTitle || this.untitled;

                switch (model.type) {
                    case TYPE.SUB:
                        $view.closest('.modal').children('.modal-header').children(':not(button)').text(newTitle);
                        break;
                    default:
                        this.$tabs
                            .children('[data-dom-id="' + uid + '"]')
                            .attr({
                                title: newTitle
                            })
                            .children('a').text(newTitle);
                        break;
                }
            }
        },

        setCurrentView: function (domID) {
            if (domID) {
                var stack = [],
                    _stack = this.stack,
                    i, id;

                for (i = _stack.length; id = _stack[--i];) {
                    if (domID !== id) {
                        stack.push(id);
                    }
                }
                this.stack = stack.reverse();
                this.stack.push(domID);

                this.$ctn.removeClass('hidden');
            }
        },
        getCurrentView: function () {
            //字符串化
            return this.stack[this.stack.length - 1] + '';
        },
        removeView: function (domID) {
            if (domID) {
                var stack = [],
                    _stack = this.stack,
                    i, id;

                for (i = _stack.length; id = _stack[--i];) {
                    if (domID !== id) {
                        stack.push(id);
                    }
                }
                this.stack = stack.reverse();

                if (!stack.length) {
                    this.$ctn.addClass('hidden');
                    this.fullscreen(false);
                    this.displayNav(true);
                }
            }
        },


        switchView: function (domID, isLoad) {
            var

                lastDomID = this.getCurrentView(),
                $tab, $ctt, $page,
                model;

            if (isLoad || lastDomID !== domID) {


                model = this.controller.getCacheHandler(domID);

                if (model) {
                    this.controller.pause();

                    if ((model.type !== this.TYPE.SUB) && (model.type !== this.TYPE.POPOVER)) {
                        $tab = this.$tabs.children()
                            .removeClass('active')
                            .filter('[data-dom-id="' + domID + '"]').addClass('active');

                        $ctt = this.$ctt;

                        $page = $ctt.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');


                        $page = $ctt.children('#' + domID);
                        $page.removeClass('hide');
                        $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

                        //因为弹窗和气泡已经trigger了
                        $(window).trigger('resize');
                    } else {
                        $ctt = this.$ctt;
                        $page = $ctt.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop());

                        $page = model.$renderTo;
                        $page.removeClass('hide');
                    }


                    !isLoad && this.controller.resume(domID);

                    this.setCurrentView(domID);

                    this.focusTab($tab);
                }


            }
        },
        resumeView: function () {
            var TYPE = this.TYPE,
                lastDomID = this.getCurrentView(),
                handler = this.controller.getCurrentHandler(),
                domID,
                $tab, $ctt, $page, model;

            if (handler) {
                domID = handler.domID;
                model = this.controller.getCacheHandler(domID);

                if ((model.type !== this.TYPE.SUB) && (model.type !== this.TYPE.POPOVER)) {
                    $tab = this.$tabs.children()
                        .removeClass('active')
                        .filter('[data-dom-id="' + domID + '"]').addClass('active');

                    $ctt = this.$ctt;


                    $page = $ctt.children('#' + lastDomID);
                    $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');

                    $page = $ctt.children('#' + domID);
                    $page.removeClass('hide');
                    $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

                    //因为弹窗和气泡已经trigger了
                    $(window).trigger('resize');
                }
                this.controller.resume(domID);

                this.focusTab($tab);
            }
        },
        focusTab: (function () {
            var _focusTab = function ($tab, $btn) {
                    var widths = 0,
                        totalWidths = 0,

                        $tabCtn = this.$tabCtn,
                        $tabs = this.$tabs,
                        $lis = $tabs.children($tab ? ':lt(' + ($tab.index() + 1) + ')' : undefined),
                        $tabBtn = $btn || this.$left,
                        marginLeft,

                        tabsContainerWidth = $tabCtn.innerWidth() - $tabBtn.outerWidth() * 4.2,
                        tabsOffsetLeft = parseInt($tabs.css('left'), 10);


                    $lis.each(function (index, elem) {
                        widths += $(elem).outerWidth();
                    });

                    if (!$tab) {
                        totalWidths = widths;
                    } else {
                        $tabs.children().each(function (index, elem) {
                            totalWidths += $(elem).outerWidth();
                        });
                    }

                    this.$moveBtns[totalWidths < tabsContainerWidth ? 'addClass' : 'removeClass']('hidden');


                    if ($btn) {
                        if ($btn.attr('data-role') === 'left') {
                            tabsOffsetLeft += tabsContainerWidth;
                        } else {
                            tabsOffsetLeft -= tabsContainerWidth;
                        }
                    } else {
                        tabsOffsetLeft = tabsContainerWidth - widths;
                    }

                    if (tabsContainerWidth - widths > tabsOffsetLeft) {

                        tabsOffsetLeft = tabsContainerWidth - widths;
                    } else if (tabsOffsetLeft > 0) {
                        marginLeft = totalWidths < tabsContainerWidth ? 0 : $tabBtn.outerWidth();

                        tabsOffsetLeft = tabsOffsetLeft > marginLeft ? marginLeft : tabsOffsetLeft;
                    }

                    $tabs.animate({
                        'left': tabsOffsetLeft + 'px'
                    }, 500);
                },
                focusTabHandler = null;

            return function ($tab, $btn) {
                var context = this;
                if (focusTabHandler) {
                    clearTimeout(focusTabHandler);
                    focusTabHandler = null;
                }

                focusTabHandler = setTimeout(function () {
                    _focusTab.call(context, $tab, $btn);
                }, 200);
            }
        }()),

        fullscreen: function (fullscreen) {
            this.$ctn[fullscreen ? 'addClass' : 'removeClass'](this.ctnFullClassName);

            app.shelter[fullscreen ? 'upperZIndex' : 'lowerZIndex']();

            this.focusTab();
        },
        isFullScreen: function () {
            return this.$ctn.hasClass(this.ctnFullClassName);
        },
        displayNav: function (show) {
            this.$tabCtn[show ? 'removeClass' : 'addClass'](this.hideNavClass);
            this.$ctt[show ? 'removeClass' : 'addClass'](this.cttFullClassName);

            this.focusTab();
        },
        isDisplayNav: function () {
            return !this.$tabCtn.hasClass(this.hideNavClass);
        }
    };

    Model.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: Model,

        load: function () {
            return this.stepTo(0);
        },
        pause: function () {
            var data = this._data;

            try {
                if (data && data.bootstrap && data.bootstrap.pause) {

                    this.controller.trigger(this.controller.STATUS.BEFORE_PAUSE, this);

                    data.bootstrap.pause.call(this, data.$el, data.scope, this);

                    this.controller.trigger(this.controller.STATUS.AFTER_PAUSE, this);
                }
            } catch (e) {
                if (window.aweb.error) {
                    app.alert(e.message, app.alert.ERROR);
                }
                if (window.aweb.log) {
                    console.error(e);
                }
            }

            this.stopAsyncEvent();

            return this;
        },
        resume: function () {
            var data = this._data;

            try {
                if (data && data.bootstrap && data.bootstrap.resume) {
                    this.controller.trigger(this.controller.STATUS.BEFORE_RESUME, this);

                    data.bootstrap.resume.call(this, data.$el, data.scope, this);

                    this.controller.trigger(this.controller.STATUS.AFTER_RESUME, this);
                }
            } catch (e) {

                if (window.aweb.error) {
                    app.alert(e.message, app.alert.ERROR);
                }
                if (window.aweb.log) {
                    console.error(e);
                }
            }

            this.startAsyncEvent();

            return this;
        },
        unload: function (keepDom) {
            if (this.currentStep !== -1) {
                var data = this._data;

                try {
                    if (data && data.bootstrap && data.bootstrap.unload) {
                        this.controller.trigger(this.controller.STATUS.BEFORE_UNLOAD, this);

                        data.bootstrap.unload.call(this, data.$el, data.scope, this);

                        this.controller.trigger(this.controller.STATUS.AFTER_UNLOAD, this);
                    }
                } catch (e) {
                    if (window.aweb.error) {
                        app.alert(e.message, app.alert.ERROR);
                    }
                    if (window.aweb.log) {
                        console.error(e);
                    }
                } finally {
                    this.undelegateEvents();
                    this.stopAsyncEvent(true);

                    if (!keepDom) {
                        data.$el.remove();
                        delete this._data.$el;

                        if (window.$AW) {
                            delete window.$AW._css[this.domID];
                        }
                    } else {
                        data.$el.empty();
                    }

                    delete this.timeouts;
                    delete this.intervals;


                    this.timeouts = {};
                    this.intervals = {};
                }
            }

            return this;
        },

        stepTo: function (step) {
            var
                handler = this,
                cache = handler._data && handler._data.scope,
                module = handler.conf,
                modulePath = handler.path,
                oFlow = module.flows[step],
                oView = module.views[oFlow.id],
                dtd = $.Deferred();

            //防止刷新时，pageParams不一致
            if (cache && !$.isEmptyObject(cache)) {
                app.domain.exports('page', cache);
            }

            this.unload(true);

            require([this.getTextURL(modulePath + oView.template, handler.server), this.getJavascriptURL(modulePath + oView.js, handler.server)],
                function (template, bootstrap) {
                    var data = handler._data,
                        $div = $('<div/>'),
                        $el;


                    handler.$renderTo.empty().append($div);
                    template && $div.append(template);
                    $el = data.$el = handler.$renderTo;

                    if($.isFunction(bootstrap)){
                        bootstrap=bootstrap();
                    }
                    if($.isFunction(bootstrap)){
                        bootstrap=bootstrap();
                    }

                    data.bootstrap = bootstrap;

                    try {
                        if (data && data.bootstrap && data.bootstrap.load) {
                            bootstrap.load.call(handler, $el, data.scope, handler);
                        }

                        handler.currentStep = step;

                        handler.controller.trigger(handler.controller.STATUS.AFTER_LOAD, handler);

                        if (window.aweb.log) {
                            console.log(new Date().toTimeString() + '：加载' + handler.path + '完毕，唯一ID（domID）：' + handler.domID + '，页面ID（id）：' + handler.id + '，当前步数（currentStep）：' + step + '');
                        }
                    } catch (e) {
                        if (window.aweb.error) {
                            app.alert(e.message, app.alert.ERROR);
                        }
                        if (window.aweb.log) {
                            console.error(e);
                        }
                    } finally {
                        dtd.resolve();
                    }
                });

            return dtd.promise();
        },

        setTimeout: function (option) {
            var handler = this;

            if (option.immediate) {
                option.callback ? option.callback() : option.func();
            }

            option.clock = option.clock || 0;
            option.uniqueId = option.uniqueId || app.getUID();
            option.windowId = window.setTimeout(function () {
                option.callback ? option.callback() : option.func();

                handler.removeAsyncEvent(handler.timeouts, option.uniqueId);
            }, option.clock);

            handler.timeouts[option.uniqueId] = option;

            return option.uniqueId;
        },
        clearTimeout: function (uniqueId) {
            var e = this.timeouts[uniqueId];

            if (e) {
                window.clearTimeout(e.windowId);
                this.removeAsyncEvent(this.timeouts, e.uniqueId);
            }
        },
        setInterval: function (option) {
            var handler = this;

            if (option.immediate) {
                option.callback ? option.callback() : option.func();
            }

            option.clock = option.clock || 0;
            option.uniqueId = option.uniqueId || app.getUID();
            option.windowId = window.setInterval(option.times ? function () {
                if (option.times) {

                    option.times--;
                    option.callback ? option.callback() : option.func();
                } else {
                    handler.removeAsyncEvent(handler.timeouts, option.uniqueId);
                }
            } : (option.callback || option.func), option.clock);

            handler.intervals[option.uniqueId] = option;

            return option.uniqueId;
        },
        clearInterval: function (uniqueId) {
            var e = this.intervals[uniqueId];

            if (e) {
                window.clearInterval(e.windowId);
                this.removeAsyncEvent(this.intervals, e.uniqueId);
            }
        },
        updateInterval: function (uniqueId, option) {
            var handler = this,
                e = handler.intervals[uniqueId];

            if (e) {
                this.clearInterval(e.uniqueId);

                return this.setInterval($.extend(true, e, option));
            }
        },
        startAsyncEvent: function () {
            var i, map, item,
                handler = this;

            map = this.intervals;
            for (i in map) {
                if ((item = map[i]) && item.isPause) {

                    item.windowId = window.setInterval(item.times ? (function (item, handler) {
                        return function () {
                            if (item.times) {
                                item.times--;
                                item.callback ? item.callback() : item.func();
                            } else {
                                handler.removeAsyncEvent(handler.timeouts, item.uniqueId);
                            }
                        };
                    }(item, handler)) : (item.callback || item.func), item.clock);
                }
            }

            map = this.timeouts;
            for (i in map) {
                if ((item = map[i]) && item.isPause) {
                    item.windowId = window.setTimeout((function (item, handler) {
                        return function () {
                            item.callback ? item.callback() : item.func();

                            handler.removeAsyncEvent(handler.timeouts, item.uniqueId);
                        }
                    }(item, handler)), item.clock);
                }
            }

            i = null, item = null, map = null;
        },
        stopAsyncEvent: function (isUnload) {
            var i, map, item;

            map = this.intervals;
            for (i in map) {
                if ((item = map[i]) && (isUnload || item.isPause)) {
                    window.clearInterval(map[i].windowId);
                }
            }

            map = this.timeouts;
            for (i in map) {
                if ((item = map[i]) && (isUnload || item.isPause)) {
                    window.clearTimeout(map[i].windowId);
                }
            }
        },
        removeAsyncEvent: function (arr, uniqueId) {
            if (arr[uniqueId]) {
                arr[uniqueId] = null;
                delete arr[uniqueId];
            }
        },


        delegateEvents: function (events) {
            var context = this,
                $el = context._data.$el || context.$renderTo,
                method, match, eventName, selector, $selector, key, touchName,
                map = {},
                intercept,
                $ = jQuery;

            this.undelegateEvents();
            for (key in events) {
                if (events.hasOwnProperty(key)) {
                    method = events[key];

                    if (!this.isFunction(method)) method = this[events[key]];

                    if (!method) continue;

                    match = key.match(this.delegateEventSplitter);

                    eventName = match[1];
                    selector = match[2];

                    eventName += '.previewEvents';
                    if (selector === '') {
                        $el.on(eventName, method);
                    } else {
                        $selector = $(selector, $el);


                        if ($selector.length) {
                            // (touchName = eventName.split(".")[0]) && touchType[touchName] && $selector.addClass("waves-effect");
                            $selector
                                .on(eventName, method)
                                .attr('data-aweb-event', true);
                        }

                        if (!map[eventName]) {
                            map[eventName] = {};
                            $el.on(eventName, {
                                eventName: eventName
                            }, function (e) {
                                var $e = $(e.target || window.event.srcElement),
                                    $selector,
                                    selector, items = map[e.data.eventName];

                                for (selector in items) {
                                    if (items.hasOwnProperty(selector)) {
                                        $selector = $e.closest($(selector, $el));

                                        if ($selector.attr('data-aweb-event')) {
                                            break;
                                        } else if ($selector.length) {
                                            return items[selector].apply($e[0], arguments);
                                        }
                                    }
                                }
                            });
                        }

                        map[eventName][selector] = method;
                    }
                }
            }


            if (window.aweb && window.aweb.headless && window.aweb.headless.on) {
                intercept = function (e) {
                    var $target = $(e.target || event.srcElement);

                    console.log(new Date().toString() + ':' + context.path + '触发了' + e.type + '，元素是:' + $target);
                };
                $el.on({
                    'click.debug': intercept,
                    'focus.debug': intercept,
                    'keydown.debug': intercept
                });
            }
        },
        undelegateEvents: function () {
            this._data.$el && this._data.$el.off();
        },
        isFunction: function (obj) {
            return ((typeof obj === 'function') || false);
        },
        delegateEventSplitter: /^(\S+)\s*(.*)$/,

        getController: function () {
            return this.controller;
        },



        getTextURL : function (mvvmConfPath, server) {
            return "text!./" + (server || '') + mvvmConfPath + (aweb.debug?("?timestamp=" + new Date().getTime()):'');
        },
        getJavascriptURL : function (mvvmConfPath, server) {
            return (server || '') + mvvmConfPath + "?timestamp=" + (aweb.debug?("?timestamp=" + new Date().getTime()):'');
        },
        validateModule : function (module) {
            var error = [],
                flows = module.flows,
                views = module.views,
                i, flow;

            if (!views) {
                error.push("views必需定义！");
            }

            if (flows && flows.length) {
                for (i = -1; flow = flows[++i];) {
                    if (!flow.id) {
                        error.push("flows中位置为" + i + "的流程需包含关联view的id！");
                    } else {
                        if (views && !views[flow.id]) {
                            error.push("flows中位置为" + i + "的流程id关联的view未在views中定义！");
                        }
                    }
                }
            } else {
                error.push("flows必需为长度大于0的数组！");
            }

            return error;
        }
    };

    Controller.prototype = {
        version: 'AWOS 4.4_20171127',
        constructor: Controller,
        _default: {
            conf: {},
            cache: {},
            modulesPath: "module",
            separator: "/",
            mvvmConfName: "mvvm.json",
            modulePath404: "module/error/404/"
        },

        STATUS: {
            AFTER_LOAD: 'afterLoad',
            BEFORE_PAUSE: 'beforePause',
            AFTER_PAUSE: 'afterPause',
            BEFORE_RESUME: 'beforeResume',
            AFTER_RESUME: 'afterResume',
            BEFORE_UNLOAD: 'beforeUnload',
            AFTER_UNLOAD: 'afterUnload'
        },

        getDefaultModulesPath: function () {
            return this.modulesPath;
        },
        getDefaultMVVMConfName: function () {
            return this.mvvmConfName;
        },
        getDefaultSeparator: function () {
            return this.separator;
        },
        getCurrentHandler: function () {
            return this.cache[this.tab.getCurrentView()];
        },

        getMVVM404: function () {
            return {
                path: this.modulePath404,
                conf: this.conf[this.modulePath404]
            };
        },

        getCacheHandler: function (domID) {
            return this.cache[domID];
        },
        addCacheHandler: function (handler) {
            this.cache[handler.domID] = handler;
        },
        removeCacheHandler: function (domID) {
            if (this.cache[domID]) {
                delete this.cache[domID];

                this.tab.removeView(domID);
            }
        },

        load: function (options) {
            var modulePath = this.getDefaultModulesPath() + this.getDefaultSeparator(),
                $renderTo,
                id, domID,
                result, type,
                handler,
                context = this,
                sections = [];

            if (options.sections instanceof Array) {
                sections = sections.concat(options.sections);
            }

            if (sections.length) {
                modulePath += (sections.join(this.getDefaultSeparator()) + this.getDefaultSeparator());
                id = options.id;

                if (options.type !== View.prototype.TYPE.WINDOW) {
                    app.shelter.show('正在加载页面，请稍候…');
                    require([context.Model.prototype.getTextURL(modulePath + this.getDefaultMVVMConfName(), options.server)], function (mvvmConf) {
                        try {
                            var error;

                            if (!mvvmConf) {
                                app.alert('系统错误 0x05：获取页面失败！', app.alert.ERROR, '0x05');
                            } else {
                                mvvmConf = JSON.parse(mvvmConf);

                                if ((error = context.Model.prototype.validateModule(mvvmConf)).length) {
                                    app.alert(error, app.alert.ERROR);
                                } else {
                                    if (result = context.tab.open(options)) {

                                        domID = result.domID;
                                        $renderTo = result.$renderTo;
                                        type = result.type;
                                        context.pages[domID] = options;
                                        try {
                                            handler = new context.Model({
                                                conf: mvvmConf,
                                                path: modulePath,
                                                $renderTo: $renderTo,
                                                id: id,
                                                domID: domID,
                                                controller: context,
                                                type: type,
                                                server: options.server,
                                                option: options
                                            }, context);
                                        } catch (e) {
                                            error = context.getMVVM404();

                                            handler = new context.Model({
                                                conf: error.conf,
                                                path: error.path,
                                                $renderTo: $renderTo,
                                                id: id,
                                                domID: domID,
                                                controller: context,
                                                type: type,
                                                errorMsg: e.message,
                                                server: options.server,
                                                option: options
                                            }, context);
                                        } finally {
                                            context.addCacheHandler(handler);

                                            //如果是SELF的时候，handler指的是上一次的type，而不是这一次的type
                                            if (options.type === context.tab.TYPE.SELF) {
                                                context.tab.setCurrentView(handler.domID);
                                            } else {
                                                context.tab.switchView(handler.domID, true);
                                            }

                                            $.when(handler.load()).done(function () {
                                                app.shelter.hide();
                                            });
                                        }
                                    } else {
                                        app.shelter.hide();
                                    }
                                }
                            }

                        } catch (e) {
                            if (window.aweb.log) {
                                console.error(e);
                            }

                            if (window.aweb.error) {
                                app.alert('系统错误 0x04：内容运行报错，详情见控制台！', app.alert.ERROR, '0x04');
                            }

                            app.shelter.hide();
                        }
                    });
                } else {
                    this.tab.openWindow(options);
                }

            } else {
                if (window.aweb.error) {
                    app.alert('系统错误 0x01：页面路径为空！', app.alert.ERROR, '0x01');
                }

            }
        },
        pause: function () {
            var handler = this.getCurrentHandler();

            if (handler) {
                handler.pause();
            }
        },
        resume: function (domID) {

            if (!domID) {
                debugger;
            }
            var
                handler = this.getCacheHandler(domID);

            if (handler) {
                handler.resume();
            }
        },
        unload: function (domID, keepDom) {

            var handler = domID ? this.getCacheHandler(domID) : this.getCurrentHandler();

            if (handler) {
                handler.unload(keepDom);

                this.removeCacheHandler(handler.domID);
            }
        },

        open: function (options) {
            if (options.status) {

                app.domain.exports('page', options.content);

                options.sections = options.page.split("#");

                this.load(options);

            } else if (options.errorMsg) {
                app.alert(options.errorMsg, app.alert.ERROR);
            }
        },

        getView: function () {
            return this.tab;
        },


        on: function () {
            this.event.on.apply(this.event, arguments);
        },
        off: function () {
            this.event.off.apply(this.event, arguments);
        },
        trigger: function () {
            this.event.trigger.apply(this.event, arguments);
        }
    };

    Controller.View = View;
    Controller.Model = Model;

    return Controller;
});