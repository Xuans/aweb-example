/**
 * Created by quanyongxu@agree.com.cn on 2016/8/18 0015.
 */
/*!
 * Javascript library v3.0
 *
 * Date: 2016.08.18
 */

/**
 * @author quanyongxu@cfischina.com
 */
( /* <global> */function (undefined) {

	"use strict";
	(function (factory) {

		// amd module
		if (typeof define === "function" && define.amd) {
			define(["jquery", "widget", "echarts"], factory);
		}
		// global
		else {
			factory();
		}

	})
	(function ($, widget, _echarts) {
		"use strict";

		var echarts = _echarts || window.echarts;

		if(!widget.component.echarts){
			widget.component.echarts = {};
		}

		return {
			getRawConfig: function (option, type) {
				delete option.theme;
				delete option.size;
				switch (type) {
					case 'bar':
					case 'line':
						$.each(option.series, function (index, value) {
							value.itemStyle = {
								normal: {
									color: value.color,
									opacity: value.opacity
								}
							};

							delete value.color;
							delete value.opacity;
						});
						break;

					case 'pie':
						option.series = [];
						option.series.push({
							data: option.data,
							center: option.location && option.location.center,
							radius: option.location && option.location.radius,
							type: 'pie'
						});

						$.each(option.data, function (index, value) {
							option.legend.data.push(value.name);
						});

						delete option.data;
						delete option.location;

						break;
				}
				return option;
			},
			renderCharts: function ($div, option, type, auiCtx) {
				var myChart, $parent, xAxisData = [], xAxisType,
					width = option.size && option.size.width,
					height = option.size && option.size.height,
					theme = option.theme,
					ready = false,
					resizeHandler = app.getUID(),
					series,itemColor,i,

					addResizeHandler = function () {
						app.screen.addResizeHandler({
							uid: resizeHandler,
							isGlobal: true,
							timeout: 220,
							callback: function () {
								myChart.resize();
							}
						});
					};

				//删除没用的option
				delete option.theme;
				delete option.size;
				if(!option.color){
					delete option.color;
				}

				option.legend = option.legend || {data: []};
				option.legend.data = option.legend.data || [];
				//设置EChart容器
//            if(!width) {
//                $parent = $div;
//                while ((!width || $.inArray('%', width.toString().split('')) !== -1) && $parent.length) {
//                    $parent = $parent.parent();
//                    width = (width && $.inArray('%', width.toString().split('')) !== -1 ) ? parseInt(width) * parseInt($parent.css('width')) / 100 : $parent.css('width');
//                }
//                width = width || 400;
//            }
				if (!width) {
					width = "auto";
				}

				$div.css({
					width: width||'auto',
					height: height || '400px'
				});
				myChart = echarts.init($div[0], theme);


				switch (type) {
					case 'bar':
					case 'line':
						if (option && option.xAxis) {
							xAxisType = option.xAxis[0].type;
							option.xAxis[0].type = 'category';
							series = $.isArray(option.series) ? option.series : (option.series.elements || []);
							$.each(series, function (index, value) {
								 itemColor = value.color;
								value.itemStyle = {
									normal: {
										color: itemColor ? itemColor : undefined,
										opacity: value.opacity ? value.opacity : 1
									}
								};

                                // if(itemColor && itemColor.indexOf('new')!==-1){
                                //     value.itemStyle.normal.color = eval(itemColor);
                                // }

                                value.itemStyle.normal.color = itemColor;

                                if(window.auiApp) {
                                    value.data = new Array(option.xAxis[0].data.length);
                                    $.each(value.data, function (i, v) {
                                        value.data[i] = Math.random(100);
                                    });

                                    option.legend.data.push(value.name);
                                }else{//默认值为0
                                	value.data = new Array(option.xAxis[0].data.length);
                                    $.each(value.data, function (i, v) {
                                        value.data[i] = 0;
                                    });
                                    option.legend.data.push(value.name);
                                }

								delete value.color;
								delete value.opacity;
							});
							option.series = series;

							// 对 title 中 subtext 和 text 进行国际化翻译
							option.title.subtext =  $AW.nsl(option.title.subtext, $div.attr("id"), auiCtx);
							option.title.text =  $AW.nsl(option.title.text, $div.attr("id"), auiCtx);
							// 对 xAxis[{name}]、yAxis[{name}]进行国际化翻译
							if (option.xAxis) {
								$.each(option.xAxis, function (index, value) {
									value.name =  $AW.nsl(value.name, $div.attr("id"), auiCtx);
								});
							}
							
							if (option.yAxis) {
								$.each(option.yAxis, function (index, value) {
									value.name = $AW.nsl(value.name, $div.attr("id"), auiCtx);
								});
							}
							

							ready = true;
						}
						break;

					case 'pie':

						$.each(option.data, function (index, value) {
							delete value.edmKey;
							delete value.uuid;
							value.name = $AW.nsl(value.name, $div.attr("id"), auiCtx);
						});

						option.series = [];
						option.series.push({
							data: option.data,
							center: option.location && option.location.center,
							radius: option.location && option.location.radius,
							type: 'pie',
							label: {normal:option.label},
				            labelLine: {normal:option.labelLine}
						});

						$.each(option.data, function (index, value) {
							option.legend.data.push(value.name);
						});

						delete option.data;
						delete option.location;
//						delete option.label;
						delete option.labelLine;

						// 对 title 中 subtext 和 text 进行国际化翻译
						option.title.subtext =  $AW.nsl(option.title.subtext, $div.attr("id"), auiCtx);
						option.title.text =  $AW.nsl(option.title.text, $div.attr("id"), auiCtx);

						ready = true;
						break;
				}

				if (xAxisType === 'time' || xAxisType === 'categoryDynamic') {

					if (!option.xAxis[0].data || ($.isArray(option.xAxis[0].data) && option.xAxis[0].data.length === 0)) {
						option.xAxis[0].data = [0]
					}
					for ( i = 0; i < option.xAxis[0].data.length; i++) {
						$.each(option.series, function (index, value) {
							value.data = [0];
						});
					}
				}

				if (option.toolbox) {
					option.toolbox.feature = {
						dataView: {readOnly: false},
						restore: {},
						saveAsImage: {}
					};

					if (type === 'bar' || type === 'line') {
						option.toolbox.feature.magicType = {type: ['line', 'bar']};
					}
				}

				if (ready) {
					myChart.setOption(option, theme);
					myChart.resize();
				}

                addResizeHandler();


					return {
						myChart: myChart,
						echart: myChart,

						refresh: function (data) {
                            // addResizeHandler();
							if (data !== 'auiAjaxTest') {
								switch (type) {
									case 'bar':
									case 'line':
										if (xAxisType === 'time') {
											option.xAxis[0].data = option.xAxis[0].data.concat(data[0]);
											option.xAxis[0].data.shift();
											$.each(option.series, function (index, value) {
												value.data = value.data.concat(data[index + 1]);
												value.data.shift();
											});
										} else if (xAxisType === 'categoryDynamic') {
											option.xAxis[0].data = data[0];
											$.each(option.series, function (index, value) {
												value.data = data[index + 1];
											});
										} else {
											$.each(option.series, function (index, value) {
												value.data = data[index];
											});
										}
										break;
									case 'pie':
										option.series[0].data = data;
										var legenddata = [];
										$.each(data, function (index, node) {
											legenddata.push(node.name);
										});
										option.legend.data = legenddata;
										break;
								}
								myChart.setOption(option);
								myChart.resize();
							} else {

							}
						},
						setOption: function (option,notMerge) {
							myChart.setOption(option,notMerge);
							myChart.resize();
							return myChart;
						},
						resize: function () {

							myChart.resize();
						},
						pause: function () {
							app.screen.removeResizeHandler(resizeHandler, true);
						},
						resume: function () {
							addResizeHandler();

							myChart.resize();
						},
						destroy: function () {
							app.screen.removeResizeHandler(resizeHandler, true);

							myChart.dispose();
						},


						display: function (result, input1, input2, condition) {
							this[result ? 'hide' : 'show']();
						},
						show: function () {
							$div.removeClass('hide');

							myChart.resize();
						},
						hide: function () {
							$div.addClass('hide');
						}
					}
			}
		}
	});
})();
