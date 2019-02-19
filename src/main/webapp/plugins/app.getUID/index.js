(function () {
    var sId = "",
        i = 24;
    for (; i--;) {
        sId += Math.floor(Math.random() * 16.0).toString(16).toUpperCase();
        if (i == 4) {
            sId += "-";
        }
    }
    return sId;
});

