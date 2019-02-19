(function () {
    var hash = window.location.hash || document.location.hash,
        search = window.location.search || document.location.search || '',
        decoder = window.decodeURI || window.decodeURIComponent,
        matcher,
        i, length, params,
        result = {};

    if (hash && !search) {

        search = '?' + hash.split('?')[1];

    }
    matcher = search.match(/[\?\&][^\?\&]+=[^\?\&]+/g);
    if (matcher) {
        for (i = 0, length = matcher.length; i < length; i++) {
            params = (matcher[i] || '').substring(1).split('=');
            result[params[0]] = decoder(params[1]);
        }
    }

    return result;
})


