(function (event, $container, $content, fixTop, fixLeft) {
    return {
        top: Math.max((($container.height() > $content.height() + event.clientY) ? event.clientY : (event.clientY - $content.height())) - (fixTop || 0), 0),
        left: Math.max((($container.width() > $content.width() + event.clientX) ? event.clientX : (event.clientX - $content.width())) - (fixLeft || 0), 0)
    };
})


