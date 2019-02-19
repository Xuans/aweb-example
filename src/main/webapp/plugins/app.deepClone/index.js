(function (obj) {
        function _clone(obj) {
            var newObj;
            if (typeof obj === 'string') {
                //字符串
                newObj = '' + obj;
            } else if ($.isArray(obj)) {
                //数组
                newObj = $.map(obj, function (elem) {
                    return _clone(elem);
                });
            } else if (typeof obj === 'object') {
                //对象
                newObj = {};
                for (var name in obj) {
                    if (obj[name] instanceof Function) {
                        newObj[name] = obj[name];
                    } else {
                        newObj[name] = _clone(obj[name]);
                    }
                }
            } else {
                newObj = obj;
            }

            return newObj;
        }

        return _clone(obj);
    });




