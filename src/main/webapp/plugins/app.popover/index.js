(function(){
                    var popover;
                    //tooltip

                    +function () {

                        'use strict';

                        // TOOLTIP PUBLIC CLASS DEFINITION
                        // ===============================

                        var Tooltip = function (element, options) {
                            this.type = null;
                            this.options = null;
                            this.enabled = null;
                            this.timeout = null;
                            this.hoverState = null;
                            this.$element = null;
                            this.inState = null;

                            this.init('tooltip', element, options)
                        };

                        var $window = $(window);

                        Tooltip.VERSION = '3.3.7';

                        Tooltip.TRANSITION_DURATION = 150;

                        Tooltip.DEFAULTS = {
                            animation: true,
                            placement: 'top',
                            selector: false,
                            template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                            trigger: 'hover focus',
                            title: '',
                            delay: 0,
                            html: false,
                            container: false,
                            viewport: {
                                selector: 'body',
                                padding: 0
                            }
                        };

                        Tooltip.prototype.init = function (type, element, options) {
                            this.enabled = true;
                            this.type = type;
                            this.$element = $(element);
                            this.options = this.getOptions(options);
                            this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport));
                            this.inState = {click: false, hover: false, focus: false};

                            if (this.$element[0] instanceof document.constructor && !this.options.selector) {
                                throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
                            }

                            var triggers = this.options.trigger.split(' ');

                            for (var i = triggers.length; i--;) {
                                var trigger = triggers[i];

                                if (trigger == 'click') {
                                    this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
                                } else if (trigger != 'manual') {
                                    var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin';
                                    var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout';

                                    this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this));
                                    this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
                                }
                            }

                            this.options.selector ?
                                (this._options = $.extend({}, this.options, {trigger: 'manual', selector: ''})) :
                                this.fixTitle()
                        };

                        Tooltip.prototype.getDefaults = function () {
                            return Tooltip.DEFAULTS
                        };

                        Tooltip.prototype.getOptions = function (options) {
                            options = $.extend({}, this.getDefaults(), this.$element.data(), options);

                            if (options.delay && typeof options.delay == 'number') {
                                options.delay = {
                                    show: options.delay,
                                    hide: options.delay
                                }
                            }

                            return options
                        };

                        Tooltip.prototype.getDelegateOptions = function () {
                            var options = {};
                            var defaults = this.getDefaults();

                            this._options && $.each(this._options, function (key, value) {
                                if (defaults[key] != value) options[key] = value
                            });

                            return options
                        };

                        Tooltip.prototype.enter = function (obj) {
                            var self = obj instanceof this.constructor ?
                                obj : $(obj.currentTarget).data('bs.' + this.type);

                            if (!self) {
                                self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
                                $(obj.currentTarget).data('bs.' + this.type, self)
                            }

                            if (obj instanceof $.Event) {
                                self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
                            }

                            if (self.tip().hasClass('in') || self.hoverState == 'in') {
                                self.hoverState = 'in';
                                return
                            }

                            clearTimeout(self.timeout);

                            self.hoverState = 'in';

                            if (!self.options.delay || !self.options.delay.show) return self.show();

                            self.timeout = setTimeout(function () {
                                if (self.hoverState == 'in') self.show()
                            }, self.options.delay.show)
                        };

                        Tooltip.prototype.isInStateTrue = function () {
                            for (var key in this.inState) {
                                if (this.inState[key]) return true
                            }

                            return false
                        };

                        Tooltip.prototype.leave = function (obj) {
                            var self = obj instanceof this.constructor ?
                                obj : $(obj.currentTarget).data('bs.' + this.type);

                            if (!self) {
                                self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
                                $(obj.currentTarget).data('bs.' + this.type, self)
                            }

                            if (obj instanceof $.Event) {
                                self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
                            }

                            if (self.isInStateTrue()) return;

                            clearTimeout(self.timeout);

                            self.hoverState = 'out';

                            if (!self.options.delay || !self.options.delay.hide) return self.hide();

                            self.timeout = setTimeout(function () {
                                if (self.hoverState == 'out') self.hide()
                            }, self.options.delay.hide)
                        };

                        Tooltip.prototype.show = function () {

                            //  将遮罩层以及提示栏的z-index提高比弹出框（1051）更高的1052，可以让在使用弹出框（popover)的同时，正常使用遮罩以及提示栏。
                            app.shelter.upperZIndex();

                            var e = $.Event('show.bs.' + this.type);

                            if (this.hasContent() && this.enabled) {
                                //add
                                this.$element.trigger(e);

                                var $tooltip = this.$element,
                                    tooltipUUID, resizeHandler,
                                    optionWidth = this.options.width,
                                    optionHeight = this.options.height;

                                var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0]);
                                if (e.isDefaultPrevented() || !inDom) return;
                                var that = this;

                                var $tip = this.tip();

                                var tipId = this.getUID(this.type);

                                this.setContent();
                                $tip.attr('id', tipId);
                                this.$element.attr('aria-describedby', tipId);

                                if (this.options.animation) $tip.addClass('fade');

                                var placement = typeof this.options.placement == 'function' ?
                                    this.options.placement.call(this, $tip[0], this.$element[0]) :
                                    this.options.placement;

                                var autoToken = /\s?auto?\s?/i;
                                var autoPlace = autoToken.test(placement);
                                if (autoPlace) placement = placement.replace(autoToken, '') || 'top';


                                $tip
                                    .detach()
                                    .css({display: 'block'})
                                    // .css({ top: 0, left: 0, display: 'block' })
                                    .addClass(placement)
                                    .data('bs.' + this.type, this);

                                this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);

                                // xieyirong@agree.com.cn
                                // 2018-03-15
                                // resizeHandler 初始化气泡尺寸以及监听窗口变化重置气泡尺寸
                                if ((optionWidth || optionHeight)) {

                                    tooltipUUID = app.getUID();
                                    resizeHandler = function () {
                                        var tooltipHeight, tooltipWidth, windowHeight, windowWidth,
                                            tooltipCss = {},
                                            tooltipBodyCss, tooltipBodyHeight,
                                            placement, pos, actualWidth, actualHeight, calculatedOffset;


                                        if (optionWidth) {
                                            windowWidth = $window.width();

                                            if (optionWidth.indexOf('%') !== -1) {
                                                tooltipWidth = (parseInt(optionWidth, 10) / 100 || .8) * windowWidth;
                                            } else {
                                                tooltipWidth = parseInt(optionWidth, 10) || windowWidth * .8;
                                            }

                                            tooltipWidth = Math.min(tooltipWidth, windowWidth);
                                            tooltipWidth = Math.max(tooltipWidth, 0);
                                            tooltipCss.width = tooltipWidth;
                                            tooltipCss.marginLeft = 0;
                                        }

                                        if (optionHeight) {
                                            windowHeight = $window.height();

                                            if (optionHeight.indexOf('%') !== -1) {
                                                tooltipHeight = (parseInt(optionHeight, 10) / 100 || .7) * windowHeight;
                                            } else {
                                                tooltipHeight = parseInt(optionHeight, 10) || windowHeight * .7;
                                            }

                                            tooltipHeight = Math.min(tooltipHeight, windowHeight);

                                            tooltipBodyHeight = tooltipHeight - $tip.children('.aweb-popover-header').height();

                                            tooltipCss.height = tooltipHeight;
                                            tooltipCss.marginTop = 0;

                                            tooltipBodyCss = {
                                                maxHeight: tooltipBodyHeight,
                                                minHeight: tooltipBodyHeight
                                            };
                                        }


                                        $tip.css(tooltipCss);
                                        if (tooltipBodyCss) {
                                            $tip.children('.aweb-popover-body').css(tooltipBodyCss);
                                        }

                                        // resize 中更新 气泡位置

                                        placement = that.options.placement;
                                        pos = that.getPosition();
                                        actualWidth = $tip[0].offsetWidth;
                                        actualHeight = $tip[0].offsetHeight;
                                        calculatedOffset = that.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
                                        that.applyPlacement(calculatedOffset, placement);

                                    };

                                    $window.on('resize.' + tooltipUUID, resizeHandler);
                                    resizeHandler();

                                    this.uuid = tooltipUUID;
                                    this.resizeHandler = resizeHandler;
                                }

                                this.$element.trigger('inserted.bs.' + this.type);

                                var pos = this.getPosition(),
                                    actualWidth = $tip[0].offsetWidth,
                                    actualHeight = $tip[0].offsetHeight,
                                    calculatedOffset, fixWidth, fixHeight, originFixWidth, originFixHeight, popoverHeaderHeight,
                                    popoverBodyHeight;

                                if (autoPlace) {
                                    var orgPlacement = placement;
                                    var viewportDim = this.getPosition(this.$viewport);

                                    placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top' :
                                        placement == 'top' && pos.top - actualHeight < viewportDim.top ? 'bottom' :
                                            placement == 'right' && pos.right + actualWidth > viewportDim.width ? 'left' :
                                                placement == 'left' && pos.left - actualWidth < viewportDim.left ? 'right' :
                                                    placement;

                                    calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

                                    //对调整后方位为 left、top情况做处理，将原本的修改尺寸和调整后的修改尺寸作比较
                                    if (orgPlacement !== placement) {
                                        switch (placement) {
                                            case 'left':
                                                originFixWidth = viewportDim.width - pos.right;
                                                if (calculatedOffset.left < 0) {
                                                    fixWidth = actualWidth + calculatedOffset.left;
                                                    if (fixWidth < originFixWidth) {
                                                        fixWidth = originFixWidth;
                                                        placement = orgPlacement;
                                                        $tip.css({'width': fixWidth + 'px'});
                                                    }
                                                }
                                                break;
                                            case 'top':
                                                originFixHeight = viewportDim.height - pos.bottom;
                                                if (calculatedOffset.top < 0) {
                                                    fixHeight = actualHeight + calculatedOffset.top;
                                                    if (fixHeight < originFixHeight) {
                                                        fixHeight = originFixHeight - 10;
                                                        placement = orgPlacement;
                                                        popoverHeaderHeight = $tip.children('.aweb-popover-header').height();
                                                        popoverBodyHeight = fixHeight - popoverHeaderHeight;
                                                        $tip.css({'height': fixHeight + 'px'});
                                                        $tip.find('.aweb-popover-body').css({
                                                            'min-height': popoverBodyHeight + 'px',
                                                            'max-height': popoverBodyHeight + 'px'
                                                        });
                                                    }
                                                }
                                                break;
                                        }

                                    }

                                    $tip
                                        .removeClass(orgPlacement)
                                        .addClass(placement)
                                }

                                calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

                                //阻止气泡溢出
                                switch (placement) {
                                    case 'left':
                                    case 'right':
                                        if (calculatedOffset.left < 0) {
                                            fixWidth = actualWidth + calculatedOffset.left;
                                            $tip.css({'width': fixWidth + 'px'});
                                            calculatedOffset.left = 0;
                                        }
                                        break;
                                    case 'top':
                                    case 'bottm':
                                        if (calculatedOffset.top < 0) {
                                            fixHeight = actualHeight + calculatedOffset.top;
                                            popoverHeaderHeight = $tip.children('.aweb-popover-header').height();
                                            popoverBodyHeight = fixHeight - popoverHeaderHeight;
                                            $tip.css({'height': fixHeight + 'px'});
                                            $tip.find('.aweb-popover-body').css({
                                                'min-height': popoverBodyHeight + 'px',
                                                'max-height': popoverBodyHeight + 'px'
                                            });
                                            calculatedOffset.top = 0;
                                        }
                                        break;
                                }

                                this.applyPlacement(calculatedOffset, placement);

                                var complete = function () {
                                    var prevHoverState = that.hoverState;
                                    that.$element.trigger('shown.bs.' + that.type);
                                    that.hoverState = null;

                                    if (prevHoverState == 'out') that.leave(that)
                                };

                                $.support.transition && this.$tip.hasClass('fade') ?
                                    $tip
                                        .one('bsTransitionEnd', complete)
                                        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                                    complete()
                            }
                        };

                        Tooltip.prototype.applyPlacement = function (offset, placement) {
                            var $tip = this.tip();
                            var width = $tip[0].offsetWidth;
                            var height = $tip[0].offsetHeight;

                            // manually read margins because getBoundingClientRect includes difference
                            var marginTop = parseInt($tip.css('margin-top'), 10);
                            var marginLeft = parseInt($tip.css('margin-left'), 10);

                            // we must check for NaN for ie 8/9
                            if (isNaN(marginTop)) marginTop = 0;
                            if (isNaN(marginLeft)) marginLeft = 0;

                            offset.top += marginTop;
                            offset.left += marginLeft;

                            // $.fn.offset doesn't round pixel values
                            // so we use setOffset directly with our own function B-0
                            $.offset.setOffset($tip[0], $.extend({
                                using: function (props) {
                                    $tip.css({
                                        top: Math.round(props.top),
                                        left: Math.round(props.left)
                                    })
                                }
                            }, offset), 0);

                            $tip.addClass('in');

                            // check to see if placing tip in new offset caused the tip to resize itself
                            var actualWidth = $tip[0].offsetWidth;
                            var actualHeight = $tip[0].offsetHeight;

                            if (placement == 'top' && actualHeight != height) {
                                offset.top = offset.top + height - actualHeight
                            }

                            var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);

                            if (delta.left) offset.left += delta.left;
                            else offset.top += delta.top;

                            var isVertical = /top|bottom/.test(placement);
                            var arrowDelta = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
                            var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight';

                            $tip.offset(offset);

                            this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
                        };

                        Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
                            this.arrow()
                                .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
                                .css(isVertical ? 'top' : 'left', '')
                        };

                        Tooltip.prototype.setContent = function () {
                            var $tip = this.tip();
                            var title = this.getTitle();

                            $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
                            $tip.removeClass('fade in top bottom left right')
                        };

                        Tooltip.prototype.hide = function (callback) {
                            //  将遮罩层以及提示栏的z-index还原
                            app.shelter.lowerZIndex();

                            var that = this;
                            var $tip = $(this.$tip);
                            var e = $.Event('hide.bs.' + this.type);

                            function complete() {
                                if (that.hoverState != 'in') $tip.detach();
                                if (that.$element) { // TODO: Check whether guarding this code with this `if` is really necessary.
                                    that.$element
                                        .removeAttr('aria-describedby')
                                        .trigger('hidden.bs.' + that.type)
                                }
                                callback && callback()
                            }

                            this.$element.trigger(e);

                            // null resizeHandler
                            if (this.uuid) {
                                $window.off('resize.' + this.uuid);
                                this.resizeHandler = null;
                            }

                            if (e.isDefaultPrevented()) return;

                            $tip.removeClass('in');

                            $.support.transition && $tip.hasClass('fade') ?
                                $tip
                                    .one('bsTransitionEnd', complete)
                                    .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                                complete();

                            this.hoverState = null;

                            return this
                        };

                        Tooltip.prototype.fixTitle = function () {
                            var $e = this.$element;
                            if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
                                $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
                            }
                        };

                        Tooltip.prototype.hasContent = function () {
                            return this.getTitle()
                        };

                        Tooltip.prototype.getPosition = function ($element) {
                            $element = $element || this.$element;

                            var el = $element[0];
                            var isBody = el.tagName == 'BODY';

                            var elRect = el.getBoundingClientRect();
                            if (elRect.width == null) {
                                // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
                                elRect = $.extend({}, elRect, {
                                    width: elRect.right - elRect.left,
                                    height: elRect.bottom - elRect.top
                                })
                            }
                            var isSvg = window.SVGElement && el instanceof window.SVGElement;
                            // Avoid using $.offset() on SVGs since it gives incorrect results in jQuery 3.
                            // See https://github.com/twbs/bootstrap/issues/20280
                            var elOffset = isBody ? {top: 0, left: 0} : (isSvg ? null : $element.offset());
                            var scroll = {scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop()};
                            var outerDims = isBody ? {width: $(window).width(), height: $(window).height()} : null;

                            return $.extend({}, elRect, scroll, outerDims, elOffset)
                        };

                        Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
                            return placement == 'bottom' ? {
                                    top: pos.top + pos.height,
                                    left: pos.left + pos.width / 2 - actualWidth / 2
                                } :
                                placement == 'top' ? {
                                        top: pos.top - actualHeight,
                                        left: pos.left + pos.width / 2 - actualWidth / 2
                                    } :
                                    placement == 'left' ? {
                                            top: pos.top + pos.height / 2 - actualHeight / 2,
                                            left: pos.left - actualWidth
                                        } :
                                        /* placement == 'right' */
                                        {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}

                        };

                        Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
                            var delta = {top: 0, left: 0};
                            if (!this.$viewport) return delta;

                            var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
                            var viewportDimensions = this.getPosition(this.$viewport);

                            if (/right|left/.test(placement)) {
                                var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
                                var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
                                if (topEdgeOffset < viewportDimensions.top) { // top overflow
                                    delta.top = viewportDimensions.top - topEdgeOffset
                                } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                                    delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
                                }
                            } else {
                                var leftEdgeOffset = pos.left - viewportPadding;
                                var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
                                if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                                    delta.left = viewportDimensions.left - leftEdgeOffset
                                } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                                    delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
                                }
                            }

                            return delta
                        };

                        Tooltip.prototype.getTitle = function () {
                            var title;
                            var $e = this.$element;
                            var o = this.options;

                            title = (typeof o.title == 'function' ? o.title.call($e[0]) : o.title) || $e.attr('data-original-title');

                            return title
                        };

                        Tooltip.prototype.getUID = function (prefix) {
                            do prefix += ~~(Math.random() * 1000000);
                            while (document.getElementById(prefix));
                            return prefix
                        };

                        Tooltip.prototype.tip = function () {
                            if (!this.$tip) {
                                this.$tip = $(this.options.template);
                                if (this.$tip.length != 1) {
                                    throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
                                }
                            }
                            return this.$tip
                        };

                        Tooltip.prototype.arrow = function () {
                            return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
                        };

                        Tooltip.prototype.enable = function () {
                            this.enabled = true
                        };

                        Tooltip.prototype.disable = function () {
                            this.enabled = false
                        };

                        Tooltip.prototype.toggleEnabled = function () {
                            this.enabled = !this.enabled
                        };

                        Tooltip.prototype.toggle = function (e) {
                            var self = this;
                            if (e) {
                                self = $(e.currentTarget).data('bs.' + this.type);
                                if (!self) {
                                    self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                                    $(e.currentTarget).data('bs.' + this.type, self)
                                }
                            }

                            if (e) {
                                self.inState.click = !self.inState.click;
                                if (self.isInStateTrue()) self.enter(self);
                                else self.leave(self)
                            } else {
                                self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
                            }
                        };

                        Tooltip.prototype.destroy = function () {
                            var that = this;
                            clearTimeout(this.timeout);
                            this.hide(function () {
                                that.$element.off('.' + that.type).removeData('bs.' + that.type);
                                if (that.$tip) {
                                    that.$tip.detach()
                                }
                                that.$tip = null;
                                that.$arrow = null;
                                that.$viewport = null;
                                that.$element = null
                            })
                        };


                        // TOOLTIP PLUGIN DEFINITION
                        // =========================

                        function Plugin(option) {
                            return this.each(function () {
                                var $this = $(this);
                                var data = $this.data('bs.tooltip');
                                var options = typeof option == 'object' && option;

                                if (!data && /destroy|hide/.test(option)) return;
                                if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)));
                                if (typeof option == 'string') data[option]()
                            })
                        }

                        var old = $.fn.tooltip;

                        $.fn.tooltip = Plugin;
                        $.fn.tooltip.Constructor = Tooltip;


                        // TOOLTIP NO CONFLICT
                        // ===================

                        $.fn.tooltip.noConflict = function () {
                            $.fn.tooltip = old;
                            return this
                        }

                    }(jQuery);


                    //popover

                    +function () {
                        'use strict';

                        // POPOVER PUBLIC CLASS DEFINITION
                        // ===============================

                        var Popover = function (element, options) {
                            this.init('popover', element, options)
                        };

                        if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js');

                        Popover.VERSION = '3.3.7';

                        Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
                            placement: 'right',
                            trigger: 'click',
                            content: '',
                            template: '<div class="aweb-popover" role="tooltip"><div class="arrow"></div><h3 class="aweb-popover-title"></h3><div class="aweb-popover-content"></div></div>'
                        });


                        // NOTE: POPOVER EXTENDS tooltip.js
                        // ================================

                        Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);

                        Popover.prototype.constructor = Popover;

                        Popover.prototype.getDefaults = function () {
                            return Popover.DEFAULTS
                        };

                        Popover.prototype.setContent = function () {
                            var $tip = this.tip();
                            var title = this.getTitle();
                            var content = this.getContent();

                            $tip.find('.aweb-popover-title')[this.options.html ? 'html' : 'text'](title);
                            $tip.find('.aweb-popover-content').children().detach().end()[ // we use append for html objects to maintain js events
                                this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
                                ](content);

                            $tip.removeClass('fade top bottom left right in');

                            // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
                            // this manually by checking the contents.
                            if (!$tip.find('.aweb-popover-title').html()) $tip.find('.aweb-popover-title').hide()
                        };

                        Popover.prototype.hasContent = function () {
                            return this.getTitle() || this.getContent()
                        };

                        Popover.prototype.getContent = function () {
                            var $e = this.$element;
                            var o = this.options;

                            return $e.attr('data-content') ||
                                (typeof o.content == 'function' ?
                                    o.content.call($e[0]) :
                                    o.content)
                        };

                        Popover.prototype.arrow = function () {
                            return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
                        };


                        // POPOVER PLUGIN DEFINITION
                        // =========================

                        function Plugin(option) {
                            return this.each(function () {
                                var $this = $(this);
                                var data = $this.data('bs.popover');
                                var options = typeof option == 'object' && option;

                                if (!data && /destroy|hide/.test(option)) return;
                                if (!data) $this.data('bs.popover', (data = new Popover(this, options)));
                                if (typeof option == 'string') data[option]()
                            })
                        }

                        var old = $.fn.popover;

                        $.fn.popover = Plugin;
                        $.fn.popover.Constructor = Popover;


                        // POPOVER NO CONFLICT
                        // ===================

                        $.fn.popover.noConflict = function () {
                            $.fn.popover = old;
                            return this
                        }

                    }(jQuery);

                    popover = function () {


                        function popover(options) {

                            // var $popover = $(options.$elem).closest('button') !== 0 ? $(options.$elem).closest('button') : $(options.$elem);

                            // if ($popover && $popover.data("bs.popover")) {
                            //     return false;
                            // }

                            var CONST = {
                                    POPOVER_LANG: {
                                        TITLE: '气泡',
                                        CONTENT: '气泡内容',
                                        DEFAULT_BTN: '<button title="全屏切换" type="button" data-role="toggleSize"><i class="aweb-popover-header-icon aui aui-quanping fa fa-expand"></i></button><button title="关闭" type="button" data-role="close"><i class="aweb-popover-header-icon aui aui-guanbi iconfont icon-topbar-close"></i></button>'
                                    },
                                    POPOVER_NAMESPACE: '.pop'
                                },
                                _default = {
                                    title: CONST.POPOVER_LANG.TITLE, //弹出框标题，非必填
                                    content: CONST.POPOVER_LANG.CONTENT, //弹出框内容
                                    init: null, //初始化函数
                                    confirmHandler: function () {
                                    }, //点击确定按钮触发的函数，参数以数组形式写在args那里
                                    args: [],
                                    html: true,
                                    container: 'body',
                                    height: '50%',
                                    width: '80%',
                                    placement: 'auto right',
                                    hasHeader: true,
                                    template: '<div class="aweb-popover"  tabindex="0" role="tooltip"><div class="arrow"></div><div class="aweb-popover-header"><h4 class="aweb-popover-title"></h4><div class="btn-group">' +
                                    CONST.POPOVER_LANG.DEFAULT_BTN +
                                    '</div></div><div class="aweb-popover-body"><div class="aweb-popover-content"></div></div></div>'
                                };

                            var Pop = function (options) {
                                this.options = $.extend({}, _default, options);
                                this.init();
                                this.on(this.events);
                            };

                            Pop.fn = Pop.prototype = {
                                Constructor: Pop,
                                events: {
                                    toggleSize: function (e, context) {
                                        var popoverBodyHeight, popoverBodyCss;

                                        // 设置窗口大小
                                        context.$tip.toggleClass('popover-lg');

                                        //调整 popover-body 高度
                                        popoverBodyHeight = context.$tip.height() - context.$tip.children('.aweb-popover-header').height();

                                        popoverBodyCss = {
                                            maxHeight: popoverBodyHeight,
                                            minHeight: popoverBodyHeight
                                        };

                                        if (popoverBodyCss) {
                                            context.$tip.children('.aweb-popover-body').css(popoverBodyCss);
                                        }

                                        context.trigger('screenChange');

                                    },

                                    close: function (e, context) {
                                        context.$element && context.$element.popover('destroy');
                                        if (context.isShow) {
                                            var handler = context.options.confirmHandler;
                                            $.isFunction(handler) && handler.apply(context, context.options.args);
                                            context.isShow = false;
                                            context.popInstance.destroy();
                                        }
                                    }
                                },

                                init: function () {

                                    var listen = {},
                                        i, k,j, item, $newBtn,temp={},
                                        that = this,
                                        onList = this.options.on,
                                        $buttons, $button, btnClass, iconNamespace;


                                    this.isShow = true;
                                    this.options.args = [this].concat(this.options.args);

                                    if (!this.options.hasHeader) {
                                        this.options.template = '<div class="aweb-popover"  tabindex="0" role="tooltip"><div class="arrow"></div><div class="aweb-popover-body"><div class="aweb-popover-content"></div></div></div>';
                                    }

                                    //事件散列处理
                                    for (i in onList) {

                                        if (onList[i].btnName && onList[i].callback) {
                                            listen[onList[i].btnName] = onList[i].callback;
                                        }

                                    }

                                    this.events = $.extend({}, this.events, listen);


                                    for (k in this.events) {

                                        //引入temp对象，避免在IE8上的属性无限循环
                                        temp[k + CONST.POPOVER_NAMESPACE] = this.events[k];
                                        // this.events[k + CONST.POPOVER_NAMESPACE] = this.events[k];
                                        delete this.events[k];

                                    }

                                    for(j in temp){

                                        this.events[j] =temp[j];

                                    }

                                    temp = null;

                                    if ($.isFunction(this.options.$elem)) {
                                        this.options.$elem = this.options.$elem();
                                    }

                                    this.$element = $(this.options.$elem).closest('button').length !== 0 ? $(this.options.$elem).closest('button') : $(this.options.$elem).closest('span').length !== 0 ? $(this.options.$elem).closest('span') : $(this.options.$elem);

                                    if ($.isFunction(this.options.content)) {
                                        this.options.content = this.options.content();
                                    }

                                    this.$element.popover({
                                        title: this.options.title,
                                        content: this.options.content,
                                        html: this.options.html,
                                        container: this.options.container,
                                        height: this.options.height,
                                        width: this.options.width,
                                        placement: this.options.placement,
                                        template: this.options.template,
                                        animation: false
                                    }).popover('show');

                                    // 初始化模拟鼠标点击
                                    if (this.options.fixClick) {
                                        this.$element.data('bs.popover').inState.click = true;
                                    }

                                    this.popInstance = this.$element.data('bs.popover');

                                    //保存气泡弹出框的索引
                                    this.$tip = this.$element.data('bs.popover').tip();

                                    this.$btnCtn = this.$tip.find('.aweb-popover-header > .btn-group').html(CONST.POPOVER_LANG.DEFAULT_BTN);

                                    $buttons = this.$btnCtn.find('button i');

                                    // 绑定 options.init 中的 this 为 this.$tip 对象，将 this <Pop实例> 作为第一个参数传入

                                    if ($.isFunction(this.options.init)) {
                                        this.options.init.apply(this.$tip, this.options.args);
                                    }

                                    // 处理 aui 与 aweb 图标关系

                                    if (window.auiApp && window.auiApp.mode !== 'virtualizer') {
                                        $buttons.each(function (index, item) {
                                            $button = $(item);
                                            btnClass = item.className.split(' ');

                                            $.each(btnClass, function (index, item) {
                                                if (item !== 'aweb-popover-header-icon' && item.indexOf('aui') < 0) {
                                                    $button.removeClass(item);
                                                }
                                            });
                                        });
                                    } else {

                                        $buttons.each(function (index, item) {
                                            $(item).removeClass('aui');
                                        });
                                    }

                                    //合成按钮组（默认 关闭和全屏，并监听对应按钮的点击事件，并 trigger 对应注册的事件）

                                    for (i in onList) {
                                        //正则处理图标前缀
                                        if (onList[i].btnName && onList[i].icon && onList[i].title) {
                                            iconNamespace = onList[i].icon.match(/([a-z]+)-([a-z]+)/)[1];
                                            $newBtn = '<button title="' + onList[i].title + '" type="button" data-role="' + onList[i].btnName + '"><i class="aweb-popover-header-icon ' + iconNamespace + " " + onList[i].icon + '"></i></button>';
                                            this.$btnCtn.prepend($newBtn);
                                        }

                                    }

                                    this.$tip.on('click' + CONST.POPOVER_NAMESPACE, '.aweb-popover-header button', function (e) {
                                        that.$tip.trigger($(this).attr('data-role') + CONST.POPOVER_NAMESPACE, that);
                                    });

                                    this.$tip.focus();

                                    //focusout
                                    this.$tip.on('focusout' + CONST.POPOVER_NAMESPACE, function (e) {

                                        // relatedTarget 是 aweb-popover 中的元素
                                        if ($(e.relatedTarget).closest('.aweb-popover').is(that.$tip)) {
                                            return false;
                                        }

                                        if (that.isShow) {
                                            if ((that.$tip.is($(e.target)) || that.$tip.is($(e.target).closest('.aweb-popover'))) && (e.relatedTarget === null || ( e.relatedTarget !== undefined && $(e.relatedTarget).closest('.aweb-popover').length === 0))) {

                                                // 点击 popover 之外的区域造成的失焦
                                                if (that.options.focusable !== false) {
                                                    that.close();
                                                }

                                            } else {
                                                return false;
                                            }
                                        }
                                        //其他提前触发 close 的失焦行为都调用 Pop 实例的 close() 方法

                                    });

                                    // 监听popover 的 hide 事件，并执行 confirmHandler

                                    this.$element.one('hide.bs.popover', function () {
                                        that.isShow = false;
                                        var handler = that.options.confirmHandler;
                                        $.isFunction(handler) && handler.apply(that, that.options.args);
                                    });

                                    // 监听popover 的 hidden 事件，并销毁 popover 实例、Pop实例
                                    this.$element.one('hidden.bs.popover', function () {
                                        that.destroy();
                                    });

                                },

                                on: function () {
                                    this.$tip.on.apply(this.$tip, arguments);
                                },

                                off: function () {
                                    this.$tip.off.apply(this.$tip, arguments);
                                },

                                trigger: function () {
                                    this.$tip.trigger.apply(this.$tip, arguments);
                                },

                                destroy: function () {
                                    this.off();
                                    this.$element = null;
                                    this.$btnCtn = null;
                                    this.$tip = null;
                                    this.options = null;
                                },

                                close: function () {
                                    this.$tip && this.$tip.trigger('close', this);
                                },

                                toggleSize: function () {
                                    this.$tip && this.$tip.trigger('toggleSize', this);
                                },

                                setCache: function (key, value) {
                                    if (!this.cache) {
                                        this.cache = {}
                                    }
                                    this.cache[key] = value;
                                },

                                getCache: function (key) {
                                    if (this.cache) {
                                        return this.cache[key];
                                    }
                                }

                            };

                            return new Pop(options);

                        }

                        return popover;
                    }();

                    return popover;
                })