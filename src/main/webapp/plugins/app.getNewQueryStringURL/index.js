(function (params) {
        var map = $.extend(this.getQueryStringMap(), params),
            encoder = window.encodeURI || window.encodeURIComponent,
            prop,
            ret = [];

        for (prop in map) {
            if (map.hasOwnProperty(prop)) {
                ret.push(prop + '=' + encoder(map[prop]));
            }
        }

        return ret.join('&');
    })

