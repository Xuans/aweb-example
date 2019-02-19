(function (options, undefined) {
                    var _default = $.extend(true, {
                            context: undefined,
                            button: undefined,
                            container: undefined,
                            checkbox: 'checkbox',
                            isDataTable: false,
                            isSelectChildren: false, //true,//要配置data-prefix  例如父级的data-prefix=12,那么data-prefix需要等于12[^$]{1,}
                            operationButtons: null
                            /*{
                     list: '#insStartBtn,#insRestartBtn,#insStopBtn,#insDelBtn',
                     status: {
                     'Running': ['#insRestartBtn,#insStopBtn', '#insDelBtn'],//前面单选，后面多选
                     'Stopped': ['#insStartBtn', '#insDelBtn'],
                     '_default': ['', '#insDelBtn']
                     }
                     }*/
                            ,
                            setNodeMethod: function (list, elem) {
                                list[elem.id] = {
                                    node: elem,
                                    status: $(elem).attr('data-status')
                                };
                                return list;
                            },
                            getIdMethod: function (elem) {
                                return elem.id;
                            },
                            getStatusMethod: null

                        }, options),
                        //私有变量
                        __list = {},
                        __checkboxSelector = _default.checkbox,
                        __isDataTable = _default.isDataTable,
                        __isBCheckState = _default.bCheckState,
                        __isSelectChildren = _default.isSelectChildren,
                        __operationButtons = _default.operationButtons,

                        __allCheck = '',
                        __allData = _default.allData,
                        //私有jQuery变量
                        __$context = $(_default.context),
                        __$ctn = $(_default.container, __$context),
                        __$btn = $(_default.button, __$context),


                        //私有方法
                        _setNode = _default.setNodeMethod,
                        _getId = _default.getIdMethod,
                        _getStatus = _default.getStatusMethod,

                        _removeNode = function (list, elem) {
                            var id = _getId(elem);

                            list[id] = null;
                            delete list[id];
                        },

                        _selectChangeFunc = function () {
                            // var checked = __$btn[0].checked;

                            if (__allCheck === 'allcheck') {

                                $.each(__list, function (index, item) {
                                    // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                    $('#' + index, __$ctn).prop('checked', true);
                                })
                            } else if (__allCheck === 'unAllcheck') {
                                _clear();
                            } else {
                                $.each(__list, function (index, item) {
                                    // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                    $('#' + index, __$ctn).prop('checked', true);
                                })
                            }


                        },
                        _searchChangeFunc = function () {
                            var i;
                            if (__allCheck === 'allcheck') {
                                if (__allData[0]) {
                                    for (i = 0; i < __allData.length; i++) {
                                        _setNode(__list, $(__allData[i][0]).children(0)[0])
                                    }
                                }
                            }
                            $.each(__list, function (index, item) {
                                // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                $('#' + index, __$ctn).prop('checked', true);
                            });
                        },
                        _updateStyle = function () {
                            var $checkbox = $(__checkboxSelector, __$ctn),
                                checkedLength = $checkbox.filter(':checked').length,
                                enableButton, checkLen = 0;

                            //更新全选按钮的样式
                            switch (checkedLength) {
                                case 0:
                                    __$btn.prop('indeterminate', false).removeAttr('checked').removeClass('tables-indeterminate');
                                    break;
                                case $checkbox.length:
                                    __$btn.prop('indeterminate', false).attr('checked', 'checked').removeClass('tables-indeterminate');
                                    break;
                                default:
                                    __$btn.prop('indeterminate', true).removeAttr('checked').addClass('tables-indeterminate');
                            }


                            //更新操作按钮的样式
                            if (__operationButtons && __operationButtons.list && __operationButtons.status) {
                                $(__operationButtons.list, __$context).attr('disabled', 'disabled');

                                if (checkedLength) {
                                    if (enableButton = __operationButtons.status[_getStatus(__list, _default)]) {
                                        enableButton = enableButton[checkedLength === 1 ? 0 : 1];
                                        if (enableButton) {
                                            $(enableButton, __$context).removeAttr('disabled');
                                        }
                                    }
                                }
                            }
                        },
                        _children = function (elem, checked) {
                            var $elem = $(elem),
                                execMethod = checked ? 'attr' : 'removeAttr';

                            if (!checked) $elem.removeAttr('checked');

                            $('[data-prefix^="' + $elem.attr('data-prefix') + '"]', __$ctn).not($elem)[execMethod]('disabled', 'disabled')[execMethod]('checked', 'checked');
                        },
                        _clear = function () {
                            __$btn.removeAttr('checked');
                            $(__checkboxSelector, __$context).removeAttr('checked');

                            for (var p in __list) {
                                __list[p] = null;
                                delete __list[p];
                            }
                            __allCheck = 'unAllcheck';
                            __list = {};
                            _updateStyle();
                        };


                    //默认禁用所有按钮
                    if (__operationButtons && __operationButtons.list) {
                        $(__operationButtons.list, __$context).attr('disabled', 'disabled');
                    }

                    //监听绑定
                    //多选按钮的更改事件
                    __$btn.off('.appSelect').on('click.appSelect', function () {
                        var checked = this.checked,
                            checkedMethod = !checked ? 'removeAttr' : 'attr',
                            execMethod = checked ? _setNode : _removeNode,
                            i;

                        if (__$btn.is(':checkbox') || (__$btn.is(':radio') && !checked)) {
                            //需要选择子集的
                            if (__isSelectChildren) {
                                $(__checkboxSelector, __$ctn)[checkedMethod]('checked', 'checked').each(function () {
                                    execMethod(__list, this);
                                    _children(this, checked);
                                });

                            } else { //不需要选择子集的

                                if (__isBCheckState) {
                                    if (__allCheck === 'allcheck') {
                                        __allCheck = 'unAllcheck';

                                        $.each(__list, function (index, item) {
                                            // $("#"+$(item.node).attr('id'),__$ctn).removeAttr('checked');
                                            $('#' + index, __$ctn).prop('checked', true);
                                        });
                                        _clear();


                                    } else {
                                        __allCheck = 'allcheck';

                                        //数据加载

                                        if (__allData[0]) {
                                            for (i = 0; i < __allData.length; i++) {
                                                _setNode(__list, $(__allData[i][0]).children(0)[0])
                                            }
                                        }
                                        $.each(__list, function (index, item) {
                                            // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                            $('#' + index, __$ctn).prop('checked', true);
                                        });

                                    }
                                } else {
                                    $(__checkboxSelector, __$ctn)[checkedMethod]('checked', 'checked').each(function () {
                                        execMethod(__list, this);
                                    });
                                }


                            }
                        }

                        _updateStyle();
                    });

                    //表格更改事件
                    __$ctn.off('.appSelect').on('click.appSelect', function (ev) {
                        var e = ev.target || window.event.srcElement,
                            $e = $(e), checkLen = 0, timer = null;

                        if (($e.is(_default.checkbox) && !ev.isTrigger)) {

                            if ($e.is(':radio')) {
                                _clear();
                                $e.attr('checked', true);
                                _setNode(__list, e);
                            } else {


                                e.checked ? _setNode(__list, e) : _removeNode(__list, e);


                                if (__isBCheckState) {

                                    $.each(__list, function (index, item) {
                                        checkLen++;
                                        // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                        $('#' + index, __$ctn).prop('checked', true);
                                    });
                                    if ($.isEmptyObject(__list)) {
                                        __allCheck = 'unAllcheck'
                                    } else if (checkLen === __allData.length) {
                                        __allCheck = 'allcheck';
                                    } else {
                                        __allCheck = 'indeterminate';
                                    }
                                }
                            }

                            if (__isSelectChildren) {
                                _children(e, e.checked);
                            }

                            _updateStyle();
                        }
                    });

                    //如果是dataTable
                    if (__isDataTable) {
                        //翻页事件重新统计选中实例按钮的样式
                        $('.dataTables_paginate', __$context).off('.appSelect').on('click.appSelect',function (e) {

                            var $e = $(e.target || window.event.srcElement), checked, checkedMethod, item;
                            if (__$btn[0]) {
                                checked = __$btn[0].checked;
                            }
                            checkedMethod = !checked ? 'removeAttr' : 'attr';


                            $(".paginate_button.current").attr("data-dt-idx");
                            if ($e.hasClass('paginate_button') || $e.parent().hasClass('paginate_button')) {
                                if (!__isBCheckState) {
                                    _clear();
                                }

                                if (__allCheck === "allcheck") {

                                    $(__checkboxSelector, __$ctn)[checkedMethod]('checked', 'checked').each(function () {
                                        _setNode(__list, this);
                                    });
                                    $.each(__list, function (index, item) {
                                        // $("#"+$(item.node).attr('id'),__$ctn).attr('checked','checked');
                                        $('#' + index, __$ctn).prop('checked', true);
                                    });

                                } else if (__allCheck === "unAllcheck") {
                                    for (item in __list) {

                                        $("#" + item, __$ctn).removeAttr('checked');
                                    }
                                    _clear();
                                } else {
                                    for (item in __list) {
                                        // id = $(item.node).attr('id');

                                        $("#" + item, __$ctn).attr('checked', 'checked').prop('checked', true);
                                    }
                                    // $.each(__list,function (index,item) {
                                    //     id = $(item.node).attr('id');
                                    //
                                    //     if($("#"+id,__$context).length) {
                                    //         $("#" + id, __$context).prop('checked', 'checked');
                                    //     }
                                    // });


                                }
                                _updateStyle();

                            }
                        });

                        if (!__isBCheckState) {
                            $('.dataTables_filter', __$context).find(':input').keyup(_clear);
                            $('.dataTables_length', __$context).find('select').change(_clear);
                        } else {
                            $('.dataTables_filter', __$context).find(':input').keyup(_searchChangeFunc);
                            $('.dataTables_length', __$context).find('select').change(_selectChangeFunc);
                        }

                    }


                    //返回组件方法
                    return {
                        //返回节列表的副本
                        nodes: function () {
                            return $.extend(true, {}, __list);
                        },
                        //选中一些checkbox,传入id组成的list
                        check: function (list) {
                            var $e, e, $input, firstPage = 0;

                            _clear();
                            __allCheck = '';
                            $.each(list, function (index, value) {

                                $e = $('#' + value, __$ctn);

                                firstPage++;

                                if ($e.length && $e.is(_default.checkbox)) {
                                    e = $e[0];

                                    e.checked = true;

                                    //必需找到指定的元素或者保存分页的情况下找
                                    if (!$('.dataTables_length', __$context).length || firstPage <= parseInt($('.dataTables_length', __$context).find('select').val(),10)||__isBCheckState) {
                                        _setNode(__list, e);

                                        if (__isSelectChildren) {
                                            _children(e, e.checked);
                                        }
                                    }

                                } else {
                                    $input=$('<input id="'+ value+'"/>');
                                    _setNode(__list, $input[0]);
                                    if (__isSelectChildren) {
                                        _children(e, e.checked);
                                    }
                                }
                            });

                            _updateStyle();
                        },
                        //返回节点ID数组
                        list: function (empty) {

                            var list = [],
                                p;

                            for (p in __list) {
                                list.push(p);
                            }

                            if(empty!==false) {
                                _clear();
                            }

                            return list;
                        },
                        //清除select的状态
                        clear: _clear,
                        size: function () {
                            var size = 0,
                                p;

                            for (p in __list) size++;

                            return size;
                        },
                        dispose: function () {
                            this.list(true);
                            for (var p in _default) {
                                _default[p] = null;
                                delete _default[p];
                            }

                            if (__isDataTable) {
                                $('.dataTables_paginate', __$context).off();
                                $('.dataTables_filter', __$context).find(':input').off();
                                $('.dataTables_length', __$context).find('select').off();
                            }

                            __$btn.off(), __$btn = null;
                            __$ctn.off(), __$ctn = null;
                            __$context = null;
                        }
                    };
                })