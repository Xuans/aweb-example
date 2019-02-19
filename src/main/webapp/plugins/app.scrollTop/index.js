(function ($container, $content, speed, marginTop) {
        var cttOffset = $content.offset(),
            ctnOffset = $container.offset();
        if (ctnOffset && cttOffset) {
            marginTop = marginTop ? parseInt(marginTop) : 0;
            $container.animate({
                scrollTop: cttOffset.top + $container.scrollTop() - ctnOffset.top - marginTop
            }, speed || 200);
        }
    })