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
        cssConfigMap = {
    "AUI/css/component.btn.css": "component.btn/css/component.btn.css",
    "AWEB/css/aweb.popover.css": "AWEB/css/aweb.popover.css",
    "AUI/css/component.foundationForm.foundationSelectIcon.css": "component.foundationForm.foundationSelectIcon/css/component.foundationForm.foundationSelectIcon.css",
    "AUI/css/component.foundationForm.foundationWysiwyg.css": "component.foundationForm.foundationWysiwyg/css/component.foundationForm.foundationWysiwyg.css",
    "handsonTable/css/handsontable.min.css": "Handsontable/css/handsontable.min.css",
    "MultiplePicUpload/MultiplePicUpload.css": "MultiplePicUpload/MultiplePicUpload.css",
    "switcher/css/bootstrap-switch.css": "bootstrap-switch/css/bootstrap-switch.css",
    "bootstrap_datepicker/css/bootstrap-eedatepicker.css": "bootstrap_datepicker/css/bootstrap-datepicker.css",
    "chosen-jquery/css/chosen.css": "chosen.jquery/css/chosen.css",
    "jQuery.dataTables/css/buttons.dataTables.min.css": "dataTables.buttons.min/css/buttons.dataTables.min.css",
    "jQuery.dataTables/css/editor.dataTables.min.css": "dataTables.editor.min/css/editor.dataTables.min.css",
    "jQuery.dataTables/css/fixedColumns.dataTables.css": "dataTables.fixedColumns.min/css/fixedColumns.dataTables.css",
    "jQuery.dataTables/css/select.dataTables.min.css": "dataTables.select.min/css/select.dataTables.min.css",
    "easyui-combotree/easyui.css": "easyui/easyui.css",
    "editableSilder/css/foundationEditableSilder.css": "editableSilder/css/foundationEditableSilder.css",
    "fileUploadBtn/fileUploadBtn.css": "fileUploadBtn/css/fileUploadBtn.css",
    "flatpickr/css/flatpickr.css": "flatpickr/css/flatpickr.css",
    "foundation/css/foundation.css": "foundation/css/foundation.css",
    "jQuery.dataTables/css/jquery.dataTables.css": "jquery.dataTables/css/jquery.dataTables.css",
    "jQuery.ui/jquery-ui.min.css": "jqueryUI/css/jquery-ui.min.css",
    "AUI/css/layout.ctn.css": "layout.ctn/css/layout.ctn.css",
    "leftCatalog/leftCatalog.css": "leftCatalog/css/leftCatalog.css",
    "leftCatalog/leftCatalogBootstrap.css": "leftCatalog/css/leftCatalogBootstrap.css",
    "loginCtn/loginCtn.css": "loginCtn/css/loginCtn.css",
    "multiplechoicelistbox/multiplechoicelistbox.css": "multiselect/css/multiplechoicelistbox.css",
    "handsonTable/css/pikaday.css": "pikaday/css/pikaday.css",
    "stepCtn/stepCtn.css": "stepCtn/css/stepCtn.css",
    "timeLine/css/timeLine.css": "timeLine/css/timeLine.css",
    "topNav/topNav.css": "topNav/topNav.css",
    "wangEditor/css/wangEditor.min.css": "wangEditor/css/wangEditor.min.css",
    "jQuery.zTree/css/awesome.css": "zTree/css/awesome.css",
    "AWEB/css/am.css": "AWEB/css/am.css",
    "AWEB/css/aweb.css": "AWEB/css/aweb.css",
    "AWEB/css/aweb.page.css": "AWEB/css/aweb.page.css",
    "AWEB/css/font-awesome.min.css": "AWEB/css/font-awesome.min.css",
    "AWEB/css/icon-font.css": "AWEB/css/icon-font.css",
    "AWEB/css/soy.css": "AWEB/css/soy.css"
} || {};

    config = {
        
    "awebApi": {
        "name": "awebApi",
        "path": "dependence/AWEB/js/aweb.api",
        "deps": [
            "jquery"
        ]
    },
    "awebEnvironment": {
        "name": "awebEnvironment",
        "path": "dependence/AWEB/js/aweb.environment"
    },
    "awebFresher": {
        "name": "awebEnvironment",
        "path": "dependence/AWEB/js/aweb.fresher"
    },
    "awebIndex": {
        "name": "awebIndex",
        "path": "module/index/index"
    },
    "component": {
        "name": "component",
        "path": "dependence/component/index.js"
    },
    "component.AIBSTablesV2": {
        "name": "component.AIBSTablesV2",
        "path": "dependence/component.AIBSTablesV2/js/component.AIBSTablesV2.js"
    },
    "component.btn": {
        "name": "component.btn",
        "path": "dependence/component.btn/index.js"
    },
    "component.btn.btnGroup": {
        "name": "component.btn.btnGroup",
        "path": "dependence/component.btn.btnGroup/js/component.btn.btnGroup.js"
    },
    "component.btn.dropdownBtn": {
        "name": "component.btn.dropdownBtn",
        "path": "dependence/component.btn.dropdownBtn/js/component.btn.dropdownBtn.js"
    },
    "component.btn.fileUploadBtn": {
        "name": "component.btn.fileUploadBtn",
        "path": "dependence/component.btn.fileUploadBtn/js/component.btn.fileUploadBtn.js"
    },
    "component.btn.normalBtn": {
        "name": "component.btn.normalBtn",
        "path": "dependence/component.btn.normalBtn/js/component.btn.normalBtn.js"
    },
    "component.dataTables": {
        "name": "component.dataTables",
        "path": "dependence/component.dataTables/js/component.dataTables.js"
    },
    "component.echarts": {
        "name": "component.echarts",
        "path": "dependence/component.echarts/js/component.echarts.js"
    },
    "component.echarts.bar": {
        "name": "component.echarts.bar",
        "path": "dependence/component.echarts.bar/js/component.echarts.bar.js"
    },
    "component.echarts.dashboard": {
        "name": "component.echarts.dashboard",
        "path": "dependence/component.echarts.dashboard/js/component.echarts.dashboard.js"
    },
    "component.echarts.line": {
        "name": "component.echarts.line",
        "path": "dependence/component.echarts.line/js/component.echarts.line.js"
    },
    "component.echarts.pie": {
        "name": "component.echarts.pie",
        "path": "dependence/component.echarts.pie/js/component.echarts.pie.js"
    },
    "component.form": {
        "name": "component.form",
        "path": "dependence/component.form/js/component.form.js"
    },
    "component.form.checkbox": {
        "name": "component.form.checkbox",
        "path": "dependence/component.form.checkbox/js/component.form.checkbox.js"
    },
    "component.form.checkboxGroup": {
        "name": "component.form.checkboxGroup",
        "path": "dependence/component.form.checkboxGroup/js/component.form.checkboxGroup.js"
    },
    "component.form.input": {
        "name": "component.form.input",
        "path": "dependence/component.form.input/js/component.form.input.js"
    },
    "component.form.password": {
        "name": "component.form.password",
        "path": "dependence/component.form.password/js/component.form.password.js"
    },
    "component.form.radio": {
        "name": "component.form.radio",
        "path": "dependence/component.form.radio/js/component.form.radio.js"
    },
    "component.form.radioGroup": {
        "name": "component.form.radioGroup",
        "path": "dependence/component.form.radioGroup/js/component.form.radioGroup.js"
    },
    "component.form.select": {
        "name": "component.form.select",
        "path": "dependence/component.form.select/js/component.form.select.js"
    },
    "component.form.textarea": {
        "name": "component.form.textarea",
        "path": "dependence/component.form.textarea/js/component.form.textarea.js"
    },
    "component.formUnionV2": {
        "name": "component.formUnionV2",
        "path": "dependence/component.formUnionV2/js/component.formUnionV2.js"
    },
    "component.foundationForm": {
        "name": "component.foundationForm",
        "path": "dependence/component.foundationForm/js/component.foundationForm.js"
    },
    "component.foundationForm.foundationCKEditor": {
        "name": "component.foundationForm.foundationCKEditor",
        "path": "dependence/component.foundationForm.foundationCKEditor/js/component.foundationForm.foundationCKEditor.js"
    },
    "component.foundationForm.foundationCheckboxGroup": {
        "name": "component.foundationForm.foundationCheckboxGroup",
        "path": "dependence/component.foundationForm.foundationCheckboxGroup/js/component.foundationForm.foundationCheckboxGroup.js"
    },
    "component.foundationForm.foundationDateTimePicker": {
        "name": "component.foundationForm.foundationDateTimePicker",
        "path": "dependence/component.foundationForm.foundationDateTimePicker/js/component.foundationForm.foundationDateTimePicker.js"
    },
    "component.foundationForm.foundationDatepicker": {
        "name": "component.foundationForm.foundationDatepicker",
        "path": "dependence/component.foundationForm.foundationDatepicker/js/component.foundationForm.foundationDatepicker.js"
    },
    "component.foundationForm.foundationDigitInput": {
        "name": "component.foundationForm.foundationDigitInput",
        "path": "dependence/component.foundationForm.foundationDigitInput/js/component.foundationForm.foundationDigitInput.js"
    },
    "component.foundationForm.foundationEditableSelect": {
        "name": "component.foundationForm.foundationEditableSelect",
        "path": "dependence/component.foundationForm.foundationEditableSelect/js/component.foundationForm.foundationEditableSelect.js"
    },
    "component.foundationForm.foundationEditableSilder": {
        "name": "component.foundationForm.foundationEditableSilder",
        "path": "dependence/component.foundationForm.foundationEditableSilder/js/component.foundationForm.foundationEditableSilder.js"
    },
    "component.foundationForm.foundationImg": {
        "name": "component.foundationForm.foundationImg",
        "path": "dependence/component.foundationForm.foundationImg/js/component.foundationForm.foundationImg.js"
    },
    "component.foundationForm.foundationInput": {
        "name": "component.foundationForm.foundationInput",
        "path": "dependence/component.foundationForm.foundationInput/js/component.foundationForm.foundationInput.js"
    },
    "component.foundationForm.foundationMultiplePicUpload": {
        "name": "component.foundationForm.foundationMultiplePicUpload",
        "path": "dependence/component.foundationForm.foundationMultiplePicUpload/js/component.foundationForm.foundationMultiplePicUpload.js"
    },
    "component.foundationForm.foundationPassword": {
        "name": "component.foundationForm.foundationPassword",
        "path": "dependence/component.foundationForm.foundationPassword/js/component.foundationForm.foundationPassword.js"
    },
    "component.foundationForm.foundationRadioGroup": {
        "name": "component.foundationForm.foundationRadioGroup",
        "path": "dependence/component.foundationForm.foundationRadioGroup/js/component.foundationForm.foundationRadioGroup.js"
    },
    "component.foundationForm.foundationSelect": {
        "name": "component.foundationForm.foundationSelect",
        "path": "dependence/component.foundationForm.foundationSelect/js/component.foundationForm.foundationSelect.js"
    },
    "component.foundationForm.foundationSelectIcon": {
        "name": "component.foundationForm.foundationSelectIcon",
        "path": "dependence/component.foundationForm.foundationSelectIcon/js/component.foundationForm.foundationSelectIcon.js"
    },
    "component.foundationForm.foundationSingleUpload": {
        "name": "component.foundationForm.foundationSingleUpload",
        "path": "dependence/component.foundationForm.foundationSingleUpload/js/component.foundationForm.foundationSingleUpload.js"
    },
    "component.foundationForm.foundationSwitch": {
        "name": "component.foundationForm.foundationSwitch",
        "path": "dependence/component.foundationForm.foundationSwitch/js/component.foundationForm.foundationSwitch.js"
    },
    "component.foundationForm.foundationText": {
        "name": "component.foundationForm.foundationText",
        "path": "dependence/component.foundationForm.foundationText/js/component.foundationForm.foundationText.js"
    },
    "component.foundationForm.foundationTextArea": {
        "name": "component.foundationForm.foundationTextArea",
        "path": "dependence/component.foundationForm.foundationTextArea/js/component.foundationForm.foundationTextArea.js"
    },
    "component.foundationForm.foundationTreeSelect": {
        "name": "component.foundationForm.foundationTreeSelect",
        "path": "dependence/component.foundationForm.foundationTreeSelect/js/component.foundationForm.foundationTreeSelect.js"
    },
    "component.foundationForm.foundationUploadButton": {
        "name": "component.foundationForm.foundationUploadButton",
        "path": "dependence/component.foundationForm.foundationUploadButton/js/component.foundationForm.foundationUploadButton.js"
    },
    "component.foundationForm.foundationVerifyInput": {
        "name": "component.foundationForm.foundationVerifyInput",
        "path": "dependence/component.foundationForm.foundationVerifyInput/js/component.foundationForm.foundationVerifyInput.js"
    },
    "component.foundationForm.foundationWangEditor": {
        "name": "component.foundationForm.foundationWangEditor",
        "path": "dependence/component.foundationForm.foundationWangEditor/js/component.foundationForm.foundationWangEditor.js"
    },
    "component.foundationForm.foundationWysiwyg": {
        "name": "component.foundationForm.foundationWysiwyg",
        "path": "dependence/component.foundationForm.foundationWysiwyg/js/component.foundationForm.foundationWysiwyg.js"
    },
    "component.handsontable": {
        "name": "component.handsontable",
        "path": "dependence/component.handsontable/js/component.handsontable.js"
    },
    "component.htmlTag": {
        "name": "component.htmlTag",
        "path": "dependence/component.htmlTag/js/component.htmlTag.js"
    },
    "component.icon": {
        "name": "component.icon",
        "path": "dependence/component.icon/js/component.icon.js"
    },
    "component.img": {
        "name": "component.img",
        "path": "dependence/component.img/js/component.img.js"
    },
    "component.leftCatalog": {
        "name": "component.leftCatalog",
        "path": "dependence/component.leftCatalog/js/component.leftCatalog.js"
    },
    "component.multiHansonTable": {
        "name": "component.multiHansonTable",
        "path": "dependence/component.multiHansonTable/js/component.multiHansonTable.js"
    },
    "component.other": {
        "name": "component.other",
        "path": "dependence/component.other/js/component.other.js"
    },
    "component.other.editableDataTable": {
        "name": "component.other.editableDataTable",
        "path": "dependence/component.other.editableDataTable/js/component.other.editableDataTable.js"
    },
    "component.other.horizontalSplitLine": {
        "name": "component.other.horizontalSplitLine",
        "path": "dependence/component.other.horizontalSplitLine/js/component.other.horizontalSplitLine.js"
    },
    "component.other.multipleChoiceListBox": {
        "name": "component.other.multipleChoiceListBox",
        "path": "dependence/component.other.multipleChoiceListBox/js/component.other.multipleChoiceListBox.js"
    },
    "component.other.progressBar": {
        "name": "component.other.progressBar",
        "path": "dependence/component.other.progressBar/js/component.other.progressBar.js"
    },
    "component.other.timeLine": {
        "name": "component.other.timeLine",
        "path": "dependence/component.other.timeLine/js/component.other.timeLine.js"
    },
    "component.other.topology": {
        "name": "component.other.topology",
        "path": "dependence/component.other.topology/js/component.other.topology.js"
    },
    "component.other.verticalSplitLine": {
        "name": "component.other.verticalSplitLine",
        "path": "dependence/component.other.verticalSplitLine/js/component.other.verticalSplitLine.js"
    },
    "component.platformEditor": {
        "name": "component.platformEditor",
        "path": "dependence/component.platformEditor/js/component.platformEditor.js"
    },
    "component.platformSplitBar": {
        "name": "component.platformSplitBar",
        "path": "dependence/component.platformSplitBar/js/component.platformSplitBar.js"
    },
    "component.text": {
        "name": "component.text",
        "path": "dependence/component.text/js/component.text.js"
    },
    "component.topNav": {
        "name": "component.topNav",
        "path": "dependence/component.topNav/js/component.topNav.js"
    },
    "component.zTree": {
        "name": "component.zTree",
        "path": "dependence/component.zTree/js/component.zTree.js"
    },
    "ctn": {
        "name": "ctn",
        "path": "dependence/ctn/js/ctn.js"
    },
    "ctn.divCtn": {
        "name": "ctn.divCtn",
        "path": "dependence/ctn.divCtn/js/ctn.divCtn.js"
    },
    "ctn.formCtn": {
        "name": "ctn.formCtn",
        "path": "dependence/ctn.formCtn/js/ctn.formCtn.js"
    },
    "ctn.foundationFormCtn": {
        "name": "ctn.foundationFormCtn",
        "path": "dependence/ctn.foundationFormCtn/js/ctn.foundationFormCtn.js"
    },
    "ctn.foundationRowCtn": {
        "name": "ctn.foundationRowCtn",
        "path": "dependence/ctn.foundationRowCtn/js/ctn.foundationRowCtn.js"
    },
    "ctn.loginCtn": {
        "name": "ctn.loginCtn",
        "path": "dependence/ctn.loginCtn/js/ctn.loginCtn.js"
    },
    "ctn.modalCtn": {
        "name": "ctn.modalCtn",
        "path": "dependence/ctn.modalCtn/js/ctn.modalCtn.js"
    },
    "layout.rowCtn": {
        "name": "layout.rowCtn",
        "path": "dependence/layout.rowCtn/js/layout.rowCtn.js"
    },
    "layout.stepCtn": {
        "name": "layout.stepCtn",
        "path": "dependence/layout.stepCtn/js/layout.stepCtn.js"
    },
    "layout.tabCtn": {
        "name": "layout.tabCtn",
        "path": "dependence/layout.tabCtn/js/layout.tabCtn.js"
    },
    "page.mainPanel": {
        "name": "page.mainPanel",
        "path": "dependence/page.mainPanel/index.js"
    },
    "Handsontable": {
        "name": "Handsontable",
        "path": "dependence/Handsontable/js/handsontable.full.min"
    },
    "MultiplePicUpload": {
        "name": "MultiplePicUpload",
        "path": "dependence/MultiplePicUpload/index.js"
    },
    "bootstrap-switch": {
        "name": "bootstrap-switch",
        "path": "dependence/bootstrap-switch/js/bootstrap-switch"
    },
    "bootstrap-wysiwyg": {
        "name": "bootstrap-wysiwyg",
        "path": "dependence/bootstrap-wysiwyg/js/bootstrap-wysiwyg.js"
    },
    "bootstrap_datepicker": {
        "name": "bootstrap_datepicker",
        "path": "dependence/bootstrap_datepicker/js/bootstrap-datepicker.min"
    },
    "chosen.jquery": {
        "name": "chosen.jquery",
        "path": "dependence/chosen.jquery/js/chosen.jquery"
    },
    "ckEditor": {
        "name": "ckEditor",
        "path": "dependence/ckEditor/js/ckeditor"
    },
    "dataTables.buttons.min": {
        "name": "dataTables.buttons.min",
        "path": "dependence/dataTables.buttons.min/js/dataTables.buttons.min"
    },
    "dataTables.editor.min": {
        "name": "dataTables.editor.min",
        "path": "dependence/dataTables.editor.min/js/dataTables.editor.min"
    },
    "dataTables.fixedColumns.min": {
        "name": "dataTables.fixedColumns.min",
        "path": "dependence/dataTables.fixedColumns.min/js/dataTables.fixedColumns.min"
    },
    "dataTables.select.min": {
        "name": "dataTables.select.min",
        "path": "dependence/dataTables.select.min/js/dataTables.select.min"
    },
    "easyui": {
        "name": "easyui",
        "path": "dependence/easyui/js/jquery.easyui.min",
        "deps": [
            "jquery",
            "jqueryUI"
        ]
    },
    "echarts": {
        "name": "echarts",
        "path": "dependence/echarts/js/echarts.min",
        "exports": "echarts"
    },
    "editableSilder": {
        "name": "editableSilder",
        "path": "dependence/editableSilder/index.js"
    },
    "fileUpload": {
        "name": "fileUpload",
        "path": "dependence/fileUpload/js/jQuery.ajaxfileupload.js",
        "deps": [
            "jquery"
        ]
    },
    "fileUploadBtn": {
        "name": "fileUploadBtn",
        "path": "dependence/fileUploadBtn/index.js"
    },
    "flatpickr": {
        "name": "flatpickr",
        "path": "dependence/flatpickr/js/flatpickr"
    },
    "foundation": {
        "name": "foundation",
        "path": "dependence/foundation/js/foundation.js"
    },
    "jquery": {
        "name": "jquery",
        "path": "dependence/jquery/js/jquery-1.9.1.js",
        "exports": "$"
    },
    "jquery.dataTables": {
        "name": "jquery.dataTables",
        "path": "dependence/jquery.dataTables/js/jquery.dataTables",
        "deps": [
            "jquery"
        ]
    },
    "jquery.editableSelect": {
        "name": "jquery.editableSelect",
        "path": "dependence/jquery.editableSelect/js/jquery.editableSelect"
    },
    "jqueryUI": {
        "name": "jqueryUI",
        "path": "dependence/jqueryUI/js/jquery-ui.min"
    },
    "jtopo.0.4.8.min": {
        "name": "jtopo.0.4.8.min",
        "path": "dependence/jtopo.0.4.8.min/js/jtopo-0.4.8-min"
    },
    "layout.ctn": {
        "name": "layout.ctn",
        "path": "dependence/layout.ctn/index.js"
    },
    "leftCatalog": {
        "name": "leftCatalog",
        "path": "dependence/leftCatalog/index.js"
    },
    "loginCtn": {
        "name": "loginCtn",
        "path": "dependence/loginCtn/index.js"
    },
    "moment": {
        "name": "moment",
        "path": "dependence/moment/js/moment"
    },
    "multiselect": {
        "name": "multiselect",
        "path": "dependence/multiselect/js/multiselect.js"
    },
    "pikaday": {
        "name": "pikaday",
        "path": "dependence/pikaday/js/pikaday"
    },
    "progressbar": {
        "name": "progressbar",
        "path": "dependence/progressbar/js/progressbar"
    },
    "requireCss": {
        "name": "requireCss",
        "path": "dependence/requireCss/js/require-css.min"
    },
    "requireJS": {
        "name": "requireJS",
        "path": "dependence/requireJS/js/require.js"
    },
    "slimScroll": {
        "name": "slimScroll",
        "path": "dependence/slimScroll/js/jquery.slimscroll.min",
        "deps": [
            "jquery"
        ]
    },
    "stepCtn": {
        "name": "stepCtn",
        "path": "dependence/stepCtn/index.js"
    },
    "template": {
        "name": "template",
        "path": "dependence/template/js/template"
    },
    "text": {
        "name": "text",
        "path": "dependence/text/js/text"
    },
    "timeLine": {
        "name": "timeLine",
        "path": "dependence/timeLine/index.js"
    },
    "topNav": {
        "name": "topNav",
        "path": "dependence/topNav/index.js"
    },
    "wangEditor": {
        "name": "wangEditor",
        "path": "dependence/wangEditor/js/wangEditor.min"
    },
    "zTree": {
        "name": "zTree",
        "path": "dependence/zTree/js/jquery.ztree.all-3.5.min"
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