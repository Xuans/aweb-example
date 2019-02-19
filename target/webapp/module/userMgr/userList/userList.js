define([].concat(window.aweb.transformJsConfig([ "ctn.foundationRowCtn", "ctn", "ctn.foundationFormCtn", "ctn.divCtn", "component.foundationForm", "component.foundationForm.foundationInput", "component.foundationForm.foundationText", "jquery.dataTables", "dataTables.fixedColumns.min", "component.dataTables", "ctn.modalCtn", "component.foundationForm.foundationRadioGroup" ])).concat(window.aweb.transformCssConfig([ "foundation/css/foundation.css", "AUI/css/layout.ctn.css", "jQuery.dataTables/css/jquery.dataTables.css", "jQuery.dataTables/css/fixedColumns.dataTables.css" ])), function() {
    return function() {
        return function() {
            return function(auiCtx) {
                "use strict";
                var $el, handler, scope, spaLifecycle;
                "IDETAG";
                "IDETAG";
                var USER_LIST_REFRESH = "user_list_refresh", NAMESPACE = ".user_list", REFRESH_URL = "./springmvc/user/listAllUsers.do";
                app.router.USER_LIST_REFRESH = USER_LIST_REFRESH;
                app.router.off(USER_LIST_REFRESH + NAMESPACE);
                app.router.on(USER_LIST_REFRESH + NAMESPACE, function(type) {
                    $.ajax({
                        type: "POST",
                        url: REFRESH_URL,
                        shelter: "正在加载数据，请稍候…",
                        success: function(response) {
                            if (response.status) {
                                if (response.type && response.type !== "AJAX") {
                                    app.open(response);
                                } else {
                                    auiCtx.variables.userListDataTables.refresh(response.content.result);
                                }
                            } else if (response.errorMsg) {
                                app.alert(response.errorMsg, app.alert.ERROR);
                            }
                        }
                    });
                });
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
                        modalCtn12: {
                            desp: "关联角色弹窗",
                            widgetName: "关联角色弹窗",
                            id: "modalCtn12"
                        },
                        relevanceDataTables: {
                            desp: "用户角色关联表",
                            widgetName: "用户角色关联表",
                            id: "relevanceDataTables",
                            "data-authority": "10"
                        },
                        modalCreUserCtn: {
                            desp: "新增用户弹窗",
                            widgetName: "新增用户弹窗",
                            id: "modalCreUserCtn"
                        },
                        foundationFormCtn63: {
                            desp: "Foundation表单容器63",
                            widgetName: "Foundation表单容器63",
                            name: "",
                            id: "foundationFormCtn63"
                        },
                        foundationRowCtn64: {
                            desp: "Foundation表单行容器64",
                            widgetName: "Foundation表单行容器64",
                            name: "",
                            id: "foundationRowCtn64"
                        },
                        foundationRowCtn65: {
                            desp: "Foundation表单行容器65",
                            widgetName: "Foundation表单行容器65",
                            name: "",
                            id: "foundationRowCtn65"
                        },
                        foundationRowCtn66: {
                            desp: "Foundation表单行容器66",
                            widgetName: "Foundation表单行容器66",
                            name: "",
                            id: "foundationRowCtn66"
                        },
                        usernameAdd: {
                            desp: "用户名",
                            widgetName: "用户名",
                            name: "",
                            id: "usernameAdd"
                        },
                        nicknameAdd: {
                            desp: "昵称",
                            widgetName: "昵称",
                            name: "",
                            id: "nicknameAdd"
                        },
                        telephoneAdd: {
                            desp: "手机",
                            widgetName: "手机",
                            name: "",
                            id: "telephoneAdd"
                        },
                        emailAdd: {
                            desp: "邮箱",
                            widgetName: "邮箱",
                            name: "",
                            id: "emailAdd"
                        },
                        userTypeAdd: {
                            desp: "用户类型",
                            widgetName: "用户类型",
                            name: "",
                            id: "userTypeAdd"
                        },
                        remarkAdd: {
                            desp: "备注",
                            widgetName: "备注",
                            name: "",
                            id: "remarkAdd"
                        },
                        modalModUserCtn: {
                            desp: "修改用户弹窗",
                            widgetName: "修改用户弹窗",
                            id: "modalModUserCtn"
                        },
                        foundationFormCtn1: {
                            desp: "Foundation表单容器63",
                            widgetName: "Foundation表单容器1",
                            name: "",
                            id: "foundationFormCtn1"
                        },
                        foundationRowCtn1: {
                            desp: "Foundation表单行容器64",
                            widgetName: "Foundation表单行容器1",
                            name: "",
                            id: "foundationRowCtn1"
                        },
                        foundationRowCtn2: {
                            desp: "Foundation表单行容器65",
                            widgetName: "Foundation表单行容器2",
                            name: "",
                            id: "foundationRowCtn2"
                        },
                        foundationRowCtn3: {
                            desp: "Foundation表单行容器66",
                            widgetName: "Foundation表单行容器3",
                            name: "",
                            id: "foundationRowCtn3"
                        },
                        nicknameMod: {
                            desp: "昵称",
                            widgetName: "昵称2",
                            name: "",
                            id: "nicknameMod"
                        },
                        emailMod: {
                            desp: "邮箱",
                            widgetName: "邮箱",
                            name: "",
                            id: "emailMod"
                        },
                        remarkMod: {
                            desp: "备注",
                            widgetName: "备注2",
                            name: "",
                            id: "remarkMod"
                        },
                        modalDetailCtn: {
                            desp: "详细信息弹窗容器",
                            widgetName: "详细信息弹窗容器",
                            id: "modalDetailCtn"
                        },
                        foundationFormCtn90: {
                            desp: "Foundation表单容器90",
                            widgetName: "Foundation表单容器90",
                            name: "",
                            id: "foundationFormCtn90"
                        },
                        foundationRowCtn91: {
                            desp: "Foundation表单行容器91",
                            widgetName: "Foundation表单行容器91",
                            name: "",
                            id: "foundationRowCtn91"
                        },
                        usernameDtl: {
                            desp: "用户名_详情",
                            widgetName: "用户名_详情",
                            id: "usernameDtl"
                        },
                        nicknameDtl: {
                            desp: "昵称",
                            widgetName: "昵称_详情",
                            id: "nicknameDtl"
                        },
                        foundationRowCtn4: {
                            desp: "Foundation表单行容器91",
                            widgetName: "Foundation表单行容器4",
                            name: "",
                            id: "foundationRowCtn4"
                        },
                        telephoneDtl: {
                            desp: "手机",
                            widgetName: "手机_详情",
                            id: "telephoneDtl"
                        },
                        usertypeDtl: {
                            desp: "用户类型",
                            widgetName: "用户类型_详情",
                            id: "usertypeDtl"
                        },
                        foundationRowCtn5: {
                            desp: "Foundation表单行容器91",
                            widgetName: "Foundation表单行容器5",
                            name: "",
                            id: "foundationRowCtn5"
                        },
                        createUserDtl: {
                            desp: "创建用户",
                            widgetName: "创建用户_详情",
                            id: "createUserDtl"
                        },
                        createTimeDtl: {
                            desp: "创建时间",
                            widgetName: "创建时间 _详情",
                            id: "createTimeDtl"
                        },
                        userIdDtl: {
                            desp: "用户ID",
                            widgetName: "用户ID_详情",
                            id: "userIdDtl"
                        },
                        emailDtl: {
                            desp: "邮箱",
                            widgetName: "邮箱_详情",
                            id: "emailDtl"
                        },
                        remarkDtl: {
                            desp: "备注",
                            widgetName: "备注_详情",
                            id: "remarkDtl"
                        },
                        foundationFormCtn96: {
                            desp: "Foundation表单容器96",
                            widgetName: "Foundation表单容器96",
                            name: "",
                            id: "foundationFormCtn96"
                        },
                        foundationRowCtn8: {
                            desp: "Foundation表单行容器91",
                            widgetName: "Foundation表单行容器8",
                            name: "",
                            id: "foundationRowCtn8"
                        },
                        updateTimeDtl: {
                            desp: "更新时间",
                            widgetName: "更新时间_详情",
                            id: "updateTimeDtl"
                        },
                        lastLoginTimeDtl: {
                            desp: "最后登录成功时间",
                            widgetName: "最后登录成功时间_详情",
                            id: "lastLoginTimeDtl"
                        },
                        lastFailedLoginTimeDtl: {
                            desp: "最后登录失败时间",
                            widgetName: "最后登录失败时间_详情",
                            id: "lastFailedLoginTimeDtl"
                        },
                        foundationRowCtn9: {
                            desp: "Foundation表单行容器91",
                            widgetName: "Foundation表单行容器9",
                            name: "",
                            id: "foundationRowCtn9"
                        },
                        lockTimeDtl: {
                            desp: "锁定开始时间",
                            widgetName: "锁定开始时间_详情",
                            id: "lockTimeDtl"
                        },
                        failedLoginCountDtl: {
                            desp: "连续登录错误次数",
                            widgetName: "连续登录错误次数_详情",
                            id: "failedLoginCountDtl"
                        },
                        lastHostAddressDtl: {
                            desp: "用户登录IP",
                            widgetName: "用户登录IP_详情",
                            id: "lastHostAddressDtl"
                        },
                        foundationFormCtn102: {
                            desp: "Foundation表单容器102",
                            widgetName: "Foundation表单容器102",
                            name: "",
                            id: "foundationFormCtn102"
                        },
                        foundationRowCtn103: {
                            desp: "Foundation表单行容器103",
                            widgetName: "Foundation表单行容器103",
                            name: "",
                            id: "foundationRowCtn103"
                        },
                        queryUserId: {
                            desp: "用户ID",
                            widgetName: "用户ID_查询",
                            name: "",
                            id: "queryUserId"
                        },
                        queryUsername: {
                            desp: "用户名",
                            widgetName: "用户名_查询",
                            name: "",
                            id: "queryUsername"
                        },
                        queryCreateUser: {
                            desp: "创建用户",
                            widgetName: "创建用户_查询",
                            name: "",
                            id: "queryCreateUser"
                        },
                        usertypeMod: {
                            desp: "用户类型",
                            widgetName: "用户类型",
                            name: "",
                            id: "usertypeMod"
                        },
                        telephoneMod: {
                            desp: "手机",
                            widgetName: "手机",
                            name: "",
                            id: "telephoneMod"
                        },
                        usernameMod: {
                            desp: "普通输入框108",
                            widgetName: "用户名",
                            name: "",
                            id: "usernameMod"
                        },
                        divCtn2: {
                            desp: "普通容器1",
                            widgetName: "普通容器2",
                            id: "divCtn2",
                            "data-authority": "10"
                        },
                        userListDataTables: {
                            desp: "表格",
                            widgetName: "用户列表",
                            id: "userListDataTables",
                            "data-authority": "10"
                        }
                    },
                    css: {},
                    configs: {
                        modalCtn12: {
                            btnCancel: "取消",
                            backdrop: "static",
                            btnIgnore: "",
                            reset: false,
                            isLargeModal: false,
                            title: "关联角色",
                            content: function() {
                                return $("#modalCtn12", $el);
                            },
                            btnConfirm: "确认"
                        },
                        relevanceDataTables: {
                            columns: {
                                edmID: "D3B0547D6292E18592C7-1EE0",
                                edmKey: "sTitle",
                                elements: [ {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "角色ID(ROL)",
                                    sWidth: "150px",
                                    edmKey: "角色ID(ROL)",
                                    bVisible: true,
                                    edmItemId: "935A9E8963564F94B60C36110EB1C18A.0"
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "角色名(ROL)",
                                    sWidth: "150px",
                                    edmKey: "角色名(ROL)",
                                    bVisible: true,
                                    edmItemId: "8C3EF81A82E44374833F8FD523868768.1"
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "备注(ROL)",
                                    sWidth: "150px",
                                    bVisible: true,
                                    edmKey: "备注(ROL)",
                                    edmItemId: "EEB9A50F22734B9FB737D41E1AB6E839.2"
                                } ],
                                fields: [ "角色ID(ROL)", "角色名(ROL)", "备注(ROL)" ],
                                keys: [ "roleId", "roleName", "remark" ]
                            },
                            bInfo: true,
                            searching: false,
                            bSateSave: true,
                            bDestroy: true,
                            selectOption: "checkbox",
                            sDom: "",
                            paging: true,
                            bLengthChange: false,
                            columnAsId: 0,
                            testForUpdate: true,
                            detailInfo: {
                                sEmptyTable: "无数据",
                                sInfoEmpty: "表中无数据",
                                sZeroRecords: "找不到相关数据"
                            },
                            closeTitle: false,
                            rows: {
                                btnColName: "操作列"
                            },
                            bCheckState: false,
                            fixedColumns: {
                                leftColumns: "",
                                rightColumns: ""
                            },
                            scrollX: false,
                            scrollCollapse: true,
                            highlight: {
                                columnIndex: "",
                                colorArray: [ {
                                    key: "",
                                    bgColor: "",
                                    color: ""
                                } ]
                            },
                            statusConfig: {
                                columnIndex: ""
                            },
                            aMenuLength: [ 10, 20, 50, 100 ]
                        },
                        modalCreUserCtn: {
                            btnCancel: "取消",
                            backdrop: "static",
                            btnIgnore: "",
                            reset: true,
                            isLargeModal: true,
                            title: "新增用户",
                            content: function() {
                                return $("#modalCreUserCtn", $el);
                            },
                            btnConfirm: "创建"
                        },
                        foundationFormCtn63: {
                            formLayout: "inline",
                            labelAlign: "text-right",
                            labelSpan: 2,
                            backPlane: false,
                            header: "",
                            collapse: false,
                            span: 6
                        },
                        foundationRowCtn64: {
                            header: ""
                        },
                        foundationRowCtn65: {
                            header: ""
                        },
                        foundationRowCtn66: {
                            header: ""
                        },
                        usernameAdd: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "用户名",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "用户名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        nicknameAdd: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "昵称",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "昵称必须为中文，长度为4至8位",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        telephoneAdd: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "手机",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "手机不能为空",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        emailAdd: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "邮箱",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "请输入正确的邮箱格式",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        userTypeAdd: {
                            horizontal: true,
                            mustInput: false,
                            labelAlign: "",
                            labelSpan: "",
                            radioGroup: [ {
                                checked: false,
                                label: "管理员",
                                value: 0
                            }, {
                                checked: true,
                                label: "普通用户",
                                value: 1
                            } ],
                            disabled: false,
                            label: "用户类型",
                            span: 5
                        },
                        remarkAdd: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "备注",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "备注不能为空",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        modalModUserCtn: {
                            btnCancel: "取消",
                            backdrop: "static",
                            btnIgnore: "",
                            reset: true,
                            isLargeModal: true,
                            title: "修改用户",
                            content: function() {
                                return $("#modalModUserCtn", $el);
                            },
                            btnConfirm: "修改"
                        },
                        foundationFormCtn1: {
                            formLayout: "inline",
                            labelAlign: "text-right",
                            labelSpan: 2,
                            backPlane: false,
                            header: "",
                            collapse: false,
                            span: 6
                        },
                        foundationRowCtn1: {
                            header: ""
                        },
                        foundationRowCtn2: {
                            header: ""
                        },
                        foundationRowCtn3: {
                            header: ""
                        },
                        nicknameMod: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "昵称",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "昵称必须为中文，长度为4至8位",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        emailMod: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "邮箱",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "请输入正确的邮箱格式",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        remarkMod: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "备注",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "备注不能为空",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        modalDetailCtn: {
                            btnCancel: "取消",
                            backdrop: "static",
                            btnIgnore: "",
                            reset: true,
                            isLargeModal: true,
                            title: "用户信息",
                            content: function() {
                                return $("#modalDetailCtn", $el);
                            },
                            btnConfirm: "确认"
                        },
                        foundationFormCtn90: {
                            formLayout: "inline",
                            labelAlign: "text-right",
                            labelSpan: 2,
                            backPlane: false,
                            header: "基本信息",
                            collapse: true,
                            span: 4
                        },
                        foundationRowCtn91: {
                            header: ""
                        },
                        usernameDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "用户名：",
                            content: "<p><br></p>",
                            span: ""
                        },
                        nicknameDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "昵称：",
                            content: "<p><br></p>",
                            span: ""
                        },
                        foundationRowCtn4: {
                            header: ""
                        },
                        telephoneDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "手机：",
                            content: "<p><br></p>",
                            span: ""
                        },
                        usertypeDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "用户类型：",
                            content: "<p><br></p>",
                            span: ""
                        },
                        foundationRowCtn5: {
                            header: ""
                        },
                        createUserDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "创建用户：",
                            content: "<p><br></p>",
                            span: ""
                        },
                        createTimeDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "创建时间 :",
                            content: "<p><br></p>",
                            span: 4
                        },
                        userIdDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "用户ID:",
                            content: "<p><br></p>",
                            span: 4
                        },
                        emailDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "邮箱：",
                            content: "<p><br></p>",
                            span: 4
                        },
                        remarkDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "备注：",
                            content: "<p><br></p>",
                            span: 4
                        },
                        foundationFormCtn96: {
                            formLayout: "inline",
                            labelAlign: "text-right",
                            labelSpan: 2,
                            backPlane: false,
                            header: "其他信息",
                            collapse: true,
                            span: 4
                        },
                        foundationRowCtn8: {
                            header: ""
                        },
                        updateTimeDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "更新时间:",
                            content: "<p><br></p>",
                            span: ""
                        },
                        lastLoginTimeDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "最后登录成功时间:",
                            content: "<p><br></p>",
                            span: ""
                        },
                        lastFailedLoginTimeDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "最后登录失败时间:",
                            content: "<p><br></p>",
                            span: 4
                        },
                        foundationRowCtn9: {
                            header: ""
                        },
                        lockTimeDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "锁定开始时间:",
                            content: "<p><br></p>",
                            span: ""
                        },
                        failedLoginCountDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "连续登录错误次数:",
                            content: "<p><br></p>",
                            span: ""
                        },
                        lastHostAddressDtl: {
                            labelAlign: "",
                            labelSpan: "",
                            label: "用户登录IP:",
                            content: "<p><br></p>",
                            span: ""
                        },
                        foundationFormCtn102: {
                            formLayout: "inline",
                            labelAlign: "text-right",
                            labelSpan: 1,
                            backPlane: false,
                            header: "查询",
                            collapse: true,
                            span: 4
                        },
                        foundationRowCtn103: {
                            header: ""
                        },
                        queryUserId: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "用户ID",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "",
                            value: "",
                            append: "",
                            span: 3,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        queryUsername: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "用户名",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "",
                            value: "",
                            append: "",
                            span: 3,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        queryCreateUser: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "创建用户",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "",
                            value: "",
                            append: "",
                            span: 3,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        usertypeMod: {
                            horizontal: true,
                            mustInput: false,
                            labelAlign: "",
                            labelSpan: "",
                            radioGroup: [ {
                                checked: false,
                                label: "管理员",
                                value: 0
                            }, {
                                checked: true,
                                label: "普通用户",
                                value: 1
                            } ],
                            disabled: false,
                            label: "用户类型",
                            span: 5
                        },
                        telephoneMod: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "手机",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: false,
                            placeholder: "手机不能为空",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        usernameMod: {
                            mustInput: false,
                            errorMsgOrientation: "bottom",
                            prepend: "",
                            input_type: "",
                            useIcon: false,
                            label: "用户名",
                            labelAlign: "",
                            labelSpan: "",
                            disabled: true,
                            placeholder: "",
                            value: "",
                            append: "",
                            span: 5,
                            minAmount: "",
                            maxAmount: "",
                            autocomplete: false,
                            icon: "",
                            iconPosition: 1
                        },
                        divCtn2: {
                            backPlane: false,
                            header: "",
                            collapse: false,
                            titleInfo: {
                                edmID: "ADDDFB04D7B763643659-2F23",
                                edmKey: "",
                                fields: [],
                                keys: []
                            },
                            infoPosition: "right",
                            packupBtn: false,
                            pickupHeight: ""
                        },
                        userListDataTables: {
                            buttons: [ {
                                name: "查询",
                                id: "queryBtn",
                                type: "",
                                uuid: "56D9A0C602AE173D598D-ED69",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0
                            }, {
                                name: "重置",
                                id: "resetBtn",
                                type: "",
                                uuid: "CDA7C2F9CDC9D9E7C952-451E",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0
                            }, {
                                name: "新增",
                                id: "createUserBtn",
                                type: "",
                                uuid: "3D991FCA4FDBFDCB8287-96DF",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0
                            }, {
                                name: "修改",
                                id: "editUserBtn",
                                type: "only",
                                uuid: "350783C3EC08F15237FF-C837",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0
                            }, {
                                name: "删除",
                                id: "deleteUserBtn",
                                type: "only",
                                uuid: "9E8A6DD37A44FED75465-BE3F",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0
                            }, {
                                name: "关联角色",
                                id: "relationRoleBtn",
                                type: "only",
                                uuid: "2884B59217BE1DB13D8E-EB98",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0
                            }, {
                                name: "解锁",
                                id: "unlockUserBtn",
                                type: "only",
                                uuid: "0BCCE5F6CA0B2D4A229E-8422",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0
                            }, {
                                name: "详细信息",
                                id: "detailBtn",
                                type: "only",
                                uuid: "4E46FC005D818859A3E4-62DD",
                                useIcon: false,
                                icon: "",
                                iconPosition: 0
                            } ],
                            columns: {
                                edmID: "C6EAE5461C9739CBC4CB-6E66",
                                edmKey: "sTitle",
                                elements: [ {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "用户ID",
                                    sWidth: "150px",
                                    edmKey: "用户ID",
                                    bVisible: true,
                                    uuid: "D9E0F69F099A4B94A373B56B77C8F197",
                                    edmItemId: "E98743623C734C018EB3C2E950A748AD.0"
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "用户名",
                                    sWidth: "150px",
                                    edmKey: "用户名",
                                    bVisible: true,
                                    uuid: "CA050BB6D646C6B143D2-0808",
                                    edmItemId: "4E4F31B506AB4568ADDAA49FF8F1CF1F.1"
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "昵称",
                                    sWidth: "150px",
                                    edmKey: "昵称",
                                    bVisible: true,
                                    uuid: "A9E3D956CFD25CC367AC-DAB3",
                                    edmItemId: "CCE74198624C452B8D8FC92BF5A10F23.2"
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "创建用户",
                                    sWidth: "150px",
                                    edmKey: "创建用户",
                                    bVisible: true,
                                    uuid: "C7C70F3DFC4EDD946C4C-3C95",
                                    edmItemId: "0185E04453D6411DAC84BD7325F30304.3"
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "创建时间",
                                    sWidth: "150px",
                                    edmKey: "创建时间",
                                    bVisible: true,
                                    uuid: "E2EA2610434399A02BE9-3B56",
                                    edmItemId: "F23CB6CC0DCC4DD29CB24C7C059FC0E6.4"
                                }, {
                                    isReturned: false,
                                    bSortable: false,
                                    sTitle: "状态",
                                    sWidth: "150px",
                                    bVisible: true,
                                    uuid: "E89877B705A757BDFB32-25FC",
                                    edmKey: "状态",
                                    edmItemId: "9DA2E72E7D6D4BE8A91E1668DBBB5D97.5"
                                } ],
                                fields: [ "用户ID", "用户名", "昵称", "创建用户", "创建时间", "状态" ],
                                keys: [ "userId", "username", "nickname", "createUser", "createTime", "state" ]
                            },
                            bInfo: true,
                            searching: true,
                            bSateSave: true,
                            bDestroy: true,
                            selectOption: "radio",
                            sDom: "tilp",
                            paging: true,
                            bLengthChange: true,
                            columnAsId: 0,
                            testForUpdate: true,
                            detailInfo: {
                                sEmptyTable: "无数据",
                                sInfoEmpty: "表中无数据",
                                sZeroRecords: "找不到相关数据"
                            },
                            closeTitle: false,
                            rows: {
                                btnColName: "操作列"
                            },
                            bCheckState: false,
                            fixedColumns: {
                                leftColumns: "",
                                rightColumns: ""
                            },
                            scrollX: false,
                            scrollCollapse: true,
                            highlight: {
                                columnIndex: "",
                                colorArray: [ {
                                    key: "",
                                    bgColor: "",
                                    color: ""
                                } ]
                            },
                            statusConfig: {
                                columnIndex: ""
                            },
                            aMenuLength: [ 10, 20, 50, 100 ]
                        }
                    },
                    pageNSL: [],
                    widgetNSL: {},
                    validations: {
                        usernameAdd: {
                            data: function() {
                                return [ {
                                    desp: "用户名",
                                    name: "usernameAdd",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "用户名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                                        regex: "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$",
                                        id: "#usernameAdd input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "usernameAdd",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.usernameAdd.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.usernameAdd.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.usernameAdd.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.usernameAdd.clean.apply($el, arguments);
                            }
                        },
                        nicknameAdd: {
                            data: function() {
                                return [ {
                                    desp: "昵称",
                                    name: "nicknameAdd",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "昵称必须为中文，长度为4至8位",
                                        regex: "^[\\u4e00-\\u9fa5]{4,8}$",
                                        id: "#nicknameAdd input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "nicknameAdd",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.nicknameAdd.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.nicknameAdd.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.nicknameAdd.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.nicknameAdd.clean.apply($el, arguments);
                            }
                        },
                        telephoneAdd: {
                            data: function() {
                                return [ {
                                    desp: "手机",
                                    name: "telephoneAdd",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "手机不能为空",
                                        regex: "^[0-9]{6,11}$",
                                        id: "#telephoneAdd input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "telephoneAdd",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.telephoneAdd.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.telephoneAdd.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.telephoneAdd.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.telephoneAdd.clean.apply($el, arguments);
                            }
                        },
                        emailAdd: {
                            data: function() {
                                return [ {
                                    desp: "邮箱",
                                    name: "emailAdd",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "请输入正确的邮箱格式",
                                        regex: "^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[a-zA-Z]{2,4}$",
                                        id: "#emailAdd input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "emailAdd",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.emailAdd.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.emailAdd.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.emailAdd.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.emailAdd.clean.apply($el, arguments);
                            }
                        },
                        remarkAdd: {
                            data: function() {
                                return [ {
                                    desp: "备注",
                                    name: "remarkAdd",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "备注不能为空",
                                        regex: "^[\\s\\S]+$",
                                        id: "#remarkAdd input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "remarkAdd",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.remarkAdd.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.remarkAdd.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.remarkAdd.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.remarkAdd.clean.apply($el, arguments);
                            }
                        },
                        nicknameMod: {
                            data: function() {
                                return [ {
                                    desp: "昵称2",
                                    name: "nicknameMod",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "昵称必须为中文，长度为4至8位",
                                        regex: "^[\\u4e00-\\u9fa5]{4,8}$",
                                        id: "#nicknameMod input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "nicknameMod",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.nicknameMod.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.nicknameMod.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.nicknameMod.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.nicknameMod.clean.apply($el, arguments);
                            }
                        },
                        emailMod: {
                            data: function() {
                                return [ {
                                    desp: "邮箱",
                                    name: "emailMod",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "请输入正确的邮箱格式",
                                        regex: "^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[a-zA-Z]{2,4}$",
                                        id: "#emailMod input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "emailMod",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.emailMod.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.emailMod.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.emailMod.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.emailMod.clean.apply($el, arguments);
                            }
                        },
                        remarkMod: {
                            data: function() {
                                return [ {
                                    desp: "备注2",
                                    name: "remarkMod",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "备注不能为空",
                                        regex: "^[\\s\\S]+$",
                                        id: "#remarkMod input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "remarkMod",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.remarkMod.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.remarkMod.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.remarkMod.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.remarkMod.clean.apply($el, arguments);
                            }
                        },
                        telephoneMod: {
                            data: function() {
                                return [ {
                                    desp: "手机",
                                    name: "telephoneMod",
                                    validate: {
                                        validateType: "blur",
                                        minLength: 0,
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        errorMsg: "手机不能为空",
                                        regex: "^[0-9]{6,11}$",
                                        id: "#telephoneMod input",
                                        maxLength: 0,
                                        context: $el,
                                        widgetID: "telephoneMod",
                                        pageContext: auiCtx
                                    },
                                    value: auiCtx.variables.telephoneMod.getValue()
                                } ];
                            },
                            successCallback: function() {
                                auiCtx.variables.telephoneMod.success.apply($el, arguments);
                            },
                            errorCallback: function() {
                                auiCtx.variables.telephoneMod.error.apply($el, arguments);
                            },
                            cleanCallback: function() {
                                auiCtx.variables.telephoneMod.clean.apply($el, arguments);
                            }
                        }
                    },
                    lifecycle: {
                        userListDataTables_load_init_000009: {
                            func: function() {
                                aweb.debug && aweb.stepTo("userMgr-userList-生命周期配置-初始加载用户列表");
                                /**
 * 
 *初始化表格数据
 *此方法定义在自定义代码中
 *
 */
                                app.router.trigger(app.router.USER_LIST_REFRESH);
                            },
                            times: 0,
                            clock: 1e3,
                            immediate: false,
                            isPause: true
                        },
                        userListDataTables_resume_init_000010: {
                            func: function() {
                                aweb.debug && aweb.stepTo("userMgr-userList-生命周期配置-用户列表切入操作6479");
                                /**
 * 
 *刷新表格数据
 *此方法定义在自定义代码中
 *
 */
                                app.router.trigger(app.router.USER_LIST_REFRESH);
                            },
                            times: 0,
                            clock: 1e3,
                            immediate: false,
                            isPause: true
                        }
                    },
                    variables: {},
                    ajaxOption: {
                        _modalCtn12__data_role__confirm___click: {
                            type: "POST",
                            url: "./springmvc/user/doUserRelevanceRoles.do",
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
                                pageParams.roles = auiCtx.variables.relevanceDataTables.list();
                                data = [ {
                                    name: "userId",
                                    value: pageParams.userId
                                }, {
                                    name: "roleIds",
                                    value: pageParams.roles
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        app.alert("关联角色成功！");
                                        auiCtx.variables.modalCtn12.hide();
                                        auiCtx.eventCallback._modalCtn12__data_role__confirm___click(response);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _modalCreUserCtn__data_role__confirm___click: {
                            type: "POST",
                            url: "./springmvc/user/addUser.do",
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
                                    desp: "用户名",
                                    name: "username",
                                    validate: {
                                        regex: "^(?!\\d+$)(?![a-zA-Z]+$)(?!_+$)[a-zA-Z]{1}[a-zA-Z0-9_]{5,19}$",
                                        errorMsg: "用户名必须字母开头，是字母、数字或下划线中的任两种的组合，长度为6至20位",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "usernameAdd",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.usernameAdd.getValue()
                                }, {
                                    desp: "昵称",
                                    name: "nickname",
                                    validate: {
                                        regex: "^[\\u4e00-\\u9fa5]{4,8}$",
                                        errorMsg: "昵称必须为中文，长度为4至8位",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "nicknameAdd",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.nicknameAdd.getValue()
                                }, {
                                    desp: "备注",
                                    name: "remark",
                                    validate: {
                                        regex: "^[\\s\\S]+$",
                                        errorMsg: "备注不能为空",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "remarkAdd",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.remarkAdd.getValue()
                                }, {
                                    desp: "邮箱",
                                    name: "email",
                                    validate: {
                                        regex: "^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[a-zA-Z]{2,4}$",
                                        errorMsg: "请输入正确的邮箱格式",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "emailAdd",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.emailAdd.getValue()
                                }, {
                                    desp: "手机号",
                                    name: "telephone",
                                    validate: {
                                        regex: "^[0-9]{6,11}$",
                                        errorMsg: "手机不能为空",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "telephoneAdd",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.telephoneAdd.getValue()
                                }, {
                                    desp: "用户类型",
                                    name: "userType",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        widgetID: "userTypeAdd",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.userTypeAdd.getValue()
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._modalCreUserCtn__data_role__confirm___click(response);
                                        auiCtx.variables.modalCreUserCtn.hide();
                                        app.alert("创建用户成功！", app.alert.SUCCESS);
                                        app.router.trigger(app.router.USER_LIST_REFRESH);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _modalModUserCtn__data_role__confirm___click: {
                            type: "POST",
                            url: "./springmvc/user/editUser.do",
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
                                pageParams.userId = auiCtx.variables.userListDataTables.list();
                                pageParams.userId = pageParams.userId[0];
                                data = [ {
                                    desp: "用户唯一标识",
                                    name: "userId",
                                    validate: {
                                        regex: "",
                                        errorMsg: ""
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.userId
                                }, {
                                    desp: "昵称",
                                    name: "nickname",
                                    validate: {
                                        regex: "^[\\u4e00-\\u9fa5]{4,8}$",
                                        errorMsg: "昵称必须为中文，长度为4至8位",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "nicknameMod",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.nicknameMod.getValue()
                                }, {
                                    desp: "备注",
                                    name: "remark",
                                    validate: {
                                        regex: "^[\\s\\S]+$",
                                        errorMsg: "备注不能为空",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "remarkMod",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.remarkMod.getValue()
                                }, {
                                    desp: "邮箱",
                                    name: "email",
                                    validate: {
                                        regex: "^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\\.[a-zA-Z]{2,4}$",
                                        errorMsg: "请输入正确的邮箱格式",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "emailMod",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.emailMod.getValue()
                                }, {
                                    desp: "手机号",
                                    name: "telephone",
                                    validate: {
                                        regex: "^[0-9]{6,11}$",
                                        errorMsg: "手机不能为空",
                                        require: "true",
                                        hasChineseCharacter: "false",
                                        widgetID: "telephoneMod",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.telephoneMod.getValue()
                                }, {
                                    desp: "用户类型",
                                    name: "userType",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        widgetID: "usertypeMod",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.usertypeMod.getValue()
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        app.alert("修改用户成功！", app.alert.SUCCESS);
                                        auiCtx.eventCallback._modalModUserCtn__data_role__confirm___click(response);
                                        auiCtx.variables.modalModUserCtn.hide();
                                        app.router.trigger(app.router.USER_LIST_REFRESH);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _userListDataTables__deleteUserBtn_click: {
                            type: "POST",
                            url: "./springmvc/user/deleteUser.do",
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
                                pageParams.userId = auiCtx.variables.userListDataTables.list();
                                pageParams.userId = pageParams.userId[0];
                                data = [ {
                                    desp: "用户唯一ID",
                                    name: "userId",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        widgetID: "widgetMissing",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.userId
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        app.alert("删除用户成功！", app.alert.SUCCESS);
                                        auiCtx.eventCallback._userListDataTables__deleteUserBtn_click(response);
                                        app.router.trigger(app.router.USER_LIST_REFRESH);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _userListDataTables__unlockUserBtn_click: {
                            type: "POST",
                            url: "./springmvc/user/doUnlockUser.do",
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
                                pageParams.userId = auiCtx.variables.userListDataTables.list();
                                pageParams.userId = pageParams.userId[0];
                                data = [ {
                                    desp: "用户唯一ID",
                                    name: "userIds",
                                    validate: {
                                        regex: "",
                                        errorMsg: ""
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.userId
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        app.alert("解锁成功！");
                                        auiCtx.eventCallback._userListDataTables__unlockUserBtn_click(response);
                                        app.router.trigger(app.router.USER_LIST_REFRESH);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _userListDataTables__queryBtn_click: {
                            type: "POST",
                            url: "./springmvc/user/queryUserListByOpt.do",
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
                                    desp: "用户唯一标识",
                                    name: "userId",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        widgetID: "queryUserId",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.queryUserId.getValue()
                                }, {
                                    desp: "查询用户名",
                                    name: "queryUserName",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        require: "false",
                                        hasChineseCharacter: "false",
                                        widgetID: "queryUsername",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: auiCtx.variables.queryUsername.getValue()
                                }, {
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
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._userListDataTables__queryBtn_click(response);
                                        auiCtx.variables.userListDataTables.refresh(response.content.result);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _userListDataTables__detailBtn_click_event_echo: {
                            type: "POST",
                            url: "./springmvc/user/querySingleUserByUserId.do",
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
                                pageParams.userId = auiCtx.variables.userListDataTables.list();
                                pageParams.userId = pageParams.userId[0];
                                data = [ {
                                    desp: "用户唯一标识",
                                    name: "userId",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        widgetID: "widgetMissing",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.userId
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._userListDataTables__detailBtn_click_event_echo(response);
                                        auiCtx.variables.usertypeDtl.setValue(response.content.result.userType === "0" ? "管理员" : "普通用户");
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        },
                        _userListDataTables__editUserBtn_click_event6472: {
                            type: "POST",
                            url: "./springmvc/user/querySingleUserByUserId.do",
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
                                pageParams.userId = auiCtx.variables.userListDataTables.list();
                                data = [ {
                                    desp: "用户ID",
                                    name: "userId",
                                    validate: {
                                        regex: "",
                                        errorMsg: "",
                                        widgetID: "widgetMissing",
                                        pageContext: auiCtx
                                    },
                                    queryString: false,
                                    urlExternal: false,
                                    value: pageParams.userId[0]
                                } ];
                                return data;
                            },
                            shelter: "正在加载数据，请稍候…",
                            success: function(response) {
                                if (response.status) {
                                    if (response.type && response.type !== "AJAX") {
                                        app.open(response);
                                    } else {
                                        auiCtx.eventCallback._userListDataTables__editUserBtn_click_event6472(response);
                                    }
                                } else if (response.errorMsg) {
                                    app.alert(response.errorMsg, app.alert.ERROR);
                                }
                            }
                        }
                    },
                    eventCallback: {
                        _modalCtn12__data_role__confirm___click: function(response) {},
                        _modalCreUserCtn__data_role__confirm___click: function(response) {},
                        _modalModUserCtn__data_role__confirm___click: function(response) {},
                        _userListDataTables__deleteUserBtn_click: function(response) {},
                        _userListDataTables__unlockUserBtn_click: function(response) {},
                        _userListDataTables__queryBtn_click: function(response) {},
                        _userListDataTables__detailBtn_click_event_echo: function(response) {
                            auiCtx.variables.usernameDtl.setValue(response.content.result.username);
                            auiCtx.variables.telephoneDtl.setValue(response.content.result.telephone);
                            auiCtx.variables.nicknameDtl.setValue(response.content.result.nickname);
                            auiCtx.variables.usertypeDtl.setValue(response.content.result.userType);
                            auiCtx.variables.remarkDtl.setValue(response.content.result.remark);
                            auiCtx.variables.emailDtl.setValue(response.content.result.email);
                            auiCtx.variables.lastLoginTimeDtl.setValue(response.content.result.lastLoginTime);
                            auiCtx.variables.lastFailedLoginTimeDtl.setValue(response.content.result.lastFailedLoginTime);
                            auiCtx.variables.lastHostAddressDtl.setValue(response.content.result.lastHostAddress);
                            auiCtx.variables.lockTimeDtl.setValue(response.content.result.lockTime);
                            auiCtx.variables.updateTimeDtl.setValue(response.content.result.updateTime);
                            auiCtx.variables.createTimeDtl.setValue(response.content.result.createTime);
                            auiCtx.variables.createUserDtl.setValue(response.content.result.createUser);
                            auiCtx.variables.failedLoginCountDtl.setValue(response.content.result.failedLoginCount);
                            auiCtx.variables.userIdDtl.setValue(response.content.result.userId);
                        },
                        _userListDataTables__editUserBtn_click_event6472: function(response) {
                            auiCtx.variables.usernameMod.setValue(response.content.result.username);
                            auiCtx.variables.nicknameMod.setValue(response.content.result.nickname);
                            auiCtx.variables.telephoneMod.setValue(response.content.result.telephone);
                            auiCtx.variables.remarkMod.setValue(response.content.result.remark);
                            auiCtx.variables.usertypeMod.setValue(response.content.result.userType);
                            auiCtx.variables.emailMod.setValue(response.content.result.email);
                        }
                    },
                    delegateEvents: {
                        "blur #usernameAdd input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-用户名");
                            app.validate(auiCtx.validations.usernameAdd.data, auiCtx.validations.usernameAdd.successCallback, auiCtx.validations.usernameAdd.errorCallback, auiCtx.validations.usernameAdd.cleanCallback, true, true);
                        },
                        "blur #nicknameAdd input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-昵称");
                            app.validate(auiCtx.validations.nicknameAdd.data, auiCtx.validations.nicknameAdd.successCallback, auiCtx.validations.nicknameAdd.errorCallback, auiCtx.validations.nicknameAdd.cleanCallback, true, true);
                        },
                        "blur #telephoneAdd input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-手机");
                            app.validate(auiCtx.validations.telephoneAdd.data, auiCtx.validations.telephoneAdd.successCallback, auiCtx.validations.telephoneAdd.errorCallback, auiCtx.validations.telephoneAdd.cleanCallback, true, true);
                        },
                        "blur #emailAdd input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-邮箱");
                            app.validate(auiCtx.validations.emailAdd.data, auiCtx.validations.emailAdd.successCallback, auiCtx.validations.emailAdd.errorCallback, auiCtx.validations.emailAdd.cleanCallback, true, true);
                        },
                        "blur #remarkAdd input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-备注");
                            app.validate(auiCtx.validations.remarkAdd.data, auiCtx.validations.remarkAdd.successCallback, auiCtx.validations.remarkAdd.errorCallback, auiCtx.validations.remarkAdd.cleanCallback, true, true);
                        },
                        "blur #nicknameMod input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-昵称2");
                            app.validate(auiCtx.validations.nicknameMod.data, auiCtx.validations.nicknameMod.successCallback, auiCtx.validations.nicknameMod.errorCallback, auiCtx.validations.nicknameMod.cleanCallback, true, true);
                        },
                        "blur #emailMod input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-邮箱");
                            app.validate(auiCtx.validations.emailMod.data, auiCtx.validations.emailMod.successCallback, auiCtx.validations.emailMod.errorCallback, auiCtx.validations.emailMod.cleanCallback, true, true);
                        },
                        "blur #remarkMod input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-备注2");
                            app.validate(auiCtx.validations.remarkMod.data, auiCtx.validations.remarkMod.successCallback, auiCtx.validations.remarkMod.errorCallback, auiCtx.validations.remarkMod.cleanCallback, true, true);
                        },
                        "blur #telephoneMod input": function() {
                            aweb.debug && aweb.stepTo("userMgr-userList-校验配置-手机");
                            app.validate(auiCtx.validations.telephoneMod.data, auiCtx.validations.telephoneMod.successCallback, auiCtx.validations.telephoneMod.errorCallback, auiCtx.validations.telephoneMod.cleanCallback, true, true);
                        },
                        "click #modalCtn12 [data-role='confirm']": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-关联角色事件");
                            $.ajax(auiCtx.ajaxOption._modalCtn12__data_role__confirm___click);
                        },
                        "click #modalCtn12 [data-role='cancel']": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-关闭弹窗");
                            auiCtx.variables.modalCtn12.hide();
                        },
                        "click #modalCreUserCtn [data-role='confirm']": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-确认新增用户");
                            $.ajax(auiCtx.ajaxOption._modalCreUserCtn__data_role__confirm___click);
                        },
                        "click #modalCreUserCtn [data-role='cancel']": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-取消新增用户弹窗");
                            auiCtx.variables.modalCreUserCtn.hide();
                        },
                        "click #modalModUserCtn [data-role='confirm']": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-确认修改用户");
                            $.ajax(auiCtx.ajaxOption._modalModUserCtn__data_role__confirm___click);
                        },
                        "click #modalModUserCtn [data-role='cancel']": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-取消修改用户弹窗");
                            auiCtx.variables.modalModUserCtn.hide();
                        },
                        "click #modalDetailCtn [data-role='confirm']": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-“详细信息弹窗容器”事件728");
                            auiCtx.variables.modalDetailCtn.hide();
                        },
                        "click #modalDetailCtn [data-role='cancel']": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-“详细信息弹窗容器”事件729");
                            auiCtx.variables.modalDetailCtn.hide();
                        },
                        "click #userListDataTables #createUserBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-新增用户事件");
                            auiCtx.variables.modalCreUserCtn.show(e, {
                                width: "800px",
                                height: "280px"
                            });
                            auiCtx.variables.userTypeAdd.setValue(1);
                        },
                        "click #userListDataTables #deleteUserBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-删除用户事件");
                            $.ajax(auiCtx.ajaxOption._userListDataTables__deleteUserBtn_click);
                        },
                        "click #userListDataTables #editUserBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-修改用户事件");
                            auiCtx.variables.modalModUserCtn.show(e, {
                                width: "800px",
                                height: "280px"
                            });
                        },
                        "click #userListDataTables #unlockUserBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-解锁用户事件");
                            $.ajax(auiCtx.ajaxOption._userListDataTables__unlockUserBtn_click);
                        },
                        "click #userListDataTables #detailBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-详细信息");
                            auiCtx.variables.modalDetailCtn.show(e, {
                                init: function() {},
                                confirmHandler: function() {},
                                cancelHandler: function() {},
                                ignoreHandler: function() {}
                            });
                        },
                        "click #userListDataTables #queryBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-条件查询");
                            $.ajax(auiCtx.ajaxOption._userListDataTables__queryBtn_click);
                        },
                        "click.event_echo #userListDataTables #detailBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-用户详情回显");
                            $.ajax(auiCtx.ajaxOption._userListDataTables__detailBtn_click_event_echo);
                        },
                        "click.event4702 #userListDataTables #resetBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-重置查询条件");
                            auiCtx.variables.queryUserId.resetValue();
                            auiCtx.variables.queryUsername.resetValue();
                            auiCtx.variables.queryCreateUser.resetValue();
                        },
                        "click.event5556 #userListDataTables #relationRoleBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-关联角色弹窗");
                            auiCtx.variables.modalCtn12.show(e, {
                                init: function() {},
                                confirmHandler: function() {},
                                cancelHandler: function() {},
                                ignoreHandler: function() {}
                            });
                            pageParams.userId = auiCtx.variables.userListDataTables.list();
                            pageParams.userId = pageParams.userId[0];
                            app.ajax({
                                data: [ {
                                    name: "userId",
                                    value: pageParams.userId
                                } ],
                                url: "./springmvc/user/listUserRelevanceRoles.do",
                                success: function success(response) {
                                    if (response && response.status && response.content.result) {
                                        var data = response.content.result.roles;
                                        var utr = response.content.result.utr;
                                        var checkedIds = [];
                                        auiCtx.variables.relevanceDataTables.list();
                                        auiCtx.variables.relevanceDataTables.refresh(data);
                                        if (data && data.length > 0 && utr && utr.length > 0) {
                                            for (var i = 0, length = data.length; i < length; i++) {
                                                for (var j = 0, len = utr.length; j < len; j++) {
                                                    if (pageParams.userId && data[i][1] == utr[j][1]) {
                                                        checkedIds.push(data[i][1]);
                                                    }
                                                }
                                            }
                                        }
                                        auiCtx.variables.relevanceDataTables.check(checkedIds);
                                    } else {
                                        app.alert(response && response.errorMsg || "用户角色关联表加载失败！", app.alert.ERROR);
                                    }
                                },
                                type: "POST",
                                beforeSend: function(XHR) {},
                                error: function(XHR, textStatus, errorThrown) {},
                                complete: function(XHR, textStatus) {}
                            });
                        },
                        "click.event6472 #userListDataTables #editUserBtn": function(e) {
                            aweb.debug && aweb.stepTo("userMgr-userList-事件配置-修改用户回显");
                            $.ajax(auiCtx.ajaxOption._userListDataTables__editUserBtn_click_event6472);
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
                        variables.modalCtn12 = $AW.ctn.modalCtn($("#modalCtn12", $el), configs.modalCtn12, attr.modalCtn12, $AW.css("ctn.modalCtn", css.modalCtn12), auiCtx);
                        variables.relevanceDataTables = $AW.component.dataTables($("#relevanceDataTables", $el), configs.relevanceDataTables, attr.relevanceDataTables, $AW.css("component.dataTables", css.relevanceDataTables), auiCtx);
                        variables.modalCreUserCtn = $AW.ctn.modalCtn($("#modalCreUserCtn", $el), configs.modalCreUserCtn, attr.modalCreUserCtn, $AW.css("ctn.modalCtn", css.modalCreUserCtn), auiCtx);
                        variables.foundationFormCtn63 = $AW.ctn.foundationFormCtn($("#foundationFormCtn63", $el), configs.foundationFormCtn63, attr.foundationFormCtn63, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn63), auiCtx);
                        variables.foundationRowCtn64 = $AW.ctn.foundationRowCtn($("#foundationRowCtn64", $el), configs.foundationRowCtn64, attr.foundationRowCtn64, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn64), auiCtx);
                        variables.foundationRowCtn65 = $AW.ctn.foundationRowCtn($("#foundationRowCtn65", $el), configs.foundationRowCtn65, attr.foundationRowCtn65, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn65), auiCtx);
                        variables.foundationRowCtn66 = $AW.ctn.foundationRowCtn($("#foundationRowCtn66", $el), configs.foundationRowCtn66, attr.foundationRowCtn66, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn66), auiCtx);
                        variables.usernameAdd = $AW.component.foundationForm.foundationInput($("#usernameAdd", $el), configs.usernameAdd, attr.usernameAdd, $AW.css("component.foundationForm.foundationInput", css.usernameAdd), auiCtx);
                        variables.nicknameAdd = $AW.component.foundationForm.foundationInput($("#nicknameAdd", $el), configs.nicknameAdd, attr.nicknameAdd, $AW.css("component.foundationForm.foundationInput", css.nicknameAdd), auiCtx);
                        variables.telephoneAdd = $AW.component.foundationForm.foundationInput($("#telephoneAdd", $el), configs.telephoneAdd, attr.telephoneAdd, $AW.css("component.foundationForm.foundationInput", css.telephoneAdd), auiCtx);
                        variables.emailAdd = $AW.component.foundationForm.foundationInput($("#emailAdd", $el), configs.emailAdd, attr.emailAdd, $AW.css("component.foundationForm.foundationInput", css.emailAdd), auiCtx);
                        variables.userTypeAdd = $AW.component.foundationForm.foundationRadioGroup($("#userTypeAdd", $el), configs.userTypeAdd, attr.userTypeAdd, $AW.css("component.foundationForm.foundationRadioGroup", css.userTypeAdd), auiCtx);
                        variables.remarkAdd = $AW.component.foundationForm.foundationInput($("#remarkAdd", $el), configs.remarkAdd, attr.remarkAdd, $AW.css("component.foundationForm.foundationInput", css.remarkAdd), auiCtx);
                        variables.modalModUserCtn = $AW.ctn.modalCtn($("#modalModUserCtn", $el), configs.modalModUserCtn, attr.modalModUserCtn, $AW.css("ctn.modalCtn", css.modalModUserCtn), auiCtx);
                        variables.foundationFormCtn1 = $AW.ctn.foundationFormCtn($("#foundationFormCtn1", $el), configs.foundationFormCtn1, attr.foundationFormCtn1, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn1), auiCtx);
                        variables.foundationRowCtn1 = $AW.ctn.foundationRowCtn($("#foundationRowCtn1", $el), configs.foundationRowCtn1, attr.foundationRowCtn1, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn1), auiCtx);
                        variables.foundationRowCtn2 = $AW.ctn.foundationRowCtn($("#foundationRowCtn2", $el), configs.foundationRowCtn2, attr.foundationRowCtn2, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn2), auiCtx);
                        variables.foundationRowCtn3 = $AW.ctn.foundationRowCtn($("#foundationRowCtn3", $el), configs.foundationRowCtn3, attr.foundationRowCtn3, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn3), auiCtx);
                        variables.nicknameMod = $AW.component.foundationForm.foundationInput($("#nicknameMod", $el), configs.nicknameMod, attr.nicknameMod, $AW.css("component.foundationForm.foundationInput", css.nicknameMod), auiCtx);
                        variables.emailMod = $AW.component.foundationForm.foundationInput($("#emailMod", $el), configs.emailMod, attr.emailMod, $AW.css("component.foundationForm.foundationInput", css.emailMod), auiCtx);
                        variables.remarkMod = $AW.component.foundationForm.foundationInput($("#remarkMod", $el), configs.remarkMod, attr.remarkMod, $AW.css("component.foundationForm.foundationInput", css.remarkMod), auiCtx);
                        variables.modalDetailCtn = $AW.ctn.modalCtn($("#modalDetailCtn", $el), configs.modalDetailCtn, attr.modalDetailCtn, $AW.css("ctn.modalCtn", css.modalDetailCtn), auiCtx);
                        variables.foundationFormCtn90 = $AW.ctn.foundationFormCtn($("#foundationFormCtn90", $el), configs.foundationFormCtn90, attr.foundationFormCtn90, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn90), auiCtx);
                        variables.foundationRowCtn91 = $AW.ctn.foundationRowCtn($("#foundationRowCtn91", $el), configs.foundationRowCtn91, attr.foundationRowCtn91, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn91), auiCtx);
                        variables.usernameDtl = $AW.component.foundationForm.foundationText($("#usernameDtl", $el), configs.usernameDtl, attr.usernameDtl, $AW.css("component.foundationForm.foundationText", css.usernameDtl), auiCtx);
                        variables.nicknameDtl = $AW.component.foundationForm.foundationText($("#nicknameDtl", $el), configs.nicknameDtl, attr.nicknameDtl, $AW.css("component.foundationForm.foundationText", css.nicknameDtl), auiCtx);
                        variables.foundationRowCtn4 = $AW.ctn.foundationRowCtn($("#foundationRowCtn4", $el), configs.foundationRowCtn4, attr.foundationRowCtn4, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn4), auiCtx);
                        variables.telephoneDtl = $AW.component.foundationForm.foundationText($("#telephoneDtl", $el), configs.telephoneDtl, attr.telephoneDtl, $AW.css("component.foundationForm.foundationText", css.telephoneDtl), auiCtx);
                        variables.usertypeDtl = $AW.component.foundationForm.foundationText($("#usertypeDtl", $el), configs.usertypeDtl, attr.usertypeDtl, $AW.css("component.foundationForm.foundationText", css.usertypeDtl), auiCtx);
                        variables.foundationRowCtn5 = $AW.ctn.foundationRowCtn($("#foundationRowCtn5", $el), configs.foundationRowCtn5, attr.foundationRowCtn5, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn5), auiCtx);
                        variables.createUserDtl = $AW.component.foundationForm.foundationText($("#createUserDtl", $el), configs.createUserDtl, attr.createUserDtl, $AW.css("component.foundationForm.foundationText", css.createUserDtl), auiCtx);
                        variables.createTimeDtl = $AW.component.foundationForm.foundationText($("#createTimeDtl", $el), configs.createTimeDtl, attr.createTimeDtl, $AW.css("component.foundationForm.foundationText", css.createTimeDtl), auiCtx);
                        variables.userIdDtl = $AW.component.foundationForm.foundationText($("#userIdDtl", $el), configs.userIdDtl, attr.userIdDtl, $AW.css("component.foundationForm.foundationText", css.userIdDtl), auiCtx);
                        variables.emailDtl = $AW.component.foundationForm.foundationText($("#emailDtl", $el), configs.emailDtl, attr.emailDtl, $AW.css("component.foundationForm.foundationText", css.emailDtl), auiCtx);
                        variables.remarkDtl = $AW.component.foundationForm.foundationText($("#remarkDtl", $el), configs.remarkDtl, attr.remarkDtl, $AW.css("component.foundationForm.foundationText", css.remarkDtl), auiCtx);
                        variables.foundationFormCtn96 = $AW.ctn.foundationFormCtn($("#foundationFormCtn96", $el), configs.foundationFormCtn96, attr.foundationFormCtn96, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn96), auiCtx);
                        variables.foundationRowCtn8 = $AW.ctn.foundationRowCtn($("#foundationRowCtn8", $el), configs.foundationRowCtn8, attr.foundationRowCtn8, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn8), auiCtx);
                        variables.updateTimeDtl = $AW.component.foundationForm.foundationText($("#updateTimeDtl", $el), configs.updateTimeDtl, attr.updateTimeDtl, $AW.css("component.foundationForm.foundationText", css.updateTimeDtl), auiCtx);
                        variables.lastLoginTimeDtl = $AW.component.foundationForm.foundationText($("#lastLoginTimeDtl", $el), configs.lastLoginTimeDtl, attr.lastLoginTimeDtl, $AW.css("component.foundationForm.foundationText", css.lastLoginTimeDtl), auiCtx);
                        variables.lastFailedLoginTimeDtl = $AW.component.foundationForm.foundationText($("#lastFailedLoginTimeDtl", $el), configs.lastFailedLoginTimeDtl, attr.lastFailedLoginTimeDtl, $AW.css("component.foundationForm.foundationText", css.lastFailedLoginTimeDtl), auiCtx);
                        variables.foundationRowCtn9 = $AW.ctn.foundationRowCtn($("#foundationRowCtn9", $el), configs.foundationRowCtn9, attr.foundationRowCtn9, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn9), auiCtx);
                        variables.lockTimeDtl = $AW.component.foundationForm.foundationText($("#lockTimeDtl", $el), configs.lockTimeDtl, attr.lockTimeDtl, $AW.css("component.foundationForm.foundationText", css.lockTimeDtl), auiCtx);
                        variables.failedLoginCountDtl = $AW.component.foundationForm.foundationText($("#failedLoginCountDtl", $el), configs.failedLoginCountDtl, attr.failedLoginCountDtl, $AW.css("component.foundationForm.foundationText", css.failedLoginCountDtl), auiCtx);
                        variables.lastHostAddressDtl = $AW.component.foundationForm.foundationText($("#lastHostAddressDtl", $el), configs.lastHostAddressDtl, attr.lastHostAddressDtl, $AW.css("component.foundationForm.foundationText", css.lastHostAddressDtl), auiCtx);
                        variables.foundationFormCtn102 = $AW.ctn.foundationFormCtn($("#foundationFormCtn102", $el), configs.foundationFormCtn102, attr.foundationFormCtn102, $AW.css("ctn.foundationFormCtn", css.foundationFormCtn102), auiCtx);
                        variables.foundationRowCtn103 = $AW.ctn.foundationRowCtn($("#foundationRowCtn103", $el), configs.foundationRowCtn103, attr.foundationRowCtn103, $AW.css("ctn.foundationRowCtn", css.foundationRowCtn103), auiCtx);
                        variables.queryUserId = $AW.component.foundationForm.foundationInput($("#queryUserId", $el), configs.queryUserId, attr.queryUserId, $AW.css("component.foundationForm.foundationInput", css.queryUserId), auiCtx);
                        variables.queryUsername = $AW.component.foundationForm.foundationInput($("#queryUsername", $el), configs.queryUsername, attr.queryUsername, $AW.css("component.foundationForm.foundationInput", css.queryUsername), auiCtx);
                        variables.queryCreateUser = $AW.component.foundationForm.foundationInput($("#queryCreateUser", $el), configs.queryCreateUser, attr.queryCreateUser, $AW.css("component.foundationForm.foundationInput", css.queryCreateUser), auiCtx);
                        variables.usertypeMod = $AW.component.foundationForm.foundationRadioGroup($("#usertypeMod", $el), configs.usertypeMod, attr.usertypeMod, $AW.css("component.foundationForm.foundationRadioGroup", css.usertypeMod), auiCtx);
                        variables.telephoneMod = $AW.component.foundationForm.foundationInput($("#telephoneMod", $el), configs.telephoneMod, attr.telephoneMod, $AW.css("component.foundationForm.foundationInput", css.telephoneMod), auiCtx);
                        variables.usernameMod = $AW.component.foundationForm.foundationInput($("#usernameMod", $el), configs.usernameMod, attr.usernameMod, $AW.css("component.foundationForm.foundationInput", css.usernameMod), auiCtx);
                        variables.divCtn2 = $AW.ctn.divCtn($("#divCtn2", $el), configs.divCtn2, attr.divCtn2, $AW.css("ctn.divCtn", css.divCtn2), auiCtx);
                        variables.userListDataTables = $AW.component.dataTables($("#userListDataTables", $el), configs.userListDataTables, attr.userListDataTables, $AW.css("component.dataTables", css.userListDataTables), auiCtx);
                        auiCtx.lifecycle.userListDataTables_load_init_000009.func();
                    },
                    auiCtxResume: function(auiCtx, $el, scope, handler) {
                        auiCtx.lifecycle.userListDataTables_resume_init_000010.func();
                    },
                    auiCtxPause: function(auiCtx, $el, scope, handler) {},
                    auiCtxUnload: function(auiCtx, $el, scope, handler) {
                        auiCtx.variables.relevanceDataTables.destroy();
                        auiCtx.variables.userListDataTables.destroy();
                    }
                };
                window.aweb && window.aweb.debug && (window.auiCtx = auiCtx);
                return auiCtx;
            }());
        };
    };
});