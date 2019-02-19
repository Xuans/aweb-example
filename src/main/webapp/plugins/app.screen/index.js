(function () {
    var full = {},
        resizeHandlerList = {},
        globalResizeHandlerList = {},
        resizeTimeout;

    function resize() {
        window.clearTimeout(resizeTimeout);
        resizeTimeout = window.setTimeout(function () {
            var uid,
                _app = window.app || app;
            for (uid in globalResizeHandlerList) {
                if (globalResizeHandlerList[uid].timeout) {
                    window.setTimeout(globalResizeHandlerList[uid].callback, globalResizeHandlerList[uid].timeout);
                } else {
                    globalResizeHandlerList[uid].callback && globalResizeHandlerList[uid].callback();
                }
            }


            _app.router && _app.router.getCurrentHandler && (uid = _app.router.getCurrentHandler()) && (uid = uid.uid);

            if (uid && (uid = resizeHandlerList[uid])) {
                if (uid.timeout) {
                    window.setTimeout(uid.callback);
                } else {
                    uid.callback && uid.callback();
                }
            }
            uid = null;
        }, 100);
    }

    full.addResizeHandler = function (options) {

        if (options && options.uid && options.callback) {
            if (options.isGlobal) {
                globalResizeHandlerList[options.uid] = {
                    callback: options.callback,
                    timeout: options.timeout || 0
                };
            } else {
                resizeHandlerList[options.uid] = {
                    callback: options.callback,
                    timeout: options.timeout || 0
                };
            }
        }
    };
    full.removeResizeHandler = function (uid, isGlobal) {
        if (uid) {
            if (isGlobal) {
                globalResizeHandlerList[uid] = null;
                delete globalResizeHandlerList[uid];
            } else {
                resizeHandlerList[uid] = null;
                delete resizeHandlerList[uid];
            }
        }
    };
    full.triggerResizeHandler = function (uid, isGlobal) {
        if (uid) {
            if (isGlobal) {
                if (uid = globalResizeHandlerList[uid]) {
                    uid.callback && uid.callback();
                }
            } else if (uid = resizeHandlerList[uid]) {
                uid.callback && uid.callback();
            }
        }
    };

    $(window).resize(resize);


    return full;
})