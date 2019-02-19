
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        var Controller = app.Controller,
            Tab,
            renderTab;

        //tab

        !function ($) {

            "use strict"; // jshint ;_;


            /* TAB CLASS DEFINITION
             * ==================== */

            var Tab = function (element) {
                this.element = $(element)
            };

            Tab.prototype = {

                constructor: Tab,
                show: function () {
                    var $this = this.element
                        , $ul = $this.closest('ul:not(.dropdown-menu)')
                        , selector = $this.attr('data-target')
                        , previous
                        , $target
                        , e;

                    if (!selector) {
                        selector = $this.attr('href');
                        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
                    }

                    if ($this.parent('li').hasClass('active')) return;

                    previous = $ul.find('.active:last a')[0];

                    e = $.Event('show', {
                        relatedTarget: previous
                    });

                    $this.trigger(e);

                    if (e.isDefaultPrevented()) return;

                    /**
                     * lijiancheng@cfischina.com
                     * 修复nav-tabs在id相同的情况下无法正确指向对应容器的bug
                     * */
                    if ($ul.hasClass('nav-tabs')) {
                        $target = $(selector, $ul.parent())
                    } else {
                        $target = $(selector)
                    }

                    this.activate($this.parent('li'), $ul);
                    this.activate($target, $target.parent(), function () {
                        $this.trigger({
                            type: 'shown'
                            , relatedTarget: previous
                        })
                    })
                }

                , activate: function (element, container, callback) {
                    var $active = container.find('> .active')
                        , transition = callback
                        && $.support.transition
                        && $active.hasClass('fade');

                    function next() {
                        $active
                            .removeClass('active')
                            .find('> .dropdown-menu > .active')
                            .removeClass('active');

                        element.addClass('active');

                        if (transition) {
                            element[0].offsetWidth; // reflow for transition
                            element.addClass('in')
                        } else {
                            element.removeClass('fade')
                        }

                        if (element.parent('.dropdown-menu')) {
                            element.closest('li.dropdown').addClass('active')
                        }

                        callback && callback()
                    }

                    transition ?
                        $active.one($.support.transition.end, next) :
                        next();

                    $active.removeClass('in')
                }

            };


            /* TAB PLUGIN DEFINITION
             * ===================== */

            var old = $.fn.tab;

            $.fn.tab = function (option) {

                return this.each(function () {
                    var $this = $(this)
                        , data = $this.data('tab');
                    if (!data) $this.data('tab', (data = new Tab(this)));
                    if (typeof option == 'string') data[option]()
                })
            };

            $.fn.tab.Constructor = Tab;


            /* TAB NO CONFLICT
             * =============== */

            $.fn.tab.noConflict = function () {
                $.fn.tab = old;
                return this
            };


            /* TAB DATA-API
             * ============ */

            $(document).on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
                e.preventDefault();
                $(this).tab('show')
            })

        }(window.jQuery);
        Tab = function (options,controller) {
            var _default = this._default,
                context = this,
                $left, $right,
                $contextMenu,
                $tabCtn;

            $.extend(true, context, _default, options);

            context.$ctn = $(context.ctn);
            context.$contextMenu = $contextMenu = $(context.contextMenuTemp);
            context.$ctn.prepend($contextMenu);

            context.$tabs = $(context.tabs, context.$ctn);
            context.$left = $left = $(context.leftBtnTemp);
            context.$right = $right = $(context.rightBtnTemp);

            context.$moveBtns = context.$left.add(context.$right);


            context.$tabs.wrap(context.tabCtnTemp);

            context.$tabCtn = $tabCtn = context.$tabs.parent();
            if(options.isBtn){
                $tabCtn.prepend($left);
                $tabCtn.append($right);
            }


            context.$ctt = $(context.ctt, context.$ctn);

            context.uid = app.getUID();
	        context.pageCache = {};
	        context.controller=controller;


            if (options._style) {
                this.style(options._style);
            }

            if (options.navbarVisable === false) {
                this.navbarVisiable(false);
            }


            context.$tabs.on({
                'click.view': function (e) {
                    var $target = $(e.target || window.event.srcElement),
                        $item = $target.closest('[data-dom-id]'),
                        domID = $item.attr('data-dom-id');

                    if (domID) {
                        if ($target.attr('data-role') === 'close') {
                            context.close(domID);
                        } else {
	                        context.loadPage(domID);
	                        context.switchView(domID);
                        }
                    }
                },
                'contextmenu.view': function (e) {
                    var $li = $(e.target || event.srcElement).closest('[data-dom-id]'),
                        $tabs = $li.parent(),
                        $contextMenu = context.$contextMenu,

                        contextMenuOption = context.contextMenuOption,
                        contextMenuCallback = context.contextMenuCallback,
                        html = '', lineTemp,
                        index, menuList, menu, length;

                    if ($li.length) {
                        length = $tabs.children().length;
                        lineTemp = contextMenuOption.lineTemp;


                        if ($li.hasClass('active')) {
                            menuList = [].concat(contextMenuOption.CURRENT).reverse();

                            for (length = menuList.length; (menu = contextMenuOption[menuList[--length]]);) {
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
                    }

                    return false;
                }
            });

            context.$moveBtns.on({
                'click.view': function () {
                    context.focusTab(undefined, $(this));
                }
            });

            app.screen.addResizeHandler({
                uid: context.uid,
                isGlobal: true,
                timeout: 500,
                callback: function () {
                    context.focusTab(context.$tabs.children('.active'));
                }
            });

        };
        Tab.prototype = {
            version: 'AWOS 4.3.0.0_20170723',
            constructor: Tab,
            _default: {
                ctn: '[data-role=container]',
                tabs: '#tabs',
                ctt: '#spa-page-main',

                count: {},
                stack: [],

                contextMenuTemp: '<ul class="aweb-tab-content-menu hide"></ul>',
                ctnTemp: '<div/>',
                listTemp: '<ul class="nav nav-tabs aweb-tabs"/>',
                tabCtnTemp: '<div class="aweb-tabs-container"></div>',
                tabTemp: '<li class="active" data-dom-id="_domID_" data-tab-id="_id_" data-href="_href_" title="_title_"><a>_title_</a></li>',
                tabTempFull: '<li class="active" data-dom-id="_domID_" data-tab-id="_id_" data-href="_href_" title="_title_"><a>_title_</a><button type="button" data-role="close" class="close">&times;</button></li>',
                leftBtnTemp: '<button type="button" title="左移标签" class="btn aweb-tabs-left hidden" data-role="left"><i class="fa fa-chevron-left"></i>',
                rightBtnTemp: '<button type="button" title="右移标签" class="btn aweb-tabs-right hidden" data-role="right"><i class="fa fa-chevron-right"></i></button>',

                untitled: '新标签页',

                cttTemp: '<div id="_domID_" />',


                isGlobal: true,
                contextMenuOption: {
                    CURRENT: ['refresh'],
                    refresh: {
                        name: '刷新此窗口',
                        action: 'refresh'
                    },
                    ctnTemp: '<ul class="dropdown-menu" style="position:fixed;"></ul>',
                    lineTemp: '<li data-action="_action_" data-filter="_filter_">_name_</li>'
                },
                contextMenuCallback: {
                    doAction: function ($target, action) {
                        switch (action) {
                            case 'refresh':
                                var handler = this.controller.getCurrentHandler();

                                if (handler) {
                                    handler.stepTo(handler.currentStep);
                                }

                                break;
                        }
                    },
                    closeTab: function (filter) {
                        if (typeof filter === 'string') {
                            app.shelter.show('正在关闭标签页，请稍候…');

                            var $children = this.$tabs.children(filter),
                                domIDMap = {},
                                stack = this.stack,
                                i, domID;


                            $children.each(function () {
                                domIDMap[$(this).attr('data-dom-id')] = true;
                            });

                            for (i = -1; domID = stack[++i];) {
                                if (domIDMap[domID]) {
                                    this.close(domID);
                                }
                            }

                            app.shelter.hide();
                        }
                    }
                }
            },

            TYPE: {
                NEW: 'NEW'
            },

            open: function (options) {
                var TYPE = this.TYPE,

                    ret = false,
                    title = options.title || this.untitled,
                    id = options.id,
                    domID,
                    href = $.camelCase(options.sections.join('-')),

                    $tabs = this.$tabs.children(),
                    $tab, $renderTo;


                $tab = id ? $tabs.filter('[data-tab-id="' + id + '"]') : $tabs.filter('[data-href="' + href + '"]');

                //假如改页面已经存在
                if ($tab.length) {
                    domID = $tab.attr('data-dom-id');

                    id = id || domID;
                        $renderTo = options.$renderTo || options.renderTo;

                        this.updateTitleAndID(options.type, id, id, title, id, href, $renderTo);

                        ret = {
                            domID: domID,
                            $renderTo: $renderTo,
                            type: TYPE.NEW
                        };

                    if(options.switchTo){
	                    this.switchView(domID, !$tab.length);
                    }
                }

                return ret;
            },
            close: function (domID) {
                var handler,
                    controller = this.controller,
                    currentViewID = this.getCurrentView();

                handler = controller.getCacheHandler(domID) || controller.getCurrentHandler();

                if (handler) {
                    if (handler.type === this.TYPE.SUB) {
                        handler.$renderTo.closest('.modal').modal('hide');
                    } else {
                        controller.unload(domID);

                        this.$tabs.children('[data-dom-id="' + domID + '"]').remove();
                        this.$ctt.children('#' + domID).remove();
                    }

                    if (domID === currentViewID) {
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
                title = title || this.untitled;

                this.$tabs
                    .children('[data-dom-id="' + oldID + '"]')
                    .attr({
                        title: title,
                        'data-dom-id': newID,
                        'data-tab-id': id,
                        'data-href': href
                    })
                    .children('a').text(title);

                $renderTo.attr('id', newID);
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

	                this.focusTab(
		                this.$tabs.children()
			                .filter('[data-dom-id="' + domID + '"]')
	                );
                }
            },
            getCurrentView: function () {
                return this.stack[this.stack.length - 1];
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
                }
            },

            switchView: function (domID, isLoad) {
                var lastDomID = this.getCurrentView(),
                    $tab, $ctt, $page;

                if(lastDomID!==domID){
                    if(isLoad) {
                        this.setCurrentView(domID);
                        this.controller.pause();
                        this.removeView(domID);
                    }else{
                        this.controller.pause();

                        $tab = this.$tabs.children()
                            .removeClass('active')
                            .filter('[data-dom-id="' + domID + '"]').addClass('active');

                        $ctt = this.$ctt;

                        //记录当前页面高度
                        $page = $ctt.children('#' + lastDomID);

                        $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');


                        $page = $ctt.children('#' + domID);
                        $page.removeClass('hide');
                        $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

                        this.controller.resume(domID);


                        this.setCurrentView(domID);

                        this.focusTab($tab);
                    }
                    $(window).trigger('resize');
                }
            },
            resumeView: function () {
                var TYPE = this.TYPE,
                    lastDomID = this.getCurrentView(),
                    handler = this.controller.getCurrentHandler(),
                    domID,
                    $tab, $ctt, $page;

                if (handler) {
                    domID = handler.domID;

                    if (handler.type !== TYPE.SUB) {
                        $tab = this.$tabs.children()
                            .removeClass('active')
                            .filter('[data-dom-id="' + domID + '"]').addClass('active');

                        $ctt = this.$ctt;

                        //记录当前页面高度
                        $page = $ctt.children('#' + lastDomID);
                        $page.attr('data-scroll-top', $page.parent().scrollTop()).addClass('hide');

                        $page = $ctt.children('#' + domID);
                        $page.removeClass('hide');
                        $page.parent().scrollTop($page.attr('data-scroll-top') || 0);

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
					        $parent,
					        marginLeft,

					        tabsContainerWidth = $tabCtn.innerWidth() - $tabBtn.outerWidth() * 4.2,
					        tabsOffsetLeft = parseInt($tabs.css('left'), 10);

                        if(tabsContainerWidth<=0) {
                            $parent = $tabCtn;

                            while ($parent.length && !(tabsContainerWidth = $parent.innerWidth())) {
                                $parent = $parent.parent();
                            }
                        }

                        //获取tabs总长度
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
			  
                    if(context.closeFoucs){
                        return;
                    }
			        if (focusTabHandler) {
				        clearTimeout(focusTabHandler);
				        focusTabHandler = null;
			        }

			        focusTabHandler = setTimeout(function () {
				        _focusTab.call(context, $tab, $btn);
			        }, 200);
		        }
	        }()),


            style: function (style) {
                this.$ctn.css(style);

                this.focusTab();

                return this;
            },
            setTabTitle: function (domId,title) {
	            this.$tabs
		            .children('[data-dom-id="' + domId + '"]')
		            .attr({
			            title: title
		            })
		            .children('a').text(title);
            },
            navbarVisiable: function (visable) {
                this.$tabCtn.css('display', visable ? '' : 'none');

                if (visable) {
                    this.focusTab();
                }
            },
            destroy: function () {
                var stack = this.stack,
                    i, domID;

                for (i = -1; domID = stack[++i];) {
                    this.close(domID);
                }

                app.screen.removeResizeHandler(this.uid, true);
            },


            setPageCache:function(domID,options,config){
                this.pageCache[domID]= {
	                options: options,
	                config: config
                };

                if(this.$tabs.children('[data-dom-id='+ domID +']').hasClass('active')){
                    this.loadPage(domID);
                }
            },
            getPageCache:function(domID) {
	            return this.pageCache[domID] || {};
            },
            loadPage:function(domID){
	            var context=this,
                    cache=this.getPageCache(domID),
                    option=cache.options,
		            result=option && option.isLoaded;

	            if(!result && option){
		            option.success=function(response){

			            if(!response.title){
				            delete response.title;
			            }else{
				            try{
					            response.title=$AW.nsl(response.title,context.$ctn.attr('id'),context.auiCtx||app.router.getCurrentHandler().auiCtx);
				            }catch(e){
					            response.title=$AW.nsl(response.title);
				            }
			            }

			            response = $.extend(true, {
				            page: 'error#404'
			            }, cache.config,response,{
				            switchTo:true
			            });

			            context.controller.open(response);

			            option.isLoaded=true;
		            };

		            $.ajax(option);
	            }

	            return result;
            }
        };

        widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE,widget.STATUS.WIDGET_APPEND].join('.tabCtn,') + '.tabCtn', function (type, oWidget) {
            var tabWidget,option,cttWidgets,append,tabs,updateTabDataModel;
            oWidget && oWidget.length && oWidget.each(function (index) {

                tabWidget = oWidget.eq(index);

                if(tabWidget && tabWidget.href && tabWidget.href()==='layout.tabCtn'){

                    tabWidget.drop(false);

                    option = tabWidget.option();
                    tabs=option.name;
                    updateTabDataModel=function(){
                        var flag=false;

                        tabs.map(function (elem, index) {
                            var cttWidget = cttWidgets.filter(':eq(' + index + ')');

                            if (cttWidget.length) {
                                if (elem.type === 'pageFlow') {
                                    cttWidget.accept(false);

                                    (!elem.data) && (elem.data = {});

                                    if (elem.data.active !== true) {
                                        flag=true;
                                        elem.data.active = true;
                                        elem.data.uuid = app.getUID();
                                        elem.data.order = true;
                                        elem.data.code = '##_VAR##.open(##_AJAX_OPTION##,"' + elem.data.uuid + '")';
                                    }

                                    if (!elem.data.name) {
                                        elem.data.name = elem.name;
                                    }

                                } else {
                                    cttWidget.accept(true);

                                    (!elem.data) && (elem.data = {});

                                    if (elem.data.active !== false) {
                                        flag=true;
                                        elem.data.active = false;
                                    }
                                }
                            }
                        });

                        if(flag){
                            tabWidget.option(option,true);
                        }
                    };

                    switch(type){
                        case widget.STATUS.WIDGET_INIT:
	                        tabs=option.name=[];

	                        while (tabs.length<2){
		                        tabs.push({
			                        name: '标签' + (tabs.length + 1),
			                        id: 'tab' + (tabs.length + 1),
			                        uuid: app.getUID()
		                        });

		                        tabWidget.append('divCtn', function (newCtn) {
			                        newCtn.del(false) && newCtn.drag(false);
			                        tabWidget.option(option);
			                        //newCtn.config();

		                        });
	                        }
                            break;
                        case widget.STATUS.WIDGET_UPDATE:

	                        tabs = option.name || (option.name = []);
	                        cttWidgets = tabWidget.children(':active');


	                        if (cttWidgets.length < tabs.length) {
		                        append = function (cttWidget) {
			                        cttWidget.del(false) && cttWidget.drag(false);

			                        cttWidgets = tabWidget.children(':active');


			                        if (cttWidgets.length < tabs.length) {
				                        tabWidget.append('divCtn', append);
			                        }else{
			                            updateTabDataModel();
                                    }
		                        };

		                        tabWidget.append('divCtn', append);

	                        } else if (cttWidgets.length > tabs.length) {
		                        if (tabs.length < 2) {
			                        while (tabs.length < 2) {
				                        tabs.push({
					                        name: '标签' + (tabs.length + 1),
					                        id: 'tab' + (tabs.length + 1),
					                        uuid: app.getUID()
				                        });
			                        }
			                        //触发valueChange
			                        tabWidget.option(option);

		                        } else {
			                        cttWidgets.filter(':gt(' + (tabs.length - 1) + ')').destroy();

			                        updateTabDataModel();
		                        }
	                        }else{
	                            updateTabDataModel();
                            }
                            break;
                        case widget.STATUS.WIDGET_APPEND:

                            cttWidgets = tabWidget.children(':active');
                            cttWidgets.del(false) && cttWidgets.drag(false);

                            break;


                    }
                }
            })
        });

        widget.layout.tabCtn = function ($selector, oOption, attr, oCss, auiCtx) {
            var TAB_TEMP = Tab.prototype._default.tabTemp,
                 tabInstance,
                 $ctn, $ctt, $list, $content, $children,
                 option, tabs,
                 i, elem, map, css,
                 style, $ulCtn,
                 spaModule, tabID;


                $ctt = $selector;
                option = oOption;
                css = oCss;


                if (option && (tabs = option.name)) {
                    $list = $(Tab.prototype._default.listTemp);

                    tabID = $ctt[0].id;
                    $ctt.removeAttr('id').removeAttr('class');

                    $ctt.addClass(option.mode).addClass('aweb-tab-ctn');

                    $ctt.wrap(Tab.prototype._default.ctnTemp);

                    $ctn = $ctt.parent().addClass($ctt.attr('class')).attr('id', tabID);
                    $ctn.prepend($list);


                    spaModule = new Controller({
                        View: Tab,
                        view: {
                            ctn: $ctn,
                            tabs: $list,
                            ctt: $ctt,
                            _style: oCss && oCss.style && oCss.style.ctn,
                            navbarVisable: option.navbarVisable,
                            isBtn:option.isBtn,
                            closeFoucs:option.closeFoucs,
                            auiCtx:auiCtx
                        }
                    });
                    tabInstance = spaModule.tab;
                    $ctt.prev('.aweb-tabs-container').addClass(option.mode);
                    $ctt.children().each(function (i) {
                        var $this = $(this),
                            id = $this.attr('id');

                        tabInstance.stack.push(id);

	                    tabs[i].name  = $AW.nsl(tabs[i].name, tabID, auiCtx) || id;
	                    try{
		                    tabs[i].data.name=tabs[i].name;
                        }catch (e){}

                        $list.append(TAB_TEMP.replace(/_domID_/, id).replace(/_href_/, id).replace(/_id_/, id).replace(/_title_/g, tabs[i].name));

                    });
                    $ctt.children(':not(:first)').addClass('hide');
                    $list.children(':not(:first)').removeClass('active');

                    tabInstance.setCurrentView($list.children(':first').attr('data-dom-id'));


                    $children = $ctt.children();
                    for (i = tabs.length, map = {}; elem = tabs[--i];) {
                        if ((elem = elem.data) && (elem = elem.uuid)) {
                            $content = $children.eq(i);

                            map[elem] = {
                                type: Tab.prototype.TYPE.NEW,
                                id: $content.attr('id'),
                                renderTo: $content,
                                title: tabs[i].name,
                                switchTo: tabs[i].switchTo
                            };
                        }
                    }
                    //自定义样式
                    if(css && css.cssCode && css.cssCode.className){
                        $ctn.addClass(css.cssCode.className)
                    }

                    if (!$.isEmptyObject(css) && css.style) {
                        style = css.style;

                        $ulCtn = $ctt.prev('.aweb-tabs-container');
                        style.tabUl && $AW.cssHover('ul.aweb-tabs ', $ctt.parent(), style.tabUl, '');
                        style.tabName && $AW.cssHover('.aweb-tabs-container ul.nav-tabs.aweb-tabs>li', $ulCtn, style.tabName, '',true);
                        style.tabNameHover && $AW.cssHover('.aweb-tabs>li', $ulCtn, style.tabNameHover, ':hover');
                        // style.tabNameHover && $AW.cssHover('.aweb-tabs>li.active a', $ulCtn, style.tabNameHover, ':hover');
                        // style.tabNameActive && $AW.cssHover('.aweb-tabs>li.active a', $ulCtn, style.tabNameActive, '');
                        style.tabNameActive && $AW.cssHover('.aweb-tabs>li.active', $ulCtn, style.tabNameActive, ':hover');
                        style.ctn && $ctt.children().css(style.ctn);
                    }

                    return {
                        switchTab: function (id) { //切换标签
                            spaModule.tab.switchView(id);
                        },
                        setTabTitle: function (domId,title) {
                            spaModule.tab.setTabTitle(domId,title);
                        },
                        pause: function () {
                            spaModule.pause();
                        },
                        resume: function () {
                            var stack;

                            if (spaModule && (stack = spaModule.tab.stack) && stack.length) {
                                spaModule.resume(stack[stack.length - 1]);
                            }
                        },
                        open: function (response, tabUID) {
                            var elem=map[tabUID],
                                domID;

                            if(response.url && (domID=elem.id)){
                                spaModule.tab.setPageCache(domID,response,elem);
                            }else{
	                            response = $.extend(true, {
		                            page: 'error#404'
	                            }, elem,response);

	                            spaModule.open(response);
                            }
                        },
                        destroy: function () {
                            spaModule.tab.destroy();
                        },
                        // 一个行为类型方法的 实现
                        display: function (result, input1, input2, condition) {
                            this[result ? 'hide' : 'show']();
                        },
                        show: function () {
                            $ctt.removeClass('hide');
                        },
                        hide: function () {
                            $ctt.addClass('hide');
                        },

                        style: function (style) {
                            spaModule.tab.style(style);
                        },
                        navbarVisiable: function (visiable) {
                            spaModule.tab.navbarVisiable(visiable);
                        },
                        on:function () {
                            spaModule.on.apply(spaModule,arguments);
                        },
                        trigger:function (type) {
                            spaModule.trigger.apply(spaModule,arguments);
                        },
                        off:function () {
                            spaModule.off.apply(spaModule,arguments);
                        },
                        resize:function () {
                            var context  = spaModule.tab;
                            context.focusTab(context.$tabs.children('.active'));
                        }
                    };
                }else {
                    return {
                        destroy:function () {
                            
                        }
                    }
                }

            
        };

        return widget;
    });
})();