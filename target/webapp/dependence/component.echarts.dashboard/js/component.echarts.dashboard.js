/**
 * @author hefuxiang@agree.com.cn
 * Date: 2017.04.03
 */
( /* <global> */function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "echarts"], factory);
        }
        // global
        else {
            factory();
        }

    })
        (function ($, widget, echarts) {
            "use strict";

            function render($selector, option, attr,css, auiCtx) {
                var echart,
                    resizeHandler = app.getUID(),

                    //生成测试数据
                    generateData = function (series) {
                        var dataArr = [];
                        if (series && series.elements.length > 0) {
                            for (var i = 0; i < series.elements.length; i++) {
                                var min = series.elements[i].min || 0,
                                    max = series.elements[i].max || 100;
                                dataArr.push(min + Math.round(Math.random() * (max - min)));
                            }
                        }
                        return dataArr;
                    },
                    addResizeHandler = function () {
                        app.screen.addResizeHandler({
                            uid: resizeHandler,
                            isGlobal: true,
                            timeout: 220,
                            callback: function () {
                                echart.resize();
                            }
                        });
                    },
                    refresh = function (data) {
                        var curConfig = echart.getOption();

                        for (var i = 0; i < curConfig.series.length; i++) {
                            curConfig.series[i].data = {
                                name: curConfig.series[i].name,
                                value: data[i]
                            };
                        }
                        echart.setOption(curConfig);
                        echart.resize();
                        addResizeHandler();

                    },
                    init = function ($selector) {
                        var elements = option.series.elements || [],
                            width = option.size && option.size.width,
                            height = option.size && option.size.height;

                        // 对 option.series.elements[{name}] 进行国际化翻译
                        $.each(elements, function (index, value) {
                            value.name = $AW.nsl(value.name, attr.id, auiCtx);
                        });

                        var config = {
                            "tooltip": option.tooltip || '',
                            "series": elements,
                            "toolbox": option.toolbox || {}
                        };

                        $selector.css('width', width + 'px').css('height', height + 'px');
                        config.toolbox.feature = {
                            dataView: { readOnly: false },
                            restore: {},
                            saveAsImage: {}
                        };
                        echart = echarts.init($selector[0]);
                        echart.setOption(config);
                        echart.resize();
                        addResizeHandler();
                    };

                   $selector.attr("id", attr.id || '');

                if (option && option.series && option.series.elements && option.series.elements.length) {
                    option.series.elements[0].axisLine.lineStyle.color = [[0.2, '#04bebd'], [0.8, '#068dd3'], [1, '#f05050']];

                    init($selector);

                    if (auiCtx) {
                        //add resize handler
                        addResizeHandler();

                        return {
                            "echart": echart,
                            "myChart": echart,

                            refresh: function (data) {
                                refresh(data)
                            },
                            setOption: function (option) {
                                echart.setOption(option);
                                echart.resize();
                                return echart;
                            },
                            resize: function () {
                                echart.resize();
                            },
                            pause: function () {
                                app.screen.removeResizeHandler(resizeHandler, true);
                            },
                            resume: function () {
                                addResizeHandler();

                                echart.resize();
                            },
                            destroy: function () {
                                app.screen.removeResizeHandler(resizeHandler, true);

                                echart.dispose();
                            },
                            display: function (result, input1, input2, condition) {
                                this[result ? 'hide' : 'show']();
                            },
                            show: function () {
                                $selector.removeClass('hide');
                                echart.resize();
                            },
                            hide: function () {
                                $selector.addClass('hide');
                            }

                        }
                    } else {
                        refresh(generateData(option.series));
                    }

                }

            }

            if (!widget.component.echarts) {
                widget.component.echarts = {};
            }
            widget.component.echarts.dashboard = function ($selector, option, attr, css, auiCtx) {


                return render($selector, option, attr,css, auiCtx);

            };

            return widget;
        });
})();