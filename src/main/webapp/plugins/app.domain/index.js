(function () {
    var domain = {
        /**
         * [session 初始化session存储字段]
         * @type {Object}
         */
        session: {},

        /**
         * [scope 页面间数据交互存储域]
         * @type {Object}
         */
        scope: {},

        /**
         * [exports 导出数据到全局共享域]
         * @param  {[type]} namespace        [命名空间]
         * @param  {[type]} data        [字段json]
         */
        exports: function (namespace, data) {
            var cache;

            if (aweb.debug) {
                var handler = app.router && app.router.getCurrentHandler();

                if (data && handler) {
                    console.log(['页面模型：', handler.path, ' 设置跨页缓存，命名空间为:', namespace, '，数据为'].join(''));
                    console.log(data);
                }
            }

            domain.clearScope(namespace);

            if (!domain.scope[namespace]) {
                domain.scope[namespace] = {};
            }
            cache = domain.scope[namespace];

            if (data) {
                for (var name in data) {
                    //清除缓存数据时，可能清除原先数据的bug
                    if (typeof data[name] === 'string') {
                        //字符串
                        cache[name] = '' + data[name];
                    } else if ($.isArray(data[name])) {
                        //数组
                        cache[name] = [].concat(data[name]);
                    } else if (typeof data[name] === 'object') {
                        //对象
                        if (data[name] === null) {
                            cache[name] = null;
                        } else {
                            cache[name] = $.extend(true, {}, data[name]);
                        }
                    } else {
                        //函数
                        cache[name] = data[name];
                    }
                }
            }
        },

        /**
         * [clearScope 根据id清除全局共享域中的数据]
         * @param  {[type]} namespace [命名空间]
         */
        clearScope: function (namespace) {
            if (domain.scope[namespace]) {

                if (aweb.debug) {
                    var handler = app.router && app.router.getCurrentHandler();

                    if (handler) {
                        console.log(['页面模型：', handler.path, ' 清除跨页缓存，命名空间为:', namespace].join(''));
                    }
                }

                delete domain.scope[namespace];
            }
        },

        /**
         * [get 获取共享域中数据]
         * @param  {[type]} namespace  [命名空间]
         * @param  {[type]} name       [字段名]
         */
        get: function (namespace, name) {
            var cache;

            if (domain.scope[namespace]) {
                cache = (name === undefined ? domain.scope[namespace] : domain.scope[namespace][name]);

                if (aweb.debug) {
                    var handler = app.router && app.router.getCurrentHandler();

                    if (handler) {
                        console.log(['页面模型：', handler.path, ' 获取跨页缓存，命名空间为:', namespace, '，数据为'].join(''));
                        console.log(cache);
                    }
                }

                return cache;
            }
        }
    };

    return domain;
});

