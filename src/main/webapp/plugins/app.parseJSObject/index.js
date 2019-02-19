(function (JSONString) {
        function parseFunc(obj) {
            for (var name in obj) {
                if (typeof (obj[name]) === 'string') {
                    if (obj[name].indexOf('_parseObject_') === 0) {
                        obj[name] = JSON.parse(obj[name].replace(/_parseObject_/, ''));
                    } else if (obj[name].indexOf('_parseFunction_') === 0) {
                        obj[name] = eval('(' + obj[name].replace(/_parseFunction_/, '') /*.replace(/##plus##/g, '+')*/ + ')');
                    }
                } else if (typeof (obj[name]) === 'object') {
                    obj[name] = parseFunc(obj[name]);
                }
            }
            return obj;
        }

        return JSONString ? parseFunc(JSON.parse(JSONString)) : null;
    });

