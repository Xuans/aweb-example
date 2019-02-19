(function () {
    var setModalLgSize, modal;
    !function () {

        "use strict"; // jshint ;_;


        /* MODAL CLASS DEFINITION
         * ====================== */

        var Modal = function (element, options) {
                this.options = options;
                this.$element = $(element)
                    .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));
                this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
            },
            $window = $(window);

        Modal.prototype = {

            constructor: Modal

            ,
            toggle: function () {
                return this[!this.isShown ? 'show' : 'hide']()
            }

            ,
            show: function () {
                //  2015/9/28 14:55 lijiancheng@cfischina.com
                //  将遮罩层以及提示栏的z-index提高比弹窗（1050）更高的1052，可以让在使用弹窗的同时，正常使用遮罩以及提示栏。
                app.shelter.upperZIndex();

                var that = this,
                    e = $.Event('show'),

                    options = this.options,
                    $modal = this.$element,
                    modalUUID, resizeHandler,
                    theme;

                this.$element.trigger(e);

                //  2015/8/24 16:02 lijiancheng@cfischina.com
                //  修复modal无法显示的问题
                this.$element.removeClass('hide');
                // 添加拖拽功能
                //this.$element.draggable({handle:".modal-header"});
                //  添加resize功能
                //this.$element.resizable({ handles: "n, e, s, w" });

                if (this.isShown || e.isDefaultPrevented()) return;

                this.isShown = true;

                this.escape();

                this.backdrop(function () {
                    var transition = $.support.transition && that.$element.hasClass('fade');

                    if (!that.$element.parent().length) {
                        that.$element.appendTo(document.body); //don't move modals dom position
                    }

                    that.$element.show();

                    if (transition) {
                        that.$element[0].offsetWidth; // force reflow
                    }

                    that.$element
                        .addClass('in')
                        .attr('aria-hidden', false);

                    that.enforceFocus();

                    transition ?
                        that.$element.one($.support.transition.end, function () {
                            that.$element.focus().trigger('shown')
                        }) :
                        that.$element.focus().trigger('shown')
                });

                if (options.noFooter) {
                    $modal.children('.modal-footer').addClass('hide');
                } else {
                    $modal.children('.modal-footer').removeClass('hide');
                }

                if (options.isLargeModal && (options.width || options.height)) {
                    $modal.addClass('modal-lg');

                    modalUUID = app.getUID();
                    resizeHandler = function () {
                        var modalHeight, modalWidth, windowHeight, windowWidth,
                            modalCss = {},
                            modalBodyCss, modalBodyHeight;

                        if (options.width) {
                            windowWidth = $window.width();
                            if (options.width.indexOf('%') !== -1) {
                                modalWidth = (parseInt(options.width, 10) / 100 || .8) * windowWidth;
                            } else {
                                modalWidth = parseInt(options.width, 10) || windowWidth * .8;
                            }

                            modalWidth = Math.min(modalWidth, windowWidth);
                            modalWidth = Math.max(modalWidth, 0);

                            modalCss.width = modalWidth;

                            modalCss.left = windowWidth - modalWidth !== 0 ? Math.max(0, (windowWidth - modalWidth) / 2) : 0;

                            modalCss.marginLeft = 0;
                        }

                        if (options.height) {
                            windowHeight = $window.height();
                            if (options.height.indexOf('%') !== -1) {
                                modalHeight = (parseInt(options.height, 10) / 100 || .7) * windowHeight;
                            } else {
                                modalHeight = parseInt(options.height, 10) || windowHeight * .7;
                            }

                            modalHeight = Math.min(modalHeight, windowHeight);
                            modalBodyHeight = modalHeight - $modal.children('.modal-footer').height() * 3 - 10;


                            modalCss.height = modalBodyHeight;
                            modalCss.marginTop = 0;


                            setTimeout(function () {
                                $modal.css('top', windowHeight - modalHeight !== 0 ? (windowHeight - modalHeight) / 3 : 0);
                            }, 300);

                            modalBodyCss = {
                                maxHeight: modalBodyHeight,
                                minHeight: modalBodyHeight
                            };
                        }

                        if (options.noHeader) {
                            $modal.find('.modal-header>h4').text('');
                        }

                        if (options.noFooter) {
                            modalCss.paddingBottom = '.8em';
                        } else {
                            modalCss.paddingBottom = '';
                        }

                        $modal.css(modalCss);
                        if (modalBodyCss) {
                            $modal.children('.modal-body').css(modalBodyCss);
                        }
                    };

                    $window.on('resize.' + modalUUID, resizeHandler);
                    resizeHandler();

                    this.uuid = modalUUID;
                    this.resizeHandler = resizeHandler;
                }

                if (theme = window.$AW && window.$AW.ctn && window.$AW.ctn.modalCtn && $AW.ctn.modalCtn.theme) {
                    theme(this.$element);
                }

                $(window).trigger('resize');
            }

            ,
            hide: function (e) {
                //  2015/9/28 14:55 lijiancheng@cfischina.com
                //  将遮罩层以及提示栏的z-index提高比弹窗（1050）更高的1052，可以让在使用弹窗的同时，正常使用遮罩以及提示栏。
                app.shelter.lowerZIndex();
                e && e.preventDefault();

                var that = this;

                this.$element.css({
                    'top': ''
                });

                e = $.Event('hide');

                this.$element.trigger(e);

                if (this.uuid) {
                    $window.off('resize.' + this.uuid);
                    this.resizeHandler = null;
                }


                if (!this.isShown || e.isDefaultPrevented()) return;

                this.isShown = false;

                this.escape();

                $(document).off('focusin.modal');

                this.$element
                    .removeClass('in')
                    .attr('aria-hidden', true);

                $.support.transition && this.$element.hasClass('fade') ?
                    this.hideWithTransition() :
                    this.hideModal();

                $(window).trigger('resize');
            }

            ,
            enforceFocus: function () {
                // /*
                //  * lijiancheng@cfischina.com
                //  * date:2016/1/8 11:45
                //  * 修复bootstrap的bug，当同时出现两个modal的时候，会出现的死循环问题
                //  * */
                // var that = this,count=0;
                // $(document).on('focusin.modal', function (e) {
                // 	if (count<10&&that.$element[0] !== e.target && !that.$element.has(e.target).length) {
                // 		that.$element.focus();
                // 		count++;
                // 	}
                // })
            }

            ,
            escape: function () {
                var that = this;
                if (this.isShown && this.options.keyboard) {
                    this.$element.on('keyup.dismiss.modal', function (e) {
                        e.which == 27 && that.hide()
                    })
                } else if (!this.isShown) {
                    this.$element.off('keyup.dismiss.modal')
                }
            }

            ,
            hideWithTransition: function () {
                var that = this,
                    timeout = setTimeout(function () {
                        that.$element.off($.support.transition.end);
                        that.hideModal()
                    }, 500);

                this.$element.one($.support.transition.end, function () {
                    clearTimeout(timeout);
                    that.hideModal()
                })
            }

            ,
            hideModal: function () {
                var that = this;
                this.$element.hide();
                this.backdrop(function () {
                    that.removeBackdrop();
                    that.$element.trigger('hidden')
                })
            }

            ,
            removeBackdrop: function () {
                this.$backdrop && this.$backdrop.remove();
                this.$backdrop = null
            }

            ,
            backdrop: function (callback) {
                var that = this,
                    animate = this.$element.hasClass('fade') ? 'fade' : '';

                if (this.isShown && this.options.backdrop) {
                    var doAnimate = $.support.transition && animate;

                    this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
                        .appendTo(document.body);

                    this.$backdrop.click(
                        this.options.backdrop == 'static' ?
                            $.proxy(this.$element[0].focus, this.$element[0]) :
                            $.proxy(this.hide, this)
                    );

                    if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

                    this.$backdrop.addClass('in');

                    if (!callback) return;

                    doAnimate ?
                        this.$backdrop.one($.support.transition.end, callback) :
                        callback()

                } else if (!this.isShown && this.$backdrop) {
                    this.$backdrop.removeClass('in');

                    $.support.transition && this.$element.hasClass('fade') ?
                        this.$backdrop.one($.support.transition.end, callback) :
                        callback()

                } else if (callback) {
                    callback()
                }
            }
        };


        /* MODAL PLUGIN DEFINITION
         * ======================= */

        var old = $.fn.modal;

        $.fn.modal = function (option) {
            return this.each(function () {
                var $this = $(this),
                    data = $this.data('modal'),
                    options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option);
                if (!data) $this.data('modal', (data = new Modal(this, options)));
                if (typeof option == 'string') {
                    data[option]();
                } else if (options.show) {
                    data.options = options;
                    data.show();
                }
            })
        };

        $.fn.modal.defaults = {
            backdrop: true,
            keyboard: true,
            show: true
        };

        $.fn.modal.Constructor = Modal;


        /* MODAL NO CONFLICT
         * ================= */

        $.fn.modal.noConflict = function () {
            $.fn.modal = old;
            return this
        };


        /* MODAL DATA-API
         * ============== */

        $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
            var $this = $(this),
                href = $this.attr('href'),
                $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
                ,
                option = $target.data('modal') ? 'toggle' : $.extend({
                    remote: !/#/.test(href) && href
                }, $target.data(), $this.data());

            e.preventDefault();

            $target
                .modal(option)
                .one('hide', function () {
                    $this.focus()
                })
        })

    }(window.jQuery);
    modal = function () {
        var $body = $('body');
        var modalFooterTemp =
                '<div class="modal-footer">' +
                '<button type="button" data-role="confirm" class="btn btn-focus">_positive_</button>' +
                '<button type="button" data-role="ignore" class="btn btn-custom">_ignore_</button>' +
                '<button type="button" data-role="cancel" class="btn btn-normal">_negative_</button>' +
                '</div>',
            modalTemp = '<div class="modal hide fade">' +
                '<div class="modal-header"><h4 title="_title_">_title_</h4></div>' +
                '<div class="modal-body">_content_</div>' +
                modalFooterTemp +
                '</div>';

        var MODAL_LANG = {
                TITLE: '弹窗',
                CONTENT: '弹窗内容'
            },
            COMMON_LANG = {
                CONFIRM: '确定',
                CANCEL: '取消'
            },
            _default = {
                title: MODAL_LANG.TITLE, //弹窗标题，非必填
                content: MODAL_LANG.CONTENT, //弹窗内容 当是jquery对象是包裹一层，非必填
                btnConfirm: COMMON_LANG.CONFIRM, //确定按钮显示内容
                btnCancel: COMMON_LANG.CANCEL, //取消按钮显示内容
                btnIgnore: null, //忽略按钮显示内容
                init: null, //初始化函数
                confirmHandler: function () {
                }, //点击确定按钮触发的函数，参数以数组形式写在args那里
                cancelHandler: function () {
                }, //点击取消按钮触发函数，参数写在args那里
                ignoreHandler: null, //点击取消按钮触发函数，参数写在args那里
                args: [],
                isLargeModal: true,
                height: '80%',
                width: '80%',
                isDialog: true,
                backdrop: 'static',
                noFooter: false,
                noHeader: false
            };

        function modal(options) {
            var $modal,
                $header, $close, $full, isfull = false,
                html, context;

            options = $.extend(true, {}, _default, options);


            if ($.isFunction(options.content)) {
                $modal = options.content();

                if (options.reset) {
                    app.reset($modal);
                }

                if (options.title) {
                    $modal.closest('.modal').children('.modal-header').children('h4').attr('title', options.title).text(options.title);
                }
            }

            else {
                html = modalTemp.replace(/_title_/g, options.title)
                    .replace(/_content_/, $.isFunction(options.content) ? '_content_' : options.content)
                    .replace(/_positive_/, options.btnConfirm)
                    .replace(/_ignore_/, options.btnIgnore)
                    .replace(/_negative_/, options.btnCancel);

                $modal = $(html);

                if (!options.btnIgnore || !options.ignoreHandler) {
                    $modal.find('[data-role="ignore"]').remove();
                }

                if (options.isLargeModal) $modal.addClass('modal-lg');
                if (!options.isDialog) $modal.addClass('modal-config-mode');

                $modal.appendTo($body);
            }

            $modal.find('[data-role="confirm"]')[options.btnConfirm === false || options.btnConfirm === 'false' ? 'addClass' : 'removeClass']('hide');
            $modal.find('[data-role="cancel"]')[options.btnCancel === false || options.btnCancel === 'false' ? 'addClass' : 'removeClass']('hide');

            context = $modal.children('.modal-body').get(0);

            if ($.isFunction(options.init)) {
                options.init.apply(context, options.args);
            }

            $header = $modal.children('.modal-header');
            if ($header.length && !$header.find('.close').length) {
                $close = $('<button title="关闭" type="button" class="close iconfont icon-topbar-close"></button>');

                $header.prepend($close);

                $close.on('click.aweb4ModalCtn', function () {
                    var $modal = $(this).parent().parent('.modal');

                    if ($modal.length) {
                        $modal.modal('hide');
                    }
                    isfull && $full && $full.trigger('click.aweb4ModalCtn');

                });
            }

            if (options.isLargeModal && $header.length && !$header.find('.full').length) {
                $full = $('<button title="全屏切换" type="button" class="full fa fa-expand"></button>');

                $header.prepend($full);

                $full.on('click.aweb4ModalCtn', function () {
                    var $modal = $(this).parent().parent('.modal');
                    if ($modal.length) {
                        $modal.toggleClass('full');
                        $full.toggleClass('fa-compress');
                        isfull = !isfull;

                        $(window).trigger('resize');
                    }
                });

            }

            try {
                $modal.modal({
                    backdrop: options.backdrop,
                    keyboard: false,
                    show: true,
                    isLargeModal: options.isLargeModal,
                    height: options.height,
                    width: options.width,
                    noFooter: options.noFooter,
                    noHeader: options.noHeader
                });
            } catch (e) {

            }

            if (options.backdrop) {
                $modal.before('<div class="mask" style="z-index:' + (parseInt($modal.css('zIndex') || 1052, 10)) + '"/>');
            }


            if (!$modal.attr('data-wrap')) {
                $modal.one('hidden', function () {
                    if (options.backdrop) {
                        $modal.prev('.modal-backdrop').remove();
                        $modal.prev('.mask').remove();
                    }

                    $modal
                        .off('click', 'button')
                        .remove();

                    $modal = null;
                });

                if (!options.noFooter) {
                    $modal.on('click', '.modal-footer>button', function (e) {
                        var _$modal = $(e.target || event.srcElement).closest('.modal');
                        if (_$modal.is($modal)) {
                            var handler, result;
                            switch ($(this).attr('data-role')) {
                                case 'confirm':
                                    handler = options.confirmHandler;
                                    break;
                                case 'ignore':
                                    handler = options.ignoreHandler;
                                    break;
                                default:
                                    handler = options.cancelHandler;
                            }

                            result = handler && handler.apply(context, options.args);

                            if (result !== false) {
                                _$modal && _$modal.modal('hide');
                            }

                            return false;
                        }
                    });
                }
            } else {
                $modal.closest('.modal-body').css('overflow', 'hidden');

                $modal.one('hidden', function () {
                    if (options.backdrop) {
                        $modal.prev('.mask').remove();
                    }

                    $modal.closest('.modal-body').css('overflow', '');

                    $modal = null;
                    return false;
                });
            }
        }


        modal.warp = function ($modalBody, options) {
            var $modal;

            options = $.extend({}, _default, options);


            $modalBody.wrap('<div data-wrap="true" class="modal hide fade" style="position: fixed"></div>');
            $modal = $modalBody.parent().attr('id', $modalBody.attr('id'));
            $modal.addClass($modalBody.attr('class'));
            $modalBody.removeAttr('id class').addClass('modal-body');
            $modal.prepend('<div class="modal-header"><h4 title="' + options.title + '">' + options.title + '</h4></div>');
            $modal.append(modalFooterTemp.replace(/_positive_/, options.btnConfirm).replace(/_ignore_/, options.btnIgnore).replace(/_negative_/, options.btnCancel));
            if (!options.btnIgnore) {
                $modal.find('[data-role="ignore"]').remove();
            }

            $modal.find('[data-role="confirm"]')[options.btnCancel === false || options.btnCancel === 'false' ? 'addClass' : 'removeClass']('hide');
            $modal.find('[data-role="cancel"]')[options.btnCancel === false || options.btnCancel === 'false' ? 'addClass' : 'removeClass']('hide');

            if (options.isLargeModal) $modal.addClass('modal-lg');


            if (!options.isDialog) $modal.addClass('modal-config-mode');


            $modal = null;
        };
        return modal;
    }();
    setModalLgSize = (function () {
        var
            $modalStyle,
            $window = $(window),
            paddingStr = 'padding:45px 0 80px;',
            headerStr = '.modal-lg>.modal-header{position:absolute;top:0;left:0;right:0;height:21px;overflow:hidden;}',
            footerStr = '.modal-lg>.modal-footer{position:absolute;bottom:18px;left:0;right:2px;height:32px;overflow:hidden;}';


        return function () {
            var modal = {},
                modalStyle, modalBodyHeight, maxHeight,
                windowHeight = $window.height();
            //定义modal大小
            modal.h = windowHeight * 0.7;
            modal.w = $window.width() * 0.8;
            modal.l = -(modal.w * 0.5);
            modal.t = -(modal.h * 0.5);
            modalStyle = 'width:' + modal.w + 'px ;' +
                'height:' + modal.h + 'px;' +
                'margin-left:' + modal.l + 'px ;' +
                'margin-top:' + modal.t + 'px ;' +
                'left:50%;' +
                paddingStr;
            maxHeight = modal.h - 10;
            modalBodyHeight = 'max-height:' + maxHeight + 'px;min-height:' + maxHeight + 'px;padding:5px;';

            if ($modalStyle) {
                $modalStyle.remove();
            }
            $modalStyle = $('<style type="text/css">' + ('.modal-lg.fade{' + modalStyle + '}' + '.modal-lg .modal-body{' + modalBodyHeight + '}' + headerStr + footerStr + '.modal-lg.fade.in{top:' + (windowHeight - modal.h !== 0 ? (windowHeight - modal.h) / 3 : 0) + 'px;}') + '</style>');

            $modalStyle.appendTo('body');
        };
    })();
    app.screen.addResizeHandler({
        isGlobal: true,
        callback: setModalLgSize,
        uid: app.getUID()
    });

    setModalLgSize();

    return modal;
});
