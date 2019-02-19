(function (undefined) {

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

        function render($widget, option, attr, css, auiCtx) {
            //初始化变量
            var timeStamp = '?version='+app.getUID(),
                baseHTML =
                '<div class="topNav">' +
                '<div class="logo"><img alt="logo" src=""/></div>' +
                '<div class="left-menus">' +
                '<div class="menu-1"><ul class="ul-1"></ul></div>' +
                '</div>' +
                '<div class="right-menus">' +
                '<div class="menu-1"><ul class="ul-1"></ul></div>' +
                '</div>' +
                '<div class="message-area"></div>' +
                '</div>',
                $img,$right_menus,$left_menus,$left_menu1,
                logo, alt, title, src, id,
                 returnData = null,
                  filterData = null,
                 setterData = null;

                $widget.html(baseHTML);
                $img = $widget.find('.logo img');
                $right_menus = $widget.find('.right-menus').eq(0);
                $left_menus = $widget.find('.left-menus').eq(0);
                $left_menu1 = $('.menu-1', $left_menus).eq(0);

            if (logo = option.logo) {
                src = logo.src+timeStamp;
                //i18n
                if (auiCtx) {
                    id = $widget.attr('id');
                    alt = $AW.nsl(logo.alt, id, auiCtx);
                    title = $AW.nsl(logo.title, id, auiCtx);
                }

                $img.attr({
                    src: src,
                    alt: alt,
                    title: title
                });

            }
        
            buildRightMenus($right_menus, option.preview_menu, 1, $widget, auiCtx);

            $left_menu1.addClass('layers-' + option.left_catalog.layers);


            buildLeftMenus($left_menus, option.left_catalog.menu, 1, $widget, auiCtx);
            buildMessArea($widget, option.message_area, auiCtx);
            //绑定css样式
            setCss($widget, css);
            //修正css样式
            correctCss($widget);


            $widget.find('.topNav').off('.menuClick').on('click.menuClick', 'a', function (e) {
                var $ul = $(this).closest('[id]');
                // if (setterData && setterData.left_catalog) {
                    var id = $ul.attr('id').substring(2);
                    returnData = getResultData(filterData, id);

                // } else {
                //     returnData = $(this).attr('href');
                // }
                if($ul.hasClass('hav-fake-sub')){
                    if(!$ul.hasClass('open-sub')){
                        $ul.addClass('open-sub');
                    }else{
                        $ul.removeClass('open-sub');
                    }
                }
            });

                return {
                    setter: function (value) {
                        if (value) {
                            setterData = value;

                            if (value.logo) {
                                $img.attr(value.logo);
                            }

                            if (value.preview_menu) {
                                filterData = value.preview_menu;
                                setRightMenus($widget, value.preview_menu, auiCtx);
                            }

                            if (value.left_catalog) {
                                filterData.concat(value.left_catalog);
                                setLeftMenus($widget, value.left_catalog, auiCtx);
                            }

                            if (!$.isEmptyObject(value.message_area)) {
                                buildMessArea($widget, value.message_area, auiCtx);
                            }

                            setCss($widget, css);
                            correctCss($widget);
                        }
                    },
                    getter: function () {
                        return returnData;
                    }
                }

        }

        function correctCss($widget) {
            var bbin = $widget.find('.right-menus ul.ul-1>li'),i,temp,sb;
            for ( i = 0; i < bbin.length - 1; i++) {
                 temp = bbin.eq(i);
                 sb = temp.find('.menu-2');
                sb.css('left', '-33px');
            }
            $widget.find('.left-menus .layers-3 ul.ul-1>li').hover(
                function () {
                    var height = $(this).find('.menu-2').height();
                    height && $(this).find('.menu-2-bg').eq(0).height(height);
                }, function () {
                });
        }

        function getResultData(dataArray, id) {
            if (!$.isArray(dataArray)) return;
            var ret;
            $.each(dataArray, function (i, data) {
                if (data.id === id) {
                    ret = data;
                    return false;
                }
            });
            return ret;
        }

        function setCss($widget, css) {
            if ($.isEmptyObject(css.style)) return;
            var $objs = {
                $nav: $widget.find('.topNav'),
                $logo: $widget.find('.logo'),
                $m: $widget.find('.topNav .message-area'),
                $ma: $widget.find('.topNav .message-area>a'),
                $maicon: $widget.find('.topNav .message-area>a>i'),
                $maqp: $widget.find('.topNav .message-area>div'),
                $maqpspan: $widget.find('.topNav .message-area>div>span')
            }, style = css.style,key,$obj,cssObj;

            //自定义样式
            if(css && css.cssCode && css.cssCode.className){
                $widget.addClass(css.cssCode.className)
            }

          for ( key in style) {
              if(style.hasOwnProperty(key)){
                   $obj = $objs['$' + key];
                   cssObj = style[key];
                  $obj && !$.isEmptyObject(cssObj) && $obj.css(cssObj);
              }

            }

            style.nav &&  $objs.$nav.css(style.nav);
            style.logo && $objs.$logo.css(style.logo);

            style.rbtn && $AW.cssHover('.right-menus ul.ul-1>li.hasCircle>a',$widget,style.rbtn,'');
            style.rbtnicon && $AW.cssHover('.right-menus ul.ul-1>li.hasCircle>a>i:first-child',$widget,style.rbtnicon,'');
            style.rCirclebtn && $AW.cssHover('.right-menus ul.ul-1>li>a',$widget,style.rCirclebtn,'');
            style.rCirclebtnicon && $AW.cssHover('.right-menus ul.ul-1>li>a>i:first-child',$widget,style.rCirclebtnicon,'');
            style.rmenu2 && $AW.cssHover('.right-menus .menu-2',$widget,style.rmenu2,'');
            style.rmbtn && $AW.cssHover('.right-menus ul.ul-2>li>a',$widget,style.rmbtn,'');
            style.rmbtnicon && $AW.cssHover('.right-menus ul.ul-2>li>a>i:first-child',$widget,style.rmbtnicon,'');
            style.lbtn1 && $AW.cssHover('.left-menus ul.ul-1>li>a',$widget,style.lbtn1,'');
            style.lbtn1 && $AW.cssHover('.left-menus ul.ul-1>li i:last-child',$widget,style.lbtn1,'');
            style.lbtn32 && $AW.cssHover('.left-menus .layers-3 ul.ul-2>li>a',$widget,style.lbtn32,'');
            style.lbtn32icon && $AW.cssHover('.left-menus .layers-3 ul.ul-2>li>a>i:first-child',$widget,style.lbtn32icon,'');
            style.lbtn32bg && $AW.cssHover('.left-menus .layers-3 ul.ul-1>li>.menu-2-bg',$widget,style.lbtn32bg,'');
            style.lxl33 && $AW.cssHover('.left-menus .layers-3 .menu-3',$widget,style.lxl33,'');
            style.lxl33btn && $AW.cssHover('.left-menus .layers-3 .menu-3 ul.ul-3>li>a',$widget,style.lxl33btn,'');
            style.lxl22 && $AW.cssHover('.left-menus .layers-2 .menu-2',$widget,style.lxl22,'');
            style.lxl22btn && $AW.cssHover('.left-menus .layers-2 .menu-2 ul.ul-2>li>a',$widget,style.lxl22btn,'');



            //配置按钮hover样式
            style.lbtn1hover &&  $AW.cssHover('.left-menus ul.ul-1>li>a',$widget,style.lbtn1hover,':hover');
            style.lbtn32hover && $AW.cssHover('.left-menus .layers-3 ul.ul-2>li>a', $widget,style.lbtn32hover,':hover');
            style.lxl33btnhover && $AW.cssHover('.left-menus .layers-3 .menu-3 ul.ul-3>li>a',$widget, style.lxl33btnhover,':hover');
            style.lxl22btnhover && $AW.cssHover('.left-menus .layers-2 .menu-2 ul.ul-2>li>a', $widget,style.lxl22btnhover,':hover');
            style.rbtnhover &&  $AW.cssHover('.right-menus ul.ul-1>li.hasCircle:hover', $widget,style.rbtnhover,'>a');
            style.rmbtnhover && $AW.cssHover('.right-menus ul.ul-2>li:hover', $widget,style.rmbtnhover,'>a');
            style.rbtniconhover && $AW.cssHover('.right-menus ul.ul-1>li.hasCircle:hover>a>i', $widget,style.rbtniconhover,':first-child');
        }

        function buildRightMenus($widget, menu, layer, $selector, auiCtx) {
            if (!menu) return;
            //在IDE时调用的
            var $warp = $widget.find('ul.ul-' + layer), id;
            //i18n
            if (auiCtx) {
                id = $selector.attr('id');
                $.each(menu, function (i, val) {
                    var $li = $('<li class="'+(!val.noCircle?'hasCircle':'')+'"><a '+(val.name ? 'title="'+$AW.nsl(val.name, id, auiCtx)+'"' :'')+'href="javascript:void(0)" id="' + val.id + '"><i class="' + (val.icon ? val.icon : 'fa fa-navicon') + '"></i>' +  ((val.name && !val.noCircle)?  '<span>' + $AW.nsl(val.name, id, auiCtx)+ '</span>' : '')  + '<i class="fa"></i></a></li>');

                    $warp.append($li);
                    if (val.children) {
                        $li.addClass('hav-sub');
                        $li.append('<div class="submenu menu-' + (layer + 1) + '"><ul class="ul-' + (layer + 1) + '"></ul></div>');
                        buildRightMenus($li, val.children, layer + 1, $selector, auiCtx);
                    }
                });
            }

        }

        function buildLeftMenus($widget, menu, layer, widget, auiCtx) {
            var $warp = $widget.find('ul.ul-' + layer), id;
            if (!menu) return;
            //i18n
            if (auiCtx) {
                id = widget.attr('id');
                $.each(menu, function (i, val) {
                    var $li = $('<li><a href="javascript:void(0)"><i class="' + (val.icon ? val.icon : '') + '"></i><span>' + (val.name ? $AW.nsl(val.name, id, auiCtx) : '') + '</span><i class="fa"></i></a></li>');
                    $warp.append($li);
                    if (val.menu) {
                        $li.addClass('hav-sub');
                        $li.append('<div class="submenu menu-' + (layer + 1) + '"><ul class="ul-' + (layer + 1) + '"></ul></div>' + (layer == 1 ? '<div class="menu-2-bg"></div>' : ''));
                        buildLeftMenus($li, val.menu, layer + 1, widget, auiCtx);
                    }
                });
            }

        }

        function buildMessArea($widget, mess, auiCtx) {
            if (!mess) return;
            var title, content, id,t1,t2,$area;
            //i18n
            if (auiCtx) {
                id = $widget.attr('id');
                title = $AW.nsl(mess.name, id, auiCtx) + ($AW.nsl(mess.name, id, auiCtx) && '：');
                content = $AW.nsl(mess.text, id, auiCtx);
            }

             t1 = '<a href="javascript:void(0)"><i class="' + mess.icon + '"></i><span class="title">' + title + '</span><span>' + content + '</span></a>';
             t2 = '<div><span>' + title + '</span><hr><span>' + content + '</span></div>';
             $area = $widget.find('.message-area');
            $area.empty();
            $area.append(t1);
            (title || content) && $area.append(t2);
        }

        function setRightMenus($widget, preview_menu, auiCtx) {
            //加载setter时调用
            if (!preview_menu) return;
            var layer, id = $widget.attr('id'),
             $warp0 = $widget.find('.right-menus ul.ul-1').eq(0);
            $warp0.empty();
            $.each(preview_menu, function (i, menu) {
                var $warp = $warp0,$parentli,$subul,li;
                if (menu.pid) {
                     $parentli = $widget.find('li#id' + menu.pid);//父菜单
                    //根据父菜单，求此菜单属于第几级
                    layer = parseInt($parentli.parent().attr('class')[3],10) + 1;
                     $subul = $parentli.find('ul.ul-' + layer);//父菜单下子菜单的ul，用来是否已经有子菜单
                    if (!$subul.length) {
                        $parentli.addClass('hav-sub');

                        if(!menu.noCircle){
                            $parentli.addClass('hasCircle');
                        }
                        $parentli.append('<div class="submenu menu-' + layer + '"><ul class="ul-' + layer + '"></ul></div>');
                    }
                    $warp = $parentli.find('ul.ul-' + layer).eq(0);
                }

                 li = '<li  id="id' + menu.id + '"><a '+(menu.name ? 'title="'+$AW.nsl(menu.name, id, auiCtx)+'"' :'')+' href="' + menu.value + '"><i class="' + (menu.icon ? menu.icon : '') + '"></i>' + ((menu.name && !menu.noCircle) ? '<span>' + $AW.nsl(menu.name, id, auiCtx) + '</span>' : '') + '<i class="fa"></i></a></li>';
                $warp.append(li);
            });
        }

        function setLeftMenus($widget, left_catalog, auiCtx) {
            //加载setter时调用
            if (!left_catalog) return;
            var islayers3 = false, layer, id = $widget.attr('id'),
                $warp0 = $widget.find('.left-menus ul.ul-1').eq(0),
                $warp, $parentli, i, menu, li,
                catalogMap = {}, catalogList;


            $warp0.empty();


            left_catalog.sort(function (a, b) {
                return parseInt(a.seq, 10) - parseInt(b.seq, 10);
            });

            for (i = -1; menu = left_catalog[++i];) {
                (catalogMap[menu.pid] || (catalogMap[menu.pid] = {
                    children: []
                })).children.push(menu);
            }

            left_catalog = catalogMap[""].children;

            for (i = -1; menu = left_catalog[++i];) {
                $warp = $warp0;
                $parentli = $widget.find('li#id' + menu.pid);

                if (menu.pid && $parentli.length) {
                    //根据父菜单，求此菜单属于第几级
                    layer = parseInt($parentli.parent().attr('class')[3],10) + 1;
                    if (layer >= 3) {
                        islayers3 = true;
                    }
                    var $subul = $parentli.find('ul.ul-' + layer);//父菜单下子菜单的ul，用来是否已经有子菜单

                    if (!$subul.length) {
                        $parentli.addClass('hav-sub');
                        $parentli.append('<div class="submenu menu-' + layer + '"><ul class="ul-' + layer + '"></ul></div>' + (layer === 2 ? '<div class="menu-2-bg"></div>' : ''));
                    }
                    $warp = $parentli.find('ul.ul-' + layer).eq(0);
                }


                if (!menu.pid || $parentli.length) {

                    li = '<li class="'+(menu.isParent? 'hav-fake-sub':'')+'" id="id' + menu.id + '"><a href="javascript:void(0)"><i class="' + (menu.icon ? menu.icon : '') + '"></i>' + (menu.name ? '<span>' + $AW.nsl(menu.name, id, auiCtx) + '</span>' : '') + '<i class="fa"></i></a></li>';

                    $warp.append(li);

                } else {
                    left_catalog.push(menu);
                }

                if (catalogMap[menu.id]) {
                    left_catalog = left_catalog.concat(catalogMap[menu.id].children);
                }
            }
            if (islayers3) {
                $widget.find('.left-menus .menu-1').addClass('layers-3');
            } else {
                $widget.find('.left-menus .menu-1').addClass('layers-2');
            }
        }


        widget.component.topNav = function ($selector,option,attr,css,auiCtx) {



                var ret = render( $selector, option, attr, css, auiCtx);

                return {

                    destroy: function () {
                    },

                    getter: ret.getter,

                    setter: ret.setter,

                    setRightMenu:function (btnId) {

                    },

                    setLogo:function (obj) {
                        var $img = $widget.find('.logo img');

                        $img.attr({
                            src: obj.src,
                            alt: obj.alt,
                            title: obj.title
                        });
                        if(obj.css && obj.css.width && obj.css.height){
                            $img.css({width:obj.css.width,height:obj.css.height});
                        }
                        $img.parent('.logo').css(obj.css);
                    },
                    setBadge:function (selector,isClean) {
                        var badge = '<span class="topNav-badge"><i></i></span>',
                            $selector = $((selector.indexOf('#')===-1) ? '#'+selector:selector,$selector);

						if($selector.length&&$selector.find('i:first-child').length){
                            if (isClean) {
                                $selector.find('i:first-child').empty();
                            } else {
                                $selector.find('i:first-child').empty().append(badge);
                            }
						}
                    },

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
