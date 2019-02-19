/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "component.btn.dropdownBtn", "dataTables.fixedColumns.min"], factory);
        }
        // global
        else {
            factory();
        }

    })
        (function ($, widget) {
            "use strict";

            var formatRows = function (rows, aoColumns, dataTb, selectOption) {
                var data = [];
                $.each(rows, function (index, rowIndex) {
                    var row = [],
                        $td, $div;
                    $.each(aoColumns, function (columnIndex, columnDef) {
                        var $td = $(dataTb.api().cell({
                            row: rowIndex,
                            column: columnIndex
                        }).node());
                        switch (columnDef.columnType) {
                            case 'img':
                                row.push($td.find('img').attr('src'));
                                break;

                            case 'href':
                                row.push($td.find('a').attr('href'));
                                break;

                            case 'btn':
                                row.push($td.find('button').text());
                                break;

                            case 'input':
                                row.push($td.find('input').val());
                                break;

                            case 'checkbox':
                                row.push($td.find('input')[0].checked);
                                break;
                            case 'select':
                                row.push($td.find('select').val());
                                break;
                            case 'btns':
                                break;
                            default:
                                $div = $td.children('div');

                                if ($div.length) {
                                    row.push($div.html());
                                } else {
                                    row.push($td.html());
                                }

                                break;
                        }
                    });

                    switch (selectOption) {
                        case 'checkbox':
                        case 'radio':
                            row.splice(0, 1);
                            break;
                    }

                    data.push(row);
                });

                return data;

            },
                addBtns = function (value, isDrop, isOp, btnWidth) {
                    var $button, btnText, iconTmp, temHtml;
                    if (isDrop) {
                        $button = $('<li><button id="_id_" type="button" class="btn btn-inverse " style="width:' + btnWidth + '"></button></li>'.replace(/_id_/, value.id));
                    } else {
                        if (isOp) {
                            $button = $('<button  data-role="table-td-btn"  class="table-td-btn _CLASS_" ></button>'.replace(/_CLASS_/, value.className))
                        } else {
                            $button = $('<button id="_id_" type="button" class="btn btn-inverse "></button>'.replace(/_id_/, value.id));
                        }

                    }



                    btnText = (value.name && "<span>_name_</span>".replace(/_name_/, value.name)) || '';

                    if (value.useIcon && value.icon) {
                        iconTmp = '<span style="padding-_IC_:10px"><i class="_icon_"></i></span>'.replace(/_icon_/, value.icon);

                        if (value.iconPosition === 1) {
                            //图标加在右边
                            temHtml = btnText + iconTmp.replace(/_IC_/, 'left');
                        } else {
                            //图标加在左边
                            temHtml = iconTmp.replace(/_IC_/, 'right') + btnText;
                        }
                    } else {
                        temHtml = btnText;
                    }

                    if (isDrop) {
                        $('button', $button).append(temHtml);
                    } else {
                        $button.append(temHtml);
                    }
                    return $button.get(0).outerHTML;
                },
                getButtonsHtml = function (buttons, attrId, auiCtx) {
                    var html = [];
                    if (buttons) {
                        html.push('<div class="gutter-bottom btn-group">');

                        $.each(buttons, function (index, value) {

                            value.name = (auiCtx && $AW.nsl(value.name, attrId, auiCtx) || value.name);

                            if (value.isDropdown) {
                                html.push([
                                    '<div class="btn-group drawdown-memu-container" style="display: inline-block;">',
                                    '<button type="button" class="btn btn-inverse dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">',
                                    '<span class="caret">_name_ </span><i class="fa fa-angle-down" style="padding-left: 8px; float: right;"></i>',
                                    '</button>',
                                    '<ul class="dropdown-menu">'
                                ].join('').replace(/_name_/, value.name));
                                value.dropDownOption && $.each(value.dropDownOption, function (index, value) {
                                    if (value.isSeparator) {
                                        html.push('<li role="separator" class="divider"></li>');
                                    } else {
                                        value.name =  (auiCtx && $AW.nsl(value.name, attrId, auiCtx)) || value.name;
                                        html.push(addBtns(value, true));
                                    }
                                });

                                html.push('</ul></div>');

                            } else {
                                /*		html.push('<button id="_id_" type="button" class="btn btn-inverse hvr-radial-out">_name_</button>'
                                            .replace(/_id_/, value.id)
                                            .replace(/_name_/, value.name));*/
                                html.push(addBtns(value));

                            }
                        });

                        html.push('</div>');
                        return html.join('');
                    } else {
                        return '';
                    }
                },
                getButtonIdLists = function (buttons) {

                    var allIds = [], multipleIds = [], onlyIds = [];

                    if (buttons) {
                        $.each(buttons, function (index, value) {
                            if (!value.isDropdown) {
                                switch (value.type) {
                                    case 'multiple':
                                        multipleIds.push('#' + value.id);
                                        allIds.push('#' + value.id);
                                        onlyIds.push('#' + value.id);
                                        break;

                                    case '':

                                        break;

                                    case 'only':
                                        onlyIds.push('#' + value.id);
                                        allIds.push('#' + value.id);
                                        break;
                                }
                            } else {
                                value.dropDownOption && $.each(value.dropDownOption, function (index, value) {
                                    if (!value.isSeparator) {
                                        switch (value.type) {
                                            case 'multiple':
                                                multipleIds.push('#' + value.id);
                                                allIds.push('#' + value.id);
                                                onlyIds.push('#' + value.id);
                                                break;

                                            case 'only':
                                                onlyIds.push('#' + value.id);
                                                allIds.push('#' + value.id);
                                                break;
                                        }
                                    }
                                });
                            }
                        });
                    }
                    return {
                        allIds: allIds.join(','),
                        multipleIds: multipleIds.join(','),
                        onlyIds: onlyIds.join(',')
                    }

                },
                renderTable = function ($selector,$table, option, attr,css,auiCtx) {

                    var
                        $table = $table,
                        dataTb,
                        returnValue = {},
                        returnColumnIndexes = [],
                        checkboxColumnIndexes = [],
                        aoColumns = [], aoColumnDefs = [], aaData = [], column = [],
                        selectResult, columnAsId,
                        $auiTableWrapper = $table.closest('.aui-table-template-wrapper'),
                        tableID = app.getUID(),
                        optionChange = false,
                        tableTemplate = '<table data-widget-type="AIBSTablesV2" class="display dataTable table" style="width:100%"></table>',
                        buttons = option.buttons,
                        columns = option.columns.elements || [],//keys和fields可以在这里取到
                        keys = option.columns.keys,
                        fields = option.columns.fields,
                        selectOption = option.selectOption,
                        isCloseTitle = option.closeTitle,
                        btnName,
                        timeStamp = app.getUID(),//图片时间戳
                        // 后端分页排序所需
                        order = {},
                        that = this,
                        z, btnItem, headTemp, i, j, headRow = "", tempheadRow, colTemp, rowIcol,                       
                        rowBtns = option.rows && option.rows.btns,
                        rowDropBtnsWidth = (option.rows && option.rows.btnWidth) || '',
                        btnColName = option.rows && option.rows.btnColName,
                        btnColWidth = option.rows && option.rows.btnColWidth,
                        dropBtnChange = option.rows && option.rows.dropBtnChange,
                        rowBtnsHtml, upd,aaSorting=[],
                        getTdSelectOption = function (selectConfig, selectedValue) {
                            var selectHtml = [], i, selectTemp, strTemp;

                            selectHtml.push('<select>');
                            for (i = -1; selectTemp = selectConfig[++i];) {
                                strTemp = '<option _SE_ value=' + selectTemp.value + '>' + selectTemp.desp + '</option>';
                                selectHtml.push(strTemp.replace(/_SE_/, (selectTemp.value === selectedValue) ? 'selected' : ''))
                            }
                            selectHtml.push('</select>');

                            return selectHtml.join('');
                        },
                        transformMapToArray = function (map) {
                            var  getFormatData = function(data, keyMap) {

                                var imgArray, arr = [], subArr, selectConfig,
                                    i, item, j, key, k = 0, tempArr = [], tempItem, tempSrc, itemStr,progressVal;
                                if (data && data.length) {

                                    for (i = -1; item = data[++i];) {
                                        if ($.isArray(item)) {

                                            subArr = [];
                                            if (item.length !== columns.length && (item[0] === 'true' || item[0] === 'false' || item[0] === true || item[0] === false)) {
                                                subArr.push(item[0]);
                                                item.splice(0, 1);
                                            }
                                            for (j = -1; key = keys[++j];) {

                                                //兼容
                                                if (columns[j].img) {
                                                    columns[j].columnType = 'img';
                                                } else if (columns[j].href) {
                                                    columns[j].columnType = 'href';
                                                }
                                                switch (columns[j].columnType) {
                                                    case 'img':
                                                        imgArray = [];
                                                        item[j] && $.each(item[j].split(';'), function (index, value) {
                                                            if (value.indexOf('?') !== -1) {
                                                                tempSrc = value;
                                                            } else {
                                                                tempSrc = value + '?version=' + timeStamp;
                                                            }
                                                            imgArray.push('<img src="_src_" style="height:_height_px;width:_width_px;" />'
                                                                .replace(/_src_/, tempSrc)
                                                                .replace(/_height_/, columns[j].height || '30')
                                                                .replace(/_width_/, columns[j].width || '30'));
                                                        });
                                                        subArr.push(imgArray.join(''));
                                                        break;

                                                    case 'href':
                                                        if (typeof item[j] === 'string') {
                                                            subArr.push('<a class="aibs-table-row-a" href="_href_">_name_</a>'.replace(/_href_/, item[j]).replace(/_name_/, item[j]));
                                                        } else if (typeof item[j] === 'object') {
                                                            subArr.push('<a class="aibs-table-row-a" href="_href_">_name_</a>'.replace(/_href_/, item[j].href).replace(/_name_/, item[j].name));
                                                        }

                                                        break;

                                                    case 'checkbox':
                                                        subArr.push('<div class="table-select-btn checkbox"><input type="checkbox" _checked_ /><label></label></div>'.replace(/_checked_/, item[j] ? 'checked' : ''));
                                                        break;

                                                    case 'input':
                                                        subArr.push('<input class="aibs-table-row-input" value="_value_" />'.replace(/_value_/, item[j] || ''));
                                                        break;

                                                    case 'btn':
                                                        if (typeof item[j] === 'string') {
                                                            subArr.push('<a class="aibs-table-row-btn " href="_href_">_name_</a>'.replace(/_href_/, item[j]).replace(/_name_/, item[j]));
                                                        } else if (typeof item[j] === 'object') {
                                                            subArr.push('<a class="aibs-table-row-btn " href="_href_">_name_</a>'.replace(/_href_/, item[j].href).replace(/_name_/, item[j].name));
                                                        }
                                                        break;
                                                    case "progress":
                                                        progressVal = parseInt(item[j],10) > 100 ? 100: parseInt(item[j],10);
                                                        subArr.push('<div  class="aibs-table-row-progress " style="width:100%;border:1px solid #C5C5C5"><div style="width:' + progressVal + '%;text-align: center">' + parseInt(item[j],10) + '%</div></div>');
                                                        break;
                                                    case "select":
                                                        
                                                        selectConfig = columns[j].selectOptions;

                                                        subArr.push(getTdSelectOption(selectConfig, item[j]));
                                                        break;
                                                    case "number":
                                                        subArr.push(app.getFormatData(item[j],app.getFormatData.TYPE.MONEY));
                                                        break;
                                                    default:
                                                        if (item[j] === null || item[j] === undefined || item[j] === 'null' || item[j] === 'undefined') {
                                                            item[j] = '';
                                                        }
                                                        if (columns[j].fixedColWidth) {
                                                            subArr.push('<div class="aibs-table-fixed-colwidth" style="width: ' + columns[j].sWidth + ';">' + item[j] + '</div>');
                                                        } else {
                                                            subArr.push(item[j]);
                                                        }
                                                        break;
                                                }

                                            }


                                            arr.push(subArr);


                                        } else {
                                            subArr = [];
                                            k = 0; tempArr = [];
                                            //2018/2/23储存id对应列
                                            for (tempItem in item) {
                                                if(item.hasOwnProperty(tempItem)){
                                                    tempArr[k] = item[tempItem];
                                                    k++;
                                                }

                                            }

                                            for (j = -1; key = keys[++j];) {

                                                //兼容
                                                if (columns[j].img) {
                                                    columns[j].columnType = 'img';
                                                } else if (columns[j].href) {
                                                    columns[j].columnType = 'href';
                                                }

                                                switch (columns[j].columnType) {
                                                    case 'img':
                                                        imgArray = [];
                                                        item[key] && $.each(item[key].split(';'), function (index, value) {
                                                            if (value.indexOf('?') !== -1) {
                                                                tempSrc = value;
                                                            } else {
                                                                tempSrc = value + '?version=' + timeStamp;
                                                            }
                                                            imgArray.push('<img src="_src_" style="height:_height_px;width:_width_px;" />'
                                                                .replace(/_src_/, tempSrc)
                                                                .replace(/_height_/, columns[j].height || '30')
                                                                .replace(/_width_/, columns[j].width || '30'));
                                                        });
                                                        subArr.push(imgArray.join(''));
                                                        break;

                                                    case 'href':
                                                        if (typeof item[key] === 'string') {
                                                            subArr.push('<a class="aibs-table-row-a" href="_href_">_name_</a>'.replace(/_href_/, item[key]).replace(/_name_/, item[key]));
                                                        } else if (typeof item[key] === 'object') {
                                                            subArr.push('<a class="aibs-table-row-a" href="_href_">_name_</a>'.replace(/_href_/, item[key].href).replace(/_name_/, item[key].name));
                                                        }

                                                        break;

                                                    case 'checkbox':
                                                        subArr.push('<div class="table-select-btn checkbox"><input type="checkbox" _checked_ /><label></label></div>'.replace(/_checked_/, item[key] ? 'checked' : ''));
                                                        break;

                                                    case 'input':
                                                        subArr.push('<input class="aibs-table-row-input" value="_value_" />'.replace(/_value_/, item[key] || ''));
                                                        break;

                                                    case 'btn':
                                                        if (typeof item[key] === 'string') {
                                                            subArr.push('<a class="aibs-table-row-btn " href="_href_">_name_</a>'.replace(/_href_/, item[key]).replace(/_name_/, item[key]));
                                                        } else if (typeof item[key] === 'object') {
                                                            subArr.push('<a class="aibs-table-row-btn " href="_href_">_name_</a>'.replace(/_href_/, item[key].href).replace(/_name_/, item[key].name));
                                                        }
                                                        break;
                                                    case "progress":

                                                        subArr.push('<div class="aibs-table-row-progress " style="width:100%;border:1px solid #C5C5C5"><div style="width:' + parseInt(item[key],10) + '%;text-align: center">' + parseInt(item[key]) + '%</div></div>');
                                                        break;
                                                    case "select":

                                                        selectConfig = columns[j].selectOptions;

                                                        subArr.push(getTdSelectOption(selectConfig, item[key]));
                                                        break;
                                                    case "number":
                                                        subArr.push(app.getFormatData(item[key],app.getFormatData.TYPE.MONEY));
                                                        break;
                                                    default:
                                                        if (keyMap && keyMap[item[key]]) {
                                                            itemStr = keyMap[item[key]];
                                                        } else {
                                                            itemStr = item[key];
                                                        }
                                                        if (itemStr == null || itemStr === undefined || itemStr === 'null' || itemStr === 'undefined') {
                                                            itemStr = '';
                                                        }
                                                        if (columns[j].fixedColWidth) {
                                                            subArr.push('<div class="aibs-table-fixed-colwidth" style="width: ' + columns[j].sWidth + ';">' + itemStr + '</div>');
                                                        } else {
                                                            subArr.push(itemStr);
                                                        }

                                                        break;
                                                }

                                            }

                                            arr.push(subArr);
                                        }
                                    }
                                }

                                return arr;
                            };

                            if (typeof map === 'object' && !$.isArray(map)) {
                                $.each(map.keyMap, function (key, value) {
                                    var result = {};
                                    //统一格式
                                    value.valueArray && $.each(value.valueArray, function (index, item) {
                                        result[item] = value.despArray[index];
                                    });

                                    map.keyMap = result;
                                });
                                return getFormatData(map.values, map.keyMap);
                            } else if (map === 'auiAjaxTest') {
                                return map;
                            } else {
                                return getFormatData(map);
                            }

                        },
                        getRowBtnsHtml = function () {
                            var hidRowBtns = returnValue.hideRowBtns || [],
                                haveDrop = false,
                                noName = false,
                                className, i, item,
                                btns = [], dropBtns = [],
                                dropLeft = rowDropBtnsWidth ? 84 - (128 - parseInt(rowDropBtnsWidth, 10)) : '';


                            dropBtns.push('<div class="table-td-drop-btn drawdown-memu-container" >' +
                                '<button type="button" class="td-drop-btn dropdown  ' + (dropBtnChange ? 'td-drop-text-btn' : '') + '" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                                '<span class="caret">' + (dropBtnChange ? '操作' : '<i class="fa fa-list"></i>') + '</span><i class="fa fa-angle-down" ></i>' +
                                '</button>' +
                                '<ul class="dropdown-menu  _CLASS_" style="min-width:' + rowDropBtnsWidth + ';left:-' + dropLeft + 'px">');

                            for (i = -1; item = rowBtns[++i];) {

                                className = item.selector.replace(/./, '');
                                item.className = className;

                                item.name =  (auiCtx && $AW.nsl(item.name, attr.id, auiCtx)) || item.name;



                                if (!hidRowBtns.length || !~$.inArray(className, hidRowBtns)) {

                                    if (item.addSelectArr) {
                                        haveDrop = true;
                                        if (!item.name) {
                                            noName = true;
                                        }
                                        dropBtns.push('<li>' + addBtns(item, false, true) + '</li>');
                                    } else {
                                        btns.push(addBtns(item, false, true, rowDropBtnsWidth));
                                    }
                                }

                            }
                            if (haveDrop) {
                                dropBtns[0] = dropBtns[0].replace(/_CLASS_/, noName ? 'table-td-drop-only-icon-ul' : '');
                                dropBtns.push('</ul></div>');
                            }

                            return '<div class="btn-ctn" style = "width:' + btnColWidth + '">' + btns.join('') + (haveDrop ? dropBtns.join('') : '') + '</div>';
                        },
                        // 复杂表头
                        setComplexThead = function () {
                            if (option.complexThead) {
                                headRow = option.headRow;
                                tempheadRow = "";
                                headTemp = "";
                                if (selectOption) {
                                    for (i = 0; i < headRow.length; i++) {
                                        colTemp = "";
                                        rowIcol = headRow[i].headCol;
                                        if (i === headRow.length - 1) {
                                            colTemp += '<th class="sorting_disabled complexThead" colspan="1" rowspan="1"></th>';

                                            for (j = 0; j < rowIcol.length; j++) {
                                                colTemp += '<th class="sorting_disabled complexThead" colspan="' + rowIcol[j].colspan + '" rowspan="' + rowIcol[j].rowspan + '" aria-label="' + rowIcol[j].title + '">' + rowIcol[j].title + '</th>'
                                            }
                                        }else{
                                            for (j = 0; j < rowIcol.length; j++) {
                                                colTemp += '<th class="sorting_disabled complexThead" colspan="' + (parseInt(rowIcol[j].colspan,10)+1)+ '" rowspan="' + rowIcol[j].rowspan +'" aria-label="' + rowIcol[j].title + '">' + rowIcol[j].title + '</th>'
                                            }
                                        }
                                        tempheadRow = "<tr>" + colTemp + "</tr>";
                                        headTemp += tempheadRow;
                                    }
                                } else {
                                    for (i = 0; i < headRow.length; i++) {
                                        colTemp = "";
                                        rowIcol = headRow[i].headCol;
                                        for (j = 0; j < rowIcol.length; j++) {
                                            colTemp += '<th class="sorting_disabled complexThead" colspan="' + rowIcol[j].colspan + '" rowspan="' + rowIcol[j].rowspan + '" aria-label="' + rowIcol[j].title + '">' + rowIcol[j].title + '</th>'
                                        }
                                        tempheadRow = "<tr>" + colTemp + "</tr>";
                                        headTemp += tempheadRow;

                                    }
                                }

                                $table.find("thead").html(headTemp)
                            }
                        };


                    columnAsId = (option.columnAsId !== undefined ? option.columnAsId : 1);

                    if (option.sDom === '') {
                        delete option.sDom;
                    }

                    if (!option.sScrollX) {
                        delete option.sScrollX;
                        delete option.scrollCollapse;
                        delete option.fixedColumns;
                    } else {
                        if (!option.fixedColumns.leftColumns && !option.fixedColumns.rightColumns) {
                            delete option.fixedColumns;
                        }
                        $AW.cssHover('th, td ', $auiTableWrapper, { "white-space": "nowrap" }, '') //解决表头和表体错位问题
                    }

                    if (option.sScrollY) {
                        option.scrollCollapse = true;
                    }





                    delete option.buttons;
                    delete option.columns;
                    delete option.selectOption;
                    delete option.columnAsId;

                    $auiTableWrapper.find('table').attr('id', tableID);

                    //将columns转化为datatable可用的option
                    $.each(columns, function (index, value) {

                        value.sTitle = value.sTitle || '新建列';
                        //对列名称进行国际化翻译
                        value.sTitle =  auiCtx && $AW.nsl(value.sTitle, attr.id, auiCtx) || value.sTitle;

                        aoColumns.push({ sTitle: value.sTitle, columnType: value.columnType, sWidth: value.sWidth, bVisible: value.bVisible });


                        switch (value.columnType) {
                            case 'img':
                            case 'href':
                            case 'btn':
                            case 'checkbox':
                            case 'input':
                            case 'select':
                                column.push(value.columnType);
                                if (index === columnAsId) {
                                    columnAsId = columnAsId + 1;
                                }
                                break;
                            default:
                                column.push('列' + index);
                                break;
                        }
                    });

                    switch (selectOption) {
                        case 'checkbox':
                        case 'radio':
                            if (selectOption === 'checkbox') {
                                aoColumns.unshift({ sTitle: '<div class="table-select-btn _selectOption_"><input id="_id__SelAllBtn" type="_selectOption_"/><label></label></div>'.replace(/_id_/, tableID).replace(/_selectOption_/, selectOption).replace(/_selectOption_/, selectOption) });
                            } else {
                                //单选时，表头部分为空
                                aoColumns.unshift({ sTitle: '' });
                            }

                            aoColumnDefs.push({ aTargets: [0], bSortable: false, sWidth: '100px' });
                            $.each(columns, function (index, value) {
                                value.aTargets = [index + 1];
                                aoColumnDefs.push(value);
                                if(value.bSortable) {
                                    aaSorting.push([index + 1, value.sortType]);
                                }
                                value.isReturned && returnColumnIndexes.push(index + 1);
                                value.columnType === 'checkbox' && checkboxColumnIndexes.push(index);
                            });

                            columnAsId = columnAsId + 1;
                            break;

                        default:
                            $.each(columns, function (index, value) {
                                value.aTargets = [index];
                                aoColumnDefs.push(value);
                                if(value.bSortable) {
                                    aaSorting.push([index, value.sortType]);
                                }
                            });
                            break;
                    }
                    $.each(new Array(50), function (index, value) {
                        var temp = [], selectConfig;

                        $.each(column, function (i, v) {
                            switch (v) {
                                case 'img':
                                    temp.push('<img src="./img/404.png?version=' + timeStamp + '"  style="width:' + (columns[i].width || '30') + 'px;height:' + (columns[i].height || '30') + 'px"/>');
                                    break;

                                case 'href':
                                    temp.push('<a class="aibs-table-row-a">链接列</a>');
                                    break;

                                case 'btn':
                                    temp.push('<button class="aibs-table-row-btn">按钮列</button>');
                                    break;

                                case 'input':
                                    temp.push('<input class="aibs-table-row-input" type="text" placeholder="请输入"/>');
                                    break;

                                case 'checkbox':
                                    temp.push('<div class="table-select-btn checkbox"><input type="checkbox" /><label></label></div>');
                                    break;
                                case 'select':
                                    if (selectConfig = columns[i].selectOptions) {
                                        temp.push(getTdSelectOption(selectConfig, ''));
                                    } else {
                                        temp.push('<select><option>选项一</option><option>选项二</option></select>');
                                    }
                                    break;

                                default:
                                    temp.push('行' + index + v);
                                    break;
                            }

                        });
                        aaData.push(temp);
                    });

                    if (rowBtns && rowBtns.length) {

                        rowBtnsHtml = getRowBtnsHtml();
                        upd = false;

                        aoColumns.push({ sWidth: btnColWidth, bVisible: true, sTitle: (auiCtx && $AW.nsl(btnColName || '操作列', attr.id, auiCtx)) || btnColName || '操作列', columnType: 'btns', data: 'btns' });
                        aoColumnDefs.push({
                            aTargets: aoColumnDefs.length,
                            bVisible: true,
                            sWidth: btnColWidth,
                            bSortable: false,
                            render: function () {

                                $(arguments[3].settings.nTable).addClass('has-op');

                                if (returnValue.hideRowBtns && upd === false) {
                                    upd = true;
                                    rowBtnsHtml = getRowBtnsHtml();
                                }

                                return rowBtnsHtml;
                            },
                            uuid: app.getUID()
                        });


                        for (z = -1; btnItem = rowBtns[++z];) {
                            $AW.cssHover('.btn-ctn .table-td-btn' + btnItem.selector + '', $auiTableWrapper, btnItem.btnStyle, '');
                        }

                    }

                    // option.aaData = aaData;
                    option.aoColumnDefs = aoColumnDefs;
                    option.aoColumns = aoColumns;

                    option.aaSorting = aaSorting;

                    if (option.aMenuLength && option.aMenuLength.length) {
                        option.lengthMenu = option.aMenuLength;
                        delete option.aMenuLength;
                    } else {
                        option.lengthMenu = [10, 25, 50, 100];
                    }

                    $auiTableWrapper.html(tableTemplate);
                    $table = $auiTableWrapper.find('table');
                    $table.attr('id', tableID);

                    //添加按钮组
                    $auiTableWrapper.prepend(getButtonsHtml(buttons, attr.id, auiCtx));
                    //添加按钮组和表格的间隙
                    $table.wrap('<div class="aui-table-content-wrapper" style="margin-top: 1em"></div>');

                    function renderCssStyle() {
                        //自定义样式
                        if (css && css.cssCode && css.cssCode.className) {
                            $auiTableWrapper.addClass(css.cssCode.className)
                        }
                        //样式渲染
                        if (!$.isEmptyObject(css) && css.style) {
                            var style = css.style, checkboxObj, radioObj, cssTemp;
                            style.header && $AW.cssHover('tr td:first-child', $table, style.header, '');
                            style.header && $AW.cssHover('tr th:first-child', $table, style.header, '');

                            style.font && $table.css(style.font);
                            style.rowBorder && $AW.cssHover('.dataTable.display tbody td', $table, style.rowBorder, '', true);
                            style.rowColor && $AW.cssHover('.dataTable.display tbody tr.even', $table, style.rowColor, '', true);

                            style.border && $table.css(style.border);

                            if (style.checkbox) {
                                checkboxObj = JSON.parse(JSON.stringify(style.checkbox));
                                $AW.cssHover('.dataTables_wrapper .dataTables_paginate .paginate_button.current', $selector, { 'background-color': checkboxObj['background-color'] }, '');
                                $AW.cssHover('.dataTables_wrapper .paginate_button', $table, { 'color': checkboxObj['background-color'] }, ':hover');
                                $AW.cssHover('.dataTables_wrapper .dataTables_paginate .paginate_button.next', $selector, { 'border-color': checkboxObj['background-color'] }, ':hover');
                                $AW.cssHover('.dataTables_wrapper .dataTables_paginate .paginate_button.previous', $selector, { 'border-color': checkboxObj['background-color'] }, ':hover');
                                $AW.cssHover('table.dataTable .table-select-btn.checkbox label', $selector, { 'border-color': checkboxObj['border-color'] }, '::before');
                                $AW.cssHover('table.dataTable .table-select-btn input[type="checkbox"]:checked+label', $selector, $.extend({}, style.checkbox, { 'border-color': checkboxObj['background-color'] }), '::before');
                                $AW.cssHover('table.dataTable .table-select-btn input.tables-indeterminate+label', $selector, $.extend({}, style.checkbox, { 'border-color': checkboxObj['background-color'] }), '::before');
                            }
                            if (style.radio) {
                                radioObj = JSON.parse(JSON.stringify(style.radio));
                                $AW.cssHover('.dataTables_wrapper .dataTables_paginate .paginate_button.current', $selector, { 'background-color': radioObj['background-color'] }, '');
                                $AW.cssHover('.dataTables_wrapper .paginate_button', $selector, { 'color': radioObj['background-color'] }, ':hover');
                                $AW.cssHover('.dataTables_wrapper .dataTables_paginate .paginate_button.next', $selector, { 'border-color': radioObj['background-color'] }, ':hover');
                                $AW.cssHover('.dataTables_wrapper .dataTables_paginate .paginate_button.previous', $selector, { 'border-color': radioObj['background-color'] }, ':hover');
                                $AW.cssHover('table.dataTable .table-select-btn.radio label::before', $selector, { 'border-color': radioObj['border-color'] }, '');
                                $AW.cssHover('table.dataTable .table-select-btn.radio label', $selector, { 'background-color': radioObj['background-color'] }, '::after');
                                $AW.cssHover('table.dataTable .table-select-btn input[type="radio"]:checked+label', $selector, { 'border-color': radioObj['background-color'] }, '::before');
                                $AW.cssHover('table.dataTable .table-select-btn input[type="radio"]:checked+label', $selector, { 'background-color': radioObj['background-color'] }, '::after');
                                $AW.cssHover('table.dataTable .table-select-btn input.tables-indeterminate+label', $selector, $.extend({}, style.radio, { 'border-color': radioObj['background-color'] }), '::before');
                            }
                            style.btn && $AW.cssHover('.gutter-bottom  button.btn-inverse', $selector, style.btn, '');
                            style.btnHover && $AW.cssHover('.gutter-bottom  button.btn-inverse', $selector, style.btnHover, ':hover');
                            style.btnActive && $AW.cssHover('.gutter-bottom  button.btn-inverse', $selector, style.btnActive, ':active');
                            style.btnFocus && $AW.cssHover('.gutter-bottom  button.btn-inverse', $selector, style.btnFocus, ':focus');
                            style.clo && $AW.cssHover('.dataTable.display tbody td', $table, style.clo, '', true);
                            style.linkBtn && $AW.cssHover('td .aibs-table-row-a', $table, style.linkBtn, '');
                            style.colBtn && $AW.cssHover('td .aibs-table-row-btn', $table, style.colBtn, '');
                            style.colInput && $AW.cssHover('td .aibs-table-row-input', $table, style.colInput, '');
                            style.colProgress && $AW.cssHover('td div.aibs-table-row-progress div', $table, style.colProgress, '');
                            style.fixedColWidth && $AW.cssHover('td div.aibs-table-fixed-colwidth', $table, style.fixedColWidth, '');
                            style.operateBtn && $AW.cssHover('table td >.table-td-drop-btn>button.td-drop-btn', $auiTableWrapper, style.operateBtn, '');
                            style.searchBox && $AW.cssHover('.dataTables_wrapper .dataTables_filter input.search-query.input-small', $selector, style.searchBox, '');
                            if (style.thead) {
                                $AW.cssHover('thead tr th', $auiTableWrapper, style.thead, '');
                            }


                        }

                    }
                    function select(data) {


                        switch (selectOption) {
                            case 'checkbox':
                            case 'radio':
                                var $selectAllBtn = $('#_id__SelAllBtn'.replace(/_id_/, tableID), $auiTableWrapper);

                                //后台分页全选问题
                                if (!!option.bCheckState) {
                                    $selectAllBtn
                                        .off('click.dataTables')
                                        .on('click.dataTables', function () {

                                            var $this = $(this),
                                                check = !$this.prop('indeterminate') && !!this.checked,
                                                nodes = $('tbody tr>:awosNth(0) :input', $auiTableWrapper),
                                                list = selectResult && selectResult.list() || [],
                                                checklist = [],
                                                idMap = {}, checkMap = {};

                                            nodes.each(function (index, elem) {
                                                idMap[elem.id] = true;

                                                if (check) {
                                                    checkMap[elem.id] = true;
                                                    checklist.push(elem.id);
                                                }
                                            });


                                            for (var i = list.length, id; i;) {
                                                --i;
                                                id = list[i];

                                                if (!checkMap[id]) {
                                                    checkMap[id] = true;

                                                    if (!check && !idMap[id] || check) {
                                                        checklist.push(id);
                                                    }
                                                }
                                            }

                                            setTimeout(function () {
                                                selectResult && selectResult.check(checklist);
                                            }, 0);


                                        });
                                }


                                selectResult = app.select($.extend(true, {
                                    context: $auiTableWrapper,
                                    button: $selectAllBtn,
                                    container: $('tbody', $auiTableWrapper.find('table')),
                                    checkbox: selectOption === 'checkbox' ? 'tr td:first-child :checkbox' : 'tr td:first-child :radio',
                                    isDataTable: true,
                                    bCheckState: option.bCheckState || false,
                                    isSelectChildren: false,
                                    operationButtons: {	//各种状态下，按钮的可操纵情况
                                        list: getButtonIdLists(buttons).allIds,//所有按钮选择器列表
                                        status: {//各种状态
                                            // 'Running': [getButtonIdLists(customOption.buttons).onlyIds, getButtonIdLists(customOption.buttons).multipleIds],
                                            // 'Stopped': [getButtonIdLists(customOption.buttons).onlyIds, getButtonIdLists(customOption.buttons).multipleIds],
                                            '_default': [getButtonIdLists(buttons).onlyIds, getButtonIdLists(buttons).multipleIds]//默认状态下的情况，这个状态必需保留
                                        }
                                    },
                                    allDataLength: data.length,
                                    allData: data || [],
                                    setNodeMethod: function (list, elem) {//设置节点的方法

                                        list[elem['id']] = {
                                            node: elem,
                                            status: $(elem).attr('data-status')
                                        };
                                        return list;
                                    },
                                    getIdMethod: function (elem) {//获取节点ID的方法
                                        return elem.id;
                                    },
                                    getStatusMethod: function (list, options) {//返回各种选择情况下的状态，与operationButtons.status一致。
                                        /*var status, p, result;
    
                                         //枚举每一个记录的状态
                                         for (p in list) {
                                         if (!status) status = list[p].status;
    
                                         if (status !== list[p].status) {
                                         result = list[p].status;
                                         break;
                                         }
                                         }
    
                                         return status === result ? result : '_default';//缺省情况下，必需返回一个'_default'*/

                                        return '_default';

                                    }
                                }));
                                returnValue.list = selectResult && selectResult.list;

                                returnValue.getSelectedResult = function () {

                                    var nodes = selectResult && selectResult.nodes(),
                                        nodesLength, count = 0,
                                        tableNodes = dataTb.fnGetNodes(),
                                        result = [], rowId, i, item
                                        ;
                                    switch (selectOption) {
                                        case 'radio':
                                            $.each(nodes, function (key, value) {
                                                var rowDom = $(value.node).closest('[role="row"]'),
                                                    rowData = dataTb.fnGetData(rowDom[0]),
                                                    cacheRowData = [];
                                                if (rowData) {
                                                    $.each(returnColumnIndexes, function (i, columnIndex) {

                                                        var $node = $(dataTb.api().cell({
                                                            row: dataTb.api().row(rowDom).index(),
                                                            column: columnIndex
                                                        }).node());

                                                        switch (aoColumns[columnIndex].columnType) {
                                                            case 'checkbox':
                                                                cacheRowData.push($node.find('input')[0].checked);
                                                                break;

                                                            case 'input':
                                                                cacheRowData.push($node.find('input').val());
                                                                break;
                                                            case 'select':

                                                                cacheRowData.push($node.find('select').val());
                                                                break;

                                                            default:
                                                                cacheRowData.push(rowData[columnIndex]);
                                                                break;
                                                        }
                                                    });
                                                    result.push(cacheRowData);
                                                }
                                            });
                                            break;
                                        case 'checkbox':
                                            if (Object.keys) {
                                                nodesLength = Object.keys(nodes).length
                                            } else {
                                                for (item in nodes) {
                                                    if (nodes.hasOwnProperty(item)) {
                                                        count++;
                                                    }
                                                }
                                                nodesLength = count;
                                            }

                                            for (i = -1; item = tableNodes[++i];) {
                                                for (rowId in nodes) {
                                                    if (nodes.hasOwnProperty(rowId) && $('input', item.children[0]).attr('id') === rowId) {
                                                        var cacheRowData = [], rowData;
                                                        rowData = dataTb.fnGetData(item);
                                                        if (rowData && rowData.length) {
                                                            $.each(returnColumnIndexes, function (i, columnIndex) {
                                                                var $node = $(dataTb.api().cell({
                                                                    row: dataTb.api().row(item).index(),
                                                                    column: columnIndex
                                                                }).node());
                                                                switch (aoColumns[columnIndex].columnType) {
                                                                    case 'checkbox':
                                                                        cacheRowData.push($node.find('input')[0].checked);
                                                                        break;

                                                                    case 'input':
                                                                        cacheRowData.push($node.find('input').val());
                                                                        break;
                                                                    case 'select':
                                                                        cacheRowData.push($node.find('select').val());
                                                                        break;
                                                                    default:
                                                                        if ($node.find('div').length) {
                                                                            cacheRowData.push($node.find('div').html());
                                                                        } else {
                                                                            cacheRowData.push(dataTb.api().cell({
                                                                                row: dataTb.api().row(item).index(),
                                                                                column: columnIndex
                                                                            }).data())
                                                                        }

                                                                        break;
                                                                }
                                                            });
                                                            result.push(cacheRowData);
                                                        }
                                                    }
                                                }

                                                if (result.length === nodesLength) {
                                                    break;
                                                }
                                            }
                                            break;
                                    }

                                    return result;
                                };


                                returnValue.size = selectResult && selectResult.size;
                                returnValue.clear = selectResult && selectResult.clear;
                                returnValue.check = selectResult && selectResult.check;
                                returnValue.nodes = selectResult && selectResult.nodes;
                                returnValue.select = selectResult;
                                break;
                        }
                    }
                    function showHighlight(dataTb, data) {
                        var columnIndex, i, item, j, tem, colorMap = {}, colorArr, cssStyle;


                        if (option.highlight && option.highlight.colorArray) {

                            columnIndex = option.highlight.columnIndex;
                            colorArr = option.highlight.colorArray;

                            for (i = -1; item = colorArr[++i];) {
                                cssStyle = {};
                                if (item.bgColor) {
                                    cssStyle['background-color'] = item.bgColor;
                                }
                                if (item.color) {
                                    cssStyle['color'] = item.color;
                                }
                                if (!$.isEmptyObject(cssStyle) && item.key !== '') {
                                    colorMap[item.key] = cssStyle;
                                }
                            }

                        }

                        if (typeof columnIndex !== 'undefined') {
                            for (i = -1; item = data[++i];) {
                                for (j = 0; j < item.length; j++) {
                                    tem = item[j];
                                    if (j === columnIndex) {

                                        if (!$.isEmptyObject(colorMap) && colorMap[tem]) {

                                            $(dataTb.fnGetNodes(i)).css(colorMap[tem]);
                                        }
                                    }
                                }
                            }
                        }

                    }
                    function showRowStatus(dataTb, data) {
                        var columnIndex, i, item, j, tem, statusMap = {}, statusArr, $td;

                        if (option.statusConfig && option.statusConfig.statusArray) {

                            columnIndex = option.statusConfig.columnIndex;
                            statusArr = option.statusConfig.statusArray;

                            for (i = -1; item = statusArr[++i];) {

                                if (item.key !== '') {
                                    statusMap[item.key] = item.htmlStr;
                                }
                            }

                        }
                        if (typeof columnIndex !== 'undefined') {
                            for (i = -1; item = data[++i];) {

                                if (statusMap[item[columnIndex]]) {
                                    $td = $(dataTb.fnGetNodes(i)).children('td').eq(columnIndex);
                                    $td.html(statusMap[item[columnIndex]]);
                                }

                            }
                        }

                    }
                    function closeRowTitle() {
                        var tableNodes = dataTb.fnGetNodes();
                        $(tableNodes).removeAttr('title');
                    }

                    function setTargetRowData(e) {
                        var $target = $(e.target || event.srcElement),
                            currentIndex = 0;

                        currentIndex = $target.parents('tr').index();

                        returnValue.storeRowData = returnValue.getPageData()[currentIndex];
                    }

                    //AIBS Tables 中 dataTables 国际化选项
                    option.language = {
                        "oPaginate": {
                            "sFirst": $AW.nsl("首页"),
                            "sLast": $AW.nsl("尾页")
                        },
                        "sEmptyTable": $AW.nsl(option.detailInfo && option.detailInfo.sEmptyTable),
                        "sInfoEmpty": $AW.nsl(option.detailInfo && option.detailInfo.sInfoEmpty),
                        "sInfo": $AW.nsl("显示第 _START_ 条到第 _END_ 条，共 _TOTAL_ 条数据"),
                        //"Showing _START_ to _END_ of _TOTAL_ entries",
                        "sInfoFiltered": $AW.nsl("(共搜索到 _MAX_ 条数据)"),
                        "sLengthMenu": $AW.nsl("每页显示 _MENU_ 条数据"),
                        "sLoadingRecords": $AW.nsl("加载中..."),
                        "sProcessing": $AW.nsl("请稍等..."),
                        "sSearchPlaceholder": $AW.nsl("请输入查询信息"),
                        "sZeroRecords": $AW.nsl(option.detailInfo && option.detailInfo.sZeroRecords)
                    };

                    if (option.closeAutoWidth) {
                        option.bCloseAutoWidth = false
                    } else {
                        option.bCloseAutoWidth = true
                    }



                    if (option.aoColumns.length > 0) {
                        // option.aaSorting = [];
                        option.autoWidth = true;
                        dataTb = $table.dataTable(option);


                        showRowStatus(dataTb, aaData);

                        // select(aaData);
                    }
                    if (option.searching) {
                        $(".search-query", $selector).attr("placeholder", option.placeHolder)
                    }

                    if(option.complexThead){
                        headRow = option.headRow;

                        tempheadRow="";
                        headTemp="";
                        for(i=0;i<headRow.length;i++){
                            colTemp = "";
                            for(j=0;j<headRow[i].headCol.length;j++){
                                colTemp+='<th class="sorting_disabled" colspan="'+headRow[i].headCol[j].colspan+'" rowspan="'+headRow[i].headCol[j].rowspan+'" aria-label="'+headRow[i].headCol[j].title+'">'+headRow[i].headCol[j].title+'</th>'
                            }
                            tempheadRow = "<tr>"+colTemp+"</tr>";
                            headTemp += tempheadRow;

                        }
                        $table.find("thead").html(headTemp)
                    }

                    setComplexThead();
                    returnValue.dataTable = dataTb;
                    // 绑定事件 20180304
                    $table.off('.tableClick').on({
                        'click.tableClick': function (e) {
                            var $target = $(e.target || event.srcElement),
                                dropHeight, targetOffset,
                                currentIndex = 0, $closetTable, $drop, $button, loc,
                                $tableDropBtn = $target.closest('.table-td-drop-btn'),
                                dropLeft = rowDropBtnsWidth ? 84 - (128 - parseInt(rowDropBtnsWidth, 10)) : 85;

                            currentIndex = $target.parents('tr').index();

                            returnValue.storeRowData = returnValue.getPageData()[currentIndex];
                   	    if ($tableDropBtn.length) {

                   	        app.performance.shortDelay(function () {

                   	            $closetTable = $target.closest('table')[0];

                   	            $drop = $tableDropBtn.find('ul.dropdown-menu');
                   	            $button = $target.closest('button');

                   	            dropHeight = $drop.height();
                   	            targetOffset = $target.offset().top;
                   	            if ((dropHeight + targetOffset) >= document.body.scrollHeight) {

                   	                loc = app.position(e, $button, $target, -22);
                   	                $drop[0].style.cssText = "position : fixed; top:" + (loc.top - dropHeight - 21) + "px !important; left:" + (loc.left - dropLeft) + "px;" + (rowDropBtnsWidth ? "min-width:" + rowDropBtnsWidth : "");

                   	            } else {
                   	                loc = app.position(e, $button, $target, -22);


                   	                $drop[0].style.cssText = "position : fixed;  top:" + loc.top + "px !important; left:" + (loc.left - dropLeft) + "px;" + (rowDropBtnsWidth ? "min-width:" + rowDropBtnsWidth : "");
                   	            }
                   	        });
                   	    }


                        }

                    });
                    
                    // 20180304获取储存上次点击的行数据
                    returnValue.storeRowData = [];
                    returnValue.getClickRowData = function (e) {
                        // if(!e) {
                        //     setTargetRowData(e);
                        // }
                        var data = this.storeRowData;
                        // this.storeRowData = null;
                        return data;
                    };

                    returnValue.refresh = function (data) {
                        var testData = aaData,
                            self = this,
                            nowPage;

                        nowPage = this.getPageNum();
                        data = transformMapToArray(data);

                        switch (selectOption) {
                            case 'checkbox':
                            case 'radio':
                                selectResult && selectResult.clear();
                                break;
                        }
                        dataTb.fnClearTable();

                        if (data === 'auiAjaxTest') {
                            $.each(testData, function (index, value) {
                                switch (selectOption) {
                                    case 'checkbox':
                                        if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

                                            (value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId]) : "";
                                            value[0] = '<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>';
                                        } else {
                                            value.unshift('<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId - 1] + '"/><label></label></div>');
                                        }

                                        break;
                                    case 'radio':
                                        if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {
                                            __list = [];
                                            (value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId]) : '';
                                            value[0] = '<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '" /><label></label></div>';
                                        } else {
                                            value.unshift('<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId - 1] + '" /><label></label></div>');
                                        }

                                        break;
                                }

                            });
                            dataTb.fnAddData(testData);
                            showHighlight(dataTb, testData);
                            showRowStatus(dataTb, testData);
                            select(testData);
                        } else {
                            var __list = [];
                            $.each(data, function (index, value) {

                                switch (selectOption) {
                                    case 'checkbox':
                                        if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

                                            (value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId]) : "";
                                            value[0] = '<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>';
                                        } else {
                                            value.unshift('<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId - 1] + '"/><label></label></div>');
                                        }

                                        break;
                                    case 'radio':
                                        if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {
                                            __list = [];
                                            (value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId]) : '';
                                            value[0] = '<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '" /><label></label></div>';
                                        } else {
                                            value.unshift('<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId - 1] + '" /><label></label></div>');
                                        }

                                        break;
                                }

                            });

                            if ($.isArray(data) && data.length > 0) {
                                dataTb.fnAddData(data);
                                showHighlight(dataTb, data);
                                showRowStatus(dataTb, data);
                                if (typeof data !== 'string') {
                                    select(data);
                                }
                                if ((selectOption === "checkbox" || selectOption === "radio") && option.bSateSave) {
                                    selectResult.check(__list);
                                }
                            }
                        }

                        if (isCloseTitle) {
                            closeRowTitle();
                        }
                        renderCssStyle();
                        // 保留当前页
                        if (option.savePresentPage) {
                            app.performance.shortDelay(function () {
                                self.setPageNum(nowPage);
                            })
                        }

                    };

                    returnValue.getHref = function () {
                        var $dom;
                        $dom = returnValue.jqInput;
                        // 点击td
                        if ($dom[0].nodeName === "TD") {
                            return $dom.find('a').attr('href') || null;
                        } else if ($dom[0].href) {
                            return $dom[0].href;
                        } else {
                            return null;
                        }
                    };
                    returnValue.getPageNum = function () {

                        return this.dataTable.api().page() + 1;
                    };
                    returnValue.getCurrentRowData = function () {
                        return dataTb.row().data();
                    };
                    returnValue.setPageNum = function (num) {
                        $('.paginate_button', $selector).eq(parseInt(num, 10)).trigger('click')

                    };
                    returnValue.refreshFromServer = function (ajaxOpt) {
                        var validateResult,
                            ajaxOption,
                            _success = ajaxOpt.success, __list = [],
                            _data=ajaxOpt.data,
                            nowPage,
                            ajaxOption = $.extend(true, {}, ajaxOpt),
                            self = this;

                        $table.find("thead").html("");
                        nowPage = this.getPageNum();
                        if ((validateResult = app.validate(_data,
                            ajaxOption.validateSuccessCallback,
                            ajaxOption.validateErrorCallback,
                            ajaxOption.validateCleanCallback,
                            ajaxOption.validateContinue,
                            ajaxOption.validate)) && validateResult.result) {

                            option.bServerSide = true;
                            option.bProcessing = true;
                            // 20180302 表格排序事件储存

                            $auiTableWrapper.find('table').off('click.sort').on('click.sort', function (e) {
                                var $target = $(e.target || evnet.srcElement), index = 0, name, orderStr = '';

                                if ($target.is('.sorting') || $target.is('.sorting_asc') || $target.is('.sorting_desc')) {

                                    // 获取点击列位置
                                    index = fields.indexOf($target.text());
                                    // 获取点击列名称
                                    name = keys[index];
                                    // 获取排序值

                                    if ($target.attr('class').slice(8, $target.attr('class').length)) {
                                        orderStr = $target.attr('class').length === 12 ? 'desc' : 'asc';

                                        order[name] = orderStr;
                                    } else {
                                        order[name] = 'desc'
                                    }
                                    ajaxOption.data.order = JSON.stringify(order);

                                    $.ajax(ajaxOption)

                                }

                            });

                            option.ajax = function (ownData, callback, settings) {
                                var returnData = {},
                                    list = selectResult && selectResult.list() || [];

                                if((validateResult = app.validate(_data,
		                                ajaxOption.validateSuccessCallback,
		                                ajaxOption.validateErrorCallback,
		                                ajaxOption.validateCleanCallback,
		                                ajaxOption.validateContinue,
		                                ajaxOption.validate)) && validateResult.result){
	                                if (validateResult.data) {
		                                $.each(validateResult.data, function (index, value) {
			                                returnData[value.name] = value.value;
		                                });
	                                }
	                                returnData.order = order;
	                                ajaxOption.data = $.extend(true, {}, ownData, returnData);
	                                ajaxOption.data.PageNum = parseInt(ajaxOption.data.start / ajaxOption.data.length, 10) + 1;
	                                ajaxOption.data.PageRows = ajaxOption.data.length;
	                                ajaxOption.data.StartRows = ajaxOption.data.start;
	                                ajaxOption.data.order = order;
	                                ajaxOption.data.order = JSON.stringify(ajaxOption.data.order);
	                                ajaxOption.data.search = JSON.stringify(ajaxOption.data.search);

	                                delete ajaxOption.data.length;
	                                delete ajaxOption.data.start;

	                                ajaxOption.success = function (res) {
		                                var returnData = {}, aaDataCopy, result;
		                                if (res.status) {
			                                //封装返回数据，这里仅演示了修改属性名
			                                result = res.content.result;

			                                if (result === 'auiAjaxTest') {
				                                aaDataCopy = $.extend(true, [], aaData);
				                                returnData.draw = ownData.draw;//这里直接自行返回了draw计数器,应该由后台返回
				                                returnData.recordsTotal = aaDataCopy.length;
				                                returnData.recordsFiltered = aaDataCopy.length;//后台不实现过滤功能，每次查询均视作全部结果

				                                if (!$.isEmptyObject(order)) {
					                                returnData.data = aaDataCopy.reverse().slice(ownData.start, ownData.length + ownData.start);
				                                } else {
					                                returnData.data = aaDataCopy.slice(ownData.start, ownData.length + ownData.start);
				                                }
				                                // 测试默认选中
				                                // returnData.data =[[true,1,2],[true,3,4],[false,5,6],[true,6,2],[true,7,4],[false,8,6],[true,9,2],[true,11,4],[false,12,6],[false,13,6],[false,14,6],[false,15,6],[false,16,6],[false,17,6]];

				                                $.each(returnData.data, function (index, value) {

					                                switch (selectOption) {
						                                case 'checkbox':
							                                if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

								                                (value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId]) : "";
								                                value[0] = '<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>';
							                                } else {
								                                value.unshift('<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId - 1] + '"/><label></label></div>');
							                                }

							                                break;
						                                case 'radio':
							                                if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {
								                                __list = [];
								                                (value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId]) : '';
								                                value[0] = '<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '" /><label></label></div>';
							                                } else {
								                                value.unshift('<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId - 1] + '" /><label></label></div>');
							                                }

							                                break;
					                                }


				                                });
				                                callback(returnData);

				                                select(returnData.data);
				                                _success && _success(res);

			                                } else {
				                                returnData.draw = ajaxOption.data.draw;//这里直接自行返回了draw计数器,应该由后台返回
				                                returnData.length = result.PageRows;
				                                returnData.start = result.StartRows;

				                                returnData.recordsTotal = result.recordsTotal || 30;
				                                returnData.recordsFiltered = result.recordsTotal || 30;//后台不实现过滤功能，每次查询均视作全部结果
				                                returnData.data = transformMapToArray(result.data);


				                                if (!returnData.data || $.isArray(returnData.data) && returnData.data.length === 0) {
					                                returnData.data = [];
					                                returnData.recordsTotal = 0;
					                                returnData.recordsFiltered = 0;
				                                } else {
					                                if (ajaxOption.data.PageRows === -1) {//后台不分页,只返回了data
						                                returnData.length = ajaxOption.data.PageRows;
						                                returnData.start = 0;
						                                returnData.recordsTotal = returnData.data.length;
						                                returnData.recordsFiltered = returnData.data.length;//后台不实现过滤功能，每次查询均视作全部结果
					                                } else {//分页，后台只返回data和recordsTotal
						                                returnData.length = returnData.data.length;
						                                returnData.start = ajaxOption.data.start + returnData.data.length;
						                                returnData.recordsTotal = result.recordsTotal || returnData.data.length;
						                                returnData.recordsFiltered = result.recordsTotal || returnData.data.length;
					                                }
				                                }


				                                $.each(returnData.data, function (index, value) {

					                                switch (selectOption) {
						                                case 'checkbox':
							                                if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

								                                (value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId]) : "";
								                                value[0] = '<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>';
							                                } else {
								                                value.unshift('<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId - 1] + '"/><label></label></div>');
							                                }

							                                break;
						                                case 'radio':
							                                if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

								                                (value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId]) : '';
								                                value[0] = '<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>';
							                                } else {
								                                value.unshift('<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId - 1] + '"/><label></label></div>');
							                                }

							                                break;
					                                }

				                                });

				                                //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
				                                //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
				                                callback(returnData);

				                                _success && _success(res);

			                                }
		                                } else if (res.errorMsg) {
			                                returnData.draw = ajaxOption.data.draw;
			                                returnData.data = [];
			                                returnData.recordsTotal = 0;
			                                returnData.recordsFiltered = 0;
			                                callback(returnData);
			                                _success && _success(res);
		                                }

		                                select(returnData.data);

		                                if ((selectOption === "checkbox" || selectOption === "radio") && option.bSateSave) {
			                                selectResult.check(__list);
		                                }

		                                setComplexThead()
	                                };

	                                $.ajax(ajaxOption);
                                }
                            };
                            dataTb = $table.dataTable(option);
                            //select(dataTb.fnGetData());
                        }

                        if (isCloseTitle) {
                            closeRowTitle();
                        }

                        renderCssStyle();
                        // 保留当前页
                        if (option.savePresentPage) {
                            app.performance.shortDelay(function () {
                                self.setPageNum(nowPage);
                            })
                        }
                    };
                    returnValue.getAllPageData = function () {
                        var rows = dataTb.api().rows()[0];
                        return formatRows(rows, aoColumns, dataTb, selectOption);
                    };
                    returnValue.getPageData = function () {
                        var rows = dataTb.api().rows({ page: 'current' })[0];
                        return formatRows(rows, aoColumns, dataTb, selectOption);
                    };
                    returnValue.hide = function () {
                        $selector.addClass('hide');
                    };
                    returnValue.show = function () {
                        $selector.removeClass('hide');
                    };
                    returnValue.display = function (result, input1, input2, condition) {
                        $table[result ? 'addClass' : 'removeClass']('hide')
                    };
                    returnValue.destroy = function () {
                        switch (selectOption) {
                            case 'checkbox':
                            case 'radio':
                                selectResult && selectResult.dispose();
                                break;
                        }
                        if (dataTb && dataTb.fnDestroy) {
                            dataTb.fnDestroy();
                        }
                    };
                    returnValue.setColHighlight = function (data) {
                        var dataMap = data.statusMap, colIdx = data.colIdx, nodData,
                            tableData = dataTb.fnGetData(), i, item;

                        for (i = -1; item = tableData[++i];) {
                            nodData = dataTb.api().cell({ row: i, column: colIdx }).data();
                            dataTb.api().cell({ row: i, column: colIdx }).nodes()[0].style.background = dataMap[nodData];
                        }

                    };
                    returnValue.search = function (data) {
                        var $search =   $(".search-query", $selector),evt;

                        // $search.val(data).trigger('keyup.DT search.DT input.DT paste.DT cut.DT');

                        // if ("createEvent" in document) {
                        //      evt = document.createEvent("HTMLEvents");
                        //     evt.initEvent("change", false, true);
                        //     $search[0].dispatchEvent(evt);
                        // } else{
                        //     $search[0].fireEvent("onchange");
                        // }
                    };
                    returnValue.bCheckState = false;


                    returnValue.bCheckState = option.bCheckState;



                    //储存check数据
                    returnValue.checkResult = [];
                    returnValue.getCheckResult = function () {
                        return this.checkResult;
                    };
                    returnValue.setCheckResult = function () {
                        var i;

                        if (this.checkResult) {
                            for (i = 0; i < this.checkResult.length; i++) {
                                // if(this.checkResult[i].page === this.dataTable.api().page()){
                                $.each(this.checkResult[i].nodes, function (index, item) {
                                    item.node.checked = true;
                                });
                                // }
                            }
                        }

                    };

                    // 2018/3/1获取排序顺序 qitianle
                    returnValue.getSort = function () {
                        return order;
                    };
                    returnValue.setSelectConfig = function (index,config) {

                        columns[index].selectOptions = config;

                    };
                    returnValue.getSelectedResult = returnValue.getSelectedResult || function () {
                        return [];
                    };
                    returnValue.hiddenOperateBtn = function (classArr) {

                        returnValue.hideRowBtns = classArr;
                        upd = false;
                        dataTb._fnDraw();
                        dataTb = $table.dataTable(option);
                        // dataTb._fnReDraw();
                        $(window).trigger('resize');
                    };

                    returnValue.list = returnValue.list || function () {
                        return [];
                    };


                    returnValue.showButton=function(buttonList){
                        if($.isArray(buttonList)){
                            $auiTableWrapper.children('.btn-group').find('#'+buttonList.join(',#')).each(function(){
                                var $this=$(this);

                                if($this.parent().is('li')){
                                    $this.parent().removeClass('hide');
                                }else{
                                    $this.removeClass('hide');
                                }
                            });
                        }
                    };
	                returnValue.hideButton=function(buttonList){
		                if($.isArray(buttonList)){
			                $auiTableWrapper.children('.btn-group').find('#'+buttonList.join(',#')).each(function(){
				                var $this=$(this);

				                if($this.parent().is('li')){
					                $this.parent().addClass('hide');
				                }else{
					                $this.addClass('hide');
				                }
			                });
		                }
	                };
	                returnValue.displayButton=function(buttonList,flag){
	                    returnValue[flag?'hideButton':'showButton'](buttonList);
                    };

                    // renderCssStyle();



                    return returnValue;
                };

            widget.component.AIBSTablesV2 = function ($selector, option, attr, oCss,auiCtx) {
                var $table = $selector.find('table');

                return renderTable($selector,$table, option, attr,oCss, auiCtx);


            };

            return widget;
        });
})();
