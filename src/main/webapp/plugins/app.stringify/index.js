(function (config) {
        function functionStringify(obj) {
            if (obj !== undefined && typeof (obj) === "object") {
                var newObj = (obj instanceof Array) ? [] : {},
                    i = 0;

                for (var name in obj) {
                    i++;
                    if (obj[name] instanceof Function) {
                        newObj[name] = '_parseFunction_' + obj[name].toString()
                            .replace(/(\/\/[^\n\r]+)/g, '') //将行注释都抹掉
                            .replace(/[\n\r\t]/g, '').replace(/(\s)+/g, ' ')
                            .replace(/\\([ntrs\-\_])/g, '\\\\$1')
                            .replace(/(?:\/{2,}.*?[\r\n])|(?:\/\*.*?\*\/)/g, '');
                        //.replace(/\+/g, '##plus##');
                    } else {
                        newObj[name] = obj[name] && functionStringify(obj[name]);
                    }
                }
                if (!i) {
                    newObj = obj;
                }
                return newObj;
            } else {
                return obj;
            }
        }

        return config ? JSON.stringify(functionStringify(config)) : '';
    })