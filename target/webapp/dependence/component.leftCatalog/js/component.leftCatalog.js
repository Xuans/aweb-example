(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "slimScroll"], factory);
        }
        // global
        else {
            factory();
        }

    })
        (function ($, widget) {
            "use strict";
            var left_catalog = [{
                id: "63",
                pid: "",
                name: "用户管理",
                value: "",
                state: "1",
                remark: "1",
                seq: "0",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "66",
                pid: "63",
                name: "角色列表",
                value: "",
                state: "1",
                remark: "1",
                seq: "0",
                icon: "fa fa-user",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "69",
                pid: "63",
                name: "用户列表",
                vale: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-user",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "631",
                pid: "69",
                name: "用户列表",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-user",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "632",
                pid: "69",
                name: "用户列表",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-user",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "6311",
                pid: "631",
                name: "用户列表",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "6312",
                pid: "631",
                name: "用户列表",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "63121",
                pid: "6311",
                name: "用户列表",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "63121",
                pid: "6312",
                name: "第五级",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "63122",
                pid: "6312",
                name: "用户列表",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "146",
                pid: "",
                name: "自由布局",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "88",
                pid: "90",
                name: "自由布局",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "89",
                pid: "146",
                name: "自由布局",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }, {
                id: "90",
                pid: "146",
                name: "自由布局",
                value: "",
                state: "1",
                remark: "1",
                seq: "1",
                icon: "fa fa-laptop",
                lang: "zh_cn",
                type: "left_catalog"
            }],
                catalogSourceData,
                clickMenuId = null,
                clickMenuValue = null,
                clickMenuNode = null,

            // 渲染出目录htlm结构
               renderCatalog = function (left_catalog) {
                var  tree, html,
                    menu_container = '<div class="left-menu left-catalog-bootstrap">_LEFT_MENU_</div>',
                    first_ul = '<ul class="first-grade" data-CataId="-1">_CHILD_</ul>',
                    ul_tem = '<div id="_CHILD_ID_" class="collapse child-wrap"><ul class="_GRADE_">_CHILD_LI_</ul></div>',
                    ul_tem_fourth = '<div class="ul-fourth"><ul class="_GRADE_"><i class="arrow-left"></i>_CHILD_LI_</ul></div>',
                    li_template = '' +
                        '<li>' +
                        '<a href="_HREF_VALUE_" id="_MENU_ID_" data-toggle="collapse" aria-expanded="false">' +
                        '_FIRST_ICON_TEM_' +
                        '<span>_CATA_NAME_</span>' +
                        '_ASIGE_ICON_TEM_' +
                        '</a>' +
                        '_CHILD_' +
                        '</li>',
                    first_icon_tem = '<i class="fa _CATA_ICON_  first-grade-icon"></i>',
                    aside_ange_icon_tem = '<i class="fa _ASIGE_ICON_  aside-angle"></i>',
                    grade_class = ['first-grade', 'second-grade', 'third-grade', 'fourth-grade', 'fifth-grade'],

                    // 根据目录数据(数组对象)生成 以目录为节点的树结构
                     createData =   function (left_catalog) {
                        var cataData = [],
                            initData,
                            grade = 0,
                            data = [],
                            creTree = function(node) {
                            var curNode = {
                                    self: '',
                                    child: []
                                },
                                self,
                                first_icon = '',
                                aside_icon = '',
                                cruId,
                                i;

                            self = li_template;
                            grade += 1;

                            self = self.replace(/_CATA_NAME_/, node.name);
                            self = self.replace(/_GRADE_/, grade_class[grade]);
                            self = self.replace(/_MENU_ID_/, node.id);

                            if (grade <= 3) {

                                first_icon = first_icon_tem.replace(/_CATA_ICON_/, node.icon);

                            } else {
                                first_icon = '<i class="first-grade-icon"></i>';
                            }

                            self = self.replace(/_FIRST_ICON_TEM_/, first_icon);
                            cruId = node.id;

                            for (i = 0; i < initData.length; i++) {

                                if (initData[i].pid === cruId) {
                                    curNode.child.push(creTree(initData[i]));
                                }
                            }


                            if (curNode.child.length === 0) {
                                self = self.replace(/_HREF_VALUE_/, "#");
                                aside_icon = '';

                            } else if (grade <= 2) {
                                aside_icon = aside_ange_icon_tem.replace(/_ASIGE_ICON_/, 'fa-angle-down');


                            } else {
                                aside_icon = aside_ange_icon_tem.replace(/_ASIGE_ICON_/, 'fa-ellipsis-v');


                            }
                            self = self.replace(/_ASIGE_ICON_TEM_/, aside_icon);
                            curNode.self = self;
                            grade -= 1;
                            return curNode;
                        };

                        if (left_catalog === null || Object.prototype.toString.call(left_catalog) !== '[object Array]') return;
                        initData = [].slice.call(left_catalog);

                        $.each(left_catalog, function (index, ele) {
                            if (!ele.pid) {
                                data.push(creTree(ele, left_catalog));
                            }
                        });

                        return data;
                    },
                    //根据树节点生成 html
                     creHtml = function(tree) {
                        var initHtml = first_ul,
                            result = '',
                            grade = 0, // 记录目录树层级
                             getChildHtml = function(node) {

                                var child = '',
                                  childID = Math.random().toString(36).substr(2);
                                grade += 1;
                                if (node.child.length) {
                                    $.each(node.child, function (index, e) {
                                        child += getChildHtml(e);
                                    });

                                    // ul_tem 占位符转换
                                    var ul = grade >= 3 ? ul_tem_fourth : ul_tem;

                                    child = ul.replace(/_CHILD_LI_/, child);
                                    child = child.replace(/_CHILD_ID_/, childID);
                                    child = child.replace(/_GRADE_/, grade_class[grade]);


                                    node.self = node.self.replace(/_HREF_VALUE_/, '#' + childID);
                                }

                                grade -= 1;
                                return node.self.replace(/_CHILD_/, child);

                            };


                        $.each(tree, function (index, e) {
                            result += getChildHtml(e);

                        });

                        return initHtml.replace(/_CHILD_/, result);
                    };

                    left_catalog = left_catalog.sort(function (a, b) {
                        var ret, aItem = a, bItem = b;
                        a = a.pid;
                        b = b.pid;
                        if (!a && !b) {
                            ret = 0;
                        } else if (!a) {
                            ret = -1;
                        } else if (!b) {
                            ret = 1;
                        } else {
                            ret = parseInt(a, 10) - parseInt(b, 10);
                        }
                        if (!ret) {
                            ret = parseInt(aItem.seq, 10) - parseInt(bItem.seq, 10);
                        }
                        return ret;
                    });
                    tree = createData(left_catalog);
                    html = creHtml(tree);
                    html = menu_container.replace(/_LEFT_MENU_/, html);
                     return html;
                },

                renderLittleCatalog = function (left_catalog) {
                    var i, item, html = ['<div class="slim-left-menu"><ul>'];

                    for (i = -1; item = left_catalog[++i];) {
                        if (!item.pid) {
                            html.push('<li title ="' + item.name + '"><i class="' + item.icon + '"></i></li>')
                        }
                    }
                    html.push('</ul></div>');

                    return html.join('');
                },

                addEventForSlimLeft = function ($selector) {
                    $('.slim-left-menu', $selector).off('.slim').on('click.slim', function (e) {
                        var $target = $(e.srcElement || e.target).closest('li'),
                            $leftMenu = $selector.find('.left-menu'),
                            $slimLeft = $selector.find('.slim-left-menu'),
                            $scrollDiv = $selector.find('.slimScrollDiv');

                        if ($target.length) {
                            $selector.css({ 'left': '-120px' });
                            $slimLeft.hide();
                            $leftMenu.add($scrollDiv).show();
                            $selector.css('width', '184px').animate({ 'left': '0px' });

                        }
                    })
                },

                addEventForBigLeft = function ($selector, option,data) {
                    // 绑定事件
                    $('.left-menu', $selector).off('.leftCatalog').on('click.leftCatalog', function (e) {
                        var $target = $(e.target || event.srcElement),
                            $curTarget,
                            $angle,
                            $select_on,
                            $slimLeft = $selector.find('.slim-left-menu'),
                            $leftMenu = $selector.find('.left-menu'),
                            $scrollDiv = $selector.find('.slimScrollDiv');

                        //自动收展
                        if (($curTarget = $target.closest('a')).length) {
                            $angle = $curTarget.find('.aside-angle');

                            var $aside;
                            if (($aside = $curTarget.closest('.first-grade').parent()).length) {
                                app.scrollTop($aside, $curTarget, 500, 0);
                            }

                            if (option.autoShow) {
                                if ($angle.hasClass('fa-angle-up')) {
                                    var $others = $angle.parent('a').parent('li').siblings();
                                    $others.each(function (index, value) {
                                        $(value)
                                    });
                                    $others.children('li').children('a').children('.aside-angle').removeClass('fa-angle-down').addClass('fa-angle-up');
                                }

                                if ($angle.hasClass('fa-angle-down')) {
                                    var $others = $angle.parent('a').parent('li').siblings();
                                    $others.children('a').addClass('collapsed');
                                    $others.children('div').removeClass('in');
                                    $others.children('div').css({
                                        "style": "height: 0px;"
                                    });
                                    $others.children('a').children('.aside-angle').removeClass('fa-angle-up').addClass('fa-angle-down');
                                }
                            }


                            // 转换angle方向 若没有angle就不用执行
                            $angle.hasClass('fa-angle-down') ?
                                $angle.removeClass('fa-angle-down').addClass('fa-angle-up') :
                                $angle.hasClass('fa-angle-up') && $angle.removeClass('fa-angle-up').addClass('fa-angle-down');


                            // 选中目录
                            if ($select_on = $('.select-on', $selector)) {
                                $select_on.removeClass('select-on');
                                $select_on = null;
                            }
                            $curTarget.addClass('select-on');

                            clickMenuId = $curTarget.attr('id');

                            if (option.collapseOpen && !$curTarget.children('.aside-angle').length) {
                                $selector.css('width', '64px');
                                $leftMenu.add($scrollDiv).hide();
                                $slimLeft.show();
                            }

                            // 设置clickMenuNode

                            $.each(data, function (index, value) {
                                if (value.id === clickMenuId) {
                                    clickMenuNode = value;
                                }
                            });

                            clickMenuValue = clickMenuNode ? clickMenuNode.value : '';
                        }

                        if (($curTarget = $target.closest('li')).length && $curTarget.parent().hasClass('third-grade')) {
                            var $list = $curTarget.find('ul').filter(':first').addClass('show'),
                                $parent = $curTarget,
                                style = app.position(e, $target, $list),
                                documentHeight, listHeight, menuWidth, offsetTop;


                            documentHeight = $(document).height();
                            listHeight = $list.height();
                            menuWidth = $selector.width();
                            offsetTop = $parent.offset().top;

                            if ((listHeight + offsetTop) > documentHeight) {

                                style.top = documentHeight - listHeight;

                            } else {
                                style.top = style.top + 40
                            }
                            style.left = menuWidth;
                            $list.css(style);
                        }
                    });
                    // 五级菜单 hover
                    $selector.on('mouseenter', '.fourth-grade li ', function (e) {
                        var $curTarget = $(e.currentTarget), $list, offsetTop, height, documentHeight;
                        $list = $curTarget.closest('li').find('ul').filter(':first');

                        offsetTop = $list.parent().offset() && $list.parent().offset().top;
                        height = $list.height();
                        documentHeight = $(document).height();
                        if ((offsetTop + height) > documentHeight) {
                            $list.css({ 'top': -(height - 40) });
                        } else {
                            $list.css('top', '');
                        }
                        $list.addClass('show');

                    });

                    // 四级菜单离开
                    $selector.on('mouseleave', '.third-grade>li', function (e) {

                        var $curTarget = $(e.currentTarget);

                        $('.fourth-grade').removeClass('show');
                    });

                    // 五级菜单离开
                    $selector.on('mouseleave', '.fourth-grade>li', function (e) {
                        var $curTarget = $(e.currentTarget);
                        $('.fifth-grade').removeClass('show');
                    });

                },

                // 渲染配置的css样式
                renderCss = function ($selector, cssObj ) {
                    var layoutObj, style, bubbleMenuObj,$parent = $selector.parent();

                    //美化左边菜单栏滚动条
                    $('.left-menu', $selector).slimScroll({
                        height: '100%',
                        width: 'auto',
                        color: '#fff',
                        opacity: .8 //滚动条透明度
                    });

                    //自定义样式
                    if (cssObj && cssObj.cssCode && cssObj.cssCode.className) {
                        $selector.addClass(cssObj.cssCode.className)
                    }
                    if (cssObj && (style = cssObj.style)) {
                        if (style.leftCatologLayout) {
                            layoutObj = JSON.parse(JSON.stringify(style.leftCatologLayout));
                            $selector.css(style.leftCatologLayout);
                            layoutObj['width'] && $('.left-menu', $selector).css({ 'width': layoutObj['width'] });
                        }
                        if (style.menu) {
                            $('.left-menu', $selector).css(style.menu);

                        }
                        style.menuHover && $AW.cssHover('.left-menu a', $parent, style.menuHover, ':hover');
                        style.selectedMenu && $AW.cssHover('.left-menu a.select-on.collapsed', $parent, style.selectedMenu, '');
                        style.showMenu && $AW.cssHover('.left-menu a.select-on', $parent, style.showMenu, '');
                        if (style.bubbleMenu) {
                            bubbleMenuObj = JSON.parse(JSON.stringify(style.bubbleMenu));
                            $AW.cssHover('.left-menu .fourth-grade a', $selector, style.bubbleMenu, '');
                            $AW.cssHover('.left-menu .fifth-grade a', $selector, style.bubbleMenu, '');
                            /*  $('.left-menu .fourth-grade li',$selector).css({'background-color':bubbleMenuObj['background-color']})*/
                        }
                        style.bubbleMenuHover && $AW.cssHover('.fifth-grade a', $parent, style.bubbleMenuHover, ':hover');
                        style.bubbleMenuHover && $AW.cssHover('.fourth-grade a', $parent, style.bubbleMenuHover, ':hover');
                        style.selectBubbleMenu && $AW.cssHover('.left-menu .fourth-grade a.select-on', $parent, style.selectBubbleMenu, '');
                    }

                },

                // 渲染组件 返回需要暴露的方法接口
                render = function ($selector, option, attr, css, auiCtx) {

                    var ret = {},

                    catalogSourceData = left_catalog;

                        // 刷新组件
                        ret.refresh = function (data) {

                            if (data === 'auiAjaxTest' || window.auiApp) {
                                data = left_catalog;
                            }

                            if (data) {
                                catalogSourceData = data;
                                if (option.collapseOpen) {
                                    $selector.empty().append($(renderLittleCatalog(data))).append($(renderCatalog(data)).hide());
                                } else {
                                    $selector.empty().html(renderCatalog(data));
                                }
                                renderCss($selector, css);

                                if (option.collapseOpen) {
                                    $selector.find('.slimScrollDiv').hide();
                                    addEventForSlimLeft($selector);
                                }
                                addEventForBigLeft($selector, option,catalogSourceData);

                            }


                        };

                        // 获取点击menu元素id
                        ret.getClickId = function () {
                            var id = clickMenuId;
                            clickMenuId = null;
                            return id;
                        };

                        ret.getClickNode = function () {
                            var node = clickMenuNode;
                            clickMenuNode = null;
                            return node;
                        };
                        ret.getClickValue = function () {
                            var value = clickMenuValue;
                            clickMenuValue = null;
                            return value;
                        };

                        /**
                         * 设置左侧菜单 .left-menu容器样式
                         * @param {obj} cssObj = {cssName:value}
                         * exam : {background:black,width:'200px',height:'800px'}
                         */
                        ret.setMenuContainerCss = function (cssObj) {
                            $selector.css(cssObj);
                        };

                        ret.toggleLeftMenu = function () {
                            var $slimLeft = $selector.find('.slim-left-menu'),
                                $leftMenu = $selector.find('.left-menu'), dtd,
                                $scrollDiv = $selector.find('.slimScrollDiv');

                            if ($slimLeft.css('display') === 'block') {
                                $selector.css({ 'left': '-120px' });
                                $slimLeft.hide();
                                $leftMenu.add($scrollDiv).show();
                                $selector.css('width', '184px').animate({ 'left': '0px' });

                            } else {

                                $selector.css('width', '64px');
                                $leftMenu.add($scrollDiv).hide();
                                $slimLeft.show();
                            }

                        };
                        ret.getCurrentStatus = function () {
                            var $slimLeft = $selector.find('.slim-left-menu');
                            if ($slimLeft.css('display') === 'block') {
                                return false;
                            } else {
                                return true;
                            }
                        };

                    if(window.auiApp){
                        ret.refresh('auiAjaxTest');
                    }

                    return ret;
                };


            widget.component.leftCatalog = function ($selector,option,attr,css,auiCtx) {

                var  ret = render($selector, option, attr, css, auiCtx);

                return {
                    refresh: ret.refresh,
                    getClickValue: ret.getClickValue,
                    getClickNode: ret.getClickNode,
                    getClickId: ret.getClickId,
                    setMenuContainerCss: ret.setMenuContainerCss,
                    toggleLeftMenu: ret.toggleLeftMenu,
                    getCurrentStatus: ret.getCurrentStatus,

                    display: function (result, input1, input2, condition) {
                        this[result ? 'hide' : 'show']();
                    },
                    show: function () {
                        $selector.removeClass('hide');
                    },
                    hide: function () {
                        $selector.addClass('hide');
                    }
                }

            };
        });
})();