(function () {
                    var setting = {
                        TYPE: {
                            /*必需*/
                            require: /^[^$]{1,}$/,
                            /* 整数 */
                            integer: /^-?\d+$/,
                            /* 浮点数 */
                            float: /^(?:-?\d+\.)(?:\d+)?$/,
                            /* 全数字 */
                            number: /^\d+?$/,
                            /* 全字母 */
                            letter: /^[a-zA-Z]+$/,
                            /* 全大写字母 */
                            uppercaseLetter: /^[A-Z]+$/,
                            /* 全小写字母 */
                            lowercaseLetter: /^[a-z]+$/,
                            /* 字母数字下划线，且由字母开头 */
                            account: /^[a-zA-Z]+(?:[a-zA-Z0-9_]+)?$/,
                            /*不能是全数字*/
                            id: /^(?!\d+$)[\da-zA-Z]*$/,
                            /* 邮箱格式 */
                            email: /^(?:[\w-]+(?:\.[\w-]+)*)@[\w-]+(?:\.[\w-]+)+$/,
                            /* 邮编格式 */
                            zipCode: /^[1-9]\d{5}$/,
                            /* 手机格式 */
                            mobile: /^(?:(?:\(?:\d{2,3}\))|(?:\d{3}\-))?1\d{10}$/,
                            /* 端口格式 */
                            port: /^(?:[0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
                            /* 主机格式*/
                            host: /^(?:(?:(?:2(?:5[0-5]|[0-4][0-9]))|(?:1[0-9]{2})|(?:[1-9][0-9])|[0-9])\.){3}(?:(?:2(?:5[0-5]|[0-4][0-9]))|(?:1[0-9]{2})|(?:[1-9][0-9])|[0-9])$/
                        },
                        MESSAGE: {
                            require: '请输入内容',
                            integer: '请输入整型',
                            float: '请输入浮点数',
                            number: '请输入数字',
                            letter: '请输入字母',
                            uppercaseLetter: '请输入大写字母',
                            lowercaseLetter: '请输入小写字母',
                            account: '请输入正确的账号格式',
                            email: '请输入正确的邮件格式',
                            zipCode: '请输入正确的邮编',
                            mobile: '请输入正确的手机格式',
                            port: '请输入正确的端口格式',
                            host: '请输入正确的主机格式',
                            _default: '请输入正确格式'
                        },
                        SUCCESS_CALLBACK: function ($elem) {
                        },
                        ERROR_CALLBACK: function ($elem, msg) {

                            app.alert(msg, app.alert.ERROR);
                        },
                        CLEAN_CALLBACK: function (focusEvent) {
                        }
                    };
                    var _type = setting.TYPE,
                        _message = setting.MESSAGE,
                        _success = setting.SUCCESS_CALLBACK,
                        _error = setting.ERROR_CALLBACK,
                        _clean = setting.CLEAN_CALLBACK;

                    var validate = function (data, success, error, clean, isContinue, isValidate) {
                        var list = [],
                            result = true,
                            singleResult,
                            i, item,
                            info, $elem, value, exp, msg,
	                        successCallback,errorCallback,cleanCallback;

                        success = $.isFunction(success) ? success : _success;
                        error = $.isFunction(error) ? error : _error;
                        clean = $.isFunction(clean) ? clean : _clean;

                        if ($.isFunction(data)) {
                            data = data();
                        }

                        if ($.isArray(data)) {
                            for (i = -1;
                                 (item = data[++i]);) {
                                singleResult = true;
                                info = item.validate || {};
                                msg = info.errorMsg;

                                //get Element
	                            $elem = $(info.id?info.id:('#'+info.widgetID + ' :input'), info.context);

	                            //get value
                                value = item.value !== undefined ? item.value : ($elem.length ? $elem.val() : '');

                                //array handler
                                if($.isArray(value)){
                                    if(!value.length){
                                        value='';
                                    }else{
                                        value=JSON.stringify(value);
                                    }
                                }

                                if (isValidate) {
                                    //校验信息
                                    try {
                                        if (info.require === 'true' && (value === undefined || value === ''||value===null)) {
                                            singleResult = false;
                                            msg = item.desp + '必填';
                                        } else  { //require===true or default
                                            if (value){
                                                if (info.maxLength) {
                                                    if ((info.hasChineseCharacter === 'true' && value.replace(/[^\x00-\xff]/g, '**').length > parseInt(info.maxLength, 10)) ||
                                                        (value.length > parseInt(info.maxLength, 10))) {
                                                        singleResult = false;
                                                        msg = item.desp + '的最大长度不能大于' + info.maxLength;
                                                    }
                                                }

                                                if (singleResult && info.minLength) {
                                                    if ((info.hasChineseCharacter === 'true' && value.replace(/[^\x00-\xff]/g, '**').length < parseInt(info.minLength, 10)) ||
                                                        (value.length < parseInt(info.minLength, 10))) {
                                                        singleResult = false;
                                                        msg = item.desp + '的最小长度不能小于' + info.minLength;
                                                    }
                                                }
                                            }


                                            if (singleResult) {
                                                /*
                                         *   version 4.3
                                         *   desp    自定义校验功能
                                         *   author  lijiancheng@agree.com.cn
                                         * */
                                                if ($.isFunction(info.validateHandler)) {
                                                    singleResult = info.validateHandler(value);

                                                    if ($.isPlainObject(singleResult)) {
                                                        msg = singleResult.errorMsg;
                                                        value = singleResult.value;
                                                        singleResult = singleResult.result;
                                                    } else {
                                                        singleResult = true;
                                                    }

                                                } else if (info.regex) {
                                                    exp = _type[info.regex] || new RegExp(info.regex.replace(/\\\\/g, '\\'));

                                                    singleResult = $.isFunction(exp) ? exp(value) : exp.test(value);

                                                    msg = msg ? msg : _message[info.regex];
                                                }
                                            }
                                        }
                                    } catch (e) {
                                        msg = e.message;

                                        singleResult = false;
                                    }
                                }

	                            successCallback=info.successCallback||success;
	                            errorCallback=info.errorCallback||error;
	                            cleanCallback=info.cleanCallback||clean;

	                            if($.isArray(item.value)){
		                            value=item.value;
	                            }

                                if (singleResult) {
                                    list.push({
                                        name: item.name,
                                        value: value,
                                        queryString: item.queryString,
                                        urlExternal: item.urlExternal
                                    });

                                    successCallback($elem);

                                } else {
                                    msg=$AW.nsl(msg,info.widgetID,info.pageContext);

                                    list.push({
                                        name: item.name,
                                        value: value,
                                        queryString: item.queryString,
                                        urlExternal: item.urlExternal,
                                        errorMsg: msg
                                    });

	                                errorCallback($elem, msg);
	                                $elem.one('focus.validate', cleanCallback);

                                    result = result && singleResult;

                                    if (!isContinue) break;
                                }
                            }
                        } else {
                            list = data;
                        }

                        return {
                            data: list,
                            result: result
                        }
                    };

                    $.extend(validate, setting);

                    return validate;
                })