(function () {
    if (!($ && $.fn && $.fn.collapse)) {
        !function ($) {

            "use strict"; // jshint ;_;


            /* COLLAPSE PUBLIC CLASS DEFINITION
             * ================================ */

            var Collapse = function (element, options) {
                this.$element = $(element);
                this.options = $.extend({}, $.fn.collapse.defaults, options);

                if (this.options.parent) {
                    this.$parent = $(this.options.parent)
                } else {
                    var parentID = this.$element.attr('data-parent');

                    if (parentID) {
                        this.$parent = this.$element.closest(parentID);

                        if (!this.$parent.length) {
                            this.$parent = undefined;
                        }
                    }
                }

                this.options.toggle && this.toggle()
            };

            Collapse.prototype = {

                constructor: Collapse

                ,
                dimension: function () {
                    var hasWidth = this.$element.hasClass('width');
                    return hasWidth ? 'width' : 'height'
                }

                ,
                show: function () {
                    var dimension, scroll, actives, hasData;

                    if (this.transitioning || this.$element.hasClass('in')) return;

                    dimension = this.dimension();
                    scroll = $.camelCase(['scroll', dimension].join('-'));

                    //lijiancheng@cfischina.com
                    //2015/08/11 9:54
                    //如果是asideMenu则不会自动收起
                    if (this.$parent && !this.$parent.hasClass('aui-aside-menu-ctn')) {
                        actives = this.$parent && this.$parent.find('.aui-accordion-group > .in');
                        if (actives && actives.length) {
                            hasData = actives.data('collapse');
                            if (hasData && hasData.transitioning) return;
                            actives.collapse('hide');
                            actives.prev().children('a').addClass('collapsed');
                            hasData || actives.data('collapse', null)
                        }
                    }


                    this.$element[dimension](0);
                    this.transition('addClass', $.Event('show'), 'shown');
                    $.support.transition && this.$element[dimension](this.$element[0][scroll])
                }

                ,
                hide: function () {
                    var dimension;
                    if (this.transitioning || !this.$element.hasClass('in')) return;
                    dimension = this.dimension();
                    this.reset(this.$element[dimension]());
                    this.transition('removeClass', $.Event('hide'), 'hidden');
                    this.$element[dimension](0)
                }

                ,
                reset: function (size) {
                    var dimension = this.dimension();

                    this.$element
                        .removeClass('collapse')[dimension](size || 'auto')[0].offsetWidth;

                    this.$element[size !== null ? 'addClass' : 'removeClass']('collapse');

                    // lijiancheng@cfischina.com
                    // 2015/08/03 16:29
                    // 展开手风琴时滚动到当前部位
                    var $aside;
                    if (($aside = this.$element.closest('#auiAside')).length) {
                        $aside = $aside.find('.aside-menu:first');
                        app && app.scrollTop($aside, this.$element, 500, this.$element.prev().height());
                    }

                    return this
                }

                ,
                transition: function (method, startEvent, completeEvent) {
                    var that = this,
                        complete = function () {
                            if (startEvent.type == 'show') that.reset();
                            that.transitioning = 0;
                            that.$element.trigger(completeEvent)
                        };

                    this.$element.trigger(startEvent);

                    if (startEvent.isDefaultPrevented()) return;

                    this.transitioning = 1;

                    this.$element[method]('in');

                    $.support.transition && this.$element.hasClass('collapse') ?
                        this.$element.one($.support.transition.end, complete) :
                        complete()
                }

                ,
                toggle: function () {
                    this[this.$element.hasClass('in') ? 'hide' : 'show']()
                }

            };


            /* COLLAPSE PLUGIN DEFINITION
             * ========================== */

            var old = $.fn.collapse;

            $.fn.collapse = function (option) {
                return this.each(function () {
                    var $this = $(this),
                        data = $this.data('collapse'),
                        options = $.extend({}, $.fn.collapse.defaults, $this.data(), typeof option == 'object' && option);
                    if (!data) $this.data('collapse', (data = new Collapse(this, options)));
                    if (typeof option == 'string') data[option]()
                })
            };

            $.fn.collapse.defaults = {
                toggle: true
            };

            $.fn.collapse.Constructor = Collapse;


            /* COLLAPSE NO CONFLICT
             * ==================== */

            $.fn.collapse.noConflict = function () {
                $.fn.collapse = old;
                return this
            };


            /* COLLAPSE DATA-API
             * ================= */

            $(document).on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
                var $this = $(this),
                    href, target = $this.attr('data-target') ||
                        e.preventDefault() ||
                        (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
                    ,
                    option = $(target).data('collapse') ? 'toggle' : $this.data();
                $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
                $(target).collapse(option)
            })

        }(window.jQuery);
    }
});


