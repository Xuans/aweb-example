define("viewer.indexLayout3",["jquery","widget"],function($, widget) {
    "use strict";
    //关于组件配置说明，请见"开发者中心"，搜索"388.组件设计"
    //关于代码调试工具的使用说明，请见"开发者中心"，搜索"397.开发者工具使用文档"
    var Component = function(widgetIns, $widget, option, attr, css, auiCtx) {
        var context = this;
        context.widgetIns = widgetIns;
        context.$view = $widget;
        context.option = option;
        context.attr = attr;
        context.css = css;
        context.pageContext = auiCtx;
    };
    //在代码中声明的接口，必须在"接口"配置中配置好，详情见各个接口的注释
    //一定要配置某个组件接口，才能在"前端逻辑引擎"和"开发者中心"中，引用或查看该接口
    //**关于组件接口是否配置正确，可以保存组件配置后，打开"开发者中心"-->"组件"-->打开当前组件，查看组件接口是否配置正确**
    //打开调试工具，输入"auiCtx.variables.组件实例ID.接口名"，可以调试接口是否可行
    Component.prototype = Component.fn = {
        constructor: Component,
        version: "AWOS 5.0 SoY3",
        author: "your name",
        //常量表
        //constant:{},
        //初始化（私有）
        _init: function() {
            var $widget = this.$view, html = [];
            //解析option、attr、css
            //使用$.fn.off().empty().append(html)可以避免调用$.fn.html(html)时导致的内存泄漏。
            $widget.empty().append(html.join(""));
        },
        //事件绑定（私有）
        _listen: function() {
            var $widget = this.$view;
            //绑定事件，推荐使用事件冒泡
            //这里绑定的事件一定不能与业务逻辑有关的，否则应该在“事件配置”中定义
            $widget.off(".namespace").on({
                "eventType1.namespace": function(e) {
                    //使用兼容IE8事件兼容的用法
                    var $target = $(e.target || window.event.srcElement);
                    //判断$target是什么
                    if (//判断target是否为a标签
                    $target.is("a") || //判断target是不是$widget
                    $target.is($widget) || $target.is(this) || //或者target是否有某个样式
                    $target.hasClass(".dataTables") || //触发的元素开始找，父辈是否有a标签
                    $target.closest("a").length) {}
                },
                "eventType2.namespace": function(e) {},
                //example,获取点击a标签的id
                //事件-->触发范围 ###_ID## a，接口-->查看接口getter配置
                "click.namespace": function(e) {
                    var $target = $(e.target || event.srcElement);
                    if ($target.is("a")) {
                        //例如 a标签的html为 <a data-href="bbb">Hello world</a>
                        cache.href = $target.attr("[data-href]");
                    }
                }
            });
        },
        //渲染主题、样式（私有）
        _render: function() {
            var $widget = this.$view, css = this.css, style;
            //css样式配置渲染
            if (css && css.theme) {}
            if (css && (style = css.style)) {}
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
        //pause:function(){},
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
        //resume:function(){},
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
        destroy: function() {
            this.$view.off().empty();
        },
        /*
                     *   @getter 获取组件实例的某些数据
                     *
                     *   配置：
                     *       组件接口-->
                     *           中文名：获取XX的XX
                     *           英文名：getValue
                     *           类型：取值器
                     *           详情：当点击组件a标签时，获取当前选中href值
                     *           是否有出参：是
                     *           出参：
                     *              中文名：a标签href值
                     *              英文名：href
                     *              类型：字符串（根据实际情况而定）
                     * */
        getValue: function() {},
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
        setValue: function(linkList) {
            /*
                         *   linkList=[{
                         *       name:'链接项1',
                         *       href:'id1
                         *   }]
                         * */
            var //模板
            TEMPLATE = '<a data-href="_value_">_name_</a>', //填充数据
            html = [], //中间变量
            i, item, $widget = this.$view;
            //清空上次的内容
            $widget.empty();
            if (linkList === "auiAjaxText") {} else if (linkList && linkList.length) {
                //校验输入数据
                for (i = -1; item = linkList[++i]; ) {
                    html.push(TEMPLATE.replace(/_name_/gi, item.name).replace(/_value_/gi, item.href));
                }
                //填充内容
                $widget.append(html.join(""));
            }
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
        success: function($selector) {},
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
        error: function($selector, errorMsg) {},
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
        clean: function(e) {},
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
        validateHandler: function(value) {
            return {
                result: true,
                //校验结果
                value: value,
                //传输的格式
                errorMsg: ""
            };
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
        behavior: function(result, input1, input2, condition) {
            this[result ? "hide" : "show"]();
        },
        /*
                     *   @show   显示
                     *   配置：
                     *       组件接口-->
                     *           中文名：显示
                     *           英文名：show
                     *           类型：无参数接口
                     * */
        show: function() {
            this.$view.removeClass("hide");
        },
        /*
                     *   @show   隐藏
                     *   配置：
                     *       组件接口-->
                     *           中文名：隐藏
                     *           英文名：hide
                     *           类型：无参数接口
                     * */
        hide: function() {
            this.$view.addClass("hide");
        },
        /*使用复制的getter、setter*/
        getter: function(key) {
            var ret = this.dataModule[key];
            return ret && typeof ret === "object" ? JSON.parse(JSON.stringify(ret)) : ret;
        },
        setter: function(key, value) {
            var inner = value && typeof value === "object" ? JSON.parse(JSON.stringify(value)) : value;
            this.dataModule[key] = inner;
        },
        //使用同一的缓存对象
        getCacheView: function(key, refresh) {
            var ret = this.viewCache[key];
            if (!ret || refresh) {
                ret = this.viewCache[key] = $('[data-role="' + key + '"]', this.$view);
            }
            return ret;
        }
    };
    //下面的代码，如无必要，无需修改，但需要查看每个入参的意义
    widget.viewer.indexLayout3 = function() {
        var widgetIns, eventHandler, $widget, option, attr, css, auiCtx;
        if (arguments[0].version) {
            /*
                         *   配置时代码
                         *   @widgetIns      $AW Object      组件对象实例
                         *   @eventHandler   Event Handler    调用事件句柄
                         *                   {
                         *                          @type 触发配置config的类型，枚举类型：
                         *                                  resume         组件第一次实例化，不包括再次打开页面或者业务组件的实例化
                         *                                  valueChange    配置被修改，包括参数option、样式配置css、数据校验配置edm
                         *                                  sizeChange     组件周边组件发生改变，导致父组件触发事件冒泡或者事件委托时触发的类型
                         *                                  default        组件未知触发类型事件触发的事件类型
                         *                          @bubble 触发配置方法时，是否由于子组件的值改变触发的事件冒泡
                         *                                  undefined      当bubble=undefined时，一般type=valueChange，表示由组件自身的值改变触发的
                         *                                  true           当bubble=true时，一般type=sizeChange且capture=false，表示由于子组件的值改变触发的
                         *                                  false          当bubble=false时，一般type=sizeChaneg且capture=false，表示由于父组件的值改变触发的
                         *                          @capture 触发配置方法时，是否由于父组件的值改变触发的事件委托
                         *                                  undefined      当bubble=undefined时，一般type=valueChange，表示由组件自身的值改变触发的
                         *                                  true           当capture=true时，一般type=sizeChange且bubble=false，表示由于父组件的值改变触发的
                         *                                  false          当capture=false时，一般type=sizeChaneg且bubble=false，表示由于子组件的值改变触发的
                         *                          @targetID 表示触发事件冒泡或者事件委托的组件ID,当targetID=undefined时，表示组件自身触发的
                         *                          @target 当type=valueChange且from=undefined时，值等于修改组件实例的哪个配置项，枚举类型
                         *                                  option    表示修改了组件的参数
                         *                                  css       表示修改了组件的样式配置
                         *                                  edm       表示修改了组件的校验配置
                         *                          @from   当配置config方法由于通过调用外部接口触发时，from显示调用的接口源，枚举类型。当from不等于undefined时，modelSelector和widgetSelector等于undefined
                         *                                  widget.fn.option   通过$AW(widgetID).option(opt)触发组件的配置config方法，如果不想触发方法可以用￥AW(widgetID).option(opt,true)阻止配置config方法触发；
                         *                                  widget.fn.css      通过$AW(widgetID).css(opt)触发组件的配置config方法，如果不想触发方法可以用￥AW(widgetID).css(opt,true)阻止配置config方法触发；
                         *                          @modelSelector 当type=valueChange且from=undefined时，值等于修改组件实例的配置项的路径：
                         *                                  例如，修标签页容器的第二个标签的类型，那么modelSelector=widgetInstance['optionCopy']['name'][1]['type']
                         *                                  其中widgetInstance表示组件实例，optionCopy表示组件参数，如果修改样式配置则为css
                         *                          @widgetSelector 当type=valueChange且from=undefined时，值等于修改组件的配置项的路径(注意，这里是配置项路径，不是组件实例配置项路径)：
                         *                                  例如，修标签页容器的第二个标签的类型，那么widgetSelector=widget['option'][0]['attrInEachElement'][2]
                         *                                  其中widget表示配置，option表示组件参数，如果修改样式配置则为css
                         *                  }
                         * */
            //配置时代码Start
            widgetIns = arguments[0];
            new Component(widgetIns, widgetIns[0].$widget.children("[data-widget-type]"), widgetIns.option(), widgetIns.attr(), widgetIns.css(), null);
            //配置时代码End
            return widget;
        } else {
            /*
                         * 运行时代码
                         * @$widget  jQuery Object   组件template的jQuery对象
                         * @option   Object          组件参数
                         * @attr     Object          组件基本属性
                         * @css      Object          组件样式配置
                         * @auiCtx   SPA Object      单页对象
                         *           {
                         *               //单页应用参数
                         *               $el                 jQuery Object       页面jQuery对象
                         *               scope               Object              页面缓存
                         *               handler             SPA Handler Object  单页应用句柄对象
                         *
                         *               //全局参数
                         *               pageParams          Object              页面参数（转跳到该页面时传入参数的数据池）
                         *
                         *               //组件实例属性
                         *               variables           Object              组件实例容器
                         *               configs             Object              组件参数容器
                         *               attr                Object              组件基本属性容器
                         *               css                 Object              组件样式属性容器
                         *               validations         Object              校验属性容器
                         *           }
                         * */
            $widget = arguments[0];
            option = arguments[1];
            attr = arguments[2];
            css = arguments[3];
            auiCtx = arguments[4];
            //运行时代码Start
            return new Component(null, $widget, option, attr, css, auiCtx);
        }
    };
});define("awebIndex",["viewer.indexLayout3"].concat(	window.aweb.transformJsConfig(["mobile.SoYLayout.indexLayout","viewer.indexLayout3","fastclick","viewer.indexLayout3","fastclick"])).concat(window.aweb.transformCssConfig(["AUI/css/mobile.SoYLayout.indexLayout.css","AWEB/css/icon-font.css","AWEB/css/aweb.page.css","AWEB/css/font-awesome.min.css","AWEB/css/soy.css","AWEB/css/am.css","AWEB/css/aweb.popover.css","AWEB/css/icon-font.css","AWEB/css/aweb.page.css","AWEB/css/font-awesome.min.css","AWEB/css/soy.css","AWEB/css/am.css","AWEB/css/aweb.popover.css"])),function(){	return (function() {
    return function() {
        return function(auiCtx) {
            "use strict";
            var $el, handler, scope, spaLifecycle;
            ;
            ;
            "CUSTOM_CODE";
            if (!spaLifecycle) {
                spaLifecycle = {
                    load: function(_$el, _scope, _handler) {
                        auiCtx.pageParams = $.extend(true, _scope, app.domain.get("page"));
                        auiCtx.context = this;
                        $el = _$el, handler = _handler, scope = _scope;
                        /*覆盖页面加载时的属性或方法*/
                        /*覆盖auiCtx属性或方法 */
                        auiCtx.auiCtxLoad.call(this, auiCtx, _$el, _scope, _handler);
                        /*事件绑定*/
                        this.delegateEvents.call(this, auiCtx.delegateEvents);
                    },
                    resume: function($el, scope, handler) {
                        /*覆盖页面恢复时的属性或方法*/
                        auiCtx.auiCtxResume.call(this, auiCtx, $el, scope, handler);
                    },
                    pause: function($el, scope, handler) {
                        /*覆盖页面切出时的属性或方法*/
                        auiCtx.auiCtxPause.call(this, auiCtx, $el, scope, handler);
                    },
                    unload: function($el, scope, handler) {
                        /*覆盖页面销毁时的属性或方法*/
                        auiCtx.auiCtxUnload.call(this, auiCtx, $el, scope, handler);
                    }
                };
            }
            return spaLifecycle;
        }(function() {
            var auiCtx, $el, scope, handler, g_globalParams = aweb.globalVariables, pageParams;
            auiCtx = {
                external: {},
                attr: {
                    indexLayout31: {
                        desp: "微网点",
                        widgetName: "首页布局3",
                        id: "indexLayout31"
                    },
                    mIndexLayout: {
                        desp: "移动端首页布局2",
                        widgetName: "移动端首页布局2",
                        id: "mIndexLayout"
                    }
                },
                css: {},
                configs: {
                    indexLayout31: {},
                    mIndexLayout: {
                        data: {
                            edmID: "30BA6071106FD981009C-A618",
                            name: "传输字段277",
                            id: 3,
                            url: "##0296635FBEFEEB875528-2AAD_URL_3##",
                            active: true,
                            uuid: "AF1E6F06B12C1C75E8BC-6720",
                            code: '##_VAR##.open(##_RESPONSE_DATA##,"AF1E6F06B12C1C75E8BC-6720")'
                        },
                        icon: "am icon-am-arrow-left",
                        name: "页面名称1",
                        type: "pageFlow"
                    }
                },
                pageNSL: [],
                widgetNSL: {},
                validations: {},
                lifecycle: {
                    mIndexLayout_load_init_000002: {
                        func: function() {
                            aweb.debug && aweb.stepTo("首页布局-index.layout-生命周期配置-移动端首页布局2初始操作1");
                            if (true) {
                                window.mobileOpen = app.open = auiCtx.variables.mIndexLayout.open;
                                window.mobileClose = app.close = auiCtx.variables.mIndexLayout.close;
                                if (/iP(hone|ad)/.test(window.navigator.userAgent)) {
                                    document.body.addEventListener("touchstart", function() {}, false);
                                }
                                if (!location.hash) {
                                    app.open({
                                        status: true,
                                        page: "mobileIndex#market#mobileIndex",
                                        title: "首页"
                                    });
                                }
                            } else {
                                app.jweixin.wxConfig({
                                    debug: false,
                                    isIndex: true,
                                    url: "https://www.awebide.com/AWEB_WebChat/webchat/token/signJsSDK",
                                    jsApiList: [ "chooseImage", "uploadImage", "scanQRCode" ],
                                    appId: "wx18aac8fbc828ae3a"
                                });
                                var path = window.app.queryString("path");
                                window.mobileOpen = app.open = auiCtx.variables.mIndexLayout.open;
                                window.mobileClose = app.close = auiCtx.variables.mIndexLayout.close;
                                if (path) {
                                    mobileOpen({
                                        status: true,
                                        fullScreen: true,
                                        page: path.replace(/_/g, "#"),
                                        id: "idx01"
                                    });
                                }
                            }
                        },
                        times: 0,
                        clock: 1e3,
                        immediate: false,
                        isPause: true
                    }
                },
                variables: {},
                ajaxOption: {
                    mIndexLayout_3: {
                        type: "POST",
                        url: "##0296635FBEFEEB875528-2AAD_URL_3##",
                        urlDivider: "/",
                        timeout: undefined,
                        noAgreeBusData: true,
                        ajaxProcessData: true,
                        ajaxNoBlobData: true,
                        validate: true,
                        validateSuccessCallback: null,
                        validateCleanCallback: null,
                        data: function() {
                            return undefined;
                        },
                        shelter: "正在加载数据，请稍候…",
                        success: function(response) {
                            if (response.status) {
                                auiCtx.variables.mIndexLayout.open(response, "AF1E6F06B12C1C75E8BC-6720");
                            } else if (response.errorMsg) {
                                app.alert(response.errorMsg, app.alert.ERROR);
                            }
                        }
                    }
                },
                eventCallback: {},
                delegateEvents: {},
                widgetLoadedEvents: {
                    mIndexLayout: function() {
                        $.ajax(auiCtx.ajaxOption.mIndexLayout_3);
                    }
                },
                intervals: {},
                auiCtxLoad: function(auiCtx, _$el, _scope, _handler) {
                    var configs = auiCtx.configs, attr = auiCtx.attr, css = auiCtx.css, variables = auiCtx.variables;
                    $el = _$el;
                    pageParams = scope = _scope;
                    handler = _handler;
                    auiCtx.$el = _$el;
                    auiCtx.scope = _scope;
                    auiCtx.handler = _handler;
                    handler.auiCtx = auiCtx;
                    variables.mIndexLayout = $AW.mobile.SoYLayout.indexLayout($("#mIndexLayout", $el), configs.mIndexLayout, attr.mIndexLayout, $AW.css("mobile.SoYLayout.indexLayout", css.mIndexLayout), auiCtx);
                    variables.indexLayout31 = $AW.viewer.indexLayout3($("#indexLayout31", $el), configs.indexLayout31, attr.indexLayout31, $AW.css("viewer.indexLayout3", css.indexLayout31), auiCtx);
                    auiCtx.widgetLoadedEvents.mIndexLayout();
                    auiCtx.lifecycle.mIndexLayout_load_init_000002.func();
                },
                auiCtxResume: function(auiCtx, $el, scope, handler) {},
                auiCtxPause: function(auiCtx, $el, scope, handler) {},
                auiCtxUnload: function(auiCtx, $el, scope, handler) {
                    auiCtx.variables.mIndexLayout.close();
                }
            };
            window.aweb && window.aweb.debug && (window.auiCtx = auiCtx);
            return auiCtx;
        }());
    };
});});