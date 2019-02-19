(function (name, value, toCookie, expireDays) {
        function setCookie(name, value, expireDays) {
            var temp = '_name_=_value_;path=' + document.location.hostname + ';expires=_expireDays_;max-age=_maxAge_',
                expireDate = new Date();

            expireDays = expireDays ? expireDays : 100;
            expireDate.setDate(expireDate.getDate() + expireDays);
            document.cookie = temp.replace(/_name_/, name).replace(/_value_/, value).replace(/_expireDays_/, expireDate.toUTCString()).replace(/_maxAge__/, 3600 * 24 * expireDays);

            return document.cookie; //判断是否禁用cookie
        }

        var encoder = window.encodeURI || window.encodeURIComponent || window.escape,
            result = true;

        if (value || !~expireDays) {
            if (typeof value !== 'string') {
                value = app.stringify(value);
            }
            value = encoder(value);

            if (toCookie) {
                result = !!setCookie(name, value, expireDays);
            } else {
                try {
                    window.localStorage.setItem(name, value);
                } catch (e) { //如果禁用localStorage将会抛出异常
                    result = !!setCookie(name, value, expireDays);
                }
            }
        } else {
            result = false;
        }

        return result;
    })