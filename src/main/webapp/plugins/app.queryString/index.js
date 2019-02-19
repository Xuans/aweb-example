(function (key) {

        var
            hash = window.location.hash || document.location.hash,
            search = window.location.search || document.location.search || '',
            decoder = window.decodeURI || window.decodeURIComponent,
            rKey = new RegExp('\\b' + key + '=([^$&]+)'),
            value;

        if (hash && !search) {
            search = hash.split('?')[1]
        }


        value = search.match(rKey);
        value = value && value[1];

        return value ? decoder(value) : '';
    })