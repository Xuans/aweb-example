/**
 * @author hefuxiang@agree.com.cn
 */
( /* <global> */ function (undefined) {

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

            //dropdown
            !function ($) {

                "use strict"; // jshint ;_;


                /* DROPDOWN CLASS DEFINITION
                 * ========================= */

                var toggle = '[data-toggle=dropdown]'
                    , Dropdown = function (element) {
                        var $el = $(element).on('click.dropdown.data-api', this.toggle);
                        $('html').on('click.dropdown.data-api', function () {
                            $el.parent().removeClass('open')
                        })
                    };

                Dropdown.prototype = {

                    constructor: Dropdown

                    , toggle: function (e) {
                        var $this = $(this)
                            , $parent
                            , isActive;

                        if ($this.is('.disabled, :disabled')) return;

                        $parent = getParent($this);

                        isActive = $parent.hasClass('open');

                        clearMenus();

                        if (!isActive) {
                            if ('ontouchstart' in document.documentElement) {
                                // if mobile we we use a backdrop because click events don't delegate
                                $('<div class="dropdown-backdrop"/>').insertBefore($(this)).on('click', clearMenus)
                            }
                            $parent.toggleClass('open')
                        }

                        $this.focus();

                        return false
                    }

                    , keydown: function (e) {
                        var $this
                            , $items
                            , $active
                            , $parent
                            , isActive
                            , index;

                        if (!/(38|40|27)/.test(e.keyCode)) return;

                        $this = $(this);

                        e.preventDefault();
                        e.stopPropagation();

                        if ($this.is('.disabled, :disabled')) return;

                        $parent = getParent($this);

                        isActive = $parent.hasClass('open');

                        if (!isActive || (isActive && e.keyCode == 27)) {
                            if (e.which == 27) $parent.find(toggle).focus();
                            return $this.click()
                        }

                        $items = $('[role=menu] li:not(.divider):visible a', $parent);

                        if (!$items.length) return;

                        index = $items.index($items.filter(':focus'));

                        if (e.keyCode == 38 && index > 0) index--;                                        // up
                        if (e.keyCode == 40 && index < $items.length - 1) index++;                        // down
                        if (!~index) index = 0;

                        $items
                            .eq(index)
                            .focus()
                    }

                };

                function clearMenus() {
                    $('.dropdown-backdrop').remove();
                    $(toggle).each(function () {
                        getParent($(this)).removeClass('open')
                    })
                }

                function getParent($this) {
                    var selector = $this.attr('data-target')
                        , $parent;

                    if (!selector) {
                        selector = $this.attr('href');
                        selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, ''); //strip for ie7
                    }

                    $parent = selector && $(selector);

                    if (!$parent || !$parent.length) $parent = $this.parent();

                    return $parent
                }


                /* DROPDOWN PLUGIN DEFINITION
                 * ========================== */

                var old = $.fn.dropdown;

                $.fn.dropdown = function (option) {
                    return this.each(function () {
                        var $this = $(this)
                            , data = $this.data('dropdown');
                        if (!data) $this.data('dropdown', (data = new Dropdown(this)));
                        if (typeof option === 'string') data[option].call($this)
                    })
                };

                $.fn.dropdown.Constructor = Dropdown;


                /* DROPDOWN NO CONFLICT
                 * ==================== */

                $.fn.dropdown.noConflict = function () {
                    $.fn.dropdown = old;
                    return this
                };


                /* APPLY TO STANDARD DROPDOWN ELEMENTS
                 * =================================== */

                $(document)
                    .on('click.dropdown.data-api', clearMenus)
                    .on('click.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
                    .on('click.dropdown.data-api', toggle, Dropdown.prototype.toggle)
                    .on('keydown.dropdown.data-api', toggle + ', [role=menu]', Dropdown.prototype.keydown)

            }(window.jQuery);

            function render($widget, $selector, option, attr, event, css, auiCtx, oWidget) {
                //添加li

                var
                    ulTemp = '<div class="drawdown-memu-container"><button type="button" class="btn  dropdowns"><span>_name_</span></button><ul class="dropdown-menu"></ul></div>',
                    liTemp = '<li><button type="button" class="btn">_name_</button></li>',
                    iconTemp = '<i class="_icon_"></i>',
                    classname,
                    classRegExp = /medium-\d+/,
                    $ul, $button,
                    index = 1,
                    style, theme,
                    dropdownBtnName = option.name || attr.desp,
                    addLi = function ($ul, btnConfig) {
                        var temp, btnName = btnConfig.name || ('button' + index),$btn,btnText;

                        temp = liTemp.replace(/_name_/, btnName);
                        $ul.append(temp);
                        $btn = $ul.find('li:last button');

                        btnConfig.id && $btn.attr('id', btnConfig.id);
                        btnConfig.disabled && $btn.attr('disabled', btnConfig.disabled);

                        if (auiCtx) {
                            btnName = $AW.nsl(btnConfig.name, $selector.attr('id'), auiCtx);
                        }
                        if (btnConfig.useIcon && btnConfig.icon) {
                             btnText = $btn.html();

                            temp = iconTemp.replace(/_icon_/, btnConfig.icon);

                            //图标在右边
                            if (btnConfig.iconPosition === 1) {
                                $btn.html(btnText + temp);
                                $('i', $btn).css({
                                    'padding-left': '8px',
                                    'float': 'right'
                                });
                                //    $btn.css('text-align', 'right');
                            } else {
                                //图标在左边
                                $btn.html(temp + btnText);
                                $('i', $btn).css({
                                    'padding-right': '8px',
                                    'float': 'left'
                                });
                            }
                        }
                    },
                    //初始化
                    init = function () {
                    var $toggleBtn,btnText,temp,i,btnConfig;
                        if (option.useIcon && option.icon) {
                             $toggleBtn = $('div>button', $selector);
                             btnText = $toggleBtn.html();

                             temp = iconTemp.replace(/_icon_/, option.icon);
                            //图标在右边
                            if (option.iconPosition === 1) {
                                $toggleBtn.html(btnText + temp);
                                $toggleBtn.find('i').css({
                                    'padding-left': '8px',
                                    'float': 'right'
                                });
                            } else {
                                //图标在左边
                                $toggleBtn.html(temp + btnText);
                                $toggleBtn.find('i').css({
                                    'padding-right':'8px',
                                    'float':'left'
                                });
                            }
                        }

                        $ul = $selector.find('ul');

                        if (option.buttonGroup) {
                            for ( i = 0; i < option.buttonGroup.length; i++) {
                                btnConfig = option.buttonGroup[i];
                                addLi($ul, btnConfig);
                            }
                        }

                        //处理按钮位置
                        if (option.btnLocation) {
                            $selector.css('text-align', option.btnLocation);
                        }

                        //注册事件
                        registerEvent();
                    },
                    //注册事件
                    registerEvent = function () {
                        //按钮点击显示列表或收起
                        $selector.find('.drawdown-memu-container .dropdowns').off('click.toggle.dropdownMenu').on('click.toggle.dropdownMenu', function () {
                            var $parent = $(this).parent('div'),
                                namespace = 'click.' + app.getUID(),
                                twice = false;

                            $parent.toggleClass('open');

                            if ($parent.hasClass('open')) {
                                $(document).on(namespace, function (e) {
                                    if (twice && !$(e.target).closest($parent).length) {
                                        $parent.removeClass('open');

                                        $(document).off(namespace);
                                    }

                                    if (!twice) {
                                        twice = true;
                                    }
                                });
                            }
                        });

                        //选中li后，收起列表
                        /*   $('ul>li>button', $selector).off('click.hide.dropdownMenu').on('click.hide.dropdownMenu', function() {
                         $(this).closest('.drawdown-memu-container').removeClass('open');
                         });*/

                        //选中li后，收起列表
                        $('.dropdown-menu', $selector).off('click.hide.dropdownMenu').on('click.hide.dropdownMenu', function (e) {
                            var $target = $(e.target || window.event.srcElement),
                                $click = $target.closest('button');

                            if ($click.length) {
                                $click.closest('.drawdown-memu-container').removeClass('open');
                                $('.dropdown-menu button', $selector).removeClass('current-btn');
                                $click.addClass('current-btn');
                            }

                        });
                    };
                //i18n
                    if (auiCtx) {
                        dropdownBtnName = $AW.nsl(dropdownBtnName, $selector.attr('id'), auiCtx);
                    }
                    ulTemp = ulTemp.replace(/_name_/, dropdownBtnName);


                    classname = $selector.attr("class");

                    if (classRegExp.test(classname)) {
                        $selector.attr("class", classname.replace(classRegExp, "medium-" + option.span));
                    } else {
                        $selector.addClass("medium-" + option.span);
                    }

                    $selector.addClass("columns");

                    $selector.append(ulTemp);

                    attr.id && $('div', $selector).attr('id', attr.id);

                    init();


                //样式处理
                $ul = $selector.find('ul');
                $button = $selector.find("button");
                if (css && css.theme) {
                    theme = css.theme;
                    if (theme['function']) {
                        $button.removeClass().addClass("btn " + theme['function']);

                        $($button[0]).addClass("dropdowns");
                    }
                }
                //自定义样式
                if (css && css.cssCode && css.cssCode.className) {
                    $selector.addClass(css.cssCode.className)
                }
                if (css && (style = css.style)) {
                    style.backgroundColor && $ul.css(style.backgroundColor);
                    $AW.cssHover('.drawdown-memu-container .btn', $selector, $.extend({}, style.icon, style.border, style.font, style.size, style.backgroundColor), '');
                    style.hoverBtn && $AW.cssHover('.drawdown-memu-container .btn', $selector, style.hoverBtn, ':hover');
                    style.hoverBtn && $AW.cssHover(' .drawdown-memu-container ul>li .btn', $selector, style.hoverBtn, ':hover');

                    style.activeBtn && $AW.cssHover('.drawdown-memu-container .btn', $selector, style.activeBtn, ':active');
                    style.activeBtn && $AW.cssHover('.drawdown-memu-container ul>li .btn', $selector, style.activeBtn, ':active');
                    if (theme && theme['function']) {
                        style.selectedBtn && $AW.cssHover('.drawdown-memu-container ul>li  .' + theme['function'] + '.current-btn', $selector, style.selectedBtn, '');
                    }

                }

                return {
                    display: function (result, input1, input2, condition) {
                        this[result ? 'hide' : 'show']();
                    },
                    show: function () {
                        $selector.removeClass('hide');
                    },
                    hide: function () {
                        $selector.addClass('hide');
                    },
                    initBtn: function (data) {
                        /*var data = [{
                                name:'下载',
                                id:'downloadBtn',
                                disabled:false,         //按钮是否置灰,值为true或false
                                useIcon:false,          //按钮是否配置图标,值为true或false
                                icon:'fa fa-right',
                                iconPosition:1       //0代表图标位置在左边，1代表图标在右边
                            }];*/
                        var i = 0,
                            item;

                        if (data && data.length) {

                            $ul.empty();
                            for (i; i < data.length; i++) {
                                item = data[i];
                                addLi($ul, item);
                            }
                        }

                    },
                    getCurrentBtn: function () {
                        var $btn = $('.dropdown-menu .current-btn', $selector),
                            id = $btn.attr('id'),
                            name = $btn.text();

                        return {
                            id: id,
                            name: name
                        }
                    },
                    getter: function () {
                        return {
                            icon: option.icon,
                            name: option.name,
                            btnLocation: option.btnLocation,
                            iconPosition: option.iconPosition

                        };
                    },
                    setter: function (data) {
                        option.icon = data.icon;
                        option.name = data.name;
                        option.btnLocation = data.btnLocation;
                        option.iconPosition = data.iconPosition;
                        $selector.empty();
                        render($widget, $selector, option, attr, event, css, auiCtx, oWidget);
                    },
                    disabled: function (value) {
                        var $button = $selector.find('.dropdowns');
                        value ? $button.prop('disabled', true) : $button.prop('disabled', false);
                    }
                }
            }

            if (!widget.component.btn) {
                widget.component.btn = {};
            }
            widget.component.btn.dropdownBtn = function (obj, oOption, oAttr, oCss) {
                var oWidget, $widget, attr, option, css, event,
                    $selector, auiCtx;

                auiCtx = arguments[4];

                $selector = obj;
                option = oOption;
                attr = oAttr;
                css = oCss;

                /*编译阶段渲染代码*/
                return render($widget, $selector, option, attr, event, css, auiCtx, oWidget);

            };

            return widget;
        });
})();