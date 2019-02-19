(function(){
        var Shelter = function () {
            var context = this,
                $body = $('body');

            context.maskList = [];
            context.zIndexList = [];
            context._zIndexList = [];


            context.$mask = $(context.MASK_TEMP);
            context.$shelter = $(context.SHELTER_TEMP);
            context.$title = context.$shelter.find('.maskTitle');
            context.$alert = $('#alertList');


            $body.append(context.$mask);


            context.timeoutHandler = null;

            //兼容IE8~IE10背景为透明时遮罩不生效
            if (/MSIE|Trident/.test(navigator.userAgent)) {
                context.isIE = true;
                context.$shelterPolyfill = $(context.SHELTER_POLYFILL_TEMP);
                $body.append(context.$shelterPolyfill)
            }

            $body.append(context.$shelter);

            //绑定监听，为了兼容IE8，用document不用window
            $(document).on({
                'keydown.shelter': function (e) {
                    var key = e.which || window.event.keyCode,
                        url, bgStyle;
                    //如果key为27 遮罩消失
                    if (key === 27) {
                        //IE环境按esc键会使所有gif动画暂停，需重新请求gif
                        if (context.isIE) {
                            //使路径包含项目名
                            url = window.location.href.split('#')[0];
                            bgStyle = 'url(' + url + 'dependence/AWEB/img/loading.gif?timestamp=' + app.getUID() + ') no-repeat';
                            $('#maskPic').css('background', bgStyle);
                        }

                        context.hideAll();

                        //兼容IE8gif重新请求后不显示问题，阻止冒泡
                        return false;
                    }
                },
                'error.shelter': function (e) {
                    context.hideAll();
                }
            });
        };


        Shelter.prototype = {


            SHELTER_POLYFILL_TEMP: '<div id="shelterPolyfill" class="mask shelterPolyfill hide"></div>',
            SHELTER_TEMP: '<div id="shelter" class="mask shelter hide"><div class="maskCtn maskCtt"><div class="maskCtt"><div id="maskPic" class="maskPic"></div><div class="maskTitle"></div></div><div class="maskHelper"></div></div><div class="maskHelper"></div></div>',
            MASK_TEMP: '<div id="mask" class="hide"/>',

            ALERT_INDEX: 15000,
            ALERT_TOP: 5,

            MASK_INDEX: 1052,

            DEFAULT_TITLE: '请稍候…',
            DEFAULT_TIMEOUT: 60000,


            show: function (title, timeout, immediate, $context) {
                var modal, $el;
                this.maskList.push(arguments);
                this._upper(true, this.ALERT_INDEX + 1, undefined, false);

                if ($context) {
                    this._setShelter($context);
                } else {
                    app.router && app.router.getCurrentHandler && (modal = app.router.getCurrentHandler());
                    modal && ($el = modal.$renderTo);
                    $el && this._setShelter($el.parent());
                }

                this._showShelter(title, timeout);
            },
            hide: function () {
                this._hide();
            },
            hideAll: function () {
                this.maskList = [];
                this._zIndexList = [];
                this._lower(true);
                this._resetShelter();
                this._display(false);
            },


            upperZIndex: function (alertZIndex, maskZIndex, alertTop) {
                this._upper(false, alertZIndex, maskZIndex, alertTop);
            },
            lowerZIndex: function () {
                this._lower();
            },

            //使遮罩相对于$context垂直水平居中
            _setShelter: function ($context) {
                var el = $context.get(0),
                    position = el.getBoundingClientRect(),
                    $body = $('body'),
                    top = position.top,
                    right = $body.width() - position.right,
                    bottom = $body.height() - position.bottom,
                    left = position.left;


                this.$shelterPolyfill && this.$shelterPolyfill.css({
                    top: top + 'px',
                    right: right + 'px',
                    bottom: bottom + 'px',
                    left: left + 'px'
                });


                this.$shelter.css({
                    top: top + 'px',
                    right: right + 'px',
                    bottom: bottom + 'px',
                    left: left + 'px'
                })

            },
            _resetShelter: function () {

                this.$shelterPolyfill && this.$shelterPolyfill.css({
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                });

                this.$shelter.css({
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                })
            },

            _showShelter: function (title, timeout) {
                var context = this;

                this._setTitle(title);
                this._display(true);

                try {
                    timeout = parseInt(timeout, 10) || this.DEFAULT_TIMEOUT;
                } catch (e) {
                    timeout = this.DEFAULT_TIMEOUT;
                } finally {

                    clearTimeout(this.timeoutHandler);

                    this.timeoutHandler = setTimeout(function () {
                        context._hide();
                    }, timeout);
                }
            },
            _hide: function () {
                var maskList = this.maskList,
                    args;

                maskList.pop();
                this._lower(true);
                this._resetShelter();

                if (maskList.length) {
                    args = maskList[maskList.length - 1];

                    this._showShelter.apply(this, args);
                } else {
                    this._display(false);
                }
            },
            _setTitle: function (title) {
                this.$title
                    .empty()
                    .append(title || this.DEFAULT_TITLE);
            },
            _display: function (display) {


                if (!!display) {
                    this.$shelterPolyfill && this.$shelterPolyfill.removeClass('hide');
                    this.$shelter.removeClass('hide');


                } else {
                    this.$shelterPolyfill && this.$shelterPolyfill.addClass('hide');
                    this.$shelter.addClass('hide');
                }

            },
            _upper: function (inner, alertZIndex, maskZIndex, alertTop) {
                var $mask = inner ? this.$shelter : this.$mask,
                    $alert = this.$alert,
                    zIndexList = inner ? this._zIndexList : this.zIndexList;

                alertZIndex = alertZIndex === false ? '' : (alertZIndex && parseInt(alertZIndex, 10) || this.ALERT_INDEX);
                maskZIndex = maskZIndex && parseInt(maskZIndex, 10) || this.MASK_INDEX;

                //备份上次的zIndex
                zIndexList.push({
                    alertZIndex: this.ALERT_INDEX,
                    maskZIndex: $mask.css('zIndex')
                });

                if (maskZIndex !== -1) {
                    $mask
                        .addClass('mask')
                        .css({
                            'z-index': maskZIndex
                        });
                }
                $alert.css({
                    'z-index': alertZIndex,
                    'top': alertTop === false ? '' : (alertTop || this.ALERT_TOP)
                });
            },
            _lower: function (inner) {
                //恢复上次的zIndex
                var $mask = inner ? this.$shelter : this.$mask,
                    $alert = this.$alert,
                    zIndexList = inner ? this._zIndexList : this.zIndexList,
                    lastZIndex = zIndexList.length ? zIndexList.pop() : {
                        maskZIndex: this.MASK_INDEX,
                        alertZIndex: this.ALERT_INDEX
                    };

                if (!parseInt(lastZIndex.maskZIndex, 10)) { //如果上一次没有遮罩的话，则将mask移除
                    $mask.removeClass('mask');
                    $alert.css('top', '');
                }
                $mask.css('z-index', lastZIndex.maskZIndex || '');
                $alert.css('z-index', lastZIndex.alertZIndex || '');
            }

        };

        return new Shelter();
    })