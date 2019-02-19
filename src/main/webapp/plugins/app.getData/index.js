(function (name, fromCookie) {
    function getCookie(name) {
        var value = document.cookie.match(new RegExp(name + '=([^;]+)'));

        return value && value.length ? value[1] : '';
    }

    var value,
        decoder = window.decodeURI || window.decodeURIComponent || window.unescape;

    if (fromCookie) {
        value = getCookie(name);
    } else {
        try {
            value = window.localStorage.getItem(name);

            if (!value) value = getCookie(name); //如果是保存在Cookie那里
        } catch (e) { //如果禁用localStorage将会抛出异常
            value = getCookie(name);
        }
    }
    return decoder(value);
})

