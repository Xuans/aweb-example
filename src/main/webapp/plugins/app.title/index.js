(function (title) {
        var doc = window.top && window.top.document || document;

        if (typeof title === 'string') {
            doc.title = title;
        }

        return doc.title;
    })

