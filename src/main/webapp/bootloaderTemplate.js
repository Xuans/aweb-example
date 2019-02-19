/*
 *   页面数据加载依赖模板 bootloader.js
 *   lijiancheng@agree.com.cn
 *   last update date:20161026
 *   version：AUI 4.1.1
 *   build: 5520
 * */
(function (global) {

    //noinspection JSValidateTypes
    var
        MOBILE_REGEX = /android/i,
        config, jsLoadList, cssLoadList,
        cssConfigMap = __CSS_CONFIG_MAP__ || {};

    config = {
        /*config*/
        name: {
            name: 'name',//名称
            path: 'dependence/AUI/js/component.dataTables.js',//路径
            deps: ['jquery'],//依赖其他文件列表
            exports: '$.fn.dataTables'//对外暴露接口名称
        }
        /*config*/
    };
    /*jsList*/
    jsLoadList = [];
    /*jsList*/
    /*cssList*/
    cssLoadList = [];
    /*cssList*/




    "IDETAG";
    //do something to edit the vars above
    "IDETAG";

    var _i, _j, _item, _path, name, isPath,
        map = {},
        requireConfig = {
            shim: {
                "widget": {
                    "deps": ["jquery", 'awebApi']
                }
            },
            paths: {
                "widget": "dependence/AWEB/js/aweb.widget"
            },
            text: {
                useXhr: function () {
                    return true;
                }
            },
            waitSeconds: 30
        },
        console,
        cssLoadMap = {},

        SIGNAL_STYLE_FILE_NAME = 'style.css';

    global.aweb = {
        css: {
            deps: []
        },
        globalVariables: {},
        transformJsConfig: function (jsLoadList) {

            //transform path into name
            for (_i = jsLoadList.length; _item = jsLoadList[--_i];) {
                name = jsLoadList[_i];
                //将路径切换为名字
                if (map[name] || map['dependence/' + name]) {

                    name = map[name] || map['dependence/' + name];

                } else if (/[\\\/]/.test(name)) {
                    isPath = false;

                    for (_j in config) {
                        if (config[_j] && config[_j].path && config[_j].path.indexOf(name) !== -1) {
                            name = map[name] = _j;
                            isPath = true;
                            break;
                        }
                    }

                    if (!isPath) {
                        name = 'dependence/' + name;
                    }

                    map[name] = name;
                } else {
                    if (requireConfig.paths[name]) {
                        map[name] = name;
                    } else {
                        map[name] = '';
                        name = '';
                    }
                }


                jsLoadList[_i] = name;
            }


            return jsLoadList;
        },
        transformCssConfig: function (cssLoadList) {
            //css config
            var cssconfigItem;
            for (_i = cssLoadList.length; _item = cssLoadList[--_i];) {
                if (aweb.singleStyleFile && (_item in cssLoadMap)) {

                    cssLoadList[_i] = 'requireCss!' + cssLoadMap[_item];
                } else if (!/^(?:\.)?dependence/.test(_item)) {
                    if (cssConfigMap.hasOwnProperty(_item)) {
                        cssconfigItem = cssConfigMap[_item];
                        _item = 'dependence/' + cssconfigItem;
                        cssLoadList[_i] = 'requireCss!' + _item;
                    }

                }
            }

            return cssLoadList;
        },
        stepTo: function (msg) {
            aweb._stepTo = msg;
        },
        exceptionHandler: function () {
            var _console = global.console,
                console = {},
                func = ['log', 'info', 'error', 'warn', 'table'],
                i, item;

            if (_console && _console.hasOwnProperty) {
                for (i in _console) {
                    if (_console.hasOwnProperty(i)) {
                        console[i] = _console[i];
                    }
                }
            }

            for (i = func.length; item = func[--i];) {

                console[item] = (function (item) {

                    if (!_console[item]) {
                        _console[item] = _console.log;
                    }

                    return function () {
                        aweb._stepTo && _console.info('执行到"' + aweb._stepTo + '"。');

                        try {
                            _console[item].apply(_console, arguments);


                            if (item === 'error' && _console.trace) {
                                _console.trace();
                            }

                        } catch (e) {
                            app.alert(arguments[0]);
                        }
                    }
                }(item));
            }

            global.console = console;

            window.onerror = function (errorMsg, scriptURI, lineNumber, columnNumber, errorObj) {
                aweb._stepTo && _console.info('执行到"' + aweb._stepTo + '"报错。');

                //_console.error(errorObj);
            }
        }
    };
    global.app = {};

    if (!(console = global.console)) {
        global.console = console = {};

        console.info = console.log = console.error = console.warning = function (msg) {
            if (global.aweb.log) {
                global.alert(msg);
            }
        };
    }
    //js config
    for (_i in config) {
        if (config.hasOwnProperty(_i)) {
            _item = config[_i];
            requireConfig.shim[_i] = {
                deps: _item.deps,
                exports: _item.exports
            };
            _path = _item.path;
            requireConfig.paths[_i] = ~_path.indexOf('.js') ? _path.substring(0, _path.length - 3) : _path;
        }
    }

    //css dependence
    for (_i = -1; _item = cssLoadList[++_i];) {
        cssLoadMap[_item] = SIGNAL_STYLE_FILE_NAME;
    }

    require.config(requireConfig);

    require(['jquery', 'awebEnvironment', 'widget', 'awebApi'], function ($, environment, widget) {
        //environment
        var aweb = $.extend(true, global.aweb, environment),
            queue = [], cursor = -1, next = function () {
                var callback = queue[++cursor];

                if (callback) {
                    callback();
                }
            };

        if (aweb.requireConfig) {
            if (aweb.requireConfig.urlArgs === false) {
                aweb.requireConfig.urlArgs = '_t=' + new Date().getTime();
            } else {
                delete aweb.requireConfig.urlArgs;
            }

            require.config(aweb.requireConfig);
        }

        if (aweb.debug) {
            aweb.exceptionHandler();
        }

        //$AW
        global.$AW = widget;

        //国际化
        if (aweb.translate) {
            queue.push(function () {
                $._ajax({
                    url: 'NSL/nsl_' + widget.getCurrentLanguage() + '.json',
                    success: function (data) {
                        widget.viewer.nsl = data || {};
                    },
                    error: function () {
                        $AW.viewer.nsl = {};
                    },
                    complete: next
                });
            });
        }

        //主题
        if (aweb.fresher) {
            queue.push(function () {
                //主题
                require(['awebFresher'], function (fresher) {

                    widget.fresher.theme = fresher.theme;
                    widget.fresher.variablesCopy = widget.transformThemeVariables(fresher.variables);
                    next();
                });
            })
        } else {
            widget.fresher.theme = {};
            widget.fresher.variablesCopy = {};
        }

        //页面
        queue.push(function () {
            require(['awebIndex'], function (index) {
                var Controller = app.Controller,
                    _domID = app.getUID(),
                    _scope = {},
                    _$el = $('body').attr('id', _domID),
                    _handler = new Controller.Model({
                        conf: '',
                        path: 'module/index/index/',
                        $renderTo: _$el,
                        id: _domID,
                        domID: _domID,
                        type: 'WINDOW'
                    });

                _$el.css('display', '');
                _handler._data.$el = _$el;

                if ($.isFunction(index)) {
                    index = index();
                }
                if ($.isFunction(index)) {
                    index = index();
                }

                index.load.call(_handler, _$el, _scope, _handler);

                next();
            });
        });

        //资源
        if (aweb.preloading) {
            queue.push(function () {
                require(aweb.transformJsConfig(jsLoadList));
                require(aweb.transformCssConfig(cssLoadList));
            });
        }


        next();

    });


    require.onError = function (err) {
        if (app && app.shelter) {
            app.shelter.hideAll();
        }
        throw  err;
    };

})(this);