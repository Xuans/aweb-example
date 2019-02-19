(function (factory) {
    "use strict";

    // amd module
    if (typeof define === "function" && define.amd) {
        define(["jquery", "widget", 'template'], factory);
    }
    // global
    else {
        factory();
    }

})
(function ($, widget, artTemplate) {
    "use strict";

    var Component = function ($widget, option, attr, css, auiCtx) {
        var context = this;

        //Data Model
        context.$view = $widget;
        context.option = $.extend(true, {}, this.setting, option);
        context.attr = attr;
        context.css = css;
        context.pageContext = auiCtx;

        context.isReady = false;

        context.cache = {};
        context.stack = [];
        context.validateData = [];
        context.widgetList = [];
    };

    Component.prototype = Component.fn = {
        constructor: Component,
        version: 'AWOS 5.1 XQ',
        author: 'your name',


        //常量表
        //模板，使用artTemplate模板
        constant: {
            LINE_ONE_TEMP:
                '<form data-widget-type="aweb4FoundationFormCtn" id="{{formID}}" >' +
                '<div data-widget-type="aweb4FoundationRowCtn" class="row" id="{{rowID}}">' +
                '{{each list}}' +
                '{{if $value.realType==="aweb3NormalBtn"}}' +
                '<button id="{{$value.id}}" data-widget-type="aweb3NormalBtn" type="button" class="btn"></button>' +
                '{{else}}' +
                '<div id="{{$value.id}}" data-widget-type="{{$value.realType}}"></div>' +
                '{{/if}}' +
                '{{/each}}' +
                '</div>' +
                '</form>',
        },
        //组件的依赖配置、href值
        DEPS: {
            aweb4FoundationText: {
                href: 'component.foundationForm.foundationText',
                js: ['component.foundationForm.foundationText'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## .input'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4FoundationTextArea: {
                href: 'component.foundationForm.foundationTextArea',
                js: ['component.foundationForm.foundationTextArea'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## .input'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4FoundationFormCtn: {
                href: 'ctn.foundationFormCtn',
                js: ['ctn.foundationFormCtn'],
                css: ['foundation/css/foundation.css']
            },
            aweb4FoundationRowCtn: {
                href: 'ctn.foundationRowCtn',
                js: ['ctn.foundationRowCtn']
            },
            aweb4FoundationInput: {
                href: 'component.foundationForm.foundationInput',
                js: ['component.foundationForm.foundationInput'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## .input-group-field'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4FoundationCheckboxGroup: {
                href: 'component.foundationForm.foundationCheckboxGroup',
                js: ['component.foundationForm.foundationCheckboxGroup'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue',
                    setOption: 'setCheckboxGroup'
                },
                validate: {
                    selector: '###_ID## :checkbox'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4FoundationDigitInput: {
                href: 'component.foundationForm.foundationDigitInput',
                js: ['component.foundationForm.foundationDigitInput'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## input'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4FoundationPassword: {
                href: 'component.foundationForm.foundationPassword',
                js: ['component.foundationForm.foundationPassword'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## input'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4FoundationRadioGroup: {
                href: 'component.foundationForm.foundationRadioGroup',
                js: ['component.foundationForm.foundationRadioGroup'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue',
                    setOption: 'setRadioGroup'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## :radio'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4FoundationSwitch: {
                href: 'component.foundationForm.foundationSwitch',
                js: ['component.foundationForm.foundationSwitch', 'bootstrap-switch'],
                css: ['switcher/css/bootstrap-switch.css'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## input'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4FoundationSelect: {
                type: 'aweb4foundationSelect',
                href: 'component.foundationForm.foundationSelect',
                js: ['component.foundationForm.foundationSelect'],
                css: ['chosen-jquery/css/chosen.css'],
                getter: {
                    defaults: 'getFirstValue',
                    getValue: 'getValue'
                },
                setter: {
                    defaults: 'setSelectValue',
                    setOption: 'setSelectOption'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## select'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4foundationTreeSelect: {
                type: 'aweb4foundationTreeSelect',
                href: 'component.foundationForm.foundationTreeSelect',
                js: ['component.foundationForm.foundationTreeSelect'],
                css: ['easyui-combotree/easyui.css'],
                getter: {
                    defaults: 'getValues'
                },
                setter: {
                    defaults: 'setSelectValue',
                    setOption: 'refresh'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID##'
                },
                disabled: {
                    defaults: 'disabled'
                }
            },
            aweb4Datepicker: {
                href: 'component.foundationForm.foundationDatepicker',
                js: ['component.foundationForm.foundationDatepicker'],
                css: ['bootstrap_datepicker/css/bootstrap-datepicker.css'],
                getter: {
                    defaults: 'getValue'
                },
                setter: {
                    defaults: 'setValue'
                },
                validate: {
                    success: 'success',
                    error: 'error',
                    clean: 'clean',
                    selector: '###_ID## input'
                },
                disabled: {
                    defaults: 'disabled'
                },
                disabledById: {
                    defaults: 'disabled'
                }
            },
            aweb3NormalBtn: {
                href: 'component.btn.normalBtn',
                js: ['component.btn.normalBtn'],
                css: ['AUI/css/component.btn.css']
            }
        },

        //默认配置
        setting: {},

        show: function () {
            this.$view.removeClass("hide");
        },
        hide: function () {
            this.$view.addClass("hide");
        },
        disabled: function (flag) {
            if (!this.isReady) {//加入没有实例化组件完毕，先缓存起来
                this.stack.push({api: 'disabled', args: flag});
            } else {
                var list = this.cache && this.cache.list,
                    variables = this.privateAUICtx && this.privateAUICtx.variables,
                    i, item;
                if (flag && list && list.length) {
                    for (i = -1; item = list[++i];) {
                        variables[item.id].disabled(flag);
                    }
                }


                // var DEPS = this.DEPS,
                // ret = [],
                // map = this.cache && this.cache.map,
                // variables = this.privateAUICtx && this.privateAUICtx.variables,
                // i, item, deps, props, ins,arr = Object.keys(map),arrLength = arr.length;

                // for( i in map){
                //     props = map[i];
                //     ins = variables[props.id];
                //     if (props && ins) {
                //         deps = DEPS[props.type];
                //         //基于给到的接口名称或默认接口名称
                //         if(deps.disabled){
                //             ins[deps.disabled.defaults](data);
                //         }
                //     }
                // }
            }
        },
        disabledById: function (idArr,flag) {
            if (!this.isReady) {//加入没有实例化组件完毕，先缓存起来
                this.stack.push({api: 'disabled', args: idArr});
            } else {
                var list = this.cache && this.cache.list,
                    variables = this.privateAUICtx && this.privateAUICtx.variables,
                    i, item,j;
                if (idArr && list && list.length) {
                    for(i = 0;i<idArr.length;i++){
                        for(j = 0;j<list.length;j++){
                            if(list[j].id === idArr[i]){
                                variables[idArr[i]].disabled(true);
                            }
                        }

                    }

                }


                // var DEPS = this.DEPS,
                // ret = [],
                // map = this.cache && this.cache.map,
                // variables = this.privateAUICtx && this.privateAUICtx.variables,
                // i, item, deps, props, ins,arr = Object.keys(map),arrLength = arr.length;

                // for( i in map){
                //     props = map[i];
                //     ins = variables[props.id];
                //     if (props && ins) {
                //         deps = DEPS[props.type];
                //         //基于给到的接口名称或默认接口名称
                //         if(deps.disabled){
                //             ins[deps.disabled.defaults](data);
                //         }
                //     }
                // }
            }
        },
        getValidateValue: function () {
            var privateAUICtx = this.privateAUICtx,
                widgetList = this.widgetList,
                DEPS = this.DEPS,
                validateData = [],
                validateCopy,
                i, item, valiData,
                j, key,
                props = ["desp", "name", "validate", "value"];

            for (i = 0; item = widgetList[i]; i++) {
                if (item.validate && item.validate.validateType) {
                    validateCopy = JSON.parse(JSON.stringify(item.validate));

                    for (j = props.length, valiData = {}; key = props[--j];) {
                        switch (key) {
                            case 'value':
                                valiData[key] = privateAUICtx.variables[item.id][DEPS[item.type].getter.defaults]();
                                break;
                            case 'name':
                                valiData[key] = (item.attr && item.attr.name) || item.id;
                                break;
                            case 'desp':
                                valiData[key] = (item.attr && item.attr.desp) || (item.configs && item.configs.label) || '';
                                break;
                            case 'validate':
                                valiData[key] = validateCopy;
                                break;
                            default:
                                valiData[key] = item[key];
                        }
                    }
                    validateData.push(valiData);
                }
            }

            return validateData;
        },
        //使用setter接口，设置数据

        setFormList: function (list) {
            var $widget = this.$view,

                map = {},
                cache = {
                    formID: 'formID' + app.getUID(),
                    rowID: 'rowID' + app.getUID(),
                    list: list,
                    map: map
                },
                widgetList = [],

                context = this,

                DEPS = context.DEPS,
                requireCSSList = [], requireJSList = [], requireMap = {}, deps,

                privateAUICtx,

                validateData = [],

                i, item;

            context.cache = cache;
            context.isReady = false;
            context.validateData = validateData;


            //模拟生成组件内部auiCtx
            privateAUICtx = context.privateAUICtx = {
                attr: {},
                css: {},
                configs: {},
                variables: {},
                $el: $widget
            };

            widgetList.push({
                id: cache.formID,
                type: 'aweb4FoundationFormCtn',
                configs: $.extend(true, {}, context.option),
                css: $.extend(true, {}, context.css)
            });
            widgetList.push({id: cache.rowID, type: 'aweb4FoundationRowCtn'});
            widgetList = widgetList.concat(list);

            context.widgetList = widgetList;


            //生成依赖列表
            for (i = 0; item = widgetList[i]; i++) {
                if (!item.id) {
                    item.id = 'form_' + app.getUID();
                }
                map[item.id] = item;

                item.realType = DEPS[item.type] && DEPS[item.type].type || item.type;

                privateAUICtx.attr[item.id] = {id: item.id};
                privateAUICtx.configs[item.id] = item.configs || {};
                privateAUICtx.css[item.id] = item.css || {};

                if (!requireMap[item.type]) {
                    requireMap[item.type] = true;

                    deps = DEPS[item.type];

                    if (deps.js && deps.js.length) {
                        requireJSList = requireJSList.concat(deps.js);
                    }

                    if (deps.css && deps.css.length) {
                        requireCSSList = requireCSSList.concat(deps.css);
                    }
                }
            }

            //填充模板
            $widget.off('.formUnion').empty().append(
                artTemplate.compile(this.constant.LINE_ONE_TEMP)(cache)
            );
            $widget.removeAttr('data-aweb-event');

            require(
                //加载脚本
                window.aweb.transformJsConfig(requireJSList)
                //加载样式
                    .concat(window.aweb.transformCssConfig(requireCSSList)), function () {
                    var variables = privateAUICtx.variables,
                        func,
                        keys, key, j, valiData;

                    //实例化组件，并挂载到variables下
                    for (i = 0; item = widgetList[i]; i++) {
                        keys = DEPS[item.type].href.split('.');
                        j = 0;
                        func = $AW;

                        while (j < keys.length) {
                            func = func[keys[j]];
                            ++j;
                        }

                        variables[item.id] =
                            func(
                                $('#' + item.id, $widget),
                                privateAUICtx.configs[item.id],
                                privateAUICtx.attr[item.id],
                                privateAUICtx.css[item.id],
                                privateAUICtx
                            );

                        //判断是否有校验信息
                        if (item.validate && item.validate.validateType) {
                            item.validate.id = (DEPS[item.type].validate && DEPS[item.type].validate.selector.replace(/##_ID##/, item.id)) || $widget;
                            item.validate.context = $widget;

                            $(item.validate.id, $widget).on(item.validate.validateType + '.formUnion', function (item) {
                                return function () {
                                    app.validate(function () {
                                        return [{
                                            desp: (item.attr && item.attr.desp) || (item.configs && item.configs.label) || '',
                                            name: (item.attr && item.attr.name) || (item.configs && item.configs.label) || item.id,
                                            validate: item.validate,
                                            value: privateAUICtx.variables[item.id][DEPS[item.type].getter.defaults]()
                                        }];
                                    }, function () {
                                        var success = privateAUICtx.variables[item.id][DEPS[item.type].validate.success];

                                        success.apply($widget, arguments);

                                    }, function () {
                                        var error = privateAUICtx.variables[item.id][DEPS[item.type].validate.error];

                                        error.apply($widget, arguments);
                                    }, function () {
                                        var clean = privateAUICtx.variables[item.id][DEPS[item.type].validate.clean];

                                        clean.apply($widget, arguments);
                                    }, true, true);
                                }
                            }(item));
                        }
                    }

                    context.isReady = true;

                    context.ready();
                });


        },

        getFormValue: function () {
            var DEPS = this.DEPS,

                ret = [],
                list = this.cache && this.cache.list,
                variables = this.privateAUICtx && this.privateAUICtx.variables,
                i, item, deps;

            if (list && list.length) {
                for (i = -1; item = list[++i];) {
                    //try{
                    deps = DEPS[item.type];

                    ret.push({
                        id: item.id,
                        value: variables[item.id][deps.getter.defaults](),
                        type: item.type
                    });
                    //}catch(e){

                    //}
                }
            }

            return ret;
        },
        //使用setter接口，回显数据列
        setFormValue: function (data) {

            if (!this.isReady) {//加入没有实例化组件完毕，先缓存起来
                if (data && data.length) {
                    this.stack.push({api: 'setFormValue', args: Array.prototype.slice.call(arguments)});
                }
            } else {
                var DEPS = this.DEPS,

                    ret = [],
                    map = this.cache && this.cache.map,
                    variables = this.privateAUICtx && this.privateAUICtx.variables,
                    i, item, deps, props, ins;

                if (data && data.length) {
                    for (i = -1; item = data[0][++i];) {
                        //组件参数
                        props = map[item.id];
                        ins = variables[item.id];
                        if (props && ins) {
                            deps = DEPS[props.type];

                            //基于给到的接口名称或默认接口名称
                            ins[item.api || deps.setter.defaults](item.value);
                        }
                    }
                }
            }
        },

        //实例化组件完毕后回显数据
        ready: function () {
            var stack = this.stack, i, item;

            for (i = -1; item = stack[++i];) {
                this[item.api](item.args);
            }
        }
    };

    //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
    widget.component.formUnionV2 = function ($widget, option, attr, css, auiCtx) {
        return new Component($widget, option, attr, css, auiCtx);
    };
});