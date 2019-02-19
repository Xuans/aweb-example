define([], function () {
                return{
                    appInterfaces:[
    {
        "desp": "AWEB 核心框架",
        "children": [
            {
                "name": "Controller",
                "desp": "AWEB核心SPA框架",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "option",
                        "type": "object",
                        "desp": "参数",
                        "children": [
                            {
                                "name": "View",
                                "type": "object",
                                "desp": "SPA框架视图实现对象",
                                "defaultValue": "app.Controller.View",
                                "details": "非必需，SPA框架视图实现对象，至少需要实现open、close、setCurrentView、getCurrentView、removeView、switchView、resumeView这些方法，可以根据实际情况另外实现该方法",
                                "necessary": false
                            },
                            {
                                "name": "Model",
                                "type": "object",
                                "desp": "SPA框架数据模型实现对象",
                                "defaultValue": "app.Controller.Model",
                                "details": "非必需，SPA框架数据模型实现对象，需要实现load、pause、resume、unload、stepTo、setTimeout、clearTimeout、setInterval、clearInterval、delegateEvents、undelegateEvents，可以根据实际情况另外实现该方法",
                                "necessary": false
                            },
                            {
                                "name": "modulesPath",
                                "type": "string",
                                "desp": "模块路径",
                                "defaultValue": "module",
                                "details": "非必需，模块相对于WebContent的路径",
                                "necessary": false
                            },
                            {
                                "name": "separator",
                                "desp": "分割线",
                                "type": "string",
                                "defaultValue": "/",
                                "details": "非必需，模块地址的分割线，加入后台传过来的是error#404，将会被转移成\"./module/error/404/\"",
                                "necessary": false
                            },
                            {
                                "name": "mvvmConfName",
                                "type": "string",
                                "desp": "配置文件的名词",
                                "defaultValue": "mvvm.json",
                                "details": "非必需，在每个模块下都有此名的配置文件，用于记录该模块下单页页面js、html资源的路径",
                                "necessary": false
                            },
                            {
                                "name": "modulePath404",
                                "type": "string",
                                "desp": "404页面路径",
                                "defaultValue": "module/error/404/",
                                "details": "非必需，找不到页面的提示页面路径",
                                "necessary": false
                            },
                            {
                                "name": "validateCleanCallback",
                                "type": "handler",
                                "desp": "清理错误回调函数",
                                "details": "函数，非必需，说明见app.validate的cleanCallback部分",
                                "necessary": false
                            },
                            {
                                "name": "view",
                                "desp": "SPA框架视图配置",
                                "type": "object",
                                "necessary": true,
                                "children": [
                                    {
                                        "name": "isGlobal",
                                        "type": "boolean",
                                        "desp": "是否全局使用",
                                        "defaultValue": false,
                                        "details": "如果是全局的话，将会使用app.screen.addResizeHandler监听屏幕resize事件，另导航栏可以重置大小",
                                        "necessary": false
                                    },
                                    {
                                        "name": "ctn",
                                        "type": "string",
                                        "desp": "容器的jQuery选择器",
                                        "details": "必需，表示多标页的容器，建议传入jQuery对象",
                                        "necessary": true
                                    },
                                    {
                                        "name": "tabs",
                                        "type": "string",
                                        "desp": "多标签导航栏的jQuery选择器",
                                        "details": "必需，表示多标签导航栏的容器，建议传入jQuery对象",
                                        "necessary": true
                                    },
                                    {
                                        "name": "ctt",
                                        "type": "string",
                                        "desp": "页面内容的jQuery选择器",
                                        "details": "必需，表示页面内容的容器，建议传入jQuery对象",
                                        "necessary": true
                                    },
                                    {
                                        "name": "contextMenuOption",
                                        "type": "object",
                                        "desp": "多标签导航栏的右键配置",
                                        "details": "非必需,如果为false，则表示没有右键事件；具体例子，请见：app.router.tab.contextMenuOption",
                                        "necessary": false
                                    },
                                    {
                                        "name": "contextMenuCallback",
                                        "type": "object",
                                        "desp": "多标签导航栏的右键点击回调函数",
                                        "details": "如果contextMenuOption不为false，则必需，具体例子，请见：app.router.tab.contextMenuCallback",
                                        "necessary": false
                                    },
                                    {
                                        "name": "untitled",
                                        "type": "string",
                                        "desp": "默认标题",
                                        "details": "如果传入的标题没有的时候，默认标题",
                                        "necessary": false
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "returnValue": {
                    "name": "router",
                    "type": "object",
                    "desp": "路由",
                    "children": [
                        {
                            "name": "open",
                            "type": "object",
                            "desp": "打开标签页",
                            "details": "该方法挂载到app.open下，底层是调用router.tab.open方法",
                            "children": [
                                {
                                    "name": "option",
                                    "desp": "配置",
                                    "type": "object",
                                    "children": [
                                        {
                                            "name": "status",
                                            "type": "boolean",
                                            "desp": "状态是否正常",
                                            "defaultValue": false,
                                            "details": "必需"
                                        },
                                        {
                                            "name": "fixed",
                                            "type": "boolean",
                                            "desp": "标签页是否固定",
                                            "defaultValue": false,
                                            "details": "非必需，表示打开的标签页是否固定，该参数只在打开BLANK(新标签页)、WINDOW(新窗口)类型标签页时生效"
                                        },
                                        {
                                            "name": "content",
                                            "type": "object",
                                            "desp": "页面数据",
                                            "details": "在单页页面中，可以通过auiCtx.pageParams获取页面数据"
                                        },
                                        {
                                            "name": "page",
                                            "type": "string",
                                            "desp": "模块路径",
                                            "defaultValue": "error#404",
                                            "details": "使用井号#将文件夹进行分割"
                                        },
                                        {
                                            "name": "title",
                                            "type": "string",
                                            "desp": "标题",
                                            "details": "可以在初始化Controller时，设置option.view.untitled属性。如果是通过自子页面标题打开，title=undefined，则不会显示标题"
                                        },
                                        {
                                            "name": "type",
                                            "type": "string",
                                            "desp": "页面类型",
                                            "defaultValue": "BLANK",
                                            "details": "可选值有新标签页BLANK、子标签页SUB、当前标签页SELF、新窗口WINDOW"
                                        },
                                        {
                                            "name": "id",
                                            "type": "string",
                                            "desp": "页面的ID标识",
                                            "defaultValue": "BLANK",
                                            "details": "此ID与单页页面中的handler.id相同"
                                        },
                                        {
                                            "name": "hasFooter",
                                            "type": "boolean",
                                            "desp": "是否由底部按钮",
                                            "defaultValue": true,
                                            "details": "如果是通过子页面打开，可以设置子页面是否由底部footer按钮"
                                        },
                                        {
                                            "name": "height",
                                            "type": "string",
                                            "desp": "子页面高度",
                                            "defaultValue": "80%",
                                            "details": "如果是通过子页面打开，可以设置子页面的高度"
                                        },
                                        {
                                            "name": "width",
                                            "type": "string",
                                            "desp": "子页面宽度",
                                            "defaultValue": "80%",
                                            "details": "如果是通过子页面打开，可以设置子页面的宽度"
                                        },
                                        {
                                            "name": "fullscreen",
                                            "type": "boolean",
                                            "desp": "是否全屏",
                                            "defaultValue": "false",
                                            "details": "是否使用全屏打开"
                                        },
                                        {
                                            "name": "displayNav",
                                            "type": "boolean",
                                            "desp": "显示标签导航栏",
                                            "defaultValue": "true",
                                            "details": "是否显示标签导航栏"
                                        },
                                        {
                                            "desp": "项目地址",
                                            "defaultValue": "",
                                            "necessary": false,
                                            "details": "如果打开多个项目时，需要配置",
                                            "name": "server",
                                            "type": "string"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "tab",
                            "type": "object",
                            "desp": "视图实例",
                            "children": [
                                {
                                    "name": "close",
                                    "desp": "关闭标签页",
                                    "details": "该方法挂载到app.close下,底层是调用app.router.tab.close方法",
                                    "hasReturn": false,
                                    "params": [
                                        {
                                            "name": "domID",
                                            "type": "string",
                                            "desp": "页面数据模型的唯一ID",
                                            "defaultValue": "app.router.getCurrentHandler().domID",
                                            "details": "非必需，可以在单页页面中通过handler.domID获取，默认值为当前标签页"
                                        },
                                        {
                                            "name": "_doNotResume",
                                            "type": "boolean",
                                            "desp": "不调用上个页面的恢复动作",
                                            "defaultValue": "false",
                                            "details": "非必需，需要关闭多个页面的时候，可以将这个配置项加了优化性能，但可能会导致页面混乱，慎用"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                "hasReturn": true,
                "compatibility": "ie8",
                "appJsCode": "app.Controller",
                "edition": {
                    "aibs": "app.Controller_AIBS"
                }
            }
        ]
    },
    {
        "desp": "通信拦截层",
        "children": [
            {
                "name": "ajax",
                "desp": "异步请求",
                "belongTo": "closure",
                "hasReturn": true,
                "appJsCode": "app.ajax",
                "returnValue": {
                    "desp": "",
                    "defaultValue": "",
                    "name": "ajax",
                    "details": "",
                    "type": "object"
                },
                "params": [
                    {
                        "name": "option",
                        "type": "object",
                        "desp": "参数对象",
                        "children": [
                            {
                                "name": "id",
                                "type": "string",
                                "desp": "ID",
                                "keepType": true,
                                "noCompile": true,
                                "hidden": true,
                                "defaultValue": "%%_INDEX%%",
                                "formatter": "replace",
                                "necessary": false
                            },
                            {
                                "name": "desp",
                                "type": "string",
                                "desp": "描述",
                                "noCompile": true,
                                "keepType": true,
                                "formatter": "replace",
                                "defaultValue": "自定义事件%%_INDEX%%",
                                "necessary": false
                            },
                            {
                                "name": "async",
                                "type": "boolean",
                                "desp": "异步调用",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "cache",
                                "type": "boolean",
                                "desp": "使用数据缓存",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "url",
                                "type": "string",
                                "desp": "URL",
                                "formatter": "replace",
                                "defaultValue": "##%%_INDEX%%-OVERVIEW_URL##",
                                "keepType": true,
                                "details": "字符串，必需，提交到后台的地址",
                                "necessary": true
                            },
                            {
                                "name": "type",
                                "type": "string",
                                "desp": "传参方式",
                                "defaultValue": "POST",
                                "keepType": true,
                                "details": "字符串，必需，传参方式",
                                "necessary": false
                            },
                            {
                                "name": "contentType",
                                "type": "string",
                                "desp": "传输内容类型",
                                "defaultValue": "application/x-www-form-urlencoded;charset=utf-8",
                                "necessary": false
                            },
                            {
                                "name": "dataType",
                                "type": "string",
                                "desp": "返回内容类型",
                                "defaultValue": "json",
                                "necessary": false
                            },
                            {
                                "name": "traditional",
                                "type": "boolean",
                                "desp": "使用传统的方式来序列化数据",
                                "defaultValue": "true",
                                "necessary": false
                            },
                            {
                                "name": "data",
                                "type": "array",
                                "desp": "传输数据",
                                "details": "传输数据，非必需，提交到后台的数据",
                                "necessary": false
                            },
                            {
                                "name": "jsonp",
                                "type": "string",
                                "desp": "jsonp请求回调函数名",
                                "necessary": false
                            },
                            {
                                "name": "jsonpCallback",
                                "type": "handler",
                                "desp": "jsonp请求回调函数",
                                "necessary": false
                            },
                            {
                                "name": "traditional",
                                "type": "boolean",
                                "desp": "使用传统方式传输数据",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "username",
                                "type": "string",
                                "desp": "HTTP 访问认证请求的用户名",
                                "necessary": false
                            },
                            {
                                "name": "password",
                                "type": "string",
                                "desp": "HTTP 访问认证请求的密码",
                                "necessary": false
                            },
                            {
                                "name": "shelter",
                                "type": "string",
                                "desp": "遮罩",
                                "details": "布尔型或字符串，非必需，当值为false | undefined | null时，不显示遮罩；当为true时，显示遮罩；当为字符串时，显示遮罩和该字符串",
                                "necessary": false
                            },
                            {
                                "name": "validate",
                                "type": "boolean",
                                "desp": "是否校验",
                                "details": "布尔型，非必需，表示是否需要校验",
                                "necessary": false
                            },
                            {
                                "name": "validateSuccessCallback",
                                "type": "handler",
                                "desp": "校验成功函数",
                                "details": "函数，非必需，说明见app.validate的successCallback部分",
                                "necessary": false
                            },
                            {
                                "name": "validateErrorCallback",
                                "type": "handler",
                                "desp": "校验失败函数",
                                "details": "函数，非必需，说明见app.validate的errorCallback部分",
                                "necessary": false
                            },
                            {
                                "name": "validateCleanCallback",
                                "type": "handler",
                                "desp": "清理错误回调函数",
                                "details": "函数，非必需，说明见app.validate的cleanCallback部分",
                                "necessary": false
                            },
                            {
                                "name": "validateContinue",
                                "desp": "校验失败后是否继续校验",
                                "type": "boolean",
                                "defaultValue": true,
                                "details": "布尔型，非必需，说明见app.validate的isContitnue部分",
                                "necessary": false
                            },
                            {
                                "name": "timeout",
                                "domSelector": "ajaxTimeout",
                                "type": "number",
                                "defaultValue": "60000",
                                "desp": "超时时间（ms）",
                                "details": "异步请求超时时间，单位毫秒（ms）",
                                "necessary": false
                            },
                            {
                                "name": "noAgreeBusData",
                                "domSelector": "noAgreeBusData",
                                "type": "boolean",
                                "defaultValue": true,
                                "desp": "非AgreeBus传输协议",
                                "details": "默认使用通用传输协议，若关闭该项则使用abusParams:序列化字符串",
                                "necessary": false
                            },
                            {
                                "name": "ajaxProcessData",
                                "domSelector": "ajaxProcessData",
                                "type": "boolean",
                                "defaultValue": true,
                                "desp": "使用字节流传输数据",
                                "details": "默认使用字节流传输数据，如果使用二进制流传输数据，需要上传文件时，应该关闭该项",
                                "necessary": false
                            },
                            {
                                "name": "ajaxNoBlobData",
                                "domSelector": "ajaxNoBlobData",
                                "type": "boolean",
                                "defaultValue": true,
                                "desp": "使用字节流返回数据",
                                "details": "默认使用字节流返回数据，如果返回为文件流（二进制流），应该关闭该项",
                                "necessary": false
                            },
                            {
                                "name": "urlDivider",
                                "domSelector": "urlDivider",
                                "type": "string",
                                "defaultValue": "/",
                                "desp": "传输参数作为请求路径数据时的分隔符",
                                "details": "发起请求时，当传输参数作为路径的一部分时的分隔符",
                                "necessary": false
                            },
                            {
                                "name": "beforeSend",
                                "type": "handler",
                                "desp": "发送请求前回调",
                                "defaultValue": "function(XHR){}",
                                "details": "函数，非必需",
                                "params": [
                                    {
                                        "name": "XHR",
                                        "type": "object",
                                        "desp": "XMLHttpRequest 对象"
                                    }
                                ],
                                "necessary": false
                            },
                            {
                                "name": "success",
                                "type": "function",
                                "desp": "成功回调",
                                "defaultValue": "function(response){\n \t if (response.status) {} \n \telse if (response.errorMsg) {\n \tapp.alert(response.errorMsg, app.alert.ERROR);\n \t}\n}",
                                "params": [
                                    {
                                        "name": "response",
                                        "type": "object",
                                        "desp": "返回对象"
                                    }
                                ],
                                "necessary": true
                            },
                            {
                                "name": "error",
                                "type": "function",
                                "desp": "失败回调",
                                "defaultValue": "function(XHR, textStatus, errorThrown){}",
                                "params": [
                                    {
                                        "name": "XHR",
                                        "type": "object",
                                        "desp": "XMLHttpRequest 对象"
                                    },
                                    {
                                        "name": "textStatus",
                                        "type": "string",
                                        "desp": "状态"
                                    },
                                    {
                                        "name": "errorThrown",
                                        "type": "object",
                                        "desp": "错误对象"
                                    }
                                ],
                                "necessary": false
                            },
                            {
                                "name": "complete",
                                "type": "function",
                                "desp": "完成回调",
                                "defaultValue": "function(XHR, textStatus){}",
                                "params": [
                                    {
                                        "name": "XHR",
                                        "type": "object",
                                        "desp": "XMLHttpRequest 对象"
                                    },
                                    {
                                        "name": "textStatus",
                                        "type": "string",
                                        "desp": "状态"
                                    }
                                ],
                                "necessary": false
                            }
                        ]
                    }
                ],
                "edition": {
                    "mobile": "app.mobileHttp",
                    "agreeBus": "app.ajax_AgreeBus"
                },
                "compatibility": "ie8"
            }
        ]
    },
    {
        "desp": "便携操作",
        "children": [
            {
                "name": "alert",
                "desp": "提示框",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "message",
                        "type": "string",
                        "desp": "提示语句",
                        "details": "可以使HTML代码，消息内容，必需",
                        "necessary": true
                    },
                    {
                        "name": "alertType",
                        "type": "string_select",
                        "desp": "提示类型",
                        "details": "有“_DEFAULT\"(默认),\"SUCCESS\"(成功),\"ERROR\"(错误),\"WARNING\"(警告),\"MESSAGE\"(信息)五种类型，使用时许引用app.alert.showType",
                        "necessary": true
                    },
                    {
                        "name": "alertID",
                        "type": "string",
                        "desp": "提示语句ID",
                        "details": "提示语句ID，假如在消息队列中存在相同的ID，则不再重复提示",
                        "necessary": false
                    }
                ],
                "appJsCode": "app.alert",
                "edition": {
                    "mobile": "app.alert_mobile"
                },
                "hasReturn": false,
                "compatibility": "ie8"
            },
            {
                "name": "alertAction",
                "desp": "提示框操作",
                "belongTo": "class",
                "appJsCode": "app.alertAction",
                "cInterfaces": [
                    {
                        "name": "close",
                        "desp": "关闭提示框",
                        "params": [
                            {
                                "name": "option",
                                "type": "object",
                                "children": [
                                    {
                                        "name": "id",
                                        "desp": "需要关闭的提示框id",
                                        "type": "string",
                                        "necessary": true
                                    }
                                ]
                            }
                        ],
                        "details": "当调用app.alert有传入id时，输入该id可以关闭",
                        "defaultValue": "app.alertAction.close(\"1\")"
                    },
                    {
                        "name": "closeAll",
                        "desp": "关闭所有提示框",
                        "details": "关闭所有提示框"
                    },
                    {
                        "name": "getAlertList",
                        "desp": "获取所有正在执行的提示框列表",
                        "details": "获取所有正在执行的提示框列表信息，包括在界面上显示的提示框和在队列中的提示框，它将返回一个数组，里面每一个索引对应一个对象，包含每一个提示框的信息，0键对应提示框内容，1键对应提示框类型，2键对应提示框id",
                        "hasReturn": true,
                        "returnValue": {
                            "name": "alertList",
                            "type": "array",
                            "desp": "正在执行的所有提示框列表",
                            "defaultValue": "[{\"0\":\"msgContent1\",\"1\":\"error\",\"2\":\"id1\"},{\"0\":\"msgContent2\",\"1\":\"success\",\"2\":\"id2\"},{\"0\":\"msgContent3\",\"1\":\"warning\",\"2\":\"id3\"}]"
                        }
                    },
                    {
                        "name": "listener",
                        "desp": "监听alert事件",
                        "details": "监听alert事件",
                        "params": [
                            {
                                "name": "callback",
                                "desp": "回调函数",
                                "type": "handler",
                                "details": "回调函数，底层返回提示框参数作为入参",
                                "children": [
                                    {
                                        "name": "itemMsg",
                                        "desp": "提示框参数",
                                        "type": "object",
                                        "details": "提示框参数，包括当前提示框的信息、类型、id",
                                        "children": [
                                            {
                                                "name": "1",
                                                "type": "string",
                                                "desp": "当前提示框信息"
                                            },
                                            {
                                                "name": "2",
                                                "type": "string",
                                                "desp": "当前提示框类型"
                                            },
                                            {
                                                "name": "3",
                                                "type": "string",
                                                "desp": "当前提示框的id"
                                            }
                                        ]
                                    }
                                ],
                                "necessary": true
                            }
                        ]
                    }
                ],
                "compatibility": "ie8"
            },
            {
                "name": "behavior",
                "desp": "行为接口",
                "belongTo": "closure",
                "appJsCode": "app.behavior",
                "params": [
                    {
                        "name": "input1",
                        "desp": "输入值",
                        "details": "输入值一般从组件中获取,比较类型：小于、大于时：数字；等于、不等于时：字符串、数字、对象、数组、null；包含、不包含时：字符串、数组、对象；其中数组的格式为[1,2,3,\"a\",\"b\",\"c\"]，对象格式为{\"a\":1,\"b\":[],\"c\":\"abc\"}",
                        "type": "string",
                        "necessary": true
                    },
                    {
                        "name": "input2",
                        "desp": "比较值",
                        "details": "比较类型：小于、大于时：数字；等于、不等于时：字符串、数字、对象、数组、null；包含、不包含时：字符串、数组、对象；其中数组的格式为[1,2,3,\"a\",\"b\",\"c\"]，对象格式为{\"a\":1,\"b\":[],\"c\":\"abc\"}",
                        "type": "string",
                        "necessary": true
                    },
                    {
                        "desp": "比较条件",
                        "name": "condition",
                        "details": "比较字段值和输入值返回结果。例如：\n小于：字段值0，比较值1，返回true；\n等于：字段值0，比较值1，返回false；\n不等于：字段值：1，比较值2，返回true；\n包含：字段值\"abc\"，比较值\"startabc\"，返回true；\n字段值\"a\"，比较值[1,2,]，返回true；\n开头：字段值\"abc\"，比较值\"abcd\"，返回true；",
                        "type": "string",
                        "necessary": true
                    },
                    {
                        "desp": "回调函数",
                        "name": "callback",
                        "defaultValue": "function(result,input1,input2,condition){}",
                        "details": "将比较结果（result）、输入值（input1）、比较值（input2）、比较条件（condition）传个回调函数，进行处理",
                        "type": "handler",
                        "necessary": true
                    }
                ],
                "hasReturn": false,
                "compatibility": "ie8"
            },
            {
                "require": true,
                "name": "collapse",
                "desp": "折叠菜单功能",
                "belongTo": "closure",
                "appJsCode": "app.collapse",
                "hasReturn": false
            },
            {
                "name": "deepClone",
                "desp": "深克隆",
                "params": [
                    {
                        "name": "object",
                        "desp": "待克隆对象",
                        "type": "object",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": "app.deepClone",
                "returnValue": {
                    "name": "deepClonedObject",
                    "type": "object",
                    "desp": "深克隆对象"
                },
                "compatibility": "ie8"
            },
            {
                "name": "dispatcher",
                "desp": "事件分发",
                "details": "实现自定义事件",
                "belongTo": "closure",
                "appJsCode": "app.dispatcher",
                "params": [
                    {
                        "name": "timeout",
                        "desp": "时间(毫秒)",
                        "details": "分发事件的时间",
                        "type": "number",
                        "necessary": false
                    }
                ],
                "returnValue": {
                    "desp": "事件实例",
                    "name": "eventInstance",
                    "details": "",
                    "type": "object",
                    "children": [
                        {
                            "name": "on",
                            "desp": "定义事件",
                            "details": "$AW.on({\"type1.namespace1.namespace2\":callback1,\"type2.namespace1.namespace2\":callback2});$AW.on(\"type1.namespace1.namespace2,type2.namespace1.namespace2\",callback);$AW.on(\"type1\",\"namespace\",callback);",
                            "type": "function"
                        },
                        {
                            "name": "off",
                            "desp": "解绑事件",
                            "type": "function",
                            "details": "$AW.off(\"type1.namespace1.namespace2,type2.namespace1.namespace2,\")"
                        },
                        {
                            "name": "trigger",
                            "desp": "触发事件",
                            "type": "function",
                            "details": "$AW.trigger(\"type1.namespace1.namespace2,type2.namespace1.namespace2,\")"
                        }
                    ]
                },
                "hasReturn": true,
                "compatibility": "ie8"
            },
            {
                "name": "eval",
                "desp": "将函数字符串转化成可执行函数，并将代码的作用域限定在闭包中",
                "hasReturn": true,
                "appJsCode": "app.eval",
                "params": [
                    {
                        "name": "functionString",
                        "defaultValue": "function(key){console.log(key);}",
                        "desp": "JavaScript函数字符串",
                        "type": "string",
                        "necessary": true
                    }
                ],
                "returnValue": {
                    "name": "func",
                    "type": "function",
                    "desp": "转义后的代码"
                },
                "compatibility": "ie8"
            },
            {
                "name": "getUA",
                "desp": "获取设备终端信息",
                "belongTo": "closure",
                "hasReturn": true,
                "appJsCode": "app.getUA",
                "ReturnValue": {
                    "name": "result",
                    "type": "string",
                    "desp": "设备终端信息,包含浏览器环境（weixin--\"微信\"、Alipay--\"支付宝\"、Cordova--类似于cordova环境、Ionic--类似于Ionic环境）、设备类型（PC(非IE内核）、IE、iPad、iPhone、androidPhone、androidPad)",
                    "defaultValue": "weixin iPhone"
                },
                "compatibility": "ie8"
            },
            {
                "name": "getUID",
                "desp": "获取唯一的ID",
                "hasReturn": true,
                "appJsCode": "app.getUID",
                "returnValue": {
                    "name": "uid",
                    "type": "string",
                    "desp": "唯一的ID",
                    "defaultValue": "87C0D1E26342B2A334DB-FC8D"
                },
                "compatibility": "ie8"
            },
            {
                "require": true,
                "name": "hsla",
                "desp": "生成随机颜色（不支持IE8）",
                "compatibility": "modernBrowser",
                "belongTo": "closure",
                "appJsCode": "app.hsla",
                "params": [
                    {
                        "name": "option",
                        "type": "object",
                        "desp": "选项",
                        "children": [
                            {
                                "name": "h",
                                "type": "number",
                                "desp": "颜色值",
                                "details": "整型，非必需，表示需要生成颜色的值，范围为[0,360),如果isRandom=true,则h不需要填，填了也不会生效"
                            },
                            {
                                "name": "s",
                                "type": "string",
                                "desp": "颜色对比度",
                                "details": "百分比，字符串型，必需，表示需要生成颜色的对比度，范围为[0,100%)"
                            },
                            {
                                "name": "l",
                                "type": "string",
                                "desp": "颜色亮度",
                                "details": "百分比，字符串型，必需，表示需要生成颜色的亮度，范围为[0,100%)"
                            },
                            {
                                "name": "a",
                                "type": "number",
                                "desp": "颜色透明度",
                                "details": "数值型，必需，表示需要生成颜色的透明度，范围为[0,1]"
                            }
                        ]
                    },
                    {
                        "name": "isRandom",
                        "type": "boolean",
                        "desp": "需要随机生成颜色的值",
                        "details": "布尔型，option.h存在则非必需，否则必需。表示需要随机生成颜色的值"
                    }
                ],
                "hasReturn": true,
                "returnValue": {
                    "name": "color",
                    "type": "string",
                    "desp": "返回颜色",
                    "details": "在现代浏览器下，返回rgba(red,green.blur,alpha)格式的颜色；在IE8或以下，则返回rgb(red,green,blue)"
                }
            },
            {
                "name": "modal",
                "desp": "弹窗",
                "belongTo": "closure",
                "appJsCode": "app.modal",
                "params": [
                    {
                        "name": "option",
                        "desp": "配置",
                        "type": "object",
                        "children": [
                            {
                                "name": "title",
                                "type": "string",
                                "desp": "标题",
                                "defaultValue": "弹窗",
                                "details": "弹窗标题，非必填",
                                "necessary": false
                            },
                            {
                                "name": "content",
                                "type": "string",
                                "desp": "弹窗内容",
                                "defaultValue": "弹窗内容",
                                "details": "可以是html字符串；或函数，返回内容的jQuery对象",
                                "necessary": true
                            },
                            {
                                "name": "btnConfirm",
                                "type": "string",
                                "desp": "确定按钮显示的内容",
                                "defaultValue": "确定",
                                "details": "如果填写false，则不会显示确定按钮",
                                "necessary": false
                            },
                            {
                                "name": "btnCancel",
                                "type": "string",
                                "desp": "取消按钮显示的内容",
                                "defaultValue": "取消",
                                "details": "如果填写false，则不会显示取消按钮",
                                "necessary": false
                            },
                            {
                                "name": "btnIgnore",
                                "type": "string",
                                "desp": "忽略按钮显示的内容",
                                "details": "如果没有填写忽略按钮的内容，则不会显示忽略按钮",
                                "necessary": false
                            },
                            {
                                "name": "init",
                                "type": "handler",
                                "desp": "初始化函数",
                                "defaultValue": "function(){}",
                                "details": "打开弹窗时，加载的方法，其中入参为agrs的参数，this指向内容的DOM对象",
                                "necessary": false
                            },
                            {
                                "name": "confirmHandler",
                                "type": "handler",
                                "desp": "确定按钮点击事件",
                                "defaultValue": "function(){}",
                                "details": "确定按钮点击事件，其中入参为agrs的参数，this指向按钮的DOM对象，当return false时，将不隐藏弹窗",
                                "necessary": true
                            },
                            {
                                "name": "cancelHandler",
                                "type": "handler",
                                "desp": "取消按钮点击事件",
                                "defaultValue": "function(){}",
                                "details": "取消按钮点击事件，其中入参为agrs的参数，this指向按钮的DOM对象，当return false时，将不隐藏弹窗",
                                "necessary": false
                            },
                            {
                                "name": "ignoreHandler",
                                "type": "handler",
                                "desp": "忽略按钮点击事件",
                                "defaultValue": "function(){}",
                                "details": "忽略按钮点击事件，其中入参为agrs的参数，this指向按钮的DOM对象，当return false时，将不隐藏弹窗",
                                "necessary": false
                            },
                            {
                                "name": "args",
                                "type": "array",
                                "desp": "入参",
                                "defaultValue": [],
                                "necessary": false
                            },
                            {
                                "name": "isLargeModal",
                                "type": "boolean",
                                "desp": "是否为大的弹窗",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "isDialog",
                                "type": "boolean",
                                "desp": "是否为对话框",
                                "defaultValue": true,
                                "necessary": false
                            },
                            {
                                "name": "backdrop",
                                "type": "string",
                                "desp": "遮罩配置",
                                "defaultValue": "static",
                                "details": "遮罩可选项为true|false|\"static\"",
                                "necessary": false
                            },
                            {
                                "name": "height",
                                "type": "string",
                                "desp": "高度",
                                "defaultValue": "80%",
                                "details": "当isLargeModal=true,isDialog=false时，可配置高度",
                                "necessary": false
                            },
                            {
                                "name": "width",
                                "type": "string",
                                "desp": "宽度",
                                "defaultValue": "80%",
                                "details": "当isLargeModal=true,isDialog=false时，可配置宽度",
                                "necessary": false
                            },
                            {
                                "name": "noHeader",
                                "type": "boolean",
                                "desp": "取消顶部标题",
                                "defaultValue": false,
                                "necessary": false
                            },
                            {
                                "name": "noFooter",
                                "type": "boolean",
                                "desp": "取消底部按钮",
                                "defaultValue": false,
                                "necessary": false
                            }
                        ],
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "returnValue": {
                    "name": "warp",
                    "type": "object",
                    "desp": "包裹成弹窗",
                    "details": "将普通容器包括成弹窗",
                    "children": [
                        {
                            "name": "$modalBody",
                            "type": "object",
                            "desp": "需要被包括的内容的jQuery对象"
                        },
                        {
                            "name": "option",
                            "desp": "详细配置",
                            "type": "object",
                            "details": "详细配置与app.modal入参一致"
                        }
                    ]
                },
                "compatibility": "ie8"
            },
            {
                "name": "parseJSObject",
                "desp": "将对象字符串转化成JavaScript对象",
                "params": [
                    {
                        "name": "objectString",
                        "desp": "JavaScript函数字符串",
                        "type": "string",
                        "defaultValue": "'{\"key1\":\"value1\",\"key2\":true,\"key3\":[],\"key4\":{}}'",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": "app.parseJSObject",
                "returnValue": {
                    "name": "result",
                    "type": "object",
                    "desp": "将JavaScript对象序列化后的结果",
                    "children": [
                        {
                            "name": "key1",
                            "desp": "键名1",
                            "type": "string",
                            "defaultValue": "value1"
                        },
                        {
                            "name": "key2",
                            "desp": "键名2",
                            "type": "boolean",
                            "defaultValue": true
                        },
                        {
                            "name": "key3",
                            "desp": "键名3",
                            "type": "array",
                            "defaultValue": []
                        },
                        {
                            "name": "key4",
                            "desp": "键名4",
                            "type": "object",
                            "defaultValue": {}
                        }
                    ]
                },
                "compatibility": "ie8"
            },
            {
                "name": "popover",
                "desp": "气泡",
                "belongTo": "closure",
                "appJsCode": "app.popover",
                "params": [
                    {
                        "name": "option",
                        "desp": "配置",
                        "type": "object",
                        "children": [
                            {
                                "name": "$elem",
                                "type": "jQuery",
                                "desp": "气泡的触发元素",
                                "defaultValue": "$el",
                                "details": "表示气泡触发元素的jQuery对象",
                                "necessary": true
                            },
                            {
                                "name": "title",
                                "type": "string",
                                "desp": "标题",
                                "defaultValue": "气泡",
                                "details": "气泡标题，非必填",
                                "necessary": false
                            },
                            {
                                "name": "content",
                                "type": "string",
                                "desp": "气泡内容",
                                "defaultValue": "气泡内容",
                                "details": "可以是html字符串；或函数，返回内容的jQuery对象",
                                "necessary": true
                            },
                            {
                                "name": "hasHeader",
                                "type": "boolean",
                                "desp": "是否显示气泡顶部(标题、按钮)",
                                "defaultValue": "true",
                                "details": "配置是否显示气泡顶部",
                                "necessary": false
                            },
                            {
                                "name": "init",
                                "type": "handler",
                                "desp": "初始化函数",
                                "defaultValue": "function(){}",
                                "details": "打开气泡时，加载内容的方法，其中入参为agrs的参数，第一个参数为 Pop 气泡实例对象，this指向气泡的 jQuery 对象",
                                "necessary": false
                            },
                            {
                                "name": "confirmHandler",
                                "type": "handler",
                                "desp": "关闭确认事件",
                                "defaultValue": "function(){}",
                                "details": "确定按钮点击事件，其中入参为agrs的参数，第一个参数为 Pop 气泡实例对象，this 指向 Pop 气泡实例对象，this.$tip 指向气泡的 jQuery 对象",
                                "necessary": false
                            },
                            {
                                "name": "args",
                                "type": "array",
                                "desp": "入参",
                                "defaultValue": [],
                                "necessary": false
                            },
                            {
                                "name": "on",
                                "type": "object",
                                "desp": "新增按钮配置",
                                "details": "为气泡窗口新增按钮组的按钮，并配置相关参数",
                                "children": [
                                    {
                                        "name": "iconBtn",
                                        "type": "object",
                                        "desp": "按钮配置",
                                        "details": "配置一个新的按钮",
                                        "children": [
                                            {
                                                "name": "btnName",
                                                "type": "string",
                                                "desp": "按钮名称",
                                                "defaultValue": "",
                                                "details": "必需，配置按钮功能的英文名称，填入按钮的功能名，如\"preview\"",
                                                "necessary": true
                                            },
                                            {
                                                "name": "icon",
                                                "type": "string",
                                                "desp": "按钮图标",
                                                "defaultValue": "",
                                                "details": "必需，配置按钮的图标，填入icon的CSS类名，如\"aui-guanbi\"",
                                                "necessary": true
                                            },
                                            {
                                                "name": "title",
                                                "type": "string",
                                                "desp": "按钮描述",
                                                "defaultValue": "",
                                                "details": "必需，配置按钮的描述，如\"关闭\"",
                                                "necessary": true
                                            },
                                            {
                                                "name": "callback",
                                                "type": "handler",
                                                "desp": "按钮事件",
                                                "defaultValue": "function(){}",
                                                "details": "必需，新增按钮事件，其中入参为 e 事件对象和 context Pop气泡实例（上下文），this指向气泡的 DOM 对象",
                                                "necessary": true
                                            }
                                        ]
                                    }
                                ],
                                "necessary": false
                            },
                            {
                                "name": "height",
                                "type": "string",
                                "desp": "高度",
                                "defaultValue": "80%",
                                "details": "可配置气泡高度",
                                "necessary": false
                            },
                            {
                                "name": "width",
                                "type": "string",
                                "desp": "宽度",
                                "defaultValue": "80%",
                                "details": "可配置气泡宽度",
                                "necessary": false
                            },
                            {
                                "name": "placement",
                                "type": "string",
                                "desp": "显示位置",
                                "defaultValue": "right auto",
                                "details": "可配置 (top | bottom | left | right | auto)，如果使用\"auto\"，将会再次调整，比如声明\"right auto\" 弹出框将尽量显示在右边，实在不行才显示在左边 ",
                                "necessary": false
                            },
                            {
                                "name": "focusable",
                                "type": "boolean",
                                "desp": "可否失焦触发气泡消失",
                                "defaultValue": true,
                                "details": "默认可通过失焦触发气泡消失，代码气泡不通过失焦触发气泡消失，需要设置 false",
                                "necessary": false
                            }
                        ],
                        "necessary": true
                    }
                ],
                "hasReturn": false,
                "compatibility": "ie8"
            },
            {
                "require": true,
                "name": "position",
                "desp": "获取鼠标事件的定位",
                "appJsCode": "app.position",
                "params": [
                    {
                        "name": "event",
                        "type": "object",
                        "desp": "事件对象",
                        "details": "事件对象，鼠标监听事件的参数，必需",
                        "necessary": true
                    },
                    {
                        "name": "$container",
                        "type": "jQuery",
                        "desp": "鼠标容器的JQuery对象",
                        "details": "鼠标容器的JQuery对象，必需",
                        "necessary": true
                    },
                    {
                        "name": "$content",
                        "type": "jQuery",
                        "desp": "鼠标点击的直接容器的jQuery对象",
                        "details": "鼠标点击的直接容器的jQuery对象，必需",
                        "necessary": true
                    },
                    {
                        "name": "fixTop",
                        "type": "number",
                        "desp": "向上修正的数值",
                        "details": "数值型，向上修正的数值，缺省值0，非必需",
                        "defaultValue": 0,
                        "necessary": false
                    },
                    {
                        "name": "fixLeft",
                        "type": "number",
                        "desp": "向左修正的数值",
                        "details": "数值型，向左修正的数值，缺省值0，非必需",
                        "defaultValue": 0,
                        "necessary": false
                    }
                ],
                "hasReturn": true,
                "returnValue": {
                    "name": "pointer",
                    "type": "object",
                    "desp": "坐标",
                    "children": [
                        {
                            "name": "top",
                            "type": "number",
                            "desp": "$content相对于$container顶部的位置"
                        },
                        {
                            "name": "left",
                            "type": "number",
                            "desp": "$content相对于$container左侧的位置"
                        }
                    ]
                },
                "compatibility": "ie8"
            },
            {
                "name": "reset",
                "desp": "重置表单",
                "details": "将表单内的表单元素的值设置为空或清除选中。弃用接口，不建议使用",
                "hasReturn": false,
                "appJsCode": "app.reset",
                "params": [
                    {
                        "name": "$form",
                        "type": "jQuery",
                        "desp": "表单容器的jQuery对象",
                        "details": "必需，表示表单容器的jQuery对象",
                        "necessary": true
                    },
                    {
                        "name": "auiCtx",
                        "type": "object",
                        "desp": "页面上下文",
                        "details": "必需，就填auiCtx这个对象，表示页面的上下文",
                        "necessary": true
                    }
                ],
                "compatibility": "ie8"
            },
            {
                "require": true,
                "name": "screen",
                "desp": "视图监听类",
                "belongTo": "class",
                "appJsCode": "app.screen",
                "cInterfaces": [
                    {
                        "name": "addResizeHandler",
                        "desp": "添加窗口大小变化监听事件",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "options",
                                "desp": "选项",
                                "type": "object",
                                "children": [
                                    {
                                        "name": "uid",
                                        "desp": "唯一的id",
                                        "type": "string",
                                        "details": "如果可以isGlobal=true，uid可以通过app.getUID()获取，否则则等于某个页面内的handler.domID，必需",
                                        "necessary": true
                                    },
                                    {
                                        "name": "isGlobal",
                                        "type": "boolean",
                                        "desp": "整个页面框架起作用",
                                        "details": "布尔型，是否是整个页面框架起作用，如果在某个页面起作用的话，则为false，必需",
                                        "necessary": true
                                    },
                                    {
                                        "name": "timeout",
                                        "desp": "延迟",
                                        "type": "number",
                                        "defaultValue": 0,
                                        "details": "数字型，窗口大小改变之后，延迟多少毫秒执行，缺省值0，即一旦窗口大小改变立即执行，非必需",
                                        "necessary": false
                                    },
                                    {
                                        "name": "callback",
                                        "desp": "回调函数",
                                        "type": "handler",
                                        "details": "函数，窗口大小改变后执行，必需",
                                        "necessary": true
                                    }
                                ],
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "triggerResizeHandler",
                        "desp": "模拟触发触发窗口大小变化事件",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "uid",
                                "desp": "唯一的id",
                                "type": "string",
                                "details": "如果可以isGlobal=true，uid可以通过app.getUID()获取，否则则等于某个页面内的handler.domID，必需",
                                "necessary": true
                            },
                            {
                                "name": "isGlobal",
                                "type": "boolean",
                                "desp": "整个页面框架起作用",
                                "details": "布尔型，是否是整个页面框架起作用，如果在某个页面起作用的话，则为false，必需",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "removeResizeHandler",
                        "desp": "移除窗口大小变化回调",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "uid",
                                "desp": "唯一的id",
                                "type": "string",
                                "details": "如果可以isGlobal=true，uid可以通过app.getUID()获取，否则则等于某个页面内的handler.domID，必需",
                                "necessary": true
                            },
                            {
                                "name": "isGlobal",
                                "type": "boolean",
                                "desp": "整个页面框架起作用",
                                "details": "布尔型，是否是整个页面框架起作用，如果在某个页面起作用的话，则为false，必需",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "compatibility": "ie8"
            },
            {
                "require": true,
                "name": "scrollTop",
                "desp": "滚动至父容器顶部",
                "hasReturn": false,
                "appJsCode": "app.scrollTop",
                "params": [
                    {
                        "name": "$container",
                        "type": "jQuery",
                        "desp": "可滚动的容器jQuery对象",
                        "details": "可滚动的容器jQuery对象，必需",
                        "necessary": true
                    },
                    {
                        "name": "$content",
                        "type": "jQuery",
                        "desp": "需要滚动到顶部的jQuery对象",
                        "details": "需要滚动到顶部的jQuery对象，必需；其中$content必需在$container内",
                        "necessary": true
                    },
                    {
                        "name": "speed",
                        "type": "number",
                        "desp": "滚动速度",
                        "details": "滚动速度，单位毫秒，缺省值200，非必需",
                        "defaultValue": 200,
                        "necessary": false
                    },
                    {
                        "name": "marginTop",
                        "type": "number",
                        "desp": "在滚动上还需要移动的高度",
                        "details": "数值型，必需大于0，在滚动上，还需要移动的高度，缺省值0，非必需",
                        "defaultValue": 0,
                        "necessary": false
                    }
                ],
                "compatibility": "ie8"
            },
            {
                "name": "select",
                "desp": "选择",
                "hidden": true,
                "hasReturn": false,
                "appJsCode": "app.select",
                "details": "该方法用于表格单选、多选",
                "compatibility": "ie8"
            },
            {
                "name": "shelter",
                "desp": "遮罩",
                "details": "实现遮罩的显示和隐藏,用于禁止在获取后台数据或加载数据等短时间内用户的操作",
                "belongTo": "class",
                "appJsCode": "app.shelter",
                "cInterfaces": [
                    {
                        "name": "show",
                        "desp": "显示遮罩",
                        "details": "显示遮罩，显示超时时间为60秒",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "tips",
                                "type": "string",
                                "desp": "提示语句",
                                "details": "遮罩显示的内容，非必需",
                                "necessary": false
                            },
                            {
                                "name": "timeout",
                                "type": "number",
                                "desp": "超时时间",
                                "details": "遮罩超时时间，缺省值60000ms，即60s。遮罩超过60s则报错超时错误并隐藏遮罩。非必需",
                                "defaultValue": 60000,
                                "necessary": false
                            },
                            {
                                "name": "immediate",
                                "type": "boolean",
                                "desp": "是否立刻执行",
                                "details": "是否立即显示遮罩，缺省值220ms后显示。非必需",
                                "necessary": false
                            },
                            {
                                "name": "$context",
                                "type": "jQuery选择器",
                                "desp": "遮罩显示范围的jQuery选择器",
                                "details": "参数为undefined时，默认当前页面模型的父容器，当接口为移动端版本时，该参数无效",
                                "necessary": false
                            }
                        ]
                    },
                    {
                        "name": "hide",
                        "desp": "隐藏最顶部的遮罩",
                        "hasReturn": false
                    },
                    {
                        "name": "hideAll",
                        "desp": "隐藏所有遮罩，不推荐使用",
                        "hasReturn": false
                    },
                    {
                        "name": "lowerZIndex",
                        "desp": "恢复遮罩层z-index",
                        "hasReturn": false
                    },
                    {
                        "name": "upperZIndex",
                        "desp": "提升遮罩层z-index",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "alertZIndex",
                                "desp": "提示栏z-index",
                                "type": "string",
                                "details": "提升提示栏的z-index，缺省值1052。为false时，表示不设置",
                                "defaultValue": "1052",
                                "necessary": false
                            },
                            {
                                "name": "maskZIndex",
                                "desp": "遮罩层的z-index",
                                "type": "string",
                                "details": "提升遮罩层的z-index，缺省值4。右侧边栏的z-index为1062",
                                "defaultValue": "4",
                                "necessary": false
                            },
                            {
                                "name": "alertTop",
                                "desp": "提示栏的top",
                                "type": "string",
                                "details": "设置提示栏的top，缺省值auto。为false时，表示不设置",
                                "defaultValue": "auto",
                                "necessary": false
                            }
                        ]
                    }
                ],
                "compatibility": "ie8",
                "edition": {
                    "mobile": "app.shelter_mobile"
                }
            },
            {
                "name": "stringify",
                "desp": "将JavaScript对象转化成字符串，并将函数、对象序列化",
                "params": [
                    {
                        "name": "object",
                        "desp": "必需，JavaScript对象",
                        "type": "object",
                        "children": [
                            {
                                "name": "key1",
                                "desp": "键名1",
                                "type": "string",
                                "defaultValue": "value1",
                                "necessary": true
                            },
                            {
                                "name": "key2",
                                "desp": "键名2",
                                "type": "boolean",
                                "defaultValue": true,
                                "necessary": true
                            },
                            {
                                "name": "key3",
                                "desp": "键名3",
                                "type": "array",
                                "defaultValue": [],
                                "necessary": true
                            },
                            {
                                "name": "key4",
                                "desp": "键名4",
                                "type": "object",
                                "defaultValue": {},
                                "necessary": true
                            }
                        ],
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": "app.stringify",
                "returnValue": {
                    "name": "result",
                    "type": "string",
                    "desp": "将JavaScript对象序列化后的结果",
                    "defaultValue": "'{\"key1\":\"value1\",\"key2\":true,\"key3\":[],\"key4\":{}}'"
                },
                "compatibility": "ie8"
            }
        ]
    },
    {
        "desp": "数据操作",
        "children": [
            {
                "name": "domain",
                "desp": "公共数据缓存池",
                "belongTo": "class",
                "appJsCode": "app.domain",
                "cInterfaces": [
                    {
                        "name": "exports",
                        "desp": "将数据写入公共数据缓存池",
                        "params": [
                            {
                                "name": "namespace",
                                "type": "string",
                                "desp": "命名空间",
                                "defaultValue": "page",
                                "details": "必需，字符串类型，储存数据的命名空间；",
                                "necessary": true
                            },
                            {
                                "name": "data",
                                "type": "object",
                                "desp": "JavaScript对象数据",
                                "details": "必需，json数据，需要跨页储存的数据；",
                                "necessary": true,
                                "children": [
                                    {
                                        "name": "key1",
                                        "desp": "键名1",
                                        "type": "string",
                                        "defaultValue": "value1",
                                        "necessary": true
                                    },
                                    {
                                        "name": "key2",
                                        "desp": "键名2",
                                        "type": "boolean",
                                        "defaultValue": true,
                                        "necessary": false
                                    },
                                    {
                                        "name": "key3",
                                        "desp": "键名3",
                                        "type": "array",
                                        "defaultValue": [],
                                        "necessary": false
                                    },
                                    {
                                        "name": "key4",
                                        "desp": "键名4",
                                        "type": "object",
                                        "defaultValue": {},
                                        "necessary": false
                                    }
                                ]
                            }
                        ],
                        "hasReturn": false
                    },
                    {
                        "name": "get",
                        "desp": "获取公共数据缓存池的数据",
                        "params": [
                            {
                                "name": "namespace",
                                "type": "string",
                                "desp": "命名空间",
                                "defaultValue": "page",
                                "details": "必需，字符串类型，储存数据的命名空间；",
                                "necessary": true
                            },
                            {
                                "name": "key",
                                "type": "string",
                                "desp": "存取数据的键",
                                "defaultValue": "key4",
                                "details": "非必需，字符串类型，储存数据的键",
                                "necessary": false
                            }
                        ],
                        "hasReturn": true,
                        "returnValue": {
                            "name": "data",
                            "type": "object",
                            "defaultValue": {},
                            "desp": "当键（key）没有声明的情况下，将返回命名空间下所有的数据副本 ；否则将返回该命名空间下该键中的数据副本"
                        }
                    },
                    {
                        "name": "clearScope",
                        "desp": "清除公共数据缓存池某个命名空间下的数据",
                        "params": [
                            {
                                "name": "namespace",
                                "type": "string",
                                "desp": "命名空间",
                                "details": "必需，字符串类型，储存数据的命名空间",
                                "necessary": true
                            }
                        ],
                        "hasReturn": false
                    }
                ],
                "compatibility": "ie8"
            },
            {
                "name": "getData",
                "desp": "从浏览器缓存中获取数据",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "desp": "存储的数据名称",
                        "details": "字符串，存储的数据名称，必需",
                        "necessary": true
                    },
                    {
                        "name": "fromCookie",
                        "type": "boolean",
                        "desp": "是否从cookie中获取数据",
                        "defaultValue": false,
                        "details": "布尔型，是否从cookie中获取数据，缺省值false，即默认从localStorage获取，若失败则从cookie获取，非必需",
                        "necessary": false
                    }
                ],
                "appJsCode": "app.getData",
                "hasReturn": true,
                "returnValue": {
                    "name": "data",
                    "type": "string",
                    "details": "字符串，获取成功，返回JSON格式的字符串，获取失败则返回空字符串。可以使用app.parseJSObject转化为javaScript对象",
                    "desp": "JSON格式字符串"
                },
                "compatibility": "ie8"
            },
            {
                "name": "getFormatData",
                "desp": "数字格式转换",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "num",
                        "desp": "需要处理的数字",
                        "type": "number",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": "app.getFormatData",
                "returnValue": {
                    "name": "translatedNum",
                    "type": "number",
                    "desp": "处理完的数字"
                },
                "compatibility": "ie8"
            },
            {
                "name": "getNewQueryStringURL",
                "desp": "获取更新后的页面内查询字符串",
                "hasReturn": true,
                "appJsCode": "app.getNewQueryStringURL",
                "params": [
                    {
                        "name": "newParams",
                        "type": "object",
                        "desp": "新加入的参数",
                        "details": "fullscreen=true为例",
                        "necessary": true,
                        "children": [
                            {
                                "name": "fullscreen",
                                "type": "string",
                                "desp": "键值对",
                                "defaultValue": "true",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "returnValue": {
                    "name": "newQueryString",
                    "type": "string",
                    "desp": "页面内查询字符串列表",
                    "details": "以http://localhost:8080/index.html?timeStamp=12465为例",
                    "defaultValue": "timeStamp=12346&fullscreen=true"
                },
                "compatibility": "ie8"
            },
            {
                "name": "getQueryStringMap",
                "desp": "获取页面内查询字符串映射表",
                "hasReturn": true,
                "appJsCode": "app.getQueryStringMap",
                "returnValue": {
                    "name": "queryStringMap",
                    "type": "object",
                    "desp": "页面内查询字符串列表",
                    "details": "以http://localhost:8080/index.html?timeStamp=12465为例",
                    "children": [
                        {
                            "name": "timeStamp",
                            "type": "string",
                            "desp": "键值对",
                            "defaultValue": "12465"
                        }
                    ]
                },
                "compatibility": "ie8"
            },
            {
                "name": "queryString",
                "desp": "获取页面内查询字符串",
                "params": [
                    {
                        "name": "key",
                        "type": "string",
                        "desp": "queryString的键名",
                        "details": "以http://localhost:8080/index.html?timeStamp=12465为例",
                        "defaultValue": "timeStamp",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": "app.queryString",
                "returnValue": {
                    "name": "value",
                    "type": "string",
                    "desp": "queryString对应键名的值",
                    "details": "字符串，返回queryString对应键名的值，若queryString不存在该键名的值，则返回空字符串",
                    "defaultValue": "12465"
                },
                "compatibility": "ie8"
            },
            {
                "name": "removeData",
                "desp": "删除浏览器数据",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "desp": "存储的数据名称",
                        "details": "字符串，删除数据的名称，必需",
                        "necessary": true
                    },
                    {
                        "name": "fromCookie",
                        "type": "boolean",
                        "desp": "是否从cookie中获取数据",
                        "defaultValue": false,
                        "details": "布尔型，是否从cookie中删除数据，默认情况先尝试从localStorage中删除，如果失败，则尝试从cookie删除，非必需",
                        "necessary": false
                    }
                ],
                "appJsCode": "app.removeData",
                "hasReturn": true,
                "returnValue": {
                    "name": "result",
                    "type": "boolean",
                    "desp": "删除结果",
                    "details": "布尔型，是否删除数据成功"
                },
                "compatibility": "ie8"
            },
            {
                "name": "setData",
                "desp": "将数据缓存到浏览器",
                "params": [
                    {
                        "name": "name",
                        "type": "string",
                        "desp": "存储的数据名称",
                        "details": "字符串，存储的数据名称，必需",
                        "necessary": true
                    },
                    {
                        "name": "data",
                        "type": "object",
                        "details": "任意类型，存储的数据，必需。非字符串类型，会通过app.stringify将其转化为字符串再存储",
                        "desp": "存储的数据",
                        "necessary": true
                    },
                    {
                        "name": "toCookie",
                        "type": "boolean",
                        "details": "布尔型，是否存储到cookie中，默认情况先尝试存储到localStorage，如果失败，则尝试储存到cookie中，非必需",
                        "desp": "是否存储到cookie中",
                        "defaultValue": false,
                        "necessary": false
                    },
                    {
                        "name": "expireDays",
                        "type": "number",
                        "details": "正整数，如果存储到cookie，过期天数，默认值为100天，非必需",
                        "desp": "过期天数",
                        "defaultValue": 100,
                        "necessary": false
                    }
                ],
                "hasReturn": true,
                "appJsCode": "app.setData",
                "returnValue": {
                    "name": "result",
                    "type": "boolean",
                    "desp": "保存结果",
                    "details": "布尔型，是否存储数据成功"
                },
                "compatibility": "ie8"
            },
            {
                "name": "title",
                "desp": "获取或设置网页标题",
                "params": [
                    {
                        "name": "title",
                        "type": "string",
                        "desp": "标题",
                        "details": "设置网页需要显示的标题",
                        "defaultValue": "AWEB 5.0",
                        "necessary": true
                    }
                ],
                "hasReturn": true,
                "appJsCode": "app.title",
                "returnValue": {
                    "name": "title",
                    "type": "string",
                    "desp": "标题",
                    "details": "返回当前网页显示的标题",
                    "defaultValue": "AWEB 5.0"
                },
                "compatibility": "ie8"
            },
            {
                "name": "validate",
                "desp": "表单校验",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "data",
                        "desp": "校验的元素",
                        "type": "array",
                        "children": [
                            {
                                "name": "name",
                                "type": "string",
                                "details": "必需，表示需要传输到后台的名称，在AWEB中，name由别名和名称组成（alias+name）",
                                "desp": "字段名称",
                                "necessary": true
                            },
                            {
                                "name": "value",
                                "type": "string",
                                "desp": "值",
                                "details": "非必需，表示需要传输到后台的值",
                                "necessary": true
                            },
                            {
                                "name": "validate",
                                "type": "object",
                                "desp": "校验的信息",
                                "details": "必需，表示需要校验的信息",
                                "children": [
                                    {
                                        "name": " context",
                                        "desp": "jQuery对象或者选择器",
                                        "type": "jQuery",
                                        "details": "表示输入元素DOM对象的上下文"
                                    },
                                    {
                                        "name": "id",
                                        "desp": "输入元素的jQuery选择器",
                                        "type": "string",
                                        "details": "如果data[i].value为空，则从此处获取元素的值"
                                    },
                                    {
                                        "name": "regex",
                                        "desp": "校验类型或正则表达式",
                                        "type": "string",
                                        "details": "如果为false、undefined、null，则表示无需校验。校验类型，可以通过app.validate.TYPE获取"
                                    },
                                    {
                                        "name": "errorMsg",
                                        "details": "需要校验时必需，校验错误是记录或显示的提示语句",
                                        "type": "string",
                                        "desp": "校验类型或者正则"
                                    }
                                ],
                                "necessary": true
                            }
                        ],
                        "necessary": true
                    },
                    {
                        "name": "successCallback",
                        "type": "handler",
                        "desp": "校验正确后执行的函数",
                        "details": "函数，非必需，表示校验正确后执行的函数。$elem，jQuery对象，表示被校验的元素，由$(data.id,data.context)获取",
                        "necessary": false
                    },
                    {
                        "name": "errorCallback",
                        "type": "handler",
                        "desp": "校验失败后执行的函数",
                        "details": "数，非必需，表示校验错误后执行的函数。$elem，jQuery对象，表示被校验的元素，由$(data.id,data.context)获取，errorMsg，字符串，表示错误校验失败的提示语句",
                        "necessary": false
                    },
                    {
                        "name": "cleanCallback",
                        "type": "handler",
                        "desp": "清理错误提示回调函数",
                        "details": "函数，非必需，表示清理错误提示回调函数。其中函数中的this指向被校验的DOM元素",
                        "necessary": false
                    },
                    {
                        "name": "isContinue",
                        "type": "boolean",
                        "desp": "校验错误后是否继续校验data余下部分",
                        "details": "布尔值，非必需，表示校验错误后是否继续校验data余下部分",
                        "necessary": false
                    },
                    {
                        "name": "isValidate",
                        "type": "boolean",
                        "desp": "是否进行校验",
                        "details": "布尔值，非必需，如果等于false，则直接返回data部分的实际数据",
                        "defaultValue": true,
                        "necessary": false
                    }
                ],
                "hasReturn": true,
                "appJsCode": "app.validate",
                "returnValue": {
                    "name": "validateResult",
                    "type": "object",
                    "desp": "校验结果对象",
                    "children": [
                        {
                            "name": "result",
                            "type": "boolean",
                            "desp": "是否校验正确",
                            "details": "布尔值，表示是否校验正确，当data中的所有元素都校验成功时，就返回true，否则返回false"
                        },
                        {
                            "name": "data",
                            "type": "array",
                            "desp": "校验元素的信息",
                            "details": "数组对象，记录校验元素的信息",
                            "children": [
                                {
                                    "name": "name",
                                    "desp": "校验字段的名称",
                                    "type": "string",
                                    "details": "字符串，校验字段的名称，与data[i].name相同"
                                },
                                {
                                    "name": "value",
                                    "details": "字符串，校验字段的值，与data[i].value||$(data.id,data.context).val()相同",
                                    "type": "string",
                                    "desp": "校验字段的值"
                                },
                                {
                                    "name": "errorMsg",
                                    "details": "字符串，校验失败时，出现的错误提示",
                                    "type": "string",
                                    "desp": "错误提示"
                                }
                            ]
                        }
                    ]
                },
                "compatibility": "ie8"
            }
        ]
    },
    {
        "desp": "标签页",
        "children": [
            {
                "name": "page",
                "desp": "标签页操作",
                "belongTo": "class",
                "appJsCode": "app.page",
                "cInterfaces": [
                    {
                        "name": "refresh",
                        "desp": "刷新当前标签页",
                        "hasReturn": false
                    },
                    {
                        "name": "close",
                        "desp": "关闭当前标签页",
                        "hasReturn": false
                    },
                    {
                        "name": "closeAll",
                        "desp": "关闭所有页面",
                        "hasReturn": false,
                        "params": [
                            {
                                "name": "tips",
                                "type": "string",
                                "details": "关闭窗口时的提示，如果为空，则不显示遮罩",
                                "desp": "关闭窗口遮罩提示",
                                "necessary": false
                            }
                        ]
                    },
                    {
                        "name": "updateCurrentInterval",
                        "desp": "更新当前页面轮询配置",
                        "params": [
                            {
                                "type": "string",
                                "desp": "轮询操作唯一标识",
                                "name": "uniqueId",
                                "defaultValue": "auiCtx.intervals.轮询ID",
                                "necessary": true
                            },
                            {
                                "type": "object",
                                "desp": "轮询参数",
                                "name": "option",
                                "children": [
                                    {
                                        "type": "number",
                                        "desp": "时钟（ms）",
                                        "details": "超时时间或轮询时间",
                                        "name": "clock",
                                        "defaultValue": "1000"
                                    },
                                    {
                                        "type": "boolean",
                                        "desp": "立即执行",
                                        "details": "页面初始化时是否直接执行代码不用等待时钟超时",
                                        "name": "immediate",
                                        "defaultValue": "false"
                                    },
                                    {
                                        "type": "boolean",
                                        "desp": "切出暂停",
                                        "details": "切出页面时暂停轮询",
                                        "name": "isPause",
                                        "defaultValue": "true"
                                    },
                                    {
                                        "type": "number",
                                        "desp": "执行次数",
                                        "details": "轮询执行次数，当为0时表示页面生命周期内不断执行",
                                        "placeholder": "当为0时表示页面生命周期内不断执行",
                                        "name": "times",
                                        "defaultValue": "0"
                                    }
                                ],
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "fullscreen",
                        "desp": "全屏",
                        "params": [
                            {
                                "type": "boolean",
                                "desp": "是否全屏",
                                "name": "fullscreen",
                                "defaultValue": "true",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "isFullScreen",
                        "desp": "是否全屏中",
                        "hasReturn": true,
                        "returnValue": {
                            "name": "screenIsFull",
                            "type": "boolean",
                            "desp": "是否全屏中",
                            "defaultValue": "true"
                        }
                    },
                    {
                        "name": "displayNav",
                        "desp": "显示或隐藏导航",
                        "params": [
                            {
                                "type": "boolean",
                                "desp": "是否显示导航",
                                "name": "show",
                                "defaultValue": "true",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "isDisplayNav",
                        "desp": "是否显示导航栏中",
                        "hasReturn": true,
                        "returnValue": {
                            "name": "NavIsDisplay",
                            "type": "boolean",
                            "desp": "是否显示导航栏中",
                            "defaultValue": "true"
                        }
                    }
                ],
                "compatibility": "ie8"
            }
        ]
    },
    {
        "desp": "伪异步、多线程操作",
        "children": [
            {
                "name": "performance",
                "desp": "伪异步、多线程操作",
                "belongTo": "class",
                "appJsCode": "app.performance",
                "cInterfaces": [
                    {
                        "name": "longDelay",
                        "desp": "长延时操作",
                        "details": "用于长延时操作，用于数据处理量大或即时渲染要求低的处理的延时调用",
                        "hasReturn": false,
                        "params": [
                            {
                                "type": "handler",
                                "desp": "操作内容",
                                "name": "callback",
                                "defaultValue": "function(){}",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "name": "shortDelay",
                        "desp": "短延时操作",
                        "details": "用于短延时操作，用于数据处理量小或即时渲染要求低的处理的延时调用",
                        "hasReturn": false,
                        "params": [
                            {
                                "type": "handler",
                                "desp": "操作内容",
                                "name": "callback",
                                "defaultValue": "function(){}",
                                "necessary": true
                            }
                        ]
                    },
                    {
                        "require": true,
                        "name": "sleep",
                        "desp": "浏览器休眠",
                        "details": "用于模拟浏览器休眠，用于暂停一段时间后执行代码",
                        "hasReturn": false,
                        "params": [
                            {
                                "type": "number",
                                "desp": "休眠时间",
                                "name": "timeout",
                                "necessary": true
                            }
                        ]
                    }
                ],
                "compatibility": "ie8"
            }
        ]
    },
    {
        "children": [
            {
                "name": "tips",
                "desp": "提示弹框",
                "belongTo": "closure",
                "params": [
                    {
                        "name": "title",
                        "type": "string",
                        "desp": "标题",
                        "details": "消息标题，必需",
                        "necessary": true
                    },
                    {
                        "name": "message",
                        "type": "string",
                        "desp": "提示信息",
                        "details": "可以使HTML代码，消息内容，必需",
                        "necessary": true
                    },
                    {
                        "name": "type",
                        "type": "string_select",
                        "desp": "提示类型",
                        "details": "有“_DEFAULT\"(默认),\"SUCCESS\"(成功),\"ERROR\"(错误),\"WARNING\"(警告)四种类型，使用时许引用app.tips.showType",
                        "necessary": true
                    }
                ],
                "appJsCode": "app.tips",
                "hasReturn": false,
                "compatibility": "ie8"
            }
        ]
    }
],
                    appInterfacesConst:[
    {
        "category": "标签页类型",
        "valueArray": [
            "app.router.tab.TYPE.BLANK",
            "app.router.tab.TYPE.SUB",
            "app.router.tab.TYPE.SELF",
            "app.router.tab.TYPE.WINDOW",
            "app.router.tab.TYPE.POPOVER"
        ],
        "despArray": [
            "新标签",
            "子标签",
            "自身标签",
            "窗口标签",
            "气泡标签"
        ]
    },
    {
        "category": "标签页状态类型",
        "valueArray": [
            "app.router.STATUS.AFTER_LOAD",
            "app.router.STATUS.BEFORE_PAUSE",
            "app.router.STATUS.AFTER_PAUSE",
            "app.router.STATUS.BEFORE_RESUME",
            "app.router.STATUS.AFTER_RESUME",
            "app.router.STATUS.BEFORE_UNLOAD",
            "app.router.STATUS.AFTER_UNLOAD"
        ],
        "despArray": [
            "标签页加载完毕后",
            "标签页切出前",
            "标签页切出后",
            "标签页切入前",
            "标签页切入后",
            "标签页销毁前",
            "标签页销毁后"
        ]
    },
    {
        "category": "路由",
        "valueArray": [
            "app.router.getCurrentHandler()"
        ],
        "despArray": [
            "获取当前标签页实例"
        ]
    },
    {
        "category": "提示语句",
        "valueArray": [
            "app.alert.ERROR",
            "app.alert.SUCCESS",
            "app.alert.WARNING",
            "app.alert.MESSAGE",
            "app.alert._DEFAULT"
        ],
        "despArray": [
            "提示错误类型",
            "提示成功类型",
            "提示警告类型",
            "日志信息类型",
            "默认类型"
        ]
    },
    {
        "category": "行为接口比较条件",
        "valueArray": [
            "app.behavior.LESS_THAN",
            "app.behavior.EQUAL",
            "app.behavior.GREAT_THAN",
            "app.behavior.NOT",
            "app.behavior.INCLUDES",
            "app.behavior.NOT_INCLUDES",
            "app.behavior.STARTS_WITH"
        ],
        "despArray": [
            "小于",
            "等于",
            "大于",
            "不等于",
            "包含",
            "不包含",
            "以…开头"
        ]
    },
    {
        "category": "数据格式转换",
        "valueArray": [
            "app.getFormatData.TYPE.MONEY",
            "app.getFormatData.TYPE.BANDCARD"
        ],
        "despArray": [
            "转换金额格式",
            "转换银行卡格式"
        ]
    },
    {
        "category": "设备终端类型",
        "valueArray": [
            "app.getUA.TYPE.WEIXIN_IPAD",
            "app.getUA.TYPE.WEIXIN_IPHONE",
            "app.getUA.TYPE.WEIXIN_ANDROID_PHONE",
            "app.getUA.TYPE.WEIXIN_ANDROID_PAD",
            "app.getUA.TYPE.ALIPAY_IPAD",
            "app.getUA.TYPE.ALIPAY_IPHONE",
            "app.getUA.TYPE.ALIPAY_ANDROID_PHONE",
            "app.getUA.TYPE.ALIPAY_ANDROID_PAD",
            "app.getUA.TYPE.IPHONE",
            "app.getUA.TYPE.IPAD",
            "app.getUA.TYPE.ANDROID_PHONE",
            "app.getUA.TYPE.ANDROID_PAD",
            "app.getUA.TYPE.MSIE",
            "app.getUA.TYPE.IE11",
            "app.getUA.TYPE.MICROSOFT_EDGE",
            "app.getUA.TYPE.PC_NOT_IE",
            "app.getUA.TYPE.IONIC_IPAD",
            "app.getUA.TYPE.IONIC_IPHONE",
            "app.getUA.TYPE.IONIC_ANDROID_PHONE",
            "app.getUA.TYPE.IONIC_ANDROID_PAD",
            "app.getUA.TYPE.CORDOVA_IPAD",
            "app.getUA.TYPE.CORDOVA_IPHONE",
            "app.getUA.TYPE.CORDOVA_ANDROID_PHONE",
            "app.getUA.TYPE.CORDOVA_ANDROID_PAD"
        ],
        "despArray": [
            "iPad版微信",
            "iPhone版微信",
            "安卓手机版微信",
            "安卓平板版微信",
            "iPad版支付宝",
            "iPhone版支付宝",
            "安卓手机版支付宝",
            "安卓平板版支付宝",
            "iPhone版网页",
            "iPad版网页",
            "安卓手机版网页",
            "安卓平板版网页",
            "IE6~10",
            "IE11+",
            "Edge浏览器",
            "其他PC浏览器",
            "iPad版Ionic App",
            "iPhone版Ionic App",
            "安卓手机版Ionic App",
            "安卓手机版Ionic App",
            "iPad版cordova App",
            "iPhone版cordova App",
            "安卓手机版Cordova App",
            "安卓平板版Cordova App"
        ]
    },
    {
        "category": "提示弹框类型",
        "valueArray": [
            "app.tips.ERROR",
            "app.tips.SUCCESS",
            "app.tips.WARNING",
            "app.tips._DEFAULT"
        ],
        "despArray": [
            "提示错误类型",
            "提示成功类型",
            "提示警告类型",
            "默认类型"
        ]
    }
]
                }
                })