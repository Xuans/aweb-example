(function (name, fromCookie) {
    var result = true;

    if (fromCookie) {
        result = app.setData(name, '', true, -1);
    } else {
        try {
            window.localStorage.removeItem(name);
        } catch (e) {
            result = app.setData(name, '', true, -1);
        }
    }
    return result;
})