(function(){
                var SHOW_TYPE = {
                        SUCCESS: 'success',
                        success: 'fa fa-check-circle alert-success ',
                        _DEFAULT: 'info',
                        info: 'fa fa-info-circle alert-info',
                        ERROR: 'error',
                        error: 'fa fa-warning alert-pink',
                        WARNING: 'warning',
                        warning: 'fa fa-info-circle alert-warning',
                        PINK: 'pink',
                        pink: 'alert-pink',
                        MESSAGE: 'message'
                    },

                    alertCtnTemp = '<ul id="alertList" data-role="alertList" class="alert-list unstyled" style="z-index: 8;"></ul>',
                    alertCttTemp = '<li data-alert-id="_id_"><i class="iconfont icon-topbar-close alert-btn" title="关闭" data-role="close"></i><i class="fa fa-angle-down alert-btn" data-role="more" title="更多"></i><i class="alert-icon _showType_"></i><div class="alert-content" title="_title_">_content_</div></li>',


                    alertQueueLength = Math.max(Math.ceil($(window).height() / 100), 3),
                    alertQueue = [],
                    alertList = [],
                    type, event,
                    stopClose = false,

                    $alert = $('#alertList'),


                    messageDialog = function () {
                        var queue = [],
                            clickHandler = function () {
                                var msg, result = true;
                                queue.shift();

                                if (queue.length) {
                                    msg = queue[0];
                                    while (queue.length && !msg) {
                                        queue.shift();
                                        msg = queue[0];
                                    }
                                    if (msg) {
                                        $(this).find('[data-role=message]').empty().append(msg.toString().replace(/\n/g, '<br/>'));
                                        result = false;
                                    }
                                }
                                return result;
                            };

                        return function (msg) {
                            var modal;

                            queue.push(msg);

                            if (queue.length === 1 && (msg = queue[0])) {

                                modal = app.modal || window.app && window.app.modal || function (option) {
                                    app.alert(option.content);
                                    clickHandler();
                                };

                                modal({
                                    title: '信息提示',
                                    btnCancel: '关闭',
                                    btnConfirm:false,
                                    confirmHandler: clickHandler,
                                    cancelHandler: clickHandler,
                                    content: '<div class="aui-ide-modal-content"><i class="iconfont icon-round_warming"></i><p data-role="message">' + msg.toString().replace(/\n/g, '<br/>') + '</p></div>',
                                    isDialog: true,
                                    isLargeModal: false,
                                    init: function () {
                                        var $body = $(this);
                                        setTimeout(function () {
                                            $body.prev().find('.close').off().remove();
                                        }, 100);
                                    }
                                });

                            }
                        }
                    }(),

                    addToQueue = function (args) {
                        var i, item, id,
                            result = false;

                        if (id = args[2]) {
                            for (i = -1; item = alertQueue[++i];) {
                                if (result = (item[2] === id)) {
                                    break;
                                }
                            }
                        }

                        if (!result) {
                            alertQueue.push(args);
                        }
                    },
                    delFormQueue = function () {
                        return alertQueue.shift();
                    },
                    execAlert = function (msg, type, id) {
                        var $item = null,
                            args;

                        //校验样式在_showType中
                        type = type || SHOW_TYPE._DEFAULT;

                        if (type === SHOW_TYPE.MESSAGE) {
                            messageDialog(msg + '');
                            console.info(msg);
                        } else {


                            msg += '';


                            if ($alert.children().length < alertQueueLength) {

                                if (!id || !$alert.children('[data-alert-id="' + id + '"]').length) {

                                    //使获取提示框列表时,1键的类型不会被替换成样式名
                                    args = JSON.parse(JSON.stringify(arguments));
                                    //使获取提示框列表时，即使2键的值为undefined，也不会被忽略
                                    if (!args[2]) {
                                        args[2] = 'undefined';
                                    }
                                    alertList.push(args);

                                    type = SHOW_TYPE[type] || SHOW_TYPE.info;

                                    $item = $alert
                                        .prepend(alertCttTemp.replace(/_id_/, id).replace(/_showType_/, type).replace(/_content_/, msg).replace(/_title_/, msg))
                                        .children(':first');

                                    //IE8下触发重绘
                                    $alert.css('visibility','inherit').css('visibility','visible');

                                    $item.attr('title', $item.text());

                                    // //出现
                                    setTimeout(function () {
                                        $item.addClass('out');
                                    }, 50 + Math.random() * 50);
                                    // //隐藏

                                    setTimeout(function () {
                                        if (!stopClose) {
                                            $item.removeClass('out');
                                            execNextAlert($item);
                                        }
                                    }, 10000 + Math.random() * 1000);
                                }
                            } else {
                                addToQueue(arguments);
                            }
                        }
                    },
                    execNextAlert = function ($lastElem) {
                        setTimeout(function () {
                            if ($lastElem) {
                                $lastElem.remove();
                                $lastElem = null;
                                alertList.shift();
                            }
                            if (alertQueue.length) {
                                execAlert.apply(this, delFormQueue());
                            }
                        }, 500);
                    },
                    alertFunc = function (msg, showType, id) {
                        event && event.trigger('alert', arguments);
                        if (msg instanceof Array) {
                            for (var i = -1, alt; alt = msg[++i];) {
                                if (alt instanceof Array) {
                                    execAlert(alt[0], alt[1], alt[2]);

                                } else {
                                    execAlert(alt, showType, id);
                                }
                            }
                        } else {
                            execAlert(msg, showType, id);
                        }
                    };


                //初始化数据
                if (!$alert.length) {
                    $alert = $(alertCtnTemp);
                    $alert.appendTo('body');
                }

                for (type in SHOW_TYPE) {
                    if (SHOW_TYPE.hasOwnProperty(type)) {
                        alertFunc[type] = SHOW_TYPE[type];
                    }
                }


                alertFunc.closeAll = function () {
                    alertQueue = [];
                    alertList = [];
                    $alert.empty();
                };

                alertFunc.close = function (option) {
                    var id, item, len;
                    if (!(option instanceof Object)) {
                        console.error('入参必须为对象');
                        return
                    }

                    id = option.id;

                    if (id) {
                        for (len = alertQueue.length; item = alertQueue[--len];) {
                            if ((item.length && ~Array.prototype.indexOf.call(item, id)) || item) {
                                alertQueue.splice(len, 1);
                                break;
                            }
                        }
                        if ($alert.children('[data-alert-id=' + id + ']').length) {
                            $('[data-alert-id=' + id + ']', $alert).remove();

                        }
                    } else {
                        console.error("id的值不能为'undefined'");
                    }
                };

                alertFunc.getAlertList = function () {
                    return alertList.concat(alertQueue);
                };

                alertFunc.listener = function (callback,nameSpace) {

                    !event && (event = app.dispatcher());

                    event.on('alert'+ nameSpace?nameSpace:'', function () {

                        callback && callback(arguments[1])

                    })
                };

                alertFunc.offListener = function(nameSpace){

                    event.off('alert'+ nameSpace?nameSpace:'')

                };




                //override alert
                window.alert = messageDialog;

                /*监听绑定*/
                //关闭按钮
                $alert.off().on('click', function (e) {
                    var $e = $(e.target || window.event.srcElement),
                        $ctt,$alertList,alertTop,
                        role = $e.attr('data-role'),
                        winHeight = $(window).height();

                    switch (role) {
                        case 'close':
                            $e.parent().removeClass('out');

                            execNextAlert($e.parent());

                            stopClose = false;
                            break;
                        case 'more':
                            $ctt = $e.siblings('.alert-content');
                            $alertList = $ctt.parent().parent();
                            alertTop = $alertList.css('top');

                            if ($e.hasClass('more')) {
                                stopClose = false;
                                $ctt.removeClass('more');
                                $ctt.css({'height': ''});
                            } else {
                                stopClose = true;
                                $ctt.addClass('more');
                                if($ctt.height() > winHeight) {
                                    $ctt.css({'height': winHeight - 52 - ( 2 * Number.parseFloat(alertTop))});
                                }

                            }
                            $e.toggleClass('more');

                            break;
                    }
                });

                /*详情请见api部分*/
                return alertFunc;
            });
