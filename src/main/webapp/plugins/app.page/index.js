(function(){

                    var actions = {
                        refresh: function () {
                            var _router,
                                _handler;

                            if (_router = app.router) {
                                if (_router.getCurrentHandler && (_handler = _router.getCurrentHandler())) {
                                    _handler.stepTo(0);
                                }
                            }
                        },
                        close: function () {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.close) {
                                _tab.close();
                            }
                        },
                        closeAll: function (tips) {
                            var _router,
                                _tab,
                                _stack,
                                i, domID;


                            tips && app.shelter.show(tips);

                            if ((_router = app.router) && (_tab = _router.tab) && (_stack = _tab.stack) && _stack.length) {

                                try {
                                    for (i = -1; domID = _stack[++i];) {
                                        try {
                                            _tab.close(domID, true);
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }
                                } catch (e) {
                                    console.error(e);
                                } finally {
                                    _tab.stack = [];
                                    _router.cache = {};
                                }

                            }

                            tips && app.shelter.hide();
                        },
                        updateCurrentInterval: function (uniqueId, option) {
                            var _router,
                                _handler;

                            if (_router = app.router) {
                                if (_router.getCurrentHandler && (_handler = _router.getCurrentHandler())) {
                                    _handler.updateInterval(uniqueId, option);
                                }
                            }
                        },

                        fullscreen: function (fullscreen) {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.fullscreen) {
                                _tab.fullscreen(fullscreen);
                            }
                        },
                        isFullScreen: function () {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.isFullScreen) {
                                return _tab.isFullScreen();
                            }
                        },
                        displayNav: function (show) {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.displayNav) {
                                _tab.displayNav(show);
                            }
                        },
                        isDisplayNav: function () {
                            var _router,
                                _tab;

                            if ((_router = app.router) && (_tab = _router.tab) && _tab.isDisplayNav) {
                                return _tab.isDisplayNav();
                            }
                        }
                    };

                    return actions;

                })