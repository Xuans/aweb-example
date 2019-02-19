(function (undefined) {

    (function (factory) {
        "use strict";

        // amd module
        if (typeof define === "function" && define.amd) {
            define(["jquery", "widget", "template", 'component.foundationForm'], factory);
        }
        // global
        else {
            factory();
        }
    })
    (function ($, widget, artTemplate) {
        "use strict";

        var Component = function ( $selector, option, attr, css, auiCtx, formOption) {
            var context = this;
            context.$view = $selector;
            context.option = option;
            context.attr = attr;
            context.css = css;
            context.formOption = formOption;
            context.pageContext = auiCtx;

            context._init();
            //渲染样式
            context._render();
            //绑定事件
            context._listen();
        };

        Component.prototype = Component.fn = {
            nameSpace: 'awebtree',
            constructor: Component,
            version: 'AWOS 4.4 YuQ',
            author: 'liuzhiyong',
            that: this,
            //树菜单面板模板
            panelTemp: '<div data-panel-id="{{id}}" class="panel" style="position: absolute; z-index: 110003; display: none;">' +
                '<div class="panel-body panel-body-noheader {{if searchable}}tree-search-container{{/if}}" title="" style="border-radius: 4px;">' +
                '{{if searchable}}' +
                '<div class="tree-search"><input type="text" style="border-radius: 4px;"></div>' +
                '{{/if}}' +
                '<ul class="tree">' +
                '</ul>' +
                '</div>' +
                '</div>',
            //树菜单项模板
            itemTemp: '<li>' +
                '<div id="_easyui_tree_{{seq}}" class="tree-node">' +
                '{{each indentItem}}' +
                '<span class="tree-indent"></span> {{/each}} {{if isChild}}' +
                '<span class="tree-indent"></span> {{/if}}' +
                '{{if !isChild}}' +
                '<span class="tree-hit tree-expanded"></span> {{/if}}' +
                '{{ if multiple&&onlyLeafCheck&&isChild}}' +
                '<span class="tree-checkbox tree-checkbox0"></span> {{/if}}' +
                '{{if multiple&&!onlyLeafCheck}}' +
                '<span class="tree-checkbox tree-checkbox0"></span> {{/if}}' +
                '<span class="tree-title">{{text}}</span>' +
                '</div>' +
                '{{#childHtml}}' +
                '</li>',
            //输入框模板
            inputGroupTemp: '<div class="input-group">' +
                '<input id="{{id}}" class="combotree-f combo-f textbox-f" style="display: none;" {{if disabled }} disabled="disabled" {{else}}' +
                'data-aweb-event="true" {{/if}}>' +
                '<span data-span-id="{{id}}" class="textbox  {{if disabled }}textbox-disabled{{/if}} combo p-show" style="width: 151px;">' +
                '<span class="textbox-addon textbox-addon-right" style="right: 0px; top: 0px;">' +
                '<a href="javascript:;" class="textbox-icon combo- ' +
                '{{if disabled }}textbox-icon-disabled{{/if}}" ' +
                'icon-index="0" tabindex="-1" style="width: 28px; height: 30px;">' +
                '</a>' +
                '</span>' +
                '<input id="_easyui_textbox_input_{{id}}" type="text" class="textbox-text validatebox-text ' +
                '{{if disabled }}' +
                'validatebox-disabled ' +
                'textbox-prompt ' +
                '{{/if}} ' +
                'validatebox-readonly" autocomplete="off" tabindex="" {{if disabled }} disabled="disabled" {{/if}} readonly="readonly" ' +
                'placeholder="" style="cursor: inherit; border-right-style: none;">' +
                '<input type="hidden" class="textbox-value" name="" {{if disabled }} disabled="disabled" {{/if}} value="">' +
                '</span>' +
                '<div class="form-error-arrow"></div><label class="form-error-msg"></label>' +
                '</div>',
            _getScrollTop: function () {
                var scrlooX, scrlooY;
                if (window.pageYOffset) {
                    scrlooX = window.pageXOffset;
                    scrlooY = window.pageYOffset;
                } else if (document.compatMode && document.compatMode != 'BackCompat') {
                    scrlooX = document.documentElement.scrollLeft;
                    scrlooY = document.documentElement.scrollTop;
                } else if (document.body) {
                    scrlooX = document.body.scrollLeft;
                    scrlooY = document.body.scrollTop;
                }
                return {
                    x: scrlooX,
                    y: scrlooY
                }
            },
            _showPanel: function () {
                var inputBoundObj = this.$input[0].getBoundingClientRect(),
                    inputTop = inputBoundObj.top,
                    inputLeft = inputBoundObj.left,
                    inputWidth = inputBoundObj.right - inputBoundObj.left,
                    panelHeight,
                    scrollObj,
                    windowHeight;

                scrollObj = this._getScrollTop();
                inputTop = inputTop + this.$input.outerHeight() + scrollObj.y;
                inputLeft = inputLeft + scrollObj.x;

                this.$panel.css({
                    display: 'block',
                    top: inputTop,
                    left: inputLeft,
                    width: inputWidth,
                    overflow: 'auto'
                });
                this.$inputWrap.addClass('p-show');
                this.isShowed = true;

                //是否超过屏幕的底边
                windowHeight = $(window).height();
                panelHeight = this.$panel.outerHeight() + this.$panel.css('top');
                if (panelHeight > windowHeight) {
                    this.$panel.css({
                        top: 'auto',
                        bottom: inputBoundObj.top + scrollObj.y
                    });
                }
            },
            _hidePanel: function () {
                this.$panel.css({
                    display: 'none'
                });
                this.$inputWrap.removeClass('p-show');
                this.isShowed = false;
            },
            _focusInput: function () {
                this.$inputWrap.addClass('textbox-focused');
                this.isFocused = true;
            },
            _blurInput: function () {
                this.$inputWrap.removeClass('textbox-focused');
                this.isFocused = false;
            },
            //根据关键词获得搜索的map,map[id] = true,表示节点在搜索结果中
            //如果关键字为空,则所有节点选中。
            _search: function (keyWord) {
                var i,
                    iLen,
                    j,
                    jLen,
                    map = {},
                    nodeText,
                    nodeId,
                    nodeData,
                    parentCheck = false,
                    platData = this.platData;

                if (keyWord) {
                    keyWord = keyWord.toLowerCase();
                    for (i = platData.length - 1, iLen = 0; i >= iLen; i--) {
                        nodeData = platData[i];
                        nodeText = (nodeData.text + '').toLowerCase(); //大小写不敏感
                        nodeId = nodeData.id;
                        //如果是搜索结果的父节点
                        parentCheck = false;
                        //如果有节点在map里面,则也要把父节点map为true;
                        for (j = 0, jLen = nodeData.childIdArr.length; j < jLen; j++) {
                            if (map[nodeData.childIdArr[j]]) {
                                parentCheck = true;
                                break;
                            }
                        }

                        if (parentCheck || nodeText.indexOf(keyWord) > -1) {
                            map[nodeId] = true;
                        }
                    }
                } else {
                    for (i = platData.length - 1, iLen = 0; i >= iLen; i--) {
                        nodeData = platData[i];
                        nodeId = nodeData.id;
                        map[nodeId] = true;
                    }
                }

                return map;
            },
            //初始化（私有）
            _init: function () {
                var context = this;

                //树状数据
                context.uuid = app.getUID();
                context.data = [];
                context.platData = [];
                //输入框状态
                context.isShowed = false;
                context.isFocused = false;
                //jquery对象
                context.$input = null;
                context.$hiddenInput = null;
                context.$inputWrap = null;
                context.$panel = null;
                context.$treeUl = null;
                context.isInline = false;


                context.selectedArr = [];
                context.selectedNotInArr = [];
                context.lastSelected = false;
                context.parentMap = {};
                context.idArrMap = {};
                context.checkMap = {}; //三种状态, 'check','nocheck','nocheckall'
                context.domMap = {};

            },
            //判断两组数据是否相同
            _isDiffFunc: function (oldSelectedArr, newSelectedArr) {
                var isDiff = false;

                if (oldSelectedArr.length === newSelectedArr.length && oldSelectedArr.join() === newSelectedArr.join()) {
                    isDiff = false;
                } else {
                    isDiff = true;
                }
                return isDiff;
            },
            //勾选某个节点
            _checkNode: function (nodeId, isCheck) {
                var startNodeData = this._findNodeById(nodeId),
                    nodeData,
                    i,
                    checkStatus = isCheck ? 'check' : 'nocheck',
                    iLen,
                    stack = [],
                    childNode;

                //层次遍历非递归
                stack.push(startNodeData);

                //全选所有后代节点
                while (stack.length) {
                    nodeData = stack.shift();
                    this.checkMap[nodeData.id] = checkStatus;
                    for (i = 0, iLen = nodeData.childIdArr.length; i < iLen; i++) {
                        childNode = this._findNodeById(nodeData.childIdArr[i]);
                        stack.push(childNode);
                    }
                }
                this._updateAncestorCheckStatus(nodeId);
            },
            _updateAncestorCheckStatus: function (id) {
                var nodeData,
                    parentData,
                    checkArr,
                    uncheck,
                    childLen,
                    checkStatus,
                    parentId,
                    j,
                    jLen,
                    siblingData,
                    siblingCheckStatus,
                    checkSameAll;

                nodeData = this._findNodeById(id);

                while (parentId = this.parentMap[nodeData.id]) {
                    checkSameAll = true; //由原来的全选变为单选
                    parentData = this._findNodeById(parentId);

                    //有三种请况
                    checkArr = [];
                    uncheck = [];
                    childLen = parentData.childIdArr.length;
                    //全部不勾，全部勾选，部分勾选
                    for (j = 0, jLen = childLen; j < jLen; j++) {
                        siblingData = this._findNodeById(parentData.childIdArr[j]);
                        siblingCheckStatus = this.checkMap[siblingData.id];
                        if (siblingCheckStatus === 'nocheck' || siblingCheckStatus === 'nocheckall') {
                            uncheck.push(siblingData.id);
                        } else {
                            checkArr.push(siblingData.id);
                        }
                    }

                    switch (childLen) {
                        case checkArr.length:
                            checkStatus = 'check';
                            break;
                        case uncheck.length:
                            checkStatus = 'nocheck';
                            break;
                        default:
                            checkStatus = 'nocheckall';
                    }

                    this.checkMap[parentId] = checkStatus;
                    nodeData = parentData;
                }
            },
            //遍历checkMap维护selectedData,原组件的selected数据是深度遍历的
            _updateSelectedData: function () {
                //本来直接循环platData,就可以获得按层次排序的selected,但是经过测试原来树插件的是深度遍历的数据
                var oriData = this.data,
                    This = this,
                    i,
                    iLen,
                    item,
                    stack = [];

                This.selectedArr = [];
                if (!oriData || !oriData.length) return;

                //先将第一层节点放入栈
                for (i = 0, iLen = oriData.length; i < iLen; i++) {
                    stack.push(oriData[i]);
                }

                while (stack.length) {
                    item = stack.shift();
                    if (This.checkMap[item.id] === 'check') {
                        this.selectedArr.push(item.id);
                    }
                    //如果该节点有子节点，继续添加进入栈顶
                    if (item.children && item.children.length) {
                        stack = item.children.concat(stack);
                    }
                }
                //方法2.使用$('[id*='_easyui_tree_']')可以获得深度遍历的数据
            },
            _findNodeById: function (id) {
                return this.platData[this.idArrMap[id]];
            },
            _render: function () {
                var
                    $selector = this.$view,
                    css = this.css,
                    attr = this.attr,
                    formOption = this.formOption,
                    option = this.option,
                    auiCtx = this.pageContext,
                    inputGroupHtml,
                    mustInputTemp = '<span style="color: #ff0000; padding-right:2px;">*</span>',
                    horizontalTemp = "<label title='_label_'>_label__mustInput_</label>_INPUT_GROUP_TEMP_",
                    inlineTemp = "<div class='columns'>" +
                        "<label for='middle-label' class='text-right middle' title='_label_'>_label__mustInput_</label>" +
                        "</div>" +
                        "<div class='columns'>" +
                        "_INPUT_GROUP_TEMP_" +
                        "</div>",
                    isInline = formOption.formLayout === 'inline',
                    labelAlign = option.labelAlign || formOption.labelAlign,
                    template = isInline ? inlineTemp : horizontalTemp,
                    span = option.span || formOption.span,
                    labelSpan = option.labelSpan || formOption.labelSpan,
                    inputObj,
                    panelHtml,
                    style = css.style;

                inputGroupHtml = artTemplate.compile(this.inputGroupTemp)({
                    id: attr.id,
                    disabled: option.disabled
                });

                //i18n
                if (auiCtx) {
                    template = template
                        .replace(/_INPUT_GROUP_TEMP_/g, inputGroupHtml)
                        .replace(/_label_/g, $AW.nsl(option.label, attr.id, auiCtx) || "")
                        .replace(/_mustInput_/, option.mustInput ? mustInputTemp : "");
                }


                    if (isInline) {
                        this.$view = $selector = widget.component.foundationForm.utils_.renderRunnerInlineLabelSpan($selector,
                            template,
                            labelSpan,
                            labelAlign,
                            this.pageContext,
                            "aweb4foundationTreeSelect",
                            attr);

                    } else {
                        $selector.append(template);
                        widget.component.foundationForm.utils_.renderContainerSpan($selector, span);
                    }

                panelHtml = artTemplate.compile(this.panelTemp)({
                    id: this.uuid,
                    searchable: option.searchable
                });

                this.isInline = isInline;
                this.$inputGroup = $('.input-group', $selector);
                this.$arrow = $('.form-error-arrow', this.$inputGroup);
                this.$label = $('.form-error-msg', this.$inputGroup);
                this.$panel = $(panelHtml);
                this.$treeUl = $('.tree', this.$panel).css('maxHeight', '400px');
                this.$input = $('.textbox-text.validatebox-text', $selector);
                this.$inputWrap = $('.textbox.combo', $selector);
                this.$hiddenInput = this.$inputWrap.siblings('input#' + attr.id);

                //css样式配置渲染
                if (css && css.theme) {
                    //如果组件配置了类名主题，则要同时将类名加到组件相应位置上去
                    /*
                     * 如 ：if(css.theme['function']){
                     $button.removeClass().addClass('btn ' + css.theme['function']);
                     }*/
                }

                //初始化输入框的样式
                option.disabled ? this.$input.attr('disabled', 'disabled') : '';
                this.$input.css({
                    'height': '32px',
                    'margin': '0px 28px 0px 0px',
                    'line-height': '32px',
                    'cursor': 'inherit',
                    'border-right-style': 'none'
                });

                if (css && (style = css.style)) {
                    if (style.title) {
                        if (!isInline) {
                            $selector.find('.input-group').prev().css(style.title);
                        } else {
                            if (typeof auiCtx === 'undefined') {
                                $selector.children().first().find('label').css(style.title);
                            } else {
                                $selector.prev().find('label').css(style.title);
                            }
                        }
                    }
                    style.position && $selector.css(style.position);
                    if (style.input) {
                        inputObj = JSON.parse(JSON.stringify(style.input));
                        $selector.find('.input-group').css(style.input);
                    }
                    style.arrowIcon && $AW.cssHover('a.textbox-icon', $selector, style.arrowIcon, ':after');
                    style.menuList && $AW.cssHover('div.tree-node', this.$panel, style.menuList, '');
                    if (style.menuList && style.menuList['font-size']) {
                        $AW.cssHover('div.tree-node .tree-title', this.$panel, {
                            'font-size': style.menuList['font-size']
                        }, '');
                    }
                    style.menuListHover && $AW.cssHover('span.tree-title', this.$panel, style.menuListHover, ':hover');
                    //因为是后来添加的dom元素，所以不能直接获取对象后添加样式
                    style.checkBox && $AW.cssHover('.tree-checkbox', this.$panel, style.checkBox, '');
                    style.checkBox && $AW.cssHover('.tree .tree-checkbox0:hover', this.$panel, style.checkBox, ':before');
                    style.checkBox && $AW.cssHover('.tree .tree-checkbox1', this.$panel, style.checkBox, ':before');
                    style.checkBox && $AW.cssHover('.tree .tree-checkbox2', this.$panel, style.checkBox, ':before');
                    style.downMenu && this.$panel.css(style.downMenu);
                    style.search && this.$panel.find('.tree-search input').css(style.search);
                }

                $('body').append(this.$panel);

            },
            _makePlatData: function (treeData) {
                var i,
                    iLen,
                    node,
                    level = 1, //确定数据的高度，初始是第一层
                    childLen = 0,
                    childCount,
                    count = 0,
                    nodeData,
                    childNode,
                    tempStack = [],
                    layerStack = [];

                this.parentMap = {};
                this.domMap = {};
                this.idArrMap = {};
                this.checkMap = {};
                tempStack = tempStack.concat(treeData);
                childCount = tempStack.length;

                while (tempStack.length > 0) {
                    nodeData = {
                        id: null,
                        text: null,
                        level: null,
                        domId: null,
                        parentId: null,
                        childIdArr: [],
                        isChild: null,
                        seq: null
                    };

                    node = tempStack.shift();
                    count++;
                    nodeData.id = node.id + "";
                    nodeData.domId = '_easyui_tree_' + count;
                    nodeData.level = level;
                    nodeData.text = node.text;
                    nodeData.seq = count; //count与数组的映射相差1

                    this.idArrMap[nodeData.id] = (count - 1);
                    this.domMap[nodeData.id] = nodeData.domId;
                    this.checkMap[nodeData.id] = 'nocheck'; //维护节点的选中状态,初始为未选中

                    layerStack.push(nodeData);
                    childCount = childCount - 1;

                    if (node.children && node.children.length > 0) {
                        childLen = childLen + node.children.length;
                        for (i = 0, iLen = node.children.length; i < iLen; i++) {
                            childNode = node.children[i];
                            nodeData.childIdArr.push(childNode.id);
                            this.parentMap[childNode.id] = nodeData.id;
                            tempStack.push(childNode);
                        }
                        nodeData.isChild = false;
                    } else {
                        nodeData.isChild = true;
                    }

                    if (childCount === 0) {
                        level = level + 1;
                        childCount = childLen;
                        childLen = 0;
                    }
                }
                return layerStack;
            },
            _makeHtml: function (layerStack) {
                var i,
                    j,
                    iLen,
                    jLen,
                    nodeData,
                    childData,
                    ulTemp,
                    ulHtml,
                    childTempHtml,
                    childId,
                    childTempTempReg,
                    option = this.option,
                    itemHtml = '',
                    indentItem,
                    strucHtml = '';

                for (i = 0, iLen = layerStack.length; i < iLen; i++) {
                    nodeData = layerStack[i];
                    if (nodeData.childIdArr.length > 0) {
                        ulTemp = '<ul>_CHILD_TEMP_</ul>';
                        childTempHtml = '';

                        for (j = 0, jLen = nodeData.childIdArr.length; j < jLen; j++) {
                            childId = nodeData.childIdArr[j];
                            childData = this._findNodeById(childId);
                            childTempHtml = childTempHtml + '_TREE_' + String(childData.seq).toUpperCase() + '_';
                        }
                        ulHtml = ulTemp.replace(/_CHILD_TEMP_/g, childTempHtml);
                    } else {
                        //没有子节点是_CHILEREN_TEMP_是空字符串
                        ulHtml = '';
                    }

                    //FIXME:template不支持for循环，那我这里就取巧一下
                    indentItem = {};
                    for (var k = 0, kLen = nodeData.level; k < kLen - 1; k++) {
                        indentItem[k] = k;
                    }

                    itemHtml = artTemplate.compile(this.itemTemp)({
                        childHtml: ulHtml,
                        seq: nodeData.seq,
                        id: nodeData.id,
                        indentItem: indentItem,
                        isChild: nodeData.isChild,
                        text: nodeData.text,
                        onlyLeafCheck: option.onlyLeafCheck,
                        multiple: option.multiple
                    });

                    //如果不是第一个节点则需要替换父母节点的html
                    if (!this.parentMap[nodeData.id]) {
                        strucHtml = strucHtml + itemHtml;
                    } else {
                        childTempTempReg = new RegExp('_TREE_' + String(nodeData.seq).toUpperCase() + '_', 'g');
                        strucHtml = strucHtml.replace(childTempTempReg, itemHtml);
                    }
                }
                return strucHtml;
            },
            _isChildInResult: function (childIdArr, retMap) {
                var ret = false,
                    i,
                    iLen;

                for (i = 0, iLen = childIdArr.length; i < iLen; i++) {
                    if (retMap[childIdArr[i]]) {
                        ret = true;
                        break;
                    }
                }
                return ret;
            },
            //事件绑定（私有）
            _listen: function () {
                var $selector = this.$view,
                    option = this.option,
                    changeEvent,
                    This = this;

                $selector.off('awebtree').on({
                    'click.awebtree': function (e) {
                        var $target = $(e.target || window.event.srcElement);
                        if (!This.option.disabled && $target.closest('[data-span-id]').length) {
                            This[This.isShowed ? '_hidePanel' : '_showPanel']();
                        }
                    },
                    'focus.awebtree': function (e) {
                        var $target = $(e.target || window.event.srcElement);
                        if (!This.option.disabled && $target.is('input.textbox-text.validatebox-text')) {
                            This.$hiddenInput.trigger('focusin');
                            This._focusInput();
                        }
                        return false;
                    },
                    'blur.awebtree': function (e) {
                        var $target = $(e.target || window.event.srcElement);
                        if (!This.option.disabled && $target.is('input.textbox-text.validatebox-text')) {
                            This.$hiddenInput.trigger('focusout');
                            This._blurInput();
                        }
                        return false;
                    }
                });

                This.$panel.off('awebtree').on({
                    'click.awebtree': function (e) {
                        //处理点击面板事件
                        var $target = $(e.target || window.event.srcElement),
                            $nodeDiv = $target.closest('.tree-node'),
                            nodeData,
                            select,
                            $checkSpan,
                            nodeIndex;

                        if ($nodeDiv.length === 0) {
                            return;
                        }
                        //点击下拉图标
                        if ($target.is('.tree-hit')) {
                            if ($target.is('.tree-collapsed')) {
                                $target.addClass('tree-expanded').removeClass('tree-collapsed');
                                $nodeDiv.siblings('ul').css({
                                    display: 'block'
                                });
                            } else {
                                $target.addClass('tree-collapsed').removeClass('tree-expanded');
                                $nodeDiv.siblings('ul').css({
                                    display: 'none'
                                });
                            }
                            return;
                        }

                        nodeIndex = $nodeDiv.attr('id').replace(/_easyui_tree_/g, '');
                        nodeData = This.platData[nodeIndex - 1];
                        $checkSpan = $('.tree-checkbox', $nodeDiv);
                        //.tree-checkbox0  不选 .tree-checkbox1 选中  .tree-checkbox2  非全选
                        //如果是多选
                        if (option.multiple) {
                            //只是选叶子节点
                            if (option.onlyLeafCheck) {
                                if (nodeData.isChild) {
                                    This.checkMap[nodeData.id] = This.checkMap[nodeData.id] === 'check' ? 'nocheck' : 'check';
                                }
                            } else {
                                //进入此处的一定是多选且任意选，根据上一次是勾选还是反选决定此次点击非全选的操作是啥
                                select = true;
                                if ($checkSpan.is('.tree-checkbox0')) {
                                    select = true;
                                    This.lastSelected = true;
                                } else if ($checkSpan.is('.tree-checkbox1')) {
                                    select = false;
                                    This.lastSelected = false;
                                } else if (This.lastSelected) { //半勾选,但上次是选中状态
                                    select = true;
                                    This.lastSelected = true;
                                } else { //半勾选,但上次是取消选中状态
                                    select = false;
                                    This.lastSelected = false;
                                }
                                This._checkNode(nodeData.id, select)
                            }
                            This._updateSelectedData();
                            This._updateCheckDom();

                        } else { //如果是单选
                            This.selectedArr = [nodeData.id];
                            This._hidePanel();
                        }
                        //更新隐藏的input元素,在这个过程中会根据值触发change事件
                        This._updateSelectedDataDom();
                    }
                });

                //定义文本改变触发搜索事件,兼容IE8做的特殊处理
                if ($.browser.msie && parseInt($.browser.version, 10) < 10) {
                    This.$panel.on({
                        'keyup.awebtree': function (e) {
                            This._handleSearchEvent(e);
                        }
                    })
                } else {
                    This.$panel.on({
                        'input.awebtree': function (e) {
                            This._handleSearchEvent(e);
                        }
                    })
                }

                //点击操作去外区域，隐藏panel
                $(document).on('click.awebtree' + This.uuid, function (e) {
                    var id = This.attr.id,
                        $target = $(e.target || window.event.srcElement),
                        $inputWrap,
                        $panel;

                    $panel = $target.closest('[data-panel-id=' + This.uuid + ']');
                    $inputWrap = $target.closest('[data-span-id=' + id + ']');

                    if ($panel.length === 0 && $inputWrap.length === 0) {
                        This._hidePanel();
                    }
                });
                //监听滚轮事件,兼容火狐浏览器
                $(document).on('mousewheel.awebtree' + This.uuid + ' DOMMouseScroll.awebtree' + This.uuid, function (e) {
                    //根据滚动隐藏面板，避免造成错位
                    var $target = $(e.target || window.event.srcElement),
                        $panel = $target.closest('[data-panel-id=' + This.uuid + ']');
                    if (!$target.is(This.$input) && $panel.length === 0) {
                        This._hidePanel();
                    }
                });

                //窗口大小改变调整宽度
                $(window).on('resize.awebtree' + This.uuid, function () {
                    if (This.isShowed) {
                        This._showPanel();
                    }
                });
            },
            //处理搜索事件：
            _handleSearchEvent: function (e) {
                var $target = $(e.target || window.event.srcElement),
                    This = this,
                    keyWord,
                    retMap,
                    i,
                    iLen,
                    nodeData,
                    isChildInResult,
                    $nodeDiv,
                    domMap = This.domMap,
                    platData = This.platData;

                if (!This.option.disabled && $target.is('.tree-search input')) {
                    keyWord = $target.val();
                    retMap = This._search(keyWord);

                    for (i = 0, iLen = platData.length; i < iLen; i++) {
                        nodeData = platData[i];
                        $nodeDiv = $('#' + domMap[nodeData.id], This.$panel);

                        if (retMap[nodeData.id]) {
                            //如果查找到则显示出来
                            $nodeDiv.css({
                                'display': 'block'
                            });
                            //判断子节点是否在搜索结果里面,如果在搜索结果里面则siblings display:block,
                            isChildInResult = This._isChildInResult(nodeData.childIdArr, retMap);
                            $nodeDiv.siblings('ul')[isChildInResult ? 'show' : 'hide']();
                        } else {
                            $nodeDiv.css({
                                'display': 'none'
                            });
                            $nodeDiv.siblings('ul').hide();
                        }
                    }
                }
            },
            //将刷新后不再此次刷新数据中的原来被选择的项放入到selectedNotInArr数组中
            _selectedNotInArrFunc: function (dataArr) {
                var i,
                    iLen,
                    isInData;

                this.selectedNotInArr = [];
                this.selectedArr = [];
                for (i = 0, iLen = dataArr.length; i < iLen; i++) {
                    isInData = this._isInData(dataArr[i]);
                    if (!isInData) {
                        this.selectedNotInArr.push(dataArr[i]);
                    } else {
                        this.selectedArr.push(dataArr[i]);
                    }
                }
            },
            _isInData: function (id) {
                var isIn = false,
                    platData = this.platData,
                    i,
                    iLen;

                for (i = 0, iLen = platData.length; i < iLen; i++) {
                    if (String(platData[i].id) === String(id)) {
                        isIn = true;
                    }
                }
                return isIn;
            },
            _validateData: function (data) {
                var errorMsgTemp = '回显数据有误，数据(_VALUE_)不存在于原value值中',
                    errorMsgArr = [],
                    isInData,
                    i,
                    iLen,
                    j,
                    jLen;

                if (!$.isArray(data)) {
                    app.alert("请使用数组类型数据!", app.alert.ERROR, undefined);
                    return false;
                }

                for (i = 0, iLen = data.length; i < iLen; i++) {
                    isInData = this._isInData(data[i]);
                    if (!isInData) {
                        errorMsgArr.push({
                            errorMsg: errorMsgTemp.replace(/_VALUE_/g, data[i])
                        });
                    }
                }

                if (errorMsgArr.length) {
                    for (j = 0, jLen = errorMsgArr.length; j < jLen; j++) {
                        app.alert(errorMsgArr[j].errorMsg, app.alert.ERROR, undefined);
                    }
                    return false;
                }
                return true;
            },
            //更新选中数据的dom元素，包括输入框的值和隐藏的数据域
            _updateSelectedDataDom: function (isFresh) {
                var inputHtml = '',
                    inputTemp = '<input type="hidden" class="textbox-value" name="" value="_VALUE_">',
                    i,
                    iLen,
                    j,
                    jLen,
                    id,
                    nodeData,
                    isChange,
                    lastSelectArr = [],
                    textArr = [];

                //如果不是刷新操作则不需要触发change事件
                if (!isFresh) {
                    $('input[type=hidden].textbox-value', this.$inputWrap).each(function () {
                        var value = this.value;
                        lastSelectArr.push(value);
                    });
                    isChange = this._isDiffFunc(lastSelectArr, this.selectedArr.concat(this.selectedNotInArr));

                    if (isChange) {
                        this.$hiddenInput.trigger('change');
                    }
                }

                for (i = 0, iLen = this.selectedArr.length; i < iLen; i++) {
                    id = this.selectedArr[i];
                    nodeData = this._findNodeById(id);
                    inputHtml = inputHtml + inputTemp.replace(/_VALUE_/g, id);
                    textArr.push(nodeData.text);
                }

                //如果存在选中的项不在刷新的数据里面
                for (j = 0, jLen = this.selectedNotInArr.length; j < jLen; j++) {
                    id = this.selectedNotInArr[j];
                    inputHtml = inputHtml + inputTemp.replace(/_VALUE_/g, id);
                    textArr.push(id);
                }

                this.$input.val(textArr.join()).nextAll().remove();
                this.$input.after(inputHtml);
            },
            _updateCheckDom: function () {
                //单选模式不需要处理勾选框
                if (!this.option.multiple) {
                    return;
                }
                var id,
                    checkDom,
                    className,
                    checkClassMap = {
                        'check': 'tree-checkbox tree-checkbox1',
                        'nocheck': 'tree-checkbox tree-checkbox0',
                        'nocheckall': 'tree-checkbox tree-checkbox2',
                    };

                for (id in this.checkMap) {
                    if (this.checkMap.hasOwnProperty(id)) {
                        className = checkClassMap[this.checkMap[id]];
                        if (className) {
                            checkDom = $('#' + this.domMap[id] + ' .tree-checkbox', this.$panel)[0];
                            checkDom ? checkDom.className = className : '';
                        }
                    }
                }

            },
            _resetCheckMap: function () {
                var key;
                for (key in this.checkMap) {
                    if(this.checkMap.hasOwnProperty(key)){
                        this.checkMap[key] = 'nocheck';

                    }
                }
            },
            //组件需要兼容的接口
            getValues: function () {
                var option = this.option,
                    retArr = [];

                retArr = retArr.concat(this.selectedArr).concat(this.selectedNotInArr);

                if (option.multiple) {
                    return retArr;
                } else {
                    return retArr[0] ? retArr[0] : '';
                }
            },
            refresh: function (data) {
                var optionHtml;
                //测试数据
                if (data === 'auiAjaxTest' || !data) {
                    data = [{
                        id: "1",
                        text: "语言",
                        children: [{
                            id: "2",
                            text: "Java"
                        }, {
                            id: "3",
                            text: "c++"
                        }]
                    }, {
                        id: "4",
                        text: "其他"
                    }];
                }

                if (!$.isArray(data)) {
                    app.alert("请使用数组类型数据!", app.alert.ERROR, undefined);
                    return false;
                }
                this.data = data;
                //原来组件貌似是没有清空选中值的,似乎有一定的道理,这里暂时不清空。note
                this.platData = this._makePlatData(data);
                optionHtml = this._makeHtml(this.platData);
                this.$treeUl.empty().append(optionHtml);
                //有些数据是没有在当前刷新数据里面的
                this._selectedNotInArrFunc(this.selectedArr.concat(this.selectedNotInArr));
                this._setSelectValueByChangeFlag(this.selectedArr, true);
            },
            _setSelectValueByChangeFlag: function (data, isFresh) {
                var option = this.option,
                    i,
                    iLen,
                    j,
                    jLen;

                //在刷新状态触发的不需要进行校验
                if (isFresh || this._validateData(data)) {
                    this.selectedArr = [];
                    this._resetCheckMap();
                    if (data.length === 0) {
                        this._updateCheckDom();
                    } else {
                        if (option.multiple) {
                            if (option.onlyLeafCheck) {
                                this.selectedArr = data;
                                for (i = 0, iLen = data.length; i < iLen; i++) {
                                    this.checkMap[data[i]] = 'check';
                                }
                            } else {
                                for (j = 0, jLen = data.length; j < jLen; j++) {
                                    this._checkNode(data[j], true);
                                }
                            }
                            this._updateSelectedData();
                            this._updateCheckDom();
                            //单选
                        } else {
                            this.selectedArr = data.length > 0 ? [data[0]] : [];
                            this.selectedNotInArr = [];
                        }
                    }
                    this._updateSelectedDataDom(isFresh);
                }

            },
            setSelectValue: function (data) {
                this._setSelectValueByChangeFlag(data, false);
            },
            display: function (result, input1, input2, condition) {
                this[result ? 'hide' : 'show']();
            },
            resetValue: function () {
                this.selectedArr = [];
                this.selectedNotInArr = [];
                this._resetCheckMap();
                this._updateSelectedDataDom();
                this._updateCheckDom();
            },

            clearDate: function () {
                this.resetValue();
            },
            success: function ($input) {
                var $inputGroup = $('.input-group', $input),
                    $arrow = $('.form-error-arrow', $inputGroup),
                    $label = $('.form-error-msg', $inputGroup);

                $inputGroup.removeClass('form-error');
                $inputGroup.off('.error');
                $label.add($arrow).css("display", "none");
            },
            clean: function (e) {

                var $arrow = this.$arrow,
                    $inputGroup = this.$inputGroup,
                    $label = this.$label;

                $inputGroup.off('.error');
                $inputGroup.removeClass('form-error');
                $label.add($arrow).css("display", "none");

            },
            error: function ($input, errorMsg) {

                var $inputGroup = $('.input-group', $input),
                    $arrow = $('.form-error-arrow', $inputGroup),
                    $label = $('.form-error-msg', $inputGroup);

                $label.empty().append('<i class="fa fa-exclamation-circle"></i>' + errorMsg);

                $label.add($arrow).css("display", "block");
                $inputGroup.addClass('form-error');

                $inputGroup
                    .off('.error')
                    .on({
                        'mouseenter.error': function () {
                            $label.add($arrow).css("display", "block");
                        },
                        'mouseleave.error': function () {
                            $label.add($arrow).css("display", "none");
                        }
                    });

            },

            show: function () {
                this.$view.removeClass('hide');
                this.isInline ? this.$view.prev().removeClass('hide') : '';
            },
            hide: function () {
                this.$view.addClass('hide');
                this.isInline ? this.$view.prev().addClass('hide') : '';
            },
            destroy: function () {
                $(document).off('awebtree' + this.uuid);
                $(window).off('awebtree' + this.uuid);
                this.$panel.off().remove();
                this.$view.off().empty();
                this.isInline ? this.$view.prev().remove() : '';
            },
            disabled: function (disabled) {
                this.option.disabled = disabled;

                if (!disabled) {
                    this.$hiddenInput.removeAttr('disabled').attr('data-aweb-event', 'true');
                    this.$inputWrap.removeClass('textbox-disabled');
                    this.$inputWrap.find('a').removeClass('textbox-icon-disabled');
                    this.$input.removeClass('validatebox-disabled textbox-prompt').removeAttr('disabled');
                } else {
                    this.$hiddenInput.attr('disabled', 'disabled').removeAttr('data-aweb-event');
                    this.$inputWrap.addClass('textbox-disabled');
                    this.$inputWrap.find('a').addClass('textbox-icon-disabled');
                    this.$input.addClass('validatebox-disabled textbox-prompt').attr('disabled', 'disabled');
                    this.isShowed ? this._hidePanel() : '';
                }
            },
            focus: function (e) {
                var $selector = this.$view,
                    e = e || window.event;

                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
                this.isShowed = false;
                $('[data-span-id]', $selector).trigger('click');
            }
        };

        if (!widget.component.foundationForm) {
            widget.component.foundationForm = {};
        }

        widget.component.foundationForm.foundationTreeSelect = function ($selector,option,attr,css,auiCtx) {
            var
                formOption = auiCtx.configs[$selector.closest('[data-widget-type=aweb4FoundationFormCtn]').attr('id')];

            //运行时代码Start
            return new Component($selector, option, attr, css, auiCtx, formOption);
            //运行时代码End

        };
    });
})();