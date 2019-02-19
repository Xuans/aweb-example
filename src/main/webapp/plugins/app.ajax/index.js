(function () {
        var _ajax = $.ajax;

        // $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
        // $.support.cors=true;

        $.ajax = window.auiApp ? function (option) {
            var validateResult,
                queryString = {},
                data = {},
                formData, i, item, items;

            option = $.extend(true, {
                type: "post",
                contentType: "application/x-www-form-urlencoded;charset=utf-8",
                dataType: "json",
                traditional: true,
                shelter: false,
                success: function () {
                },
                validate: true
            }, option);

            //get value and validate
            validateResult = app.validate(option.data, option.validateSuccessCallback, option.validateErrorCallback, option.validateCleanCallback, option.validateContinue, option.validate);


            option.data = validateResult.data;

            if ($.isArray(option.data)) {
                for (items = option.data, i = items.length; item = items[--i];) {
                    if (item.queryString) {
                        queryString[item.name] = item.value;
                    } else {
                        data[item.name] = item.value;
                    }
                }

                option.data = data;

                if (!$.isEmptyObject(queryString)) {
                    option.url += '?' + $.param(queryString);
                }
            }

            if (option.ajaxProcessData === false) {
                try {
                    data = option.data;
                    formData = new FormData();

                    for (i in data) {
                        if (data.hasOwnProperty(i)) {
                            formData.append(i, data[i]);
                        }
                    }

                    option.data = formData;
                    option.processData = false;
                    option.contentType = false;
                } catch (e) {
                    if (window.aweb.error) {
                        app.alert('系统错误 0x03：网络请求失败！', app.alert.ERROR, '0x03');
                    }
                    if (window.aweb.log) {
                        console.error(e);
                    }
                }

            } else if (option.contentType.indexOf('application/json') !== -1) {
                option.data = JSON.stringify(option.data);
            }


            //exec ajax

            if (validateResult.result) {
                console && console.log(validateResult.result);
            } else {
                console.table(validateResult.data);
            }

            if (option.ajaxNoBlobData === false) {
                app.alert('模拟下载文件…', app.alert.SUCCESS);
            } else {
                requestAnimationFrame(function () {
                    option.success({
                        status: true,
                        content: {
                            result: 'auiAjaxTest'
                        }
                    });

                    if ($.isFunction(option.complete)) {
                        option.complete({}, '', '', '');
                    }
                });
            }
        } : function (option) {
            var validateResult, url,
                _error, _success,

                queryString = {},
                urlExternal = [],
                urlDivider,

                data = {},
                formData,

                i, item, items,$input,k,
                html,

                $iframe, $form,

                ctoken, handler, server;


            if (!(option && (url = option.url) && !!~url.indexOf('##'))) {
                option = $.extend(true, {
                    type: "post",
                    contentType: "application/x-www-form-urlencoded;charset=utf-8",
                    dataType: "json",
                    traditional: true,
                    shelter: false,
                    urlDivider: '\/',
                    success: function () {
                    }
                }, option);

                urlDivider = option.urlDivider;

                //get value and validate
                validateResult = app.validate(option.data, option.validateSuccessCallback, option.validateErrorCallback, option.validateCleanCallback, option.validateContinue, option.validate);

                if (validateResult.result) {
                    option.data = validateResult.data;

                    //自定义属性
                    //shelter
                    option.timeout = $.isNumeric(option.timeout) ? option.timeout : 30000;
                    if (option.shelter !== false && option.shelter !== 'false') {
                        app.shelter.show(option.shelter === true ? null : option.shelter, option.timeout);
                    }

                    //process data
                    if ($.isArray(option.data)) {
                        for (items = option.data, i = items.length; item = items[--i];) {
                            if (item.queryString) {
                                queryString[item.name] = item.value;
                            } else if (item.urlExternal) {
                                urlExternal.push(item.value);
                            } else {
                                data[item.name] = item.value;
                            }
                        }
                        option.data = data;
                    }

                    //添加token
                    ctoken = app.getData('ctoken') || window.ctoken;
                    if (ctoken) {
                        option.data = (option.data || {});
                        option.data.ctoken = ctoken;
                    }

                    if (option.ajaxProcessData === false) {
                        try {
                            data = option.data;
                            formData = new FormData();

                            for (i in data) {
                                if (data.hasOwnProperty(i)) {
                                    formData.append(i, data[i]);
                                }
                            }

                            option.data = formData;
                            option.processData = false;
                            option.contentType = false;
                        } catch (e) {
                            if (window.aweb.error) {
                                app.alert('系统错误 0x03：请求数据格式有误！', '0x03');
                            }
                            if (window.aweb.log) {
                                console.error(e);
                            }
                        }
                    } else if (option.contentType.indexOf('application/json') !== -1) {
                        option.data = JSON.stringify(option.data);
                    }


                    //deal url
                    if (urlExternal.length) {
                        urlExternal = urlDivider + urlExternal.join(urlDivider);
                        if (url[url.length - 1] === '?') {
                            url[url.length - 1] = '\/';
                        }

                        url += urlExternal;
                    }

                    if (!$.isEmptyObject(queryString)) {
                        url += (url.indexOf('?') !== -1 ? '' : '?') + $.param(queryString);
                    }

                    if (!option.server) {
                        handler = app.router && app.router.getCurrentHandler();
                        server = handler && handler.server;

                        if (server) {
                            option.server = server;
                            option.url = server + url;
                        } else {
                            option.url = url;
                        }
                    } else {
                        option.url = url;
                    }

                    if (option.ajaxNoBlobData === false) {
                        if (option.ajaxProcessData !== false) {

                            var iframeName = app.getUID();

                            $iframe = $('<iframe src="about:blank" name="' + iframeName + '" style="display: none"/>');
                            $form = $('<form/>');
                            html = [];
                            data = option.data;

                            $form.attr({
                                method: option.type,
                                action: option.url,
                                target: iframeName
                            });

                            for (i in data) {
                                if (data.hasOwnProperty(i)) {
                                    if ($.isArray(data[i])) {
                                        for (items = data[i], k = items.length; item = items[--k];) {
                                            $input = $('<input name="'+i+'"/>');
                                            $input.val(item);

                                            $form.append($input);
                                        }
                                    } else {
                                        $input = $('<input name="'+i+'"/>');
                                        $input.val(data[i]);

                                        $form.append($input);
                                    }
                                }
                            }

                            $input=null;


                            $iframe.appendTo('body');
                            $form.appendTo($iframe);

                            $form.submit();


                            $iframe.on('load', function (e) {
                                var response;

                                try {
                                    response = e.currentTarget.contentWindow.document.body.innerText;

                                    response = JSON.parse(response);
                                } catch (e) {
                                    response = {
                                        status: false,
                                        errorMsg: e.message,
                                        content: null
                                    };
                                }

                                option.success(response);

                                $iframe && $iframe.remove();
                                option.shelter && app.shelter.hide();
                            });


                        } else {
                            app.alert('系统错误 0x09：不能同时使用传输返回数据文件流！', app.alert.ERROR, '0x09');

                            option.shelter && app.shelter.hide();
                        }

                    } else {

                        //success and error
                        //_complete = option.complete;
                        _error = option.error;
                        _success = option.success;

                        option.success = function (response) {
                            if (option.shelter !== false && option.shelter !== 'false') {
                                app.shelter.hide();
                            }

                            if (response) {
                                if (response.status) {
                                    _success(response);
                                } else {
                                    switch (response.errorCode) {
                                        case '100001':
                                            app.modal({
                                                title: '提示框',
                                                content: "会话超时，请重新登录",
                                                isLargeModal: false,
                                                confirmHandler: function () {
                                                    window.location.reload();
                                                },
                                                cancelHandler: function () {
                                                    window.location.reload();
                                                }
                                            });
                                            break;
                                        case '100002':
                                            app.alert('系统错误 0x06：' + response.errorMsg || '字段校验失败！', app.alert.ERROR, '0x06');

                                            if (aweb && aweb.error) {
                                                console.log(response.errorMsg);
                                            }
                                            break;
                                        default:
                                            _success(response);
                                    }
                                }
                            } else {
                                app.alert('系统错误 0x08：后台服务报错！', app.alert.ERROR, '0x08');
                            }
                        };
                        option.error = function (XMLHttpRequest, textStatus, errorThrown) {
                            var oErr;

                            if (option.shelter !== false && option.shelter !== 'false') {
                                app.shelter.hide();
                            }

                            if (option.ajaxNoBlobData !== false && !option.preventError) {
                                oErr = XMLHttpRequest.response || XMLHttpRequest.responseText;
                                try {
                                    oErr = eval('(' + oErr + ')');
                                } catch (e) {
                                    oErr = {
                                        errorMsg: e.message
                                    }
                                } finally {
                                    app.alert('系统错误 0x08：后台服务报错！', app.alert.ERROR, '0x08');
                                    _error && _error(XMLHttpRequest, textStatus, errorThrown);

                                    console.error(oErr);
                                }
                            }
                        };

                        return _ajax(option);
                    }
                }
            }
        };


        return $.ajax;
    })