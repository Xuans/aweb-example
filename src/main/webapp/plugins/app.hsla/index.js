(function () {
    var css = function (opt, random) {
        var $elem = $('<div>'),
            targetCSS = 'background-color',
            css;

        opt = $.extend(opt, this.defaltOptions);

        $elem.css(targetCSS, 'hsl(' + [(random ? Math.floor(Math.random() * 361) : opt.h), opt.s, opt.l].join(',') + ')');

        try {
            css = $elem.css(targetCSS).toString();
        } catch (e) {
            //IE8不支持hsla,让它不报错
        }

        if (jQuery.support.opacity) {
            return css.replace('rgb', 'rgba').replace(')', ',' + opt.a + ')');
        }
        return css;
    };
    css._default = {
        h: Math.floor(Math.random() * 361),
        s: '50%',
        l: '50%',
        a: 1
    };

    return css;
});
