
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", 'ctn'], factory);
        }
        // global
        else {
            factory();
        }

    })
        (function ($, widget) {
            "use strict";


            widget.on([widget.STATUS.WIDGET_INIT, widget.STATUS.WIDGET_UPDATE, widget.STATUS.WIDGET_APPEND].join('.rowCtn,') + '.rowCtn', function (type, oWidget) {
                var FENCES_COUNT = 12, option, row, rowWidget,
                    row, len, option, rowWidth,
                    childrenLength, i,
                    canAdapt, appendCallBack, nextStep,
                    rowWidgetChildren;

                oWidget && oWidget.length && oWidget.each(function (index, elem) {

                    rowWidget = oWidget.eq(index);


                    if (rowWidget.href && rowWidget.href() === 'layout.rowCtn') {

                        rowWidget.drop(false);
                        option = rowWidget.option();

                        switch (type) {
                            case widget.STATUS.WIDGET_INIT:

                                row = option.row = [];

                                while (row.length < 2) {
                                    row.push({
                                        span: '6',
                                        offset: '0'
                                    });
                                    rowWidget.append('divCtn', function (newCtn) {
                                        newCtn.del(false) && newCtn.drag(false);
                                        rowWidget.option(option, true);
                                        newCtn.config();
                                    });
                                }

                                break;
                            case widget.STATUS.WIDGET_UPDATE:
                                childrenLength = rowWidget.children(':active').length;
                                if (((row = option.row) && row.length)) {
                                    if (childrenLength > row.length) { //删除
                                        if (len = row.length) { //长度不为0
                                            --len;
                                            rowWidget.children(':gt(' + len + ')').destroy();

                                            for (rowWidth = 0; elem = row[--len];) {
                                                rowWidth += (parseInt(elem.span, 10) + parseInt(elem.offset, 10));
                                            }

                                            elem = row[row.length - 1];
                                            elem.span = (FENCES_COUNT - rowWidth - parseInt(elem.offset, 10)) + '';
                                        } else { //长度为0
                                            row = [{
                                                span: 12,
                                                offset: 0
                                            }];
                                            rowWidget.children(':gt(0)').destroy();
                                        }
                                    } else if (childrenLength < row.length) { //增加
                                        row.splice(FENCES_COUNT, row.length);

                                        appendCallBack = function (newWidget) {
                                            newWidget && newWidget.del(false) && newWidget.drag(false);

                                            if (rowWidget.children(':active').length === row.length) {
                                                newWidget.config();
                                                nextStep();
                                            } else {
                                                rowWidget.append('divCtn', appendCallBack);
                                            }
                                        };

                                        nextStep = function () {
                                            //先判断总栅栏数是否超过12
                                            for (i = row.length - 1, rowWidth = 0; elem = row[--i];) {
                                                rowWidth += parseInt(elem.span, 10) + parseInt(elem.offset, 10);
                                            }

                                            if (rowWidth >= FENCES_COUNT) {
                                                for (i = row.length - 1; elem = row[--i];) {
                                                    if ((rowWidth = parseInt(elem.span, 10) - 1)) {
                                                        elem.span = rowWidth + '';
                                                        canAdapt = true;

                                                        row[row.length - 1] = {
                                                            span: 1,
                                                            offset: 0
                                                        };

                                                        break;
                                                    }
                                                }

                                                if (!canAdapt) {
                                                    row.splice(row.length - 1, 1);
                                                    rowWidget.children(':gt(' + (row.length - 1) + ')').destroy();
                                                    app.alert('栅栏列数已满！', app.alert.ERROR);
                                                }
                                            } else {
                                                row[row.length - 1] = {
                                                    span: FENCES_COUNT - rowWidth,
                                                    offset: 0
                                                };
                                            }
                                            option.row = row;
                                            rowWidget.option(option, true);

                                        };

                                        rowWidget.append('divCtn', appendCallBack);
                                    }
                                } else {
                                    rowWidget.children().destroy();
                                }
                                break;
                            case widget.STATUS.WIDGET_APPEND:
                                rowWidgetChildren = rowWidget.children(':active');
                                rowWidgetChildren.del(false) && rowWidgetChildren.drag(false);
                                break;
                        }

                    }


                });
            });


            widget.layout.rowCtn = function ($selector, option, attr, css) {
                var
                    len, c, row,
                    $divCtn,
                    style = css.style;


                $divCtn =  $selector.children("div");

                if (option) {
                    if (option.container) {
                        $selector.wrap('<div class="' + option.container + '"/>');
                    }

                    if (option.type) {
                        $selector.addClass(option.type);
                    }
                    if (row = option.row) {
                        $selector.children().each(function (i, elem) {
                            c = [];
                            if (elem = row[i]) {
                                elem.span && c.push('span' + elem.span);
                                elem.offset && c.push('offset' + elem.offset);
                                $(this).addClass(c.join(' '));
                            }
                        });
                    }
                }

                if (!$.isEmptyObject(style)) {
                    style.row && $selector.css(style.row);
                    style.divCtn && $divCtn.css(style.divCtn)
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
                    }
                }



            };


            return widget;
        });
})();