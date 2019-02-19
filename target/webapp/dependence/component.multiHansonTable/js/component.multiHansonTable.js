(function (undefined) {

	(function (factory) {
		"use strict";

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", "Handsontable"/*,其他脚本文件名称请在这里填写，如'echarts'*/], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget, Handsontable /*,其他脚本文件对外暴露接口请在这里填写，如'charts'*/) {
		"use strict";
		
		var Component = function (widgetIns, $widget, option, attr, css, auiCtx, cache) {
			var context = this;
			context.widgetIns = widgetIns;
			context.$view = $widget;
			context.option = option;
			context.attr = attr;
			context.css = css;
			context.pageContext = auiCtx;
			//初始化
			context._init();
			//渲染样式
			context._render();
			//绑定事件
			context._listen();
		};

		Component.prototype = Component.fn = {
				constructor: Component,
				version: 'AWOS 4.4 YuQ',
				author: 'qq',

				//初始化（私有）
				_init: function () {
					var $widget = this.$view,
						widgetIns = this.widgetIns,
						auiCtx = this.pageContext,
						attr = this.attr,
						option = this.option,
						html = [],
						data = [], colHeaders = [], columns = [], colWidths = [], buttons = [], closeTable = [], removeRow,
						height, rowHeaders = true, tableTem, i,item, cache = {}, that = this,
						cantData = [];//设置不可见数据

					// 清空上次数据
					$widget.empty();
					// 配置临时数据
					data = [
						{
							col: '行0列0',
							cols: '行0列1',
							col3: '行0列2',
							col4: '行0列3'
						}
					];

					if (option) {
						cache = {};
						if (option.tableList && option.tableList.length) {
							for (tableTem = 0; tableTem < option.tableList.length; tableTem++) {
								if (option.tableList[tableTem].tableName) {
									cache[option.tableList[tableTem].tableName] = {

									};
									//表格下拉框
									// selectHTML += '<option value ="' + option.tableList[tableTem].tableName + '">' + option.tableList[tableTem].tableName + '</option>';
									colHeaders = [], columns = [], colWidths = [], buttons = [];
									if (option.tableList[tableTem].col.fields && option.tableList[tableTem].col.fields.length) {
										colHeaders = option.tableList[tableTem].col.fields;
									} else {
										colHeaders = ["新建列1", "新建列2", "新建列3", "新建列4"];
									}

									// 配置时 或 运行时，对 列头名称 进行国际化
									for ( i = -1; item = colHeaders[++i];) {
									    item = (widgetIns && widgetIns.nsl(item)) || $AW.nsl(item, attr.id, auiCtx);
									    colHeaders[i] = item;
									}

									rowHeaders = option.tableList[tableTem].rowHeaders || false;
									// 循环配置项设置列头
									if (option.tableList[tableTem].col.keys && option.tableList[tableTem].col.keys.length) {
										$(option.tableList[tableTem].col.keys).each(function (index, item) {
											var obj = {};
											obj.data = item;
											columns.push(obj);
										})
									} else {
										columns = [
											{
												data: 'col'
											},
											{
												data: 'cols'
											},
											{
												data: 'col3'
											},
											{
												data: 'col4'
											}
										]
									}
									// 添加checkbox
									if (option.tableList[tableTem].selectOption) {
										switch (option.tableList[tableTem].selectOption) {
											case "checkbox":
												// colHeaders.unshift("<input data-id='titleCheckbox' type='checkbox' style='margin:0 100px 0 0;opacity:1'/>");
												colHeaders.unshift("");
												columns.unshift({ data: "checkbox", type: 'checkbox', readOnly: false });
												colWidths.push(50);
												break;

										}
									}
									// 配置列宽
									if (option.tableList[tableTem].col.elements && option.tableList[tableTem].col.elements.length) {
										for (i = 0; i < option.tableList[tableTem].col.elements.length; i++) {
											colWidths.push(parseInt(option.tableList[tableTem].col.elements[i].width),10)
										}
									} else {
										for (i = 0; i < 4; i++) {
											colWidths.push(200)
										}
									}

									// 按钮与关闭按钮
									if (option.tableList[tableTem].buttons) {
										buttons.push(option.tableList[tableTem].buttons)
									} else {
										buttons.push('')
									}

									if (option.tableList[tableTem].closeTable) {
										closeTable.push(option.tableList[tableTem].closeTable || false);
									}



									cache[option.tableList[tableTem].tableName] = {
										data: data,
										col: columns,
										colWidths: colWidths,
										cantData: cantData,
										colHeaders: colHeaders,
										rowHeaders: rowHeaders,
										buttons: buttons,
										closeTable: closeTable,
										removeRow: option.tableList[tableTem].removeRow || false,
										height: parseInt(option.tableList[tableTem].hotHeight,10)|| 200,
										instance: {

										},
										tableHTML: ""
									};

									this.cache = cache;
								}
							}
						}
					}


					//使用$.fn.off().empty().append(html)可以避免调用$.fn.html(html)时导致的内存泄漏。
					if (cache) {
						var html = [], button = '', closeTableHtml = '', ht_master, k, tableLength = 0,selectOpt = '';
						// 添加下拉框
						// selectOpt  ="</div>" +
						// 			"<div class='columns'><div class='input-group'>" +
						// 			"<select data-id ='selectOpt'>" + selectHTML +"</select><div class='form-error-arrow'></div><label class='form-error-msg'></label></div>" ;
						// $widget.prepend(selectOpt);
						// $widget.prepend('<select data-id = "selectOpt">' + selectHTML + '</select>');

						// 循环配置项渲染
						$.each(cache, function (index, value) {
							var i, sum = 0;
							tableLength++;

							// 保存dom
							cache[index].tableHTML = '<div class="hot' + index + '" table-index = "' + index + '""><div class="hotBtn"></div><div class="closeTable"></div></div>';
							if (tableLength > 1) {
								return;
							}
							// 按钮和关闭表格按钮
							if (value.buttons) {
								button = that.getButtonsHtml(value.buttons[0]);

							}
							if (value.closeTable) {
								closeTableHtml = that.getCloseTableHtml();
							}
							$widget.append(cache[index].tableHTML);
							cache[index].instance = new Handsontable($('.hot' + index, $widget)[0],
								{
									data: value.data,
									colHeaders: value.colHeaders,
									columns: value.col,
									colWidths: value.colWidths,
									height: parseInt(value.height,10) || 200,
									rowHeaders: value.rowHeaders,
									copyable: true,

									columnSorting: true,
									autoColumnSize: true,
									fixedRowsTopNumber: true

								}

							);

							$('.hot' + index + ' .closeTable', $widget)
								// .empty()
								.append(closeTableHtml);
							// 添加宽度
							$('.hot' + index + ' .ht_master .wtHolder', $widget)
								//使用empty方法释放DOM对象的内存
								// .empty()
								//安全添加html元素
								.append(button);
							if (value.colWidths) {
								for (i = 0; i < value.colWidths.length; i++) {
									sum += value.colWidths[i];
								}
								sum >= 1000 ? sum = 1000 : true;
								$('.hot' + index, $widget).css({
									width: sum + 200,
									'backgroundColor': 'rgb(242, 242, 242)',
									'margin': "20px 0 20px 0",
									'border': '2px solid rgb(242, 242, 242)',
									'borderRadius': '5px',
									'position': 'relative'

								});
							}
							Handsontable.hooks.add('afterSelectionEnd', function () {
								// 储存选中的行列

								if (cache[index].instance) {
									cache[index].sumData = that.sums(index);
								}
							}, cache[index].instance);
							// 更新高度
							Handsontable.hooks.add('afterCreateRow', function () {
								var height = parseInt($('.htCore tbody th', that.$view).height(), 10),
									rowNum = cache[index].instance.countRows();
								if (height * (rowNum + 1) + 128 > parseInt(cache[index].height, 10) || 200){
									cache[index].instance.updateSettings({
										height: height * (rowNum + 1) + 128
									});
								}
								
								
							}, cache[index].instance);
							Handsontable.hooks.add('afterRemoveRow', function () {
								var height = parseInt($('.htCore tbody th', that.$view).height(), 10),
									rowNum = cache[index].instance.countRows();
								if (height * (rowNum + 1) + 128 > parseInt(cache[index].height, 10) || 200) {
									cache[index].instance.updateSettings({
										height: height * (rowNum + 1) + 128
									});
								}
								
							}, cache[index].instance);
							// 添加移除行按钮

							if (value.removeRow) {
								cache[index].rowHeaders ? true : sum -= 50;
								that.getRemoveRowHtml(data.length, sum, index, $widget);
							}
				


						});

					}



				},

				//事件绑定（私有）
				_listen: function () {
					//绑定事件，推荐使用事件冒泡
					//这里绑定的事件一定不能与业务逻辑有关的，否则应该在“事件配置”中定义
					var $widget = this.$view, that = this;
					$widget
						//解绑上次的事件
						.off()
						//绑定事件
						.on({

							'dblclick.table': function (e) {

							},
							//example,获取点击a标签的id
							//事件-->触发范围 ###_ID## a，接口-->查看接口getter配置
							'click.table': function (e) {
								var
									$target = $(e.target || event.srcElement),
									tableName = '';
								if ($target.attr('class') && $target.attr('class').indexOf('closeTable') !== -1) {
									tableName = $target.closest('.htColumnHeaders').attr('table-index');

									that.cache[tableName].instance.destroy();
									that.cache[tableName].instance = {};
									$('.hot' + tableName).remove();
								}

							},
							'click.remove': function (e) {
								var
									$target = $(e.target || event.srcElement),
									data = [], i, length = 0, width = 0,
									tableName = '';
								if ($target.attr('class') && $target.attr('class').indexOf('removeRow') !== -1) {

									that.cache[$target.attr('table-name')].instance.deselectCell();
									that.removeRow({
										tableName: $target.attr('table-name'),
										removeArr: [parseInt($target.attr('row-index'),10)]
									});
									data = that.cache[$target.attr('table-name')].instance.getData();
						
									if (data && data.length) {
										for (i = 0; i < data[0].length; i++) {
											width = that.cache[$target.attr('table-name')].instance.getColWidth(i);
											length += width || 200;
										}
									}
									if(!that.cache[$target.attr('table-name')].rowHeaders){
										length -= 50;
									}
									that.getRemoveRowHtml(data.length, length, $target.attr('table-name'));
								}

							},
							'click.btn': function (e) {
								var
									$target = $(e.target || event.srcElement);
								if ($target.attr('btn_func')) {
									switch ($target.attr('btn_func')) {
										case 'addRow':

											that.addRow({
												tableName: $target.attr('btn_tableName')
											});
											break;
										case 'addCol':
											that.addCol({

												tableName: $target.attr('btn_tableName')

											});
											break;
										case 'clearData':
											that.clearData($target.attr('btn_tableName'));
									}
								}
							},
							'change.selectTable': function (e) {
								var
									$target = $(e.target || event.srcElement);

								if ($target.attr('data-id') && $target.attr('data-id') === 'selectOpt') {
									if (!$widget.find('.hot' + $target.val()).length) {
										// 当选中时实例化一个表格

										that.cache[$target.val()].instance  = that._initHot($target.val());

									}

								}

							}
						});
				},

				//渲染主题、样式（私有）
				_render: function () {
					var $widget = this.$view,
						css = this.css,
						style;

                    //自定义样式
                    if(css && css.cssCode && css.cssCode.className){
                        $widget.addClass(css.cssCode.className)
                    }
					//css样式配置渲染
					if (css && css.theme) {
						//如果组件配置了类名主题，则要同时将类名加到组件相应位置上去
                        /*
                         * 如 ：if(css.theme['function']){
                             $button.removeClass().addClass('btn ' + css.theme['function']);
                         }*/
					}

					if (css && (style = css.style)) {
						//1.直接拿到样式内容和选择器，利用jq的css()渲染配置样式
						//2.利用 $AW.cssHover(select,$selector,content,pseudo)方法生成虚拟渲染样式，他将在组件dom结构后面插入内联样式，直接覆盖外联样式表里面的样式。
						// 如：   $AW.cssHover('input.input-group-field',$selector,style.inputActive,':active');
                        /*
                         select：样式对应的选择器，如‘input.input-group-field’
                         $selector:组件操纵对象或组件选择器
                         content:css样式配置的内容
                         pseudo:伪类、伪元素,动态类名，如‘:hover\:focus\.btn-hover’.如果只想添加虚拟样式，可以直接传入 ‘’ 空字符串。
                         */

						style.table && table.css(style.table);
					}

				},
				//私有方法
				//更新高度
				updateHeight:function(index){
                    var height = parseInt($('.htCore tbody tr', this.$view).height(), 10),
                        rowNum = this.cache[index].instance.countRows();
                    if (height * (rowNum + 1) + 128 > parseInt(this.cache[index].height, 10) || 200){
                        this.cache[index].instance.updateSettings({
                            height: height * (rowNum + 1) + 128
                        });
                    }
				},
				//储存点击时数据
				sums: function (tableName) {
					var i, j, res = {}, obj,
						//设置行列位置
						rowNum = 0, colNum = 0, colName,
						colAdd = true, rowAdd = true,
						range = {}, colLen, rowLen, cache = this.cache[tableName];

					range = cache.instance.getSelectedRange();

					if (cache) {
						cache.range = range;
					}

					// 循环长度
					if (range) {
						rowLen = Math.abs(range[0].to.row - range[0].from.row);
						colLen = Math.abs(range[0].to.col - range[0].from.col);
						// 循环开始位置
						colNum = range[0].from.col;
						rowNum = range[0].from.row;
						// 判断上下左右位置
						colAdd = range[0].to.col >= range[0].from.col ? true : false;
						rowAdd = range[0].to.row >= range[0].from.row ? true : false;
						// 设置返回数据
						res.from = range[0].from;
						res.to = range[0].to;
						res.data = [];
						for (i = 0; i <= rowLen; i++) {
							colNum = range[0].from.col;
							for (j = 0; j <= colLen; j++) {

								colName = (cache || []).col[colNum].data;
								obj = {
									val: cache.instance.getDataAtCell(rowNum, colNum),
									row: rowNum,
									col: colNum,
									colName: colName
								};

								res.data.push(obj);
								colAdd ? colNum++ : colNum--;
							}
							rowAdd ? rowNum++ : rowNum--;
						}

						return res;
					}
					return null;
				},
				// 加载删除按钮
				getRemoveRowHtml: function (k, sum, tableName) {

					var removeRow , i,$widget = this.$view,
						html = '', cssStr = '', removeStr = '',height = 25,rowHeightTop = 2,rowHeightBottom = 7;
                    height = $('table.htCore thead tr',$widget).height();

                    rowHeightTop = rowHeightBottom =  $('table.htCore tbody tr',$widget).height()-17;
					removeRow =  $('.hot' + tableName, $widget).find('.ht_master .wtSpreader');
					// 清空
					$('.hot' + tableName + ' .rowmoveRowFather', $widget).remove();
					cssStr = ' top: '+height+'px;left: ' + parseInt(sum + 60,10) + 'px;position: absolute;height: auto;width: 18px;';
					// removeStr = 'width:16px;height:16px;text-align:center;z-index:5;margin:'+(rowHeightTop+2)+'px 0 0px 0';
                    removeStr = 'width:16px;height:16px;text-align:center;z-index:5;margin:0 0 '+rowHeightTop+'px 0';
					html = $('<div style = "' + cssStr + '" class = "rowmoveRowFather"></div>');

					for (i = 0; i < k; i++) {
						html.append('<div style = "' + removeStr + '" class = "removeFather"> <i data-widget-type="aweb4Icon" class="fa fa-minus-circle removeRow" row-index = ' + i + ' table-name = "' + tableName + '" style = "font-size:15px"></i></div>');
					}
					removeRow.append(html.eq(0));

				},
				// 加载关闭表格按钮
				getCloseTableHtml: function () {
					var
						html = [], cssStr = 'position:absolute;right:0;top:0;border:1px solid #8e8e8e;border-radius:50%;width:21px;height:21px;text-align:center;z-index:5';
					html.push('<div style = "' + cssStr + '"><i data-widget-type="aweb4Icon" id="icon5" class="iconfont icon-topbar-close closeTable" style="font-size: 14px;"></i></div>');
					return html;
				},
				// 加载按钮组按钮
				getButtonsHtml: function (buttons) {
					var html = [],that = this,$widget = this.$view, widgetIns = this.widgetIns, auiCtx = this.pageContext, attr = this.attr;
					if (buttons) {
					
						html.push('<div class="gutter-bottom btn-group">');

						$.each(buttons, function (index, value) {
							if (value.isDropdown) {

								html.push([
									'<div class="btn-group" style="display: inline-block;">',
									'<button type="button" class="btn btn-focus hvr-radial-out dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style =  "background-color:#8e8e8e">',
									'_name_ <span class="caret"></span>',
									'</button>',
									'<ul class="dropdown-menu">'
								].join('').replace(/_name_/, value.name));

								value.dropDownOption && $.each(value.dropDownOption, function (index, value) {
									if (value.isSeparator) {
										html.push('<li role="separator" class="divider"></li>');
									} else {
										html.push('<li><button class="btn" id="_id_">_name_</button></li>'
											.replace(/_id_/, value.id)
											.replace(/_name_/, value.name));
									}
								});

								html.push('</ul></div>');

							} else {
								html.push('<button id="_id_" type="button" class="btn btn-focus hvr-radial-out" style =  "background-color:#8e8e8e;margin:10px 0 0 50px" btn_func = "_func_" btn_tableName = "_tableName_">_name_</button>'
									.replace(/_id_/, value.id)
									.replace(/_name_/, (widgetIns && widgetIns.nsl(value.name)) || $AW.nsl(value.name, attr.id, auiCtx))
									.replace(/_func_/, value.btnFunc||"")
									.replace(/_tableName_/,value.tableName||""));
								
							}
						});

						html.push('</div>');
						return html.join('');
					} else {
						return '';
					}
				},
				selected: function() {
					var obj = {};
					if (this.cache.instance.getSelected()) { //this.cache.instance.getSelected()表示handsontable选择器
						obj.row = this.cache.instance.getSelected()[0]; //表示获取选中的某一行
						obj.column = this.cache.instance.getSelected()[1];//表示获取选中的某一行中的某一行的单元格地址
						return obj;
					}

				},
				// 初始化表格
				_initHot: function (tableName) {
					var
						button, closeTableHtml, sum = 0,item, i,l, 
						$widget = this.$view, 
						widgetIns = this.widgetIns,
						attr = this.attr,
						auiCtx = this.pageContext,
						that = this,instance = null,colHeaders;
					
					// 按钮和关闭表格按钮
					if (this.cache[tableName].buttons) {
						button = this.getButtonsHtml(this.cache[tableName].buttons[0]);

					}
					if (this.cache[tableName].closeTable) {
						closeTableHtml = this.getCloseTableHtml();
					}
					$widget.append(this.cache[tableName].tableHTML);

						
					

					//2018-2-1 xieyirong 更新 colHeaders 判断 string 切割成数组 功能
					colHeaders = this.cache[tableName].colHeaders;
					if (typeof colHeaders === 'string') {
						this.cache[tableName].colHeaders = colHeaders.split(',');
						colHeaders = this.cache[tableName].colHeaders;
					}

					//设置完数据，在初始化表格时对 colHeaders 中每个列名名称进行国际化翻译
					for ( i = -1; item = colHeaders[++i];) {
						this.cache[tableName].colHeaders[i] = (widgetIns && widgetIns.nsl(item)) || $AW.nsl(item, attr.id, auiCtx);
					}

					this.cache[tableName].instance = instance = new Handsontable($('.hot' + tableName, $widget)[0],
						{
							data: this.cache[tableName].data,
							colHeaders: this.cache[tableName].colHeaders,
							columns: this.cache[tableName].col,
							colWidths: this.cache[tableName].colWidths || 200,
							height: parseInt(this.cache[tableName].height,10) || 200,
							rowHeaders: this.cache[tableName].rowHeaders,
							copyable: true,
							contextMenu: false,
							columnSorting: true,
							autoColumnSize: true,
							fixedRowsTopNumber: true

						}

					);

					if (this.cache[tableName].firstDef){

					}
					
					
					
					// this.cache[tableName].instance.alter('remove_col', 0, 1, this.cache[tableName].instance.getSourceDataAtCol(5));
					$('.hot' + tableName + ' .closeTable', $widget)
						// .empty()
						.append(closeTableHtml);
					// 添加宽度
					$('.hot' + tableName + ' .ht_master .wtHolder', $widget)
						//使用empty方法释放DOM对象的内存
						// .empty()
						//安全添加html元素
						.append(button);

					if (this.cache[tableName].colWidths) {
						if (typeof this.cache[tableName].colWidths === 'number') {
							for (i = 0; i < this.cache[tableName].colHeaders.length; i++) {
								sum += this.cache[tableName].colWidths;
							}
						} else {
							for (i = 0; i < this.cache[tableName].colHeaders.length; i++) {
								sum += this.cache[tableName].colWidths[i]||200;
							}
						}

						sum >= 1000 ? sum = 1000 : true;
						$('.hot' + tableName, $widget).css({
							width: sum + 200,
							'backgroundColor': 'rgb(242, 242, 242)',
							'margin': "20px 0 20px 0",
							'border': '2px solid rgb(242, 242, 242)',
							'borderRadius': '5px',
							'position': 'relative'

						});
					}
				
					Handsontable.hooks.add('afterSelectionEnd', function () {
						// 储存选中的行列

						if (instance) {
							that.cache[tableName].sumData = that.sums(tableName);
						}
					}, instance);
				
					// 更新高度
					Handsontable.hooks.add('afterCreateRow', function () {
						that.updateHeight(tableName);
					}, instance);
					// 更新高度
					Handsontable.hooks.add('afterRemoveRow', function () {
                        that.updateHeight(tableName);
					}, instance);
					// 添加移除行按钮
                    this.updateHeight(tableName);
					if (this.cache[tableName].removeRow) {
						this.cache[tableName].rowHeaders ? true : sum -= 50;
						this.getRemoveRowHtml(this.cache[tableName].data.length, sum, tableName);
					}
					return instance;
				},
                /*
                    *   @pause 页面切出接口
                    *
                    *   配置：
                    *       接口-->
                    *           中文名：暂停
                    *           英文名：pause
                    *           类型：无参数接口
                    *           详情：当由当前页面切换到其他页面时，组件提供的可调用接口，该接口组件用于停止组件实例某些消耗性能的监听或轮询
                    *           调用接口可以在：切出操作
                    * */
                pause:function(){},

                /*
                 *   @resume 页面切入接口
                 *
                 *   配置：
                 *       组件接口-->
                 *           中文名：恢复
                 *           英文名：resume
                 *           类型：无参数接口
                 *           详情：当由其他页面到当前页面切换时，组件提供的可调用接口，该接口组件用于恢复组件实例某些消耗性能的监听或轮询
                 *           调用接口可以在：切入操作
                 * */
                resume:function(){},

                /*
                 *   @destroy 销毁组件实例
                 *
                 *   配置：
                 *       组件接口-->
                 *           中文名：销毁
                 *           英文名：destroy
                 *           类型：无参数接口
                 *           详情：当关闭当前页面时，组件提供的销毁组件实例接口，一旦在"接口"配置中配置，页面关闭时，将自动调用
                 *           调用接口可以在：销毁操作
                 * */
                destroy: function () {
                    var res = [], that = this;
                    if (this.cache) {

                        $.each(this.cache, function (index, item) {
                            if (that.cache[index].instance.getData) {
                                that.cache[index].instance.destroy();
                                that.cache[index] = {};
                            }
                        });
                    }
                    this.$view.off().empty();
                },


                /*
                 *   @getter 获取组件实例的某些数据
                 *
                 *   配置：
                 *       组件接口-->
                 *           中文名：获取选中行内容
                 *           英文名：getRow
                 *           类型：取值器
                 *           详情：当点击单元格时，返回单元格内容
                 *           是否有出参：是
                 *           出参：
                 *              中文名：单元格内容
                 *              英文名：data
                 *              类型：字符串（根据实际情况而定）
                 * */
				// getRow: function () {
				// 	var row, i, num = [], $widget = this.$view,
				// 		rowData = {
				// 			data: [],
				// 			rowNum: []
				// 		},
				// 		obj;
				// 	row = $('input[tabindex=-1][checked = "checked"]', this.$view);
				//
				// 	return row;
                //
				// },

				sumCell: function (tableName) {
					var res = {};

					res = this.cache[tableName].sumData;
					// 清空上次数据
					this.cache[tableName].sumData = {};

					return res || {};
				},
				getAllData: function(){
					var res = [],that = this;
					if(this.cache){
					
						$.each(this.cache,function(index,item){
							
							if (that.cache[index].instance.getData){
								res.push({
									tableName:index,
									data: that.cache[index].instance.getData()
								});
							}else{
								res.push({
									tableName: index,
									data: that.cache[index].data
								})
							}
						});
					}
					return res;
				},
                /*
                 *   @setter 赋值器
                 *       @value      Object      输入值
                 *   配置：
                 *       组件接口-->
                 *           中文名：设置组件链接列表
                 *           英文名：setLinkList
                 *           类型：赋值器
                 *           详情：该接口用于设置组件链接列表
                 *           调用接口可能需要发起异步请求：可能需要
                 *           入参：
                 *              中文名：链接列表
                 *              英文名：linkList
                 *              类型：数组（根据实际情况而定）
                 *                  子元素1：
                 *                      中文名：链接项
                 *                      类型：对象
                 *                      子元素1：
                 *                          中文名：链接项名称
                 *                          英文名：name
                 *                          类型：字符串
                 *                          示例值：链接项1
                 *                      子元素2：
                 *                          中文名1：链接项href
                 *                          英文名：href
                 *                          类型：字符串
                 *                          示例值：id1
                 * */
				setTableList: function (tableList) {
					var
						//中间变量
						i, j, k, l, item, length = 0, ilem, width, sum = 0, closeTableHtml = '',
						col, temp = '', cache = this.cache||{}, tem,
						$widget = this.$view, _this = this,
						selectHTML = '', tableHTML = [],colWidth = [];
					//清空上次的内容

					if (tableList === 'auiAjaxTest') {
						//此处为 AWEB IDE 下 异步传输数据测试信号
					} else if (tableList && tableList.length) {//校验输入数据
						length = 0;
						for (i = 0; i < tableList.length; i++) {
							// 已经定义该列表

							if (cache && cache[tableList[i].tableName]) {

 								// this.cache[tableList[i].tableName].instance.updateSettings({
								// 	data: tableList[i].data,
								// 	columns: this.cache[tableList[i].tableName].col,
								// 	height: tableList[i].hotHeight
								// })

								this.cache[tableList[i].tableName].data = tableList[i].data;

								this.cache[tableList[i].tableName].col = tableList[i].columns||this.cache[tableList[i].tableName].col;
                                this.cache[tableList[i].tableName].colHeaders =tableList[i].colHeaders ||this.cache[tableList[i].tableName].colHeaders;
								this.cache[tableList[i].tableName].hotHeight = tableList[i].hotHeight;
								// 添加移除行按钮

								// for (l = 0; l < this.cache[tableList[i].tableName].col.length; l++) {
								// 	length += this.cache[tableList[i].tableName].instance.getColWidth(l) || tableList[i].colWidths[l] || 200;

								// }
								// if (this.cache[tableList[i].tableName].removeRow) {


								// 	getRemoveRowHtml(tableList[i].data.length, length, tableList[i].tableName, $widget)
								// }
                                this.cache[tableList[i].tableName].instance.destroy();
                                this.cache[tableList[i].tableName].instance = {};
                                //
                                $('.hot' + tableList[i].tableName).remove();
                                // 调试时取消下面调用_initHot的代码的注释，完成调试时加上注释
								// this._initHot(tableList[i].tableName);

							} else {//没有定义列表
								cache[tableList[i].tableName] = {};
								if (!tableList[i].colWidths) {
									for (k = 0; k < tableList[i].columns.length; k++) {
										colWidth.push(200);
									}
									if (tableList[i].checkbox) {
										colWidth.unshift(50);
								
										// tableList[i].colHeaders.unshift("<input data-id='titleCheckbox' type='checkbox'  />");
										tableList[i].colHeaders.unshift("");
										tableList[i].columns.unshift({ data: "checkbox", type: 'checkbox', readOnly: false });
									}
								}
								cache[tableList[i].tableName] = {
									data: tableList[i].data,
									col: tableList[i].columns,
									colWidths: colWidth,
									cantData: tableList[i].cantData || [''],
									colHeaders: tableList[i].colHeaders || true,
									rowHeaders: tableList[i].rowHeaders || false,
									buttons: tableList[i].buttons || [],
									closeTable: tableList[i].closeTable || [],
									removeRow: tableList[i].removeRow|| true,
									instance: {

									},
									firstDef:true
								};
								
								cache[tableList[i].tableName].tableHTML = '<div class="hot' + tableList[i].tableName + '" table-index = "' + tableList[i].tableName + '"><div class="hotBtn"></div><div class="closeTable"></div></div>';
								length = 0;
								
								for (k = 0; k < tableList[i].columns.length; k++) {
									length += tableList[i].colWidths ? tableList[i].colWidths[i] : 200;
								}
								this.getRemoveRowHtml(tableList[i].data.length, length, tableList[i].tableName);
								$('[data-id = "selectOpt"]', $widget).append('<option>' + tableList[i].tableName + '</option>');
								this.cache = cache;
								// 调试时取消下面调用_initHot的代码的注释，完成调试时加上注释
								// this._initHot(tableList[i].tableName);
							}


						}
					}

				},
                /*
                 *   @addRow 增加一行
                 *       @value      Array      输入值
                 *   配置：
                 *       组件接口-->
                 *           中文名：增加一行数据
                 *           英文名：addRow
                 *           类型：赋值器
                 *           详情：该接口用于增加一行数据
                 *           调用接口可能需要发起异步请求：不需要
                 *
                 * */
				addRow: function (rowInfo) {
					var index = null, i, j, k, l;


					if (rowInfo) {
					
						var data = this.cache[rowInfo.tableName].instance.getData(), width = [],length;
						width = 0;
						length = 0;
						if (rowInfo.rowIndex >= 0) {
							index = rowInfo.rowIndex;
						}

						this.cache[rowInfo.tableName].instance.alter('insert_row', parseInt(index, 10));

					
						if (rowInfo.data && rowInfo.data.length) {

							index = parseInt(index,10) || data.length - 1;
							data.splice(index, 0, rowInfo.data);
							// 重设数据
							for (i = 0; i < data.length; i++) {
								for (j = 0; j < data[i].length; j++) {
									if (this.option.selectOption === 'checkbox' && i === data.length - 1 && j === 0) {
										this.cache[rowInfo.tableName].instance.setDataAtCell(i, j, false);
										continue;
									}

									this.cache[rowInfo.tableName].instance.setDataAtCell(i, j, data[i][j]);
								}


							}

						}
						if( data[0]){
                            for (l = 0; l < data[0].length; l++) {
                                width = this.cache[rowInfo.tableName].instance.getColWidth(l);

                                length += width || 200;
                            }
						}else{
                            for (l = 0; l < this.cache[rowInfo.tableName].col.length; l++) {
                                width = this.cache[rowInfo.tableName].instance.getColWidth(l);

                                length += width || 200;
                            }
						}

						if (this.cache[rowInfo.tableName].removeRow) {
							if (!this.cache[rowInfo.tableName].rowHeaders) {
								length -= 50;
							}
							this.getRemoveRowHtml(data.length + 1, length, rowInfo.tableName)
						}

					} else {
						this.cache[rowInfo.tableName].instance.alter('insert_row', index);
					}



				},

                /*
                 *   @addCol增加一列
                 *       @value      Array      输入值
                 *   配置：
                 *       组件接口-->
                 *           中文名：增加一列
                 *           英文名：addCol
                 *
                 *           详情：该接口用于增加一列数据
                 *
                 * */
				addCol: function (colInfo) {
					var
						i, j, k, width, setting = {}, colIndex, sum = 0,//储存临时变量
						colHeaders, col, data, name, colWidths,
						widgetIns = this.widgetIns,
                        auiCtx = this.pageContext,
                        attr = this.attr;
					colHeaders = this.cache[colInfo.tableName].colHeaders;
					data = this.cache[colInfo.tableName].instance.getData(),
						// 保存全局列宽度，全局列类型
						colWidths = this.cache[colInfo.tableName].colWidths||[];
						col = this.cache[colInfo.tableName].col;
					if (colInfo) {
						name = colInfo.colName ? colInfo.colName : '新建列';
						name =  (widgetIns && widgetIns.nsl(name)) || $AW.nsl(name, attr.id, auiCtx);
						width = colInfo.colWidth ? parseInt(colInfo.colWidth,10) : 200;
						if (colInfo.colIndex >= 0) {
							colIndex = parseInt(colInfo.colIndex);
							colHeaders.splice(colIndex, 0, name);
							col.splice(colIndex, 0, '');
							colWidths.splice(colIndex, 0, width);
							for (i = 0; i < data.length; i++) {
								data[i].splice(colIndex || 0, 0, '');
							}
						} else {
							colHeaders.push(name);
							colWidths.push(width);
							this.cache[colInfo.tableName].col.push('')
						}

					}
					else {
						colHeaders.push('新建列');
						col.push('');
						colWidths.push(200);
					}
					setting = {
						data: data,
						colHeaders: colHeaders,
						columns: col,
						colWidths: colWidths
					};

					this.cache[colInfo.tableName].instance.updateSettings(setting);
					// 重设数据
					for (i = 0; i < data.length; i++) {
						for (j = 0; j < data[i].length; j++) {
							this.cache[colInfo.tableName].instance.setDataAtCell(i, j, data[i][j])
						}
					}
					sum > 1000 ? sum = 1000 : true;
					for (k = 0; k < colWidths.length; k++) {
						sum += colWidths[k] || 200;
					}
					$('.hot' + colInfo.tableName, this.$view).css({
						width: sum + 200
					});
					// 一旦增加一列，就会添加上 移除行按钮
					this.getRemoveRowHtml(data.length, sum, colInfo.tableName, this.$view);

				},
                /*
                 *   @deleteRow 删除行号
                 *       @value      Array      输入值
                 *   配置：
                 *       组件接口-->
                 *           中文名：删除所在行
                 *           英文名：deleteRow
                 *           类型：无参数接口无
                 *           详情：该接口用于删除指定行数据
                 *           调用接口可能需要发起异步请求：不需要
                 *           入参：
                 *              中文名：删除行数组
                 *              英文名：deleteArr
                 *              类型：数组（根据实际情况而定）
                 *                  子元素1：
                 *                      中文名：删除行数
                 *                      类型：数字
                 *                      示例: 1
                 * */

				removeRow: function (romoveData) {
					var i, col, ilem,
						deleteNum = 0,//已经删除的个数;
						data;
					data = this.cache[romoveData.tableName].instance.getData().slice();

					if (romoveData.removeArr && romoveData.removeArr.length) {
						for (i = 0, ilem = romoveData.removeArr.length; i < ilem; i++) {

							this.cache[romoveData.tableName].instance.alter('remove_row', romoveData.removeArr[i] - deleteNum);
							data.splice(romoveData.removeArr[i] - deleteNum, 1);
							deleteNum++;
						}

					}

				},
                removeCol: function(colInfo){
                    var colHeaders,i,j,col,data,ins,sum = 0;

                    if(colInfo.length){

                    	for(j = 0 ; j < colInfo.length ; j++){

                            sum = 0;
                            ins = this.cache[colInfo[j].tableName].instance;
                            if(typeof parseInt(colInfo[j].colNum,10) === 'number'&&colInfo[j].colNum !==undefined){
                                colInfo[j].colNum = ins.colToProp(colInfo[j].colNum);
                            }
                            // 重设列定义
                            col = this.cache[colInfo[j].tableName].col;

                            for( i = 0 ; i < col.length ;i ++){
                                if(col[i].data === colInfo[j].colNum){
                                    //  重设宽度
                                    if(this.cache[colInfo[j].tableName].colWidths[i]){
                                        this.cache[colInfo[j].tableName].colWidths.splice(i,1);
                                    }

                                    this.cache[colInfo[j].tableName].col.splice(i,1);
                                    this.cache[colInfo[j].tableName].colHeaders.splice(i,1);
                                }
                            }
                            //重设数据
                            data = this.cache[colInfo[j].tableName].data;
                            for( i = 0 ; i < data.length ;i ++){
                                if(data[i][colInfo[j].colNum]){
                                    delete this.cache[colInfo[j].tableName].data[i][colInfo];
                                }
                            }

                            ins.updateSettings({
                                columns:this.cache[colInfo[j].tableName].col,
                                colHeaders:this.cache[colInfo[j].tableName].colHeaders,
                               
                            });
                            for(i = 0 ; i < this.cache[colInfo[j].tableName].col.length ; i++ ){
                                sum += this.cache[colInfo[j].tableName].colWidths[i]||200;
                            }
                            if (this.cache[colInfo[j].tableName].removeRow) {
                                if (!this.cache[colInfo[j].tableName].rowHeaders) {
                                    sum -= 50;
                                }
                                this.getRemoveRowHtml(data.length, sum, colInfo[j].tableName, this.$view);
                            }

							//清除最后一列
							if(this.cache[colInfo[j].tableName].col.length === 0&&this.cache[colInfo[j].tableName].colHeaders.length ===0){
                                this.cache[colInfo[j].tableName].instance.destroy();
                                this.cache[colInfo[j].tableName].instance = {};
                                $('.hot' + colInfo[j].tableName).remove();
							}
						}
					}



                },
				clearData:function(tableName){
					this.cache[tableName].instance.loadData([[]]);
					this.cache[tableName].data = [[]];
				},

                /*
                 *   @success    校验成功
                 *       @$widget    jQuery Object
                 *   配置：
                 *       组件接口-->
                 *           中文名：校验成功
                 *           英文名：success
                 *           类型：校验成功
                 *           详情：当校验成功时，组件提供的接口
                 *           入参：
                 *              中文名：组件实例输入元素的jQuery
                 *              英文名：$selector
                 *              类型：jQuery对象
                 * */
				// success: function ($selector) {
				// },

                /*
                 *   @error      校验失败
                 *       @$widget    jQuery Object
                 *       @errorMsg   String          错误提示
                 *   配置：
                 *       组件接口-->
                 *           中文名：校验失败
                 *           英文名：error
                 *           类型：校验失败
                 *           详情：当校验失败时，组件提供的接口
                 *           入参：
                 *              中文名：组件实例输入元素的jQuery
                 *              英文名：$selector
                 *              类型：jQuery对象
                 *
                 *              中文名：错误提示
                 *              英文名：errorMsg
                 *              类型：字符串
                 * */
				// error: function ($selector, errorMsg) {
				// },

                /*
                 *   @clean      清空校验
                 *       @e      Event Handler   事件句柄
                 *   配置：
                 *       组件接口-->
                 *           中文名：清空校验
                 *           英文名：clean
                 *           类型：清空校验
                 *           详情：当清空校验时，组件提供的接口
                 *           入参：
                 *              中文名：事件句柄
                 *              英文名：e
                 *              类型：事件句柄
                 * */
				// clean: function (e) {
				// },

                /*
                 *
                 *  @validateHandler    自定义校验方法
                 *  @value              输入值
                 *
                 *  return {
                 *      result: true,        //校验结果
                 *      value: value,        //传输的格式
                 *      errorMsg: ''         //校验失败的结果
                 *  }
                 *   配置：
                 *       组件接口-->
                 *           中文名：自定义校验方法
                 *           英文名：validateHandler
                 *           类型：自定义校验方法
                 *           详情：组件提供的特殊格式的自定义校验方法
                 *           入参：
                 *              中文名：输入值
                 *              英文名：value
                 *              类型：字符串
                 *           是否有出参：是
                 *           出参：
                 *              中文名：返回值
                 *              英文名：ret
                 *              类型：对象
                 *                 子元素1：
                 *                      中文名：校验结果
                 *                      英文名：result
                 *                      类型：布尔值
                 *                 子元素2：
                 *                      中文名：正确的传输格式
                 *                      英文名：value
                 *                      类型：字符串（根据实际情况而定）
                 *                 子元素3：
                 *                      中文名：校验失败的错误提示，校验正确时，该项为空
                 *                      英文名：errorMsg
                 *                      类型：字符串
                 * */
				validateHandler: function (value) {
					return {
						result: true, //校验结果
						value: value, //传输的格式
						errorMsg: '' //校验失败的错误提示
					}
				},

				//组件行为部分
                /*
                 *   @behavior  行为接口，通过比较结果对 $widget 进行操作
                 *       @result     Boolean     比较结果
                 *       @input1     Object      输入值
                 *       @input2     Object      比较值
                 *       @condition  enum        条件
                 *                   lt          小于
                 *                   eq          等于
                 *                   gt          大于
                 *                   not         不等于
                 *                   includes    包含
                 *                   notIncludes 不包含
                 *                   startsWith  以…开始
                 *   配置：
                 *       组件接口-->
                 *           中文名：显示隐藏行为
                 *           英文名：display
                 *           类型：行为接口
                 *           详情：根据结果进行显示或者隐藏
                 *           入参：
                 *              中文名：比较结果
                 *              英文名：result
                 *              类型：布尔值
                 *
                 *              中文名：输入值
                 *              英文名：input1
                 *              类型：字符串（根据实际情况而定）
                 *
                 *              中文名：比较值
                 *              英文名：input2
                 *              类型：字符串（根据实际情况而定）
                 *
                 *              中文名：比较条件
                 *              英文名：condition
                 *              类型：枚举值
                 *
                 * */
				display: function (result, input1, input2, condition) {
					this[result ? 'hide' : 'show']();
				},

                /*
                 *   @show   显示
                 *   配置：
                 *       组件接口-->
                 *           中文名：显示
                 *           英文名：show
                 *           类型：无参数接口
                 * */
				show: function () {
					this.$view.removeClass('hide');
				},
				showTable: function (tableName) {

					if (this.cache && this.cache[tableName].instance.alter){
						return;
					}
					this._initHot(tableName);
				},
                /*
                 *   @show   隐藏
                 *   配置：
                 *       组件接口-->
                 *           中文名：隐藏
                 *           英文名：hide
                 *           类型：无参数接口
                 * */
				hide: function () {
					this.$view.addClass('hide');
				},
				hideTable: function (tableName) {
					var $widget = this.$view;

					$('.hot' + tableName, $widget).addClass('hide');

				}
		};

		//下面的代码，如无必要，无需修改，但需要查看每个入参的意义
		widget.component.multiHansonTable = function () {
				var widgetIns, eventHandler,
					$widget, option, attr, css, auiCtx;

					$widget = arguments[0];
					option = arguments[1];
					attr = arguments[2];
					css = arguments[3];
					auiCtx = arguments[4];

					//运行时代码Start
					return new Component(null, $widget, option, attr, css, auiCtx);
					//运行时代码End

		};
	});
})();
