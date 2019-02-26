define([].concat(window.aweb.transformJsConfig([ "component.foundationForm", "component.foundationForm.foundationInput", "ctn.foundationRowCtn", "ctn", "ctn.foundationFormCtn", "ctn.divCtn", "component.foundationForm.foundationText", "zTree", "component.zTree", "jquery.dataTables", "dataTables.fixedColumns.min", "component.dataTables", "ctn.modalCtn" ])).concat(window.aweb.transformCssConfig([ "foundation/css/foundation.css", "AUI/css/layout.ctn.css", "jQuery.zTree/css/awesome.css", "jQuery.dataTables/css/jquery.dataTables.css", "jQuery.dataTables/css/fixedColumns.dataTables.css" ])), function() {
    return function() {
        return function() {
            return function(auiCtx) {
                "use strict";
                var $el, handler, scope, spaLifecycle;
                "IDETAG";
                "IDETAG";
                var ROLE_LIST_REFRESH = "role_list_refresh", NAMESPACE = ".role_list", REFRESH_URL = "./springmvc/role/listAllRoles.do";
                app.router.ROLE_LIST_REFRESH = ROLE_LIST_REFRESH;
                app.router.off(ROLE_LIST_REFRESH + NAMESPACE);
                app.router.on(ROLE_LIST_REFRESH + NAMESPACE, function(type) {
                    $.ajax({
                        type: "POST",
                        url: REFRESH_URL,
                        shelter: "正在加载数据，请稍候…",
                        success: function(response) {
                            if (response.status) {
                                if (response.type && response.type !== "AJAX") {
                                    app.open(response);
                                } else {
                                    auiCtx.variables.roleListDataTables.refresh(response.content.result);
                                }
                            } else if (response.errorMsg) {
                                app.alert(response.errorMsg, app.alert.ERROR);
                            }
                        }
                    });
                });
                //仅勾选中操作权限
                function checkOnlyOperation(that, treeId, treeNode) {
                    if (treeNode.type && treeNode.type === "menuObj" && treeNode.checked) {
                        var childrenNodes = treeNode.children;
                        if (childrenNodes && childrenNodes.length && childrenNodes.length !== 0) {
                            for (var i = 0, len = childrenNodes.length; i < len; i++) {
                                var childrenNode = childrenNodes[i];
                                if (childrenNode.type && childrenNode.type === "accObj") {
                                    if (i === 1) {
                                        that.getZTreeObj(treeId).checkNode(childrenNode, true, true);
                                    } else {
                                        that.getZTreeObj(treeId).checkNode(childrenNode, false, true);
                                    }
                                } else {
                                    checkOnlyOperation(that, treeId, childrenNode);
                                }
                            }
                        }
                    }
                }
                //    //角色权限菜单树配置        
                auiCtx.configs.roleListTree.setting = {
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pId",
                            rootPId: 1
                        }
                    },
                    check: {
                        enable: true,
                        chkboxType: {
                            Y: "ps",
                            N: "s"
                        }
                    },
                    view: {
                        showIcon: false,
                        showLine: true
                    },
                    callback: {
                        beforeCheck: function(treeId, treeNode) {
                            if (treeNode.type && treeNode.type === "accObj" && !treeNode.checked) {
                                var childNodes = treeNode.getParentNode().children;
                                for (var index in childNodes) {
                                    if (childNodes[index] != treeNode) {
                                        this.getZTreeObj(treeId).checkNode(childNodes[index], false, true);
                                    }
                                }
                            } else if (treeNode.type && treeNode.type === "accObj" && treeNode.checked) {
                                var childNodes = treeNode.getParentNode().children;
                                var isChildSelected = false;
                                for (var index in childNodes) {
                                    if (childNodes[index] != treeNode && childNodes[index].checked) {
                                        isChildSelected = true;
                                    }
                                }
                                treeNode.getParentNode().checked = isChildSelected;
                            }
                        },
                        onCheck: function(event, treeId, treeNode) {
                            //选中父节点时仅勾选中操作权限
                            checkOnlyOperation(this, treeId, treeNode);
                        },
                        onNodeCreated: function(event, treeId, treeNode) {
                            if (treeNode.type && treeNode.type === "menuObj") {
                                var childNodes = treeNode.children;
                                var isChildSelected = false;
                                for (var index in childNodes) {
                                    if (childNodes[index].type && childNodes[index].type === "accObj" && !!childNodes[index].checked) {
                                        isChildSelected = true;
                                    }
                                }
                                if (!isChildSelected) {
                                    return;
                                }
                                for (var index in childNodes) {
                                    !!childNodes[index].checked;
                                }
                            }
                        }
                    }
                };
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
                        divCtn1: {
                            desp: "普通容器1",
                            widgetName: "普通容器1",
                            id: "divCtn1",
                            "data-authority": "10"
                        },
                        roleListDataTables: {
                            desp: "表格2",
                            widgetName: "角色列表",
                            id: "roleListDataTables",
                            "data-authority": "10"
                        },
                        modalCreRolCtn: {
                            desp: "新建角色弹窗",
                            widgetName: "新建角色弹窗",
                            id: "modalCreRolCtn"
                        },
                        modalSetRolCtn: {
                            desp: "配置角色弹框",
                            widgetName: "关联权限弹框",
                            id: "modalSetRolCtn"
                        },
                        roleListTree: {
                            desp: "树状菜单16",
                            widgetName: "角色树状菜单",
                            id: "roleListTree",
                            "data-authority": "10"
                        },
                        modalRemoveRolCtn: {
                            desp: "删除角色弹框",
                            widgetName: "删除角色弹框",
                            id: "modalRemoveRolCtn"
                        },
                        foundationFormCtn44: {
                            desp: "Foundation表单容器44",
                            widgetName: "Foundation表单容器44",
                            name: "",
                            id: "foundationFormCtn44"
                        },
                        foundationRowCtn45: {
                            desp: "Foundation表单行容器45",
                            widgetName: "Foundation表单行容器45",
                            name: "",
                            id: "foundationRowCtn45"
                        },
                        foundationRowCtn46: {
                            desp: "Foundation表单行容器46",
                            widgetName: "Foundation表单行容器46",
                            name: "",
                            id: "foundationRowCtn46"
                        },
                        foundationInput47: {
                            desp: "角色名",
                            widgetName: "角色名",
                            name: "",
                            id: "foundationInput47"
                        },
                        foundationInput48: {
                            desp: "备注",
                            widgetName: "备注",
                            name: "",
                            id: "foundationInput48"
                        },
                        modalModifyRolCtn: {
                            desp: "修改角色弹窗",
                            widgetName: "修改角色弹窗",
                            id: "modalModifyRolCtn"
                        },
                        foundationFormCtn50: {
                            desp: "Foundation表单容器50",
                            widgetName: "Foundation表单容器50",
                            name: "",
                            id: "foundationFormCtn50"
                        },
                        foundationRowCtn51: {
                            desp: "Foundation表单行容器51",
                            widgetName: "Foundation表单行容器51",
                            name: "",
                            id: "foundationRowCtn51"
                        },
                        foundationRowCtn52: {
                            desp: "Foundation表单行容器52",
                            widgetName: "Foundation表单行容器52",
                            name: "",
                            id: "foundationRowCtn52"
                        },
                        rolenameInput: {
                            desp: "角色名_修改",
                            widgetName: "角色名",
                            name: "",
                            id: "rolenameInput"
                        },
                        remarkInput: {
                            desp: "备注",
                            widgetName: "备注",
                            name: "",
                            id: "remarkInput"
                        },
                        foundationFormCtn55: {
                            desp: "查询条件表单",
                            widgetName: "查询条件表单",
                            name: "",
                            id: "foundationFormCtn55"
                        },
                        foundationRowCtn56: {
                            desp: "Foundation表单行容器56",
                            widgetName: "Foundation表单行容器56",
                            name: "",
                            id: "foundationRowCtn56"
                        },
                        queryRoleName: {
                            desp: "角色名",
                            widgetName: "角色名_查询条件",
                            name: "",
                            id: "queryRoleName"
                        },
                        queryCreateUser: {
                            desp: "创建用户",
                            widgetName: "创建用户_查询条件",
                            name: "",
                            id: "queryCreateUser"
                        },
                        queryRoleId: {
                            desp: "角色ID",
                            widgetName: "角色ID_查询条件",
                            name: "",
                            id: "queryRoleId"
                        },
                        foundationFormCtn76: {
                            desp: "Foundation表单容器76",
                            widgetName: "Foundation表单容器76",
                            name: "",
                            id: "foundationFormCtn76"
                        },
                        foundationRowCtn77: {
                            desp: "Foundation表单行容器77",
                            widgetName: "Foundation表单行容器77",
                            name: "",
                            id: "foundationRowCtn77"
                        },
                        foundationText78: {
                            desp: "行内文本78",
                            widgetName: "行内文本78",
                            id: "foundationText78"
                        }
                    },
                    css: {},
                    configs: {
                        divCtn1: {
                            backPlane: false,
                            header: "",
                            collapse: false,
                            titleInfo: {
                                edmID: "2DF5D69A0F3628936780-A5F1",
                                edmKey: "",
                                fields: [],
                                keys: []
                            },
                            infoPosition: "right",
                            packupBtn: false,
                            pickupHeight: ""
                        },
                        roleListDataTables: {
                            scrollCollapse: true,
                            fixedColumns: {
                                leftColumns: "",
                                rightColumns: ""
                            },
                            buttons: [ {
                                name: "查询",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0,
                                id: "queryBtn",
                                type: "",
                                uuid: "67881B3C161F40BAA16A8037BA5F9EAB"
                            }, {
                                name: "重置",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0,
                                id: "resetBtn",
                                type: "",
                                uuid: "8A1447726D575D1B1C61-5F5E"
                            }, {
                                name: "新建",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0,
                                id: "creBtn",
                                type: "",
                                uuid: "2676E71D99A465779DAA-356A"
                            }, {
                                name: "修改",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0,
                                id: "modBtn",
                                type: "only",
                                uuid: "473384B285C539314EA0-A29E"
                            }, {
                                name: "删除",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0,
                                id: "delBtn",
                                type: "multiple",
                                uuid: "5C9526507652BDD8C5DF-FCBC"
                            }, {
                                name: "关联权限",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0,
                                id: "relationBtn",
                                type: "only",
                                uuid: "6504318E3413C30D7BC3-E048"
                            } ],
                            columns: {
                                edmID: "A77D190ABB9B2B8781DD-639B",
                                edmKey: "sTitle",
                                elements: [ {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "角色ID",
                                    sWidth: "150px",
                                    edmKey: "角色ID",
                                    edmItemId: "935A9E8963564F94B60C36110EB1C18A.0",
                                    bVisible: true
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "角色名",
                                    sWidth: "150px",
                                    edmKey: "角色名",
                                    edmItemId: "8C3EF81A82E44374833F8FD523868768.1",
                                    bVisible: true
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "创建用户",
                                    sWidth: "150px",
                                    edmKey: "创建用户",
                                    edmItemId: "0185E04453D6411DAC84BD7325F30304.2",
                                    bVisible: true
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "创建时间",
                                    sWidth: "150px",
                                    edmKey: "创建时间",
                                    edmItemId: "F23CB6CC0DCC4DD29CB24C7C059FC0E6.3",
                                    bVisible: true
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "更新时间",
                                    sWidth: "150px",
                                    edmKey: "更新时间",
                                    edmItemId: "551924A9B285463DB7BC9B49089AEBA7.4",
                                    bVisible: true
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "备注",
                                    sWidth: "150px",
                                    edmKey: "备注",
                                    edmItemId: "EEB9A50F22734B9FB737D41E1AB6E839.5",
                                    bVisible: true
                                } ],
                                fields: [ "角色ID", "角色名", "创建用户", "创建时间", "更新时间", "备注" ],
                                keys: [ "roleId", "roleName", "createUser", "createTime", "updateTime", "remark" ]
                            },
                            searching: true,
                            bSateSave: true,
                            bDestroy: true,
                            selectOption: "checkbox",
                            detailInfo: {
                                sInfoEmpty: "表中无数据",
                                sEmptyTable: "无数据",
                                sZeroRecords: "找不到相关数据"
                            },
                            paging: true,
                            aMenuLength: [ 10, 20, 50, 100 ],
                            statusConfig: {
                                columnIndex: ""
                            },
                            rows: {
                                btnColName: "操作列"
                            },
                            highlight: {
                                colorArray: [ {
                                    bgColor: "",
                                    color: "",
                                    key: ""
                                } ],
                                columnIndex: ""
                            },
                            bInfo: true,
                            sDom: "",
                            bLengthChange: true,
                            columnAsId: 0,
                            bCheckState: false,
                            testForUpdate: true,
                            scrollX: false,
                            closeTitle: false
                        },
                        modalCreRolCtn: {
                            btnCancel: "取消",
                            backdrop: "static",
                            btnIgnore: "",
                            reset: true,
                            isLargeModal: false,
                            title: "新建角色",
                            content: function() {
                                return $("#modalCreRolCtn", $el);
                            },
                            btnConfirm: "确认"
                        },
                        modalSetRolCtn: {
                            backdrop: "static",
                            reset: false,
                            isLargeModal: false,
                            title: "关联权限",
                            content: function() {
                                return $("#modalSetRolCtn", $el);
                            },
                            btnConfirm: "确认",
                            btnCancel: "取消",
                            btnIgnore: ""
                        },
                        roleListTree: {
                            zNodes: [ {
                                name: "",
                                active: true,
                                checked: false,
                                pId: 0,
                                id: "",
                                open: false
                            } ],
                            setting: {
                                view: {
                                    showLine: true,
                                    showIcon: true
                                },
                                data: {
                                    simpleData: {
                                        enable: true
                                    }
                                },
                                check: {
                                    enable: true
                                }
                            }
                        },
                        modalRemoveRolCtn: {
                            btnCancel: "取消",
                            backdrop: "static",
                            btnIgnore: "",
                            reset: false,
                            isLargeModal: false,
                            title: "删除角色",
                            content: function() {
                                return $("#modalRemoveRolCtn", $el);
                            },
                            btnConfirm: "确认"
                        },
                        foundationFormCtn44: {
                            formLayout: "inline",
                            labelAlign: "text-right",
                            labelSpan: 3,
                            backPlane: false,
                            header: "",
                            collapse: false,
                            span: 12
                        },
                        foundationRowCtn45: {
                            header: ""
                        },
                        foundationRowCtn46: {
                            header: ""
                        },
                        foundationInput47: {
                            minAmount: "",
                            mustInput: false,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            icon: "",
                            label: "角色名",
                            labelAlign: "",
                            labelSpan: "",
                            iconPosition: 1,
                            disabled: false,
                            placeholder: "角色名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                            maxAmount: "",
                            value: "",
                            append: "",
                            span: 8
                        },
                        foundationInput48: {
                            minAmount: "",
                            mustInput: false,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            icon: "",
                            label: "备注",
                            labelAlign: "",
                            labelSpan: "",
                            iconPosition: 1,
                            disabled: false,
                            placeholder: "备注不能为空",
                            maxAmount: "",
                            value: "",
                            append: "",
                            span: 8
                        },
                        modalModifyRolCtn: {
                            btnCancel: "取消",
                            backdrop: "static",
                            btnIgnore: "",
                            reset: true,
                            isLargeModal: false,
                            title: "修改角色",
                            content: function() {
                                return $("#modalModifyRolCtn", $el);
                            },
                            btnConfirm: "确认"
                        },
                        foundationFormCtn50: {
                            formLayout: "inline",
                            labelAlign: "text-right",
                            labelSpan: 3,
                            backPlane: false,
                            header: "",
                            collapse: false,
                            span: 12
                        },
                        foundationRowCtn51: {
                            header: ""
                        },
                        foundationRowCtn52: {
                            header: ""
                        },
                        rolenameInput: {
                            minAmount: "",
                            mustInput: false,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            icon: "",
                            label: "角色名",
                            labelAlign: "",
                            labelSpan: "",
                            iconPosition: 1,
                            disabled: false,
                            placeholder: "角色名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                            maxAmount: "",
                            value: "",
                            append: "",
                            span: 8
                        },
                        remarkInput: {
                            minAmount: "",
                            mustInput: false,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            icon: "",
                            label: "备注",
                            labelAlign: "",
                            labelSpan: "",
                            iconPosition: 1,
                            disabled: false,
                            placeholder: "备注不能为空",
                            maxAmount: "",
                            value: "",
                            append: "",
                            span: 8
                        },
                        foundationFormCtn55: {
                            formLayout: "inline",
                            labelAlign: "text-left",
                            labelSpan: 1,
                            backPlane: false,
                            header: "查询",
                            collapse: true,
                            span: 4
                        },
                        foundationRowCtn56: {
                            header: ""
                        },
                        queryRoleName: {
                            minAmount: "",
                            mustInput: false,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            icon: "",
                            label: "角色名",
                            labelAlign: "",
                            labelSpan: "",
                            iconPosition: 1,
                            disabled: false,
                            placeholder: "",
                            maxAmount: "",
                            value: "",
                            append: "",
                            span: 3
                        },
                        queryCreateUser: {
                            minAmount: "",
                            mustInput: false,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            icon: "",
                            label: "创建用户",
                            labelAlign: "",
                            labelSpan: "",
                            iconPosition: 1,
                            disabled: false,
                            placeholder: "",
                            maxAmount: "",
                            value: "",
                            append: "",
                            span: 3
                        },
                        queryRoleId: {
                            minAmount: "",
                            mustInput: false,
                            autocomplete: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            icon: "",
                            label: "角色ID",
                            labelAlign: "",
                            labelSpan: "",
                            iconPosition: 1,
                            disabled: false,
                            placeholder: "",
                            maxAmount: "",
                            value: "",
                            append: "",
                            span: 3
                        },
                        foundationFormCtn76: {
                            formLayout: "horizontal",
                            labelAlign: "text-right",
                            backPlane: false,
                            labelSpan: 3,
                            header: "",
                            collapse: false,
                            span: 12
                        },
                        foundationRowCtn77: {
                            header: ""
                        },
                        foundationText78: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "",
                            content: "<p>确认删除？</p><p><br></p><p><br></p>",
                            span: ""
                        }
                    },
                    pageNSL: [],
                    widgetNSL: {},
                    validations: {
                        foundationInput47: {
                            data: function() {
                                return [ {
                                    desp: "角色名",
                                    name: "foundationInput47",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "角色名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                                        regex: "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$",
                                        id: "#foundationInput47 input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "foundationInput47",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.foundationInput47.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.foundationInput47.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.foundationInput47.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.foundationInput47.clean.apply($el, arguments);
                            }
                        },
                        foundationInput48: {
                            data: function() {
                                return [ {
                                    desp: "备注",
                                    name: "foundationInput48",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "true",
                                        errorMsg: "备注不能为空",
                                        regex: "^[\\s\\S]+$",
                                        id: "#foundationInput48 input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "foundationInput48",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.foundationInput48.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.foundationInput48.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.foundationInput48.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.foundationInput48.clean.apply($el, arguments);
                            }
                        },
                        rolenameInput: {
                            data: function() {
                                return [ {
                                    desp: "角色名",
                                    name: "rolenameInput",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "角色名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                                        regex: "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$",
                                        id: "#rolenameInput input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "rolenameInput",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.rolenameInput.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.rolenameInput.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.rolenameInput.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.rolenameInput.clean.apply($el, arguments);
                            }
                        },
                        remarkInput: {
                            data: function() {
                                return [ {
                                    desp: "备注",
                                    name: "remarkInput",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "true",
                                        errorMsg: "备注不能为空",
                                        regex: "^[\\s\\S]+$",
                                        id: "#remarkInput input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "remarkInput",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.remarkInput.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.remarkInput.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.remarkInput.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.remarkInput.clean.apply($el, arguments);
                            }
                        }
                    },
                    lifecycle: {
                        roleListDataTables_load_init_000005: {
                            func: function() {
                                aweb.debug && aweb.stepTo("roleMgr-roleList-生命周期配置-角色表格初始化");
                                /**
 * 
 *初始化表格数据
 *此方法定义在自定义代码中
 *
 */
                                app.router.trigger(app.router.ROLE_LIST_REFRESH);
                            },
                            times: 0,
                            clock: 0,
                            immediate: undefined,
                            isPause: undefined
                        },
                        roleListDataTables_resume_init_000006: {
                            func: function() {
                                aweb.debug && aweb.stepTo("roleMgr-roleList-生命周期配置-角色列表切入操作3877");
                                /**
 * 
 *刷新表格数据
 *此方法定义在自定义代码中
 *
 */
                                app.router.trigger(app.router.ROLE_LIST_REFRESH);
                            },
                            times: 0,
                            clock: 1e3,
                            immediate: false,
                            isPause: true
                        }
                    },
                    variables: {},
                    ajaxOption: {
                        _modalCreRolCtn__data_role__confirm___click: {
                            type: "POST",
                            url: "./springmvc/role/addRole.do",
                            urlDivider: "/",
                            timeout: undefined,
                            noAgreeBusData: true,
                            ajaxProcessData: true,
                            ajaxNoBlobData: true,
                            validate: true,
                            validateSuccessCallback: null,
                            validateCleanCallback: null,
                            data: function() {
                                var data;
                                data = [ {
                                    desp: "备注",
                                    name: "remark",
                                    validate: {
                                        regex: "^[\\s\\S]+$",
                                        errorMsg: "备注不能为空",
                                        require: "true",
                                        hasChineseCharacter: "true",
                                        widgetID: "foundationInput48",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.foundationInput48.getValue()
                                }, {
                                    desp: "角色名",
                                    name: "roleName",
                                    validate: {
                                        regex: "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$",
                                        errorMsg: "角色名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "foundationInput47",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.foundationInput47.getValue()
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._modalCreRolCtn__data_role__confirm___click(response);
                                        auiCtx.variables.modalCreRolCtn.hide();
                                        app.alert("新建角色成功", app.alert.MESSAGE);
                                        app.router.trigger(app.router.ROLE_LIST_REFRESH);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _modalSetRolCtn__data_role__confirm___click: {
                            type: "POST",
                            url: "./springmvc/role/doRoleToMenu.do",
                            urlDivider: "/",
                            timeout: undefined,
                            noAgreeBusData: true,
                            ajaxProcessData: true,
                            ajaxNoBlobData: true,
                            validate: true,
                            validateSuccessCallback: null,
                            validateCleanCallback: null,
                            data: function() {
                                var data;
                                var zTreeObj = auiCtx.variables.roleListTree.getTreeObj();
                                var nodes = zTreeObj.getCheckedNodes(true);
                                var menuIDS = [];
                                for (var i in nodes) {
                                    var isAvailable = false;
                                    if (nodes[i].type && nodes[i].type === "menuObj" && nodes[i].isMenuParent === "true") {
                                        menuIDS.push(nodes[i].remark + "=" + "PARENT_NODE");
                                        isAvailable = true;
                                    } else if (nodes[i].type && nodes[i].type === "accObj") {
                                        isAvailable = true;
                                    }
                                    if (!isAvailable) {
                                        var child = zTreeObj.getNodesByParam("checked", true, nodes[i]);
                                        menuIDS.push(nodes[i].remark + "=" + (child[0].accCode === undefined ? "" : child[0].accCode));
                                    }
                                }
                                data = [ {
                                    desp: "角色ID(ROL)",
                                    name: "roleId",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        widgetID: "widgetMissing",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.roleId
                                }, {
                                    desp: "menuIdsWithAccs",
                                    name: "menuIdsWithAccs",
                                    validate: {
                                        regex: "",
                                        errorMsg: ""
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: menuIDS.join(",")
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._modalSetRolCtn__data_role__confirm___click(response);
                                        auiCtx.variables.modalSetRolCtn.hide();
                                        app.alert("关联角色成功", app.alert.MESSAGE);
                                        app.router.trigger(app.router.ROLE_LIST_REFRESH);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _modalRemoveRolCtn__data_role__confirm___click: {
                            type: "POST",
                            url: "./springmvc/role/deleteRole.do",
                            urlDivider: "/",
                            timeout: undefined,
                            noAgreeBusData: true,
                            ajaxProcessData: true,
                            ajaxNoBlobData: true,
                            validate: true,
                            validateSuccessCallback: null,
                            validateCleanCallback: null,
                            data: function() {
                                var data;
                                pageParams.roleId = auiCtx.variables.roleListDataTables.list();
                                data = [ {
                                    desp: "角色唯一ID列表",
                                    name: "roleIds",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        widgetID: "roleListDataTables",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.roleId
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._modalRemoveRolCtn__data_role__confirm___click(response);
                                        auiCtx.variables.modalRemoveRolCtn.hide();
                                        app.alert("删除角色成功", app.alert.MESSAGE);
                                        app.router.trigger(app.router.ROLE_LIST_REFRESH);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _modalModifyRolCtn__data_role__confirm___click: {
                            type: "POST",
                            url: "./springmvc/role/editRole.do",
                            urlDivider: "/",
                            timeout: undefined,
                            noAgreeBusData: true,
                            ajaxProcessData: true,
                            ajaxNoBlobData: true,
                            validate: true,
                            validateSuccessCallback: null,
                            validateCleanCallback: null,
                            data: function() {
                                var data;
                                data = [ {
                                    desp: "角色ID",
                                    name: "roleId",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        widgetID: "widgetMissing",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.roleId
                                }, {
                                    desp: "备注",
                                    name: "remark",
                                    validate: {
                                        regex: "^[\\s\\S]+$",
                                        errorMsg: "备注不能为空",
                                        require: "true",
                                        hasChineseCharacter: "true",
                                        widgetID: "remarkInput",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.remarkInput.getValue()
                                }, {
                                    desp: "角色名",
                                    name: "roleName",
                                    validate: {
                                        regex: "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$",
                                        errorMsg: "角色名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "rolenameInput",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.rolenameInput.getValue()
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._modalModifyRolCtn__data_role__confirm___click(response);
                                        auiCtx.variables.modalModifyRolCtn.hide();
                                        app.alert("修改角色成功", app.alert.MESSAGE);
                                        app.router.trigger(app.router.ROLE_LIST_REFRESH);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _roleListDataTables__relationBtn_click_event_echo: {
                            type: "POST",
                            url: "./springmvc/role/listAllMenus.do",
                            urlDivider: "/",
                            timeout: undefined,
                            noAgreeBusData: true,
                            ajaxProcessData: true,
                            ajaxNoBlobData: true,
                            validate: true,
                            validateSuccessCallback: null,
                            validateCleanCallback: null,
                            data: function() {
                                var data;
                                pageParams.roleId = auiCtx.variables.roleListDataTables.list();
                                pageParams.roleId = pageParams.roleId[0];
                                data = [ {
                                    desp: "角色ID",
                                    name: "roleId",
                                    validate: {
                                        regex: "",
                                        errorMsg: ""
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.roleId
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._roleListDataTables__relationBtn_click_event_echo(response);
                                        auiCtx.variables.roleListTree.refresh(response.content.result);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _roleListDataTables__queryBtn_click_event3694: {
                            type: "POST",
                            url: "./springmvc/role/queryRoleListByOpt.do",
                            urlDivider: "/",
                            timeout: 6e4,
                            noAgreeBusData: true,
                            ajaxProcessData: true,
                            ajaxNoBlobData: true,
                            validate: true,
                            validateSuccessCallback: null,
                            validateCleanCallback: null,
                            data: function() {
                                var data;
                                data = [ {
                                    desp: "创建人",
                                    name: "createUser",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        widgetID: "queryCreateUser",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.queryCreateUser.getValue()
                                }, {
                                    desp: "查询角色名",
                                    name: "queryRoleName",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        widgetID: "queryRoleName",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.queryRoleName.getValue()
                                }, {
                                    desp: "角色ID",
                                    name: "roleId",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        widgetID: "queryRoleId",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.queryRoleId.getValue()
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._roleListDataTables__queryBtn_click_event3694(response);
                                        auiCtx.variables.roleListDataTables.refresh(response.content.result);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _roleListDataTables__modBtn_click_event3871: {
                            type: "POST",
                            url: "./springmvc/role/queryRoleByRoleId.do",
                            urlDivider: "/",
                            timeout: 6e4,
                            noAgreeBusData: true,
                            ajaxProcessData: true,
                            ajaxNoBlobData: true,
                            validate: true,
                            validateSuccessCallback: null,
                            validateCleanCallback: null,
                            data: function() {
                                var data;
                                pageParams.roleId = auiCtx.variables.roleListDataTables.list();
                                data = [ {
                                    desp: "角色ID",
                                    name: "roleId",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        widgetID: "widgetMissing",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.roleId[0]
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._roleListDataTables__modBtn_click_event3871(response);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        }
                    },
                    eventCallback: {
                        _modalCreRolCtn__data_role__confirm___click: function(response) {},
                        _modalSetRolCtn__data_role__confirm___click: function(response) {},
                        _modalRemoveRolCtn__data_role__confirm___click: function(response) {},
                        _modalModifyRolCtn__data_role__confirm___click: function(response) {},
                        _roleListDataTables__relationBtn_click_event_echo: function(response) {},
                        _roleListDataTables__queryBtn_click_event3694: function(response) {},
                        _roleListDataTables__modBtn_click_event3871: function(response) {
                            auiCtx.variables.rolenameInput.setValue(response.content.result.roleName);
                            auiCtx.variables.remarkInput.setValue(response.content.result.remark);
                        }
                    },
                    delegateEvents: {
                        "blur #foundationInput47 input": function() {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-校验配置-角色名");
                            app.validate(auiCtx.validations.foundationInput47.data, auiCtx.validations.foundationInput47.successCallback, auiCtx.validations.foundationInput47.errorCallback, auiCtx.validations.foundationInput47.cleanCallback, true, true);
                        },
                        "blur #foundationInput48 input": function() {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-校验配置-备注");
                            app.validate(auiCtx.validations.foundationInput48.data, auiCtx.validations.foundationInput48.successCallback, auiCtx.validations.foundationInput48.errorCallback, auiCtx.validations.foundationInput48.cleanCallback, true, true);
                        },
                        "blur #rolenameInput input": function() {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-校验配置-角色名");
                            app.validate(auiCtx.validations.rolenameInput.data, auiCtx.validations.rolenameInput.successCallback, auiCtx.validations.rolenameInput.errorCallback, auiCtx.validations.rolenameInput.cleanCallback, true, true);
                        },
                        "blur #remarkInput input": function() {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-校验配置-备注");
                            app.validate(auiCtx.validations.remarkInput.data, auiCtx.validations.remarkInput.successCallback, auiCtx.validations.remarkInput.errorCallback, auiCtx.validations.remarkInput.cleanCallback, true, true);
                        },
                        "click #modalCreRolCtn [data-role='confirm']": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-新建角色");
                            $.ajax(auiCtx.ajaxOption._modalCreRolCtn__data_role__confirm___click);
                        },
                        "click #roleListDataTables #creBtn": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-新建角色");
                            app.modal($.extend(true, {}, auiCtx.configs.modalCreRolCtn, {
                                init: function() {},
                                confirmHandler: function() {},
                                cancelHandler: function() {},
                                ignoreHandler: function() {}
                            }));
                        },
                        "click #modalCreRolCtn [data-role='cancel']": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-关闭新建角色弹窗");
                            auiCtx.variables.modalCreRolCtn.hide();
                        },
                        "click #roleListDataTables #delBtn": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-删除角色");
                            app.modal($.extend(true, {}, auiCtx.configs.modalRemoveRolCtn, {
                                init: function() {},
                                confirmHandler: function() {},
                                cancelHandler: function() {},
                                ignoreHandler: function() {}
                            }));
                        },
                        "click #modalSetRolCtn [data-role='confirm']": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-配置权限");
                            $.ajax(auiCtx.ajaxOption._modalSetRolCtn__data_role__confirm___click);
                        },
                        "click #modalRemoveRolCtn [data-role='confirm']": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-删除角色");
                            $.ajax(auiCtx.ajaxOption._modalRemoveRolCtn__data_role__confirm___click);
                        },
                        "click #modalRemoveRolCtn [data-role='cancel']": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-“删除用户弹框”事件14");
                            auiCtx.variables.modalRemoveRolCtn.hide();
                        },
                        "click #roleListDataTables #relationBtn": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-关联权限");
                            auiCtx.variables.modalSetRolCtn.show(e, {
                                init: function() {},
                                confirmHandler: function() {},
                                cancelHandler: function() {},
                                ignoreHandler: function() {}
                            });
                        },
                        "click #modalSetRolCtn [data-role='cancel']": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-关闭“配置角色弹框”");
                            auiCtx.variables.modalSetRolCtn.hide();
                        },
                        "click #modalModifyRolCtn [data-role='confirm']": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-确认修改");
                            $.ajax(auiCtx.ajaxOption._modalModifyRolCtn__data_role__confirm___click);
                        },
                        "click #modalModifyRolCtn [data-role='cancel']": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-关闭修改弹出框");
                            auiCtx.variables.modalModifyRolCtn.hide();
                        },
                        "click #roleListDataTables #resetBtn": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-重置查询条件");
                            auiCtx.variables.queryRoleId.resetValue();
                            auiCtx.variables.queryRoleName.resetValue();
                            auiCtx.variables.queryCreateUser.resetValue();
                        },
                        "click.event_echo #roleListDataTables #relationBtn": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-关联权限内容回显");
                            $.ajax(auiCtx.ajaxOption._roleListDataTables__relationBtn_click_event_echo);
                        },
                        "click.event3694 #roleListDataTables #queryBtn": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-条件查询角色");
                            $.ajax(auiCtx.ajaxOption._roleListDataTables__queryBtn_click_event3694);
                        },
                        "click.event3774 #roleListDataTables #modBtn": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-修改角色");
                            auiCtx.variables.modalModifyRolCtn.show(e, {
                                init: function() {},
                                confirmHandler: function() {},
                                cancelHandler: function() {},
                                ignoreHandler: function() {}
                            });
                        },
                        "click.event3871 #roleListDataTables #modBtn": function(e) {
                            aweb.debug && aweb.stepTo("roleMgr-roleList-事件配置-修改角色回显");
                            $.ajax(auiCtx.ajaxOption._roleListDataTables__modBtn_click_event3871);
                        }
                    },
                    widgetLoadedEvents: {},
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
                        variables.divCtn1 = $AW.ctn.divCtn($("#divCtn1", $el), configs.divCtn1, attr.divCtn1, $AW.css("ctn.divCtn", css.divCtn1), auiCtx);
                        variables.roleListDataTables = $AW.component.dataTables($("#roleListDataTables", $el), configs.roleListDataTables, attr.roleListDataTables, $AW.css("component.dataTables", css.roleListDataTables), auiCtx);
                        variables.modalCreRolCtn = $AW.ctn.modalCtn($("#modalCreRolCtn", $el), configs.modalCreRolCtn, attr.modalCreRolCtn, $AW.css("ctn.modalCtn", css.modalCreRolCtn), auiCtx);
                        variables.modalSetRolCtn = $AW.ctn.modalCtn($("#modalSetRolCtn", $el), configs.modalSetRolCtn, attr.modalSetRolCtn, $AW.css("ctn.modalCtn", css.modalSetRolCtn), auiCtx);
                        variables.roleListTree = $AW.component.zTree($("#roleListTree", $el), configs.roleListTree, attr.roleListTree, $AW.css("component.zTree", css.roleListTree), auiCtx);
                        variables.modalRemoveRolCtn = $AW.ctn.modalCtn($("#modalRemoveRolCtn", $el), configs.modalRemoveRolCtn, attr.modalRemoveRolCtn, $AW.css("ctn.modalCtn", css.modalRemoveRolCtn), auiCtx);
                        variables.foundationFormCtn44 = $AW.ctn.foundationFormCtn($("#foundationFormCtn44", $el), configs.foundationFormCtn44, attr.foundationFormCtn44, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn44), auiCtx);
                        variables.foundationRowCtn45 = $AW.ctn.foundationRowCtn($("#foundationRowCtn45", $el), configs.foundationRowCtn45, attr.foundationRowCtn45, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn45), auiCtx);
                        variables.foundationRowCtn46 = $AW.ctn.foundationRowCtn($("#foundationRowCtn46", $el), configs.foundationRowCtn46, attr.foundationRowCtn46, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn46), auiCtx);
                        variables.foundationInput47 = $AW.component.foundationForm.foundationInput($("#foundationInput47", $el), configs.foundationInput47, attr.foundationInput47, $AW.css("component.foundationForm.foundationInput", css.foundationInput47), auiCtx);
                        variables.foundationInput48 = $AW.component.foundationForm.foundationInput($("#foundationInput48", $el), configs.foundationInput48, attr.foundationInput48, $AW.css("component.foundationForm.foundationInput", css.foundationInput48), auiCtx);
                        variables.modalModifyRolCtn = $AW.ctn.modalCtn($("#modalModifyRolCtn", $el), configs.modalModifyRolCtn, attr.modalModifyRolCtn, $AW.css("ctn.modalCtn", css.modalModifyRolCtn), auiCtx);
                        variables.foundationFormCtn50 = $AW.ctn.foundationFormCtn($("#foundationFormCtn50", $el), configs.foundationFormCtn50, attr.foundationFormCtn50, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn50), auiCtx);
                        variables.foundationRowCtn51 = $AW.ctn.foundationRowCtn($("#foundationRowCtn51", $el), configs.foundationRowCtn51, attr.foundationRowCtn51, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn51), auiCtx);
                        variables.foundationRowCtn52 = $AW.ctn.foundationRowCtn($("#foundationRowCtn52", $el), configs.foundationRowCtn52, attr.foundationRowCtn52, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn52), auiCtx);
                        variables.rolenameInput = $AW.component.foundationForm.foundationInput($("#rolenameInput", $el), configs.rolenameInput, attr.rolenameInput, $AW.css("component.foundationForm.foundationInput", css.rolenameInput), auiCtx);
                        variables.remarkInput = $AW.component.foundationForm.foundationInput($("#remarkInput", $el), configs.remarkInput, attr.remarkInput, $AW.css("component.foundationForm.foundationInput", css.remarkInput), auiCtx);
                        variables.foundationFormCtn55 = $AW.ctn.foundationFormCtn($("#foundationFormCtn55", $el), configs.foundationFormCtn55, attr.foundationFormCtn55, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn55), auiCtx);
                        variables.foundationRowCtn56 = $AW.ctn.foundationRowCtn($("#foundationRowCtn56", $el), configs.foundationRowCtn56, attr.foundationRowCtn56, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn56), auiCtx);
                        variables.queryRoleName = $AW.component.foundationForm.foundationInput($("#queryRoleName", $el), configs.queryRoleName, attr.queryRoleName, $AW.css("component.foundationForm.foundationInput", css.queryRoleName), auiCtx);
                        variables.queryCreateUser = $AW.component.foundationForm.foundationInput($("#queryCreateUser", $el), configs.queryCreateUser, attr.queryCreateUser, $AW.css("component.foundationForm.foundationInput", css.queryCreateUser), auiCtx);
                        variables.queryRoleId = $AW.component.foundationForm.foundationInput($("#queryRoleId", $el), configs.queryRoleId, attr.queryRoleId, $AW.css("component.foundationForm.foundationInput", css.queryRoleId), auiCtx);
                        variables.foundationFormCtn76 = $AW.ctn.foundationFormCtn($("#foundationFormCtn76", $el), configs.foundationFormCtn76, attr.foundationFormCtn76, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn76), auiCtx);
                        variables.foundationRowCtn77 = $AW.ctn.foundationRowCtn($("#foundationRowCtn77", $el), configs.foundationRowCtn77, attr.foundationRowCtn77, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn77), auiCtx);
                        variables.foundationText78 = $AW.component.foundationForm.foundationText($("#foundationText78", $el), configs.foundationText78, attr.foundationText78, $AW.css("component.foundationForm.foundationText", css.foundationText78), auiCtx);
                        auiCtx.lifecycle.roleListDataTables_load_init_000005.func();
                    },
                    auiCtxResume: function(auiCtx, $el, scope, handler) {
                        auiCtx.lifecycle.roleListDataTables_resume_init_000006.func();
                    },
                    auiCtxPause: function(auiCtx, $el, scope, handler) {},
                    auiCtxUnload: function(auiCtx, $el, scope, handler) {
                        auiCtx.variables.roleListDataTables.destroy();
                        auiCtx.variables.roleListTree.destroy();
                    }
                };
                window.aweb && window.aweb.debug && (window.auiCtx = auiCtx);
                return auiCtx;
            }());
        };
    };
});