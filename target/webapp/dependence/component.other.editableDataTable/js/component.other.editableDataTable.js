/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.03.20
 */
(/* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "dataTables.buttons.min", "dataTables.editor.min", "dataTables.select.min"], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget) {
        "use strict";

        var classRegExp = /medium-\d+/;

        function render($widget, $selector, option, attr, formOption, auiCtx, event) {
            //获取操作数据
            var getOpRowData = function () {
                    return JSON.stringify(opRowData);
                },
                //获取操作行id
                getOpRowId = function () {
                    return opRowId;
                },
                //获取选中行id
                getSelectedRowIds = function () {
                    var idsObj = dataTable.rows({selected: true}).ids();
                    var ids = [];
                    for (var prop in idsObj) {
                        if(idsObj.hasOwnProperty(prop) && !isNaN(prop)){
                                ids.push(idsObj[prop]);
                        }

                    }
                    return ids.length == 1 ? ids[0] : ids;
                },
                //获取选中行的index
                getSelectedRowIndexs = function () {
                    var ids = getSelectedRowIds();
                    if ($.isArray(ids)) {
                        var indexs = [],
                            index;
                        for (var i = 0; i < ids.length; i++) {
                            index = $('tr[id="' + ids[i] + '"]', $table).prop('_DT_RowIndex');
                            indexs.push(index);
                        }
                        return indexs;
                    } else {
                        var index;
                        if (ids) {
                            index = $('tr[id="' + ids + '"]', $table).prop('_DT_RowIndex');
                        }
                        return index;
                    }
                },
                //解析行数据
                parseNodes = function (nodesObj) {
                    var nodes = [];
                    for (var prop in nodesObj) {
                        if(nodesObj.hasOwnProperty(prop) && !isNaN(prop)){
                                var trData = [],
                                    $tr = $(nodesObj[prop]),
                                    $tds = $tr.children('td'),
                                    rowId = $tr.attr("id");
                                trData.push(rowId);
                                $tds && $.each($tds, function (index, value) {
                                    if (index !== 0) {
                                        trData.push($(value).text());
                                    }
                                });
                                nodes.push(trData);
                        }

                    }
                    return nodes;
                },
                //获取选中行节点tr
                getSelectedRowNodes = function () {
                    var nodesObj = dataTable.rows({selected: true}).nodes();
                    return parseNodes(nodesObj);
                },
                //获取所有行数据
                getAllRowNodes = function () {
                    var nodesObj = dataTable.rows().nodes();
                    return parseNodes(nodesObj);
                },
                /*
                 * data数据格式
                 * {
                 *      'DT_RowId': 'rowId1',
                 *      'a' : 'a',
                 *      'b' : 'b'
                 * }
                 * */
                //添加行
                addRow = function (data) {
                    if (data) {
                        dataTable.row.add(data).draw();
                    }
                },
                /*参数data格式
                [
                   {
                       'DT_RowId': 'rowId1',
                       'a' : 'a',
                       'b' : 'b'
                   },{
                       'DT_RowId': 'rowId2',
                       'a' : 'aaaa',
                       'b' : 'bbbb'
                   }
                ]
                */
                //添加多行
                addRows = function (data) {
                    if (data) {
                        dataTable.rows.add(data).draw();
                    }
                },
                //更新行
                updateRow = function (rowId, updateRowData) {
                    if (rowId && updateRowData) {
                        updateRowData.DT_RowId = rowId;
                        //根据rowId找到行index
                        var rowIndex = $('tr[id="' + rowId + '"]', $table).prop('_DT_RowIndex');
                        //获取到行，设置修改后的数据
                        var rowData = dataTable.row(rowIndex).data();
                        for (var prop in updateRowData) {
                            if(updateRowData.hasOwnProperty(prop)){
                                rowData[prop] = updateRowData[prop];

                            }
                        }
                        //修改该行数据
                        dataTable.row(rowIndex).data(rowData).draw();
                    }
                },
                //删除行
                deleteRow = function (rowId) {
                    if (rowId) {
                        //根据rowId找到行index
                        var rowIndex = $('tr[id="' + rowId + '"]', $table).prop('_DT_RowIndex');
                        //删除行
                        dataTable.row(rowIndex).remove().draw();
                    }
                },
                //清空表格数据
                clearTable = function () {
                    dataTable.rows().remove().draw();
                },
                //刷新表格
                refresh = function (data) {
                    //清空表格
                    clearTable();
                    if ("auiAjaxTest" === data) {
                        var testData = generateTestData(option.columns);
                        addRows(testData);
                    } else {
                        //添加数据
                        addRows(data);
                    }
                },
                //销毁
                destroy = function () {
                    clearTable();
                    dataTableEditor.destroy();
                    dataTable.destroy();
                },
                //创建编辑器表单配置
                createEditorFields = function (detaultEditorConfig, columns) {
                    var fieldsConfig = {
                            fields: []
                        },
                        keys = columns.keys,
                        fields = columns.fields,
                        elements = columns.elements,
                        copyDefaultConfig;

                    if (elements) {
                        for (var i = 0; i < elements.length; i++) {
                            //只要列可编辑就添加到表单中
                            if (elements[i].editable) {
                                //key先从配置中拿，如果没配置，则从edm中拿
                                var key = elements[i].columnKey;
                                if (!key) {
                                    if (keys[i] && keys[i].indexOf('.') !== -1) {
                                        key = keys[i].substring(keys[i].indexOf('.') + 1, keys[i].length);
                                    } else {
                                        key = keys[i];
                                    }
                                }

                                if (key) {
                                    fieldsConfig.fields.push({
                                        label: fields[i],
                                        name: key
                                    });

                                    //记录下field的校验信息，用于以后校验使用。
                                    if (elements[i].needCheck) {
                                        needCheckField[key] = {
                                            'regex': elements[i].regex,
                                            'errorMsg': elements[i].errorMsg
                                        }
                                    }
                                }
                            }
                        }
                        copyDefaultConfig = $.extend(true, {}, detaultEditorConfig);
                        copyDefaultConfig.fields = [];
                        return $.extend(true, copyDefaultConfig, fieldsConfig);
                    }
                    return fieldsConfig;
                },
                //创建datatable列配置
                createDatatableColumn = function (defaultDataTableConfig, columns) {
                    var columnsConfig = {
                            columns: [],
                            columnDefs: []
                        },
                        elements = columns.elements,
                        keys = columns.keys,
                        copyDefaultConfig;

                    if (elements) {
                        //添加checkbox列
                        columnsConfig.columns.push({
                            data: null,
                            defaultContent: '',
                            className: 'select-checkbox',
                            orderable: false,
                            targets: 0
                        });

                        for (var i = 0; i < elements.length; i++) {
                            //key先从配置中拿，如果没配置，则从edm中拿
                            var key = elements[i].columnKey;
                            if (!key) {
                                if (keys[i] && keys[i].indexOf('.') !== -1) {
                                    key = keys[i].substring(keys[i].indexOf('.') + 1, keys[i].length);
                                } else {
                                    key = keys[i];
                                }
                            }

                            if (key) {
                                columnsConfig.columns.push({
                                    data: key
                                });

                                //添加列是否显示配置
                                columnsConfig.columnDefs.push({
                                    targets: [i + 1],
                                    visible: elements[i]['visable']
                                });
                            }
                        }

                        copyDefaultConfig = $.extend(true, {}, defaultDataTableConfig);
                        copyDefaultConfig.columns = [];
                        return $.extend(true, copyDefaultConfig, columnsConfig);
                    }
                    return columnsConfig;
                },
                //创建简单配置
                createSimpleDtConfig = function (option) {
                    var dataTableConfig = {};
                    dataTableConfig.stateSave = option.stateSave;
                    dataTableConfig.paging = option.paging;
                    if (!option.paging) {
                        dataTableConfig.scrollCollapse = true;
                        option.scrollY && (dataTableConfig.scrollY = option.scrollY);
                    }
                    dataTableConfig.pagingType = option.pagingType;

                    return dataTableConfig;
                },
                //创建表头
                createTableHead = function ($table, columns) {
                    var elements = columns.elements,
                        fields = columns.fields,
                        headerName,
                        columnWidth,
                        $tr,
                        $th;
                    if (elements) {
                        //设置checkbox列宽度
                        option.checkboxWidth && $('thead tr:eq(0) th:eq(0)').attr('width', option.checkboxWidth);

                        $tr = $('thead tr:eq(0)', $table);

                        for (var i = 0; i < elements.length; i++) {
                            headerName = fields[i];

                            if (headerName) {
                                //如果配置列宽，则添加width属性
                                columnWidth = elements[i]['columnWidth'];
                                $th = $('<th>' + headerName + '</th>');
                                if (columnWidth) {
                                    $th.attr('width', columnWidth);
                                }
                                $tr.append($th);
                            }
                        }
                    }
                },
                //校验创建和修改的表单
                checkFields = function (target, editor, needCheckField) {
                    //校验
                    for (var fieldName in needCheckField) {
                        if(needCheckField.hasOwnProperty(fieldName)){
                            var field = editor.field(fieldName);
                            if (needCheckField[fieldName].regex) {
                                var reg = new RegExp(needCheckField[fieldName].regex);
                                //校验不通过
                                if (!reg.test(field.val())) {
                                    if (needCheckField[fieldName].errorMsg) {
                                        field.error(needCheckField[fieldName].errorMsg);
                                    } else {
                                        //默认提示信息
                                        field.error('校验失败!');
                                    }
                                }
                            }
                        }

                    }
                    if (target.inError()) {
                        return false;
                    }
                    return true;
                },
                //设置可编辑列
                applyEditableCells = function (columns) {
                    var elements = columns.elements,
                        columnIndex = 2;

                    $(dataTable.table().container()).off('click.edit');

                    for (var i = 0; i < elements.length; i++) {
                        //必须列可见，同时可编辑时才设置列可编辑
                        if (elements[i].visable && elements[i].editable) {
                            // 表格可编辑，并且提交整行数据
                            $(dataTable.table().container()).on('click.edit', 'tbody td:nth-child(' + columnIndex + ')', function (e) {
                                dataTableEditor.inline(this, {
                                    submit: 'allIfChanged'
                                });
                            });
                        }
                        //只要元素可见就自增
                        if (elements[i].visable) {
                            columnIndex++;
                        }
                    }
                },
                //生成测试数据
                generateTestData = function (columns) {
                    var count = 100,
                        elements = columns.elements,
                        keys = columns.keys,
                        fields = columns.fields,
                        name,
                        testData = [];
                    if (elements) {
                        for (var i = 0; i < count; i++) {
                            var item = {
                                'DT_RowId': 'rowId_' + i
                            };

                            for (var j = 0; j < elements.length; j++) {
                                //key先从配置中拿，如果没配置，则从edm中拿
                                var key = elements[j].columnKey;
                                if (!key) {
                                    if (keys[j] && keys[j].indexOf('.') !== -1) {
                                        key = keys[j].substring(keys[j].indexOf('.') + 1, keys[j].length);
                                    } else {
                                        key = keys[j];
                                    }
                                }
                                if (key) {
                                    item[key] = fields[j] + i
                                }
                            }

                            testData.push(item);
                        }
                    }
                    return testData;
                },
                //初始化
                init = function () {
                    $table = $selector.find('table');

                    //创建表头
                    createTableHead($table, option.columns);

                    var editorConfig,
                        dataTableConfig,
                        defaultDataTableConfig,
                        defaultEditorConfig = {
                            table: $table[0],
                            fields: [{
                                label: "First name:",
                                name: "first_name"
                            }, {
                                label: "Last name:",
                                name: "last_name"
                            }, {
                                label: "Position:",
                                name: "position"
                            }, {
                                label: "Office:",
                                name: "office"
                            }, {
                                label: "Extension:",
                                name: "extn"
                            }, {
                                label: "Start date:",
                                name: "start_date"
                            }, {
                                label: "Salary:",
                                name: "salary"
                            }
                            ],
                            i18n: {
                                create: {
                                    button: "创建",
                                    title: "创建",
                                    submit: "创建"
                                },
                                edit: {
                                    button: "修改",
                                    title: "修改",
                                    submit: "修改"
                                },
                                remove: {
                                    button: "删除",
                                    title: "确定",
                                    submit: "删除",
                                    confirm: {
                                        _: "确定要删除%d行?",
                                        1: "确定要删除该行数据?"
                                    }
                                },
                                /*error: {
                                    system: "Une erreur s’est produite, contacter l’administrateur système"
                                },
                                datetime: {
                                    previous: 'Précédent',
                                    next:     'Premier',
                                    months:   [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ],
                                    weekdays: [ 'Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam' ]
                                }*/
                            }
                        };

                    //替换配置表单
                    editorConfig = createEditorFields(defaultEditorConfig, option.columns);

                    //创建editor
                    dataTableEditor = new $.fn.dataTable.Editor(editorConfig);

                    defaultDataTableConfig = {
//                        fixedColumns: {
//                            leftColumns: 2
//                        },
                        stateSave: true,
//                        scrollX: true,
                        dom: "Bfrtip",
                        order: [[1, 'asc']],
                        columns: [
                            {
                                data: null,
                                defaultContent: '',
                                className: 'select-checkbox',
                                orderable: false,
                                targets: 0
                            },
                            {data: "first_name"},
                            {data: "last_name"},
                            {data: "position"},
                            {data: "office"},
                            {data: "start_date"},
                            {data: "salary", render: $.fn.dataTable.render.number(',', '.', 0, '$')}
                        ],
                        select: {
                            style: 'os',
                            selector: 'td:first-child'
                        },
                        buttons: [
                            {
                                extend: "create",
                                editor: dataTableEditor,
                                className: "btn btn-focus",
                                formButtons: [
                                    '创建',
                                    {
                                        label: '取消', fn: function () {
                                            this.close();
                                        }
                                    }
                                ]
                            },
                            {
                                extend: "edit",
                                editor: dataTableEditor,
                                className: "btn btn-normal",
                                formButtons: [
                                    '修改',
                                    {
                                        label: '取消', fn: function () {
                                            this.close();
                                        }
                                    }
                                ]
                            },
                            {
                                extend: "remove",
                                editor: dataTableEditor,
                                className: "btn btn-normal",
                                formButtons: [
                                    '删除',
                                    {
                                        label: '取消', fn: function () {
                                            this.close();
                                        }
                                    }
                                ]
                            }
                        ]
                    };

                    //替换表头数据
                    dataTableConfig = createDatatableColumn(defaultDataTableConfig, option.columns);
                    //替换简单配置
                    dataTableConfig = $.extend(true, dataTableConfig, createSimpleDtConfig(option));
                    //替换按钮配置
                    dataTableConfig.buttons = [];
                    if (option.canCreate) {
                        dataTableConfig.buttons.push({
                            extend: "create",
                            editor: dataTableEditor,
                            className: "btn btn-focus",
                            formButtons: [
                                '创建',
                                {
                                    label: '取消', fn: function () {
                                        this.close();
                                    }
                                }
                            ]
                        });
                    }

                    if (option.canUpdate) {
                        dataTableConfig.buttons.push({
                            extend: "edit",
                            editor: dataTableEditor,
                            className: "btn btn-normal",
                            formButtons: [
                                '修改',
                                {
                                    label: '取消', fn: function () {
                                        this.close();
                                    }
                                }
                            ]
                        });
                    }

                    if (option.canRemove) {
                        dataTableConfig.buttons.push({
                            extend: "remove",
                            editor: dataTableEditor,
                            className: "btn btn-normal",
                            formButtons: [
                                '删除',
                                {
                                    label: '取消', fn: function () {
                                        this.close();
                                    }
                                }
                            ]
                        });
                    }
                    //配置按钮
                    if (option.button && option.button.length > 0) {
                        for (var i = 0; i < option.button.length; i++) {
                            var btnConfig = option.button[i];
                            var config = {
                                className: 'extendBtn btn btn-normal',
                                text: btnConfig.name || ('按钮' + i)
                            };

                            //是否由checkbox控制
                            if (btnConfig.isControlled) {
                                config.extend = 'selectedSingle';
                            }

                            dataTableConfig.buttons.push(config);
                        }
                    }

                    dataTable = $table.DataTable(dataTableConfig);

                    //设置可编辑表格列
                    applyEditableCells(option.columns);

                    //注册数据提交前事件，主要是拦截组件默认提交数据事件，并改用AWEB IDE发送请求.
                    dataTableEditor.on('preSubmit', function (e, data, action) {
                        if (action !== 'remove') {
                            //校验不通过，不提交
                            if (!checkFields(this, dataTableEditor, needCheckField)) {
                                return false;
                            }
                        }

                        //关闭编辑弹窗
                        dataTableEditor.close();
                        if (action === 'create') {
                            //缓存操作数据
                            opRowData = data.data[0];

                            //触发隐藏按钮点击
                            $('div[data-dte-e="hidden-btn-group"]', $selector).find('input:eq(0)').trigger('click');

                            //请求成功后让用户回调
                            //addRow('row_111' , opRowData);
                        } else if (action === 'edit') {
                            var rowId,
                                rowData;

                            for (var id in data.data) {
                                if (data.data.hasOwnProperty(id)) {
                                    rowId = id;
                                    rowData = data.data[id];
                                }

                            }

                            //缓存操作数据
                            opRowId = rowId;
                            opRowData = rowData;

                            //触发隐藏按钮点击
                            $('div[data-dte-e="hidden-btn-group"]', $selector).find('input:eq(1)').trigger('click');

                            //请求成功后让用户回调
                            //updateRow(rowId, rowData);
                        } else if (action === 'remove') {
                            var rowId;
                            for (var id in data.data) {
                                if(data.data.hasOwnProperty(id)){
                                    rowId = id;

                                }
                            }

                            //缓存操作数据
                            opRowId = rowId;

                            //触发隐藏按钮点击
                            $('div[data-dte-e="hidden-btn-group"]', $selector).find('input:eq(2)').trigger('click');

                            //请求成功后让用户回调
                            //deleteRow(rowId);
                        }

                        //终止默认发送的请求
                        return false;
                    });

                    //更新添加按钮的id和data-authority
                    if (option.button && option.button.length > 0) {
                        for (var i = 0; i < option.button.length; i++) {
                            var btnConfig = option.button[i];
                            var $btn = $(dataTable.buttons('.extendBtn')[i].node);
                            btnConfig.id && $btn.attr('id', btnConfig.id);
                            btnConfig['data-authority'] && $btn.attr('data-authority', btnConfig['data-authority']);

                            //添加事件配置中的selector
                            event || (event = {});
                            event.selector || (event.selector = []);
                            event.selector.push({
                                'desp': '按钮"' + $btn.text() + '"',
                                'value': '###_ID## ' + '.dt-buttons .btn .btn-normal .extendBtn:eq(' + i + ')'
                            });
                        }
                    }
                };

            var template = '<table class="display" cellspacing="0" width="100%">' +
                '<thead>' +
                '<tr>' +
                '<th width="30px"></th>' +
                '</tr>' +
                '</thead>' +
                '</table>' +
                '<div style="display:none" data-dte-e="hidden-btn-group"><input type="button"/><input type="button"/><input type="button"/></div>',
                $table,
                dataTableEditor,
                dataTable,
                opRowData,
                opRowId,
                needCheckField = {};

            $selector.attr("id", attr.id || '');

            if ($widget && $widget.length) {
                $selector.append(template);
                renderContainerSpan($widget, option.span);

                if (option.columns.fields && option.columns.fields.length) {
                    init();
                    var testData = generateTestData(option.columns);
                    refresh(testData);
                }

            } else {
                $selector.append(template);
                renderContainerSpan($selector, option.span);

                if (option.columns.elements) {
                    init();
//                    var testData = generateTestData(option.columns);
//                    refresh(testData);
                }
            }
            return {
                'editor': dataTableEditor,
                'dataTable': dataTable,
                'getOpRowData': getOpRowData,
                'getOpRowId': getOpRowId,
                'getSelectedRowIds': getSelectedRowIds,
                'getSelectedRowIndexs': getSelectedRowIndexs,
                'getSelectedRowNodes': getSelectedRowNodes,
                'getAllRowNodes': getAllRowNodes,
                'addRow': addRow,
                'updateRow': updateRow,
                'deleteRow': deleteRow,
                'clearTable': clearTable,
                'refresh': refresh,
                'destroy': destroy,
                /*bbin+*/

                display: function (result, input1, input2, condition) {
                    this[result ? 'hide' : 'show']();
                },
                show: function () {
                    $selector.removeClass('hide');
                },
                hide: function () {
                    $selector.addClass('hide');
                }
            };
        }

        //设置容器的span，编辑期和运行的容器不同
        function renderContainerSpan($target, span) {
            var classname = $target.attr("class");

            if (classRegExp.test(classname)) {
                $target.attr("class", classname.replace(classRegExp, "medium-" + span));
            } else {
                $target.addClass("medium-" + span);
            }

            $target.addClass("columns");
        }

        if (!widget.component.other) {
            widget.component.other = {};
        }

        widget.component.other.editableDataTable = function (obj, oOption, oAttr, oCss, auiCtx) {
            var oWidget, $widget, attr, option, css, event,
                formWidget,
                $selector, formOption;

            $selector = obj;
            option = oOption;
            formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')];
            attr = oAttr;
            css = oCss;

            /*编译阶段渲染代码*/
            return render($widget, $selector, option, attr, formOption, auiCtx);
        };

        return widget;
    });
})();