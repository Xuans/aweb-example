(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "Handsontable", "pikaday", "moment"/*,其他脚本文件名称请在这里填写，如'echarts'*/], factory);
        }
        // global
        else {
            factory();
        }

    })
    (function ($, widget, Handsontable/*,其他脚本文件对外暴露接口请在这里填写，如'charts'*/) {
        "use strict";

        //关于组件配置说明，请见"开发者中心"，搜索"388.组件设计"

        //关于代码调试工具的使用说明，请见"开发者中心"，搜索"397.开发者工具使用文档"


        var Component = function ($widget, option, attr, css, auiCtx) {
            var context = this;

            //Data Model
            context.$view = $widget;
            context.auiCtx = auiCtx;
            context.option = $.extend(true, {}, this.setting, option);
            context.colConfigArr = [];
            context.attr = attr;
            context.css = css;
            context.data = [];
            context.config = {};
            context.fakeData = [];
            context.setting = {};
            context.tableIns = {};
            context.columns = [];
            context.colName = [];
            context.debugger = window.auiApp && window.auiApp.debug;
            // 私有分页器数据
            context.pageIndex = {
                pageCurrent: 1,
                pageStart: 1,
                pageEnd: 5,
                pageLength: 10,
                recordsTotal: 50
            };
            context.ownData = {
                draw: 1,
                start: 0,
                length: 10
            };

            //View Model
            context.viewCache = {};

            //cache
            //context.cache={};

            //初始化
            context._init();

            //渲染样式
            context._render();

            //绑定事件
            context._listen();
        };

        Component.prototype = Component.fn = {
            constructor: Component,
            version: 'AWOS 5.1 XQ',
            author: 'zhanghaixian@agree.com.cn',

            //常量表

            checkResult: false,
            isSelectAll: false,
            indeterminate: false,
            currentNormWidth: '',
            nullWidthCount: 1,
            showColNum: 1,
            oldCurrentPageData: '',
            relateArr: [],
            resizeHandler: app.getUID(),


            getCurrentPageData: function (pageIndex) {

                var data = this.data,
                    tableIns = this.tableIns,
                    pageEnd = data.length / pageIndex.pageLength,
                    pageStart = pageIndex.pageStart,
                    pageLength = pageIndex.pageLength,
                    part = [],
                    row = (pageIndex.pageCurrent - 1) * pageIndex.pageLength,
                    count = pageIndex.pageCurrent * pageIndex.pageLength;

                if ((row + pageLength) > (pageEnd * pageLength)) {
                    count = pageEnd * pageLength;
                }
                for (; row < count; row++) {
                    part.push(data[row]);
                }
                if ($.isArray(part[0])) {
                    part = this.dataArrToMap(part);
                }
                return part;
            },
            updateCurrentPageData: function (currentPageData, totalDatalength) {
                var data = this.data,
                    tableIns = this.tableIns,
                    pageIndex = this.pageIndex,
                    pageEnd = (totalDatalength || data.length) / pageIndex.pageLength,
                    pageLength = pageIndex.pageLength,
                    curPageLength,
                    row = totalDatalength ? (pageIndex.pageCurrent - 2) * pageIndex.pageLength : (pageIndex.pageCurrent - 1) * pageIndex.pageLength,
                    count = pageIndex.pageCurrent * pageIndex.pageLength;

                if ((row + pageLength) > (pageEnd * pageLength)) {
                    count = pageEnd * pageLength;
                }

                curPageLength = count - row;

                data.splice.apply(data, [row, curPageLength].concat(currentPageData || tableIns.getSourceData()));

            },
            updatePageView: function (pageIndex) {
                var $widget = this.$view,
                    dataLength = pageIndex.recordsTotal,
                    pageNum = pageIndex.pageEnd,
                    i, aHTML = [],
                    currentPage = pageIndex.pageCurrent,
                    $pageBtnCtn = $('.paginate_button_fa', $widget),
                    $prev = $widget.find('a.previous'),
                    $next = $widget.find('a.next'),
                    temp = '<a class="paginate_button current" data-page-index="_index_">_index_</a>',
                    temp1 = '<a class="paginate_button" data-page-index="_index_">_index_</a>';

                for (i = 1; i <= pageNum; i++) {

                    if (pageNum === 1) {
                        aHTML.push(temp.replace(/_index_/g, i));
                        break;
                    } else if (pageNum > 5) { //页数大于5 的时候

                        //当前页在前5页内
                        if (currentPage <= 4) {
                            if (i <= 4) {
                                if (i === currentPage) {
                                    aHTML.push(temp.replace(/_index_/g, i));
                                } else {
                                    aHTML.push(temp1.replace(/_index_/g, i));
                                }

                            } else if (i >= pageNum - 4) {
                                aHTML.push('<span>...</span>');
                                aHTML.push(temp1.replace(/_index_/g, pageNum));
                                break;
                            }

                            //当前页最后5页的页数里
                        } else if (currentPage >= pageNum - 4) {

                            if (i === 1) {
                                aHTML.push(temp1.replace(/_index_/g, 1));
                                aHTML.push('<span>...</span>');
                            } else if (i >= pageNum - 4) {
                                if (i === currentPage) {
                                    aHTML.push(temp.replace(/_index_/g, i));
                                } else {
                                    aHTML.push(temp1.replace(/_index_/g, i));
                                }
                            }

                        } else { //在中间任意数

                            if (i === 1) {
                                aHTML.push(temp1.replace(/_index_/g, 1));
                                aHTML.push('<span>...</span>');
                            } else if (i === pageNum) {
                                aHTML.push('<span>...</span>');
                                aHTML.push(temp1.replace(/_index_/g, pageNum));
                            } else if (currentPage === i) {
                                aHTML.push(temp.replace(/_index_/g, i));
                            } else if (i >= currentPage - 1 && i <= currentPage + 1) {
                                aHTML.push(temp1.replace(/_index_/g, i));
                            }

                        }

                    } else {
                        if (i === currentPage) {
                            aHTML.push(temp.replace(/_index_/g, i));
                        } else {
                            aHTML.push(temp1.replace(/_index_/g, i));
                        }
                    }
                }

                $pageBtnCtn.empty().append(aHTML.join(''));

                if (currentPage === 1) {
                    $prev.addClass('disabled');
                } else {
                    $prev.removeClass('disabled');
                }
                if (currentPage === pageIndex.pageEnd) {
                    $next.addClass('disabled');
                } else {
                    $next.removeClass('disabled');
                }
            },
            updateColWidths: function (colWidths, tableCtnWidth, showColNum) {
                var normalWidth, j, witem,
                    colWidthsCopy = JSON.parse(JSON.stringify(colWidths)),
                    option = this.option;

                tableCtnWidth = parseInt(tableCtnWidth, 10);

                for (j = -1; witem = colWidths[++j];) {
                    if (witem !== '#') {
                        tableCtnWidth = tableCtnWidth - parseInt(witem, 10);
                    }
                }
                normalWidth = Math.floor(tableCtnWidth / showColNum);
                this.currentNormWidth = normalWidth;
                for (j = -1; witem = colWidths[++j];) {
                    if (witem === '#') {
                        colWidthsCopy[j] = option.resizeCol ? (normalWidth + 'px') : (option.miniWidth || '200px');
                    }
                }
                return colWidthsCopy;
            },

            translate:function(data){
                var context=this;

                return $.isArray(data)?data.map(function(item){return $AW.nsl(item,context.attr.id,context.auiCtx)}):$AW.nsl(data,context.attr.id,context.auiCtx);
            },


            //初始化（私有）
            _init: function () {
                var $widget = this.$view,
                    option = this.option,
                    attr = this.attr,
                    css = this.css,
                    auiCtx = this.auiCtx,
                    widgetIns = this.widgetIns,
                    that = this,
                    setting,
                    dropDownItems,
                    dropDownValues,
                    dropDownConfigs = {},
                    dropDownConfigsRev = {},
                    colWidthsCopy, hidCol, idx,
                    tempData1 = (widgetIns && widgetIns.nsl('每页显示')) || $AW.nsl('每页显示', attr.id, auiCtx),
                    tempData2 = (widgetIns && widgetIns.nsl('条数据')) || $AW.nsl('条数据', attr.id, auiCtx),// option数据,
                    tableIns, i, colOption, config, columns = [], item, nullWidthCount = 0, showColNum = 0,
                    hiddenColumns = {}, hiddenColNums = 0, hiddenColIdx = [], pageNateHTML = [], colWidths = [],
                    colHeaders, cantData = [],
                    $tableCtn = $('.hot', $widget), $search, colCfgArr, selectProp = [], returnColumnIndexes = [],
                    colConfigArr, colName, style = css && css.style, tableCtnWidth, tableCtnHeight,
                     relateArr = [],
                    addResizeHandler = function () {
                        app.screen.addResizeHandler({
                            uid: that.resizeHandler,
                            isGlobal: true,
                            timeout: 220,
                            callback: function () {
                                that.resize();
                            }
                        });
                    },


                    imgRenderer = function (instance, td, row, col, prop, value, cellProperties) {
                        var img = document.createElement('IMG');
                        if (value) {
                            if (typeof value === 'string') {
                                img.src = value;
                            } else if (typeof value === 'object') {
                                img.src = value.href;
                                img.title = value.name;
                                img.alt = value.name;
                            }
                            img.height = colConfigArr[col]['imgWidth'];
                            img.width = colConfigArr[col]['imgHeight'];

                            Handsontable.dom.addEvent(img, 'mousedown', function (e) {
                                e.preventDefault(); // prevent selection quirk
                            });

                            Handsontable.dom.empty(td);


                            if (hiddenColumns.hasOwnProperty(prop)) {
                                td.style.visibility = 'hidden';
                                td.style.display = 'none';
                                td.style.width = '0';
                            } else {
                                td.appendChild(img);
                            }

                        }
                        td.className = option.rowTextAlign + ' ' + option.colTextAlign;
                        return td;
                    },
                    hrefRenderer = function (instance, td, row, col, prop, value, cellProperties) {
                        var htmlStr;
                        if (value) {
                            switch (colConfigArr[col].columnType) {
                                case 'btn':
                                    if (typeof value === 'string') {
                                        htmlStr = $('<a class="aibs-table-row-btn " href="_href_">_name_</a>'.replace(/_href_/, value).replace(/_name_/, value));
                                    } else if (typeof value === 'object') {
                                        htmlStr = $('<a class="aibs-table-row-btn " href="_href_">_name_</a>'.replace(/_href_/, value.href).replace(/_name_/, value.name));
                                    }
                                    break;
                                case 'href':

                                    if (typeof value === 'string') {
                                        htmlStr = $('<a class="aibs-table-row-a" href="_href_">_name_</a>'.replace(/_href_/, value).replace(/_name_/, value));
                                    } else if (typeof value === 'object') {
                                        htmlStr = $('<a class="aibs-table-row-a" href="_href_">_name_</a>'.replace(/_href_/, value.href).replace(/_name_/, value.name));
                                    }
                                    break;
                            }
                            Handsontable.dom.empty(td);
                            if (hiddenColumns.hasOwnProperty(prop)) {
                                td.style.display = 'none';
                                td.style.width = '0';
                                td.style.visibility = 'hidden';
                            } else {
                                td.appendChild(htmlStr[0]);
                            }
                        }
                        td.className = option.rowTextAlign + ' ' + option.colTextAlign;
                        return td;
                    },
                    dropdownRenderer = function (instance, td, row, col, prop, value, cellProperties) {
                        Handsontable.renderers.DropdownRenderer.apply(this, arguments);
                        if (hiddenColumns.hasOwnProperty(prop)) {
                            td.style.display = 'none';
                            td.style.width = '0';
                            td.style.visibility = 'hidden';
                            Handsontable.dom.empty(td);
                        }
                    },
                    checkboxRenderer = function (instance, td, row, col, prop, value, cellProperties) {
                        Handsontable.renderers.CheckboxRenderer.apply(this, arguments);
                        if (hiddenColumns.hasOwnProperty(prop)) {
                            td.style.display = 'none';
                            td.style.width = '0';
                            td.style.visibility = 'hidden';
                            Handsontable.dom.empty(td);
                        }

                    },
                    dateRenderer = function (instance, td, row, col, prop, value, cellProperties) {
                        Handsontable.renderers.DateRenderer.apply(this, arguments);
                        if (hiddenColumns.hasOwnProperty(prop)) {
                            td.style.display = 'none';
                            td.style.width = '0';
                            td.style.visibility = 'hidden';
                            Handsontable.dom.empty(td);
                        }
                    },
                    textRenderer = function (instance, td, row, col, prop, value, cellProperties) {
                        Handsontable.renderers.TextRenderer.apply(this, arguments);
                        td.title = value;
                        if (hiddenColumns.hasOwnProperty(prop)) {
                            td.style.display = 'none';
                            td.style.width = '0';
                            td.style.visibility = 'hidden';
                            Handsontable.dom.empty(td);
                            Handsontable.dom.removeTextNodes(td);
                        }
                    },
                    passwordRenderer = function (instance, td, row, col, prop, value, cellProperties) {
                        Handsontable.renderers.PasswordRenderer.apply(this, arguments);
                        if (hiddenColumns.hasOwnProperty(prop)) {
                            td.style.display = 'none';
                            td.style.width = '0';
                            td.style.visibility = 'hidden';
                            Handsontable.dom.empty(td);
                            Handsontable.dom.removeTextNodes(td);
                        }
                    },
                    sumCells = function () {
                        var i, j, res = {}, obj, range,

                            //设置行列位置
                            rowNum = 0, colNum = 0, colN,
                            colAdd = true, rowAdd = true,
                            colLen, rowLen,
                            selectRange = tableIns.getSelectedRange();

                        if (selectRange && selectRange[0] && selectRange[0].from) {
                            range = selectRange[0];
                        }
                        /*       if (this.cache) {
                         this.cache.range = range;
                         }*/

                        // 循环长度
                        if (range) {

                            rowLen = Math.abs(range.to.row - range.from.row);
                            colLen = Math.abs(range.to.col - range.from.col);
                            // 循环开始位置
                            colNum = range.from.col;
                            rowNum = range.from.row;
                            // 判断上下左右位置
                            colAdd = (range.to.col >= range.from.col);
                            rowAdd = (range.to.row >= range.from.row);
                            // 设置返回数据
                            res.from = range.from;
                            res.to = range.to;
                            res.data = [];
                            for (i = 0; i <= rowLen; i++) {
                                colNum = range.from.col;

                                for (j = 0; j <= colLen; j++) {
                                    colN = colName[colNum];
                                    obj = {
                                        val: tableIns.getDataAtCell(rowNum, colNum),
                                        row: rowNum,
                                        col: colNum,
                                        colName: colN
                                    };

                                    res.data.push(obj);
                                    colAdd ? colNum++ : colNum--;
                                }
                                rowAdd ? rowNum++ : rowNum--;
                            }
                            return res;
                        }
                        return null;
                    };

                if (option.openRefresh) {
                    pageNateHTML.push('<div class = "pageWrapper">');
                    pageNateHTML.push('<div class="dataTables_paginate paging_simple_numbers" id="' + app.getUID() + '_paginate">');
                    pageNateHTML.push('<a class="paginate_button previous disabled"><i class="fa fa-angle-left"></i></a>');
                    pageNateHTML.push('<span class="paginate_button_fa"></span>');
                    pageNateHTML.push('<a class="paginate_button next"><i class="fa fa-angle-right"></i></a>');
                    pageNateHTML.push('<div class="dataTables_length" id="' + app.getUID() + '_length">');
                    pageNateHTML.push('<label>' + tempData1 + ' <select name="' + app.getUID() + '_length" class="input-small select_length"><option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select>' + tempData2 + '</label>');
                    pageNateHTML.push('</div></div></div>');
                    $tableCtn.before(pageNateHTML.join(''));
                }

                colConfigArr = option.col.elements || ($.isArray(option.col) ? option.col : []);
                colCfgArr = JSON.parse(JSON.stringify(colConfigArr));
                colHeaders = option.col.fields;
                colName = option.col.keys;

                tableCtnWidth = (style.width && style.width.width) || '100%';
                tableCtnHeight = (style.height && style.height.height) || '400px';

                this.colConfigArr = colCfgArr;

                $widget.css({'width': '100%', 'overflow': 'hidden'});

                $tableCtn.empty().attr('id', attr.id + '_host').css({
                    'width': tableCtnWidth,
                    'height': tableCtnHeight,
                    'overflow': 'hidden'
                });


                if (option.openSearch) {
                    $widget.prepend('<div style = "height: 1em;"><input id="' + attr.id + '_search" type="search" class="search-query input-small" placeholder="请输入查询信息" ></div>');
                    $search = $('.search-query', $widget);
                }

                for (i = -1; colOption = colConfigArr[++i];) {

                    config = {};
                    if (colOption.width) {
                        colWidths.push(colOption.width);
                    } else {
                        colWidths.push('#');
                        nullWidthCount++;
                    }

                    //"text","img","href","btn","checkbox","select"
                    switch (colOption.columnType) {
                        case 'img':
                            config.renderer = imgRenderer;
                            break;
                        case 'href':
                            config.renderer = hrefRenderer;
                            break;
                        case 'btn':
                            config.renderer = hrefRenderer;
                            break;
                        case 'checkbox':
                            config.type = 'checkbox';
                            config.renderer = checkboxRenderer;
                            break;
                        case 'select':
                            config.type = 'autocomplete';
                            config.strict = true;
                            config.filter = false;
                            config.visibleRows = 8;
                            dropDownItems = colOption.dropDownOption && colOption.dropDownOption.split(',');
                            dropDownValues = colOption.dropDownValue && colOption.dropDownValue.split(',');
                            config.source = dropDownItems;

                            // dropDownConfigs[colName[i]] = {
                            //      names:dropDownItems ? dropDownItems :[],
                            //      values:colOption.dropDownValue ? colOption.dropDownValue.split(',') :[]
                            //  };

                            for (idx = -1; item = dropDownItems[++idx];) {
                                if (colOption.dropDownValue) {
                                    (dropDownConfigs[colName[i]] = {})[item] = dropDownValues[idx];
                                    (dropDownConfigsRev[colName[i]] = {})[dropDownValues[idx]] = item;
                                } else {
                                    (dropDownConfigs[colName[i]] = {})[item] = item;
                                    (dropDownConfigsRev[colName[i]] = {})[item] = item;
                                }
                            }

                            // if (colOption.cantMod.length && colOption.hasReadOnly) {
                            //     cantData.push({
                            //         name: colName[i],
                            //         data: colOption.cantMod.split(',')
                            //     });
                            // }
                            config.renderer = dropdownRenderer;
                            // selectProp.push(colName[i]);
                            break;
                        case 'date':
                            config = {
                                type: 'date',
                                dateFormat: 'YYYY-MM-DD',
                                correctFormat: true,
                                defaultDate: '2018-07-08',
                                // datePicker additional options (see https://github.com/dbushell/Pikaday#configuration)
                                datePickerConfig: {
                                    // First day of the week (0: Sunday, 1: Monday, etc)
                                    firstDay: 0,
                                    showWeekNumber: false,
                                    numberOfMonths: 1,
                                    disableDayFn: function (date) {
                                        // Disable Sunday and Saturday
                                        // return date.getDay() === 0 || date.getDay() === 6;
                                    }
                                }
                            };

                            config.renderer = dateRenderer;
                            break;
                        case 'password':
                            config.type = 'password';
                            config.renderer = passwordRenderer;
                            break;
                        default:
                            config.renderer = textRenderer;
                    }
                    config.data = colName[i];
                    if (colOption.readOnly) {
                        config.readOnly = true;
                    }

                    config.wordWrap = option.workBreak;

                    columns.push(config);
                    if (!colOption.isVisible) {
                        hiddenColumns[colName[i]] = i;
                        hiddenColNums++;
                        nullWidthCount--;
                    }
                    if (colOption.isReturned) {
                        returnColumnIndexes.push(i);
                    }
                }


                addResizeHandler();


                // 添加checkbox
                if (option.selectOption) {
                    colHeaders.unshift("<input data-id='titleCheckbox' type='checkbox' style='margin-left: -2px'/>");
                    colName.unshift('checkbox');
                    columns.unshift({data: "checkbox", type: 'checkbox'});
                    colConfigArr.unshift({columnType: 'checkbox'});
                    colWidths.unshift(50);
                    i = 0;

                    while (i < returnColumnIndexes.length) {
                        returnColumnIndexes[i]++;
                        i++;
                    }
                }

                this.nullWidthCount = nullWidthCount;
                this.returnColumnIndexes = returnColumnIndexes;
                this.initColWidths = JSON.parse(JSON.stringify(colWidths));


                if (tableCtnWidth) {
                    if (tableCtnWidth.indexOf('%') === -1) {
                        that.updateColWidths(colWidths, tableCtnWidth, nullWidthCount);
                    } else {
                        app.performance.longDelay(function () {
                            tableCtnWidth = $widget.width() || 400;

                            if ($widget.parent().css('display') === 'none') {
                                tableCtnWidth = $widget.parent().width() + 50;
                                $widget.parent().css('width', tableCtnWidth);
                            }
                            if (!option.rowHeaders) {
                                tableCtnWidth = tableCtnWidth + 50;
                            }
                            if (option.selectOption) {
                                tableCtnWidth = (tableCtnWidth - 50) + 'px';
                            } else {
                                tableCtnWidth = (tableCtnWidth - 50) + 'px';
                            }
                            if (tableCtnWidth) {
                                colWidthsCopy = that.updateColWidths(colWidths, tableCtnWidth, nullWidthCount);

                                if (hiddenColNums) {
                                    hidCol = colWidthsCopy.length;
                                    for (idx = 0; idx < hiddenColNums; idx++) {
                                        hidCol--;
                                        colWidthsCopy[hidCol] = 0;
                                    }
                                    // debugger;
                                    // for(idx in  hiddenColumns){
                                    //
                                    //     colWidthsCopy[hiddenColumns[idx]] = 0;
                                    // }
                                    // colWidthsCopy[5] = 0;
                                    // colWidthsCopy[7] = 0;
                                    // colWidthsCopy[9] = 0;
                                }

                                tableIns.updateSettings({
                                    colWidths: colWidthsCopy
                                });
                            }
                        })
                    }
                }

                this.config.colHeaders = colHeaders;
                this.config.hiddenColNums = hiddenColNums;
                this.config.hiddenColumns = hiddenColumns;
                this.config.cantData = cantData;
                this.config.colWidths = colWidths;
                this.config.hiddenColIdx = hiddenColIdx;

                this.dropDownConfigs = dropDownConfigs;
                this.dropDownConfigsRev = dropDownConfigsRev;


                this.colName = colName;
                this.columns = columns;

                setting = {
                    rowHeaders: option.rowHeaders, //是否显示行号
                    colHeaders: this.translate(colHeaders),
                    className: option.rowTextAlign + ' ' + option.colTextAlign,
                    // colWidths: colWidths,
                    rowHeights: 23,
                    // renderAllRows: true,
                    undo: true,
                    observeDOMVisibility: true,
                    totalColumns: 22,
                    manualColumnResize: true, //列宽度可拖拽调整
                    manualRowResize: true,//行宽度可拖拽调整
                    contextMenu: true,//右键编辑菜单
                    viewportColumnRenderingOffset: 40,
                    // viewportRowRenderingOffset: "auto",
                    // viewportColumnRenderingOffset: "auto",
                    hideColumns: hiddenColNums,
                    columns: columns,
                    autoColumnSize: false,
                    autoRowSize: false
                };


                if (option.openSort) {
                    setting.columnSorting = {
                        columns: 0,
                        sortEmptyCells: true
                    };
                    setting.sortIndicator = true;
                }
                if (option.openSearch) {
                    setting.search = {
                        searchResultClass: 'customSearchClass'
                    }
                }


                this.setting = setting;
                tableIns = new Handsontable($tableCtn[0], setting);
                this.tableIns = tableIns;
                if (option.openSearch) {
                    Handsontable.dom.addEvent($search[0], 'keyup', function (event) {
                        var search = tableIns.getPlugin('search'),
                            queryResult = search.query(this.value);

                        tableIns.render();
                    });
                }

                Handsontable.dom.addEvent($widget[0], 'click', function (e) {
                    var $target = $(e.target || e.srcElement),
                        $pageBtnTarget = $target.closest('.paginate_button').not('.disabled'),
                        $pageCtn = $('.paging_simple_numbers', $widget),
                        limit = parseInt($('.select_length', $pageCtn).val(), 10),
                        pageIndex,
                        option = that.option,
                        currentIndex = $widget.find('a.current').attr('data-page-index');

                    if ($pageBtnTarget.length || $target.is('select')) {
                        if ($pageBtnTarget.hasClass('previous')) {
                            currentIndex--;
                        } else if ($pageBtnTarget.hasClass('next')) {
                            currentIndex++;
                        } else if ($pageBtnTarget.attr('data-page-index')) {
                            currentIndex = parseInt($pageBtnTarget.attr('data-page-index'), 10) || 1
                        } else if ($target.is('select')) {
                            limit = parseInt($target.val(), 10);
                            currentIndex = 1;
                        }

                        that.pageIndex = {
                            pageCurrent: currentIndex,
                            pageStart: currentIndex,
                            pageEnd: Math.ceil(that.pageIndex.recordsTotal / limit),
                            pageLength: limit,
                            recordsTotal: that.pageIndex.recordsTotal
                        };


                        if (that.option.ajax) {

                            that.ownData = $.extend({}, true, that.ajaxOption.data, {
                                length: limit,
                                draw: currentIndex,
                                start: (currentIndex - 1) * limit
                            });

                            that.refreshFromServe(that.ajaxOption);

                        } else {

                            tableIns.loadData(that.getCurrentPageData(that.pageIndex));

                            that.updatePageView(that.pageIndex);
                        }

                    }

                });

                Handsontable.hooks.add('afterGetColHeader', function (col, th) {
                    var colName = that.tableIns.colToProp(col);

                    if (colName && that.config.hiddenColumns.hasOwnProperty(colName)) {
                        $widget.find(th).css({
                            display: "none",
                            width: '0'
                        }).addClass('hHide');
                    } else {
                        if ($widget.find(th).hasClass('hHide')) {
                            $widget.find(th).css({
                                display: "block"
                            }).removeClass('hHIde')
                        }
                    }

                });
                Handsontable.hooks.add('afterSelectionEnd', function (col, th) {
                    var data, isChecked = 0, i;
                    data = that.tableIns.getDataAtCol(0);
                    // 储存选中的行列
                    that.sumData = sumCells();


                    for (i = 0; i < data.length; i++) {
                        data[i] === true ? isChecked++ : 1;
                    }

                    if (isChecked === data.length) {
                        $('[data-id="titleCheckbox"]', $widget).prop('checked', true);
                    } else if (isChecked === 0) {
                        $('[data-id="titleCheckbox"]', $widget).prop('checked', false);
                    } else {
                        $('[data-id="titleCheckbox"]', $widget).prop('indeterminate', true);
                    }
                }, tableIns);
                Handsontable.hooks.add('afterChange', function (cell, type) {
                    var position, row, colName, oldValue, newValue;

                    if (type === 'edit') {
                        row = cell[0][0];
                        colName = cell[0][1];
                        oldValue = cell[0][2];
                        newValue = cell[0][3];

                        position = that.getCurrentCell();

                        $widget.find('.ht_master table>tbody')
                            .children('tr').eq(position.row)
                            .children('td').eq(position.col)
                            .trigger('change', colName);
                    }


                }, tableIns);

                if (option.selectOption) {
                    tableIns.loadData(this.dataArrToMap([['false']]));
                } else {
                    tableIns.loadData(this.dataArrToMap([[]]))
                }
                tableIns.alter('remove_row', 0, 1);

                if (option.openRefresh) {
                    this.pageIndex.pageEnd = 1;
                    this.pageIndex.recordsTotal = 1;
                    this.updatePageView(this.pageIndex);
                    // $tableCtn.css('max-height','280px');
                }
                this.setFakeData();
                for (i = 0; i < colConfigArr.length; i++) {
                    if (colConfigArr[i].relateOnly) {
                        relateArr.push({
                            onlyCol: i,
                            relateCol: colConfigArr[i].col,
                            relateContent: colConfigArr[i].content
                        })
                    }
                }
            },
            //事件绑定（私有）
            _listen: function () {
                var $widget = this.$view,
                    that = this,
                    tableIns = this.tableIns;
                //绑定事件，推荐使用事件冒泡
                //这里绑定的事件一定不能与业务逻辑有关的，否则应该在“事件配置”中定义

                $widget
                //解绑上次的事件
                    .off('.select')
                    //绑定事件
                    .on({
                        'change.select': function (e) {
                            var $target = $(e.target || event.srcElement), selectResult, i, colHeaders,
                                html = '', isChecked = 0;
                            selectResult = tableIns.getDataAtCol(0);
                            if (parseInt($target.attr('data-col'), 10) === 0) {
                                for (i = 0; i < selectResult.length; i++) {
                                    (selectResult[i] === true || selectResult[i] === 'true') ? isChecked++ : 1;
                                }
                                if (isChecked === selectResult.length) {
                                    html = '<input data-id="titleCheckbox" type="checkbox" checked   style="margin-left:-2px"/>';

                                } else if (isChecked === 0) {
                                    html = '<input data-id="titleCheckbox" type="checkbox"   style="margin-left: -2px"/>';
                                } else {
                                    html = '<input data-id="titleCheckbox" type="checkbox"  style="margin-left: -2px"/>';
                                }
                                colHeaders = tableIns.getColHeader();
                                colHeaders[0] = html;
                                tableIns.updateSettings({
                                    colHeaders: that.translate(colHeaders)
                                });
                                if (isChecked !== 0 && isChecked !== selectResult.length) {
                                    that.indeterminate = true;
                                    $('[data-id="titleCheckbox"]', $widget).prop('indeterminate', true);
                                }
                            } else if ($target.attr('data-id')) {

                                //控制全选和取消全选
                                if ($target.is(":checked")) {
                                    that.checkResult = true;
                                    // that.isSelectAll = true;
                                }
                                that.setCheckBox();
                            }
                            // e.stopPropagation();
                        }
                    });
            },

            dataArrToMap: function (DataArr) {
                var colName = this.colName, j, rowData, i, item, dataMap, result = [];

                for (j = -1; rowData = DataArr[++j];) {
                    dataMap = {};
                    for (i = -1; item = colName[++i];) {
                        if (rowData[i] === false) {
                            rowData[i] = 'false';
                        } else if (rowData[i] === true) {
                            rowData[i] = 'true';
                        }
                        dataMap[item] = rowData[i] || '';
                    }
                    result.push(dataMap);
                }
                // if(result.length === 1){
                //     result = result[0];
                // }
                return result;
            },
            mapToDataArray: function (dataMap) {
                var colName = this.colName, j, rowData, i, item, dataArr, result = [];

                for (j = -1; rowData = dataMap[++j];) {
                    dataArr = [];
                    for (i = -1; item = colName[++i];) {
                        if (rowData[item] === false) {
                            rowData[item] = 'false';
                        } else if (rowData[item] === true) {
                            rowData[item] = 'true';
                        }
                        dataArr[i] = rowData[item] || '';
                    }
                    result.push(dataArr);
                }

                return result;
            },

            setData: function (data) { //前端分頁

                var that = this, i, item, col,
                    dropDownConfigsRev = this.dropDownConfigsRev,
                    dropDownConfigs = this.dropDownConfigs;
                if (data) {
                    if ($.isArray(data[0])) {
                        $.each(data, function (index, value) {
                            if (that.option.selectOption) {
                                if (value[0] !== 'true' && value[0] !== 'false' && value[0] !== true && value[0] !== false) {
                                    value.unshift('false');
                                }
                            }
                        });
                        data = this.dataArrToMap(data);
                    } else {
                        $.each(data, function (index, value) {
                            if (that.option.selectOption) {
                                value.checkbox = 'false';
                            }
                        });
                    }
                    if (data === 'auiAjaxTest') {
                        this._renderFakeData(this.tableIns);
                    } else {
                        if (!$.isEmptyObject(dropDownConfigsRev)) {
                            for (i = -1; item = data[++i];) {
                                for (col in dropDownConfigsRev) {
                                    if (dropDownConfigsRev.hasOwnProperty(col)) {
                                        item[col] = dropDownConfigsRev[col][item[col]]
                                    }
                                }
                            }
                        }
                        if (that.option.openRefresh) {
                            that.data = data;
                            that.pageIndex.recordsTotal = data.length;
                            that.pageIndex.pageEnd = Math.ceil(data.length / this.pageIndex.pageLength);
                            that.tableIns.loadData(this.getCurrentPageData(this.pageIndex));
                            that.updatePageView(this.pageIndex);
                        } else {
                            that.data = data;
                            that.tableIns.loadData(data);
                        }
                    }
                } else {
                    that.clearTable();
                }
                that.resize();
            },

            setCheckBox: function () {
                var
                    i, tableIns = this.tableIns,
                    sourceData = this.data,
                    option = this.option,
                    colHeader = [], that = this;

                if (!sourceData.length) {
                    sourceData = tableIns.getSourceData();
                    that.data = sourceData;
                }
                // else if(option.openRefresh){
                //     that.updateCurrentPageData();
                //     sourceData = this.data;
                // }
                i = -1;
                while (sourceData[++i]) {
                    sourceData[i].checkbox = that.checkResult;
                }

                if (option.openRefresh) {
                    tableIns.loadData(that.getCurrentPageData(this.pageIndex));
                } else {
                    tableIns.loadData(sourceData);
                }

                if (/^<input.*>$/.test(tableIns.getColHeader()[0])) {
                    colHeader = tableIns.getColHeader();

                    colHeader[0] = ($(colHeader[0]).attr('checked', this.checkResult))[0].outerHTML;

                    tableIns.updateSettings({
                        colHeaders: this.translate(colHeaders)
                    });
                }

                this.checkResult = !this.checkResult;

            },

            getCurrentCell: function () {
                var obj, row, col, val, colName,
                    tableIns = this.tableIns,
                    dropdownConfigs = this.dropDownConfigs,
                    currentCell = tableIns.getActiveEditor();

                if (!$.isEmptyObject(currentCell)) {
                    row = currentCell.row;
                    col = currentCell.col;
                    val = tableIns.getDataAtCell(row, col);
                    colName = currentCell.prop;
                    if (dropdownConfigs.hasOwnProperty(colName)) {
                        val = dropdownConfigs[colName][val];
                    }
                    obj = {
                        col: col,
                        row: row,
                        data: val,
                        colName: colName
                    };
                } else {
                    obj = {};
                }

                return obj;
            },

            //渲染主题、样式（私有）
            _render: function () {
                var $widget = this.$view,
                    css = this.css,
                    $ctn = $('.hot ', $widget),
                    cssCode,
                    className,
                    style;

                if (css) {

                    //样式解析机制
                    if (style = css.style) {

                        style.border && $('.hoot .ht_master .wtHider', $widget).css(style.border);
                        style.tdStyle && $AW.cssHover('.handsontable td', $widget, style.tdStyle, '');
                        style.distance && $ctn.css(style.distance);
                        if (style.backgroundColor) {
                            $AW.cssHover('.handsontable tr', $widget, style.backgroundColor, '');
                            $AW.cssHover('.handsontable tbody tr th:first-child', $widget, style.backgroundColor, '');
                        }
                        if (style.pageNum) {
                            $AW.cssHover('.handsontable-warp .dataTables_paginate .paginate_button.current', $widget, {'background-color': style.pageNum.color}, '', true);
                            $AW.cssHover('.handsontable-warp .paginate_button', $widget, {'color': style.pageNum.color}, ':hover', true);
                            $AW.cssHover('.handsontable-warp .dataTables_paginate .paginate_button.next', $widget, {'border-color': style.pageNum.color}, ':hover', true);
                            $AW.cssHover('.handsontable-warp .dataTables_paginate .paginate_button.previous', $widget, {'border-color': style.pageNum.color}, ':hover', true);
                        }
                        if (style.unEditorTd) {
                            $AW.cssHover('.handsontable td.htDimmed', $widget, style.unEditorTd, '');
                        }
                        if (style.editorTd) {
                            $AW.cssHover('.handsontable td:not(.htDimmed)', $widget, style.editorTd, '');
                        }
                    }


                    //自定义样式
                    if ((cssCode = css.cssCode) && (className = cssCode.className)) {
                        $widget.addClass(className);
                    }
                }

            },


            setFakeData: function () {
                var i, fakeData = [], rowData, item, j,
                    colName = this.colName,
                    option = this.option,
                    colConfigArr = option.col.elements;
                for (i = 0; i < 20; i++) {
                    rowData = {};
                    for (j = -1; item = colName[++j];) {
                        switch (colConfigArr[j].columnType) {
                            case 'checkbox':
                                rowData[item] = false;
                                break;
                            case 'img':
                                rowData[item] = './img/404.png';
                                break;
                            case 'date':
                                rowData[item] = '2018-08-08';
                                break;
                            case 'href':
                                rowData[item] = 'www.baidu.com';
                                break;
                            case 'btn':
                                rowData[item] = {
                                    name: "按钮" + i,
                                    href: "www.baidu.com"
                                };
                                break;
                            default :
                                rowData[item] = '行' + i + '列' + j;
                        }
                    }

                    if (option.selectOption) {
                        rowData.checkbox = false;
                    }
                    fakeData.push(rowData);
                }
                this.fakeData = fakeData;
            },

            _renderFakeData: function (tableIns) {
                var option = this.option;
                // this.setFakeData();
                this.data = this.fakeData;
                if (option.openRefresh) {
                    this.pageIndex.recordsTotal = 50;
                    tableIns.loadData(this.getCurrentPageData(this.pageIndex));
                    this.updatePageView(this.pageIndex);
                } else {
                    tableIns.loadData(this.fakeData);
                }


            },

            show: function () {
                this.$view.removeClass('hide');
            },
            hide: function () {
                this.$view.addClass('hide');
            },
            destroy: function () {
                app.screen.removeResizeHandler(this.resizeHandler, true);
                this.$view.off().empty();
            },

            removeRow: function (removeArr) {
                var i, len,
                    deleteNum = 0;//已经删除的个数;
                if (removeArr && removeArr.length && this.getPageData().data.length) {
                    for (i = 0, len = removeArr.length; i < len; i++) {
                        this.tableIns.alter('remove_row', parseInt(removeArr[i], 10) - deleteNum);
                        deleteNum++;
                    }
                }
                if (this.option.openRefresh) {
                    this.updateCurrentPageData()
                } else {
                    this.data = this.tableIns.getSourceData();
                }
            },
            removeCol: function (colInfo) {
                var i, tableIns = this.tableIns, col, data,
                    option = this.option,
                    colHeaders = tableIns.getColHeader(),
                    tableSetting = this.setting,
                    colname = this.colName,
                    colWidths = this.config.colWidths,
                    columns = tableSetting.columns,
                    colConfigArr = option.col.elements,
                    tableData = this.data, colIdx = parseInt(colInfo, 10);

                if (typeof colIdx === 'number' && colInfo !== undefined) {
                    colInfo = tableIns.colToProp(colInfo);
                }
                for (i = 0; i < tableData.length; i++) {
                    if (tableData[i].hasOwnProperty(colInfo)) {
                        delete this.data[i][colInfo];
                    }
                }
                colHeaders.splice(colIdx, 1);
                columns.splice(colIdx, 1);
                colConfigArr.splice(colIdx, 1);
                colWidths.splice(colIdx, 1);
                colname.splice(colIdx, 1);

                tableIns.updateSettings({
                    colHeaders: this.translate(colHeaders),
                    columns: columns,
                    colWidths: colWidths
                });

                this.nullWidthCount--;
                this.resize();
                // tableIns.loadData(data);
            },

            getRow: function () { //获取选中行数据
                var tableIns = this.tableIns,
                    colName,
                    dropdownConfigs = this.dropDownConfigs,
                    tableData = this.tableIns.getSourceData(),
                    option = this.option, obj,
                    returnColumnIndexes = this.returnColumnIndexes, i, rowData,
                    result = {
                        data: [],
                        rowNum: []
                    }, dataArr = this.tableIns.getData(), cacheRowData = [];
	            if (option.openRefresh && !this.oldCurrentPageData) {
                    this.updateCurrentPageData();
                    tableData = this.data;
                    dataArr = this.mapToDataArray(tableData);
                }

                for (i = -1; rowData = tableData[++i];) {
                    cacheRowData = [];
                    if (rowData.checkbox === true || rowData.checkbox === 'true') {
                        if (!option.openAllReturn) {
                            $.each(returnColumnIndexes, function (idx, columnIndex) {
                                colName = tableIns.colToProp(columnIndex);
                                if (dropdownConfigs.hasOwnProperty(colName)) {
                                    cacheRowData.push(dropdownConfigs[colName][dataArr[i][columnIndex]]);
                                } else {
                                    cacheRowData.push(dataArr[i][columnIndex]);
                                }

                            });
                        } else {
                            dataArr[i].splice(0, 1);
                            cacheRowData = dataArr[i];
                        }

                        obj = {
                            val: cacheRowData,
                            row: i
                        };
                        result.data.push(obj);
                        result.rowNum.push(i);

                    }
                }

                return result;
            },
            addRow: function (rowInfo) {
                var index = null, data,
                    totalDatalength,
                    pageIndex = this.pageIndex,
                    option = this.option,
                    tableIns = this.tableIns;

                if (rowInfo && rowInfo.rowIndex >= 0) {
                    index = parseInt(rowInfo.rowIndex, 10);
                }
                data = tableIns.getSourceData();
                if (rowInfo.data) {
                    if (option.selectOption && rowInfo.data[0] !== 'false' && rowInfo.data[0] !== 'true' && rowInfo.data[0] !== 'false' && rowInfo.data[0] !== true && rowInfo.data[0] !== false) {
                        rowInfo.data.unshift('false');
                    }
                    data.splice(index, 0, this.dataArrToMap([rowInfo.data])[0]);

                } else {
                    if (option.selectOption) {
                        data.push(this.dataArrToMap([['false', '']])[0])

                    } else {
                        data.push(this.dataArrToMap([[]])[0])
                    }
                }

                if (option.openRefresh) {

                    if (data.length > pageIndex.pageLength) {
                        totalDatalength = ((pageIndex.pageEnd - 1) * pageIndex.pageLength) + data.length;
                        pageIndex.pageCurrent++;
                        pageIndex.pageStart++;
                        pageIndex.pageEnd = Math.ceil(totalDatalength / pageIndex.pageLength);
                    }
                    this.updateCurrentPageData(data, totalDatalength);
                    pageIndex.recordsTotal = this.data.length;
                    tableIns.loadData(this.getCurrentPageData(pageIndex));
                    this.updatePageView(pageIndex);
                } else {
                    tableIns.loadData(data);
                }

                // this.resize();

            },
            addCol: function (colInfo) {
                var name, colIndex, colValue, i = 0,
                    tableIns = this.tableIns,
                    option = this.option,
                    colHeaders = tableIns.getColHeader(),
                    tableSetting = this.setting,
                    colWidths = this.config.colWidths,
                    columns = tableSetting.columns,
                    colConfigArr = option.col.elements,
                    colname = this.colName,
                    tableData = this.data;


                if (colInfo && !$.isEmptyObject(colInfo)) {
                    name = colInfo.colName ? colInfo.colName : '新建列';
                    colValue = colInfo.colValue;
                    while (i < tableData.length) {
                        tableData[i][colValue] = "";
                        i++;
                    }
                    if (colInfo.colIndex >= 0) {
                        colIndex = parseInt(colInfo.colIndex, 10);
                        colHeaders.splice(colIndex, 0, name);
                        columns.splice(colIndex, 0, {});
                        colname.splice(colIndex, 0, 'newCol' + (colname.length + 1));
                        colConfigArr.splice(colIndex, 0, {columnType: 'text'});
                        colWidths.splice(colIndex, 0, colWidths[++colIndex]);

                        tableIns.updateSettings({
                            colHeaders: this.translate(colHeaders),
                            columns: columns,
                            colWidths: colWidths
                        });

                    } else {
                        colHeaders.push(name);
                        columns.push({});
                        tableIns.updateSettings({
                            colHeaders: this.translate(colHeaders),
                            columns: columns
                        });
                        colname.push('newCol' + (this.colName.length + 1));
                    }

                    this.nullWidthCount++;
                    this.resize();
                }
            },

            sumCell: function () {//行列汇总
                var res;
                res = this.sumData || {};
                // 清空上次数据
                this.sumData = {};

                return res;
            },
            setDataAtCell: function (row, col, data) {
                this.tableIns.setDataAtCell(row, col, data);
            },
            getTableData: function () {
                var data, option = this.option, item,
                    tableIns = this.tableIns, col, colName,
                    selectCol = [], i, j,
                    dropdownConfigs = this.dropDownConfigs;
                data = this.data;
                if (!data.length) {
                    data = this.tableIns.getData();
                }
                // else if(option.openRefresh){
                //     this.updateCurrentPageData();
                //     data = this.data;
                // }
                if (!$.isArray(data[0])) {
                    data = this.mapToDataArray(data);
                }
                for (item in dropdownConfigs) {
                    if(dropdownConfigs.hasOwnProperty(item)){
                        if (this.option.selectOption) {
                            selectCol[tableIns.propToCol(item) - 1] = item;
                        } else {
                            selectCol[tableIns.propToCol(item)] = item;
                        }
                    }

                }
                if (data.length && this.option.selectOption) {
                    $.each(data, function (idx, value) {
                        value.splice(0, 1);
                    })
                }

                for (i = -1; item = data[++i];) {
                    for (j = -1; col = selectCol[++j];) {
                        if (colName = selectCol[col]) {
                            item[col] = dropdownConfigs[colName][item[col]] || item[col]
                        }
                    }
                }
                return data;
            },
            undo: function () {

                this.tableIns.undo();
            },
            resize: function () {
                var $widget = this.$view, tableIns = this.tableIns, i, item,
                    hidColNum = this.config.hiddenColNums, idx, hidCol,
                    initColWidths = this.initColWidths,
                    option = this.option,
                    colWidthsCopy,
                    colWidths = this.config.colWidths, tableCtnWidth, newWidth;
                tableCtnWidth = $widget.parent().width();

                if ($widget.parent().css('display') === 'none') {
                    tableCtnWidth = $widget.parent().parent().width();
                    $widget.parent().css('width', tableCtnWidth);
                }
                if (!option.rowHeaders) {
                    tableCtnWidth = tableCtnWidth + 50;
                }
                if (option.selectOption) {
                    tableCtnWidth = tableCtnWidth - 50;
                } else {
                    tableCtnWidth = tableCtnWidth - 50;
                }

                if (option.resizeCol) {
                      colWidthsCopy = JSON.parse(JSON.stringify(colWidths));
                    if (tableCtnWidth) {
                        for (i = -1; item = initColWidths[++i];) {
                            if (item !== '#') {
                                tableCtnWidth = tableCtnWidth - parseFloat(item);
                            }
                        }
                        newWidth = tableCtnWidth / this.nullWidthCount;
                        for (i = -1; item = colWidths[++i];) {
                            if (item === '#') {
                                colWidthsCopy[i] = newWidth;
                            }
                        }
                        this.currentNormWidth = newWidth;
                    }
                } else {
                    colWidthsCopy = JSON.parse(JSON.stringify(initColWidths));
                    for (i = -1; item = initColWidths[++i];) {
                        if (item === '#') {
                            colWidthsCopy[i] = option.miniWidth || '200px';
                        }
                    }
                }


                if (hidColNum) {
                    hidCol = colWidths.length;
                    for (idx = 0; idx < hidColNum; idx++) {
                        hidCol--;
                        colWidthsCopy[hidCol] = 0;
                    }
                }
                tableIns.updateSettings({
                    colWidths: colWidthsCopy
                });
                tableIns.render();

            },

            clearTable: function () {
                var tableIns = this.tableIns,
                    option = this.option;
                if (option.selectOption) {
                    tableIns.loadData(this.dataArrToMap([['false']]));
                    this.tableIns.alter('remove_row', 0, 1);
                } else {
                    tableIns.loadData(this.dataArrToMap([[]]));
                    this.tableIns.alter('remove_row', 0, 1);
                }
                // tableIns.clear();
                this.data = [];
            },
            render: function () {
                this.tableIns.render();
                this.repaint();
            },

            refreshFromServe: function (ajaxOpt) {
                var validateResult,
                    option = this.option,
                    that = this,
                    ajaxOption,
                    _success = ajaxOpt.success, __list = [];

                that.ajaxOption = ajaxOpt;

                ajaxOption = $.extend(true, {}, ajaxOpt);


                if ((validateResult = app.validate(ajaxOption.data,
                    ajaxOption.validateSuccessCallback,
                    ajaxOption.validateErrorCallback,
                    ajaxOption.validateCleanCallback,
                    ajaxOption.validateContinue,
                    ajaxOption.validate)) && validateResult.result) {
                    option.bServerSide = true;
                    option.bProcessing = true;
                    option.ajax = function (ownData, callback, settings) {
                        var returnData = {};

                        validateResult.data = validateResult.data || [];
                        if (validateResult.data instanceof Array) {
                            $.each(validateResult.data, function (index, value) {
                                returnData[value.name] = value.value;
                            });
                        }

//                         if(!$.isEmptyObject(validateResult.data)){
//                             returnData =  JSON.parse(JSON.stringify(validateResult.data));
//                         }

                        ajaxOption.data = $.extend(true, {}, returnData, ownData);

                        ajaxOption.data.search = JSON.stringify(ajaxOption.data.search);

                        ajaxOption.success = function (res) {
                            var returnData = {}, pageIndexConfig, tableData;
                            if (res.status) {
                                //封装返回数据，这里仅演示了修改属性名
                                var result = res.content.result;
                                if (result === 'auiAjaxTest') {
                                    returnData.draw = ownData.draw;//这里直接自行返回了draw计数器,应该由后台返回
                                    returnData.recordsTotal = that.fakeData.length;
                                    returnData.recordsFiltered = that.fakeData.length;//后台不实现过滤功能，每次查询均视作全部结果
                                    returnData.data = that.fakeData.slice(0, ownData.length);

                                    callback(returnData);

                                    _success && _success(res);
                                } else {
                                    returnData.draw = ajaxOption.data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                                    returnData.recordsTotal = result.recordsTotal;
                                    returnData.recordsFiltered = result.recordsFiltered;//后台不实现过滤功能，每次查询均视作全部结果
                                    returnData.data = result.data;

                                    if (!returnData.data.length) {
                                        returnData.data = [];
                                        returnData.recordsTotal = 0;
                                        returnData.recordsFiltered = 0;
                                    }
                                    tableData = returnData.data;
                                    if ($.isArray(tableData[0])) {
                                        $.each(tableData, function (index, value) {
                                            if (that.option.selectOption) {
                                                if (value[0] !== 'true' && value[0] !== 'false' && value[0] !== true && value[0] !== false) {
                                                    value.unshift('false');
                                                }
                                            }
                                        });
                                        tableData = that.dataArrToMap(tableData);
                                    } else {
                                        $.each(tableData, function (index, value) {
                                            if (that.option.selectOption) {
                                                value.checkbox = 'false';
                                            }
                                        });
                                    }


                                    pageIndexConfig = {
                                        pageCurrent: returnData.draw,
                                        pageStart: returnData.draw,
                                        pageEnd: Math.ceil(returnData.recordsTotal / ajaxOption.data.length),
                                        pageLength: ajaxOption.data.length,
                                        recordsTotal: returnData.recordsTotal
                                    };
                                    that.pageIndex = pageIndexConfig;
                                    that.data = tableData;
                                    that.oldCurrentPageData = tableData;
                                    that.tableIns.loadData(tableData);
                                    that.updatePageView(pageIndexConfig);
                                    that.resize();

                                    _success && _success(res);
                                }


                            } else if (res.errorMsg) {
                                returnData.draw = ajaxOption.data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                                returnData.recordsTotal = 0;
                                returnData.recordsFiltered = 0;//后台不实现过滤功能，每次查询均视作全部结果
                                returnData.data = [];

                                _success && _success(res);

                            }
                        };

                        //完成配置后，真正发请求
                        $.ajax(ajaxOption);
                    };

                    //执行异步请求
                    option.ajax(this.ownData);
                }
            },
            getPageData: function () {
                var obj = {}, i, item, col, selectCol = {}, colName, data,
                    dropdownConfigs = this.dropDownConfigs,
                    tableIns = this.tableIns;
                if (this.option.openRefresh) {
                    obj.pageNum = parseInt(this.pageIndex.pageCurrent, 10);
                } else {
                    obj.pageNum = "未开启分页";
                }
                data = tableIns.getData();

                for (item in dropdownConfigs) {
                    if(dropdownConfigs.hasOwnProperty(item)){
                        if (this.option.selectOption) {
                            selectCol[tableIns.propToCol(item) - 1] = item;
                        } else {
                            selectCol[tableIns.propToCol(item)] = item;
                        }
                    }

                }
                if (data.length && this.option.selectOption) {
                    $.each(data, function (idx, value) {
                        value.splice(0, 1);
                    })
                }
                for (i = -1; item = data[++i];) {
                    for (col in selectCol) {
                        if (selectCol.hasOwnProperty(col)) {
                            if (colName = selectCol[col]) {
                                item[col] = dropdownConfigs[colName][item[col]] || item[col]
                            }
                        }

                    }
                }

                obj.data = data;

                return obj;
            },

            hideCol: function (colArr) {
                var i = 0, colName = 0, tableIns = this.tableIns, col,
                    colWidths = this.config.colWidths,
                    hidColNum = this.config.hiddenColNums,
                    colHide = this.config.hiddenColumns, idx, hidCol;
                for (i = 0; i < colArr.length; i++) {
                    if (colArr[i] !== null && colArr[i] !== undefined && typeof colArr[i] === 'number') {
                        colName = tableIns.colToProp(colArr[i]);
                        col = colArr[i];
                    } else {
                        colName = colArr[i];
                        col = tableIns.propToCol(colArr[i])
                    }
                    colHide[colName] = true;

                    // if(hidColNum){
                    //     hidCol = colWidths.length;
                    //    for(idx=0;idx<hidColNum;idx++){
                    //        colWidths[hidCol] = 0;
                    //        hidCol--;
                    //    }
                    // }
                    this.nullWidthCount--;
                    this.config.hiddenColNums++;
                }
                // tableIns.updateSettings({
                //     colWidths: colWidths
                // });
                this.resize();
                // tableIns.render();
            },
            showCol: function (colArr) {
                var i = 0, colName = 0, tableIns = this.tableIns,
                    colHide = this.config.hiddenColumns, hasHide = false;

                for (i = 0; i < colArr.length; i++) {

                    if (colArr[i] !== null && colArr[i] !== undefined && $.isNumeric(parseInt(colArr[i], 10))) {
                        colName = tableIns.colToProp(colArr[i]);
                    } else {
                        colName = colArr[i];
                    }
                    if (colHide[colName]) {
                        hasHide = true;
                        delete  colHide[colName];
                        this.nullWidthCount++;
                        this.config.hiddenColNums--;
                    }
                }
                if (hasHide) {
                    this.resize();
                    tableIns.render();
                }

            },

            setPage: function (pageNum) {
                this.pageIndex.pageCurrent = pageNum;
                this.updatePageView(this.pageIndex);
                this.tableIns.loadData(this.getCurrentPageData(this.pageIndex));
            },
            setSelectOption: function (selArr) {
                var columns = this.columns,
                    colName = this.colName,
                    source,
                    dropDownConfigs = this.dropDownConfigs,
                    dropDownConfigsRev = this.dropDownConfigsRev,
                    that = this, idx, selectDatas, i, temp;
                $.each(selArr, function (index, item) {
                    selectDatas = item.data;
                    if (that.option.selectOption) {
                        idx = parseInt(item.index, 10) + 1;
                    } else {
                        idx = item.index;
                    }

                    dropDownConfigs[colName[idx]] = {};
                    dropDownConfigsRev[colName[idx]] = {};
                    source = [];
                    for (i = -1; temp = selectDatas[++i];) {
                        if (typeof temp === 'object') {
                            source.push(temp.name);
                            dropDownConfigs[colName[idx]][temp.name] = temp.value;
                            dropDownConfigsRev[colName[idx]][temp.value] = temp.name;
                        } else {
                            source.push(temp);
                            dropDownConfigs[colName[idx]][temp] = temp;
                            dropDownConfigsRev[colName[idx]][temp] = temp;
                        }
                    }


                    columns[idx].source = source;

                    // if(item.cantData){
                    //     that.config.cantData.push({
                    //         name:columns[item.index].data,
                    //         data:item.cantData
                    //     })
                    // }
                });
                this.tableIns.updateSettings({
                    columns: columns
                });
                that.resize();
            },
            repaint: function () {
                this.resize();
            },
            selectAll: function () {
                this.checkResult = true;
                this.isSelectAll = true;
                this.setCheckBox();
            },
            unSelectAll: function () {
                this.checkResult = false;
                this.isSelectAll = false;
                this.setCheckBox();
            },
            invertSelectAll: function () {
                var tableIns = this.tableIns, i, rowData,
                    option = this.option,
                    tableSourceData = tableIns.getSourceData(),
                    tableData = tableIns.getSourceDataArray();

                if (tableSourceData.length) {
                    for (i = -1; rowData = tableSourceData[++i];) {
                        if (rowData.checkbox !== true && rowData.checkbox !== 'true') {
                            tableData[i][0] = 'true';
                        } else {
                            tableData[i][0] = 'false';
                        }
                    }
                } else {
                    tableSourceData = tableIns.getData();
                    if (tableSourceData.length && option.selectOption) {
                        $.each(tableSourceData, function (idx, value) {
                            value[0] = !value[0];
                        })
                    }
                }

                tableIns.loadData(this.dataArrToMap(tableData));


            },
            setState: function (data) {
                var tableIns = this.tableIns,
                    dataRow = data.row,
                    dataCol = data.col;

                tableIns.updateSettings({
                    cells: function (row, col) {
                        var cellProperties = {};
                        if (col === dataCol && row === dataRow) {
                            cellProperties.readOnly = true;
                            return cellProperties;
                        }

                    }
                });

            }
        };

        //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
        widget.component.handsontable = function ($widget, option, attr, css, auiCtx) {
            return new Component($widget, option, attr, css, auiCtx);
        };
    });
})();