/**
 * Created by quanyongxu@agree.com.cn on 2016/8/17 0015.
 */
/*!
 * Javascript library v3.0
 *
 * Date: 2016.08.17
 */

/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", "jquery.dataTables", 'dataTables.fixedColumns.min'], factory);
		}
		// global
		else {
			factory();
		}

	})

	(function ($, widget) {
			"use strict";

			var getButtonsHtml = function (buttons, attrId, auiCtx) {
				var html = [], btnText, iconTmp, temHtml, $button;
				if (buttons) {
					html.push('<div class="gutter-bottom btn-group">');

					$.each(buttons, function (index, value) {
						$button = $('<button id="_id_" type="button" class="btn btn-inverse hvr-radial-out"></button>'.replace(/_id_/, value.id));

						btnText = "<span>_name_</span>".replace(/_name_/, (auiCtx && $AW.nsl(value.name, attrId, auiCtx)) || value.name);

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

						$button.append(temHtml);

						html.push($button.get(0).outerHTML)
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
						if (value.type === 'multiple') {
							multipleIds.push('#' + value.id);
							allIds.push('#' + value.id);
							onlyIds.push('#' + value.id);
						} else if (value.type === 'only') {
							onlyIds.push('#' + value.id);
							allIds.push('#' + value.id);
						}
					});
				}

				return {
					allIds: allIds.join(','),
					multipleIds: multipleIds.join(','),
					onlyIds: onlyIds.join(',')
				}
			},

			 renderTable = function ($selector, $table, option, css, attr, auiCtx) {

				var dataTb, i, item,
					returnValue = {},
					returnColumnIndexes = [],
					aoColumns = [], aoColumnDefs = [], aaData = [], column = [],
					selectResult, columnAsId,
					$auiTableWrapper = $table.closest('.aui-table-template-wrapper'),
					tableID = app.getUID(),
					tableTemplate = '<table data-widget-type="aweb3DataTables" style="width:100%;" class="display dataTable"></table>',
					buttons = option.buttons,
					columns = option.columns.elements || ($.isArray(option.columns) ? option.columns : []),//keys和fields可以在这里取到
					selectOption = option.selectOption,
					isCloseTitle = option.closeTitle,
					currentClickRowData,
					rowBtns = option.rows && option.rows.btns,
					btnColName = option.rows && option.rows.btnColName,

                      renderCssStyle = function() {
                     //自定义样式
                     if (css && css.cssCode && css.cssCode.className) {
                         $selector.addClass(css.cssCode.className)
                     }
                     //样式渲染
                     if (!$.isEmptyObject(css) && css.style) {
                         var style = css.style, checkboxObj, radioObj, cssTemp;
                         style.header && $AW.cssHover('tr td:first-child', $table, style.header, '');
                         style.header && $AW.cssHover('tr th:first-child', $table, style.header, '');
						 /*		$("tr",$table).each(function(){
						  $(this).children("td:first").css(style.header);
						  });*/

                         style.font && $table.css(style.font);
                         style.rowBorder && $AW.cssHover('.dataTable.display tbody td', $table, style.rowBorder, '', true);
						 /*		style.rowBorder && $AW.cssHover('.dataTable.display tbody td',$table,style.rowBorder,':hover',true);*/

                         style.rowColor && $AW.cssHover('.dataTable.display tbody tr.even', $table, style.rowColor, '', true);
						 /*	style.rowColor && $AW.cssHover('.dataTable.display tbody tr.even',$table,style.rowColor,':hover',true);*/

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

                         if (style.thead) {
                             $AW.cssHover('thead tr th', $auiTableWrapper, style.thead, '');
                         }

                     }

                 },
					  showHighlight = function(dataTb, data) {
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


								 if (!$.isEmptyObject(colorMap) && colorMap[item[columnIndex]]) {

									 $(dataTb.fnGetNodes(i)).css(colorMap[item[columnIndex]]);
								 }

							 }
						 }
					 },
					  showRowStatus = function(dataTb, data) {
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

					 },
					  select = function(data) {
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
										 result = [], rowId, i, item;
									 switch (selectOption) {
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
																 cacheRowData.push(rowData[columnIndex]);
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
										 case 'radio':
											 $.each(nodes, function (key, value) {
												 var rowDom = $(value.node).closest('[role="row"]'),
													 rowData = dataTb.fnGetData(rowDom),
													 cacheRowData = [];

												 if (rowData && rowData.length) {
													 $.each(returnColumnIndexes, function (i, columnIndex) {
														 cacheRowData.push(rowData[columnIndex]);
													 });
													 result.push(cacheRowData);
												 }

											 });
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

					 },
					  getClickRowData = function(e, isClass) {
						 var el = e.target || e.srcElement,
							 $target = $(el),
							 $el = $(el).closest('tr'),
							 $tr = $el.closest('tr'),
							 currentRowData;
						 if (isClass) {
							 return $target.attr('class') && $target.attr('class').split(' ')[1];
						 } else {
							 if (option.scrollX && option.fixedColumns && option.fixedColumns.rightColumns) {

								 currentRowData = dataTb.fnGetData($tr.attr('data-dt-row'));
							 } else {
								 currentRowData = dataTb.fnGetData($el);
							 }
							 return currentRowData;
						 }
					 },
					  bindingEven = function(dataTb) {
						 $('tbody', $table).on('click', function (e) {

							 var el = e.target || e.srcElement,
								 $el = $(el).closest('tr'),
								 $tr = $el.closest('tr');

							 if (option.scrollX && option.fixedColumns && option.fixedColumns.rightColumns) {

								 currentClickRowData = dataTb.fnGetData($tr.attr('data-dt-row'));
							 } else {
								 currentClickRowData = dataTb.fnGetData($el);
							 }

						 });
					 };

				columnAsId = (option.columnAsId !== undefined ? option.columnAsId : 1);

				if (option.sDom === '') {
					delete option.sDom;
				}

				if (!option.scrollX) {
					delete option.scrollX;
					delete option.scrollCollapse;
					delete option.fixedColumns;
				} else {
					if (!option.fixedColumns.leftColumns && !option.fixedColumns.rightColumns) {
						delete option.fixedColumns;
					}
					$AW.cssHover('th, td ', $auiTableWrapper, { "white-space": "nowrap" }, '') //解决表头和表体错位问题
				}

				if (option.aMenuLength && option.aMenuLength.length) {
					option.lengthMenu = option.aMenuLength;
				} else {
					option.lengthMenu = [10, 20, 50, 100];
				}
				delete option.aLengthMenu;
				delete option.buttons;
				delete option.columns;
				delete option.selectOption;
				delete option.select;
				delete option.columnAsId;

				option.pagingType = "simple_numbers";


				$auiTableWrapper.find('table').attr('id', tableID);

				//将columns转化为datatable可用的option
				$.each(columns, function (index, value) {

					value.sTitle = value.sTitle || '新建列';
					//对列名称进行国际化翻译
					value.sTitle =  (auiCtx && $AW.nsl(value.sTitle, attr.id, auiCtx)) || value.sTitle;
					aoColumns.push({ sTitle: value.sTitle });
					delete value['sTitle'];
					if (value.isStatus) {
						column.push('status');
						if (index === columnAsId) {
							columnAsId = columnAsId + 1;
						}
					} else {
						column.push('列' + index);
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

						aoColumnDefs.push({ aTargets: [0], bSortable: false, sWidth: '5%' });
						$.each(columns, function (index, value) {
							value.aTargets = [index + 1];
							aoColumnDefs.push(value);

							value.isReturned && returnColumnIndexes.push(index + 1);
						});

						break;

					default:

						$.each(columns, function (index, value) {
							value.aTargets = [index];
							aoColumnDefs.push(value);
						});

						break;
				}


				$.each(new Array(50), function (index, value) {
					var temp = [];
					$.each(column, function (i, v) {
						temp.push('行' + index + v);

					});

					aaData.push(temp);
				});

				$.each(aaData, function (index, value) {

					switch (selectOption) {
						case 'checkbox':
							if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

								(value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId + 1]) : "";
								value[0] = '<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId + 1] + '"/><label></label></div>';
							} else {
								value.unshift('<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>');
							}

							break;
						case 'radio':
							if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

								(value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId + 1]) : '';
								value[0] = '<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId + 1] + '" /><label></label></div>';
							} else {
								value.unshift('<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '" /><label></label></div>');
							}

							break;
					}


				});

				if (rowBtns && rowBtns.length) {
					aoColumns.push({
						sTitle:  (auiCtx && $AW.nsl(btnColName || '操作列', attr.id, auiCtx)) || btnColName || '操作列',
						data: 'btns'
					});
					aoColumnDefs.push({
						aTargets: aoColumnDefs.length,
						bVisible: true,
						sWidth: '10%',
						bSortable: false,
						render: function () {
							var btns = [],
								btnTemplate = "<button  data-role='table-td-btn'  class='table-td-btn _CLASS_' >_NAME_</button>",
								$tableWarp, className, className2;
							$(arguments[3].settings.nTable).addClass('has-op');
							for (i = -1; item = rowBtns[++i];) {
								if (item.DTBtn) {
									className = item.DTBtn;
									className2 = item.selector && item.selector.replace(/./, '');
								} else {
									className = item.selector.replace(/./, '');
								}
								item.name =(auiCtx && $AW.nsl(item.name, attr.id, auiCtx)) || item.name;
								if (item.DTBtn) {
									btns.push(btnTemplate.replace(/_CLASS_/, className + ' ' + className2).replace(/_NAME_/, item.name));
								} else {
									btns.push(btnTemplate.replace(/_CLASS_/, className).replace(/_NAME_/, item.name));
								}

								$tableWarp = $table.closest('.aui-table-content-wrapper');
								$AW.cssHover('.table-td-btn.' + className + '', $tableWarp, item.btnStyle, '');
							}
							return btns.join('');
						},
						uuid: app.getUID()
					});
				}


				option.aoColumnDefs = aoColumnDefs;
				option.aoColumns = aoColumns;

				$auiTableWrapper.html(tableTemplate);
				$table = $auiTableWrapper.find('table');
				$table.attr('id', tableID);

				//添加按钮组
				$auiTableWrapper.prepend(getButtonsHtml(buttons, attr.id, auiCtx, css));
				//添加按钮组和表格的间隙
				$table.wrap('<div class="aui-table-content-wrapper" style="margin-top: 1em"></div>');

				if ( auiCtx) {
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
				}

				if (option.aoColumns.length > 0) {
					option.aaSorting = [];

					if (!!navigator.userAgent.match(/Trident(?!\/7\.0)/i)) {
						option.autoWidth = false;
					} else {
						option.autoWidth = true;
					}
					dataTb = $table.dataTable(option);
					// showHighlight(dataTb, aaData);
					// showRowStatus(dataTb, aaData);
					bindingEven(dataTb);
				}


				returnValue.dataTable = dataTb;
				returnValue.getTargetBtnClass = function (e) {

					var id = getClickRowData(e, true);

					return id;
				};
				returnValue.getCurrentRowData = function (e) {
					var data;

					if (!e) {
						data = currentClickRowData;
					} else {
						data = getClickRowData(e);
					}
					return data;
				};
				returnValue.refresh = function (data) {
					var __list = [],
						tableNodes;
					switch (selectOption) {
						case 'checkbox':
						case 'radio':
							selectResult && selectResult.clear();
							break;
					}
					dataTb.fnClearTable();

					if (data === 'auiAjaxTest') {

						dataTb.fnAddData(aaData);
						showHighlight(dataTb, aaData);
						showRowStatus(dataTb, aaData);
					} else {

						$.each(data, function (index, value) {
							switch (selectOption) {
								case 'checkbox':
									if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

										(value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId + 1]) : "";
										value[0] = '<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId + 1] + '"/><label></label></div>';
									} else {
										value.unshift('<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>');
									}

									break;
								case 'radio':
									if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

										(value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId + 1]) : '';
										value[0] = '<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId + 1] + '" /><label></label></div>';
									} else {
										value.unshift('<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '" /><label></label></div>');
									}

									break;
							}

						});
						if ($.isArray(data) && data.length > 0) {
							dataTb.fnAddData(data);
                            showHighlight(dataTb, data);
                            showRowStatus(dataTb, data);
						}
					}

					if (typeof data !== 'string') {

						select(data);

					}

                    if ((selectOption === "checkbox" || selectOption === "radio" )&& option.bSateSave) {
                        selectResult && selectResult.check(__list);
                    }
					if (isCloseTitle) {
						tableNodes = dataTb.fnGetNodes();
						$(tableNodes).removeAttr('title');
					}
					renderCssStyle();
                    bindingEven(dataTb);
				};
				returnValue.refreshFromServer = function (ajaxOption) {
					var validateResult, tableNodes,
						_success = ajaxOption.success,
						_data = ajaxOption.data,

						__list = [];

					ajaxOption = $.extend(true, {}, ajaxOption);

					if ((validateResult = app.validate(_data,
						ajaxOption.validateSuccessCallback,
						ajaxOption.validateErrorCallback,
						ajaxOption.validateCleanCallback,
						ajaxOption.validateContinue,
						ajaxOption.validate)) && validateResult.result) {
						option.bServerSide = true;
						option.bProcessing = true;

						option.ajax = function (ownData, callback, settings) {
							var ajaxData = {},
								list = selectResult && selectResult.list() || [];

							if ((validateResult = app.validate(_data,
									ajaxOption.validateSuccessCallback,
									ajaxOption.validateErrorCallback,
									ajaxOption.validateCleanCallback,
									ajaxOption.validateContinue,
									ajaxOption.validate)) && validateResult.result) {

								validateResult.data = validateResult.data || [];
								$.each(validateResult.data, function (index, value) {
									ajaxData[value.name] = value.value;
								});
								ajaxData.length = dataTb.fnSettings()._iDisplayLength;

								ajaxOption.data = $.extend(true, {}, ownData, ajaxData);

								ajaxOption.data.search = JSON.stringify(ajaxOption.data.search);

								ajaxOption.success = function (res) {
									var returnData = {};

									if (res.status) {
										//封装返回数据，这里仅演示了修改属性名
										var result = res.content.result;
										if (result === 'auiAjaxTest') {
											returnData.draw = ownData.draw;//这里直接自行返回了draw计数器,应该由后台返回
											returnData.recordsTotal = aaData.length;
											// returnData.length = dataTb.fnSettings()._iDisplayLength;
											returnData.recordsFiltered = aaData.length;//后台不实现过滤功能，每次查询均视作全部结果
											returnData.data = aaData.slice(0, ownData.length);

											select(returnData.data);

											callback(returnData);

											_success && _success(res);
										} else {
											returnData.draw = ajaxOption.data.draw;//这里直接自行返回了draw计数器,应该由后台返回
											returnData.recordsTotal = result.recordsTotal;
											returnData.length = result.length || dataTb.fnSettings()._iDisplayLength;
											returnData.recordsFiltered = result.recordsFiltered;//后台不实现过滤功能，每次查询均视作全部结果
											returnData.data = result.data;

											if (!returnData.data) {
												returnData.data = [];
												returnData.recordsTotal = 0;
												returnData.recordsFiltered = 0;
											}

											$.each(returnData.data, function (index, value) {

												switch (selectOption) {
													case 'checkbox':
														if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

															(value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId + 1]) : "";
															value[0] = '<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId + 1] + '"/><label></label></div>';
														} else {

															value.unshift('<div class="table-select-btn checkbox"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>');
														}

														break;
													case 'radio':
														if (value[0] === 'true' || value[0] === 'false' || value[0] === true || value[0] === false) {

															(value[0] === 'true' || value[0] === true) ? __list.push(value[columnAsId + 1]) : '';
															value[0] = '<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId + 1] + '"/><label></label></div>';
														} else {
															value.unshift('<div class="table-select-btn radio"><input name="' + tableID + '" type="' + selectOption + '" id="' + value[columnAsId] + '"/><label></label></div>');
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
										returnData.draw = ajaxOption.data.draw;//这里直接自行返回了draw计数器,应该由后台返回
										returnData.recordsTotal = 0;
										returnData.recordsFiltered = 0;//后台不实现过滤功能，每次查询均视作全部结果
										returnData.data = [];
										callback(returnData);
										_success && _success(res);
									}

									select(returnData.data);

									if ((selectOption === "checkbox" || selectOption === "radio" )&& option.bSateSave) {
										selectResult.check(list);
									}
								};


								$.ajax(ajaxOption);
							}
						};


						dataTb = $table.dataTable(option);

						// if (selectOption === "checkbox" || selectOption === "radio") {
						// 	selectResult.check(__list);
						// }
						if (isCloseTitle) {
							tableNodes = dataTb.fnGetNodes();
							$(tableNodes).removeAttr('title');
						}
						renderCssStyle();
					}

				};
				// 2018/2/2 增加获取表格页信息，跳转到某页功能
				returnValue.getPageNum = function () {
					return this.dataTable.api().page() + 1;
				};
				returnValue.setPageNum = function (num) {
					$('.paginate_button', $selector).eq(parseInt(num, 10)).trigger('click');
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

				returnValue.bCheckState = !!option.bCheckState;

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
				returnValue.display = function (result, input1, input2, condition) {
                    $selector[result ? 'addClass' : 'removeClass']('hide')
				};
				returnValue.hide = function () {
                    $selector.addClass('hide');
				};
				returnValue.show = function () {
                    $selector.removeClass('hide');
				};


				returnValue.getSelectedResult = returnValue.getSelectedResult || function () {
					return [];
				};

				returnValue.list=returnValue.list||function() {
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

				return returnValue;
			};

			widget.component.dataTables = function ($selector, option, attr, css,auiCtx) {

                var $table = $selector.find('table');

				return renderTable($selector, $table, option, css, attr, auiCtx);


			};

			return widget;
	});
})();